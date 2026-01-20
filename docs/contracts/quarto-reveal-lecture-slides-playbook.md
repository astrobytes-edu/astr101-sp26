# Quarto + reveal.js Lecture Slides Playbook

*A practical, pedagogical, “make it look perfect” guide you can actually follow.*

---

## 0) The vibe contract (why these choices work)

Slides aren’t a textbook—they’re a **live interface** for attention.

Your north stars:

- **One idea per slide** (reveal gives you infinite slides; use them).
- **Progressive disclosure** (students shouldn’t read ahead of your mouth).
- **High-contrast + generous spacing** (projectors are cruel).
- **Visual evidence > bullet lists** (plots, diagrams, photos, annotated equations).
- **Structure supports improvisation** (jump around without losing the thread).

This playbook is organized by: **(A) core settings**, **(B) core reveal features**, **(C) high‑ROI extensions**, **(D) advanced standardization**.

---

## 1) Baseline project setup (clean, reproducible)

### 1.1 Recommended directory layout

```text
astr101-slides/
  _quarto.yml
  _brand.yml               # cross-format brand (optional but recommended)
  _metadata.yml            # deck-level defaults shared across lectures
  theme.scss               # your slide theme layer
  assets/
    logo.svg
    scripts.js             # optional: tiny reveal helpers
  lectures/
    01-intro.qmd
    02-radiation.qmd
  _extensions/
    ...                    # installed extensions live here (commit it)
```

### 1.2 Minimal `_quarto.yml`

```yaml
project:
  type: default

format:
  revealjs:
    theme: [default, theme.scss]
    slide-number: true
    center: false
    transition: fade
    background-transition: fade
    hash: true
    # fragment-in-url: true   # optional; see §6.3

execute:
  freeze: auto   # if you have code cells; safe default
```

**Why**

- `center: false` improves readability (top-aligned content doesn’t “float”).
- `hash: true` makes slide URLs shareable.
- `freeze: auto` keeps computational slides fast and stable.

### 1.3 Shared defaults via `_metadata.yml` (highly recommended)

Put common reveal options here so each lecture file stays clean.

```yaml
format:
  revealjs:
    width: 1280
    height: 720
    margin: 0.06
    navigation-mode: linear
    controls: true
    progress: true
    preview-links: true
    pdf-max-pages-per-slide: 1
    code-copy: true
    code-line-numbers: true
    chalkboard: false  # see §5.3 for when to enable
```

Then in each lecture `.qmd`, include:

```yaml
---
title: "Lecture 01 — Tools of the Trade"
metadata-files: ["../_metadata.yml"]
format:
  revealjs:
    chalkboard: true
---
```

---

## 2) Make it look like a coherent *product*

### 2.1 Use `_brand.yml` for cross-format identity

This is your single source of truth for:

- palette, foreground/background, accent
- typography
- logo

Example skeleton:

```yaml
color:
  background: "#0b0f14"
  foreground: "#e9eef5"
  primary: "#5dbfbf"   # teal accent

font:
  base:
    family: "Inter"
  headings:
    family: "Inter"
    weight: 650

logo:
  images:
    icon: "assets/logo.svg"
```

**How to use**

- Put `_brand.yml` at project root.
- Quarto will apply it automatically in supported formats.

### 2.2 Add a small `theme.scss` layer (the 80/20 of polish)

Goals:

- set a **typographic scale**
- enforce **spacing rhythm**
- tune **code block readability**
- standardize **figure captions**

Starter `theme.scss` (keep it minimal):

