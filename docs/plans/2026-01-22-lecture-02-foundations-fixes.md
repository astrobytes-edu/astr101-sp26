# Lecture 02 Foundations Slides - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix formatting, add interactivity, and improve pedagogical alignment for lecture-02-foundations-slides.qmd

**Architecture:** Sequential edits to a single Quarto RevealJS file. Each task is atomic and can be verified independently. Uses figure registry shortcodes for all images.

**Tech Stack:** Quarto, RevealJS, MathJax, quiz extension, roughnotation filter

---

## Pre-Implementation Checklist

- [ ] Verify figures exist in `assets/figures.yml`
- [ ] Run `quarto render` baseline to confirm current state compiles

---

## Task 1: Fix YAML Frontmatter Structure

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd:1-44`

**Problem:** `revealjs-plugins:` is nested under `format: revealjs:` but should be at root level per template.

**Step 1: Read current YAML and compare to template**

The template shows `revealjs-plugins:` at root level (line 50-54 in template), not nested.

**Step 2: Fix YAML structure**

Replace lines 1-44 with properly structured YAML:

```yaml
---
title: "Lecture 2: Tools of the Trade"
subtitle: "Math + Cosmic Scales Survival Kit"
author: "Dr. Anna Rosen"
date: "2026-01-23"
description: "ASTR 101 math essentials: scientific notation, SI prefixes, units & conversions, ratio method, and rate problems—framed through cosmic scales."
draft: true
format:
  revealjs:
    theme: [default, ../../../assets/theme/slides/theme.scss]
    smaller: true
    slide-number: true
    transition: fade
    transition-speed: fast
    background-transition: fade
    center: false
    footer: "ASTR 101 • Lecture 2"
    chalkboard: true
    code-line-numbers: true
    fig-align: center
    html-math-method: mathjax
    pointer:
      color: "#dc2626"
      pointerSize: 18
    spotlight:
      size: 80
      fadeInAndOut: 150
      toggleSpotlightOnMouseDown: true
      initialPresentationMode: false
    quiz:
      shuffleOptions: true
      defaultCorrect: "✓ Correct!"
      defaultIncorrect: "✗ Not quite—let's fix it."

revealjs-plugins:
  - pointer
  - spotlight
  - attribution
  - quiz

filters:
  - roughnotation

execute:
  echo: false
  warning: false
  message: false
---
```

**Step 3: Verify YAML parses**

Run: `quarto render modules/module-01/slides/lecture-02-foundations-slides.qmd --to html 2>&1 | head -20`

Expected: No YAML parsing errors

---

## Task 2: Convert All `*` Bullets to `-` Bullets

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** Quarto/RevealJS requires `-` for unordered lists, not `*`.

**Step 1: Find and replace all bullet patterns**

Lines to fix (26 occurrences at root level, 2 nested):

| Line | Current | Replace With |
|------|---------|--------------|
| 90-93 | `* Units...` | `- Units...` |
| 157-158 | `* How long...` | `- How long...` |
| 187-189 | `* $a$ is...` | `- $a$ is...` |
| 212-213 | `* $n>0$...` | `- $n>0$...` |
| 224-226 | `* Multiply...` | `- Multiply...` |
| 276-277 | `* Round...` | `- Round...` |
| 279-280 | `  * coefficient...` | `  - coefficient...` |
| 305 | `* meters vs...` | `- meters vs...` |
| 309 | `* length...` | `- length...` |
| 313-315 | `* speed...` | `- speed...` |
| 409-411 | `* $1,\text{N}...` | `- $1,\text{N}...` |
| 504-506 | `* $\text{rate}...` | `- $\text{rate}...` |
| 590-591 | `* $2,\text{AU}...` | `- $2,\text{AU}...` |

**Step 2: Execute replacement**

Use `replace_all` on pattern `* ` → `- ` at start of lines.

**Step 3: Verify rendering**

Run: `quarto render modules/module-01/slides/lecture-02-foundations-slides.qmd`

Expected: Clean render with proper bullet formatting

---

## Task 3: Register Missing Figures in figures.yml

**Files:**
- Modify: `assets/figures.yml`

**Problem:** Need figures for inverse-square visualization and SI prefixes that aren't currently registered.

**Step 1: Check if inverse-square-law exists**

The registry has `inverse-square-law` at line 405-408. ✓ Already registered.

**Step 2: Add SI prefixes figure (create placeholder entry)**

Add after line 115 (after math-toolbox entry):

```yaml
  si-prefixes-scale:
    path: /assets/images/module-01/si-prefixes-scale.png
    caption: "SI Prefixes: powers of ten from tera (10¹²) to nano (10⁻⁹)"
    alt: "Chart showing SI prefixes with their symbols and corresponding powers of ten"
    module: 1
