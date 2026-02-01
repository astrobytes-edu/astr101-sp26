# Week 6, Lecture 11: Our Cosmic Backyard — Solar System Architecture & Formation

**Status:** DRAFT OUTLINE — v1
**Target length:** ~20-25 rendered pages
**Filename when complete:** `lecture-11-solar-system-reading.qmd`

**Note:** Monday lecture (Feb 23). First of a 3-lecture capstone week reinforcing Module 1 concepts before the exam.

**Instructor note to students:** "This week is designed to reinforce everything you've learned — we're applying all our tools to the solar system, exoplanets, and the biggest question: Are we alone?"

---

## Instructor Approval Checklist

### Content — Solar System

- [ ] Opening frames solar system as "applying our toolkit to our neighborhood"
- [ ] Architecture: rocky planets → asteroid belt → gas giants → ice giants → Kuiper belt → Oort cloud
- [ ] **Key pattern emphasized:** Why rocky inside, gas outside? (Frost line)
- [ ] Formation via nebular hypothesis with angular momentum callback (L5-L6)
- [ ] **Toolkit reinforcement table:** How we know distances, masses, temperatures, compositions

### Concept Reinforcement (Module 1 Review)

- [ ] **L5 Kepler's Laws:** Planetary distances, orbital periods
- [ ] **L6 Newton's gravity:** Orbits → masses of planets and moons
- [ ] **L7 EM spectrum:** Why we observe planets at different wavelengths
- [ ] **L8 Blackbody/Wien:** Planetary temperatures from IR observations
- [ ] **L9 Spectroscopy:** Atmospheric compositions
- [ ] **L10 Doppler:** Planetary rotation rates

### Pedagogy

- [ ] Framed as capstone/reinforcement, not brand new content
- [ ] Check Yourself questions test prior concepts in new context
- [ ] Practice problems connect to Module 1 tools
- [ ] Tone matches L1-L10 (conversational but rigorous)

### Formatting

- [ ] YAML front matter correct
- [ ] Math minimal (this is mostly conceptual)
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
title: "Our Cosmic Backyard — Solar System Architecture & Formation"
subtitle: "Lecture 11 Reading Companion"
author: "Dr. Anna Rosen"
date: "2026-02-23"
description: "The solar system is where we apply everything we've learned. Kepler's Laws give us distances. Newton's gravity gives us masses. Blackbody radiation gives us temperatures. Spectroscopy gives us compositions. This lecture tours our cosmic neighborhood and explains how it formed."
draft: false
categories: [solar-system, formation, capstone]
course: ASTR 101
module: "1 - Foundations"
learning-objectives:
  - Describe the architecture of the solar system (rocky planets, gas giants, ice giants, small bodies)
  - Explain the nebular hypothesis for solar system formation
  - Apply Kepler's Laws, Newton's gravity, and spectroscopy to determine planetary properties
  - Explain why rocky planets formed close to the Sun and gas giants formed farther out
