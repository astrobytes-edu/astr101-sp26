<!--
Title: The Expanding Universe
Subtitle: Lecture 22 Reading Companion
Author: Dr. Anna Rosen
Date: 2026-04-29
Description: In 1929, Edwin Hubble discovered that the universe is not static — galaxies are receding from us, and the farther they are, the faster they move. This observation launched modern cosmology and led to the Big Bang theory. We'll explore Hubble's law, the cosmic distance ladder, and the shocking 1998 discovery that expansion is accelerating due to dark energy.
Categories: cosmology, galaxies, hubble, dark-energy, redshift
Course: ASTR 101
Module: 3 - Galaxies and Cosmology
Learning-Objectives:
  - Explain Hubble's discovery: galaxy redshifts increase proportionally with distance
  - State Hubble's law (v = H₀d) and use it to estimate distances from redshifts
  - Explain what "expanding space" means and distinguish it from galaxies flying apart
  - Describe how Type Ia supernovae revealed accelerating expansion
  - Define dark energy and state its approximate contribution to the universe's energy budget
Math-Level: algebra_only
Prerequisites: Lecture 9 (Doppler Shift); Lecture 17 (Type Ia Supernovae); Lecture 19 (Cepheids); Lecture 20 (Galaxy Distances)
Forward-Connections: Lecture 23 (The Big Bang); Lecture 24 (Cosmic Microwave Background)
-->

> **[The Big Idea]**
>
> The universe is not static — it's expanding, and the expansion is accelerating. This discovery reshaped our understanding of cosmic history and fate. Distant galaxies are not flying away through space; space itself is stretching. Dark energy, which comprises about 68% of the universe's energy budget, is driving this acceleration. The origin and nature of dark energy remain one of astronomy's greatest mysteries.

---

## Opening: The Universe Gets Bigger

On April 15, 1929, Edwin Hubble stood at the Mount Wilson Observatory in California and made one of the most profound discoveries in human history. It wasn't a new object he found. Instead, it was a relationship — a pattern hidden in the data that had been sitting in front of astronomers for years.

Hubble had been studying the spectra of galaxies (which many still called "nebulae" at the time). Other astronomers, particularly Vesto Slipher, had already noticed that most galaxies showed **redshifted** spectral lines — their light was shifted toward longer wavelengths. Using the Doppler effect (which you learned in Lecture 10), this meant these galaxies were moving away from us.

But Hubble went further. He combined Slipher's spectral data with distances he had carefully measured using Cepheid variables (Lecture 19). When he plotted recession velocity against distance, something remarkable appeared: **a straight line**. The farther away a galaxy was, the faster it was receding — and the relationship was perfectly linear.

This wasn't just another pattern in astronomy. It meant **the universe itself was expanding**.

Hubble's discovery overturned the assumption that had dominated Western thought since ancient times: that the universe was eternal, unchanging, and static. Instead, astronomers now faced a radical new picture. If the universe is expanding now, then tracing it backward in time, it must have been smaller in the past. And if we trace it far enough back — billions of years — the entire universe must have emerged from an infinitely dense, infinitely hot point.

This is the foundation of the **Big Bang theory**, which we'll explore in the next lecture. But first, let's understand Hubble's discovery itself.

<!-- FIGURE: Hubble 1929 velocity-distance plot -->

---

## Part 1: The Cosmic Distance Ladder

Before we can understand Hubble's law, we need to understand how Hubble knew the distances to galaxies. This brings us back to one of the most important ideas in astronomy: **the cosmic distance ladder**.

