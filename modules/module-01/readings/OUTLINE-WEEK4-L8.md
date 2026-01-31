# Week 4, Lecture 8: Reading the Glow — Temperature Written in Light

**Status:** DRAFT OUTLINE — v1
**Target length:** ~35-40 rendered pages
**Filename when complete:** `lecture-08-blackbody-radiation-reading.qmd`

---

## Instructor Approval Checklist

### Content

- [ ] Opening hook effectively motivates "everything glows"
- [ ] Thermal radiation concept explained clearly
- [ ] Blackbody radiation defined and explained
  - [ ] "Idealized perfect emitter/absorber"
  - [ ] Spectrum depends only on temperature
  - [ ] Real objects approximate blackbodies
- [ ] **Wien's Law:** $\lambda_{peak} \propto 1/T$ explained with examples
  - [ ] Hot → blue, cool → red connection explicit
  - [ ] Star color as temperature indicator
- [ ] **"Sun is green" puzzle** addressed correctly
  - [ ] Peak wavelength is green (~500 nm)
  - [ ] But we see white because we receive broad spectrum
  - [ ] Human eye evolution to match solar peak
- [ ] **Stefan-Boltzmann Law:** $L \propto T^4$ explained
  - [ ] Hotter → much more luminous
  - [ ] Power of 4 makes temperature dominant
- [ ] **L-T-R Connection:** $L = 4\pi R^2 \sigma T^4$ introduced
  - [ ] Same temperature + different luminosity → different size
  - [ ] Preview of H-R diagram giant/dwarf distinction
- [ ] **Transition to L9:** Blackbodies reveal temperature, but spectral lines reveal composition and motion

### Pedagogy

- [ ] "Light is Information" throughline continues from L7
- [ ] Course throughline: Motion reveals mass (L5-L6), Light reveals temperature (L7-L8)
- [ ] Predict → Explain → Check structure for key concepts
- [ ] Everyday examples (stove burner, infrared cameras) used
- [ ] Check Yourself questions test the right concepts
- [ ] Practice problems marked Core vs Challenge
- [ ] Math level is algebra-only
- [ ] Tone matches L1-L7 (conversational but rigorous)

### Formatting

- [ ] YAML front matter correct
- [ ] Math formatting clean (no duplication)
- [ ] Tables are proper markdown
- [ ] Figure placeholders well-described
- [ ] Demo connections appropriate (Blackbody Radiation demo)

**Instructor notes/requested changes:**

```text
[Leave blank for Anna to fill in]



```

**Approval:** _______ (initials) **Date:** _______

---

## YAML Front Matter

```yaml
---
title: "Reading the Glow — Temperature Written in Light"
subtitle: "Lecture 8 Reading Companion"
author: "Dr. Anna Rosen"
date: "2026-02-11"
description: "Everything with temperature glows. Hotter objects glow bluer and brighter. By analyzing the spectrum of light, astronomers can read an object's temperature from billions of kilometers away."
draft: false
categories: [foundations, blackbody, temperature]
course: ASTR 101
module: "1 - Foundations"
learning-objectives:
  - Explain that all objects with temperature emit thermal radiation
  - Define a blackbody and explain why stars approximate blackbodies
  - Apply Wien's Law to connect peak wavelength and temperature
  - Explain why the Sun appears white even though its peak is in the green
  - Apply the Stefan-Boltzmann Law to relate temperature and luminosity
  - Connect luminosity, temperature, and radius using L = 4πR²σT⁴
  - Recognize that two stars at the same temperature but different luminosities must have different sizes
math-level: algebra_only
prerequisites: Lecture 7 (Light as Information); understanding of EM spectrum
---
```

---

## The Big Idea

> Everything glows. You, your laptop, the walls around you — all emit light. Most of it is infrared, invisible to your eyes. But heat it up enough, and anything will glow visibly: first red, then orange, yellow, white, blue. The color of the glow tells you the temperature. This simple principle lets astronomers measure the temperatures of stars billions of kilometers away.

---

## Opening Hook: Seeing Heat

**Target length:** ~1.5 pages

**Key narrative beats:**

1. Infrared cameras show heat as light — even in total darkness
2. Everything with temperature radiates — not just "hot" things
3. Hotter objects radiate more and at shorter wavelengths
4. This is thermal radiation / blackbody radiation
5. Stars are nearly perfect thermal radiators
6. By measuring the spectrum, we measure temperature remotely

**Draft opening:**