```

**Note:** If image doesn't exist, we'll use `logarithmic-cosmic-scales-gemini` instead which is already registered.

---

## Task 4: Fix Background Image to Use Shortcode

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd:67`

**Problem:** Line 67 uses direct path instead of figure registry.

**Current:**
```markdown
## {background-image="/assets/images/common/noirlab-nightsky-mosaic.jpg" background-opacity="0.18"}
```

**Step 1: Verify figure is registered**

`night-sky` is registered at line 67-72 in figures.yml with path `/assets/images/common/noirlab-nightsky-mosaic.jpg`. ✓

**Step 2: Update to use registry path variable**

Note: RevealJS `background-image` requires a direct path, not a shortcode. The shortcode `{{< img >}}` generates an `<img>` tag, which won't work for CSS background.

**Decision:** Keep the direct path for background-image but add a comment referencing the registry:

```markdown
<!-- Figure: night-sky from assets/figures.yml -->
## {background-image="/assets/images/common/noirlab-nightsky-mosaic.jpg" background-opacity="0.18"}
```

This is acceptable because background images are a special case in RevealJS.

---

## Task 5: Improve the Hook Slide

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd:67-75`

**Problem:** Current hook ("Astronomy is the art of making sense of absurd numbers") is clever but not wonder-building.

**Step 1: Replace hook with concrete cosmic scale comparison**

Replace lines 67-75 with:

```markdown
<!-- Figure: night-sky from assets/figures.yml -->
## {background-image="/assets/images/common/noirlab-nightsky-mosaic.jpg" background-opacity="0.2"}

::: {.r-fit-text}
If the Sun were a grapefruit in San Francisco...
:::

::: {.fragment}
...Earth would be a **pinhead** 15 meters away.

The nearest star? Another grapefruit **in Hawaii**.
:::

::: {.notes}
0–1 min. Pause after the first line. Let them picture it. Then reveal the fragments.
This establishes *why* we need powers of ten—ordinary language can't hold these scales.
:::
```

---

## Task 6: Add Visual for Cosmic Scales Section

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** The "Cosmic Scales in One Slide" section (line 116) has a table but no visual.

**Step 1: Add figure after the table**

After line 143 (after the columns close), insert:

```markdown
---

## The Universe's Phone Number

{{< img universe-phone-number >}}

::: {.notes}
1 min. Walk through a few steps on the ladder. Emphasize: each step is ×10.
The phone number mnemonic: (555)-711-2555 maps the multiplication factors.
:::
```

---

## Task 7: Add Visual for Inverse-Square Section

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** Inverse-square slide (line 472) has equation but no visual.

**Step 1: Add figure to the slide**

Replace lines 472-480 with:

```markdown
## Inverse-square intuition (brightness)

::: {.columns}
::: {.column width="55%"}
If you move twice as far from a light source:

$$\text{brightness}\propto \frac{1}{d^2}$$

$$\frac{B_2}{B_1}=\left(\frac{d_1}{d_2}\right)^2=\left(\frac{1}{2}\right)^2=\frac{1}{4}$$
:::

::: {.column width="45%"}
{{< img inverse-square-law >}}
:::
:::

::: {.callout-note appearance="minimal"}
This is why distance is *hard* in astronomy: small distance errors become big brightness errors.
:::

::: {.notes}
2 min. Draw attention to the diagram. Light spreads over area = 4πd².
Double the distance → 4× the area → 1/4 the brightness per unit area.
:::
```

---

## Task 8: Add Observable → Model → Inference Pattern

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** Core ASTR 101 pattern not used. Need at least 3 instances.

**Step 1: Add pattern to inverse-square slide (reframe)**

After the inverse-square slide, add a new slide:

```markdown
---

## Applying the Pattern: Distance from Brightness

**What we measure:** Brightness (flux) — how much light arrives at our detector

**What physics says:** Inverse-square law: $F = L / 4\pi d^2$

**What we conclude:** If we know a star's true luminosity $L$ and measure its flux $F$, we can calculate distance $d$