math-level: algebra_only
prerequisites: Lectures 5-10 (this lecture applies all prior tools)
---
```

---

## The Big Idea

> The solar system is our laboratory for testing everything we've learned. We can measure planetary distances (Kepler), masses (Newton), temperatures (Wien), and compositions (spectroscopy) — all from Earth. Understanding how it formed explains why rocky planets are close to the Sun and gas giants are far away. This is Module 1 in action.

---

## Opening Hook: Your Toolkit, Applied

**Target length:** ~1.5 pages

**Key narrative beats:**

1. We've built powerful tools: gravity, orbits, light, spectra, Doppler
2. Now let's use them on something familiar: our own solar system
3. How do we know Mercury is rocky? How do we know Jupiter is massive? How do we know Neptune is cold?
4. Everything we measure about planets uses the physics from Lectures 5-10
5. This lecture: A tour + how the solar system formed

**Draft opening:**

> Over the past weeks, you've assembled a powerful toolkit. Kepler's Laws describe orbits. Newton's gravity reveals mass. Blackbody radiation encodes temperature. Spectral lines fingerprint composition. The Doppler effect measures motion.
>
> Now let's use these tools on something close to home: **our own solar system**.
>
> How do we know Mercury's surface reaches 430°C? Wien's Law — we measure its infrared emission. How do we know Jupiter is 318 times Earth's mass? Newton's gravity — we watch its moons orbit. How do we know Mars has CO₂ in its atmosphere? Spectroscopy — we see absorption lines.
>
> Every fact you've learned about planets comes from the physics in this course. The solar system isn't just a list of objects to memorize — it's a **laboratory** where we apply our tools.
>
> Today we'll tour the solar system's architecture: rocky planets, gas giants, ice giants, and the swarms of small bodies beyond. Then we'll explain *why* it looks this way — how a collapsing cloud of gas and dust became the orderly system we see today. Along the way, we'll reinforce every major concept from Module 1.

---

## "How to Use This Reading" Callout

```
::: {.callout-important title="How to Use This Reading" collapse="true"}
This reading tours the solar system while **reinforcing Module 1 concepts**.
Think of it as a capstone: we're applying Kepler, Newton, blackbody, and
spectroscopy to our cosmic neighborhood.

**Structure:**
- **Part 1:** Solar system architecture — what's out there?
- **Part 2:** Applying our toolkit — how do we know what we know?
- **Part 3:** Formation — why does it look this way?

**Reading time:** ~25-30 min

**Exam connection:** This week (L11-L13) is designed to reinforce all
Module 1 concepts before the exam. Pay attention to how prior tools
get applied!

**What's next:** L12 compares planetary climates (Venus vs. Earth vs. Mars)
and covers exoplanet detection. L13 tackles the big question: Are we alone?
:::
```

---

## Course Throughline: The Module 1 Toolkit

```
::: {.callout-note title="Module 1 Toolkit — Now Applied to Planets"}
| Tool | From Lecture | Solar System Application |
|------|--------------|-------------------------|
| Kepler's Laws | L5 | Orbital distances, periods, predicting positions |
| Newton's Gravity | L6 | Planetary and moon masses from orbits |
| EM Spectrum | L7 | Observing planets at IR, radio, UV |
| Blackbody/Wien | L8 | Surface and atmospheric temperatures |
| Spectroscopy | L9 | Atmospheric compositions |
| Doppler Effect | L10 | Rotation rates, wind speeds |

**This week:** We apply ALL of these to planets, climate, exoplanets,
and the search for life.
:::
```

---

# PART 1: SOLAR SYSTEM ARCHITECTURE (~30% of reading)

## Section 1.1: The Grand Tour

**Target length:** ~3 pages

### The Layout

> Our solar system has a clear structure, organized by distance from the Sun:

**Figure placeholder:**

```
{{< fig solar-system-architecture >}}

