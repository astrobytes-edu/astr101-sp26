# ASTR 201 Media Registry + On-Slide Credits — Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Introduce a centralized media (video) registry with required `credit` fields and ensure **credits display automatically on slides** in very small text (no RevealJS attribution plugin dependency).

**Architecture:** Mirror the figure registry pattern (`assets/figures.yml` + `{{< img >}}`) with a new `assets/media.yml` + `{{< media >}}` shortcode. Shortcodes emit the embed plus a credit element (`.media-credit*`). Slide theme provides consistent small-text styling.

**Tech Stack:** Quarto RevealJS, Lua shortcodes (`_extensions/course/shortcodes.lua`), slide SCSS (`assets/theme/slides/**`).

## Invariants

- No invented credits. If a source is unknown, mark as `[TBD]` explicitly.
- Every media registry entry has a `credit` field (may be empty, but prefer `[TBD]` for missing/unknown sources).
- Credits appear automatically on RevealJS slides (small text) without relying on the attribution plugin.

## Open Decision (confirm before implementation)

When `credit: ""` (empty) in the registry:
- **Option 1 (strict):** render `Credit: [TBD]` on-slide
- **Option 2 (quiet):** render nothing, but keep field empty

Recommendation: **Option 1** for videos (so missing credits are obvious).

---

### Task 1: Add media registry file

**Files:**
- Create: `assets/media.yml`

**Step 1: Create initial schema**

```yaml
# Media Registry — Single Source of Truth for videos/embeds
# Usage (slides): {{< media id >}}
#
# Fields:
#   url: canonical URL (YouTube/Vimeo/local file)
#   caption: optional short description (not necessarily displayed)
#   credit: REQUIRED (can be "" but prefer "[TBD]" if unknown)

media:
  rubin-zoomout:
    url: "https://youtu.be/Gitit3LwQ20"
    caption: "Rubin Observatory zoom-out to ~10 million galaxies"
    credit: "NSF-DOE Vera C. Rubin Observatory (per lecture notes)"

  hr-diagram-omega-centauri:
    url: "https://youtu.be/1JPDN8qoRjs"
    caption: "HR diagram construction from Omega Centauri"
    credit: "[TBD]"
```

**Step 2: Commit**

```bash
git add assets/media.yml
git commit -m "feat(media): add media registry"
```

---

### Task 2: Implement `media` shortcode (embed + credit)

**Files:**
- Modify: `_extensions/course/shortcodes.lua`

**Step 1: Add a cached registry loader**
- Implement `load_media_registry()` using the same simplified YAML parsing approach as `load_figure_registry()`.
- Add `get_media_registry()` cache.

**Step 2: Add `media(args, kwargs)`**
- `{{< media id >}}` looks up `assets/media.yml`.
- Embed rules:
  - If YouTube URL: render `<iframe>` with `youtube-nocookie.com`.
  - If local video (e.g., `.mp4`): render `<video>` tag with controls.
- Emit credit element:
  - If credit non-empty: `<span class="media-credit">Credit: …</span>`
  - If credit empty: follow Open Decision.

**Step 3: Treat empty credits as missing**
- Update existing `fig()` credit handling to use `if credit and credit ~= "" then ...` (so an empty credit field doesn’t render `Credit:` noise).

**Step 4: Commit**

```bash
git add _extensions/course/shortcodes.lua
git commit -m "feat(media): add media shortcode and registry loader"
```

---

### Task 3: Show credits for slide images (`{{< img >}}`)

**Files:**
- Modify: `_extensions/course/shortcodes.lua`
- Modify: `assets/theme/slides/_reveal-safety.scss`

**Step 1: Update `img()` to render credit line when present**
- Pull `credit` from `assets/figures.yml`.
- Emit a `Span` below/after the image:
  - `Credit: …` with class `.media-credit` (very small).
  - Do not show if credit missing/empty.

**Step 2: Add slide styling for `.media-credit`**
- Small font size, muted color, high legibility on dark backgrounds.
- Ensure it doesn’t collide with controls (position or margins).

**Step 3: Commit**

```bash
git add _extensions/course/shortcodes.lua assets/theme/slides/_reveal-safety.scss
git commit -m "feat(slides): show image credits for img shortcode"
```

---

### Task 4: Migrate existing embeds in Lecture 1

**Files:**
- Modify: `modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd`
- Modify: `assets/media.yml`

**Step 1: Add entries for all existing `{{< video ... >}}` URLs**
- Use lecture notes as the source of truth for credit text where stated.
- For unknowns, set `credit: "[TBD]"` (preferred) or `credit: ""` (if you choose quiet behavior).

**Step 2: Replace built-in shortcodes**
- Replace:
  - `{{< video https://youtu.be/... width="100%" height="100%" >}}`
- With:
  - `{{< media <id> width="100%" height="100%" >}}`

**Step 3: Commit**

```bash
git add assets/media.yml modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd
git commit -m "refactor(lec1): use media registry for videos"
```

---

### Task 5: Verify render + document usage

**Files:**
- Modify: `assets/theme/slides/README.md` (add `media` usage + credit rules)
- (Optional) Modify: `docs/quarto-extensions-guide.md` (clarify attribution plugin behavior vs our in-theme credits)

**Step 1: Render deck**
Run:
- `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`
Expected:
- Deck builds successfully; credits visible in small text.

**Step 2: Render site**
Run:
- `quarto render`
Expected:
- Site builds successfully (warnings unrelated to this change are acceptable).

**Step 3: Commit**

```bash
git add assets/theme/slides/README.md docs/quarto-extensions-guide.md
git commit -m "docs(media): document registry and on-slide credits"
```

