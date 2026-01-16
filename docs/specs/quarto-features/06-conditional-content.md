# Conditional Content by Format

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

Your course materials serve multiple purposes:

- **Web version:** Students read online, click links, watch embedded videos
- **PDF version:** Students print for offline study, take to exams
- **RevealJS slides:** You present in class

These formats have fundamentally different capabilities:

| Capability | HTML (Web) | PDF | RevealJS |
|------------|------------|-----|----------|
| Play videos | Yes | No | Yes |
| Interactive widgets | Yes | No | Yes |
| Clickable links | Yes | Depends on viewer | Yes |
| Page breaks | No (infinite scroll) | Yes | No (slides) |
| Print-friendly | No | Yes | No |
| Animations | Yes | No | Yes |

**Without conditional content:**

- You embed a YouTube video
- The PDF shows a broken iframe or nothing at all
- Students printing the PDF don't even know a video exists

**With conditional content:**

- Web: embedded video player
- PDF: "Watch the video at [URL]" with a screenshot
- Same source file, format-appropriate output

---

## How Conditional Content Works Mechanically

Quarto provides fenced divs that conditionally include or exclude content based on the output format:

```markdown
::: {.content-visible when-format="html"}
This content ONLY appears in HTML output.
:::

::: {.content-visible when-format="pdf"}
This content ONLY appears in PDF output.
:::

::: {.content-hidden when-format="pdf"}
This content appears in EVERYTHING EXCEPT PDF.
:::
```

**The processing flow:**

```
┌─────────────────────────────────────────────────────────────┐
│                    Your .qmd file                           │
│                                                             │
│  ::: {.content-visible when-format="html"}                 │
│  <iframe src="https://youtube.com/..."></iframe>           │
│  :::                                                        │
│                                                             │
│  ::: {.content-visible when-format="pdf"}                  │
│  *See the course website for the video.*                   │
│  :::                                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
          │                              │
          │ quarto render                │ quarto render
          │ (HTML output)                │ --to pdf
          ▼                              ▼
┌─────────────────────┐      ┌─────────────────────┐
│   HTML output       │      │   PDF output        │
│                     │      │                     │
│   [Embedded video   │      │   *See the course   │
│    player]          │      │    website for      │
│                     │      │    the video.*      │
└─────────────────────┘      └─────────────────────┘
```

---

## Complete Syntax Reference

### Show content only in specific format

```markdown
::: {.content-visible when-format="html"}
This only appears in HTML.
:::

::: {.content-visible when-format="pdf"}
This only appears in PDF.
:::

::: {.content-visible when-format="revealjs"}
This only appears in RevealJS slides.
:::
```

### Hide content from specific format

```markdown
::: {.content-hidden when-format="pdf"}
This appears everywhere EXCEPT PDF.
(Good for interactive content that works in HTML and RevealJS)
:::

::: {.content-hidden when-format="html"}
This appears everywhere EXCEPT HTML.
(Rare, but possible)
:::
```

### Multiple formats

```markdown
::: {.content-visible when-format="html,revealjs"}
This appears in HTML and RevealJS, but not PDF.
:::
```

---

## Common Patterns with Full Examples

### Pattern 1: Videos

Videos work on web but not in PDFs. Provide alternative for print:

```markdown
## Stellar Evolution Animation

::: {.content-visible when-format="html"}
Watch this animation showing how a sun-like star evolves:

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
  allowfullscreen>
</iframe>
:::

::: {.content-visible when-format="pdf"}
**Video:** Stellar Evolution Animation

*This animation is available on the course website at:*
*https://your-course-site.edu/modules/module-03.html#stellar-evolution*

The animation shows:

1. Main sequence phase (stable hydrogen burning)
2. Red giant expansion (shell burning begins)
3. Helium flash (core ignition)
4. Asymptotic giant branch (double shell burning)
5. Planetary nebula ejection (envelope loss)
6. White dwarf remnant (final cooling)
:::
```

### Pattern 2: Interactive Widgets

Observable JS or other interactive elements need JavaScript:

````markdown
## Blackbody Radiation Explorer

::: {.content-visible when-format="html"}
Use the slider to change the temperature and see how the spectrum changes:

```{ojs}
viewof temperature = Inputs.range([2000, 20000], {
  step: 100,
  value: 5800,
  label: "Temperature (K)"
})

// Plot blackbody curve
Plot.plot({
  marks: [
    Plot.line(blackbodySpectrum(temperature), {x: "wavelength", y: "intensity"})
  ],
  x: {label: "Wavelength (nm)"},
  y: {label: "Intensity (arbitrary units)"}
})
```
:::

::: {.content-visible when-format="pdf"}
**Interactive Widget:** Blackbody Radiation Explorer

