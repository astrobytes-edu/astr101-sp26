# Brand as Single Source of Truth — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make `_brand.yml` the canonical source for all colors/typography, generate SCSS tokens from it, eliminate manual sync burden.

**Architecture:** Python script reads `_brand.yml`, generates `_tokens.generated.scss` with all color variables plus pre-computed rgba values. SCSS theme imports generated file instead of manual tokens. Generator runs as pre-commit hook or Makefile target.

**Tech Stack:** Python 3.9+, PyYAML, SCSS

---

## Task 1: Add Missing Colors to `_brand.yml`

The current `_brand.yml` is missing some colors from `_tokens.scss`. Add them first so the generated SCSS is complete.

**Files:**
- Modify: `_brand.yml:33-43`

**Step 1: Add missing palette entries**

Add `mauve` and `slate` colors (present in `_tokens.scss` but missing from `_brand.yml`):

```yaml
    # Semantic Accents (add after purple-dark line 43)
    mauve-light: "#7d6b85"
    mauve-dark: "#b89ac0"
    slate-light: "#5c6470"
    slate-dark: "#8892a2"
```

**Step 2: Verify YAML is valid**

Run: `python3 -c "import yaml; yaml.safe_load(open('_brand.yml'))"`
Expected: No output (success)

**Step 3: Commit**

```bash
git add _brand.yml
git commit -m "feat(brand): add mauve and slate colors to palette"
```

---

## Task 2: Create the Generator Script

**Files:**
- Create: `scripts/brand-to-scss.py`

**Step 1: Create scripts directory**

```bash
mkdir -p scripts
```

**Step 2: Write the generator script**

