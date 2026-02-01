# Week 5, Lecture 9: Decoding Starlight — Spectral Lines and Chemical Fingerprints

**Status:** DRAFT OUTLINE — v4 (split from comprehensive reading)
**Target length:** ~25-30 rendered pages
**Filename when complete:** `lecture-09-spectral-lines-reading.qmd`

**Note:** Wednesday lecture (Feb 19). Monday is Presidents Day (no class).

---

## Instructor Approval Checklist

### Content — Spectral Lines

- [ ] Opening hook connects to L7-L8: "Light carries information, but we haven't read all of it yet"
- [ ] Kirchhoff's Three Laws clearly explained with figures
- [ ] **Quantum mechanics motivated**: explain what "quantized" means
- [ ] **Hydrogen energy levels deep dive**: $E_n = -13.6\,\text{eV}/n^2$
  - [ ] "Hydrogen is training wheels" framing
  - [ ] Energy level diagram with transitions
  - [ ] Balmer series (visible lines) worked out
  - [ ] Connection to "why each element has unique fingerprint"
- [ ] Stellar classification (OBAFGKM) with temperature connection
- [ ] **HR diagram spoiler** with placeholder figure to motivate Module 2

### Pedagogy

- [ ] "Light is Information" throughline continues from L7-L8
- [ ] Predict → Explain → Check structure for key concepts
- [ ] Check Yourself questions test the right concepts
- [ ] Practice problems marked Core vs Challenge
- [ ] Math level is algebra-only (hydrogen formula is conceptual application)
- [ ] Tone matches L1-L8 (conversational but rigorous)

### Formatting

- [ ] YAML front matter correct
- [ ] Math formatting clean
- [ ] Tables are proper markdown
- [ ] Figure placeholders well-described

**Instructor notes/requested changes:**

```text
[Leave blank for Anna to fill in]


```

**Approval:** _______ (initials) **Date:** _______

---

## YAML Front Matter

```yaml
---
title: "Decoding Starlight — Spectral Lines and Chemical Fingerprints"
subtitle: "Lecture 9 Reading Companion"
author: "Dr. Anna Rosen"
date: "2026-02-19"
description: "Spectral lines are chemical fingerprints. Each element absorbs and emits light at unique wavelengths. By understanding the quantum origin of these lines, we can determine the composition of any star in the universe — without ever touching it."
draft: false
categories: [foundations, spectra, quantum]
course: ASTR 101
module: "1 - Foundations"
learning-objectives:
  - Describe how emission and absorption spectra form (Kirchhoff's Laws)
  - Explain why atomic spectra have discrete lines (quantized energy levels)
  - Apply the hydrogen energy level formula to predict spectral line wavelengths
  - Identify the OBAFGKM stellar classification sequence and its temperature basis
  - Explain why hydrogen lines are strongest in A-type stars
math-level: algebra_only
prerequisites: Lecture 8 (Blackbody Radiation); understanding of EM spectrum
---
```

---

## The Big Idea

> Blackbody radiation tells us temperature. But real stellar spectra have something more: **spectral lines** — bright or dark features at specific wavelengths. These lines are chemical fingerprints, revealing what stars are made of. Each element has its own unique pattern, and quantum mechanics explains why.

---

## Opening Hook: The Missing Colors

**Target length:** ~1.5 pages

**Key narrative beats:**

1. Callback: We've learned light carries temperature (L8), but there's more
2. When you spread sunlight into a spectrum, there are **dark lines** — missing colors
3. In 1814, Fraunhofer catalogued hundreds of these lines
4. Each element leaves its own pattern — a barcode
5. This lecture: Why lines exist and what they tell us about stellar composition

**Draft opening:**