```scss
/* theme.scss */

.reveal {
  font-size: 30px; /* adjust to your room/projector */
}

.reveal h1 { font-size: 1.9em; line-height: 1.05; }
.reveal h2 { font-size: 1.45em; line-height: 1.1; }
.reveal h3 { font-size: 1.15em; }

.reveal section {
  padding: 0.2rem 0.2rem;
}

/* Make lists breathe */
.reveal ul, .reveal ol {
  margin-top: 0.6rem;
}
.reveal li { margin: 0.25rem 0; }

/* Code blocks: readable, not shouty */
.reveal pre code {
  line-height: 1.25;
  max-height: 520px;
}

/* Captions: subtle */
.reveal figcaption {
  font-size: 0.75em;
  opacity: 0.85;
}
```

### 2.3 Add a tiny “utility class” stylesheet (optional)

Sometimes you want quick layout tweaks.

Create `assets/slides.css` and include:

```yaml
format:
  revealjs:
    css: [assets/slides.css]
```

Useful utilities:

```css
/* assets/slides.css */
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
.tight p { margin: 0.2rem 0; }
.small { font-size: 0.85em; }
.muted { opacity: 0.85; }
```

---

## 3) Slide authoring patterns that feel engaging

### 3.1 Horizontal vs vertical slides (depth without clutter)

- **Horizontal**: your main narrative.
- **Vertical stack**: optional deep dive you can skip live.

Pattern:

- top slide: “core idea + one figure + one sentence”
- down stack: derivation, extra example, misconceptions

### 3.2 Progressive disclosure with fragments

Use fragments for:

- revealing plot annotations step-by-step
- building an argument without a wall of text
- turning a derivation into a sequence

Example:

```markdown
## Why does the spectrum peak?

- Temperature sets the *shape*.
- :::{.fragment} Peak shifts with **T**. :::
- :::{.fragment} Total area scales like **T⁴**. :::
```

Inline fragment (single word):

```markdown
Because Excel :::{.fragment} stinks :::
```

### 3.3 Speaker notes (teach off notes, not off slides)

Add notes so slides stay clean.

```markdown
## The punchline

**Photons carry information, not intent.**

::: notes
Ask: “What *is* the measurement here?”
Common misconception: intensity ≠ luminosity.
Timing: 2 min.
:::
```

### 3.4 “Predict → Commit → Reveal” micro-interactions

Engage students every ~10-15 minutes with a quick prediction.
This is the simplest engagement pattern with the biggest learning payoff.

Template slide:

```markdown
## Prediction

**Before we compute:** which star is brighter *at Earth*?

A) closer, dimmer star
B) farther, brighter star

::: notes
Give them 30 seconds. Cold call 2 answers.
Then reveal with inverse-square.
:::
```

---

## 4) Layout tools you should actually use

### 4.1 Columns (clean comparisons)

```markdown
::: {.columns}
::: {.column width="55%"}
### Idea
- one sentence
- one plot
:::
::: {.column width="45%"}
### Implication
- one equation
- one check
:::
:::
```

### 4.2 Callouts (don’t overuse)

Great for:

- definitions
- warnings
- “common trap” boxes

```markdown
::: {.callout-warning}
## Common trap
Flux is not luminosity.
:::
```

### 4.3 Full-bleed figure slides (high impact)

Use a slide that is **mostly an image** with a caption.

```markdown
##

![](images/milky-way.jpg){width=100%}

*The Milky Way core from Earth — what you’d actually see (long exposure).*
```

---

## 5) Built-in reveal features worth enabling

### 5.1 Auto-Animate (turn sequences into smooth morphs)

Use when:

- equations evolve
- labels move on a diagram
- code grows

Enable:

```yaml
format:
  revealjs:
    auto-animate: true
    auto-animate-duration: 0.8
```

Authoring tip:

- Keep adjacent slides structurally similar.
- Use `data-id` attributes when needed (advanced).

### 5.2 Menu (jump around without panic)

Enable:

```yaml
format:
  revealjs:
    menu: true
```

Best use:

- Q&A navigation
- “let’s revisit that plot” moments

### 5.3 Chalkboard (live derivations + annotations)

Enable per lecture (not always globally):
```yaml
format:
  revealjs:
    chalkboard: true
```

