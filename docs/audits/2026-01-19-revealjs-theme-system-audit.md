# ASTR 101 RevealJS Theme System Audit (Design System + Frontend Engineering)

**Audit scope:** `assets/theme/**` (site themes + slides theme system) with implementation focused on `assets/theme/slides/**`.

## 0) Task classification (LLM Lab Protocol)

- Architectural exploration
- Refactor / restructuring (**dominant**)
- Documentation / explanation

## 1) Invariants (non-negotiable)

- Do not touch lecture content (`modules/**/slides/*.qmd`, readings, etc.).
- Tokens flow one-way: `_brand.yml` → `assets/theme/_tokens_generated.scss` → consumers.
- `assets/theme/_tokens_generated.scss` is generated; do not edit by hand.
- Slide CSS must remain compatible with `{{< img >}}` output (plain `<img>` plus optional `class`, `width`, `height`, `trim`).

---

## 2) System map (what each SCSS file does)

### Site-wide (HTML pages)

- `assets/theme/_tokens_generated.scss`: generated brand tokens (palette + fonts) from `_brand.yml`.
- `assets/theme/_design_tokens.scss`: hand-authored design decisions (radii, sizing, mixins) that *depend on* brand tokens (e.g., focus ring uses `$rose-light`).
- `assets/theme/site-light.scss`: Quarto/Bootstrap overrides + site styling for light mode.
- `assets/theme/site-dark.scss`: Quarto/Bootstrap overrides + site styling for dark mode.
- `assets/theme/callouts.scss`: Quarto callout restyling + custom callout types (HTML pages).
- `assets/theme/lecture-cards.scss`: listing/card grid system for site pages (lectures/homework/exams/etc.).
- `assets/theme/dashboard.scss`: dashboard tile styling (site pages).
- `assets/theme/collapsible-cards.scss`: collapsible card styling (site pages; **not** RevealJS).
- `assets/theme/nav-markers.scss`: schedule navigation markers (site pages).

### RevealJS slides (this is the slide design system)

Entry point:
- `assets/theme/slides/theme.scss`: only file referenced by `modules/module-*/slides/_metadata.yml`.

Tokens:
- `assets/theme/slides/_tokens-bridge.scss`: **only** place slide theme imports brand/design tokens; defines slide-semantic aliases.
- `assets/theme/slides/_variables.scss`: slide-scale typography/spacing + RevealJS defaults; consumes the token bridge.

Rules (consumers):
- `assets/theme/slides/_base.scss`: minimal Reveal overrides (no components).
- `assets/theme/slides/_reveal-safety.scss`: defensive rules (logo placement, slide-number safety, overflow helpers, background defaults).
- `assets/theme/slides/_readability.scss`: global rhythm + max-measure + math/code guardrails.
- `assets/theme/slides/_typography.scss`: utility classes for sizes/weights/leading.
- `assets/theme/slides/_colors.scss`: utility classes for semantic colors/bg/opacity.
- `assets/theme/slides/_layout.scss`: utility classes for flex/spacing/width.
- `assets/theme/slides/_images.scss`: image defaults + `.img-*` utilities + wrapper-based cropping.
- `assets/theme/slides/_layouts.scss`: layout primitives (`.layout-*`) to avoid raw HTML grids.
- `assets/theme/slides/_callouts.scss`: callout polish + `.eq-gloss` block (kept narrowly scoped).

---

## 3) Single source of truth (explicit answers)

### Colors

- **Single source of truth:** `_brand.yml`
- **Generated SCSS truth:** `assets/theme/_tokens_generated.scss`
- **Slide semantic mapping:** `assets/theme/slides/_tokens-bridge.scss` (aliases like `$heading-color`, `$link-color`)

### Spacing

- **Slides:** `assets/theme/slides/_variables.scss` defines slide spacing scale (`$space-1/2/4`) and breakpoint (`$bp-narrow`).
- **Site:** spacing primarily comes from Bootstrap/Quarto defaults; `assets/theme/_design_tokens.scss` defines radii/sizing for components, but not a full spacing scale.

### Typography scale

- **Fonts:** `_brand.yml` → `assets/theme/_tokens_generated.scss` → consumed by site + slides.
- **Slides:** `assets/theme/slides/_variables.scss` sets RevealJS font-size root and heading sizes; utilities in `_typography.scss`.

### Breakpoints

- **Slides:** `assets/theme/slides/_variables.scss` (`$bp-narrow`) used for collapsing `.layout-*` patterns.
- **Site:** uses Bootstrap breakpoints implicitly via Quarto/Bootstrap.

### Token flow direction

- Tokens flow **one-way**: `_brand.yml` → `_tokens_generated.scss` → (site themes and slide token bridge) → slide/site rules.
- There is no “backflow” of brand tokens from slides back into `_brand.yml`.
- The only notable coupling: `_design_tokens.scss` (design decisions) **depends on** brand tokens (by design; documented in that file).