> In 1814, German optician Joseph von Fraunhofer pointed a prism at sunlight and made a puzzling discovery. The rainbow spectrum wasn't smooth — it was crossed by hundreds of **dark lines**, specific wavelengths where light was missing. He catalogued over 500 of them, labeling many prominent lines with letters (A, B, C, D, ...).
>
> Fraunhofer didn't know what caused these lines. But by the 1860s, Gustav Kirchhoff and Robert Bunsen had cracked the code: each chemical element absorbs and emits light at specific wavelengths. The dark lines in the solar spectrum are wavelengths absorbed by elements in the Sun's outer atmosphere. The pattern of lines is a **chemical fingerprint**.
>
> This was revolutionary. For the first time, humans could determine what a star is made of — without touching it, without visiting it, from 150 million kilometers away. And once we understood the physics, we realized: these same lines could reveal motion (via Doppler shifts — that's L10!), magnetic fields, pressure, and more.
>
> In Lectures 7 and 8, we learned that **light carries information**: wavelength, intensity, temperature. Now we add another layer: spectral lines tell us **composition**. By the end of this lecture, you'll understand why each element has a unique fingerprint and how astronomers use this to classify stars.

**Figure placeholder:**

```
{{< fig fraunhofer-lines >}}

FIGURE: Fraunhofer Lines in the Solar Spectrum
DESCRIPTION: Show the visible solar spectrum (rainbow) with prominent
dark absorption lines labeled (at minimum: D lines for sodium, H and K
for calcium, Hα for hydrogen). Caption: "Dark lines in the solar spectrum
reveal which elements are present in the Sun's atmosphere."
ALT TEXT: The solar spectrum showing dark absorption lines at specific
wavelengths, each corresponding to a chemical element.
```

---

## "How to Use This Reading" Callout

```
::: {.callout-important title="How to Use This Reading" collapse="true"}
This reading covers spectral lines, the quantum origin of discrete
spectra, and stellar classification — the foundation for understanding
stellar composition.

**Structure:**
- **Part 1:** Spectral lines and what causes them (Kirchhoff's Laws)
- **Part 2:** Quantum mechanics (conceptual) — why energy is quantized
- **Part 3:** Stellar classification (OBAFGKM) and HR diagram preview

**Reading time:** ~35-45 min (including Check Yourself questions)

**Non-negotiable:** Stop at every **Check Yourself** question.

**What's next:** In L10 (Friday), we'll learn how these same spectral
lines reveal **motion** through the Doppler effect — and how telescopes
collect this light.
:::
```

---

## Course Throughline Summary

```
::: {.callout-note title="The Module 1 Throughline"}
| Lecture | Key Insight | What It Reveals |
|---------|-------------|-----------------|
| L5-L6 | Motion reveals mass | Orbits → mass of central object |
| L7 | Light carries information | Wavelength, scattering, inverse-square |
| L8 | Temperature is written in light | Blackbody spectrum, Wien's Law, Stefan-Boltzmann |
| **L9** | Composition is written in light | Spectral lines → chemical fingerprints |
| L10 | Motion is written in light | Doppler shifts → radial velocity |

**Together:** From a single observation, we can determine an object's
temperature (blackbody), composition (spectral lines), and motion
(Doppler) — the foundation for everything in Modules 2 and 3.
:::
```

---

# PART 1: SPECTRAL LINES — CHEMICAL FINGERPRINTS (~30% of reading)

## Section 1.1: Three Types of Spectra

**Target length:** ~3 pages

### Kirchhoff's Laws

> In the 1860s, Kirchhoff discovered three rules that predict what kind of spectrum you'll see, depending on the physical conditions:

```
::: {.callout-important title="Kirchhoff's Three Laws of Spectroscopy"}
**1. Continuous Spectrum (Blackbody)**
A hot, dense object (solid, liquid, or dense gas) emits light at
**all wavelengths** — a smooth rainbow with no gaps.

**2. Emission Spectrum (Bright Lines)**
A hot, thin (low-density) gas emits light at **specific wavelengths
only** — bright lines on a dark background.

**3. Absorption Spectrum (Dark Lines)**
A cool gas in front of a hot, continuous source absorbs light at
**specific wavelengths** — dark lines on a bright rainbow background.
:::
```

### Visual Summary

**Figure placeholder:**

```
{{< fig kirchhoff-three-laws >}}

FIGURE: Kirchhoff's Three Types of Spectra
DESCRIPTION: Three-panel diagram showing:
1. Hot dense object → continuous spectrum (smooth rainbow)
2. Hot thin gas → emission spectrum (bright lines on dark)
3. Cool gas in front of hot source → absorption spectrum (dark lines on rainbow)
Include light path diagrams for each case.
ALT TEXT: Three scenarios showing continuous, emission, and absorption
spectra with the physical setup that produces each.
```

### Why This Matters for Stars

> A star's interior is hot and dense → continuous blackbody spectrum.
> But light passes through the star's cooler outer atmosphere before reaching us.
> That atmosphere absorbs specific wavelengths → absorption lines.
>
> The dark lines in stellar spectra tell us which elements are in the star's atmosphere. Each element has a unique pattern — a chemical barcode.

### Check Yourself 1:

```
::: {.callout-check-yourself title="Check Yourself 1 — Kirchhoff's Laws"}
The dark lines in the Sun's spectrum are caused by:

- A) The Sun's core being too cool to emit those wavelengths
- B) Cool gas in the Sun's outer atmosphere absorbing specific wavelengths
- C) Earth's atmosphere blocking the light
- D) The Sun rotating and shifting the wavelengths
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Cool gas in the Sun's outer atmosphere absorbing specific wavelengths.**
The Sun's photosphere produces a continuous spectrum. As that light passes
through the cooler layers above it, atoms absorb light at their
characteristic wavelengths, creating dark absorption lines.
:::
```

---

## Section 1.2: Each Element Has a Unique Pattern

**Target length:** ~2 pages

### Chemical Fingerprints

> Every element — hydrogen, helium, carbon, iron — absorbs and emits light at a unique set of wavelengths. This pattern is as distinctive as a fingerprint or barcode.
>
> - **Hydrogen:** Strong lines at 656 nm (red), 486 nm (blue-green), 434 nm (violet)...
> - **Sodium:** Bright yellow doublet at 589 nm (the "D lines")
> - **Calcium:** Strong lines in the violet (H and K lines at 397 and 393 nm)
> - **Iron:** Hundreds of lines throughout the visible spectrum

### How We Identify Elements

> To identify elements in a star:
>
> 1. Observe the star's spectrum
> 2. Measure the wavelengths of absorption lines
> 3. Compare to laboratory measurements of known elements
> 4. Match the pattern → identify the element
>
> This is how we know the Sun is ~74% hydrogen, ~24% helium, and ~2% heavier elements **by mass** ("metals" in astronomy jargon) — without ever collecting a sample.

**The More You Know:**

```
::: {.callout-tip title="The More You Know: Helium Was Discovered in the Sun First" collapse="true"}
In 1868, astronomers observing a solar eclipse noticed an emission line
at 587.6 nm that didn't match any known element on Earth. They named
the mystery element **helium** — from *helios*, the Greek word for Sun.

Helium wasn't isolated on Earth until 1895, nearly 30 years later.
Spectroscopy revealed a new element 150 million km away before we
found it in our own laboratories!
:::
```

### Check Yourself 2:

```
::: {.callout-check-yourself title="Check Yourself 2 — Element Identification"}
How do astronomers determine which elements are present in a star?

- A) By measuring the star's temperature
- B) By matching the pattern of spectral lines to laboratory measurements
- C) By observing the star's color
- D) By measuring how bright the star is
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) By matching the pattern of spectral lines to laboratory measurements.**
Each element produces a unique pattern of absorption or emission lines.
By comparing observed stellar spectra to lab spectra of known elements,
astronomers identify which elements are present.
:::
```

---

# PART 2: WHY QUANTIZED? — THE QUANTUM ORIGIN OF SPECTRAL LINES (~35% of reading)

## Section 2.1: The Puzzle of Discrete Lines

**Target length:** ~2 pages

### Why Specific Wavelengths?

> Here's a puzzle: if atoms can absorb and emit light, why only at specific wavelengths? Why not a continuous range?
>
> Before 1913, this was a mystery. Classical physics predicted that atoms should emit light at all wavelengths — but that's not what we observe. Something deeper was going on.

### The Breakthrough: Energy Is Quantized

> The answer came from **quantum mechanics**: energy in atoms isn't continuous — it's **quantized**. Electrons can only occupy specific energy levels, like rungs on a ladder. They can't exist between rungs.

**Margin definitions:**

- **Quantized:** Restricted to specific discrete values, not continuous. Like steps on a staircase, not a ramp.
- **Energy level:** A specific, allowed energy state for an electron in an atom.
- **Ground state:** The lowest energy level an electron can occupy.
- **Excited state:** Any energy level higher than the ground state.

### The Ladder Analogy

> Imagine a ladder where you can only stand on the rungs, never between them. Electrons in atoms are like this — they can only occupy specific energy levels.
>
> To move from one rung to another, the electron must gain or lose **exactly** the right amount of energy. That energy comes from (or goes into) a photon.

**Figure placeholder:**

```
{{< fig energy-level-ladder >}}

FIGURE: Energy Levels as a Ladder
DESCRIPTION: Show an atom's energy levels as horizontal lines/rungs:
- Ground state (n=1) at bottom
- Excited states (n=2, 3, 4...) above
- Arrows showing electron transitions up (absorption) and down (emission)
- Label: "Electrons can only exist on the rungs, not between them"
ALT TEXT: Energy level diagram showing discrete levels like ladder rungs,
with arrows indicating electron transitions.
```

---

## Section 2.2: Photons and Energy Transitions

**Target length:** ~2 pages

### The Photon-Energy Connection

> When an electron jumps between energy levels:
>
> - **Absorption:** Electron jumps UP to higher energy level. A photon with exactly the right energy is absorbed.
> - **Emission:** Electron jumps DOWN to lower energy level. A photon with exactly that energy is emitted.

**The key equation:**

```
::: {.callout-important title="Photon Energy and Frequency"}
$$E_{photon} = h\nu = \frac{hc}{\lambda}$$

where:
- $h = 6.63 \times 10^{-34}$ J·s (Planck's constant)
- $\nu$ = frequency of the light
- $\lambda$ = wavelength of the light
- $c$ = speed of light

**Higher energy photon ↔ higher frequency ↔ shorter wavelength**
:::
```

### Why Lines Are Discrete

> The photon energy must **exactly match** the energy gap between two levels:
>
> $$E_{photon} = E_{upper} - E_{lower}$$
>
> Since atoms have only specific allowed energy levels, they can only absorb/emit photons with specific energies — which means specific wavelengths. That's why spectral lines are sharp and discrete, not blurry or continuous.

### 🔍 Spot the Assumption (Overturned)

```
::: {.callout-note title="🔍 Spot the Assumption" collapse="false"}
**Classical assumption:** Energy can vary continuously, like a ramp.
An electron could have any energy, and atoms could emit any wavelength.

**Quantum reality:** Energy is quantized, like a staircase. Only specific
energy values are allowed, so only specific wavelengths appear.

This was one of the most profound discoveries of the 20th century:
at atomic scales, nature is fundamentally discrete, not continuous.
:::
```

---

## Section 2.3: Deep Dive — Hydrogen Energy Levels

**Target length:** ~4 pages

### Why Hydrogen?

> Hydrogen is the simplest atom: one proton, one electron. Its energy levels can be calculated exactly, and the formula is elegant.

```
::: {.callout-note title="Hydrogen Is Our Training Wheels" collapse="false"}
We focus on hydrogen because it's the **simplest** case — and the only
atom where the energy levels follow a single, elegant formula. Think of
this as training wheels for understanding spectral lines.

**Real atoms are more complex:** Helium has two electrons that interact
with each other. Iron has 26. Their energy levels don't follow a simple
formula, and they produce hundreds or thousands of lines each.

But the **principle** is the same: quantized energy levels → discrete
spectral lines. Once you understand hydrogen, you have the conceptual
foundation for all atomic spectroscopy.
:::
```

```
::: {.callout-important title="Hydrogen Energy Levels"}
$$E_n = -\frac{13.6 \text{ eV}}{n^2} \quad (n = 1, 2, 3, ...)$$

where:
- $n$ = **principal quantum number** (1, 2, 3, ...)
- $E_n$ = energy of level $n$
- The negative sign means the electron is **bound** to the atom
- $n = \infty$ corresponds to $E = 0$ (electron freed/ionized)
:::
```

**Margin definition:**

- **Electron volt (eV):** A convenient energy unit for atoms. 1 eV = $1.6 \times 10^{-19}$ J. Visible photons have energies of about 1.8–3.1 eV.

### The Energy Level Diagram

| Level ($n$) | Energy ($E_n$) | Name |
|-------------|----------------|------|
| 1 | -13.6 eV | Ground state |
| 2 | -3.4 eV | First excited state |
| 3 | -1.51 eV | Second excited state |
| 4 | -0.85 eV | Third excited state |
| ... | ... | ... |
| ∞ | 0 eV | Ionized (free electron) |

**Figure placeholder:**

```
{{< fig hydrogen-energy-levels >}}

FIGURE: Hydrogen Energy Level Diagram
DESCRIPTION: Vertical energy scale with horizontal lines at each level:
- n=1 at -13.6 eV (ground state)
- n=2 at -3.4 eV
- n=3 at -1.51 eV
- n=4, 5, 6 increasingly close together
- n=∞ at 0 eV (ionization threshold)
- Arrows showing Balmer series transitions (n=3→2, 4→2, 5→2)
- Label wavelengths for each Balmer transition
ALT TEXT: Hydrogen energy levels with transitions of the Balmer series
marked, showing emission of visible light.
```

### The Balmer Series (Visible Lines)

> Transitions that **end at n = 2** produce visible light — the **Balmer series**:

| Transition | Energy Released | Wavelength | Color |
|------------|-----------------|------------|-------|
| 3 → 2 | 1.89 eV | 656 nm | Red (Hα) |
| 4 → 2 | 2.55 eV | 486 nm | Blue-green (Hβ) |
| 5 → 2 | 2.86 eV | 434 nm | Violet (Hγ) |
| 6 → 2 | 3.02 eV | 410 nm | Violet (Hδ) |

### Worked Example: Calculating Hα Wavelength

> **Problem:** Calculate the wavelength of light emitted when a hydrogen electron drops from n=3 to n=2.
>
> **Solution:**
>
> Step 1: Find the energies
> $$E_3 = -\frac{13.6}{3^2} = -\frac{13.6}{9} = -1.51 \text{ eV}$$
> $$E_2 = -\frac{13.6}{2^2} = -\frac{13.6}{4} = -3.4 \text{ eV}$$
>
> Step 2: Find the energy difference
> $$E_{photon} = E_3 - E_2 = -1.51 - (-3.4) = 1.89 \text{ eV}$$
>
> Step 3: Convert to wavelength using $E = hc/\lambda$
> Using the shortcut: $\lambda \text{ (nm)} = \frac{1240 \text{ eV·nm}}{E \text{ (eV)}}$
> $$\lambda = \frac{1240}{1.89} = 656 \text{ nm}$$
>
> This is **Hα** — the famous red hydrogen line!

### Why This Matters

> This single formula predicts the wavelengths of hydrogen lines to extraordinary precision. When astronomers observe a star and see absorption at exactly 656.28 nm, 486.13 nm, 434.05 nm... they know hydrogen is present.
>
> Each element has its own energy level structure (more complex than hydrogen), producing its own unique line pattern. Quantum mechanics explains why spectral lines exist and predicts exactly where they'll appear.

### Check Yourself 3:

```
::: {.callout-check-yourself title="Check Yourself 3 — Hydrogen Transitions"}
Which transition produces the shortest wavelength (highest energy) photon?

- A) n = 2 → n = 1
- B) n = 3 → n = 2
- C) n = 4 → n = 3
- D) n = 5 → n = 4
:::

::: {.callout-tip title="Solution" collapse="true"}
**A) n = 2 → n = 1.** This transition has the largest energy gap:
$|E_1 - E_2| = |{-13.6} - ({-3.4})| = 13.6 - 3.4 = 10.2$ eV.
Larger energy gap = higher energy photon = shorter wavelength.
(This is the Lyman-alpha line at 121.6 nm, in the ultraviolet.)
:::
```

### Check Yourself 4:

```
::: {.callout-check-yourself title="Check Yourself 4 — Why Discrete Lines?"}
Spectral lines are discrete (specific wavelengths only) because:

- A) Telescopes can only detect certain wavelengths
- B) Atoms can only absorb red, green, and blue light
- C) Electrons in atoms can only occupy specific quantized energy levels
- D) Light travels at a constant speed
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Electrons in atoms can only occupy specific quantized energy levels.**
Photons are absorbed or emitted only when their energy exactly matches
the gap between two allowed levels. Discrete levels → discrete photon
energies → discrete wavelengths.
:::
```

---

# PART 3: STELLAR CLASSIFICATION AND THE HR DIAGRAM PREVIEW (~35% of reading)

## Section 3.1: The OBAFGKM Sequence

**Target length:** ~2.5 pages

### Classifying Stars by Spectra

> When astronomers began systematically classifying stellar spectra in the late 1800s, they noticed that stars grouped into categories based on the strength of various absorption lines. After much sorting and re-sorting, the modern sequence emerged:
>
> **O - B - A - F - G - K - M**
>
> This sequence orders stars by **surface temperature**, from hottest (O) to coolest (M).

### The Spectral Types

| Type | Color | Temperature (K) | Prominent Features | Example |
|------|-------|-----------------|-------------------|---------|
| **O** | Blue | 30,000–50,000+ | Ionized helium, weak hydrogen | Mintaka |
| **B** | Blue-white | 10,000–30,000 | Neutral helium, hydrogen | Rigel |
| **A** | White | 7,500–10,000 | **Strongest hydrogen** (Balmer) | Sirius, Vega |
| **F** | Yellow-white | 6,000–7,500 | Hydrogen, ionized metals | Procyon |
| **G** | Yellow | 5,000–6,000 | Calcium, iron lines | **The Sun** |
| **K** | Orange | 3,500–5,000 | Strong metal lines | Arcturus |
| **M** | Red | 2,500–3,500 | Molecular bands (TiO) | Betelgeuse |

**Classic mnemonic:** "Oh Be A Fine Girl/Guy, Kiss Me"

### Why Hydrogen Lines Peak at A Stars

> Here's a puzzle: hydrogen is the most abundant element, yet hydrogen lines are strongest in **A stars** (around 10,000 K), not in the hottest O stars. Why?
>
> The answer involves temperature and ionization:
>
> - **Too hot (O, B stars):** Hydrogen is mostly ionized — the electron is stripped away. No bound electrons = no absorption lines.
> - **Too cool (K, M stars):** Not enough energy to excite electrons into the n=2 level where they can absorb visible (Balmer) light.
> - **Just right (A stars ~10,000 K):** Hydrogen is mostly neutral and electrons are excited to n=2. Maximum Balmer absorption!
>
> This is a beautiful example of physics: the strength of spectral lines depends not just on abundance but on **temperature and ionization state**.

### Check Yourself 5:

```
::: {.callout-check-yourself title="Check Yourself 5 — Spectral Classification"}
Which spectral type corresponds to the hottest stars?

- A) M
- B) G
- C) A
- D) O
:::

::: {.callout-tip title="Solution" collapse="true"}
**D) O.** The sequence OBAFGKM runs from hottest to coolest. O stars
have temperatures above 30,000 K. (M stars are the coolest, below 3,500 K.)
:::
```

---

## Section 3.2: The HR Diagram — A Sneak Peek

**Target length:** ~2 pages

### What's Coming in Module 2

> In Module 2, we'll combine everything: temperature (from spectra or color), luminosity (from brightness and distance), and the L-T-R relationship from L8. When you plot luminosity vs. temperature for thousands of stars, a remarkable pattern emerges.

**Figure placeholder:**

```
{{< fig hr-diagram-preview >}}

FIGURE: The Hertzsprung-Russell Diagram — Your Module 2 Preview
DESCRIPTION: Full HR diagram showing:
- X-axis: Temperature (decreasing left to right) with OBAFGKM labels
- Y-axis: Luminosity (log scale, in solar units)
- Main sequence: diagonal band from upper-left (hot, luminous) to
  lower-right (cool, dim)
- Red giants: upper-right region (cool but luminous → large!)
- White dwarfs: lower-left region (hot but dim → small!)
- Sun labeled on main sequence
- Caption: "Every dot is a star. The patterns reveal stellar lives."
ALT TEXT: HR diagram showing main sequence, red giants, and white dwarfs,
with temperature on x-axis and luminosity on y-axis.
```

### Why the Patterns Exist

> The HR diagram isn't random — it reflects stellar physics:
>
> - **Main sequence:** Stars fusing hydrogen in their cores. A star's position depends on its mass: more massive = hotter, more luminous.
>
> - **Red giants:** Stars that have exhausted core hydrogen and expanded. Same temperature as small red stars, but far more luminous = much larger radius (L-T-R from L8!).
>
> - **White dwarfs:** Dead stellar cores. Hot (still cooling) but tiny = low luminosity.
>
> In Module 2, we'll trace stellar evolution across this diagram — from birth in molecular clouds to death as white dwarfs, neutron stars, or black holes.

### The Tools We've Built

```
::: {.callout-note title="You Now Have the Tools" collapse="false"}
With the physics from Module 1, you can now understand:

- **Why giants are giant:** Same T as dwarfs, higher L → larger R (Stefan-Boltzmann)
- **Why O stars are at top-left:** Hot → blue (Wien), and massive → luminous
- **Why M dwarfs are at bottom-right:** Cool → red, and small → dim
- **Why the main sequence exists:** Stars in equilibrium follow a mass-luminosity relation

Module 2 is where we apply these tools to understand stellar **lives**.
:::
```

---

# CLOSING ELEMENTS

## Summary Box

```
::: {.callout-important title="Key Takeaways from Lecture 9"}
**Spectral Lines:**
1. Kirchhoff's Laws: Hot dense → continuous; hot thin gas → emission lines;
   cool gas in front → absorption lines
2. Energy is **quantized**: electrons occupy discrete levels, absorb/emit
   photons only at specific energies (wavelengths)
3. Hydrogen: $E_n = -13.6\text{ eV}/n^2$. Balmer series (n→2) gives visible lines.
4. Each element has a unique spectral fingerprint
5. OBAFGKM spectral types: O hottest → M coolest. Hydrogen lines peak at A.

**What's Next:**
In L10, we'll see what happens when these spectral fingerprints **shift** —
the Doppler effect reveals motion, from exoplanets to dark matter.
:::
```

---

## Practice Problems

### Core (do these first)

1. **Kirchhoff's Laws:** What type of spectrum (continuous, emission, or absorption) would you see from a hot, thin gas cloud with no background light source?

2. **Hydrogen Levels:** Using $E_n = -13.6/n^2$ eV, calculate the energy of a photon emitted when a hydrogen electron falls from n=4 to n=2. What color would this light be?

3. **Spectral Types:** A star shows very strong hydrogen Balmer lines but no helium lines. What spectral type is most likely? Is it hotter or cooler than the Sun?

### Challenge

4. **Balmer Limit:** What is the shortest wavelength of the Balmer series (n=∞ → 2)? In what part of the spectrum is this? (Hint: what's the maximum energy a Balmer photon can have?)

5. **Why Not Hotter?:** Explain why hydrogen absorption lines are *weaker* in O stars than in A stars, even though O stars are hotter and hydrogen is the most abundant element.

---

## Glossary

| Term | Definition |
|------|------------|
| **Spectral line** | A bright or dark feature at a specific wavelength, caused by emission or absorption by atoms |
| **Continuous spectrum** | A smooth spectrum containing all wavelengths (like a blackbody) |
| **Emission spectrum** | Bright lines on a dark background, from a hot thin gas |
| **Absorption spectrum** | Dark lines on a bright background, from cool gas in front of a hot source |
| **Quantized** | Restricted to discrete values rather than continuous (like stair steps, not a ramp) |
| **Energy level** | A specific allowed energy state for an electron in an atom |
| **Ground state** | The lowest energy level of an electron |
| **Excited state** | Any energy level above the ground state |
| **Balmer series** | Hydrogen spectral lines from transitions ending at n=2 (visible light) |
| **OBAFGKM** | The stellar spectral classification sequence from hot to cool |
| **Ionization** | Removal of an electron from an atom |

---

## Figure Checklist

| Figure ID | Description | Status |
|-----------|-------------|--------|
| `fraunhofer-lines` | Solar spectrum with dark absorption lines labeled | ☐ |
| `kirchhoff-three-laws` | Three types of spectra with physical setups | ☐ |
| `energy-level-ladder` | Generic energy levels as ladder rungs | ☐ |
| `hydrogen-energy-levels` | Hydrogen levels with Balmer transitions | ☐ |
| `hr-diagram-preview` | HR diagram with main sequence, giants, dwarfs | ☐ |

---

## What's Next

**Friday (L10):** The same spectral lines that reveal composition also reveal **motion**. When a star moves toward or away from us, its spectral fingerprints shift — the Doppler effect. We'll use this to detect exoplanets, discover dark matter, and explore the telescopes that collect this light.

---

*End of L9 Outline (v4)*