> Imagine looking through an infrared camera. In pitch darkness, you see a person walking — their body glows brightly against the cool background. A coffee mug just removed from the microwave blazes with infrared light. The cold night sky is nearly black, but the warm buildings stand out in eerie detail.
>
> Here's the remarkable thing: that infrared "glow" isn't reflected light — it's light the objects are **emitting** because of their temperature. Everything with temperature above absolute zero radiates electromagnetic waves. At room temperature, that radiation is mostly infrared, invisible to our eyes. But heat something to 500°C and it glows dull red. At 1000°C, bright orange. At 6000°C (the Sun's surface), brilliant yellow-white.
>
> This isn't metaphor — it's physics. **Temperature is written in light.**
>
> In Lecture 7, we learned that light carries information and that wavelength matters. Now we'll see the specific relationship: how the **spectrum** of emitted light encodes an object's temperature. The hotter the object, the shorter the wavelength of its peak emission. The Sun peaks in green light (around 500 nm). A cool red star peaks in the infrared.
>
> This is the astronomer's thermometer: point a telescope at a star, spread its light into a spectrum, and read its temperature — from 40 trillion kilometers away, without touching anything.

**Figure placeholder:**

```
{{< fig infrared-thermal-image >}}

FIGURE: Seeing Temperature in Infrared
DESCRIPTION: An infrared/thermal camera image showing:
- Warm person against cooler background
- Different objects at different temperatures shown in false color
- Caption: "Infrared cameras reveal thermal radiation — light emitted
  by objects because of their temperature."
ALT TEXT: Infrared image showing warm objects glowing brightly against
cooler surroundings, demonstrating thermal radiation.
```

**🔍 Spot the Assumption:**

```
::: {.callout-note title="🔍 Spot the Assumption" collapse="false"}
You might assume:
- **Only "hot" things emit light** (like fire or the Sun)
- **Objects at room temperature don't glow**
- **An object must be heated to glow**

But everything above absolute zero emits electromagnetic radiation.
At room temperature, you emit infrared light constantly — on the order
of ~100 W of thermal radiation (very roughly; it depends on your body,
clothing, and surroundings).
:::
```

---

## "How to Use This Reading" Callout

```
::: {.callout-important title="How to Use This Reading" collapse="true"}
This reading shows how temperature is encoded in light — the astronomer's
remote thermometer.

**Musts for today (~25 min):**
- The Big Idea
- What is thermal radiation / blackbody radiation?
- Wien's Law: peak wavelength tells temperature
- The "Sun is green" puzzle (and why we see white)
- Stefan-Boltzmann Law: temperature affects luminosity powerfully

**Non-negotiable:** Stop at every **Check Yourself** question.

**Deep Dives (important but save for later):**
- L-T-R connection (luminosity, temperature, radius)
- Why blackbodies matter for stellar physics

**Connection to the Course:**
- L5-L6: Motion reveals mass
- L7-L8: Light reveals temperature
- L9: Spectral lines reveal composition and motion
:::
```

**Optional "Blackbody Physics in 60 Seconds" box:**

```
::: {.callout-tip title="Blackbody Physics in 60 Seconds" collapse="true"}
If you only remember three things:

1. **Everything glows.** Objects emit thermal radiation because of their
   temperature. Hotter = brighter and bluer.

2. **Wien's Law:** $\lambda_{peak} \propto 1/T$. Measure the peak wavelength
   of emitted light → know the temperature.

3. **Stefan-Boltzmann Law:** $L \propto T^4$. Temperature has a **huge**
   effect on luminosity. Double the temperature → 16× the luminosity.

Now for the details...
:::
```

---

## Transition from L7

**Brief recap box:**

```
::: {.callout-note title="Where We Left Off (Lecture 7)"}
In Lecture 7, we established that **light is information**:

- Light is an electromagnetic wave with wavelength and frequency
- The EM spectrum ranges from radio to gamma rays
- Wavelength affects interactions: Rayleigh scattering makes skies blue
- Light intensity follows the inverse-square law

But we left a key question unanswered: **What determines what wavelength
an object emits?**

The answer: **temperature.** Today we connect temperature to the spectrum
of emitted light.
:::
```

---

# PART 1: EVERYTHING GLOWS (~25% of reading)

## Section 1.1: Thermal Radiation

**Target length:** ~2.5 pages

### The Basic Principle

**Key points:**

- All objects with temperature above absolute zero emit electromagnetic radiation
- This is called **thermal radiation** or **blackbody radiation**
- The radiation comes from the thermal motion of charged particles (atoms, electrons)
- No external source needed — the object emits because it has internal energy

**Margin definitions:**

- **Thermal radiation:** Electromagnetic radiation emitted by an object due to its temperature
- **Absolute zero:** The lowest possible temperature (0 K = -273°C); all thermal motion stops

### Examples Across Temperatures