FIGURE: Solar System Architecture (Not to Scale)
DESCRIPTION: Diagram showing the zones of the solar system:
- Inner solar system: Mercury, Venus, Earth, Mars (rocky planets)
- Asteroid belt between Mars and Jupiter
- Outer solar system: Jupiter, Saturn (gas giants), Uranus, Neptune (ice giants)
- Kuiper Belt beyond Neptune (including Pluto)
- Oort Cloud at the outer edges (comets)
- Label distances in AU
ALT TEXT: The solar system organized by zones: rocky planets, asteroid belt,
gas giants, ice giants, Kuiper Belt, and Oort Cloud.
```

### The Zones

| Zone | Distance | Objects | Key Properties |
|------|----------|---------|----------------|
| **Rocky planets** | 0.4–1.5 AU | Mercury, Venus, Earth, Mars | Small, dense, solid surfaces |
| **Asteroid belt** | 2–4 AU | Millions of rocky/metallic bodies | Failed planet (Jupiter's gravity) |
| **Gas giants** | 5–10 AU | Jupiter, Saturn | Massive, H/He dominated, no solid surface |
| **Ice giants** | 20–30 AU | Uranus, Neptune | Smaller, more ices (water, ammonia, methane) |
| **Kuiper Belt** | 30–50 AU | Pluto, Eris, comets | Icy bodies, leftover from formation |
| **Oort Cloud** | ~2,000–100,000 AU | Long-period comets | Spherical halo, barely bound to Sun |

### The Key Pattern

> Notice something striking: **rocky planets are close to the Sun; gas giants are far away.** This isn't random — it's a direct consequence of how the solar system formed. We'll explain why in Part 3.

**Margin definitions:**

- **Astronomical Unit (AU):** The average Earth-Sun distance, ~150 million km. A convenient unit for solar system distances.
- **Gas giant:** A large planet composed primarily of hydrogen and helium (Jupiter, Saturn).
- **Ice giant:** A large planet with substantial amounts of water, ammonia, and methane ices (Uranus, Neptune).
- **Kuiper Belt:** A disk of icy bodies beyond Neptune, including Pluto.
- **Oort Cloud:** A distant spherical shell of icy bodies, source of long-period comets.

---

## Section 1.2: Rocky vs. Giant Planets

**Target length:** ~2 pages

### Two Families of Planets

| Property | Rocky (Terrestrial) | Giants |
|----------|--------------------:|-------:|
| Size | Small (0.4–1 R⊕) | Large (4–11 R⊕) |
| Mass | Low (0.06–1 M⊕) | High (15–318 M⊕) |
| Density | High (4–5 g/cm³) | Low (0.7–1.6 g/cm³) |
| Composition | Rock, metal | H, He, ices |
| Surface | Solid | None (gas/liquid) |
| Moons | Few (0–2) | Many (dozens) |
| Rings | None | Yes |

### Check Yourself 1:

```
::: {.callout-check-yourself title="Check Yourself 1 — Planet Classification"}
Saturn has a density of 0.69 g/cm³ — less than water. What does this
tell you about its composition?

- A) It must be made of rock and metal
- B) It must be made primarily of lightweight gases (hydrogen, helium)
- C) It has no atmosphere
- D) It's the same composition as Earth
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) It must be made primarily of lightweight gases (hydrogen, helium).**
Rocky planets have densities of 4-5 g/cm³. Saturn's low density tells us
it's dominated by hydrogen and helium, the lightest elements. If you could
find a big enough ocean, Saturn would float!
:::
```

---

# PART 2: APPLYING OUR TOOLKIT (~35% of reading)

## Section 2.1: How Do We Know What We Know?

**Target length:** ~4 pages

### The Power of Remote Sensing

> We've never brought back samples from Jupiter. We've never landed on Neptune. Yet we know their masses, compositions, temperatures, and rotation rates. How?
>
> **Everything comes from the physics of Module 1.**

### Toolkit Application Table

```
::: {.callout-important title="Measuring Planets with Module 1 Tools"}
| What We Measure | The Tool | The Physics |
|-----------------|----------|-------------|
| **Distance** | Radar timing + Kepler III | Light travel time; $P^2 \propto a^3$ |
| **Orbital period** | Observation over time | Track position against stars |
| **Mass (with moons)** | Moon orbits + Newton | $M = \frac{4\pi^2 a^3}{GP^2}$ |
| **Mass (no moons)** | Spacecraft tracking | Gravity bends spacecraft path |
| **Temperature** | IR spectrum + Wien | Peak wavelength → temperature |
| **Composition** | Spectral lines | Absorption/emission fingerprints |
| **Rotation rate** | Doppler broadening | Approaching side blueshifted, receding redshifted |
| **Wind speeds** | Doppler of cloud features | Track motion over time |
:::
```

### Worked Example: Jupiter's Mass from Io's Orbit

> **Problem:** Jupiter's moon Io orbits at a = 422,000 km with period P = 1.77 days. Use Newton's form of Kepler's Third Law to find Jupiter's mass.
>
> **Solution:**
>
> Step 1: Convert units
> - a = 422,000 km = 4.22 × 10⁸ m
> - P = 1.77 days = 1.53 × 10⁵ s
>
> Step 2: Apply Newton's version of Kepler III
> $$M = \frac{4\pi^2 a^3}{GP^2} = \frac{4\pi^2 (4.22 \times 10^8)^3}{(6.67 \times 10^{-11})(1.53 \times 10^5)^2}$$
>
> Step 3: Calculate
> $$M = \frac{4\pi^2 \times 7.51 \times 10^{25}}{6.67 \times 10^{-11} \times 2.34 \times 10^{10}} = \frac{2.97 \times 10^{27}}{1.56 \times 10^{0}} = 1.9 \times 10^{27} \text{ kg}$$
>
> This is **318 Earth masses** — determined entirely by watching Io orbit!

### Check Yourself 2:

```
::: {.callout-check-yourself title="Check Yourself 2 — Applying Newton"}
If a planet has a moon orbiting at twice the distance but with the same
orbital period, what can you conclude about the planet's mass compared
to another planet with the original moon orbit?