::: {.fragment}
::: {.callout-tip appearance="minimal"}
### The inference chain
Observable (flux) → Model (inverse-square) → Physical property (distance)
:::
:::

::: {.notes}
1 min. This is the first explicit use of the Observable → Model → Inference pattern.
Refer back to Lecture 1. We'll use this pattern all semester.
:::
```

**Step 2: Add pattern to rate problems section**

After the light-year building example (line 523), add:

```markdown
---

## Applying the Pattern: Lookback Time

**What we measure:** Distance to a galaxy (in light-years)

**What physics says:** Light travels at $c = 3 \times 10^8$ m/s (finite speed)

**What we conclude:** A galaxy 2.5 million light-years away → we see it as it was **2.5 million years ago**

::: {.fragment}
::: {.callout-note appearance="minimal"}
Distance is a time machine. The further we look, the further back in time we see.
:::
:::

::: {.notes}
1 min. Second use of Observable → Model → Inference.
Connect to the "distance = time dial" concept from Lecture 1.
:::
```

**Step 3: Add pattern to ratio method section**

After the "how many Earths" problem (line 468), add:

```markdown
---

## Applying the Pattern: Comparing Stars

**What we measure:** Brightness ratio of two stars (same apparent brightness)

**What physics says:** Inverse-square law means equal brightness at different distances implies different luminosities

**What we conclude:** A star 10× further away but equally bright must be **100× more luminous**

::: {.fragment}
::: {.callout-tip appearance="minimal"}
### The ratio shortcut
$\frac{L_2}{L_1} = \left(\frac{d_2}{d_1}\right)^2 = 10^2 = 100$
:::
:::

::: {.notes}
1 min. Third use of Observable → Model → Inference.
Ratios + inverse-square = powerful tool for stellar comparison.
:::
```

---

## Task 9: Convert Stop & Solve to Interactive Quiz Blocks

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** "Stop & Solve" problems are static, not using `::: {.quiz}` syntax.

**Step 1: Convert Stop & Solve 1 (Scientific Notation) to quiz**

Replace lines 235-248 with:

```markdown
## Quick Check: Scientific Notation {#stop-solve-1 background-color="#1a1a2e"}

::: {.quiz}
What is $(3 \times 10^5)(4 \times 10^3)$?

- [ ] $7 \times 10^8$
- [ ] $12 \times 10^{15}$
- [x] $1.2 \times 10^9$
- [ ] $1.2 \times 10^8$
:::

::: {.notes}
1-2 min. Give them 30 seconds to think.
Rule: multiply coefficients, add exponents. $3 \times 4 = 12$, $5 + 3 = 8$, then normalize.
:::
```

**Step 2: Convert Stop & Solve 3 (Ratios) to quiz**

Replace lines 456-468 with:

```markdown
## Quick Check: Volume Ratio {#stop-solve-3 background-color="#1a1a2e"}

The Sun's radius is about 109× Earth's radius. How many Earths fit inside the Sun?

::: {.quiz}
Using $V \propto R^3$, what is $V_\odot / V_\oplus$?

- [ ] About 109
- [ ] About 12,000
- [x] About 1.3 million
- [ ] About 109 million
:::

::: {.notes}
1-2 min. $109^3 \approx 1.3 \times 10^6$.
Key insight: volume grows as the *cube* of radius—much faster than area or length.
:::
```

**Step 3: Convert Exit Ticket to quiz**

Replace lines 569-576 with:

```markdown
## Exit Ticket {background-color="#1a1a2e"}

::: {.quiz}
If you move **twice as far** from a light source, brightness becomes...

- [ ] Half (1/2)
- [x] One-quarter (1/4)
- [ ] One-eighth (1/8)
- [ ] The same
:::