| Object | Temperature | Peak Wavelength | What It Emits |
|--------|-------------|-----------------|---------------|
| Cosmic background | 2.7 K | ~1 mm | Microwaves |
| Liquid nitrogen | 77 K | ~38 μm | Far infrared |
| Room temperature | 300 K | ~10 μm | Infrared |
| Boiling water | 373 K | ~8 μm | Infrared |
| Red-hot metal | ~1000 K | ~3 μm | Near-IR, dull red visible |
| Incandescent bulb | ~2500 K | ~1.2 μm | Mostly IR, some visible |
| Sun's surface | 5800 K | ~500 nm | Visible (peaks in green) |
| Hot blue star | 30,000 K | ~100 nm | Ultraviolet |

### The Pattern

> Notice the trend: **hotter objects emit at shorter wavelengths**. Cool objects emit mostly infrared (invisible). Heat them up and they glow dull red, then orange, then yellow, then white, then blue-white.
>
> This isn't coincidence — it's physics, captured by Wien's Law (coming up in Section 2.1).

**Check Yourself 1:**

```
::: {.callout-check-yourself title="Check Yourself 1 — Thermal Radiation"}
Which of the following emits thermal radiation?

- A) Only the Sun and stars
- B) Only objects that are visibly glowing (red-hot or hotter)
- C) Everything with temperature above absolute zero
- D) Only objects connected to power sources
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Everything with temperature above absolute zero.** Your body, the
walls, the air — everything emits thermal radiation. At room temperature,
this is mostly infrared (invisible to eyes), but it's still real EM radiation.
:::
```

---

## Section 1.2: What Is a Blackbody?

**Target length:** ~3 pages

### The Idealized Emitter

**Key points:**

- A **blackbody** is an idealized object that absorbs all incident radiation
- It re-emits that energy as thermal radiation with a spectrum that depends **only on temperature**
- The spectrum shape is universal — same for any blackbody at the same temperature
- Real objects approximate blackbodies to varying degrees

**Margin definition:**

- **Blackbody:** An idealized object that absorbs all incident radiation and emits thermal radiation with a spectrum determined solely by its temperature

### Why "Black" Body?

> The name is counterintuitive. A blackbody glows! But "black" refers to **absorption**, not emission. A perfect blackbody absorbs all light that hits it — it doesn't reflect anything. That absorbed energy is re-radiated as thermal emission.
>
> Ironically, a blackbody at high temperature is anything but black — it's brilliantly luminous!

### The Blackbody Spectrum

> When you plot intensity vs. wavelength for a blackbody, you get a characteristic curve:
>
> - Starts at zero intensity for very short wavelengths
> - Rises to a peak at some wavelength (which depends on temperature)
> - Falls off at longer wavelengths
> - The entire curve shifts to shorter wavelengths as temperature increases

**Figure placeholder:**

```
{{< fig blackbody-spectrum-temps >}}

FIGURE: Blackbody Spectra at Different Temperatures
DESCRIPTION: Show blackbody curves for several temperatures:
- 3000 K (cool red star) — peak in infrared, red visible
- 5800 K (Sun) — peak in green visible
- 10,000 K (hot star) — peak in UV, appears blue-white
- X-axis: wavelength (nm), visible region highlighted
- Y-axis: intensity
- Higher T curves are higher AND shifted left
ALT TEXT: Blackbody spectra at different temperatures; hotter objects
have higher peaks at shorter wavelengths.
```

### Why Stars Are (Nearly) Blackbodies

> Stars are excellent approximations of blackbodies (for their **smooth continuum spectrum**) because:
>
> 1. They're **opaque** — photons interact many times before escaping.
> 2. Those repeated interactions tend to **thermalize** the radiation, producing a spectrum close to a blackbody.
> 3. The light we see comes from the **photosphere**, which can be described by an effective temperature.
>
> Real stellar spectra are not perfect blackbodies — **spectral lines** sit on top of the blackbody-like continuum. We'll use those lines in Lecture 9 to get composition and motion.

**Demo connection:**

```
::: {.callout-tip title="🖥️ Demo: Explore Blackbody Spectra" collapse="false"}
Open the **[Blackbody Radiation Interactive Demo](/demos/blackbody-radiation/)**
to see how the spectrum changes with temperature. Try adjusting the
temperature slider and watch the peak shift from infrared through
visible to ultraviolet.
:::
```

### Check Yourself 2:

```
::: {.callout-check-yourself title="Check Yourself 2 — Blackbody Concept"}
A blackbody's emission spectrum depends on:

- A) What the object is made of
- B) The object's color and reflectivity
- C) Only the object's temperature
- D) The type of electromagnetic wave hitting it
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Only the object's temperature.** This is the remarkable property of
blackbodies: the shape of the spectrum is universal. A blackbody iron ball
at 5800 K emits the same spectrum as a blackbody tungsten ball at 5800 K
(or the Sun at 5800 K). Temperature alone determines the spectrum.
:::
```