> *Margin:* **Cosmic distance ladder** — A series of methods, each calibrated by the previous one, for measuring distances across increasingly large scales (parallax → Cepheids → Type Ia SNe → Hubble's law → cosmological distances).

Recall that in Lectures 19 and 20, you learned how astronomers measure distances:

1. **Parallax** (Lecture 3): Measure the tiny shift in a star's position as Earth orbits the Sun. Works reliably up to ~100 pc.

2. **Cepheid Variables** (Lecture 19): These "standard candles" pulsate with periods proportional to their luminosity. By measuring the period and brightness, we find distance. This pushed the cosmic distance ladder out to ~30 million light-years.

3. **Type Ia Supernovae** (Lecture 17): Even brighter "standard candles," with consistent peak luminosity. These carry us to billions of light-years.

4. **Hubble's Law** (today): The relationship between velocity and distance — the ultimate rung of the ladder, extending to the edge of the observable universe.

Each rung depends on the previous one. Parallax calibrates Cepheids. Cepheids calibrate Type Ia SNe. Type Ia SNe calibrate Hubble's law. A systematic error at any rung propagates upward.

<!-- FIGURE: Cosmic distance ladder schematic -->

This is why the distance ladder is so important. When Hubble measured Cepheid variables in distant galaxies, he used the Cepheid period-luminosity relation calibrated with parallax distances. Every distance in his groundbreaking 1929 plot rested on this foundation.

---

## Part 2: Hubble's Law

### The Discovery

Hubble's data was simple but transformative. He had:

- **Recession velocities** from Slipher's spectroscopic redshifts (using the Doppler formula from Lecture 10)
- **Distances** from Cepheid variables measured with his 100-inch Hooker telescope at Mount Wilson

When he plotted the data, the relationship was unmistakable:

$$v = H_0 \cdot d$$

where:

- **v** = recession velocity (in km/s)
- **d** = distance (in megaparsecs, Mpc; 1 Mpc = 3.26 million light-years)
- **H₀** = Hubble constant (the slope of the line)

> *Margin:* **Hubble constant (H₀)** — The slope of Hubble's law, measured in km/s/Mpc. Current value: H₀ ≈ 70 km/s/Mpc. Determines the expansion rate of the universe.

> *Margin:* **Redshift (z)** — The fractional shift in wavelength: z = Δλ/λ₀. Related to recession velocity by the Doppler formula for v ≪ c: z ≈ v/c.

Hubble's constant is approximately **H₀ ≈ 70 km/s/Mpc**. This means:

- A galaxy 1 Mpc away recedes at ~70 km/s
- A galaxy 10 Mpc away recedes at ~700 km/s
- A galaxy 100 Mpc away recedes at ~7,000 km/s

The number seems arbitrary, but it's actually profound. It encodes the **expansion rate of space itself**.

<!-- FIGURE: Hubble's original 1929 plot (modern data) -->

### Worked Example: Using Hubble's Law to Find Distance

**Problem:** A distant galaxy shows a recession velocity of 5,000 km/s. Assuming H₀ = 70 km/s/Mpc, how far away is it?

**Solution:**

Rearrange Hubble's law to solve for distance:

$$d = \frac{v}{H_0} = \frac{5000 \text{ km/s}}{70 \text{ km/s/Mpc}} = 71 \text{ Mpc}$$

This galaxy is about 71 megaparsecs away — roughly 230 million light-years.

> **[Check Yourself 1 — Hubble's Law Application]**
>
> A galaxy shows a recession velocity of 14,000 km/s. Using H₀ = 70 km/s/Mpc, its distance is:
>
> A) 2 Mpc
> B) 20 Mpc
> C) 200 Mpc
> D) 2000 Mpc

<details><summary>Solution</summary>

**C) 200 Mpc.**

$$d = \frac{14,000}{70} = 200 \text{ Mpc}$$

</details>

---

## Part 3: What Is Expanding?

Here's where students often get confused. When we say "the universe is expanding," what exactly is expanding?

**Not this:** Galaxies flying apart through static space, like shrapnel from an explosion.

**This:** Space itself is stretching. The distances between distant galaxies increase because space is growing.

### The Raisin Bread Analogy

Imagine a loaf of raisin bread baking in an oven. As the dough rises, the raisins (galaxies) don't crawl through the dough. Instead, the dough (space) itself expands, pushing the raisins farther apart.

If you were a raisin:

- You'd observe all distant raisins moving away from you
- The farther away a raisin, the faster it would be receding (proportional to distance)
- **No raisin is at the "center" of expansion** — every raisin sees itself at the center, with all others moving away

This last point is crucial. **There is no special location in the universe.** Every observer, on every galaxy, sees the same picture: distant galaxies receding proportionally to distance.

<!-- FIGURE: Expanding raisin bread analogy, frame sequence -->

### What Doesn't Expand

This is equally important:

- **Locally bound systems do NOT expand.** The Milky Way and Andromeda are not expanding away from each other; they're actually approaching due to mutual gravity. In ~4 billion years, they'll merge.

- **Our solar system does not expand.** The Sun's gravity is strong enough to hold the planets in place.

- **Earth and Moon do not expand.**

Expansion only dominates at **cosmic scales** — between galaxy clusters separated by millions or billions of light-years. At smaller scales, gravity (which is a local force) overwhelms expansion.