*An interactive version of this diagram is available on the course website.*
*You can adjust the temperature and see the spectrum change in real time.*

![Blackbody spectra at different temperatures](figures/blackbody-static.png){width="80%"}

**Key observations from the interactive:**

- Higher temperature -> peak shifts to shorter wavelengths (Wien's law)
- Higher temperature -> more total radiation (Stefan-Boltzmann law)
- The Sun (5800 K) peaks in the visible range--not a coincidence!
:::
````

### Pattern 3: Different Image Versions

High-resolution images for web, optimized versions for print:

```markdown
## The Hertzsprung-Russell Diagram

::: {.content-visible when-format="html"}
![Interactive H-R Diagram](figures/hr-diagram-interactive.svg){width="100%"}

*Click to enlarge. Hover over points to see star names and properties.*
:::

::: {.content-visible when-format="pdf"}
![H-R Diagram](figures/hr-diagram-print.pdf){width="5in"}

*Note: An interactive version with clickable stars is available on the
course website.*
:::
```

### Pattern 4: PDF-Only Content

Some things only make sense in print:

```markdown
## Course Schedule

[Schedule content here]

::: {.content-visible when-format="pdf"}
\newpage

## Formula Sheet

*This page intentionally included for exam reference.*

**Fundamental Constants:**

| Constant | Symbol | Value |
|----------|--------|-------|
| Speed of light | c | 3.00 x 10^8 m/s |
| Gravitational constant | G | 6.67 x 10^-11 N m^2/kg^2 |
| Stefan-Boltzmann | sigma | 5.67 x 10^-8 W m^-2 K^-4 |
| Planck's constant | h | 6.63 x 10^-34 J s |

**Key Equations:**

- Stefan-Boltzmann Law: L = 4*pi*R^2*sigma*T^4
- Wien's Law: lambda_peak = 2.9 x 10^-3 / T meters
- Schwarzschild Radius: R_s = 2GM/c^2

\newpage
:::
```

### Pattern 5: Slide-Specific Content

Content that only makes sense in presentation mode:

```markdown
## Key Takeaways

::: {.content-visible when-format="revealjs"}
::: {.incremental}
- Stars are powered by nuclear fusion
- The Sun converts 4 million tons of mass to energy every second
- This will continue for another 5 billion years
:::

::: {.notes}
Speaker notes: Emphasize the 4 million tons number--students find this
surprising. Mention that despite this enormous rate, the Sun has barely
changed in 4.5 billion years.
:::
:::

::: {.content-hidden when-format="revealjs"}
**Key Takeaways:**

- Stars are powered by nuclear fusion in their cores
- The Sun converts 4 million tons of mass to energy every second
- Despite this enormous rate, the Sun will continue for another 5 billion years
:::
```

---

## Format Detection in Executable Code

For Python or R code blocks that need to behave differently:

```{python}
#| echo: false

import os

# Quarto sets QUARTO_FMT environment variable
output_format = os.environ.get('QUARTO_FMT', 'html')

if output_format == 'html':
    # Generate interactive plot with Plotly
    import plotly.express as px
    fig = px.scatter(data, x='temp', y='luminosity',
                     hover_data=['name'],
                     title='H-R Diagram')
    fig.show()

elif output_format == 'pdf':
    # Generate static plot with Matplotlib
    import matplotlib.pyplot as plt
    plt.scatter(data['temp'], data['luminosity'])
    plt.xlabel('Temperature (K)')
    plt.ylabel('Luminosity (L_sun)')
    plt.title('H-R Diagram')
    plt.savefig('hr-diagram.png', dpi=150)
    plt.show()
```

---

## Common Pitfalls

### 1. Forgetting the closing `:::`

```markdown
::: {.content-visible when-format="html"}
Some content
<!-- WRONG: Missing closing ::: -->

::: {.content-visible when-format="html"}
Some content
:::
<!-- CORRECT -->
```

### 2. Nesting issues

```markdown
::: {.content-visible when-format="html"}
::: {.callout-note}
<!-- This works - but be careful with nesting -->
:::
:::
```

### 3. Format name typos

```markdown
<!-- WRONG -->
::: {.content-visible when-format="HTML"}
::: {.content-visible when-format="web"}

<!-- CORRECT -->
::: {.content-visible when-format="html"}
```

### 4. Forgetting PDF viewers have limited interactivity

Even "clickable" links in PDFs depend on the reader application. Always provide full URLs in print versions.

---

## Next Steps

- [Cross-References](07-cross-references.md) — Auto-numbered figures, tables, equations
- [Profiles](05-profiles.md) — Audience-specific rendering (student vs instructor)