---

# PART 2: WIEN'S LAW — TEMPERATURE FROM COLOR (~25% of reading)

## Section 2.1: The Peak Wavelength

**Target length:** ~3 pages

### Predict First

```
::: {.callout-note title="🤔 Predict First"}
If you double an object's temperature (in Kelvin), does its peak
wavelength:

A) Double
B) Stay the same
C) Get cut in half
D) Decrease by a factor of 4

Think about it before reading on...
:::
```

### Wien's Law

```
::: {.callout-important title="Wien's Displacement Law"}
The peak wavelength of a blackbody's emission is inversely proportional
to its temperature:

$$\lambda_{peak} = \frac{2.9 \times 10^{-3} \text{ m·K}}{T}$$

or in convenient form for visible light:

$$\lambda_{peak} \text{ (nm)} = \frac{2,900,000}{T \text{ (K)}}$$

**Hotter objects peak at shorter wavelengths.**
:::
```

**Unit check (so you don’t get nonsense):**

```
::: {.callout-tip title="Unit Check for Wien's Law" collapse="true"}
Use **one** version at a time and match the units:

- If you use the **m·K** form, $\lambda_{peak}$ must be in **meters** and $T$ in **Kelvin**.
- If you use the **nm** form, $\lambda_{peak}$ must be in **nanometers** and $T$ in **Kelvin**.
:::
```

**Answer to prediction:** **C) Get cut in half.** Double the temperature → half the peak wavelength.

### What This Means

> Wien's Law is the astronomer's thermometer. Measure where an object's spectrum peaks, and you know its temperature.
>
> - **Cool red star (3000 K):** Peak at ~970 nm (infrared, but visible tail is red)
> - **Sun (5800 K):** Peak at ~500 nm (green!)
> - **Hot blue star (25,000 K):** Peak at ~120 nm (UV, but visible tail is blue)

**Margin definition:**

- **Wien's Law:** The relationship between temperature and peak emission wavelength; $\lambda_{peak} \propto 1/T$

### Worked Example

> **Problem:** A star's spectrum peaks at 290 nm (ultraviolet). What is its surface temperature?
>
> **Solution:**
> $$T = \frac{2,900,000 \text{ nm·K}}{\lambda_{peak}} = \frac{2,900,000}{290} = 10,000 \text{ K}$$
>
> This is a hot, blue-white star — about twice the Sun's temperature.

### Check Yourself 3:

```
::: {.callout-check-yourself title="Check Yourself 3 — Wien's Law"}
A cool red star has a surface temperature of 3000 K. Approximately where
does its spectrum peak?

- A) 100 nm (ultraviolet)
- B) 500 nm (visible green)
- C) 970 nm (near-infrared)
- D) 10,000 nm (far infrared)
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) 970 nm (near-infrared).** Using Wien's Law:
$\lambda_{peak} = 2,900,000/3000 = 967$ nm ≈ 970 nm.

This is just beyond the red end of visible light. The star appears red
because the visible tail of its blackbody curve favors red wavelengths.
:::
```

---

## Section 2.2: The "Sun Is Green" Puzzle

**Target length:** ~2 pages

### The Puzzle

> Plug the Sun's temperature (5800 K) into Wien's Law:
>
> $$\lambda_{peak} = \frac{2,900,000}{5800} = 500 \text{ nm}$$
>
> That's **green light!** Yet the Sun doesn't look green — it looks white (or yellow when seen through atmosphere). What's going on?

### The Solution

> The Sun isn't green for two reasons:
>
> 1. **Blackbody curves are broad, not sharp.** The Sun emits significant light across the entire visible spectrum — red, orange, yellow, green, blue, violet. The peak happens to be at green, but there's plenty of light on either side.
>
> 2. **Our eyes see the combination as white.** When all visible colors are present in roughly equal amounts, our brains perceive white light. The Sun's spectrum is close enough to balanced that we see it as white (or yellow-white when atmosphere reddens it).
>
> If the Sun emitted **only** at its peak wavelength, it would look green. But blackbody spectra are continuous and broad, so we get white.

**Figure placeholder:**

```
{{< fig sun-spectrum-green >}}

FIGURE: The Sun's Spectrum — Peak at Green, Perceived as White
DESCRIPTION: Show the solar blackbody curve (5800 K):
- X-axis: wavelength with visible region highlighted
- Peak marked at ~500 nm (green)
- Show that substantial emission occurs across all visible colors
- Caption: "The Sun peaks at green but emits broadly — we see white."
ALT TEXT: The Sun's blackbody spectrum peaks at green (~500 nm) but
has significant emission across all visible wavelengths, appearing white.
```