Use for:

- deriving on top of a clean slide
- circling terms
- drawing simple conceptual diagrams

**Gotcha**: Don’t enable chalkboard if you rely on `embed-resources: true` for single-file decks.

### 5.4 Scroll View (reading mode)

You don’t “enable” it so much as **support** it.

Design implications:

- avoid “tiny text” that only works on projectors
- keep figures legible at mobile widths

---

## 6) Sharing, printing, and distribution that doesn’t embarrass you

### 6.1 Deep-linking (share exact slide)

Enable:
```yaml
format:
  revealjs:
    hash: true
```

Optional: include fragment steps in URLs:

```yaml
format:
  revealjs:
    fragment-in-url: true
```

Use case:

- students ask “which slide was the derivation?” → send link.

### 6.2 Print/PDF workflows

Two main approaches:

1) reveal print view → print to PDF (quick)
2) Quarto/CI renders + artifact (reproducible)

Design tip:

- avoid “animated-only” meaning; ensure the final state is readable.

### 6.3 Single-file offline decks (`embed-resources`)

Enable when:

- you need to email one HTML file
- you want archive stability

```yaml
format:
  revealjs:
    embed-resources: true
```

Tradeoffs:

- file size increases
- some interactive features/plugins may break
- chalkboard conflicts (see §5.3)

---

## 7) Computational slides (code + plots that teach)

### 7.1 Put output where it teaches best

You can reveal output as a fragment or put it in a column.

Pattern: compute → pause → reveal plot.

### 7.2 Code line highlighting (live explanation)


```{python}
#| code-line-numbers: "4-7"
#| code-overflow: wrap
# ...
```

Use it to:

- highlight only the physics-relevant lines
- guide attention while you talk

### 7.3 Caching stability (`freeze`)

If your deck has computations:

- set `execute: freeze: auto` at project level
- seed random number generators
- prefer deterministic plots

---

## 8) Extensions to add (with full “how + why”)

> Rule: **Pick a small set** and standardize it across the course.

### 8.1 How to install extensions (one-time)

From your project root:

```bash
quarto add <extension-id>
```

This creates `_extensions/…`.
**Commit `_extensions/`** so builds are reproducible.

Useful commands:
```bash
quarto list extensions
quarto update extension
quarto remove extension
```

### 8.2 High-ROI extension set (recommended baseline)

#### A) Pointer (better pointing)

**Why**: makes “look here” precise without awkward laser pointers.

**Install:**

```bash
quarto add quarto-ext/pointer
```

**Use:**

- turn it on in YAML (check extension README for exact options)
- present normally; pointer appears as you move

#### B) Spotlight (weaponized emphasis)

**Why**: forces attention to a region of a plot/equation.

**Install:**

```bash
quarto add mcanouil/quarto-spotlight
```

**Use:**

- toggle spotlight during presentation
- great for crowded figures

#### C) Rough Notation (animated annotations)

**Why**: underlines/boxes/arrows that animate in feel modern and guide attention.

**Install**
```bash
quarto add emilhvitfeldt/roughnotation
```

**Use pattern:**

- wrap the term you want emphasized using the extension’s shortcode/syntax
- trigger as fragment for pacing

#### D) Quiz (retrieval practice inside slides):

**Why**: makes engagement *real* (students commit to an answer).

**Install:**

```bash
quarto add samparmar/quiz
```

**Use:**

- add quick concept checks every 8–12 minutes
- keep questions small and diagnostic

#### E) Attribution (credits without clutter)

**Why**: astronomy slides need image/plot credits; this keeps it clean.

**Install:**

```bash
quarto add quarto-ext/attribution
```

**Use:**

- define a slide-level attribution line
- standardize placement and font size

### 8.3 Optional extensions (use-case dependent)

#### Verticator (if you use vertical stacks)

**Why**: students don’t get lost in “down-stack” depth.

```bash
quarto add jmgirard/verticator
```