---

## 4) DRY violations / leakage found (and addressed)

### Leakage (fixed)

- `assets/theme/slides/_callouts.scss` previously contained global slide rhythm, fragment styling, and column spacing.
  - These rules were moved into `assets/theme/slides/_readability.scss` and `assets/theme/slides/_reveal-safety.scss`.

### Duplicate / parallel CSS artifacts (fixed)

- `assets/theme/slides/theme.css` existed but was **not referenced** by any `_metadata.yml` and risked drift vs `theme.scss`.
  - Removed to make `theme.scss` the unambiguous entrypoint.

### Potential drift (documented)

- `docs/plans/2026-01-16-brand-as-single-source.md` describes a different slide-token approach (and a planned deletion of `_tokens-bridge.scss`) that does not match current implementation.
  - Treated as historical; current slide system keeps `_tokens-bridge.scss` intentionally as the semantic alias layer.

---

## 5) Image system hardening (critical)

### Problem class

Common failure modes in RevealJS decks:
- images rendering at `0×0` (especially from shortcode-generated plain `<img>`),
- images overflowing slide bounds,
- inconsistent “contain vs cover” behavior,
- fragile ad-hoc resizing/cropping.

### Implemented solution

- New slide image system: `assets/theme/slides/_images.scss`
- Safe defaults for content images:
  - `display: block`
  - bounded `max-width: 100%`
  - bounded `max-height` via `--slide-img-max-h` (default `72vh`)
  - minimal non-zero size (`min-width/min-height: 1px`) to prevent collapse
- Utilities:
  - Fit: `.img-fit-contain`, `.img-fit-cover`
  - Alignment: `.img-left`, `.img-center`, `.img-right`
  - Sizing: `.img-max-40/60/80/100`, `.img-max-50vh/65vh/75vh`
  - Wrapper cropping: `.img-frame` + aspect helpers (`.img-frame-16x9`, `.img-frame-4x3`, `.img-frame-square`)
  - Crop focus: `.img-pos-*`

### Compatibility notes

- Works with `{{< img >}}` because it styles plain `<img>` tags and respects optional `class`, `width`, `height`.
- Does not override `trim` behavior (which uses `transform` + `clip-path` inline styles).

---

## 6) Layout primitives (small, composable vocabulary)

Implemented in `assets/theme/slides/_layouts.scss`:

- `.layout-2col` (+ `.layout-2col-40-60`, `.layout-2col-60-40`)
- `.layout-grid-2`, `.layout-grid-3` (use for 2×2 image grids; replaces raw HTML grids)
- `.layout-hero` (+ `.hero-caption`)
- `.layout-triad` (+ `.triad-item`)
- `.layout-callout`

Design intent:
- Prefer semantic patterns over bespoke HTML.
- Collapse to 1 column at `$bp-narrow` and in print/PDF.

---

## 7) Typography & readability guarantees

Implemented in `assets/theme/slides/_readability.scss`:

- Consistent vertical rhythm for paragraphs/lists.
- Reduced heading margins (less likely to push content into footer/controls).
- Default prose max-measure for paragraphs/quotes (`--slide-prose-measure`), with opt-out via `{.no-measure}`.
- Math/code guardrails (display-math spacing; avoid tiny inline math; code blocks bounded + scroll).
- Density escape hatch via `{.compact}`.

---

## 8) RevealJS-specific safety rules

Implemented in `assets/theme/slides/_reveal-safety.scss`:

- Logo placement rules for Quarto RevealJS `logo:` (fixed, non-interfering).
- Slide-number positioning to reduce collisions.
- Background defaults (`cover`, centered) without overriding slide-specific inline styles.
- Overflow utilities: `.scroll-y`, `.scroll-x`, `.table-scroll`.

---

## 9) Summary of concrete changes made

- Added `assets/theme/slides/_images.scss` (robust image system + utilities).
- Added `assets/theme/slides/_layouts.scss` (layout primitives).
- Added `assets/theme/slides/_readability.scss` (readability guarantees).
- Added `assets/theme/slides/_reveal-safety.scss` (RevealJS defensive rules).
- Updated `assets/theme/slides/theme.scss` (clean entrypoint; imports new partials).
- Updated `assets/theme/slides/_base.scss` (removed brittle intrinsic image hack).
- Updated `assets/theme/slides/_variables.scss` (added slide breakpoint token).
- Updated `assets/theme/slides/_callouts.scss` (removed global leakage; kept callouts-focused rules).
- Deleted `assets/theme/slides/theme.css` (unused drift risk).
- Updated `assets/theme/slides/README.md` (contract + usage guide).

---

## 10) Readiness for repeated Codex-driven slide generation

**Status:** **YES** (theme compiles; slide-system contracts documented).

Acceptance gate:
- `quarto render` succeeds (full site build).
- At least one representative deck renders (`quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`).