### The More You Know: Why Our Eyes Peak There

```
::: {.callout-tip title="The More You Know: Human Vision Evolved for Sunlight" collapse="true"}
It's probably not coincidence that human eyes are most sensitive to
green light (~550 nm) — very close to where the Sun's spectrum peaks.

Our visual system evolved under sunlight. It makes sense that we'd
be most sensitive to the wavelengths where our primary light source
is brightest. Fish that live in deep water (where only blue light
penetrates) have eyes adapted for blue. Evolution matches perception
to environment.
:::
```

### Check Yourself 4 — Misconception Poll:

```
::: {.callout-check-yourself title="Check Yourself 4 — Why Isn't the Sun Green?"}
The Sun's blackbody spectrum peaks at ~500 nm (green). Why doesn't
the Sun appear green?

- A) The Sun doesn't actually emit green light
- B) Earth's atmosphere absorbs all the green
- C) The Sun emits broadly across all visible wavelengths; we see the mix as white
- D) Our eyes can't see green light
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) The Sun emits broadly across all visible wavelengths; we see the mix as white.**
The peak is at green, but blackbody curves are wide — substantial light
is emitted at all visible wavelengths. Our eyes combine them into white
(or yellow-white through atmosphere). Only if the Sun emitted a spike
at 500 nm and nothing else would we see green.
:::
```

---

## Section 2.3: Star Colors and Temperature

**Target length:** ~2 pages

### The Astronomy Payoff

> When you look at stars, their **colors tell you their temperatures**:
>
> - **Red/orange stars:** Cool (3000–4500 K)
> - **Yellow stars:** Medium (5000–6000 K), like the Sun
> - **White stars:** Hot (7000–10,000 K)
> - **Blue-white stars:** Very hot (10,000–30,000+ K)
>
> This is Wien's Law in action. No thermometer needed — just analyze the color.

**Figure placeholder:**

```
{{< fig star-colors-temperature >}}

FIGURE: Star Colors Reveal Temperature
DESCRIPTION: Show several stars with their colors and temperatures:
- Betelgeuse (red, ~3500 K)
- Sun (yellow-white, 5800 K)
- Sirius A (white, ~9900 K)
- Rigel (blue-white, ~12,000 K)
- Include spectral type labels if appropriate
ALT TEXT: Stars of different colors representing different temperatures:
red (cool) to blue-white (hot).
```

**Figure placeholder (optional, for size intuition):**

```
{{< fig betelgeuse-size-eso >}}

FIGURE: Betelgeuse Compared to the Solar System (ALMA)
DESCRIPTION: ALMA millimeter-continuum image of Betelgeuse with an overlay comparing its size to the Solar System. Emphasize: Betelgeuse would engulf Mercury, Venus, Earth, Mars, and even Jupiter; only Saturn would remain beyond its surface.
ALT TEXT: ALMA millimeter-continuum image of Betelgeuse with a Solar System size overlay indicating the star would extend beyond Jupiter’s orbit.
```

### Real-World Application

> When JWST observes a distant planet-forming disk, it measures the infrared spectrum. By finding the peak, astronomers can determine the temperature of the dust — revealing whether it's warm enough for certain chemical reactions or cool enough for ice to form.
>
> No physical contact. No sample collection. Just light, carrying temperature information across cosmic distances.

### Check Yourself 5:

```
::: {.callout-check-yourself title="Check Yourself 5 — Star Colors"}
Rank these stars from coolest to hottest: Rigel (blue-white),
Betelgeuse (red), Sun (yellow-white).

- A) Rigel, Sun, Betelgeuse
- B) Betelgeuse, Sun, Rigel
- C) Sun, Betelgeuse, Rigel
- D) They're all the same temperature
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Betelgeuse, Sun, Rigel** (coolest to hottest). Red stars are cool
(Wien's Law: longer peak wavelength = lower temperature). Blue stars
are hot (shorter peak wavelength = higher temperature). The Sun is
in between.
:::
```

---

# PART 3: STEFAN-BOLTZMANN LAW — TEMPERATURE AND LUMINOSITY (~25% of reading)

## Section 3.1: How Much Light Does an Object Emit?

**Target length:** ~2.5 pages

### Predict First

```
::: {.callout-note title="🤔 Predict First"}
If you double an object's temperature (in Kelvin), does its total
energy output (luminosity):

A) Double
B) Quadruple
C) Increase by a factor of 8
D) Increase by a factor of 16

Think about it before reading on...
:::
```

### The Stefan-Boltzmann Law

