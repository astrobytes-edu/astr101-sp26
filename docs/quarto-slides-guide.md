# Quarto RevealJS Slides Guide

A practical guide to creating polished, engaging presentations with Quarto and reveal.js. This covers the techniques that actually move the needle on visual polish *and* student engagement.

## 1. Authoring Workflow

### Write in Quarto Markdown (`.qmd`)

Headings define slides:
- `#` creates a section/title slide
- `##` creates a regular slide

```markdown
# Module 1: Foundations {.section}

## The Stefan-Boltzmann Law

Content for this slide...

## Applications

More content...
```

### Live Preview

Run live preview while editing—iterate at "thought speed":

```bash
quarto preview slides/lecture-01.qmd
```

Changes appear instantly in your browser.

### Editor Setup

**VS Code + Quarto Extension** (recommended):
- Render/preview commands via command palette
- In-IDE preview pane
- Syntax highlighting for Quarto markdown
- YAML autocompletion

**Quarto Visual Editor** (RStudio):
- WYSIWYM editing for tables, citations, divs/spans
- Good for complex layouts

---

## 2. Slide Structure

### Horizontal + Vertical Slides

Use **vertical stacks** for "optional deep dive" content you can skip live but keep for student review:

```markdown
## Core Concept {.center}

The main idea goes here.

::: {.notes}
Press down-arrow for derivation details
:::

## {.smaller}

### Derivation Details

Step-by-step math that some students want...

## {.smaller}

### Worked Example

Additional practice problem...

## Next Main Topic

Back to the main flow.
```

Vertical slides are reached by pressing **down** instead of **right**.

### Scroll View for Reading Mode

Enable scroll view for students reviewing on phones/tablets:

```yaml
---
format:
  revealjs:
    view: scroll
    scrollable: true
---
```

Or let users toggle it with the menu plugin (enabled by default).

---

## 3. Engagement Engines

### Fragments: Reveal Ideas Step-by-Step

Fragments are reveal.js's superpower. Use them to:
- Build arguments (premise → consequence → punchline)
- Reveal plot annotations one layer at a time
- Create think-pair-share prompts

**Basic fragments:**

```markdown
## The HR Diagram

::: {.incremental}
- Plot luminosity vs temperature
- Hot stars on the left, cool on right
- Most stars fall on the **main sequence**
- Giants above, white dwarfs below
:::
```

**Fragment with different animations:**

```markdown
::: {.fragment .fade-in}
First this appears...
:::

::: {.fragment .highlight-red}
Then this gets highlighted...
:::

::: {.fragment .fade-out}
And this disappears.
:::
```

**Available fragment types:**
- `.fade-in` (default)
- `.fade-out`
- `.fade-up`, `.fade-down`, `.fade-left`, `.fade-right`
- `.highlight-red`, `.highlight-blue`, `.highlight-green`
- `.strike` (strikethrough)
- `.grow`, `.shrink`
- `.semi-fade-out` (fades to 50%)

**Fragment order control:**

```markdown
::: {.fragment fragment-index=2}
This appears second
:::

::: {.fragment fragment-index=1}
This appears first
:::
```

**Fragments on images/figures:**

```markdown
## Building the Plot

![](plot-axes.png){.fragment fragment-index=1}

![](plot-data.png){.fragment fragment-index=2}

![](plot-fit.png){.fragment fragment-index=3}
```

### Speaker Notes

Press **S** for speaker view. Add notes so you're not reading off slides:

```markdown
## The Virial Theorem

$$2K + U = 0$$

::: {.notes}
- Ask: "What happens if we add energy?"
- Common misconception: students think adding heat makes it hotter
- Timing: spend 3 min here, this is the key insight
- If running short, skip the derivation slide
:::
```

### Chalkboard / Live Annotation

Enable drawing on slides or opening a blank board:

```yaml
---
format:
  revealjs:
    chalkboard: true
---
```

**Keyboard shortcuts:**
- `B` - toggle chalkboard (blank board)
- `C` - toggle canvas (draw on slide)
- `D` - download drawings
- `Del` - clear current slide drawings

**Chalkboard options:**

```yaml
---
format:
  revealjs:
    chalkboard:
      theme: whiteboard  # or chalkboard
      boardmarker-width: 3
      chalk-width: 4
---
```

> **Gotcha:** Chalkboard is incompatible with `embed-resources: true`. Quarto will error if you combine them.

