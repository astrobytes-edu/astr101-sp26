# Week 6, Lecture 12: Planetary Climates & Finding Other Worlds

**Status:** DRAFT OUTLINE — v1
**Target length:** ~25-30 rendered pages
**Filename when complete:** `lecture-12-climates-exoplanets-reading.qmd`

**Note:** Wednesday lecture (Feb 25). Climate activity comparing Venus, Earth, Mars. Exoplanet detection methods.

---

## Instructor Approval Checklist

### Content — Planetary Climates

- [ ] **Venus/Earth/Mars comparison table** with T_equilibrium vs T_actual
- [ ] **Greenhouse effect explained** using L8 concepts (blackbody, radiative equilibrium)
- [ ] **Runaway greenhouse (Venus):** CO₂ feedback loop, why Venus is a hellscape
- [ ] **Mars:** Why thin atmosphere = cold desert
- [ ] **Earth:** Goldilocks — moderate greenhouse, liquid water
- [ ] **Climate change connection:** Your approach (Earth adding CO₂ → same physics as Venus, different degree)

### Content — Exoplanet Detection

- [ ] **Radial velocity recap** (from L10, reinforce with new example)
- [ ] **Transit method (NEW):** Geometry connection to L4 (eclipses, phases)
- [ ] Light curves: depth → size, duration → distance, period
- [ ] **Combined methods:** RV + transit → true mass + radius → density → rocky or gas?
- [ ] **Habitable zone concept:** Connects to Stefan-Boltzmann

### Pedagogy

- [ ] Greenhouse activity is hands-on conceptual
- [ ] Transit method explicitly connects to L4 geometry
- [ ] RV method reinforces L10
- [ ] Check Yourself questions test climate physics and detection logic
- [ ] Sets up L13 "Are We Alone?" question

### Formatting

- [ ] YAML front matter correct
- [ ] Climate comparison table clear
- [ ] Figure placeholders for transit geometry and light curve
- [ ] Greenhouse effect diagram placeholder

**Instructor notes/requested changes:**

```text
[Leave blank for Anna to fill in]


```

**Approval:** _______ (initials) **Date:** _______

---

## YAML Front Matter

```yaml
---
title: "Planetary Climates & Finding Other Worlds"
subtitle: "Lecture 12 Reading Companion"
author: "Dr. Anna Rosen"
date: "2026-02-25"
description: "Venus is a hellscape. Mars is a frozen desert. Earth is just right. Why? The greenhouse effect — the same physics that determines planetary habitability is reshaping Earth's climate today. Then we learn to find planets around other stars, building toward the biggest question: Are we alone?"
draft: false
categories: [climate, exoplanets, capstone]
course: ASTR 101
module: "1 - Foundations"
learning-objectives:
  - Explain why planetary surface temperatures differ from equilibrium temperatures
  - Describe the greenhouse effect and its role in planetary climate
  - Apply the transit method to detect exoplanets and determine their sizes
  - Combine radial velocity and transit methods to determine exoplanet densities
  - Define the habitable zone and explain what makes a planet potentially habitable
math-level: algebra_only
prerequisites: Lecture 8 (blackbody, Stefan-Boltzmann), Lecture 10 (Doppler), Lecture 11 (solar system)
---
```

---

## The Big Idea

> Three rocky planets orbit in our solar system's inner region: Venus, Earth, and Mars. All formed from the same material at similar distances. Yet Venus is a 735 K inferno, Mars is a frozen desert, and Earth hosts liquid water and life. The difference? **Atmospheres and the greenhouse effect.** Understanding this physics is crucial for two reasons: it determines which exoplanets might be habitable, and it explains why adding CO₂ to Earth's atmosphere is changing our climate.

---

## Opening Hook: Three Worlds, Three Fates

**Target length:** ~1.5 pages

**Key narrative beats:**

1. Venus, Earth, Mars — rocky siblings, formed from the same nebula
2. You'd expect similar conditions, but they're radically different
3. Venus: thick CO₂ atmosphere, 735 K surface, hellscape
4. Earth: moderate atmosphere, 288 K, liquid water, life
5. Mars: thin CO₂ atmosphere, 218 K, frozen desert
6. The key variable: the **greenhouse effect**
7. This lecture: Understanding climate + finding exoplanets