```
::: {.callout-important title="Stefan-Boltzmann Law"}
The total energy radiated per unit surface area by a blackbody is
proportional to the **fourth power** of temperature:

$$\text{Power per area} = \sigma T^4$$

where $\sigma = 5.67 \times 10^{-8}$ W/m²/K⁴ (Stefan-Boltzmann constant)

**Temperature has a HUGE effect on luminosity.**
:::
```

**Answer to prediction:** **D) Increase by a factor of 16.** Double the temperature → $2^4 = 16$ times the energy output!

### What This Means

> The fourth power is dramatic:
>
> | Temperature Factor | Luminosity Factor |
> |-------------------|-------------------|
> | 2× hotter | $2^4 = 16×$ more luminous |
> | 3× hotter | $3^4 = 81×$ more luminous |
> | 10× hotter | $10^4 = 10,000×$ more luminous |
>
> A blue star twice as hot as the Sun (at the same size) would be **16 times more luminous** — not twice. Temperature is the dominant factor in stellar luminosity.

**Margin definition:**

- **Stefan-Boltzmann Law:** Radiated power per area scales as $T^4$; hotter objects emit dramatically more energy

### Check Yourself 6:

```
::: {.callout-check-yourself title="Check Yourself 6 — Stefan-Boltzmann"}
Star A has twice the surface temperature of Star B. If both have the
same radius, how does Star A's luminosity compare to Star B's?

- A) 2× more luminous
- B) 4× more luminous
- C) 8× more luminous
- D) 16× more luminous
:::

::: {.callout-tip title="Solution" collapse="true"}
**D) 16× more luminous.** By the Stefan-Boltzmann Law, luminosity scales
as $T^4$ (for same size). If Star A is twice as hot: $(2)^4 = 16$ times
more luminous.
:::
```

---

## Section 3.2: The Luminosity-Temperature-Radius Connection

**Target length:** ~3.5 pages

### The Full Relationship

> The Stefan-Boltzmann Law gives power per unit **area**. To get total luminosity, multiply by the star's surface area ($4\pi R^2$ for a sphere):

```
::: {.callout-important title="The L-T-R Relationship"}
$$L = 4\pi R^2 \sigma T^4$$

**Luminosity depends on both size (R²) and temperature (T⁴).**

A star can be luminous because:
- It's very hot (even if small)
- It's very large (even if cool)
- Or both!
:::
```

### What This Tells Us

> Two stars at the **same temperature** but **different luminosities** must have **different sizes**:
>
> - If Star A and Star B have the same $T$ but Star A is 100× more luminous...
> - Then Star A must have 10× the radius (since $L \propto R^2$)
>
> This is how we distinguish **giants** from **dwarfs** observationally: same temperature, different luminosity → different radius.

**Figure placeholder:**

```
{{< fig giant-vs-dwarf >}}

FIGURE: Same Temperature, Different Luminosity → Different Size
DESCRIPTION: Show two stars at the same temperature (same color):
- A small "dwarf" star (e.g., Sun-sized)
- A large "giant" star (much bigger radius)
- Both same color (same T), but giant is much brighter
- Label luminosities and radii
ALT TEXT: A red giant and a red dwarf at the same temperature but
vastly different sizes and luminosities.
```

### Worked Example

> **Problem:** Two stars have the same surface temperature (same color). Star A has 100× the luminosity of Star B. How do their radii compare?
>
> **Solution:** Since $L \propto R^2 T^4$ and $T$ is the same:
> $$\frac{L_A}{L_B} = \frac{R_A^2}{R_B^2} = 100$$
> $$\frac{R_A}{R_B} = \sqrt{100} = 10$$
>
> Star A has **10 times the radius** of Star B.

### Preview: The H-R Diagram

> In Module 2, we'll study the **Hertzsprung-Russell (H-R) diagram** — a plot of stellar luminosity vs. temperature. You'll see that:
>
> - **Main sequence stars** (like the Sun) follow a diagonal strip
> - **Giants and supergiants** are above the main sequence — same temperature, higher luminosity, therefore larger
> - **White dwarfs** are below — same temperature, lower luminosity, therefore smaller
>
> The L-T-R relationship makes sense of the whole diagram.

**Check Yourself 7:**

```
::: {.callout-check-yourself title="Check Yourself 7 — Giants vs Dwarfs"}
A red giant and a red dwarf have the same surface temperature (both
appear red). The red giant is 10,000× more luminous. How do their
radii compare?

- A) The giant's radius is 10× the dwarf's
- B) The giant's radius is 100× the dwarf's
- C) The giant's radius is 10,000× the dwarf's
- D) Their radii are the same
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) The giant's radius is 100× the dwarf's.** Since both have the same
temperature, $L \propto R^2$. If luminosity ratio is 10,000, then:
$R_{giant}/R_{dwarf} = \sqrt{10,000} = 100$.

The red giant's radius is 100× larger than the red dwarf's!
:::
```