### Multiplex (Audience Follow Mode)

Let your audience follow along on their own devices:

```yaml
---
format:
  revealjs:
    multiplex: true
---
```

Requires a multiplex server. See [Quarto multiplex docs](https://quarto.org/docs/presentations/revealjs/presenting.html#multiplex).

---

## 4. Visual Polish

### Themes

Built-in themes: `default`, `simple`, `dark`, `black`, `white`, `league`, `beige`, `sky`, `night`, `serif`, `solarized`, `blood`, `moon`

```yaml
---
format:
  revealjs:
    theme: simple
---
```

**Custom theme layer** (recommended approach):

```yaml
---
format:
  revealjs:
    theme: [simple, custom.scss]
---
```

Where `custom.scss` contains your brand colors and typography:

```scss
/*-- scss:defaults --*/
$presentation-heading-color: #1a365d;
$link-color: #2563eb;
$code-color: #0d9488;

/*-- scss:rules --*/
.reveal .slide-title {
  font-size: 1.8em;
  font-weight: 600;
}
```

### Footer and Logo

```yaml
---
format:
  revealjs:
    footer: "ASTR 201 • Dr. Rosen"
    logo: images/logo.png
---
```

**Disable footer on specific slides:**

```markdown
## Full-Bleed Image {.no-footer}

![](beautiful-nebula.jpg){.r-stretch}
```

### Slide Backgrounds

**Color backgrounds:**

```markdown
## Warning! {background-color="#dc2626"}

This is important.
```

**Image backgrounds:**

```markdown
## The Milky Way {background-image="milky-way.jpg" background-size="cover" background-opacity="0.3"}

Our home galaxy...
```

**Video backgrounds:**

```markdown
## {background-video="stars.mp4" background-video-loop="true" background-video-muted="true"}
```

**Iframe backgrounds (interactive):**

```markdown
## {background-iframe="https://example.com/visualization" background-interactive="true"}
```

> **Rules of thumb:**
> - Backgrounds should *increase* contrast, not reduce it
> - For dark images with light theme, set explicit `background-color` for text
> - Interactive iframes can hijack slide navigation—use carefully

### Content Overflow

When content doesn't fit:

**Smaller text on one slide:**

```markdown
## Lots of Content {.smaller}

This slide has reduced font size...
```

**Scrollable slide:**

```markdown
## Long Derivation {.scrollable}

Many lines of content...
```

**Both:**

```markdown
## Reference Table {.smaller .scrollable}

| Star | Mass | Radius | Luminosity |
|------|------|--------|------------|
| ... many rows ... |
```

---

## 5. Code and Figures

### Code Blocks

**Syntax highlighting:**

````markdown
```python
def luminosity(radius, temperature):
    """Stefan-Boltzmann law."""
    sigma = 5.67e-5  # erg/s/cm²/K⁴
    return 4 * np.pi * radius**2 * sigma * temperature**4
```
````

**Line highlighting** (huge pedagogy win):

````markdown
```{.python code-line-numbers="3-4"}
def luminosity(radius, temperature):
    """Stefan-Boltzmann law."""
    sigma = 5.67e-5  # erg/s/cm²/K⁴
    return 4 * np.pi * radius**2 * sigma * temperature**4
```
````

**Progressive line highlighting** (step through with fragments):

````markdown
```{.python code-line-numbers="|1-2|3|4"}
def luminosity(radius, temperature):
    """Stefan-Boltzmann law."""
    sigma = 5.67e-5  # erg/s/cm²/K⁴
    return 4 * np.pi * radius**2 * sigma * temperature**4
```
````

**Code with output placement:**

Default (output after code):
````markdown
```{python}
2 + 2
```
````

Output as fragment:
````markdown
```{python}
#| output-location: fragment
2 + 2
```
````

Output on next slide:
````markdown
```{python}
#| output-location: slide
import matplotlib.pyplot as plt
plt.plot([1, 2, 3])
```
````

Output in adjacent column:
````markdown
```{python}
#| output-location: column
import matplotlib.pyplot as plt
plt.plot([1, 2, 3])
```
````

### Figure Sizing

**Stretch to fill slide:**

```markdown
![](diagram.png){.r-stretch}
```

**Explicit dimensions:**

```markdown
![](plot.png){width="80%" fig-align="center"}
```

**For executable code:**

````markdown
```{python}
#| fig-width: 10
#| fig-height: 6
#| fig-align: center
import matplotlib.pyplot as plt
# ...
```
````

### Two-Column Layouts

```markdown
## Comparison

:::: {.columns}
::: {.column width="50%"}
**Before**

![](before.png)
:::

::: {.column width="50%"}
**After**

![](after.png)
:::
::::
```

With fragments:

```markdown
:::: {.columns}
::: {.column width="50%"}
![](plot1.png)
:::

::: {.column width="50%" .fragment}
![](plot2.png)
:::
::::
```

---

## 6. Transitions and Timing

### Slide Transitions

```yaml
---
format:
  revealjs:
    transition: fade
    transition-speed: fast
    background-transition: fade
---
```

Options: `none`, `fade`, `slide`, `convex`, `concave`, `zoom`

**Per-slide override:**

```markdown
## Dramatic Reveal {transition="zoom"}

Surprise!
```

### Auto-Advance

For kiosk mode or timed presentations:

```yaml
---
format:
  revealjs:
    auto-slide: 5000  # milliseconds
---
```

**Per-slide timing:**

```markdown
## Quick Point {auto-slide="2000"}

Just two seconds here.
```

---

## 7. Navigation and Controls

### Slide Numbers

```yaml
---
format:
  revealjs:
    slide-number: true  # or "c/t" for current/total
---
```

### Progress Bar

```yaml
---
format:
  revealjs:
    progress: true
---
```

### Menu Plugin

Enabled by default. Press `M` to open. Configure:

```yaml
---
format:
  revealjs:
    menu:
      side: left
      width: normal
---
```

### Keyboard Shortcuts Reference

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `↓` | Next vertical slide |
| `↑` | Previous vertical slide |
| `Esc` / `O` | Overview mode |
| `S` | Speaker view |
| `F` | Fullscreen |
| `B` | Chalkboard |
| `C` | Draw on slide |
| `M` | Menu |
| `?` | Help |

---

## 8. PDF Export

### Print to PDF

Add `?print-pdf` to the URL and print from browser:

```
http://localhost:4567/slides.html?print-pdf
```

### PDF via Quarto

```bash
quarto render slides.qmd --to pdf
```

Or in YAML:

```yaml
---
format:
  revealjs: default
  pdf: default
---
```

---

## 9. Slide Design Checklist

The deck looks great when these are true:

- [ ] **One idea per slide** (reveal.js gives you infinite slides—use them)
- [ ] **≤ 35 words per slide** (your mouth narrates; the slide provides visual evidence)
- [ ] Every major concept has at least one of:
  - [ ] A prediction question (before you reveal)
  - [ ] A fragment-based build
  - [ ] A "pause and compute/estimate" prompt
- [ ] Vertical stacks used for optional depth
- [ ] Speaker notes written for smooth delivery
- [ ] Code uses line highlighting to guide attention
- [ ] Figures sized appropriately (not too small, not overflowing)
- [ ] Consistent visual style throughout

---

## 10. ASTR 201 Starter Template

```yaml
---
title: "Lecture Title"
subtitle: "ASTR 201: Astronomy for Science Majors"
date: "2026-01-22"
format:
  revealjs:
    theme: [default, ../../../assets/slides/theme.scss]
    slide-number: true
    transition: fade
    background-transition: fade
    center: false
    footer: "ASTR 201 • Dr. Rosen"
    chalkboard: true
    code-line-numbers: true
    fig-align: center
    html-math-method: mathjax
---

## Learning Objectives

::: {.incremental}
- First objective
- Second objective
- Third objective
:::

## Key Concept {.center}

$$L = 4\pi R^2 \sigma T^4$$

::: {.fragment}
The Stefan-Boltzmann law connects **size** and **temperature** to **luminosity**.
:::

::: {.notes}
Ask students to predict: if we double the temperature, what happens to luminosity?
Answer: 16× (T⁴)
:::
```

---

## References

- [Quarto RevealJS Guide](https://quarto.org/docs/presentations/revealjs/)
- [Quarto Presenting Slides](https://quarto.org/docs/presentations/revealjs/presenting.html)
- [RevealJS Fragments](https://revealjs.com/fragments/)
- [RevealJS Vertical Slides](https://revealjs.com/vertical-slides/)
- [Quarto RevealJS Plugins](https://quarto.org/docs/extensions/revealjs.html)
- [ASTR 201 Slide Utilities](../assets/slides/README.md)