> **[Misconception Alert]**
>
> "If the universe is expanding, doesn't that mean the atoms in my body are expanding?"
>
> No. Atoms are held together by electromagnetic force, which vastly overpowers cosmic expansion at that scale. Same with you, Earth, the solar system, and even the Milky Way. Expansion affects only the vast distances between clusters of galaxies.

---

## Part 4: Lookback Time and the Past Universe

Hubble's law opens a door to the past.

Light travels at a finite speed (~300,000 km/s). When we observe a distant galaxy, we're not seeing it *now*; we're seeing it *as it was when the light left*. The farther away the galaxy, the older the light and the more distant the past we're viewing.

If a galaxy is 1 billion light-years away, the light reaching us has traveled for 1 billion years. We see that galaxy as it was 1 billion years ago, when the universe was 1 billion years younger.

Using Hubble's law, we can estimate distances from redshifts (without needing Cepheids or Type Ia SNe at great distances). For each galaxy, this gives us:

- **Distance** from Hubble's law
- **Lookback time** from distance ÷ speed of light

We can thus observe the universe's history, looking backward in time as we look outward in space.

> **[OMI Connection: Estimating Cosmic Distances]**
>
> **Observable:** A galaxy's spectrum shows a redshift z = 0.1 (wavelengths shifted 10% longer).
>
> **Model:** Using the Doppler formula, z ≈ v/c, so the recession velocity is v ≈ 0.1c ≈ 30,000 km/s. Hubble's law then gives distance: d = v/H₀ ≈ 430 Mpc.
>
> **Inference:** The galaxy is ~430 megaparsecs away. The light we observe left that galaxy ~1.4 billion years ago. We're seeing it as it was in the Archean Eon on Earth.

---

## Part 5: The Past Universe Constraint

If the universe is expanding now, and we trace it backward:

- Earlier epochs → smaller universe
- Much earlier → hotter, denser universe
- Extrapolate to the limit → universe emerges from an incredibly hot, dense point (the **Big Bang**)

The age of this expansion can be estimated from the inverse of the Hubble constant. If the universe has been expanding at a constant rate since the Big Bang, then:

$$t_{age} \approx \frac{1}{H_0}$$

With H₀ ≈ 70 km/s/Mpc, this gives an age of roughly **14 billion years**. (In reality, the age is about 13.8 billion years, because we now know expansion wasn't constant — it accelerated!)

> **[Check Yourself 2 — Cosmic Age]**
>
> If H₀ = 70 km/s/Mpc and the universe has been expanding at a constant rate since the Big Bang, what's the approximate age of the universe?
>
> A) 7 billion years
> B) 14 billion years
> C) 140 billion years
> D) 1.4 trillion years

<details><summary>Solution</summary>

**B) 14 billion years.**

The age estimate is t = 1/H₀. Converting units (1 Mpc ≈ 3.086 × 10^19 km; 1 year ≈ 3.156 × 10^7 s):

$$t = \frac{1}{70 \text{ km/s/Mpc}} \approx 14 \text{ billion years}$$

(The exact value, accounting for acceleration, is about 13.8 billion years.)

</details>

<!-- FIGURE: Timeline of the expanding universe from Big Bang to present -->

---

## Part 6: The 1998 Revolution — Accelerating Expansion

For nearly 70 years after Hubble, astronomers assumed the expansion of the universe was **slowing down**. Gravity, they reasoned, should pull on all the matter in the universe and gradually reduce the expansion rate.

Then, in 1998, two independent teams of astronomers made a stunning discovery.

### Type Ia Supernovae as Standard Candles (Redux)

Recall from Lecture 17 that **Type Ia supernovae** are thermonuclear explosions of white dwarfs in binary systems. They have a characteristic peak luminosity, making them excellent standard candles for measuring distances.

The teams — one led by Saul Perlmutter (Lawrence Berkeley Lab) and one by Brian Schmidt and Adam Riess (Australian National University and Johns Hopkins) — used Type Ia SNe to map out the expansion history of the universe.

The procedure was simple in principle:

1. Observe Type Ia SNe at various redshifts
2. Measure their observed brightness
3. Use the peak luminosity to calculate what distance they *should* be at if the expansion rate were constant
4. Compare expected distance to actual distance (from redshift and Hubble's law)

### The Shocking Result

The distant Type Ia SNe were **dimmer than expected**. If the brightness fell off as expected for a given distance, these supernovae were farther away than they should be for their redshift.

There were two possible explanations:

1. The cosmic distance ladder was wrong (unlikely, given multiple cross-checks)
2. **The expansion of the universe is accelerating, not decelerating**

The data strongly favored option 2.

In the late universe (recent cosmic history), the expansion has been **speeding up**. This was completely unexpected.

> **[Deep Dive: Why Acceleration Requires Repulsion]**
>
> Newton's gravity is attractive — it always pulls. For the expansion to accelerate, there must be a **repulsive force** overwhelming gravity's pull.
>
> In Einstein's general relativity, this repulsive effect comes from the **equation of state** of the universe. Normal matter and dark matter have positive pressure. But something — dark energy — has **negative pressure**. This negative pressure acts like a repulsive force, counteracting gravity and accelerating expansion.
>
> The math: In the Friedmann equations (the dynamical equations for cosmic expansion), acceleration is proportional to (ρ + 3p), where ρ is density and p is pressure. For normal matter, p is small. But if dark energy has p < 0 (negative pressure), then (ρ + 3p) can be negative, driving acceleration.
>
> This was radical: we needed something with negative pressure to explain the data. But what?

<!-- FIGURE: Type Ia SN dimming due to acceleration -->

---

## Part 7: Dark Energy — The Universe's Dominant Constituent

The identity of the repulsive component remains unknown. Astronomers call it **dark energy**.

The evidence for dark energy comes primarily from:

1. **Type Ia supernovae distances** (1998+)
2. **Cosmic microwave background** (CMB) measurements (Lecture 24)
3. **Large-scale structure** of the universe
4. **Big Bang nucleosynthesis**

All independent lines of evidence converge on a consistent picture: dark energy comprises about **68%** of the universe's energy budget.

### The Cosmic Pie Chart

The current composition of the universe:

- **Dark Energy:** ~68% (repulsive, unknown nature)
- **Dark Matter:** ~27% (gravitational, unknown composition)
- **Normal Matter (atoms, stars, you):** ~5% (all of visible astronomy)

You are made of that 5%. Everything astronomers observed for thousands of years — stars, galaxies, nebulae — comprises just 5% of the universe. The remaining 95% is exotic matter and energy we don't yet understand.

> *Margin:* **Dark energy** — The hypothetical component of the universe causing accelerating expansion. Comprises ~68% of the total energy density. Its nature is unknown; current best guess is the "cosmological constant" (Λ), a uniform energy density of empty space itself.

> **[Misconception Alert]**
>
> "Dark energy and dark matter are the same thing."
>
> No. They're completely different:
>
> - **Dark matter:** Gravitationally attractive, clusters around galaxies, detectable indirectly through gravitational effects. Comprises ~27% of the universe.
>
> - **Dark energy:** Gravitationally repulsive (or rather, pressure that counteracts gravity), uniformly distributed, causes acceleration. Comprises ~68%.
>
> Both are mysterious, but they're not the same.

### What Could Dark Energy Be?

Leading candidates:

1. **Cosmological Constant (Λ):** A uniform energy density of empty space itself. Predicted by Einstein's equations (with a specific form), but the calculated value from quantum mechanics is ~10^120 times larger than observed. This is the "cosmological constant problem" — one of physics' deepest mysteries.

2. **Quintessence:** A dynamic scalar field permeating space, like the Higgs field. Would allow dark energy density to change over time.

3. **Modified Gravity:** Perhaps general relativity breaks down at cosmic scales, and we need a modified theory of gravity. This is less favored but not ruled out.

The 2011 Nobel Prize in Physics was awarded to Perlmutter, Schmidt, and Riess for discovering accelerating expansion and dark energy.

> **[Check Yourself 3 — Dark Energy vs. Dark Matter]**
>
> Which statement correctly distinguishes dark energy and dark matter?
>
> A) Dark matter causes expansion; dark energy clusters around galaxies
> B) Dark energy causes acceleration; dark matter produces gravity and clusters around galaxies
> C) They are the same thing, just different names
> D) Neither contributes significantly to the universe's energy budget

<details><summary>Solution</summary>

**B) Dark energy causes acceleration; dark matter produces gravity and clusters around galaxies.**

Dark matter is the 27% of the universe that clumps gravitationally and holds galaxies together. Dark energy is the 68% causing accelerating expansion.

</details>

---

## Part 8: The Hubble Tension

One of the most intriguing puzzles in modern cosmology is the **Hubble tension** — a disagreement in the measured value of H₀.

### Two Different Methods, Two Different Values

**Method 1: Local Universe Measurements**

Using Type Ia SNe and Cepheid variables in nearby galaxies, astronomers measure H₀ ≈ 73 km/s/Mpc (Riess et al., updated measurements).

