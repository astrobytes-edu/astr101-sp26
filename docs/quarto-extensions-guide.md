# Quarto RevealJS Extensions Guide

A curated set of extensions for ASTR 201 lectures. This stack emphasizes **clarity**, **attention direction**, and **active learning**—not gimmicks.

## Installed Extensions

| Extension | Purpose | Keyboard |
|-----------|---------|----------|
| **Pointer** | Laser pointer cursor | `Q` |
| **Spotlight** | Highlight around cursor | Mouse hold |
| **Attribution** | Image credits along slide edge | — |
| **RoughNotation** | Hand-drawn animated annotations | `R` |
| **Quiz** | In-slide multiple choice questions | `C` check, `T` shuffle |

---

## Quick Start: Enable in Slides

Add extensions to your slide YAML frontmatter:

```yaml
---
title: "Lecture Title"
format:
  revealjs:
    theme: [default, ../../../assets/slides/theme.scss]
revealjs-plugins:
  - pointer
  - spotlight
  - attribution
  - quiz
filters:
  - roughnotation
---
```

**Note:** RoughNotation is a *filter*, not a plugin—it goes in `filters:`, not `revealjs-plugins:`.

---

## 1. Pointer

Turns your cursor into a presentation pointer. Essential for "look here" moments.

### Usage

Press **`Q`** to toggle the pointer on/off.

### Configuration

```yaml
format:
  revealjs:
    pointer:
      key: "q"           # Toggle key
      color: "red"       # Pointer color
      pointerSize: 16    # Size in pixels
      alwaysVisible: false
```

### When to Use

- Drawing attention to specific parts of equations
- Pointing at features in plots or images
- Guiding eyes during derivations

---

## 2. Spotlight

Creates a spotlight effect around your cursor, dimming everything else. Powerful for dense slides.

### Usage

**Hold down mouse button** to activate spotlight. Release to deactivate.

### Configuration

```yaml
format:
  revealjs:
    spotlight:
      size: 60                        # Spotlight radius (pixels)
      toggleSpotlightOnMouseDown: true
      initialPresentationMode: true
      fadeInAndOut: 100               # Transition ms (false to disable)
      useAsPointer: false             # Alternative: pointer mode
      pointerColor: "red"             # If useAsPointer: true
```

### When to Use

- Highlighting specific data points on crowded plots
- Focusing on one term in a long equation
- Walking through complex diagrams step-by-step

### Pro Tip

Use spotlight for *sustained* attention (walking through details) and pointer for *quick* attention (brief references).

---

## 3. Attribution

Adds attribution text along the slide edge—perfect for crediting astronomy images without cluttering the slide.

### Usage

Add `data-attribution` to images or slides:

```markdown
## The Orion Nebula {background-image="orion.jpg"}

::: {data-attribution="NASA/ESA/Hubble"}
:::
```

Or on individual images:

```markdown
![](crab-nebula.jpg){data-attribution="NASA/CXC/SAO"}
```

### Position Options

```markdown
::: {data-attribution="Credit" data-attribution-position="bottom right"}
:::
```

Positions: `top left`, `top right`, `bottom left`, `bottom right` (default)

### When to Use

- All astronomy imagery (always credit!)
- Plots from papers or textbooks
- Diagrams you didn't create

---

## 4. RoughNotation

Adds hand-drawn style annotations that animate in. Excellent for revealing emphasis during lecture.

### Basic Usage

Wrap text in a span with class `.rn`:

```markdown
The [Stefan-Boltzmann law]{.rn} tells us...
```

Press **`R`** to trigger the annotation on the current slide.

### Annotation Types

```markdown
[highlight this]{.rn rn-type="highlight"}
[box around this]{.rn rn-type="box"}
[underline this]{.rn rn-type="underline"}
[circle this]{.rn rn-type="circle"}
[strike through]{.rn rn-type="strike-through"}
[crossed off]{.rn rn-type="crossed-off"}
[bracket this]{.rn rn-type="bracket"}
```

### Styling Options

```markdown
[important]{.rn rn-type="highlight" rn-color="#ff6b6b"}
[key term]{.rn rn-type="underline" rn-color="#4ecdc4" rn-strokewidth="3"}
[equation]{.rn rn-type="box" rn-animate="true" rn-animationduration="1200"}
```

Available data attributes:
- `rn-type`: highlight, box, underline, circle, strike-through, crossed-off, bracket
- `rn-color`: Any CSS color (default: `#fff17680` - yellow highlight)
- `rn-strokewidth`: Line thickness in pixels (default: 1)
- `rn-animate`: true/false (default: true)
- `rn-animationduration`: milliseconds (default: 800)
- `rn-multiline`: true/false for multi-line text
- `rn-iterations`: Number of drawing iterations (rougher = more)

### Sequential Annotations

Use `rn-index` to control order (press `R` multiple times):

```markdown
[First this appears]{.rn rn-index="1" rn-type="highlight"}

[Then this]{.rn rn-index="2" rn-type="box"}

[Finally this]{.rn rn-index="3" rn-type="underline"}
```

### Example: Unpacking an Equation

```markdown
## The Stefan-Boltzmann Law

$$L = 4\pi R^2 \sigma T^4$$

::: {.incremental}
- [$L$]{.rn rn-index="1" rn-type="circle" rn-color="#ff6b6b"} is luminosity (total power output)
- [$R^2$]{.rn rn-index="2" rn-type="box" rn-color="#4ecdc4"} is radius squared (surface area)
- [$T^4$]{.rn rn-index="3" rn-type="underline" rn-color="#ffe66d"} is temperature to the fourth power
:::

::: {.notes}
Press R three times to highlight each term in sequence
:::
```