- A) The same mass
- B) 2× the mass
- C) 4× the mass
- D) 8× the mass
:::

::: {.callout-tip title="Solution" collapse="true"}
**D) 8× the mass.** From $M = 4\pi^2 a^3 / (GP^2)$, if $a$ doubles and $P$
stays the same, $M$ must increase by $2^3 = 8$ times. Larger orbits at
the same period require stronger gravity → more mass.
:::
```

---

## Section 2.2: Temperature from Wien's Law

**Target length:** ~1.5 pages

### Planets Glow in the Infrared

> Every planet emits thermal radiation. Using Wien's Law from L8:
>
> $$\lambda_{peak} = \frac{2.9 \times 10^6 \text{ nm}}{T}$$
>
> We can measure a planet's peak emission wavelength and calculate its temperature.

### Planetary Temperatures

| Planet | Distance (AU) | T_equilibrium (K) | T_observed (K) | Notes |
|--------|---------------|-------------------|----------------|-------|
| Mercury | 0.39 | ~440 | 100-700 | No atmosphere, extreme variation |
| Venus | 0.72 | ~230 | **735** | Runaway greenhouse! |
| Earth | 1.0 | ~255 | 288 | Moderate greenhouse |
| Mars | 1.52 | ~210 | 218 | Thin atmosphere |
| Jupiter | 5.2 | ~110 | 165 | Internal heat source |

> Venus stands out: its actual temperature is **500 K hotter** than expected! This is the greenhouse effect — and we'll explore it in L12.

---

## Section 2.3: Compositions from Spectroscopy

**Target length:** ~1.5 pages

### Atmospheric Fingerprints

> By observing planets at different wavelengths and looking for spectral lines (L9), we determine atmospheric compositions:
>
> - **Venus:** CO₂ (96%), N₂ (3.5%), sulfuric acid clouds
> - **Earth:** N₂ (78%), O₂ (21%), trace CO₂, H₂O
> - **Mars:** CO₂ (95%), N₂ (2.7%), thin atmosphere
> - **Jupiter:** H₂ (~90%), He (~10%), traces of CH₄, NH₃, H₂O
>
> The same spectroscopy that identifies elements in stars identifies molecules in planetary atmospheres!

### Check Yourself 3:

```
::: {.callout-check-yourself title="Check Yourself 3 — Applying L8 and L9"}
Mars appears red to our eyes. Neptune appears blue. Using concepts from
L7-L9, which planet likely has methane (CH₄) in its atmosphere?

