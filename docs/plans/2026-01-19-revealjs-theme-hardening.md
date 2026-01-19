# ASTR 201 RevealJS Theme Hardening — Implementation Plan

> **For Codex:** REQUIRED SUB-SKILLS: `superpowers:writing-plans`, `superpowers:executing-plans`

**Goal:** Make the ASTR 201 RevealJS slide theme (SCSS) DRY, layout-safe, and robust for repeated Codex-driven deck generation (40–50 decks) without manual formatting fixes.

**Architecture:** Keep `_brand.yml` as the single source of truth for brand tokens → `assets/theme/_tokens_generated.scss`, then bridge to slide-semantic aliases in `assets/theme/slides/_tokens-bridge.scss`. Build slide theme rules as a small set of composable primitives (images, layouts, typography rhythm, reveal safety), imported via `assets/theme/slides/theme.scss`.

**Tech Stack:** Quarto RevealJS, Sass/SCSS (Quarto theme pipeline), registry-based image shortcode `{{< img >}}` via `_extensions/course/shortcodes.lua`.

## Invariants

- Do not touch lecture content (`modules/**/slides/*.qmd`, readings, etc.).
- Do not change the figure registry or the `{{< img >}}` shortcode output contract; CSS must work with plain `<img>` tags and optional `class`, `width`, `height`, `trim`.
- Tokens flow one-way: `_brand.yml` → `_tokens_generated.scss` → slide/site themes; no backflow (no re-defining brand tokens inside slides).
- Theme must prevent common failure modes: image 0×0, slide overflow, tiny text from scaling, and footer/navigation collisions.

## Task 1: System map + boundary cleanup (DRY)

**Files:**
- Modify: `assets/theme/slides/theme.scss`
- Modify: `assets/theme/slides/_base.scss`
- Modify: `assets/theme/slides/_callouts.scss`
- (Optional) Delete: `assets/theme/slides/theme.css` (unused; prevent drift/confusion)

**Steps:**
1. Move non-callout global rules out of `_callouts.scss` (line-height, fragment opacity, columns gap, etc.) into purpose-built slide partials.
2. Ensure `theme.scss` is the single, clean entrypoint for slide rules (no parallel/unused CSS file).

## Task 2: Robust slide image system (critical)

**Files:**
- Add: `assets/theme/slides/_images.scss`
- Modify: `assets/theme/slides/theme.scss`

**Deliverables:**
- Safe defaults for `.reveal section img` that prevent 0×0 and overflow.
- Utility classes:
  - Fit: `.img-fit-contain`, `.img-fit-cover`
  - Size: `.img-max-40`, `.img-max-60`, `.img-max-80`, `.img-max-75vh`
  - Align: `.img-left`, `.img-center`, `.img-right`
  - Framing/cropping helpers (wrapper-based): `.img-frame`, `.img-frame-16x9`, `.img-frame-square`

**Verification:**
- `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`

## Task 3: Layout primitives (small vocabulary)

**Files:**
- Add: `assets/theme/slides/_layouts.scss`
- Modify: `assets/theme/slides/theme.scss`

**Deliverables (classes):**
- `.layout-2col`, `.layout-2col-media`, `.layout-2col-text`
- `.layout-hero` (hero media + caption block)
- `.layout-triad` (three-up “Measure / Infer / Physics”)
- `.layout-callout` (callout + content split)
- Responsive collapse rules for small viewports and printed/PDF

## Task 4: Typography + readability guarantees

**Files:**
- Add: `assets/theme/slides/_readability.scss`
- Modify: `assets/theme/slides/_typography.scss` (keep utilities; move base rules to `_readability.scss`)

**Deliverables:**
- Minimum readable font behavior (avoid pathological shrink)
- Enforced max measure for prose blocks (opt-out via class)
- Stable vertical rhythm for paragraphs/lists/fragments
- Math/code sizing guardrails

## Task 5: RevealJS-specific safety rules

**Files:**
- Add: `assets/theme/slides/_reveal-safety.scss`

**Deliverables:**
- Safe slide padding top/bottom to reduce collisions with logo/controls/progress
- Overflow handling: code blocks scroll, tables behave, optional `.scroll-y`
- Background image conventions and full-bleed opt-in class

## Task 6: Documentation contract

**Files:**
- Modify: `assets/theme/slides/README.md`
- Add: `docs/audits/2026-01-19-revealjs-theme-system-audit.md`

**Deliverables:**
- “How to place images safely”
- “Which layout classes to use”
- “What NOT to do in slides”
- Codex slide-generation checklist (contract)

## Final verification (required)

Run:
- `make render`

Expected:
- Quarto renders successfully and slide decks compile with no SCSS errors.

