# ASTR 101 RevealJS Theme (Slides)

This folder is the **single entrypoint** for slide styling: `assets/theme/slides/theme.scss`.

Goals:

- Make slide formatting **hard to break** (overflow, tiny text, image weirdness).
- Provide a **small, reliable vocabulary** of layout + image primitives.
- Keep tokens **one-way**: `_brand.yml` → `assets/theme/_tokens_generated.scss` → slides.

## File Responsibilities (System Map)

- `theme.scss`: slide theme entrypoint (imports everything below).
- `_variables.scss`: slide-scale typography + spacing + Reveal defaults (consumes token bridge).
- `_tokens-bridge.scss`: **only** place slides import brand/design tokens; defines semantic aliases.
- `_base.scss`: minimal Reveal overrides (no component styling).
- `_reveal-safety.scss`: defensive rules (logo placement, slide-number safety, overflow helpers).
- `_readability.scss`: global rhythm + max measure + math/code guardrails.
- `_typography.scss`: **utilities** (text sizes, weights, line-heights).
- `_colors.scss`: **utilities** (semantic text/bg/opacity helpers).
- `_layout.scss`: **utilities** (flex, spacing, width).
- `_images.scss`: robust image defaults + image utilities.
- `_layouts.scss`: composable layout primitives (2-col, grids, hero, triad, callout split).
- `_callouts.scss`: callout polish + `.eq-gloss` block (no global typography).

## Images (Safe by Default)

All content images inside slides get safe defaults:

- `display: block`, bounded `max-width: 100%`, bounded `max-height` (prevents overflow)
- never collapses to `0×0` (even if `{{< img >}}` produces a plain `<img>`)

### Recommended: registry images + classes

```markdown
{{< img moon-phases class="img-max-60 img-center" >}}
```

### Credits (automatic, small text)

- If an image has `credit:` in `assets/figures.yml`, `{{< img ... >}}` renders a small `Credit: ...` label on the slide.
- If `credit` is empty or missing, nothing is shown.

### Contain vs cover (intentional cropping)

Use a frame wrapper when you want predictable cropping:

```markdown
::: {.img-frame .img-frame-16x9 .img-max-75vh}
{{< img hubble-deep-field class="img-fit-cover img-pos-center" >}}
:::
```

### Image utility classes

- Fit: `.img-fit-contain`, `.img-fit-cover`
- Align: `.img-left`, `.img-center`, `.img-right`
- Max width: `.img-max-40`, `.img-max-60`, `.img-max-80`, `.img-max-100`
- Max height: `.img-max-50vh`, `.img-max-65vh`, `.img-max-75vh`
- Frames: `.img-frame`, `.img-frame-16x9`, `.img-frame-4x3`, `.img-frame-square`
- Crop focus: `.img-pos-top`, `.img-pos-center`, `.img-pos-bottom`, `.img-pos-left`, `.img-pos-right`

## Layout Primitives (Prefer These Over Raw HTML)

### Two-column

```markdown
::: {.layout-2col-40-60}
::: {.col}
{{< img kepler-telescope class="img-max-100" >}}
:::
::: {.col}
- Key point 1
- Key point 2
:::
:::
```

### 2×2 grid (images or mixed content)

```markdown
::: {.layout-grid-2}
{{< img fig-a >}}
{{< img fig-b >}}
{{< img fig-c >}}
{{< img fig-d >}}
:::
```

### Triad (“Measure / Infer / Physics”)

```markdown
::: {.layout-triad}
::: {.triad-item} **Measure** … :::
::: {.triad-item} **Infer** … :::
::: {.triad-item} **Physics** … :::
:::
```

### Callout + content split

```markdown
::: {.layout-callout}
::: {.callout-tip .eq-gloss appearance="minimal"}
**What it predicts** …
:::
::: {}
Main explanation …
:::
:::
```

## Safety / Escape Hatches

- Dense slide: add `{.compact}` to the slide heading.
- Disable prose max-measure: add `{.no-measure}` to the slide heading.
- Scroll when truly necessary: wrap in `::: {.scroll-y}` or `::: {.table-scroll}`.
- Full-bleed background/media: add `{.full-bleed}` to the slide heading.
- Spotlight + chalkboard: spotlight is auto-disabled whenever reveal-chalkboard is active for drawing (either the full chalkboard overlay or the on-slide notes-canvas drawing mode), so drawing/clicking never triggers spotlight.

## What NOT to Do (Contract)

- Don’t use raw HTML grids/tables for layout; use `.layout-*` primitives.
- Don’t hard-code image sizes with inline `style=` unless there is no alternative.
- Don’t rely on background images for legible text; backgrounds are decorative and can collide with controls.
- Don’t redefine colors/typography in slide files; use token bridge + utilities.

## Codex Slide-Generation Checklist

- Use figure registry + `{{< img >}}` for slide images; add `.img-*` classes instead of ad-hoc sizing.
- Prefer `.layout-*` primitives; avoid bespoke HTML.
- If a slide is dense, try `{.compact}` before shrinking individual elements.
- If text looks wide, keep prose in paragraphs (max-measure applies by default) and avoid ultra-long bullet lines.
- Render-check at least one representative deck after theme changes: `quarto render modules/module-01/slides/lecture-01-spoiler-alerts-slides.qmd --to revealjs`.

## Media (Video) Registry

Use the media registry for embedded videos so credits aren’t forgotten.

- Registry: `assets/media.yml`
- Shortcode: `{{< media id >}}`
- Credits: `credit` is required in the registry; if it’s `"TBD"` you’ll see `Credit: TBD` on-slide.

Example:

```markdown
## {background-color="black"}
{{< media rubin-zoomout-galaxies width="100%" height="100%" >}}
```

## Typography Utilities (Additions)

- `.text-xxs` → `0.42em` (use for micro-footnotes like media/image credits).

## Typography Utilities (Reference)

These are defined in `assets/theme/slides/_variables.scss` and exposed as utility classes in `assets/theme/slides/_typography.scss`.

### Text sizes

All sizes are relative to the slide base font size (RevealJS root is configured in `assets/theme/slides/_variables.scss`).

| Class | Size |
|---|---|
| `.text-xxs` | `0.42em` |
| `.text-xs` | `0.65em` |
| `.text-sm` | `0.8em` |
| `.text-base` | `1em` |
| `.text-lg` | `1.2em` |
| `.text-xl` | `1.5em` |

### Font weights

| Class | Weight |
|---|---|
| `.font-normal` | `400` |
| `.font-medium` | `500` |
| `.font-semibold` | `600` |
| `.font-bold` | `700` |

### Line heights

| Class | Line height |
|---|---|
| `.leading-none` | `1.0` |
| `.leading-tight` | `1.15` |
| `.leading-normal` | `1.4` |
| `.leading-relaxed` | `1.65` |

### Text style helpers

| Class | Effect |
|---|---|
| `.italic` | italic |
| `.not-italic` | normal |
| `.uppercase` | UPPERCASE |
| `.lowercase` | lowercase |
| `.capitalize` | Capitalize Words |
| `.normal-case` | normal casing |