::: {.notes}
30 seconds. Quick pulse check before dismissal.
Inverse-square: $1/2^2 = 1/4$.
:::
```

---

## Task 10: Add Speaker Notes to Slides Missing Them

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** ~60% of slides lack speaker notes.

**Step 1: Add notes to section header slides**

For each section header (Tool 1, Tool 2, etc.), add timing notes:

Line 167-174 (Tool 1 header):
```markdown
::: {.notes}
0.5 min. Section transition. Let the tagline land.
:::
```

Line 289-296 (Tool 2 header):
```markdown
::: {.notes}
0.5 min. Section transition. "Units are the meaning of a number" — pause on this.
:::
```

Line 420-427 (Tool 3 header):
```markdown
::: {.notes}
0.5 min. Section transition. Ratios are the secret weapon for cosmic scales.
:::
```

Line 484-491 (Tool 4 header):
```markdown
::: {.notes}
0.5 min. Section transition. Rates connect everything we've learned.
:::
```

**Step 2: Add notes to key content slides**

Add notes to slides currently missing them (sampling):

After line 191 (scientific notation definition):
```markdown
::: {.notes}
2 min. Walk through each bullet. Have students repeat: "a is the coefficient, n is the order of magnitude."
Muscle memory matters for notation fluency.
:::
```

After line 343 (conversion factors):
```markdown
::: {.notes}
1 min. Emphasize: conversion factor = 1. You're not changing the quantity, just the label.
This is the key insight for the factor-label method.
:::
```

---

## Task 11: Add Distance Ladder Visual

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** The "astronomy unit ladder" quick reference (line 559) is text-only.

**Step 1: Add visual slide before the text reference**

Before line 559, insert:

```markdown
---

## The Cosmic Distance Ladder

{{< img cosmic-distance-ladder >}}

::: {.notes}
1 min. Preview of coming attractions. Each rung calibrates the next.
We'll explore this in detail in Module 2. For now, just note the pattern.
:::

---
```

---

## Task 12: Add Light-Year Misconception Warning

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** Need to explicitly address the light-year = time misconception.

**Step 1: Add callout after the cosmic scales table**

After line 143 (after the table callout), add:

```markdown
::: {.callout-warning appearance="minimal"}
### Common trap
A **light-year** is a *distance*, not a time—even though "year" is in the name.
It's how far light travels in one year: about 9.5 trillion km.
:::
```

---

## Task 13: Fix Math Spacing

**Files:**
- Modify: `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Problem:** Some equations use `;` for spacing which renders oddly.

**Step 1: Replace semicolon spacing with proper LaTeX spacing**

Search for patterns like `;\text{` and replace with `\,\text{` (thin space) or remove.

Examples to fix:
- Line 200: `$300{,}000{,}000;\text{m/s}` → `$300{,}000{,}000\,\text{m/s}`
- Line 338: `$1,\text{m} \leftrightarrow` → Already OK
- Line 365: Replace `;=;` with `\;=\;` or `\quad=\quad`

---

## Task 14: Final Verification

**Files:**
- `modules/module-01/slides/lecture-02-foundations-slides.qmd`

**Step 1: Run full render**

```bash
quarto render modules/module-01/slides/lecture-02-foundations-slides.qmd
```

Expected: Clean render, no warnings

**Step 2: Check slide count**

The lecture should have approximately 40-45 slides (was ~35, adding ~10 new slides).

**Step 3: Verify quiz interactivity**

Open `_site/modules/module-01/slides/lecture-02-foundations-slides.html` in browser.
Click through quiz slides and verify:
- Options are clickable
- Correct answer shows ✓
- Incorrect shows ✗

**Step 4: Verify figures render**

Check that `{{< img >}}` shortcodes resolve to images.

---

## Post-Implementation Checklist

- [ ] All `*` bullets converted to `-`
- [ ] YAML structure matches template
- [ ] At least 3 Observable → Model → Inference slides added
- [ ] At least 3 `::: {.quiz}` blocks present
- [ ] All major concepts have visual anchors
- [ ] Speaker notes on all slides
- [ ] Light-year misconception warning added
- [ ] `quarto render` succeeds with no errors
- [ ] Remove `draft: true` when ready to publish

---

## Commit Strategy

After each major task group, commit:

```bash
# After Tasks 1-2 (YAML + bullets)
git add modules/module-01/slides/lecture-02-foundations-slides.qmd
git commit -m "fix(lecture-02): correct YAML structure and bullet formatting"

# After Tasks 3-7 (visuals)
git add assets/figures.yml modules/module-01/slides/lecture-02-foundations-slides.qmd
git commit -m "feat(lecture-02): add visual anchors for cosmic scales and inverse-square"

# After Tasks 8-9 (pedagogy)
git add modules/module-01/slides/lecture-02-foundations-slides.qmd
git commit -m "feat(lecture-02): add Observable→Model→Inference pattern and quiz blocks"

# After Tasks 10-13 (polish)
git add modules/module-01/slides/lecture-02-foundations-slides.qmd
git commit -m "docs(lecture-02): add speaker notes, fix math spacing, add misconception warnings"
```