**Draft opening:**

> Venus, Earth, and Mars are siblings — rocky planets that formed from the same solar nebula about 4.6 billion years ago. You might expect similar conditions. Instead, we find three radically different worlds:
>
> **Venus:** Surface temperature 735 K (462°C) — hot enough to melt lead. Crushing atmospheric pressure 90× Earth's. Sulfuric acid clouds. No liquid water. A hellscape.
>
> **Earth:** Surface temperature 288 K (15°C). Moderate atmosphere. Liquid water oceans covering 70% of the surface. Life everywhere, from deep ocean vents to Antarctic ice.
>
> **Mars:** Surface temperature 218 K (-55°C). Atmospheric pressure less than 1% of Earth's. Frozen polar caps. Ancient river channels, but no liquid water today. A cold desert.
>
> What explains these vastly different outcomes? The answer involves physics we've already learned: **blackbody radiation, thermal equilibrium, and atmospheric absorption.** Today we'll see how the greenhouse effect creates these different climates — and why adding CO₂ to Earth's atmosphere is pushing our planet in Venus's direction.
>
> Then we'll turn to the search for other worlds. We've found thousands of exoplanets, some in "habitable zones" where liquid water could exist. How do we find them? And what determines if they're actually habitable?

---

## "How to Use This Reading" Callout

```
::: {.callout-important title="How to Use This Reading" collapse="true"}
This reading has two main parts:

**Part 1: Planetary Climates (~25 min)**
- Why planetary temperatures differ from simple predictions
- The greenhouse effect explained
- Venus vs. Earth vs. Mars: what went wrong/right
- Climate change connection

**Part 2: Exoplanet Detection (~20 min)**
- Transit method (geometry callback to L4!)
- Combining with radial velocity (L10)
- The habitable zone

**Exam connection:** This lecture reinforces L8 (blackbody/Stefan-Boltzmann)
and L10 (Doppler). Climate physics applies thermal equilibrium. Transit
detection applies geometry from L4.

**What's next:** L13 asks the big question: Are we alone? We'll use the
Drake Equation to estimate how many civilizations might exist.
:::
```

---

# PART 1: PLANETARY CLIMATES (~55% of reading)

## Section 1.1: Equilibrium Temperature — A First Guess

**Target length:** ~2.5 pages

### The Simple Prediction

> In L8, we learned that objects in thermal equilibrium absorb and emit energy at equal rates. For a planet absorbing sunlight:
>
> $$\text{Energy absorbed} = \text{Energy emitted}$$
>
> This gives an **equilibrium temperature** — what the planet's temperature *should* be if it's just balancing incoming sunlight against outgoing thermal radiation.

### The Calculation (Conceptual)

> The equilibrium temperature depends on:
> - **Distance from Sun:** Farther → less sunlight → cooler
> - **Albedo:** More reflective → absorbs less → cooler
>
> For a quick estimate (assuming moderate albedo):
> $$T_{eq} \approx 280\text{ K} \times \left(\frac{1\text{ AU}}{d}\right)^{1/2}$$

### The Predictions vs. Reality

| Planet | Distance (AU) | T_equilibrium (K) | T_actual (K) | Difference |
|--------|---------------|-------------------|--------------|------------|
| Venus | 0.72 | ~230 | **735** | +505 K ⚠️ |
| Earth | 1.00 | ~255 | 288 | +33 K |
| Mars | 1.52 | ~210 | 218 | +8 K |

> Something is very wrong with our prediction for Venus. It's **500 degrees hotter** than equilibrium! Earth is also warmer than expected, but by a modest 33 K. What's going on?

### Check Yourself 1:

```
::: {.callout-check-yourself title="Check Yourself 1 — Equilibrium Temperature"}
Based only on distance from the Sun, which planet should be warmest?

- A) Venus
- B) Earth
- C) Mars
- D) They should all be the same temperature
:::

::: {.callout-tip title="Solution" collapse="true"}
**A) Venus.** Closer to the Sun means more intense sunlight, so a higher
equilibrium temperature. But Venus's *actual* temperature is even higher
than this prediction — that's where the greenhouse effect comes in.
:::
```

