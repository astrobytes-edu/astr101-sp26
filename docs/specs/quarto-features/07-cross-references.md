# Cross-References

**Part of:** [Quarto Features for Course Websites](README.md)

---

## Why This Matters

Academic writing requires numbered references to figures, tables, equations, and sections. Without automation, you face two terrible options:

**Option 1: Manual numbering (maintenance nightmare)**

```markdown
See Figure 3 for the H-R diagram.
...
As shown in Table 2...
...
Recall Equation 7 from the previous section...
```

Then you insert a new figure between Figure 2 and Figure 3. Now you must:

- Renumber Figure 3 → Figure 4
- Renumber Figure 4 → Figure 5
- Update every reference: "See Figure 3" → "See Figure 4"
- Repeat for all subsequent figures
- Hope you didn't miss any

One new figure can require 20+ manual edits. Miss one, and students see "See Figure 3" pointing at the wrong diagram.

**Option 2: No numbers (poor UX)**

```markdown
See the H-R diagram below.
...
As shown in the temperature table...
```

This works until you have multiple H-R diagrams or multiple tables. Then "the table below" becomes ambiguous.

**With cross-references:**

```markdown
See @fig-hr-diagram for the H-R diagram.
...
As shown in @tbl-temperatures...
...
Recall @eq-stefan-boltzmann from @sec-radiation...
```

Insert a new figure? Quarto renumbers everything automatically. Your references always point to the correct target. Zero maintenance.

---

## How Cross-References Work Mechanically

Cross-references have two parts:

1. **Label:** A unique identifier attached to a figure, table, equation, or section
2. **Reference:** A pointer to that label elsewhere in the document