**Method 2: Cosmic Microwave Background (CMB)**

The Planck satellite measured the **cosmic microwave background** — the leftover radiation from the Big Bang. From the CMB's properties, combined with other data, cosmologists infer H₀ ≈ 67 km/s/Mpc.

### The Tension

The two values differ by about 6 km/s/Mpc — roughly 9% discrepancy. While this might sound small, the error bars on both measurements are tight enough that the disagreement is statistically significant at about the **5-sigma level** (meaning there's a ~1-in-3-million chance the disagreement is just random noise).

This suggests either:

1. **Systematic errors** in one or both measurements (calibration issues in the distance ladder, contamination in the CMB analysis, etc.)
2. **New physics** beyond the standard cosmological model (modified gravity, exotic matter, additional relativistic particles)

It's an active area of research. Space telescopes like the James Webb Space Telescope are refining measurements of Cepheids in nearby galaxies to recalibrate the distance ladder with unprecedented precision.

> **[Check Yourself 4 — The Hubble Tension]**
>
> The Hubble tension refers to:
>
> A) The stress on Hubble's original telescope
> B) A disagreement between local and CMB-based measurements of H₀
> C) The force required to expand space
> D) The age of the universe

<details><summary>Solution</summary>

**B) A disagreement between local and CMB-based measurements of H₀.**

Local (Type Ia SNe + Cepheids) methods give H₀ ≈ 73 km/s/Mpc. CMB methods give H₀ ≈ 67 km/s/Mpc. This ~6% discrepancy is the "Hubble tension."

</details>

---

## Part 9: The Big Bang Picture

Let's tie this together. If we use Hubble's law to trace the universe backward in time:

**Today (13.8 billion years after the Big Bang):**
- Universe is large, cool, and expanding
- Dominated by dark energy (68%) and dark matter (27%)
- Normal matter (5%) has cooled enough to form galaxies, stars, and life
- Expansion is accelerating

**Recent past (a few billion years ago):**
- Universe was smaller and hotter
- Galaxies were closer together, colliding more frequently
- Expansion was still accelerating (for the past ~5 billion years)
- Before that, expansion was actually slowing

**Ancient past (first few billion years):**
- Universe was much denser and hotter
- Galaxies were forming from primordial gas
- Expansion was decelerating (gravity pulling)

**Very near the beginning (first second):**
- Unimaginably hot and dense
- Governed by quantum mechanics and general relativity together (not fully understood)