```python
#!/usr/bin/env python3
"""
Generate SCSS tokens from _brand.yml

Usage: python scripts/brand-to-scss.py
Output: assets/theme/_tokens.generated.scss

This script reads _brand.yml and generates SCSS variables including:
- All palette colors as $color-name variables
- Semantic role aliases
- Typography variables
- Pre-computed rgba values for common transparencies
"""

import yaml
import re
from pathlib import Path
from datetime import datetime

PROJECT_ROOT = Path(__file__).parent.parent
BRAND_FILE = PROJECT_ROOT / "_brand.yml"
OUTPUT_FILE = PROJECT_ROOT / "assets/theme/_tokens.generated.scss"

# Pre-computed alpha values needed by the slide theme
ALPHA_VARIANTS = {
    "gold-light": [0.15],      # $bg-highlight
    "text-light": [0.05],      # $bg-muted
    "indigo-light": [0.10],    # $bg-primary
    "teal-light": [0.10, 0.25, 0.50],  # $bg-accent, link underlines
    "teal-dark": [0.50],       # link hover
    "rose-light": [0.35],      # focus ring
}

def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert #rrggbb to (r, g, b) tuple."""
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def generate_scss(brand: dict) -> str:
    """Generate SCSS content from brand config."""
    lines = [
        "// =============================================================================",
        "// GENERATED FILE — DO NOT EDIT MANUALLY",
        "// =============================================================================",
        f"// Generated from _brand.yml on {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        "// To regenerate: python scripts/brand-to-scss.py",
        "//",
        "// Semantic roles:",
        "// - Teal = interactive (links, actions)",
        "// - Indigo = structure (headings, organization)",
        "// - Gold = rare emphasis (use sparingly)",
        "// - Rose = pitfalls (warnings, errors)",
        "// - Purple = frontier/mystery (code, special)",
        "",
        '@use "sass:color";',
        "",
    ]

    palette = brand.get("color", {}).get("palette", {})

    # --- Palette Colors ---
    lines.append("// ---- Palette Colors ----")
    for name, value in palette.items():
        scss_name = name.replace("-", "-")  # keep as-is
        lines.append(f"${scss_name}: {value};")
    lines.append("")

    # --- Pre-computed Alpha Variants ---
    lines.append("// ---- Pre-computed Alpha Variants ----")
    lines.append("// Use these instead of rgba() in SCSS for brand colors")
    for color_name, alphas in ALPHA_VARIANTS.items():
        if color_name in palette:
            r, g, b = hex_to_rgb(palette[color_name])
            for alpha in alphas:
                alpha_pct = int(alpha * 100)
                var_name = f"${color_name}-a{alpha_pct}"
                lines.append(f"{var_name}: rgba({r}, {g}, {b}, {alpha});")
    lines.append("")

    # --- Typography ---
    typography = brand.get("typography", {})
    lines.append("// ---- Typography ----")

    base_family = typography.get("base", {}).get("family", "Inter")
    mono_family = typography.get("monospace", {}).get("family", "JetBrains Mono")

    # Build font stacks
    lines.append(f'$font-sans: "{base_family}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;')
    lines.append(f'$font-mono: "{mono_family}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;')
    lines.append("")

    # --- Semantic Aliases (Slide Context - Light Mode) ---
    lines.append("// ---- Semantic Aliases (Slide Context) ----")
    lines.append("// Slides use light-mode tokens (projectors are bright)")
    lines.append("")

    lines.append("// Structure colors")
    lines.append("$heading-color: $indigo-light !default;")
    lines.append("$structure-color: $indigo-light !default;")
    lines.append("")

    lines.append("// Interactive colors")
    lines.append("$interactive-color: $teal-light !default;")
    lines.append("$link-color: $teal-light !default;")
    lines.append("$link-hover-color: $teal-dark !default;")
    lines.append("")

    lines.append("// Emphasis colors")
    lines.append("$accent-color: $teal-light !default;")
    lines.append("$emphasis-color: $gold-light !default;")
    lines.append("$highlight-color: $gold-light !default;")
    lines.append("")

    lines.append("// Warning/pitfall colors")
    lines.append("$warning-color: $rose-light !default;")
    lines.append("")

    lines.append("// Code colors")
    lines.append("$code-color: $purple-light !default;")
    lines.append("")

    # --- Neutrals ---
    lines.append("// ---- Neutrals ----")
    lines.append("$body-bg: $surface-light !default;")
    lines.append("$body-color: $text-light !default;")
    lines.append("$muted-color: $muted-light !default;")
    lines.append("$border-color: $border-light !default;")
    lines.append("$surface-color: $surface-2-light !default;")
    lines.append("")

    # --- Derived Background Colors ---
    lines.append("// ---- Derived Background Colors ----")
    lines.append("$bg-highlight: $gold-light-a15;")
    lines.append("$bg-muted: $text-light-a5;")
    lines.append("")

    # --- Spacing / Radius ---
    lines.append("// ---- Spacing / Radius ----")
    lines.append("$radius-sm: 6px;")
    lines.append("$radius-md: 10px;")
    lines.append("")

    # --- Typography Sizes ---
    base_size = typography.get("base", {}).get("size", "1.15rem")
    lines.append("// ---- Typography Sizes ----")
    lines.append(f"$font-size-base: {base_size};")
    lines.append("$callout-font-size: 1.15rem;")
    lines.append("$callout-hero-header-size: 1.4rem;")
    lines.append("$callout-icon-size: 1.3em;")
    lines.append("$callout-label-size: 1.2em;")
    lines.append("")

    # --- Focus Ring ---
    lines.append("// ---- Focus Ring ----")
    lines.append("$focus-ring-width: 2px;")
    lines.append("$focus-ring-color: $rose-light-a35;")
    lines.append("")

    # --- Backward Compatibility Aliases ---
    lines.append("// ---- Backward Compatibility (Astronomy Aliases) ----")
    lines.append("// Preserved for existing slide content. Use semantic names for new content.")
    lines.append("$cosmic-blue: $heading-color;")
    lines.append("$stellar-blue: $link-color;")
    lines.append("$aurora-teal: $accent-color;")
    lines.append("$solar-gold: $highlight-color;")
    lines.append("$nova-orange: $warning-color;")
    lines.append("$nebula-purple: $code-color;")
    lines.append("")

    return "\n".join(lines)


def main():
    """Main entry point."""
    if not BRAND_FILE.exists():
        print(f"Error: {BRAND_FILE} not found")
        return 1

    with open(BRAND_FILE) as f:
        brand = yaml.safe_load(f)

    scss_content = generate_scss(brand)

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        f.write(scss_content)

    print(f"Generated: {OUTPUT_FILE}")
    return 0


if __name__ == "__main__":
    exit(main())
```