```
┌─────────────────────────────────────────────────────────────┐
│                     Your .qmd file                          │
│                                                             │
│  ## Stellar Properties {#sec-stellar}                       │
│                                                             │
│  ![H-R Diagram](figures/hr.png){#fig-hr}                   │
│                                                             │
│  As shown in @fig-hr, stars cluster...                     │
│  See @sec-radiation for background on @eq-stefan.          │
│                                                             │
│  ## Radiation Physics {#sec-radiation}                      │
│                                                             │
│  $$L = 4\pi R^2 \sigma T^4$$ {#eq-stefan}                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Quarto renders
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Rendered HTML                            │
│                                                             │
│  1  Stellar Properties                                     │
│                                                             │
│  Figure 1: H-R Diagram                                     │
│  [image]                                                   │
│                                                             │
│  As shown in Figure 1, stars cluster...                    │
│  See Section 2 for background on Equation 1.               │
│                                                             │
│  2  Radiation Physics                                       │
│                                                             │
│  L = 4πR²σT⁴                                   (1)         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**The key insight:** You write `@fig-hr` once. Quarto tracks what number that figure is and substitutes the correct number everywhere it's referenced.

---

## Label Syntax

Labels follow a strict pattern: `{#prefix-name}`

| Element | Prefix | Example Label | Reference |
|---------|--------|---------------|-----------|
| Figure | `fig-` | `{#fig-hr-diagram}` | `@fig-hr-diagram` |
| Table | `tbl-` | `{#tbl-temperatures}` | `@tbl-temperatures` |
| Equation | `eq-` | `{#eq-stefan-boltzmann}` | `@eq-stefan-boltzmann` |
| Section | `sec-` | `{#sec-stellar-evolution}` | `@sec-stellar-evolution` |
| Theorem | `thm-` | `{#thm-virial}` | `@thm-virial` |
| Listing | `lst-` | `{#lst-integration-code}` | `@lst-integration-code` |

**The prefix is mandatory.** Quarto uses it to determine the reference type. `@fig-hr` renders as "Figure 1" while `@tbl-hr` renders as "Table 1".

---

## Figures

### Basic Figure with Caption

```markdown
![The Hertzsprung-Russell diagram showing the main sequence](figures/hr-diagram.png){#fig-hr-diagram}
```

This renders as:

```
Figure 1: The Hertzsprung-Russell diagram showing the main sequence
[image]
```

**Anatomy:**

- `![]()` — Standard Markdown image syntax
- `The Hertzsprung-Russell...` — This becomes the caption
- `(figures/hr-diagram.png)` — Path to the image file
- `{#fig-hr-diagram}` — The label for cross-referencing

### Referencing Figures

```markdown
As shown in @fig-hr-diagram, stars cluster along the main sequence.
The relationship between temperature and luminosity (@fig-hr-diagram)
reveals the underlying physics of stellar structure.
```

Renders as:

```
As shown in Figure 1, stars cluster along the main sequence.
The relationship between temperature and luminosity (Figure 1)
reveals the underlying physics of stellar structure.
```

### Figure with Additional Attributes

```markdown
![The H-R Diagram](figures/hr-diagram.png){#fig-hr-diagram width="80%" fig-align="center"}
```

Common attributes:

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `width` | Image width | `width="80%"` or `width="5in"` |
| `fig-align` | Horizontal alignment | `fig-align="center"` |
| `fig-cap-location` | Caption position | `fig-cap-location="top"` |

### Subfigures

For multiple related images with a single caption:

```markdown
::: {#fig-stellar-evolution layout-ncol=2}

![Main Sequence](figures/main-seq.png){#fig-main-seq}

![Red Giant](figures/red-giant.png){#fig-red-giant}

Stellar evolution stages: (a) main sequence, (b) red giant.
:::
```

This renders as:

```
Figure 1: Stellar evolution stages: (a) main sequence, (b) red giant.

        (a)                    (b)
    [main-seq.png]        [red-giant.png]
```

Now you can reference:

- `@fig-stellar-evolution` → "Figure 1"
- `@fig-main-seq` → "Figure 1 (a)"
- `@fig-red-giant` → "Figure 1 (b)"

---

## Tables

### Basic Table with Caption

```markdown
| Star | Temperature (K) | Luminosity (L☉) |
|------|-----------------|-----------------|
| Sun  | 5778            | 1.0             |
| Vega | 9602            | 40.1            |
| Betelgeuse | 3500     | 126,000         |

: Properties of notable stars {#tbl-star-properties}
```

**Anatomy:**

- The Markdown table (pipe syntax)
- `: Properties...` — The caption (note the colon prefix)
- `{#tbl-star-properties}` — The label for cross-referencing

Renders as:

```
Table 1: Properties of notable stars

| Star       | Temperature (K) | Luminosity (L☉) |
|------------|-----------------|-----------------|
| Sun        | 5778            | 1.0             |
| Vega       | 9602            | 40.1            |
| Betelgeuse | 3500            | 126,000         |
```

### Referencing Tables

```markdown
The data in @tbl-star-properties shows the range of stellar properties.
Betelgeuse (@tbl-star-properties) is the most luminous star in our sample.
```

Renders as:

```
The data in Table 1 shows the range of stellar properties.
Betelgeuse (Table 1) is the most luminous star in our sample.
```

### Computed Tables (from Python)

When generating tables with Python, include the caption in code:

````markdown
```{python}
#| label: tbl-computed-stars
#| tbl-cap: "Computed stellar properties from ZAMS model"

import pandas as pd

data = {
    'Mass (M☉)': [0.5, 1.0, 2.0, 5.0, 10.0],
    'Luminosity (L☉)': [0.03, 1.0, 16.0, 630, 5600],
    'Radius (R☉)': [0.5, 1.0, 1.6, 2.7, 4.5]
}

df = pd.DataFrame(data)
display(df)
```
````

**Key options:**

- `#| label: tbl-computed-stars` — The cross-reference label
- `#| tbl-cap: "..."` — The caption text

---

## Equations

### Display Equations with Labels

```markdown
The Stefan-Boltzmann law relates luminosity to radius and temperature:

$$
L = 4\pi R^2 \sigma T^4
$$ {#eq-stefan-boltzmann}

where $\sigma = 5.67 \times 10^{-8}$ W m⁻² K⁻⁴ is the Stefan-Boltzmann constant.
```

Renders as:

```
The Stefan-Boltzmann law relates luminosity to radius and temperature:

                L = 4πR²σT⁴                           (1)

where σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴ is the Stefan-Boltzmann constant.
```

### Referencing Equations

```markdown
Combining @eq-stefan-boltzmann with Wien's law (@eq-wien-displacement),
we can relate a star's color to its luminosity.
```

Renders as:

```
Combining Equation 1 with Wien's law (Equation 2),
we can relate a star's color to its luminosity.
```

### Multi-Line Equations

For aligned multi-line equations:

```markdown
The derivation proceeds as follows:

$$
\begin{aligned}
L &= 4\pi R^2 F \\
  &= 4\pi R^2 \sigma T^4 \\
  &= 4\pi R^2 \sigma T_{\text{eff}}^4
\end{aligned}
$$ {#eq-luminosity-derivation}
```

Only the entire block gets one equation number.

---

## Sections

### Labeling Sections

```markdown
## Stellar Evolution {#sec-stellar-evolution}

Stars evolve over billions of years...

### Main Sequence {#sec-main-sequence}

The main sequence phase is the longest...

### Red Giant Phase {#sec-red-giant}

After core hydrogen exhaustion...
```

### Referencing Sections

```markdown
As discussed in @sec-stellar-evolution, stars change over time.
The main sequence (@sec-main-sequence) is followed by the red giant
phase (@sec-red-giant).
```

Renders as:

```
As discussed in Section 1, stars change over time.
The main sequence (Section 1.1) is followed by the red giant
phase (Section 1.2).
```

---

## Code Listings

### Labeling Code Blocks

````markdown
```{python}
#| label: lst-blackbody
#| lst-cap: "Python function to compute blackbody spectrum"

def blackbody_spectrum(wavelength, temperature):
    """
    Compute Planck function B(λ, T).

    Parameters
    ----------
    wavelength : array
        Wavelength in meters
    temperature : float
        Temperature in Kelvin

    Returns
    -------
    array
        Spectral radiance in W/m²/sr/m
    """
    h = 6.626e-34  # Planck constant
    c = 3e8        # Speed of light
    k = 1.381e-23  # Boltzmann constant

    numerator = 2 * h * c**2 / wavelength**5
    denominator = np.exp(h * c / (wavelength * k * temperature)) - 1

    return numerator / denominator
```
````

### Referencing Code

```markdown
The blackbody function (@lst-blackbody) implements the Planck function.
Use this code when computing theoretical stellar spectra.
```

---

## Reference Customization

### Capitalization

By default, references render as "Figure 1", "Table 2", etc. You can customize this in `_quarto.yml`:

```yaml
crossref:
  fig-title: "Figure"      # Default
  tbl-title: "Table"       # Default
  eq-prefix: "Equation"    # Default
  sec-prefix: "Section"    # Default
```

For languages other than English:

```yaml
crossref:
  fig-title: "Figura"
  tbl-title: "Tabla"
  eq-prefix: "Ecuación"
  sec-prefix: "Sección"
```

### Reference Prefix vs Title

- `fig-title` — Used in captions ("Figure 1: Caption text")
- `fig-prefix` — Used in references ("See Figure 1" or "See Fig. 1")

```yaml
crossref:
  fig-title: "Figure"
  fig-prefix: "Fig."       # Shorter in-text references
```

Now captions say "Figure 1: ..." but references render as "Fig. 1".

### Numbering Style

```yaml
crossref:
  chapters: true                    # Number by chapter: Figure 2.3
  fig-labels: arabic                # 1, 2, 3 (default)
  # fig-labels: roman               # i, ii, iii
  # fig-labels: alpha               # a, b, c
```

---

## Complete Example: Module Page with Cross-References

```markdown
---
title: "Module 2: Stellar Properties"
---

## Introduction {#sec-intro}

This module covers how we infer stellar properties from observations.
We'll use the Stefan-Boltzmann law (@eq-stefan-boltzmann) extensively.

## Luminosity and Temperature {#sec-luminosity}

The relationship between luminosity, radius, and temperature is:

$$
L = 4\pi R^2 \sigma T^4
$$ {#eq-stefan-boltzmann}

This relationship is visualized in the H-R diagram (@fig-hr-diagram).

![The Hertzsprung-Russell diagram](figures/hr-diagram.png){#fig-hr-diagram width="80%"}

The clustering of stars along the main sequence (@fig-hr-diagram) reflects
the mass-luminosity relationship.

## Stellar Data {#sec-data}

@tbl-nearby-stars shows properties of nearby stars.

| Star | Distance (pc) | Spectral Type | L (L☉) |
|------|---------------|---------------|--------|
| Sun | 0.000005 | G2V | 1.0 |
| Alpha Centauri A | 1.34 | G2V | 1.5 |
| Sirius A | 2.64 | A1V | 25.4 |
| Procyon A | 3.50 | F5IV | 6.9 |

: Properties of nearby stars {#tbl-nearby-stars}

Using the data in @tbl-nearby-stars and @eq-stefan-boltzmann, we can
estimate stellar radii (see @sec-radius-calculation).

## Radius Calculation {#sec-radius-calculation}

Rearranging @eq-stefan-boltzmann:

$$
R = \sqrt{\frac{L}{4\pi\sigma T^4}}
$$ {#eq-radius}

The code in @lst-radius implements this calculation.

```{python}
#| label: lst-radius
#| lst-cap: "Calculate stellar radius from luminosity and temperature"

def stellar_radius(luminosity_solar, temperature_K):
    """Calculate radius in solar units."""
    L_sun = 3.828e26  # W
    sigma = 5.67e-8   # W/m²/K⁴
    R_sun = 6.96e8    # m

    L = luminosity_solar * L_sun
    R = np.sqrt(L / (4 * np.pi * sigma * temperature_K**4))

    return R / R_sun
```

## Summary {#sec-summary}

Key equations from this module:

- Stefan-Boltzmann law: @eq-stefan-boltzmann
- Radius calculation: @eq-radius

Key figures:

- H-R Diagram: @fig-hr-diagram
- Stellar data: @tbl-nearby-stars

See @sec-intro for the introduction and @sec-luminosity for the main content.
```

---

## Common Pitfalls

### 1. Missing the prefix

```markdown
<!-- WRONG - no prefix -->
{#hr-diagram}
@hr-diagram

<!-- CORRECT - fig- prefix -->
{#fig-hr-diagram}
@fig-hr-diagram
```

### 2. Wrong prefix for element type

```markdown
<!-- WRONG - fig- on a table -->
: Caption {#fig-data}

<!-- CORRECT - tbl- on a table -->
: Caption {#tbl-data}
```

### 3. Spaces in labels

```markdown
<!-- WRONG - spaces not allowed -->
{#fig-hr diagram}

<!-- CORRECT - use hyphens -->
{#fig-hr-diagram}
```

### 4. Label not attached to element

```markdown
<!-- WRONG - label is floating -->
![Caption](image.png)

{#fig-image}

<!-- CORRECT - label immediately follows -->
![Caption](image.png){#fig-image}
```

### 5. Referencing non-existent labels

Quarto will warn you about this, but it renders as "??" in the output:

```
WARNING: Unable to resolve crossref @fig-nonexistent
```

Check your label spelling carefully.

### 6. Equation labels inside the math

```markdown
<!-- WRONG - label inside $$ -->
$$
L = 4\pi R^2 \sigma T^4 {#eq-stefan}
$$

<!-- CORRECT - label after $$ -->
$$
L = 4\pi R^2 \sigma T^4
$$ {#eq-stefan}
```

---

## Enabling Cross-References

Cross-references work automatically in Quarto for figures, tables, and equations. For section references, enable numbering:

```yaml
# _quarto.yml
format:
  html:
    number-sections: true
```

Without `number-sections: true`, section references like `@sec-intro` won't work.

---

## PDF-Specific Considerations

In PDF output, cross-references become hyperlinks (in viewers that support them). You can customize the appearance:

```yaml
format:
  pdf:
    number-sections: true
    colorlinks: true        # Colored links instead of boxes
    linkcolor: blue         # Color for internal links
    citecolor: green        # Color for citations
    urlcolor: red           # Color for URLs
```

---

## Next Steps

- [Migration Checklist](08-migration-checklist.md) — Step-by-step guide to add all features
- [Global Variables](01-global-variables.md) — Combine with cross-references for powerful documents