**The Big Bang itself (t = 0):**
- Universe emerges from an infinitely hot, infinitely dense point
- Time itself begins here (the question "what came before?" doesn't make physical sense)

This is the foundation of modern cosmology. It will be the subject of Lecture 23.

---

## Summary

> **[Key Takeaways from Lecture 22]**
>
> 1. **Hubble's Law:** v = H₀d. Distant galaxies recede at velocities proportional to distance. H₀ ≈ 70 km/s/Mpc.
>
> 2. **The Cosmic Distance Ladder:** Parallax → Cepheids → Type Ia SNe → Hubble's law. Each rung calibrates the next.
>
> 3. **Expanding Space, Not Flying Apart:** Galaxies aren't moving through static space. Space itself stretches, carrying galaxies farther apart. Locally bound systems (solar systems, galaxies, galaxy groups) don't expand.
>
> 4. **Lookback Time:** Distant = old. A galaxy 1 billion light-years away is seen as it was 1 billion years ago.
>
> 5. **Age of the Universe:** The inverse of H₀ gives a rough cosmic age: t ≈ 1/H₀ ≈ 14 billion years.
>
> 6. **Accelerating Expansion (1998):** Type Ia supernovae at high redshift are dimmer than expected. The universe's expansion is speeding up, not slowing down.
>
> 7. **Dark Energy:** The unknown cause of acceleration. Comprises ~68% of the universe's energy density. Its nature remains a profound mystery.
>
> 8. **The Hubble Tension:** Local measurements (H₀ ≈ 73) and CMB measurements (H₀ ≈ 67) disagree at ~5-sigma significance. Active area of research.
>
> 9. **The Universe's Composition:** ~68% dark energy, ~27% dark matter, ~5% normal matter. You are made of that 5%.

---

## Self-Assessment Checklist

By the end of this lecture, you should be able to:

- [ ] Explain why Hubble's discovery was revolutionary (the universe is not static)
- [ ] State Hubble's law and define each term (v, H₀, d)
- [ ] Calculate distance from recession velocity using Hubble's law
- [ ] Calculate recession velocity from distance using Hubble's law
- [ ] Explain what "expanding space" means using the raisin bread analogy
- [ ] Distinguish between local (non-expanding) and cosmic (expanding) scales
- [ ] Estimate lookback time from distance
- [ ] Explain how Type Ia SNe revealed accelerating expansion
- [ ] Define dark energy and state its approximate contribution to the universe's energy budget
- [ ] Distinguish between dark energy and dark matter
- [ ] Summarize the Hubble tension and why it matters
- [ ] Explain how Hubble's law connects to the Big Bang picture

---

## Practice Problems

### Core Problems (Master These)

**C1.** A galaxy shows a recession velocity of 3,000 km/s. Using H₀ = 70 km/s/Mpc, what is its distance?

**C2.** A galaxy is 200 Mpc away. What is its approximate lookback time (in billions of years)?

**C3.** If the universe's age is approximately 1/H₀, and H₀ = 70 km/s/Mpc, what is the rough age? (Hint: 1 Mpc ≈ 3.26 million light-years. 1 light-year ≈ 9.46 × 10^12 km. 1 year ≈ 3.156 × 10^7 s.)

**C4.** Explain in 2–3 sentences why the discovery that expansion is accelerating was surprising to astronomers in 1998.

**C5.** If dark energy comprises 68% of the universe's energy density, what percentage is dark matter plus normal matter?

### Challenge Problems

**Ch1.** The current Hubble tension: local measurements give H₀ ≈ 73 km/s/Mpc, while CMB measurements give H₀ ≈ 67 km/s/Mpc. If these measurements are correct, what is the fractional discrepancy (in %)? What would this imply for the universe's age, using the t = 1/H₀ formula?

**Ch2.** In the future, if the Hubble tension is resolved and astronomers confirm H₀ = 70 km/s/Mpc, use the raisin bread analogy to explain why it's incorrect to say "the Big Bang happened at a single location in the universe."

**Ch3.** Suppose a distant Type Ia supernova at redshift z = 0.5 has an observed brightness half of what Hubble's law would predict for a non-accelerating universe. Explain (in 3–4 sentences) what this tells us about the universe's expansion history.

---

## Glossary

| Term | Definition |
|------|------------|
| **Blueshift** | Shift of spectral lines toward shorter wavelengths, indicating motion toward the observer |
| **Cosmic distance ladder** | Series of methods for measuring distances across increasingly large scales |
| **Cosmological constant (Λ)** | Hypothetical uniform energy density of empty space; current leading candidate for dark energy |
| **Dark energy** | Unknown component comprising ~68% of the universe's energy, causing accelerating expansion |
| **Dark matter** | Unknown matter comprising ~27% of the universe; gravitationally attractive, clusters around galaxies |
| **Hubble constant (H₀)** | Slope of Hubble's law; measures expansion rate; current value ~70 km/s/Mpc |
| **Hubble's law** | v = H₀d; recession velocity is proportional to distance |
| **Hubble tension** | ~9% disagreement between local (H₀ ≈ 73) and CMB-based (H₀ ≈ 67) measurements of H₀ |
| **Lookback time** | Age of the universe when light from a distant object was emitted; distance ÷ speed of light |
| **Recession velocity** | Speed at which a galaxy is moving away from us (along the line of sight) |
| **Redshift** | Shift of spectral lines toward longer wavelengths, indicating motion away from observer |
| **Standard candle** | Object of known luminosity used to measure distance via its observed brightness |
| **Type Ia supernova** | Thermonuclear explosion of a white dwarf in a binary system; excellent standard candle |

---

## Forward Connections

**Lecture 23 (The Big Bang):** Hubble's discovery that the universe is expanding led directly to the Big Bang theory. If the universe is expanding now, it must have been smaller in the past. We'll explore the cosmic history implied by Hubble's law and the evidence for the Big Bang itself.

**Lecture 24 (Cosmic Microwave Background):** The CMB is the leftover radiation from the Big Bang, released when the universe cooled enough for atoms to form. The CMB's properties provide an independent measurement of H₀ (the Hubble tension!) and confirm the Big Bang picture.

---

## Recommended Reading

- **OpenStax Astronomy (Ch. 26.5):** "The Universe Has Changed; the Hubble Time"
- **OpenStax Astronomy (Ch. 29.4):** "The Accelerating Expansion of the Universe"
- **Further Exploration:** Adam Riess's Nobel Lecture (2011) on accelerating expansion: [nobelprize.org](https://www.nobelprize.org/prizes/physics/2011/riess/lecture/)