**Step 3: Make script executable**

```bash
chmod +x scripts/brand-to-scss.py
```

**Step 4: Run the generator**

Run: `python scripts/brand-to-scss.py`
Expected: `Generated: assets/theme/_tokens.generated.scss`

**Step 5: Verify generated output**

Run: `head -50 assets/theme/_tokens.generated.scss`
Expected: See generated SCSS with palette colors and alpha variants

**Step 6: Commit**

```bash
git add scripts/brand-to-scss.py assets/theme/_tokens.generated.scss
git commit -m "feat(theme): add brand-to-scss generator"
```

---

## Task 3: Update Slide Theme to Use Generated Tokens

**Files:**
- Modify: `assets/theme/slides/_variables.scss:1-8`
- Modify: `assets/theme/slides/_base.scss:13-18`
- Modify: `assets/theme/slides/_colors.scss:51,57`

**Step 1: Update _variables.scss imports**

Replace lines 1-8:

```scss
// =============================================================================
// VARIABLES - Typography scale, spacing, RevealJS-specific settings
// =============================================================================
// Colors imported from generated tokens (DO NOT define colors here)

@forward '../tokens.generated';     // Re-export generated tokens for downstream
@use '../tokens.generated' as *;    // Also use them locally in this file
```

**Step 2: Update _base.scss to use pre-computed alpha**

Replace lines 11-18:

```scss
// Links more readable in slides
.reveal a {
  text-decoration: none;
  border-bottom: 2px solid $teal-light-a25;
}

.reveal a:hover {
  border-bottom-color: $teal-dark-a50;
}
```

**Step 3: Update _colors.scss background utilities**

Replace lines 50-60:

```scss
.reveal .bg-primary {
  background-color: $indigo-light-a10 !important;
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
}

.reveal .bg-accent {
  background-color: $teal-light-a10 !important;
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
}
```

**Step 4: Verify SCSS compiles**

Run: `quarto render modules/module-01/slides/lecture-02-foundations.qmd 2>&1 | head -10`
Expected: Successful render

**Step 5: Commit**

```bash
git add assets/theme/slides/_variables.scss assets/theme/slides/_base.scss assets/theme/slides/_colors.scss
git commit -m "refactor(theme): use generated tokens in slide SCSS"
```

---

## Task 4: Delete Obsolete Token Files

**Files:**
- Delete: `assets/theme/_tokens.scss`
- Delete: `assets/theme/slides/_tokens-bridge.scss`

**Step 1: Verify no other files import the old tokens**

Run: `grep -r "_tokens'" assets/theme/ --include="*.scss" | grep -v generated`
Expected: No matches (all references should be to generated file now)

Run: `grep -r "tokens-bridge" assets/theme/ --include="*.scss"`
Expected: No matches

**Step 2: Delete obsolete files**

```bash
rm assets/theme/_tokens.scss
rm assets/theme/slides/_tokens-bridge.scss
```

**Step 3: Verify build still works**

Run: `quarto render modules/module-01/slides/lecture-02-foundations.qmd`
Expected: Successful render

**Step 4: Commit**

```bash
git add -A
git commit -m "refactor(theme): remove obsolete manual token files"
```

---