- A) Mars — red color means methane
- B) Neptune — methane absorbs red light, leaving blue
- C) Both have methane
- D) Neither has methane
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Neptune — methane absorbs red light, leaving blue.** Spectroscopy
confirms that Neptune (and Uranus) have methane in their atmospheres.
Methane absorbs red wavelengths, so the reflected sunlight appears blue.
Mars is red because of iron oxide (rust) on its surface, not atmospheric
absorption.
:::
```

---

# PART 3: SOLAR SYSTEM FORMATION (~35% of reading)

## Section 3.1: The Nebular Hypothesis

**Target length:** ~3 pages

### From Cloud to Disk

> The solar system formed ~4.6 billion years ago from a collapsing cloud of gas and dust called the **solar nebula**. The basic story:
>
> 1. **Collapse:** A molecular cloud region begins to collapse under its own gravity
> 2. **Spin-up:** Conservation of angular momentum causes the cloud to spin faster as it shrinks (L5-L6 callback!)
> 3. **Flattening:** Rotation flattens the cloud into a disk (material can fall inward but not through the spinning disk)
> 4. **Central star forms:** Most mass falls to the center → proto-Sun
> 5. **Planets form in the disk:** Solid particles collide and stick, building up planetesimals, then planets

**Figure placeholder:**

```
{{< fig nebular-hypothesis >}}

FIGURE: Solar System Formation — The Nebular Hypothesis
DESCRIPTION: Four-panel sequence showing:
1. Molecular cloud with slight rotation
2. Collapsing cloud spinning faster
3. Flattened disk with proto-Sun at center
4. Planets forming in disk at different distances
- Label angular momentum conservation in panel 2
- Show frost line in panel 4
ALT TEXT: Four stages of solar system formation from collapsing cloud
to flattened disk to planets.
```

### Angular Momentum Callback

```
::: {.callout-note title="L5-L6 Connection: Angular Momentum Conservation"}
Remember the figure skater from L5? Arms out = slow spin; arms in = fast spin.

The same physics explains why the solar nebula spun up as it collapsed:
$$L = mvr = \text{constant}$$

As $r$ decreases (cloud shrinks), $v$ must increase (faster rotation).

This is why:
- The Sun rotates (slowly — most angular momentum went to planets)
- All planets orbit in the same direction
- All planets orbit in nearly the same plane
- The disk formed in the first place!
:::
```

---

## Section 3.2: The Frost Line

**Target length:** ~2 pages

### Why Rocky Inside, Gas Outside?

> The **frost line** (or snow line) is the distance from the young Sun where it was cold enough for water and other volatiles to freeze into solid ice.
>
> - **Inside the frost line (~3 AU):** Too hot for ices; only rock and metal could condense
> - **Outside the frost line:** Ices could form, providing much more solid material

### The Consequence

> Rocky planets formed close to the Sun because only rock/metal was available as solid building blocks. Beyond the frost line, ices added to the solids, allowing larger cores to form. These massive cores could gravitationally capture hydrogen and helium from the nebula → gas giants!

| Region | Solid Material Available | Result |
|--------|-------------------------|--------|
| Inside frost line | Rock, metal only | Small rocky planets |
| Outside frost line | Rock + metal + ices | Large cores → capture H/He → gas giants |

### Check Yourself 4:

```
::: {.callout-check-yourself title="Check Yourself 4 — Formation"}
Why didn't Earth become a gas giant like Jupiter?

- A) Earth formed before Jupiter
- B) There wasn't enough hydrogen near Earth
- C) Earth was inside the frost line, so its core stayed small
- D) Jupiter stole all the gas
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Earth was inside the frost line, so its core stayed small.** Inside
the frost line, only rock and metal could form solid particles. Without
the extra mass from ices, Earth's core never grew large enough to
gravitationally capture the abundant hydrogen and helium gas.
:::
```

---

## Section 3.3: Evidence for the Nebular Hypothesis

**Target length:** ~1.5 pages

### The Evidence

> How do we know this model is correct? The solar system shows clear signatures:
>
> 1. **All planets orbit in the same direction** (inherited from the disk's rotation)
> 2. **All planets orbit in nearly the same plane** (the disk was flat)
> 3. **Rocky planets inside, giants outside** (frost line)
> 4. **Asteroid belt:** Jupiter's gravity prevented a planet from forming
> 5. **Meteorites:** Pristine samples from early solar system, dated to 4.6 Gyr
> 6. **Protoplanetary disks observed around other young stars!**

**Figure placeholder:**

```
{{< fig protoplanetary-disk >}}