### Check Yourself 8 — Synthesis:

```
::: {.callout-check-yourself title="Check Yourself 8 — L-T-R Synthesis"}
Star X is twice as hot as Star Y and has half the radius. How does
Star X's luminosity compare to Star Y's?

- A) Same luminosity
- B) 2× more luminous
- C) 4× more luminous
- D) 8× more luminous
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) 4× more luminous.** Using $L \propto R^2 T^4$:

$$\frac{L_X}{L_Y} = \left(\frac{R_X}{R_Y}\right)^2 \left(\frac{T_X}{T_Y}\right)^4 = \left(\frac{1}{2}\right)^2 \times (2)^4 = \frac{1}{4} \times 16 = 4$$

Temperature's $T^4$ dependence dominates over the smaller size.
:::
```

---

# PART 4: TRANSITION TO SPECTRAL LINES (~15% of reading)

## Section 4.1: What Blackbodies Can and Cannot Tell Us

**Target length:** ~2 pages

### The Power of Blackbody Physics

> With blackbody radiation, we can measure:
>
> - **Temperature** (from peak wavelength via Wien's Law)
> - **Luminosity** (from the total spectrum intensity via Stefan-Boltzmann)
> - **Radius** (if we know both L and T, we can calculate R)
>
> This is remarkable — three fundamental properties of a star, from analyzing its light.

### What's Missing?

> But there's something blackbody spectra **can't** tell us directly:
>
> - **Composition:** What is the star made of? Hydrogen? Helium? Metals?
> - **Motion:** Is the star moving toward or away from us?
> - **Chemical abundances:** How much of each element is present?
>
> A perfect blackbody spectrum is smooth — no features, no fingerprints. To get composition and motion, we need something more.

---

## Section 4.2: Enter Spectral Lines

**Target length:** ~1.5 pages

### The Preview

> Here's the key insight for Lecture 9: **Real stars aren't perfect blackbodies.** Their spectra have discrete features — bright or dark lines at specific wavelengths. These are **spectral lines**, and they're the fingerprints of chemical elements.
>
> - Each element absorbs or emits light at specific wavelengths
> - The pattern of lines is unique to each element — like a barcode
> - By identifying the lines, we identify the elements present
> - By measuring line shifts, we detect motion (Doppler effect)

**Transition callout:**

```
::: {.callout-note title="Coming Up: Spectral Lines (Lecture 9)"}
**Lecture 8 (today):** Blackbody radiation tells us temperature (Wien's Law)
and luminosity (Stefan-Boltzmann). Peak wavelength reveals how hot a star is.

**Lecture 9 (next):** Spectral lines tell us composition (what elements are
present) and motion (Doppler shifts). They're the missing pieces that turn
temperature into a full chemical and kinematic portrait.

**Together:** We can measure a star's temperature, luminosity, size,
composition, and velocity — all from analyzing its light.
:::
```

### Foreshadowing

> When you observe the Sun's spectrum, you see the smooth blackbody curve with hundreds of **dark lines** superimposed — wavelengths where light has been absorbed by atoms in the Sun's outer layers. In 1860, Gustav Kirchhoff showed that each element produces its own unique pattern of lines.
>
> We'll explore this in detail in Lecture 9, where we'll learn to "read" stellar spectra like chemical barcodes.

---

# CLOSING ELEMENTS

## Summary Box

```
::: {.callout-important title="Key Takeaways from Lecture 8"}
1. **Everything above absolute zero emits thermal radiation.**
   Hotter objects emit more and at shorter wavelengths.

2. **A blackbody** is an idealized perfect emitter/absorber whose spectrum
   depends only on temperature.

3. **Wien's Law:** $\lambda_{peak} = 2.9 \times 10^{-3}/T$ (in meters and K).
   Hot → peak at short wavelengths (blue). Cool → peak at long (red).

4. **The Sun peaks at green (~500 nm)** but appears white because it emits
   broadly across all visible wavelengths.

5. **Stefan-Boltzmann Law:** Energy output scales as $T^4$.
   Double temperature → 16× more luminous.

6. **L-T-R Relationship:** $L = 4\pi R^2 \sigma T^4$.
   Same temperature, different luminosity → different size.
   This distinguishes giants from dwarfs.

7. **Blackbodies reveal temperature, but not composition or motion.**
   For those, we need spectral lines (Lecture 9).
:::
```

---

## Practice Problems

### Core (do these first)

1. **Wien's Law:** A star's spectrum peaks at 580 nm. Calculate its surface temperature.

2. **Wien's Law (reverse):** What is the peak wavelength for a 4000 K star? Is this in visible light, infrared, or ultraviolet?

3. **Stefan-Boltzmann:** Star A is three times hotter than Star B. If they have the same radius, how much more luminous is Star A?

4. **L-T-R:** Two stars have identical temperatures but one is 400× more luminous. How do their radii compare?

5. **Conceptual:** Why does the Sun appear white rather than green, even though its peak wavelength is in the green part of the spectrum?

6. **Star colors:** Rank these stars from coolest to hottest based on color: a red star, a blue star, a yellow star.

### Challenge

7. **Combined Wien + Stefan-Boltzmann:** Star X has twice the temperature and half the radius of Star Y.
   - Where does Star X's spectrum peak relative to Star Y's?
   - How does Star X's luminosity compare to Star Y's?

8. **Earth as a blackbody:** Earth has an effective temperature of about 255 K (due to energy balance with sunlight). At what wavelength does Earth's thermal emission peak? In what part of the EM spectrum is this?

9. **Size from L and T (OoM):** The star Betelgeuse has a surface temperature of about 3500 K and a luminosity of about $10^5\,L_\odot$ (order of magnitude). The Sun has $T = 5800$ K and $L = 1 L_\odot$. Estimate the ratio $R_{Betelgeuse}/R_{Sun}$.

::: {.callout-tip title="Solution sketch (OoM)" collapse="true"}
Use the scaling from Stefan–Boltzmann:
\[
\frac{L}{L_\odot}=\left(\frac{R}{R_\odot}\right)^2\left(\frac{T}{T_\odot}\right)^4
\quad\Rightarrow\quad
\frac{R}{R_\odot}=\left(\frac{L}{L_\odot}\right)^{1/2}\left(\frac{T}{T_\odot}\right)^{-2}.
\]
With $L/L_\odot \sim 10^5$ we have $\sqrt{L/L_\odot}\sim 3\times 10^2$. With $T/T_\odot \sim 3500/5800 \approx 0.6$, we get
\[
\frac{R}{R_\odot}\sim \frac{3\times 10^2}{(0.6)^2}\approx 9\times 10^2 \sim 10^3.
\]
(Order of magnitude: hundreds to a few thousand.)
:::

10. **Why blackbodies matter:** Explain in your own words why blackbody physics is useful for astronomy, and what additional information (beyond temperature) requires spectral lines.

---

## Glossary

| Term | Definition |
|------|------------|
| **Thermal radiation** | EM radiation emitted by an object due to its temperature |
| **Blackbody** | An idealized object that absorbs all incident radiation and emits with a spectrum depending only on $T$ |
| **Blackbody spectrum** | The characteristic continuous spectrum emitted by a blackbody; shape depends only on temperature |
| **Wien's Law** | $\lambda_{peak} \propto 1/T$; hotter objects peak at shorter wavelengths |
| **Stefan-Boltzmann Law** | Power per area $= \sigma T^4$; radiated energy scales steeply with temperature |
| **Luminosity (L)** | Total power radiated by an object (watts or $L_\odot$) |
| **L-T-R relationship** | $L = 4\pi R^2 \sigma T^4$; connects luminosity, temperature, and radius |
| **Giant star** | A star with large radius and high luminosity relative to its temperature |
| **Dwarf star** | A star with small radius and low luminosity relative to its temperature |
| **Spectral lines** | Discrete features in a spectrum from absorption or emission by specific elements (covered in L9) |

---

## Figure Checklist

| Figure ID | Description | Status |
|-----------|-------------|--------|
| `infrared-thermal-image` | Thermal camera showing warm objects glowing | ☐ |
| `blackbody-spectrum-temps` | Blackbody curves at different temperatures | ☐ |
| `sun-spectrum-green` | Solar spectrum showing peak at green, broad emission | ☐ |
| `star-colors-temperature` | Stars of different colors/temperatures | ☐ |
| `betelgeuse-size-eso` | Betelgeuse size vs Solar System (ALMA overlay) | ☐ |
| `giant-vs-dwarf` | Same temperature, different size/luminosity | ☐ |

---

## Module 1 Completion Check

**With L8 complete, students should now understand:**

✅ The scale of the universe and our place in it (L1-L2)
✅ Celestial coordinates, seasons, Moon phases, eclipses (L3-L4)
✅ Kepler's Laws: orbits are ellipses, equal areas, $P^2 \propto a^3$ (L5)
✅ Newton's Laws: gravity explains Kepler; orbits reveal mass (L6)
✅ Light as information: wavelength, EM spectrum, scattering (L7)
✅ Temperature from light: Wien's Law, Stefan-Boltzmann, L-T-R (L8)

**Coming up in Module 1 conclusion:**
L9: Spectral lines — composition and motion from light

---

*End of L8 Outline (v1)*
