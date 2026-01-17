# Brand System + RevealJS Defaults Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create `_brand.yml` for Quarto's native brand system and consolidate RevealJS defaults in shared `_metadata.yml`.

**Architecture:** Extract design tokens from `_tokens.scss` into `_brand.yml` (Quarto's cross-format brand system). Merge starter deck RevealJS options into module-level `_metadata.yml`. Theme SCSS remains unchanged (brand is additive).

**Tech Stack:** Quarto, YAML, SCSS (existing)

---

## Task 1: Create `_brand.yml`

**Files:**
- Create: `_brand.yml`

**Step 1:** Create the brand file with tokens extracted from `_tokens.scss`

```yaml
# _brand.yml
# Quarto Brand System — Single source of truth for cross-format identity
# Derived from assets/theme/_tokens.scss (Observatory Slate v1.0)
#
# Usage: Quarto automatically applies to html, dashboard, revealjs, typst
# RevealJS uses light mode by default (projectors are bright environments)

meta:
  name: "ASTR 201 Observatory Slate"

color:
  palette:
    # Neutrals (Light)
    bg-light: "#f7f8fa"
    surface-light: "#ffffff"
    surface-2-light: "#eef1f5"
    border-light: "#d6dbe3"
    text-light: "#16181d"
    muted-light: "#5c6470"

    # Neutrals (Dark)
    bg-dark: "#0f1115"
    surface-dark: "#16181d"
    surface-2-dark: "#1d2026"
    border-dark: "#2a2f38"
    text-dark: "#e8ecf2"
    muted-dark: "#a8b0bf"

    # Semantic Accents
    teal-light: "#2f6f6f"
    teal-dark: "#5dbfbf"
    indigo-light: "#5a5a8a"
    indigo-dark: "#9fa1d4"
    gold-light: "#7f6d44"
    gold-dark: "#d8c08b"
    rose-light: "#9a7b7f"
    rose-dark: "#c9a5a8"
    purple-light: "#7c3aed"
    purple-dark: "#a78bfa"

  # Semantic color roles
  foreground:
    light: "#16181d"
    dark: "#e8ecf2"
  background:
    light: "#f7f8fa"
    dark: "#0f1115"
  primary:
    light: "#2f6f6f"     # teal - interactive
    dark: "#5dbfbf"
  secondary:
    light: "#5a5a8a"     # indigo - structure
    dark: "#9fa1d4"
  tertiary:
    light: "#7f6d44"     # gold - emphasis
    dark: "#d8c08b"
  warning:
    light: "#9a7b7f"     # rose - pitfalls
    dark: "#c9a5a8"

logo:
  small: assets/astr201-logo.png
  medium: assets/astr201-logo.png

typography:
  fonts:
    - family: Inter
      source: google
      weight: 400..700
    - family: JetBrains Mono
      source: google
      weight: 400..700
  base:
    family: Inter
    size: 1.15rem
    line-height: 1.4
  headings:
    family: Inter
    weight: 650
  monospace:
    family: JetBrains Mono
  link:
    color:
      light: "#2f6f6f"
      dark: "#5dbfbf"
```

**Step 2:** Verify file created

Run: `cat _brand.yml | head -20`
Expected: YAML header and color palette visible

**Step 3:** Commit

```bash
git add _brand.yml
git commit -m "feat: add _brand.yml for Quarto brand system

Extract design tokens from _tokens.scss into Quarto's native brand format.
Enables cross-format color/typography consistency.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Update Shared `_metadata.yml` with RevealJS Defaults

**Files:**
- Modify: `modules/module-01/slides/_metadata.yml`

**Step 1:** Read current file to confirm contents

Run: `cat modules/module-01/slides/_metadata.yml`

**Step 2:** Replace with comprehensive defaults (merging starter deck + existing)

```yaml
# modules/module-01/slides/_metadata.yml
# Shared RevealJS defaults for all lectures in this module
# Per-lecture overrides go in individual .qmd frontmatter

format:
  revealjs:
    # Theme: built-in simple + custom SCSS overrides
    theme: [simple, ../../../assets/theme/slides/theme.scss]
    css: /assets/theme/slides/theme.css
    logo: /assets/astr201-logo.png
    date-format: "MMMM D, YYYY"

    # Slide dimensions (16:9 aspect, optimized for projection)
    width: 1280
    height: 720
    margin: 0.06

    # Navigation
    center: false
    navigation-mode: linear
    controls: true
    progress: true
    overview: true
    slide-number: c/t

    # Transitions
    transition: fade
    background-transition: fade

    # Deep-linking (shareable slide URLs)
    hash: true

    # Teaching niceties
    menu: true
    preview-links: true

    # Code ergonomics
    code-copy: true
    code-line-numbers: true
    code-overflow: wrap

    # PDF printing
    pdf-max-pages-per-slide: 1
    pdf-separate-fragments: false

    # Plugins (enable per-lecture as needed)
    chalkboard: false

    # Auto-animate (for equation/diagram morphing)
    auto-animate: true
    auto-animate-duration: 0.8

execute:
  freeze: auto
  echo: false
  warning: false
  message: false
```

**Step 3:** Verify changes

Run: `cat modules/module-01/slides/_metadata.yml | grep -E "^    (hash|menu|width|auto-animate):"`
Expected: Shows `hash: true`, `menu: true`, `width: 1280`, `auto-animate: true`

**Step 4:** Commit

```bash
git add modules/module-01/slides/_metadata.yml
git commit -m "feat(slides): add comprehensive RevealJS defaults

Merge playbook-recommended settings:
- Slide dimensions (1280x720, 16:9 aspect)
- Deep-linking (hash: true) for shareable URLs
- Menu navigation for Q&A sessions
- Auto-animate for equation morphing
- Code ergonomics (copy, line numbers, wrap)
- PDF printing defaults

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Copy `_metadata.yml` to Other Modules

**Files:**
- Create: `modules/module-02/slides/_metadata.yml`
- Create: `modules/module-03/slides/_metadata.yml`
- Create: `modules/module-04/slides/_metadata.yml`

**Step 1:** Create slides directories if they don't exist

```bash
mkdir -p modules/module-02/slides modules/module-03/slides modules/module-04/slides
```

**Step 2:** Copy the metadata file to each module

```bash
cp modules/module-01/slides/_metadata.yml modules/module-02/slides/
cp modules/module-01/slides/_metadata.yml modules/module-03/slides/
cp modules/module-01/slides/_metadata.yml modules/module-04/slides/
```

**Step 3:** Verify all modules have the file

Run: `ls -la modules/module-*/slides/_metadata.yml`
Expected: 4 files listed

**Step 4:** Commit

```bash
git add modules/module-*/slides/_metadata.yml
git commit -m "feat(slides): propagate _metadata.yml to all modules

Ensure consistent RevealJS defaults across all lecture modules.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Enable Brand in `_quarto.yml`

**Files:**
- Modify: `_quarto.yml`

**Step 1:** Read current _quarto.yml format section (lines ~123-155)

**Step 2:** Add brand reference to project config (add after `project:` section, before `website:`)

Find this line:
```yaml
project:
  type: website
```

Add after the `render:` list (around line 58):
```yaml
  brand: _brand.yml
```

**Step 3:** Verify change

Run: `grep -A1 "^project:" _quarto.yml`
Expected: Shows `type: website` and nearby `brand: _brand.yml`

**Step 4:** Commit

```bash
git add _quarto.yml
git commit -m "feat: enable _brand.yml in project config

Register brand file with Quarto for cross-format identity.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Render and Verify

**Files:**
- None (verification only)

**Step 1:** Render the project

Run: `quarto render`
Expected: No errors, warnings about brand/theme are acceptable

**Step 2:** Render a specific lecture to test RevealJS

Run: `quarto render modules/module-01/slides/lecture-02-foundations.qmd`
Expected: Completes without errors

**Step 3:** Open in browser and verify

Run: `open _site/modules/module-01/slides/lecture-02-foundations.html`

Check:
- [ ] Slides render with correct colors
- [ ] Menu icon appears (press 'm' to toggle)
- [ ] Slide number shows "current/total"
- [ ] URL updates with hash when navigating slides
- [ ] Auto-animate works if slides have `{auto-animate}` attribute

**Step 4:** If all checks pass, create final commit

```bash
git add -A
git commit -m "chore: verify brand + revealjs defaults render correctly

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>" --allow-empty
```

---

## Task 6: Update Audit Report

**Files:**
- Modify: `docs/audits/2026-01-16-revealjs-playbook-audit.md`

**Step 1:** Update the audit report to reflect changes

Add after Executive Summary section:

```markdown
## Update Log

| Date | Change | Status |
|------|--------|--------|
| 2026-01-16 | Initial audit | 83% compliant |
| 2026-01-16 | Added `_brand.yml` | ✅ Implemented |
| 2026-01-16 | Added comprehensive `_metadata.yml` defaults | ✅ Implemented |
| 2026-01-16 | Enabled `hash: true`, `menu: true`, `auto-animate: true` | ✅ Implemented |

**Revised Score:** ~95% compliant
```

**Step 2:** Update the Summary Matrix to show compliance

Change:
```
│  ❌ NOT IMPLEMENTED                                              │
│  • _brand.yml (using _tokens.scss instead)                      │
```

To:
```
│  ✅ NOW IMPLEMENTED                                              │
│  • _brand.yml (extracted from _tokens.scss)                     │
```

**Step 3:** Commit

```bash
git add docs/audits/2026-01-16-revealjs-playbook-audit.md
git commit -m "docs(audit): update compliance status after brand implementation

Revised compliance: ~95%

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

## Verification Checklist

After completing all tasks:

1. **`_brand.yml` exists:** `ls _brand.yml`
2. **All modules have `_metadata.yml`:** `ls modules/module-*/slides/_metadata.yml`
3. **Quarto render works:** `quarto render` (no errors)
4. **RevealJS features enabled:**
   - Press 'm' in slides → menu appears
   - URL has `#/slide-number` when navigating
   - Slide numbers show `current/total`
5. **Colors match:** Compare slide colors to `_tokens.scss` palette