### When to Use

- Highlighting key terms during explanation
- Walking through equations term by term
- Emphasizing "this is the punchline" moments
- Marking common misconceptions

---

## 5. Quiz

Embeds multiple-choice questions directly in slides for retrieval practice.

### Basic Syntax

```markdown
## Concept Check

::: {.quiz}
What happens to luminosity if you double a star's temperature?

- [ ] It doubles
- [ ] It quadruples
- [x] It increases by 16×
- [ ] It stays the same
:::
```

The `[x]` marks the correct answer.

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Check answer (reveal correct/incorrect) |
| `Q` | Reset quiz |
| `T` | Shuffle options |
| `1-4` | Select option by number |

### Configuration

```yaml
format:
  revealjs:
    quiz:
      checkKey: "c"
      resetKey: "q"
      shuffleKey: "t"
      allowNumberKeys: true
      shuffleOptions: true       # Randomize order each time
      disableOnCheck: false      # Lock after checking
      includeScore: false        # Show running score
```

### Multiple Questions Per Slide

```markdown
## Quick Checks

::: {.quiz}
Question 1?
- [ ] Wrong
- [x] Right
:::

::: {.quiz}
Question 2?
- [x] Correct
- [ ] Incorrect
:::
```

### Feedback Messages

```yaml
format:
  revealjs:
    quiz:
      defaultCorrect: "✓ Correct!"
      defaultIncorrect: "✗ Try again"
```

### When to Use

- Think-pair-share prompts
- Checking understanding before moving on
- End-of-section review
- Pre-testing before introducing concepts

### Pro Tips

1. **Don't overdo it** — 1-2 quizzes per lecture maximum
2. **Use for retrieval, not gotchas** — test understanding, not trick questions
3. **Allow discussion time** — pause after showing the question
4. **Shuffle options** — prevents "it's always C" pattern recognition

---

## Built-in Features (No Extension Needed)

These are native Quarto/reveal.js features—just enable in YAML:

### Chalkboard

```yaml
format:
  revealjs:
    chalkboard: true
```

| Key | Action |
|-----|--------|
| `B` | Toggle blank chalkboard |
| `C` | Toggle drawing on slide |
| `D` | Download drawings |
| `Del` | Clear current slide |

**⚠️ Warning:** Chalkboard is incompatible with `embed-resources: true`.

### Menu

Enabled by default. Press `M` to open slide menu for navigation.

### Slide Numbers

```yaml
format:
  revealjs:
    slide-number: true     # or "c/t" for current/total
    progress: true         # progress bar at bottom
```

---

## ASTR 201 Recommended Configuration

Here's a complete YAML header using the curated stack:

```yaml
---
title: "Lecture N: Topic"
subtitle: "ASTR 201: Astronomy for Science Majors"
date: "2026-XX-XX"
format:
  revealjs:
    theme: [default, ../../../assets/slides/theme.scss]
    slide-number: true
    transition: fade
    transition-speed: fast
    center: false
    footer: "ASTR 201 • Dr. Rosen"
    chalkboard: true
    code-line-numbers: true
    fig-align: center
    html-math-method: mathjax
    # Extension configurations
    pointer:
      color: "#dc2626"
      pointerSize: 18
    spotlight:
      size: 80
      fadeInAndOut: 150
    quiz:
      shuffleOptions: true
      defaultCorrect: "✓ Correct!"
      defaultIncorrect: "✗ Not quite—let's discuss."
revealjs-plugins:
  - pointer
  - spotlight
  - attribution
  - quiz
filters:
  - roughnotation
---
```

---

## Extension Combinations

### "Look at This" Flow

1. Use **pointer** (`Q`) for quick references
2. Use **spotlight** (mouse hold) for sustained attention
3. Use **roughnotation** (`R`) for permanent emphasis

### "Active Learning" Flow

1. Show **quiz** question
2. Give think time (30 sec)
3. Check answers (`C`)
4. Use **roughnotation** to highlight the key concept
5. Use **chalkboard** (`C`) to annotate further if needed

### "Image Walk-Through" Flow

1. Full-bleed astronomy image with **attribution**
2. Use **spotlight** to highlight features
3. Use **roughnotation** to label key elements
4. Press `R` repeatedly to build up annotations

---

## Troubleshooting

### Extensions not loading?

1. Check `_extensions/` directory exists and is committed
2. Verify extension name matches exactly in YAML
3. RoughNotation goes in `filters:`, others in `revealjs-plugins:`

### Chalkboard not working?

Check if `embed-resources: true` is set—they're incompatible.

### Quiz not responding to keys?

Make sure you've clicked on the slide (focused) first.

### RoughNotation not triggering?

1. Verify text has `.rn` class
2. Press `R` (capital R)
3. Check browser console for errors

---

## References

- [Quarto RevealJS Extensions](https://quarto.org/docs/extensions/listing-revealjs.html)
- [Pointer Extension](https://github.com/quarto-ext/pointer)
- [Spotlight Extension](https://github.com/mcanouil/quarto-spotlight)
- [Attribution Extension](https://github.com/quarto-ext/attribution)
- [RoughNotation Extension](https://github.com/EmilHvitfeldt/quarto-roughnotation)
- [Quiz Extension](https://github.com/parmsam/quarto-quiz)