## Task 5: Update `_brand.yml` Header

**Files:**
- Modify: `_brand.yml:1-10`

**Step 1: Update header to reflect new role**

Replace lines 1-10:

```yaml
# _brand.yml
# Quarto Brand System — SINGLE SOURCE OF TRUTH for all colors and typography
#
# Usage:
# - Quarto automatically applies to html, dashboard, revealjs, typst
# - SCSS tokens generated via: python scripts/brand-to-scss.py
# - RevealJS uses light mode by default (projectors are bright)
#
# To update colors:
# 1. Edit this file
# 2. Run: python scripts/brand-to-scss.py
# 3. Commit both files
```

**Step 2: Commit**

```bash
git add _brand.yml
git commit -m "docs(brand): update header to reflect single-source-of-truth role"
```

---

## Task 6: Add Makefile Target (Optional but Recommended)

**Files:**
- Modify or Create: `Makefile`

**Step 1: Check if Makefile exists**

Run: `test -f Makefile && echo "exists" || echo "create"`

**Step 2: Add tokens target**

If Makefile exists, add:
```makefile
# Generate SCSS tokens from brand
tokens:
	python scripts/brand-to-scss.py

# Regenerate tokens before render
render: tokens
	quarto render
```

If creating new Makefile:
```makefile
.PHONY: tokens render preview

# Generate SCSS tokens from brand
tokens:
	python scripts/brand-to-scss.py

# Render site (regenerates tokens first)
render: tokens
	quarto render

# Preview site
preview: tokens
	quarto preview
```

**Step 3: Test**

Run: `make tokens`
Expected: `Generated: assets/theme/_tokens.generated.scss`

**Step 4: Commit**

```bash
git add Makefile
git commit -m "build: add Makefile with tokens target"
```

---

## Task 7: Update Audit Report

**Files:**
- Modify: `docs/audits/2026-01-16-quarto-reveal-lecture-slides-audit.md`

**Step 1: Add resolution note to DRIFT-1 risk**

Add to Section 10 (Risks) or Section 7 (Theme/Brand Architecture):

```markdown
### Resolution: DRIFT-1 (Token/Brand Duplication)

**Status:** ✅ RESOLVED

**Solution:** `_brand.yml` is now the single source of truth. SCSS tokens are generated via `scripts/brand-to-scss.py`.

**New Architecture:**
```
_brand.yml (edit here)
     ↓
scripts/brand-to-scss.py
     ↓
assets/theme/_tokens.generated.scss (do not edit)
     ↓
slide SCSS theme
```

**Deleted files:**
- `assets/theme/_tokens.scss`
- `assets/theme/slides/_tokens-bridge.scss`
```

**Step 2: Commit**

```bash
git add docs/audits/2026-01-16-quarto-reveal-lecture-slides-audit.md
git commit -m "docs(audit): document DRIFT-1 resolution"
```

---

## Final Verification

**Run full render:**
```bash
make render  # or: python scripts/brand-to-scss.py && quarto render
```

**Expected:** Site renders successfully, slides have correct colors.

**Verify in browser:** Open `_site/modules/module-01/slides/lecture-02-foundations.html` and confirm:
- Links are teal (#2f6f6f)
- Headings use indigo tones
- Highlight backgrounds are gold-tinted

---

## Summary of Changes

| Action | File |
|--------|------|
| ADD | `scripts/brand-to-scss.py` |
| ADD | `assets/theme/_tokens.generated.scss` |
| ADD | `Makefile` (or update existing) |
| MODIFY | `_brand.yml` (add mauve/slate, update header) |
| MODIFY | `assets/theme/slides/_variables.scss` |
| MODIFY | `assets/theme/slides/_base.scss` |
| MODIFY | `assets/theme/slides/_colors.scss` |
| DELETE | `assets/theme/_tokens.scss` |
| DELETE | `assets/theme/slides/_tokens-bridge.scss` |
