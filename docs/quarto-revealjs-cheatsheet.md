# Quarto RevealJS Slides Cheatsheet

**The Right Way to Do Things — ASTR 101**

---

## Table of Contents

1. [Slide Structure](#slide-structure)
2. [Columns](#columns--the-correct-way)
3. [Images](#images--the-correct-way)
4. [Layout Classes](#layout-classes-revealjs-specific)
5. [Fragments](#fragments-progressive-reveal)
6. [Speaker Notes](#speaker-notes)
7. [Backgrounds](#backgrounds)
8. [Absolute Positioning](#absolute-positioning)
9. [Tables](#tables)
10. [Videos](#videos)
11. [Diagrams](#diagrams-mermaid--graphviz)
12. [Callouts](#callouts)
13. [Shortcodes](#shortcodes)
14. [Code Annotations](#code-annotations)
15. [Common Mistakes](#common-mistakes-to-avoid)

---

## Slide Structure

```markdown
---
title: "Presentation Title"
format: revealjs
---

## Slide Title

Content here

## Another Slide

More content

---

## {background-color="black"}

Untitled slide with background
```

**Rules:**
- `##` creates a new slide
- `#` creates a section title slide
- `---` creates an untitled slide
- Omit title text but keep `##` for backgrounds on untitled slides

---

## Columns — THE CORRECT WAY

```markdown
:::: {.columns}

::: {.column width="50%"}
Left content
:::

::: {.column width="50%"}
Right content
:::

::::
```

**Rules:**
- Outer div uses `.columns` class (4+ colons)
- Inner divs use `.column` class with `width` attribute
- `width` is a **Pandoc attribute**, NOT CSS — use `width="50%"` not `style="width: 50%"`
- Widths should add up to ~100%
- **Blank lines required** between divs

**DO NOT DO THIS:**
```markdown
::: {.column width="50%" style="display: flex;"}  <!-- WRONG: mixing systems -->
```

If you need flex centering inside a column, nest another div:
```markdown
::: {.column width="50%"}
::: {style="display: flex; justify-content: center;"}
Content to center
:::
:::
```

---

## Images — THE CORRECT WAY

**Basic image:**
```markdown
![Alt text](path/to/image.png)
```

**With sizing:**
```markdown
![Alt text](path/to/image.png){width="80%"}
![Alt text](path/to/image.png){width=400}
![Alt text](path/to/image.png){height="300px"}
```

**Centered image:**
```markdown
![Alt text](path/to/image.png){fig-align="center" width="80%"}
```

**Image without caption (for slides):**
```markdown
![](path/to/image.png){width="100%"}
```

**Stretch image to fill remaining space:**
```markdown
![](image.png){.r-stretch}
```

**Multiple images in layout:**
```markdown
::: {layout-ncol=2}
![Caption A](img1.png)

![Caption B](img2.png)
:::
```

**Grid layout:**
```markdown
::: {layout="[[1,1], [1]]"}
![](img1.png)

![](img2.png)

![](img3.png)
:::
```

Numbers are relative widths. `[[1,1], [1]]` = two images top row (equal), one bottom (full).

**DO NOT use inline styles on images.** Use Pandoc attributes:
- `width="X"` or `width=X`
- `height="X"` or `height=X`
- `fig-align="center"` / `"left"` / `"right"`

---

## Layout Classes (RevealJS specific)

| Class | What it does |
|-------|--------------|
| `.r-stretch` | Stretches element to fill remaining vertical space |
| `.r-fit-text` | Makes text as large as possible without overflow |
| `.r-stack` | Stacks elements on top of each other (centered) |
| `.center` | Vertically centers slide content |
| `.smaller` | Reduces font size for dense content |
| `.scrollable` | Enables scrolling on overflow |

**Using r-stretch for images:**
```markdown
## Slide Title

![](image.png){.r-stretch}

Caption text below
```

**Using r-fit-text:**
```markdown
::: {.r-fit-text}
Big Text
:::
```

**Stacking elements (for animation):**
```markdown
::: {.r-stack}
![](img1.png){.fragment}

![](img2.png){.fragment}

![](img3.png){.fragment}
:::
```

---

## Fragments (Progressive Reveal)

**Pause syntax (simplest):**
```markdown
## Slide

Content before pause

. . .

Content after pause
```

**Fragment class:**
```markdown
::: {.fragment}
This appears on click
:::

::: {.fragment .fade-up}
This fades up on click
:::
```

**Incremental lists:**
```markdown
::: {.incremental}
- First item (appears on click)
- Second item (appears on click)
- Third item (appears on click)
:::
```

**Fragment effects:**
- `.fade-in` (default), `.fade-out`, `.fade-up`, `.fade-down`
- `.fade-left`, `.fade-right`, `.fade-in-then-out`, `.fade-in-then-semi-out`
- `.grow`, `.shrink`, `.strike`
- `.highlight-red`, `.highlight-blue`, `.highlight-green`
- `.highlight-current-red`, `.highlight-current-blue`, `.highlight-current-green`

**Fragment order control:**
```markdown
::: {.fragment fragment-index=2}
This appears second
:::

::: {.fragment fragment-index=1}
This appears first
:::
```

---

## Speaker Notes

```markdown
## Slide Title

Visible content

::: {.notes}
Speaker notes here — only visible in speaker view (press S).
:::
```

**Note:** Speaker notes cannot contain external dependencies (Mermaid diagrams, etc.).

---

## Backgrounds

**Color:**
```markdown
## Title {background-color="black"}
## Title {background-color="#1a1a2e"}
```

**Image:**
```markdown
## Title {background-image="path/to/image.jpg" background-opacity="0.5"}
```

**Available background attributes:**
- `background-image` — path to image
- `background-size` — `"cover"`, `"contain"`, `"100px"`
- `background-position` — `"center"`, `"top left"`
- `background-repeat` — `"no-repeat"`, `"repeat"`
- `background-opacity` — 0 to 1

**Video background:**
```markdown
## {background-video="video.mp4" background-video-loop="true" background-video-muted="true"}
```

**Iframe background:**
```markdown
## {background-iframe="https://example.com"}
```

---

## Absolute Positioning

```markdown
## Slide

![](image1.png){.absolute top=50 left=50 width="200"}

![](image2.png){.absolute bottom=50 right=50 width="200"}
```

Default slide dimensions: 1050×700 pixels. Values without units are pixels.

---

## Tables

**Pipe table (simplest):**
```markdown
| Left | Center | Right |
|:-----|:------:|------:|
| L    |   C    |     R |
| data |  data  |  data |
```

Alignment: `:---` left, `:---:` center, `---:` right

**With caption:**
```markdown
| Col A | Col B |
|-------|-------|
| 1     | 2     |

: Table caption {.striped}
```

**Styling classes** (add to caption):
- `.striped` — alternating row colors
- `.hover` — highlight on hover
- `.bordered` — visible borders
- `.sm` — smaller text

**Grid table (for complex content):**
```markdown
+---------------+---------------+
| Header 1      | Header 2      |
+===============+===============+
| Cell with     | Simple cell   |
| - bullet      |               |
| - list        |               |
+---------------+---------------+
```

---

## Videos

**YouTube:**
```markdown
{{< video https://youtu.be/VIDEO_ID >}}
{{< video https://www.youtube.com/watch?v=VIDEO_ID >}}
```

**With options:**
```markdown
{{< video https://youtu.be/VIDEO_ID width="800" height="450" >}}
{{< video https://youtu.be/VIDEO_ID aspect-ratio="16x9" >}}
{{< video https://youtu.be/VIDEO_ID start="30" >}}
```

**Aspect ratios:** `16x9` (default), `4x3`, `21x9`, `1x1`

**Local video:**
```markdown
{{< video local-video.mp4 >}}
```

**Video as figure with caption:**
```markdown
::: {#fig-demo}
{{< video video.mp4 >}}

Video caption here
:::
```

**Full-screen video background:**
```markdown
## {background-video="video.mp4" background-video-loop="true" background-video-muted="true"}
```

---

## Diagrams (Mermaid & GraphViz)

**Mermaid flowchart:**
````markdown
```{mermaid}
flowchart LR
  A[Start] --> B{Decision}
  B -->|Yes| C[Result 1]
  B -->|No| D[Result 2]
```
````

**Mermaid sequence diagram:**
````markdown
```{mermaid}
sequenceDiagram
  Alice->>Bob: Hello
  Bob-->>Alice: Hi back
```
````

**With sizing:**
````markdown
```{mermaid}
%%| fig-width: 6
%%| fig-cap: "My diagram"
flowchart LR
  A --> B
```
````

**GraphViz:**
````markdown
```{dot}
//| fig-cap: "Graph"
digraph G {
  A -> B -> C
}
```
````

**Theming (in YAML header):**
```yaml
format:
  revealjs:
    mermaid:
      theme: forest  # default, dark, forest, neutral
```

---

## Callouts

### Standard Quarto Callouts

```markdown
::: {.callout-note}
Note content
:::

::: {.callout-tip}
Tip content
:::

::: {.callout-warning}
Warning content
:::

::: {.callout-important}
Important content
:::

::: {.callout-caution}
Caution content
:::
```

**With title:**
```markdown
::: {.callout-tip title="Pro Tip"}
Content here
:::
```

**Collapsible:**
```markdown
::: {.callout-note collapse="true"}
## Click to expand
Hidden content
:::
```

**Appearance options:** `default`, `simple`, `minimal`
```markdown
::: {.callout-note appearance="minimal"}
Minimal styling
:::
```

### ASTR 101 Custom Callouts

| Class | Purpose | Icon |
|-------|---------|------|
| `.callout-hero` | Start Here prominence | — |
| `.callout-problem` | Structural question | Puzzle |
| `.callout-solution` | Key result (rare!) | Check |
| `.callout-sanity-check` | Verification | Calculator |
| `.callout-tps` | Think-Pair-Share | Chat |
| `.callout-frontier` | Open questions | Diamond |
| `.callout-check-yourself` | Retrieval practice | Hand |
| `.callout-deep-dive` | Advanced (collapsible) | Telescope |
| `.callout-worked-example` | Step-by-step | Pencil |
| `.callout-key-insight` | Core takeaway | Lightbulb |
| `.callout-misconception` | Common error | Warning |
| `.callout-the-more-you-know` | Optional info | Info |
| `.callout-why-this-matters` | Motivation | Bullseye |
| `.callout-roadmap` | Navigation | Signpost |
| `.callout-prediction` | Pre-reading prompt | Question |
| `.callout-summary` | Section wrap-up | Checklist |

**Usage:**
```markdown
::: {.callout-key-insight}
The key insight content here.
:::

::: {.callout-check-yourself}
Can you explain X in your own words?
:::
```

---

## Shortcodes

### Built-in Shortcodes

**Include another file:**
```markdown
{{< include _content.qmd >}}
```

**Embed notebook cell:**
```markdown
{{< embed notebook.ipynb#fig-plot >}}
```

**Metadata value:**
```markdown
{{< meta title >}}
```

**Variable from _variables.yml:**
```markdown
{{< var semester >}}
```

**Keyboard shortcut:**
```markdown
{{< kbd Shift-Ctrl-P >}}
```

**Page break:**
```markdown
{{< pagebreak >}}
```

### ASTR 101 Custom Shortcodes

**Figure from registry:**
```markdown
{{< fig figure-id >}}
{{< fig figure-id caption="Custom caption" >}}
```

**Image without caption (slides):**
```markdown
{{< img figure-id >}}
{{< img figure-id width="80%" >}}
```

**Media/video from registry:**
```markdown
{{< media video-id >}}
```

---

## Code Annotations

**Annotate code lines:**
````markdown
```python
x = 1       # <1>
y = x + 2   # <2>
print(y)    # <3>
```

1. Initialize x
2. Calculate y
3. Output result
````

**Display styles** (in YAML):
```yaml
code-annotations: hover  # below (default), hover, select
```

---

## Div Nesting Rules

1. **More colons = outer container**
2. **Blank lines required** between divs and surrounding content
3. **Attribute order matters:** `{#id .class key="value"}`

```markdown
::::: {.outer}

:::: {.middle}

::: {.inner}
Content
:::

::::

:::::
```

---

## Common Mistakes to Avoid

### 1. Mixing Pandoc attributes with CSS styles
```markdown
<!-- WRONG -->
::: {.column width="50%" style="width: 50%;"}

<!-- RIGHT -->
::: {.column width="50%"}
```

### 2. Using style attribute on images
```markdown
<!-- WRONG -->
![](img.png){style="width: 80%;"}

<!-- RIGHT -->
![](img.png){width="80%"}
```

### 3. Forgetting blank lines around divs
```markdown
<!-- WRONG -->
::: {.fragment}
Content
:::
More content

<!-- RIGHT -->
::: {.fragment}
Content
:::

More content
```

### 4. Wrong attribute order
```markdown
<!-- WRONG -->
::: {.class #id key="val"}

<!-- RIGHT -->
::: {#id .class key="val"}
```

### 5. Trying to use flexbox on Pandoc divs
Pandoc's div system doesn't directly support inline CSS the way you expect. If you need complex layouts:
- Use the built-in `.columns` / `.column` system
- Use absolute positioning with `.absolute`
- Use `layout-ncol` for grids
- Nest a style div inside the Pandoc div

### 6. Videos not working in slides
- Use `{{< video URL >}}` shortcode, NOT raw HTML
- For background videos, use slide attributes: `{background-video="..."}`

### 7. Incremental lists not working
```markdown
<!-- WRONG - no blank lines -->
::: {.incremental}
- Item 1
- Item 2
:::

<!-- RIGHT -->
::: {.incremental}

- Item 1
- Item 2

:::
```

---

## Quick Reference: Complete Slide Example

```markdown
## Slide Title {background-color="#1a1a2e"}

:::: {.columns}

::: {.column width="60%"}
![](image.png){width="100%"}
:::

::: {.column width="40%"}
Opening text here.

::: {.fragment}
- First point
- Second point
:::

::: {.fragment}
**Key takeaway:** Important conclusion.
:::
:::

::::

::: {.notes}
Speaker notes:
- Mention X
- Emphasize Y
- Skip Z if short on time
:::
```