---

## Section 1.2: The Greenhouse Effect

**Target length:** ~3.5 pages

### The Basic Mechanism

> The equilibrium calculation assumes the planet radiates directly to space. But if the planet has an **atmosphere containing greenhouse gases**, something different happens:
>
> 1. **Sunlight (visible)** passes through the atmosphere and heats the surface
> 2. **The surface emits infrared radiation** (thermal, from Wien's Law)
> 3. **Greenhouse gases absorb infrared** — they're opaque at these wavelengths
> 4. **The atmosphere re-radiates** — some back down to the surface
> 5. **The surface must get hotter** to radiate enough energy to escape to space

**Figure placeholder:**

```
{{< fig greenhouse-effect >}}

FIGURE: The Greenhouse Effect
DESCRIPTION: Diagram showing:
1. Incoming visible sunlight passing through atmosphere
2. Surface absorbing sunlight, heating up
3. Surface emitting infrared radiation
4. Greenhouse gas molecules (CO₂, H₂O, CH₄) absorbing IR
5. Some IR radiated back down to surface
6. Surface temperature rising to compensate
Label: "Greenhouse gases trap heat, raising surface temperature above
the simple equilibrium prediction."
ALT TEXT: Diagram of the greenhouse effect showing visible light entering,
infrared being absorbed by atmospheric gases, and some re-radiated downward.
```

### Key Greenhouse Gases

| Gas | Chemical Formula | Effect |
|-----|-----------------|--------|
| Water vapor | H₂O | Strong absorber; amplifies other effects |
| Carbon dioxide | CO₂ | Primary driver; very long-lived |
| Methane | CH₄ | Potent but shorter-lived |
| Nitrous oxide | N₂O | Long-lived, potent |

### L8 Connection: Why IR?

```
::: {.callout-note title="Connection to L8: Wien's Law"}
Why do greenhouse gases absorb *infrared* specifically?

From Wien's Law: $\lambda_{peak} = 2.9 \times 10^6 / T$ nm

- **Sun (5800 K):** Peak at ~500 nm (visible) → passes through atmosphere
- **Earth (288 K):** Peak at ~10,000 nm (infrared) → absorbed by greenhouse gases

The atmosphere is transparent to incoming visible light but opaque to
outgoing infrared. That's the essence of the greenhouse effect!
:::
```

---

## Section 1.3: Venus — Runaway Greenhouse

**Target length:** ~2.5 pages

### What Went Wrong on Venus?

> Venus likely started with conditions similar to Earth — perhaps even with liquid water oceans. But it was closer to the Sun, so it was warmer. Here's what happened:
>
> 1. **Higher temperature → more water evaporates**
> 2. **Water vapor is a greenhouse gas → temperature rises further**
> 3. **More evaporation → more water vapor → more warming** (positive feedback!)
> 4. **Eventually: oceans boil completely**
> 5. **UV light breaks apart water vapor → hydrogen escapes to space**
> 6. **CO₂ from volcanoes accumulates** (no oceans to dissolve it, no life to sequester it)
> 7. **Result: 96% CO₂ atmosphere, 735 K surface**

### The Runaway Greenhouse

> This is a **runaway greenhouse effect** — a positive feedback loop where warming causes more warming until a new, much hotter equilibrium is reached.
>
> Venus's atmosphere is now 96% CO₂ with 90× Earth's surface pressure. The greenhouse effect adds over 500 K to its temperature.

```
::: {.callout-warning title="The Sobering Lesson"}
Venus shows what happens when the greenhouse effect runs away.

The *same physics* applies to Earth. We're not in danger of becoming
Venus — our Sun is dimmer and we're farther away. But adding CO₂ to our
atmosphere shifts the balance. The physics is the same; only the degree
is different.
:::
```

### Check Yourself 2:

```
::: {.callout-check-yourself title="Check Yourself 2 — Venus"}
Venus is hotter than Mercury, even though Mercury is closer to the Sun.
Why?

- A) Venus has a stronger magnetic field
- B) Venus has a thick CO₂ atmosphere causing a strong greenhouse effect
- C) Venus rotates more slowly
- D) Venus has active volcanoes
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Venus has a thick CO₂ atmosphere causing a strong greenhouse effect.**
Mercury has essentially no atmosphere, so its temperature is close to
equilibrium (~430 K day side). Venus's massive CO₂ atmosphere traps heat,
raising the surface to 735 K — hotter than Mercury despite being farther
from the Sun.
:::
```

---

## Section 1.4: Mars — Too Little Atmosphere

**Target length:** ~1.5 pages

### Why Mars Is Cold

> Mars has the opposite problem: its atmosphere is too thin to trap much heat.
>
> - **Surface pressure:** 0.6% of Earth's
> - **Composition:** 95% CO₂, but so thin it barely matters
> - **Result:** Only ~8 K of greenhouse warming
>
> Mars also lost much of its early atmosphere. With weak gravity (38% of Earth's) and no global magnetic field, the solar wind stripped away atmospheric gases over billions of years.

### Evidence of Past Water

> Mars wasn't always this way. We see:
> - Ancient river channels and lake beds
> - Minerals that only form in liquid water
> - Polar ice caps (CO₂ and water ice)
>
> Early Mars may have had a thicker atmosphere and liquid water. Climate change — going the *opposite* direction from Venus — froze and dried the planet.

---

## Section 1.5: Earth — The Goldilocks Planet

**Target length:** ~2 pages

### Why Earth Works

> Earth sits in a sweet spot:
>
> 1. **Right distance:** Warm enough for liquid water, cool enough to avoid runaway greenhouse
> 2. **Right atmosphere:** Enough greenhouse effect (~33 K) to avoid freezing, not too much
> 3. **Carbon cycle:** CO₂ dissolves in oceans, gets locked in rocks, volcanoes release it — a natural thermostat
> 4. **Plate tectonics:** Recycles carbon, renews atmosphere
> 5. **Magnetic field:** Protects atmosphere from solar wind stripping

### The Climate Change Connection

> Here's where this matters for us today:
>
> Burning fossil fuels releases CO₂ that was locked in rocks for millions of years. We're adding ~40 billion tons of CO₂ per year to the atmosphere.
>
> The physics is exactly what we discussed:
> - More CO₂ → more infrared absorption → less heat escapes → surface warms
> - This is not speculation; it's the same physics that explains Venus
>
> Earth isn't becoming Venus — we're much too far from the Sun. But shifting Earth's temperature by even a few degrees has major consequences: sea level rise, extreme weather, ecosystem disruption.

```
::: {.callout-important title="The Physics Is the Physics"}
Climate science isn't about politics — it's about radiative transfer.

The greenhouse effect is the same physics that explains:
- Why Venus is hotter than Mercury
- Why Earth is 33 K warmer than its equilibrium temperature
- Why Mars is a frozen desert

Adding greenhouse gases changes the energy balance. That's Stefan-Boltzmann
and Kirchhoff's Laws at work. The only question is how much and how fast.
:::
```

### Check Yourself 3:

```
::: {.callout-check-yourself title="Check Yourself 3 — Earth's Climate"}
Earth's greenhouse effect raises the surface temperature about 33 K above
equilibrium. If CO₂ levels increase, what happens?

- A) Temperature decreases because CO₂ reflects sunlight
- B) Temperature stays the same because equilibrium is fixed
- C) Temperature increases because more infrared is absorbed
- D) Temperature increases only at night
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Temperature increases because more infrared is absorbed.** More CO₂
means the atmosphere absorbs more outgoing infrared radiation. To restore
energy balance, the surface must warm up to radiate more energy. This is
the basic physics of climate change.
:::
```

---

# PART 2: EXOPLANET DETECTION (~45% of reading)

## Section 2.1: Finding Other Worlds

**Target length:** ~1.5 pages

### The Challenge

> Planets are tiny compared to stars and don't produce their own visible light — they only reflect starlight. Trying to see an exoplanet directly is like trying to see a firefly next to a searchlight from miles away.
>
> Instead of looking for planets directly, we look for their **effects on their host stars**.

### Two Main Methods

> We'll focus on the two most successful techniques:
>
> 1. **Radial velocity (Doppler):** Planet's gravity makes star wobble; we see periodic Doppler shifts (L10 recap)
> 2. **Transit method:** Planet crosses in front of star; we see periodic brightness dips

---

## Section 2.2: Radial Velocity — Recap from L10

**Target length:** ~1.5 pages

### The Stellar Wobble

> From L10: A planet orbiting a star causes the star to wobble around the system's center of mass. This wobble creates a periodic Doppler shift in the star's spectral lines.
>
> - Star moves toward us → blueshift
> - Star moves away → redshift
> - Pattern repeats with planet's orbital period

### What We Learn

| Observable | What It Tells Us |
|-----------|------------------|
| Period of velocity variation | Orbital period (→ distance via Kepler III) |
| Amplitude of velocity variation | Minimum planet mass |
| Shape of velocity curve | Orbital eccentricity |

> **Limitation:** We measure only *minimum* mass. If the orbit is tilted relative to our line of sight, some of the motion is transverse and doesn't create Doppler shift. We see $M_{planet} \sin i$, where $i$ is the orbital inclination.

---

## Section 2.3: Transit Method — New Technique

**Target length:** ~3 pages

### The Basic Idea

> When a planet passes in front of its star (from our perspective), it blocks a tiny fraction of the starlight. This creates a **dip in brightness** that repeats each orbit.

**Figure placeholder:**

```
{{< fig transit-geometry >}}

FIGURE: Transit Geometry
DESCRIPTION: Side view showing:
1. Star with planet orbiting
2. Three positions: before transit, during transit, after transit
3. Observer's line of sight
4. Light curves below each position showing dip during transit
Label: "Transit happens when orbital plane aligns with our line of sight"
ALT TEXT: A planet crossing in front of its star from the observer's
perspective, with corresponding brightness dip.
```

### L4 Connection: Geometry Matters!

```
::: {.callout-note title="Connection to L4: Eclipses and Alignment"}
Remember from L4: Eclipses only happen when the Moon crosses the plane
of Earth's orbit (the ecliptic). Most months, the Moon passes above or
below the Sun and no eclipse occurs.

**The same geometry applies to exoplanet transits:**
- We only see a transit if the planet's orbit is **edge-on** to our line of sight
- Most exoplanets DON'T transit — their orbits are tilted relative to us
- Transit probability: roughly $R_{star}/a$ (larger star or closer planet → more likely)

This means transit surveys miss most planets, but the ones they find
are gold: we know exactly how the orbit is tilted (edge-on)!
:::
```

### The Transit Light Curve

**Figure placeholder:**

```
{{< fig transit-light-curve >}}

FIGURE: Transit Light Curve
DESCRIPTION: Graph showing:
- X-axis: Time
- Y-axis: Brightness (normalized to 1.0)
- Flat line at 1.0, then dip to ~0.99 during transit, then back to 1.0
- Label transit depth, ingress, egress, duration
- Annotations showing what each feature tells us
ALT TEXT: A light curve showing brightness dipping during a planetary
transit, with labeled features.
```

### What We Learn from Transits

| Observable | What It Tells Us |
|-----------|------------------|
| **Transit depth** | Planet radius: depth ≈ $(R_p/R_*)^2$ |
| **Transit duration** | Orbital distance (combined with period) |
| **Orbital period** | Time between transits |
| **Orbital inclination** | Must be nearly edge-on (~90°) to transit |

### Worked Example: How Big Is the Planet?

> **Problem:** A star's brightness drops by 1% during transit. If the star is Sun-sized ($R_* = R_☉$), how big is the planet?
>
> **Solution:**
>
> The transit depth is the fraction of starlight blocked:
> $$\text{depth} = \left(\frac{R_p}{R_*}\right)^2 = 0.01$$
>
> Solving for planet radius:
> $$\frac{R_p}{R_*} = \sqrt{0.01} = 0.1$$
> $$R_p = 0.1 \times R_☉ = 0.1 \times 696,000 \text{ km} = 69,600 \text{ km}$$
>
> This is almost exactly **Jupiter's radius** (71,500 km). A 1% dip indicates a Jupiter-sized planet!

### Check Yourself 4:

```
::: {.callout-check-yourself title="Check Yourself 4 — Transit Depth"}
An Earth-sized planet transiting a Sun-sized star would produce what
transit depth? (Earth's radius is ~1% of the Sun's radius)

- A) 1%
- B) 0.1%
- C) 0.01%
- D) 0.001%
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) 0.01%.** Transit depth = $(R_p/R_*)^2 = (0.01)^2 = 0.0001 = 0.01\%$.
Earth-sized planets are MUCH harder to detect than Jupiter-sized planets!
The Kepler and TESS missions had to achieve incredible photometric
precision to find them.
:::
```

---

## Section 2.4: Combining Methods — Density and Composition

**Target length:** ~2 pages

### The Power of Combining RV + Transit

> When a planet **both** transits **and** shows radial velocity variations, we hit the jackpot:
>
> | Method | What It Gives Us |
> |--------|------------------|
> | Transit | Planet radius ($R_p$) |
> | Radial velocity | Planet mass ($M_p$) — and since it transits, $\sin i \approx 1$, so we get TRUE mass |
>
> With both mass and radius:
> $$\text{Density} = \frac{M_p}{\frac{4}{3}\pi R_p^3}$$

### What Density Tells Us

| Density | Composition | Example |
|---------|-------------|---------|
| ~5.5 g/cm³ | Rocky (iron + silicate) | Earth |
| ~1.3 g/cm³ | Gas giant (H/He) | Jupiter |
| ~2-3 g/cm³ | Water world? Mini-Neptune? | Some super-Earths |

> Density distinguishes **rocky planets** (potential for habitability) from **gas/ice worlds** (probably not habitable at the surface).

---

## Section 2.5: The Habitable Zone

**Target length:** ~2 pages

### The Goldilocks Zone

> The **habitable zone** is the range of distances from a star where liquid water could exist on a planet's surface — not too hot (water boils), not too cold (water freezes).

**Figure placeholder:**

```
{{< fig habitable-zone >}}

FIGURE: The Habitable Zone
DESCRIPTION: Diagram showing:
- A star on the left
- Shaded green band showing habitable zone
- Too-close region labeled "Too Hot" (red)
- Too-far region labeled "Too Cold" (blue)
- Example planets placed in different zones
- Note: HZ location depends on stellar luminosity
ALT TEXT: The habitable zone as a green band around a star, with
"too hot" and "too cold" regions on either side.
```

### What Determines the Habitable Zone?

> The habitable zone depends on:
>
> 1. **Stellar luminosity:** More luminous star → HZ is farther out (Stefan-Boltzmann callback!)
> 2. **Atmospheric greenhouse effect:** Strong greenhouse → HZ extends farther out
> 3. **Planetary albedo:** More reflective → needs to be closer to absorb enough heat
>
> For the Sun:
> - Inner edge: ~0.95 AU (Venus is just inside — but runaway greenhouse happened)
> - Outer edge: ~1.4 AU (Mars is just outside — but had liquid water with thicker atmosphere)

### Habitable Zone ≠ Habitable

```
::: {.callout-warning title="Important Caveat"}
Being in the habitable zone doesn't guarantee a planet is habitable!

**Venus** is near the inner edge and is a 735 K hellscape.
**Mars** is near the outer edge and is a frozen desert.

Habitability depends on:
- Having an atmosphere (and keeping it)
- The right greenhouse effect
- Liquid water on the surface
- Perhaps: magnetic field, plate tectonics, and more

The habitable zone is a starting point, not a guarantee.
:::
```

### Check Yourself 5:

```
::: {.callout-check-yourself title="Check Yourself 5 — Habitable Zone"}
If a star is 4× as luminous as the Sun, how does its habitable zone compare?

- A) Same location as the Sun's
- B) Closer to the star
- C) Farther from the star
- D) There is no habitable zone
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Farther from the star.** A more luminous star delivers more energy,
so planets at Earth's distance would be too hot. The habitable zone moves
outward by a factor of $\sqrt{4} = 2$. If the Sun's HZ is at ~1 AU, this
star's HZ would be at ~2 AU.
:::
```

---

# CLOSING ELEMENTS

## Summary Box

```
::: {.callout-important title="Key Takeaways from Lecture 12"}
**Planetary Climates:**
1. Equilibrium temperature depends on distance from Sun and albedo
2. **Greenhouse effect:** Atmosphere absorbs IR → surface warms above equilibrium
3. **Venus:** Runaway greenhouse → 735 K hellscape
4. **Mars:** Too little atmosphere → 218 K frozen desert
5. **Earth:** Moderate greenhouse, liquid water, life — adding CO₂ shifts the balance

**Exoplanet Detection:**
6. **Radial velocity:** Star wobble → minimum planet mass
7. **Transit:** Brightness dip → planet radius (depth = $(R_p/R_*)^2$)
8. **Combined:** Mass + radius → density → rocky vs. gaseous
9. **Habitable zone:** Where liquid water *could* exist (depends on stellar luminosity)
:::
```

---

## Practice Problems

### Core (do these first)

1. **Greenhouse Calculation:** Earth's equilibrium temperature is ~255 K, but its actual surface temperature is ~288 K. Calculate the greenhouse warming effect in Kelvin. Compare to Venus (T_eq ≈ 230 K, T_actual = 735 K).

2. **Transit Depth:** A planet with radius 2× Earth's transits a Sun-like star. What is the transit depth? By what factor is this easier to detect than an Earth-sized planet?

3. **Habitable Zone Scaling:** A star has luminosity 1/4 that of the Sun. Where is its habitable zone compared to the Sun's? (Hint: Consider the Stefan-Boltzmann law and equilibrium temperature.)

4. **Detection Methods:** You detect a planet via both radial velocity (star wobbles at 100 m/s) and transit (1% depth). What two properties can you now calculate that you couldn't with just one method?

### Challenge

5. **Venus's History:** Explain in your own words how Venus went from possibly habitable to its current state. Include the role of distance from Sun, water vapor feedback, and CO₂ accumulation.

6. **Density Interpretation:** You discover a planet with the same mass as Neptune but the same radius as Earth. Calculate its density and compare to Earth (5.5 g/cm³) and Neptune (1.6 g/cm³). What might this planet be made of?

---

## Glossary

| Term | Definition |
|------|------------|
| **Equilibrium temperature** | Temperature a planet would have if it only balanced incoming sunlight and outgoing thermal radiation |
| **Greenhouse effect** | Warming of a planetary surface because the atmosphere absorbs and re-radiates infrared radiation |
| **Runaway greenhouse** | Positive feedback where warming causes more greenhouse gases, causing more warming |
| **Transit** | When a planet passes in front of its star, blocking some starlight |
| **Transit depth** | Fraction of starlight blocked during transit; equals $(R_p/R_*)^2$ |
| **Light curve** | Brightness vs. time plot showing transits and eclipses |
| **Habitable zone** | Region around a star where liquid water could exist on a planet's surface |

---

## Figure Checklist

| Figure ID | Description | Status |
|-----------|-------------|--------|
| `greenhouse-effect` | Diagram of greenhouse effect mechanism | ☐ |
| `transit-geometry` | Geometry of planetary transit | ☐ |
| `transit-light-curve` | Light curve with labeled features | ☐ |
| `habitable-zone` | Habitable zone around a star | ☐ |

---

## What's Next

**Friday (L13): Are We Alone?**

We've found thousands of exoplanets. Some are in habitable zones. So... is there life out there?

We'll use the **Drake Equation** to estimate how many civilizations might exist in our galaxy and the universe. Along the way, we'll discover why the early universe couldn't have had life at all — and preview the stellar physics of Module 2.

Then: review and Q&A for the Module 1 Exam (Monday).

---

*End of L12 Outline (v1)*