#### Reveal Header (consistent header/logo)

**Why**: gives a consistent, branded header without hand-formatting.

```bash
quarto add shafayetShafee/reveal-header
```

#### QDraw (simple drawing)

**Why**: if you want minimal drawing without full chalkboard.

```bash
quarto add abdullahalmamud/qdraw
```

#### Subtitles (accessibility)

**Why**: captions help everyone, especially in noisy rooms or recordings.

```bash
quarto add samparmar/subtitles
```

---

## 9) Standardize EVERYTHING with a custom project type (advanced, worth it)

If you want “every lecture deck follows the same rules forever,” create a **project type extension** (this is a Quarto-native way to enforce org/course standards).

### 9.1 What you get

One line in `_quarto.yml`:

```yaml
project:
  type: astr101slides
```

…automatically provides:

- your theme
- default reveal options
- logo/footer
- filters (if needed)
- your extension set

### 9.2 Minimal project-type extension skeleton

Create:

```text
_extensions/astr101slides/
  _extension.yml
  theme.scss
  assets/
    logo.svg
```

Example `_extensions/astr101slides/_extension.yml`:

```yaml
title: "ASTR101 Slides"
author: "Dr. Anna Rosen"
version: 1.0.0
quarto-required: ">=1.5.0"

contributes:
  project:
    project:
      type: default
    format:
      revealjs:
        theme: [default, theme.scss]
        center: false
        slide-number: true
        transition: fade
        background-transition: fade
        hash: true
        preview-links: true
        code-copy: true
        code-line-numbers: true
        footer: "ASTR 101 • SDSU"
        logo: assets/logo.svg
```

### 9.3 Turn it into a starter template (so new decks are instant)

Create a GitHub repo containing:

- `_extensions/astr101slides/…`
- a root `_quarto.yml` that sets `project: type: astr101slides`
- an `index.qmd` or `lecture.qmd` starter file

Then you can bootstrap a new project with:

```bash
quarto use template <org>/<repo>
```

### 9.4 When to do this

Do it if you want:

- consistent student experience
- fewer “why do these slides look different?” issues

---

## 10) ASTR101 "perfect lecture deck" checklist

### 10.1 Before class (5 minutes)

- Run `quarto preview` and click through the deck.
- Check projector readability: **smallest text** and **faintest lines**.
- Verify fragments don’t hide essential info in the final state.

### 10.2 During class

- Use speaker notes view.
- Every ~10 minutes: ask a prediction / quiz.
- Use spotlight/roughnotation instead of adding extra text.

### 10.3 After class

- Export/share the URL (hash enabled).
- Optional: publish a print/PDF version.

---

## 11) Troubleshooting (common pain points)

### “Extension installed but not found”

- Ensure you’re rendering **from the project root** (where `_quarto.yml` and `_extensions/` live).
- Confirm the extension exists via `quarto list extensions`.

### “Slides look different on another machine”

- Commit `_extensions/`.
- Pin `quarto-required` in project or extension.

### “My slide is too tall / content overflows”

- Split the slide.
- Use `.smaller` or `.scrollable` sparingly.
- Prefer vertical stacks for optional detail.

---

## 12) Your recommended default stack (opinionated)

If you do nothing else, do this:

1) Baseline reveal settings via `_metadata.yml`
2) Minimal `theme.scss` for typography + spacing
3) Enable: `hash: true`, `menu: true`
4) Install: pointer + spotlight + roughnotation + quiz + attribution
5) (Optional) chalkboard per-lecture
6) (Advanced) project type extension for course-wide consistency

---

### Quick “copy-paste install” block

```bash
# attention + emphasis
quarto add quarto-ext/pointer
quarto add mcanouil/quarto-spotlight
quarto add emilhvitfeldt/roughnotation

# engagement
quarto add samparmar/quiz

# clean crediting
quarto add quarto-ext/attribution
```

---