FIGURE: Protoplanetary Disk Around a Young Star (ALMA Observation)
DESCRIPTION: Real ALMA image of a protoplanetary disk (e.g., HL Tau)
showing concentric rings and gaps where planets may be forming.
Caption: "We see solar system formation happening around other stars."
ALT TEXT: ALMA radio image showing a young star surrounded by a disk
with ring structures, likely carved by forming planets.
```

---

# CLOSING ELEMENTS

## Summary Box

```
::: {.callout-important title="Key Takeaways from Lecture 11"}
**Solar System Architecture:**
1. Rocky planets (Mercury–Mars) inside ~1.5 AU
2. Gas giants (Jupiter, Saturn) at 5–10 AU
3. Ice giants (Uranus, Neptune) at 20–30 AU
4. Small bodies: asteroid belt, Kuiper Belt, Oort Cloud

**Applying Our Toolkit:**
5. Masses from moon/spacecraft orbits (Newton's gravity, L6)
6. Temperatures from IR observations (Wien's Law, L8)
7. Compositions from spectral lines (L9)
8. Everything connects back to Module 1!

**Formation:**
9. Nebular hypothesis: collapse → spin-up → disk → planets
10. Angular momentum conservation explains disk formation and orbital patterns
11. Frost line explains rocky vs. gas giant distribution
:::
```

---

## Practice Problems

### Core (do these first)

1. **Kepler Application:** Mars orbits the Sun at 1.52 AU. Using Kepler's Third Law ($P^2 = a^3$ in Earth years and AU), calculate Mars's orbital period.

2. **Newton Application:** Saturn's moon Titan orbits at 1.22 million km with a period of 16 days. Estimate Saturn's mass. (Compare to Jupiter's mass from the worked example.)

3. **Wien Application:** Neptune's thermal emission peaks at about 50 μm (50,000 nm). Estimate Neptune's temperature using Wien's Law.

4. **Formation Concept:** Explain why all the planets orbit the Sun in the same direction and in nearly the same plane.

### Challenge

5. **Frost Line Reasoning:** If the Sun had been twice as luminous when the solar system formed, how would the frost line have been different? What consequences might this have for the distribution of planet types?

6. **Integration Problem:** You discover an exoplanet system where rocky planets extend out to 5 AU. What might this tell you about the host star compared to our Sun?

---

## Glossary

| Term | Definition |
|------|------------|
| **Astronomical Unit (AU)** | Average Earth-Sun distance; ~150 million km |
| **Terrestrial planet** | Small, rocky planet with solid surface (Mercury, Venus, Earth, Mars) |
| **Gas giant** | Massive planet dominated by hydrogen and helium (Jupiter, Saturn) |
| **Ice giant** | Large planet with substantial water, ammonia, methane (Uranus, Neptune) |
| **Kuiper Belt** | Region of icy bodies beyond Neptune, 30-50 AU |
| **Oort Cloud** | Spherical shell of icy bodies at ~2,000-100,000 AU |
| **Solar nebula** | The cloud of gas and dust from which the solar system formed |
| **Nebular hypothesis** | Model where solar system forms from a collapsing, rotating disk |
| **Frost line** | Distance where temperature allows water ice to form; ~3 AU in our solar system |
| **Protoplanetary disk** | Disk of gas and dust around a young star where planets form |

---

## Figure Checklist

| Figure ID | Description | Status |
|-----------|-------------|--------|
| `solar-system-architecture` | Zones of the solar system with distances | ☐ |
| `nebular-hypothesis` | Four-stage formation sequence | ☐ |
| `protoplanetary-disk` | ALMA image of disk around young star | ☐ |

---

## What's Next

**Wednesday (L12):** We zoom in on three planets — Venus, Earth, and Mars — to understand planetary climates. Why is Venus a hellscape? Why is Mars a frozen desert? What keeps Earth habitable? We'll also learn how to find planets around other stars.

**Friday (L13):** The biggest question in astronomy: Are we alone? We'll use the Drake Equation to estimate how many civilizations might exist — and discover why the early universe couldn't have had life at all.

---

*End of L11 Outline (v1)*
