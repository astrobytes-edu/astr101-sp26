# Week 5, Lecture 10: Motion Revealed — Doppler Effect and the Astronomer's Toolkit

**Status:** DRAFT OUTLINE — v1
**Target length:** ~25-30 rendered pages
**Filename when complete:** `lecture-10-doppler-telescopes-reading.qmd`

**Note:** Friday lecture (Feb 21). Follows L9 on spectral lines. Activity/review time available.

---

## Instructor Approval Checklist

### Content — Doppler Effect

- [ ] **Opening callback to L9:** "Spectral lines are fingerprints — now what happens when they shift?"
- [ ] **Gravity connection**: "Gravity makes everything move" callback to L5-L6
- [ ] $\Delta\lambda/\lambda_0 = v/c$ explained with all terms defined
- [ ] **Deep dive on rest/lab wavelength**: what is the reference point?
- [ ] **Radial vs. transverse motion** clarified with figure
- [ ] **Blueshift/redshift misconception box**: applies to ALL wavelengths, not just visible
- [ ] **Doppler vs cosmological redshift** misconception box
- [ ] **Exoplanet radial velocity**: both conceptual AND quantitative worked example
- [ ] **Dark matter spoiler**: galaxy rotation curves, Vera Rubin

### Content — Telescopes

- [ ] Light-gathering power (∝ D²) explained
- [ ] Resolution (1.22λ/D Rayleigh criterion) explained with worked example
- [ ] Refractors vs. reflectors (brief)
- [ ] Atmospheric windows callback to L7 — why space telescopes
- [ ] Modern observatories: ground (Keck, VLT, ELT) and space (Hubble, JWST, Chandra)
- [ ] Multi-wavelength astronomy payoff

### Pedagogy

- [ ] "Light is Information" throughline culminates here
- [ ] Course throughline: "Motion reveals mass" (L5-L6) → "Light reveals everything else" (L7-L10)
- [ ] Check Yourself questions test the right concepts
- [ ] Practice problems marked Core vs Challenge
- [ ] Math level is algebra-only
- [ ] Tone matches L1-L9 (conversational but rigorous)

### Formatting

- [ ] YAML front matter correct
- [ ] Math formatting clean
- [ ] Figure placeholders well-described
- [ ] Demo connection (Telescope Resolution)

**Instructor notes/requested changes:**

```text
[Leave blank for Anna to fill in]


```

**Approval:** _______ (initials) **Date:** _______

---

## YAML Front Matter

```yaml
---
title: "Motion Revealed — Doppler Effect and the Astronomer's Toolkit"
subtitle: "Lecture 10 Reading Companion"
author: "Dr. Anna Rosen"
date: "2026-02-21"
description: "Spectral lines shift when objects move. The Doppler effect reveals velocities — from exoplanets to dark matter. Telescopes collect this light so we can decode it. This completes the astronomer's toolkit for Module 2."
draft: false
categories: [foundations, doppler, telescopes]
course: ASTR 101
module: "1 - Foundations"
learning-objectives:
  - Apply the Doppler formula to calculate radial velocities from wavelength shifts
  - Distinguish radial (line-of-sight) motion from transverse motion
  - Explain how the Doppler effect reveals exoplanets and dark matter
  - Compare light-gathering power and resolution for telescopes of different sizes
  - Explain why astronomers observe at different wavelengths and from space
math-level: algebra_only
prerequisites: Lecture 9 (Spectral Lines); understanding of spectral fingerprints
---
```

---

## The Big Idea

> In L9, we learned that spectral lines are chemical fingerprints — each element absorbs and emits at specific wavelengths. But what happens when those fingerprints **shift**? A shifted spectral line means the source is moving. The **Doppler effect** lets us measure velocities across cosmic distances — revealing orbiting exoplanets, spinning galaxies, and the invisible dark matter that holds them together. And **telescopes** are the eyes that collect this light, letting us decode the cosmos.

---

## Opening Hook: The Fingerprints Move

**Target length:** ~1.5 pages

**Key narrative beats:**

1. Callback to L9: spectral lines are chemical fingerprints
2. But astronomers noticed something strange: the fingerprints weren't always in the expected positions
3. Sometimes shifted toward red, sometimes toward blue
4. The pattern was velocity — this is the Doppler effect
5. This lecture: How we use shifting lines to reveal motion, and the telescopes that collect the light

**Draft opening:**

> In L9, we learned to read chemical fingerprints in starlight. Hydrogen always absorbs at 656.28 nm (Hα), sodium at 589.0 nm — these patterns are as reliable as barcodes.
>
> But astronomers noticed something strange. When they observed distant stars and galaxies, the fingerprints weren't always at the expected wavelengths. Sometimes the hydrogen line appeared at 656.50 nm. Sometimes at 656.10 nm. The pattern was shifted.
>
> The culprit? **Motion**. Just as an ambulance siren sounds higher-pitched when approaching and lower when receding, light waves get compressed or stretched depending on whether the source moves toward or away from us. This is the **Doppler effect** — and it's one of astronomy's most powerful tools.
>
> Today we'll learn how to extract velocities from wavelength shifts. We'll discover exoplanets through stellar wobbles, and we'll uncover evidence for invisible dark matter in galaxy rotation curves. And we'll explore the telescopes — the astronomer's eyes — that collect the light carrying all this information.
>
> By the end of this lecture, you'll have the complete toolkit for Module 2: temperature (L8), composition (L9), and now motion (L10) — all from analyzing light.

---

## "How to Use This Reading" Callout

```
::: {.callout-important title="How to Use This Reading" collapse="true"}
This reading covers the Doppler effect and telescopes — completing the
astronomer's toolkit.

**Structure:**
- **Part 1:** The Doppler effect — motion from wavelength shifts
- **Part 2:** Telescopes — collecting the light

**Reading time:** ~30-40 min (including Check Yourself questions)

**Prerequisites:** Make sure you've completed L9 (spectral lines). You'll
need to understand what spectral lines are and why each element has a
unique pattern.

**This lecture completes Module 1.** You now have all the tools:
- Motion reveals mass (L5-L6)
- Light reveals temperature (L7-L8)
- Spectral lines reveal composition (L9)
- Doppler reveals motion; telescopes collect the light (L10)

In Module 2, we apply these tools to **stars**.
:::
```

---

# PART 1: THE DOPPLER EFFECT — MOTION FROM WAVELENGTH SHIFTS (~60% of reading)

## Section 1.1: Gravity Makes Everything Move

**Target length:** ~2 pages

### The Connection to L5-L6

> In Lectures 5 and 6, we learned that **gravity is a long-range force** — it reaches across the cosmos, pulling on everything with mass. This means everything in the universe is in motion:
>
> - Planets orbit stars
> - Stars orbit galaxy centers
> - Galaxies fall toward each other in clusters
> - Even "stationary" stars are moving at tens of km/s through space
>
> All this motion leaves a signature in light: **the Doppler effect**. By measuring wavelength shifts, we measure velocity — and from velocity, we can infer mass, detect invisible companions, and reveal the hidden structure of the universe.

---

## Section 1.2: The Doppler Effect

**Target length:** ~3 pages

### The Familiar Version (Sound)

> You've heard the Doppler effect: an ambulance siren sounds higher-pitched as it approaches and lower-pitched as it recedes. The sound waves get compressed (shorter wavelength, higher frequency) when approaching, and stretched (longer wavelength, lower frequency) when receding.

### For Light: Wavelength Shifts

> Light behaves the same way:
>
> - Source moving **toward** you → wavelengths **compressed** → shifted toward **shorter** wavelengths
> - Source moving **away** from you → wavelengths **stretched** → shifted toward **longer** wavelengths

```
::: {.callout-important title="The Doppler Formula (for $v \ll c$)"}
$$\frac{\Delta\lambda}{\lambda_0} = \frac{v}{c}$$

where:
- $\lambda_0$ = the **rest wavelength** (measured in the lab, with no relative motion)
- $\Delta\lambda = \lambda_{observed} - \lambda_0$ = the **wavelength shift**
- $v$ = the object's **radial velocity** (along the line of sight)
- $c = 3 \times 10^5$ km/s (speed of light)

**Positive $\Delta\lambda$** (wavelength increased) → **redshift** → moving **away**
**Negative $\Delta\lambda$** (wavelength decreased) → **blueshift** → moving **toward**
:::
```

### What Do These Symbols Mean?

**Margin definitions:**

- **$\lambda_0$ (rest wavelength):** The wavelength of a spectral line measured in the laboratory, with source and observer at rest relative to each other. Also called "laboratory wavelength."
- **$\lambda_{observed}$:** The wavelength you actually measure when observing a moving source.
- **$\Delta\lambda$ (delta lambda):** The difference between observed and rest wavelength: $\Delta\lambda = \lambda_{observed} - \lambda_0$. Positive means the wavelength increased (redshift); negative means it decreased (blueshift).
- **Radial velocity:** The component of velocity along the line of sight (toward or away from the observer).

---

## Section 1.3: Deep Dive — What Is "Rest Wavelength"?

**Target length:** ~1.5 pages

```
::: {.callout-note title="Deep Dive: Rest Wavelength — The Reference Point" collapse="false"}
Students often ask: "Rest wavelength relative to what?"

**The answer:** The rest wavelength ($\lambda_0$) is the wavelength a
spectral line has when the source and observer are **not moving relative
to each other**.

**In practice:** We measure rest wavelengths in the **laboratory**. We
take a tube of hydrogen gas, excite it with electricity, and precisely
measure the wavelengths of the emission lines. These laboratory values
become our reference:

- Hydrogen-alpha (Hα): $\lambda_0 = 656.28$ nm
- Hydrogen-beta (Hβ): $\lambda_0 = 486.13$ nm
- Sodium D lines: $\lambda_0 = 589.0$ nm and 589.6 nm

When we observe a star and see Hα at 656.50 nm instead of 656.28 nm,
we know the line has been **redshifted** by $\Delta\lambda = +0.22$ nm.
That shift tells us the star is moving away from us.

**Key point:** The rest wavelength is our reference standard. Without
knowing $\lambda_0$ precisely, we couldn't detect or measure the shift.

**One more wrinkle:** Earth itself moves! Over a year, our orbital motion
shifts spectral lines by up to ±30 km/s. Astronomers correct for this by
converting to a "barycentric" (solar system center-of-mass) reference frame.
:::
```

---

## Section 1.4: Radial vs. Transverse Motion

**Target length:** ~2 pages

### Only Line-of-Sight Motion Creates Doppler Shifts

**Figure placeholder:**

```
{{< fig radial-vs-transverse >}}

FIGURE: Radial vs. Transverse Motion
DESCRIPTION: Show a star with its velocity decomposed into two components:
- Radial velocity (v_r): Arrow pointing toward/away from observer (along line of sight)
- Transverse velocity (v_t): Arrow perpendicular to line of sight (across the sky)
- Observer at bottom with line of sight marked
- Caption: "Doppler effect measures ONLY the radial component"
ALT TEXT: A star's motion decomposed into radial (toward/away from observer)
and transverse (across the sky) components.
```

### The Key Distinction

> The Doppler effect measures only the **radial velocity** — the component of motion along your **line of sight**:
>
> - **Radial motion:** Toward or away from you → Doppler shift detected
> - **Transverse motion:** Across your field of view → **No Doppler shift**
>
> A star moving purely sideways shows **zero Doppler shift**, even if it's moving very fast!

**Margin definitions:**

- **Radial velocity:** The component of an object's velocity along the line of sight — toward or away from the observer. This is what the Doppler effect measures.
- **Transverse velocity:** The component of velocity perpendicular to the line of sight — motion across the sky. Detected through proper motion (position change over years), not Doppler.
- **Line of sight:** The imaginary line from the observer to the object being observed.

### Check Yourself 1:

```
::: {.callout-check-yourself title="Check Yourself 1 — What Doppler Measures"}
A star is moving at 100 km/s exactly perpendicular to your line of sight
(directly across the sky). Its Doppler shift is:

- A) Large redshift
- B) Large blueshift
- C) Zero
- D) Cannot be determined
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Zero.** The Doppler effect only measures radial velocity (along the
line of sight). Motion purely across the sky (transverse) produces no
wavelength shift. To detect transverse motion, you'd need to measure
the star's position change over time (proper motion).
:::
```

---

## Section 1.5: Blueshift and Redshift — A Naming Clarification

**Target length:** ~1.5 pages

```
::: {.callout-warning title="Don't Mislearn This: Blueshift/Redshift Apply to ALL Wavelengths"}
The names "blueshift" and "redshift" come from visible light:
- **Blue** is at the short-wavelength end of the visible spectrum
- **Red** is at the long-wavelength end

But **the Doppler effect applies to ALL electromagnetic radiation** —
radio waves, infrared, X-rays, gamma rays, everything!

When astronomers say a radio source is "redshifted," they don't mean
it turned red. They mean its wavelengths are **shifted toward longer
values** — shifted in the "red direction" even if the light isn't visible.

**The naming convention:**
- **Blueshift** = shifted to **shorter** wavelengths (any part of spectrum)
- **Redshift** = shifted to **longer** wavelengths (any part of spectrum)

An X-ray that gets "redshifted" is still an X-ray — just at a longer
wavelength than its rest value.
:::
```

```
::: {.callout-warning title="Don't Mislearn This: Doppler Redshift vs. Cosmological Redshift"}
The Doppler effect explains redshifts from **motion through space** —
a galaxy moving away from us has its light redshifted.

But in Module 3, you'll learn about **cosmological redshift**, which
is caused by the **expansion of space itself**. Distant galaxies are
redshifted not because they're flying away through space, but because
space between us and them has stretched while the light was traveling.

**For now:** Focus on Doppler redshift (motion through space). We'll
tackle cosmological redshift when we study the expanding universe.

**Key difference:**
- **Doppler:** Object moving through space → wavelength shifted
- **Cosmological:** Space itself expanding → wavelength stretched

Both produce redshifts, but the physics is different!
:::
```

---

## Section 1.6: Worked Example — Measuring Stellar Velocity

**Target length:** ~1.5 pages

> **Problem:** A star's Hα absorption line is observed at 656.50 nm. The laboratory (rest) wavelength of Hα is 656.28 nm. Find the star's radial velocity. Is it approaching or receding?
>
> **Solution:**
>
> Step 1: Calculate the wavelength shift
> $$\Delta\lambda = \lambda_{observed} - \lambda_0 = 656.50 - 656.28 = +0.22 \text{ nm}$$
>
> Step 2: Calculate the fractional shift
> $$\frac{\Delta\lambda}{\lambda_0} = \frac{0.22}{656.28} = 3.35 \times 10^{-4}$$
>
> Step 3: Apply the Doppler formula
> $$v = c \times \frac{\Delta\lambda}{\lambda_0} = (3 \times 10^5 \text{ km/s}) \times (3.35 \times 10^{-4}) = 100 \text{ km/s}$$
>
> Step 4: Interpret the sign
> $\Delta\lambda > 0$ means the wavelength increased (redshift), so the star is **moving away** from us at about **100 km/s**.

---

## Section 1.7: Exoplanet Detection — The Radial Velocity Method

**Target length:** ~3 pages

### The Conceptual Idea

> By Newton's Third Law, a planet doesn't just orbit its star — the star also wobbles in response. The planet pulls on the star just as the star pulls on the planet.
>
> This stellar wobble is tiny — the Sun moves only about 12 m/s due to Jupiter's pull — but it's detectable with precise Doppler measurements. As the star wobbles toward and away from us, its spectral lines shift back and forth. The periodic pattern reveals an orbiting planet.

**Figure placeholder:**

```
{{< fig radial-velocity-method >}}

FIGURE: The Radial Velocity Method for Exoplanet Detection
DESCRIPTION: Show a star-planet system from above, and from the observer's
side view:
- Star wobbling in a small circle/ellipse around the center of mass
- Planet in larger orbit
- Arrows showing when star moves toward observer (blueshift) and away (redshift)
- Sinusoidal velocity curve showing the periodic Doppler shift
ALT TEXT: A star wobbles due to an orbiting planet; the wobble creates
periodic Doppler shifts that reveal the planet's presence.
```

### Quantitative Example: Detecting a Hot Jupiter

> **Problem:** A star's spectral lines shift back and forth with an amplitude of $\Delta\lambda = \pm 1.2 \times 10^{-4}$ nm around the Hα rest wavelength of 656.28 nm. The shift completes one cycle every 4.2 days. What is the star's wobble velocity? What does this tell us?
>
> **Solution:**
>
> Step 1: Calculate the velocity amplitude
> $$\frac{\Delta\lambda}{\lambda_0} = \frac{1.2 \times 10^{-4}}{656.28} = 1.8 \times 10^{-7}$$
> $$v = c \times \frac{\Delta\lambda}{\lambda_0} = (3 \times 10^5 \text{ km/s}) \times (1.8 \times 10^{-7}) = 0.056 \text{ km/s} = 56 \text{ m/s}$$
>
> Step 2: Interpret
> The star wobbles at ±56 m/s with a 4.2-day period. This is larger than the Sun's ~12 m/s wobble from Jupiter (which has a 12-year period), but still tiny — about the speed of a fast jog!
>
> A short period (4.2 days) means the planet orbits very close to the star. Combined with the velocity amplitude, we can estimate the planet is about half a Jupiter mass.
>
> This is the signature of a **"hot Jupiter"** — a massive planet in a tight orbit. The first exoplanet around a Sun-like star, 51 Pegasi b, was discovered exactly this way in 1995 (with v ≈ 56 m/s and P = 4.2 days)!

```
::: {.callout-tip title="The More You Know: Spectral Precision" collapse="true"}
Detecting a 56 m/s wobble seems impossible — but astronomers don't measure
one line at that precision. Instead, they track the **centroids of many
spectral lines simultaneously**, gaining statistical power. Modern
spectrographs like HARPS are kept in vacuum, stabilized to hundredths of
a degree, and calibrated with thorium-argon lamps or laser frequency combs.

The result: velocity precision far better than the width of a single
spectral resolution element. The 2019 Nobel Prize in Physics recognized
Mayor & Queloz for their discovery of 51 Pegasi b using this approach.
:::
```

### The Information Payoff

> From Doppler measurements alone, we can determine:
>
> - **Orbital period** → from the periodicity of the velocity curve
> - **Minimum planet mass** → from the velocity amplitude (minimum because we may not see the orbit edge-on)
> - **Orbital eccentricity** → from the shape of the velocity curve
>
> Combined with transit observations (when a planet crosses in front of its star), we can get the planet's true mass and size.

### Check Yourself 2:

```
::: {.callout-check-yourself title="Check Yourself 2 — Exoplanet Detection"}
The radial velocity method detects exoplanets by measuring:

- A) The planet's light directly
- B) The star's periodic Doppler shift due to its wobble
- C) The planet blocking starlight during transit
- D) Gravitational lensing by the planet
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) The star's periodic Doppler shift due to its wobble.** The planet's
gravity causes the star to move in a small orbit around the center of
mass. This motion creates periodic Doppler shifts that we can measure.
:::
```

---

## Section 1.8: Dark Matter — When Orbits Don't Add Up

**Target length:** ~3 pages

### The Galaxy Rotation Puzzle

> In the 1970s, astronomer Vera Rubin used the Doppler effect to measure how fast stars orbit within spiral galaxies. She expected to find that stars far from the galaxy center orbit more slowly — just as outer planets in our solar system orbit more slowly than inner ones (Kepler's Third Law).
>
> What she found was shocking: **stars at the edges of galaxies move just as fast as stars near the center**.

**Figure placeholder:**

```
{{< fig galaxy-rotation-curve >}}

FIGURE: Galaxy Rotation Curves — Evidence for Dark Matter
DESCRIPTION: Plot of orbital velocity vs. distance from galaxy center:
- "Expected" (Keplerian) curve: velocity decreases as ~1/√r at large r
- "Observed" curve: velocity stays roughly flat (constant) at large r
- Shaded region between curves labeled "requires unseen mass"
- Caption: "Stars at galaxy edges orbit too fast. Something invisible
  is providing extra gravitational pull."
ALT TEXT: Galaxy rotation curve comparing expected (decreasing) and
observed (flat) velocities, showing evidence for dark matter.
```

### Why This Is Strange

> By Newton's gravity and Kepler's Laws, the orbital velocity should depend on the mass inside the orbit:
>
> $$v_{orbit} = \sqrt{\frac{GM_{interior}}{r}}$$
>
> If most of a galaxy's mass is concentrated in the bright central bulge, then at large distances, $M_{interior}$ should be roughly constant, and $v_{orbit}$ should decrease as $1/\sqrt{r}$.
>
> But the velocity stays **flat**. This means $M_{interior}$ must **keep increasing** with distance — there's more mass out there than we can see!

### The Dark Matter Hypothesis

> The leading explanation: there's far more matter in galaxies than the visible stars, gas, and dust. This unseen matter doesn't emit or absorb light (hence "dark"), but it has gravity.
>
> We call it **dark matter**. It forms a huge, invisible **halo** surrounding galaxies, providing the extra gravitational pull that keeps outer stars orbiting so fast.

**Margin definition:**

- **Dark matter:** Invisible matter that doesn't emit, absorb, or reflect light, but has gravitational effects. Makes up ~27% of the universe's mass-energy.

### The Throughline: Motion Reveals Mass (Even Invisible Mass)

> This is the ultimate payoff of L5-L6: **motion reveals mass**. Vera Rubin watched how stars move and discovered that most of a galaxy's mass is invisible.
>
> We've never directly detected a dark matter particle. But we know it's there because of gravity. The Doppler effect — measuring stellar velocities from spectral line shifts — was the key tool.

```
::: {.callout-note title="We'll Return to This" collapse="false"}
Dark matter is one of the biggest mysteries in modern astrophysics.
In Module 3, when we study galaxies and cosmology, we'll explore:

- How much dark matter is there? (~5× more than normal matter!)
- What could it be made of?
- How does it affect the structure of the universe?

The story of dark matter began with Doppler shifts and Newton's gravity.
:::
```

### Check Yourself 3:

```
::: {.callout-check-yourself title="Check Yourself 3 — Dark Matter Evidence"}
Galaxy rotation curves provide evidence for dark matter because:

- A) Stars at galaxy edges move slower than expected
- B) Stars at galaxy edges move faster than expected from visible matter alone
- C) Galaxies don't rotate at all
- D) We can see dark matter directly in telescope images
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Stars at galaxy edges move faster than expected from visible matter alone.**
If only the visible matter existed, outer stars should orbit slowly. But
they orbit fast — requiring additional invisible mass (dark matter) to
provide the gravitational pull.
:::
```

---

# PART 2: TELESCOPES — COLLECTING THE LIGHT (~40% of reading)

## Section 2.1: Why Telescopes Matter

**Target length:** ~1.5 pages

### The Astronomer's Eyes

> We've learned how much information light carries: temperature (blackbody), composition (spectral lines), motion (Doppler). But to decode that information, we need to **collect** the light first.
>
> Telescopes are the astronomer's eyes — and bigger eyes see more.

### Two Key Properties

> Telescopes have two main jobs:
>
> 1. **Collect light** (sensitivity) — fainter objects need more photons
> 2. **Resolve detail** (resolution) — separate closely-spaced objects

---

## Section 2.2: Light-Gathering Power

**Target length:** ~2 pages

### More Photons = Fainter Objects

> A telescope's ability to detect faint objects depends on how much light it collects. This is determined by the **area** of its primary mirror or lens:
>
> $$\text{Light-gathering power} \propto D^2$$
>
> where $D$ is the diameter of the telescope.

### Why Area Matters

> Double the diameter → **4× the collecting area** → 4× more photons per second.
>
> This is why astronomers build ever-larger telescopes:
>
> | Telescope | Diameter | Relative Light-Gathering |
> |-----------|----------|-------------------------|
> | Human eye | ~7 mm | 1 |
> | Amateur scope | 20 cm | 800 |
> | Hubble | 2.4 m | 120,000 |
> | Keck | 10 m | 2,000,000 |
> | ELT (future) | 39 m | 31,000,000 |

### Check Yourself 4:

```
::: {.callout-check-yourself title="Check Yourself 4 — Light-Gathering Power"}
Telescope A has twice the diameter of Telescope B. How does A's
light-gathering power compare to B's?

- A) 2× greater
- B) 4× greater
- C) 8× greater
- D) The same
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) 4× greater.** Light-gathering power scales as area, which goes as
$D^2$. Twice the diameter → $2^2 = 4$ times the collecting area.
:::
```

---

## Section 2.3: Resolution — Seeing Fine Detail

**Target length:** ~2.5 pages

### The Diffraction Limit

> Even a perfect telescope can't focus light to an infinitely sharp point. Light waves **diffract** (spread out) when passing through a finite aperture. This sets a fundamental limit on resolution called the **Rayleigh criterion**:
>
> $$\theta \approx 1.22 \frac{\lambda}{D}$$
>
> where:
> - $\theta$ = angular resolution (in radians; smaller = sharper)
> - $\lambda$ = wavelength of light
> - $D$ = telescope diameter
> - The factor 1.22 comes from the physics of diffraction through a circular aperture

### What This Means

> - **Larger telescope** → smaller $\theta$ → finer detail resolved
> - **Shorter wavelength** → smaller $\theta$ → finer detail resolved
>
> This is why radio telescopes need to be huge (radio waves have long wavelengths) while optical telescopes achieve great resolution with more modest sizes.

### Worked Example

> **Problem:** The Hubble Space Telescope has a 2.4 m mirror and observes at 500 nm. What is its angular resolution?
>
> **Solution:**
> $$\theta = 1.22 \times \frac{\lambda}{D} = 1.22 \times \frac{500 \times 10^{-9} \text{ m}}{2.4 \text{ m}} = 2.5 \times 10^{-7} \text{ rad}$$
>
> Converting to arcseconds (1 rad = 206,265"):
> $$\theta = 2.5 \times 10^{-7} \times 206,265 \approx 0.05"$$
>
> Hubble can resolve details as small as 0.05 arcseconds — about **10–20× sharper** than typical ground-based telescopes, which are limited to ~0.5–1" resolution by atmospheric blurring ("seeing").

### Demo Connection

```
::: {.callout-tip title="🖥️ Demo: Telescope Resolution" collapse="false"}
Open the **[Telescope Resolution Interactive Demo](/demos/telescope-resolution/)**
to see how changing telescope diameter and wavelength affects resolution.
Try "observing" the same object at different wavelengths!
:::
```

---

## Section 2.4: Atmospheric Windows and Space Telescopes

**Target length:** ~2 pages

### Callback to L7: The Atmosphere Blocks Most Wavelengths

> In L7, we learned that Earth's atmosphere is only transparent in certain **atmospheric windows** — mainly visible light and parts of the radio spectrum. Most UV, X-rays, gamma rays, and much of the infrared are absorbed.
>
> To observe at these blocked wavelengths, we must go to **space**.

### Why Space Telescopes

| Wavelength | Ground-Based? | Why Space? |
|------------|---------------|------------|
| Radio | ✓ Yes | Atmosphere transparent |
| Infrared | Partially | Water vapor absorbs; also warmer than space |
| Visible | ✓ Yes | But atmosphere blurs images |
| Ultraviolet | ✗ No | Ozone absorbs |
| X-ray | ✗ No | Atmosphere absorbs |
| Gamma ray | ✗ No | Atmosphere absorbs |

### Modern Observatories

> **Ground-based giants:**
> - **Keck** (Hawaii): Twin 10m mirrors, optical/infrared
> - **VLT** (Chile): Four 8.2m telescopes, can work together
> - **ALMA** (Chile): 66 radio dishes for millimeter waves
> - **ELT** (under construction): 39m mirror, will be largest optical telescope
>
> **Space telescopes:**
> - **Hubble** (1990-present): Optical/UV, iconic images
> - **JWST** (2021-present): Infrared, sees earliest galaxies and exoplanet atmospheres
> - **Chandra** (1999-present): X-rays, hot gas and black holes
> - **Fermi** (2008-present): Gamma rays, extreme cosmic events

### The Power of Multi-Wavelength Astronomy

> Different wavelengths reveal different physics. A complete picture requires observations across the spectrum — which is why we build telescopes of all kinds.

---

## Section 2.5: Types of Telescopes (Brief)

**Target length:** ~1.5 pages

### Refractors vs. Reflectors

> - **Refractors** use lenses to focus light. Limited by chromatic aberration and lens size/weight. Galileo used a refractor.
> - **Reflectors** use curved mirrors. Can be made much larger; most modern research telescopes are reflectors. Newton built the first practical reflector.

### Radio Telescopes

> Radio waves have wavelengths millions of times longer than visible light. By $\theta \propto \lambda/D$, radio telescopes need to be enormous to achieve decent resolution. The Arecibo dish (now collapsed) was 305m across; the FAST dish in China is 500m.
>
> To get even better resolution, multiple radio dishes work together (**interferometry**), effectively creating a telescope the size of their separation.

---

# CLOSING ELEMENTS

## Summary Box

```
::: {.callout-important title="Key Takeaways from Lecture 10"}
**Doppler Effect:**
1. $\Delta\lambda/\lambda_0 = v/c$ measures **radial velocity** (line-of-sight only)
2. Rest wavelength = lab reference. Blueshift = approaching; redshift = receding.
3. Blueshift/redshift apply to **all** wavelengths, not just visible.
4. Exoplanets detected via stellar wobble (periodic Doppler shifts)
5. Dark matter discovered via flat galaxy rotation curves (stars orbit too fast)

**Telescopes:**
6. Light-gathering power ∝ $D^2$ (area)
7. Resolution: $\theta \approx 1.22\lambda/D$ (larger D and shorter λ → finer detail)
8. Space telescopes access wavelengths blocked by atmosphere
:::
```

---

## Practice Problems

### Core (do these first)

1. **Doppler Calculation:** A star's sodium D line (rest wavelength 589.0 nm) is observed at 589.2 nm. Calculate the star's radial velocity. Is it approaching or receding? (Remember: $\Delta\lambda > 0$ means receding.)

2. **Radial vs. Transverse:** A star has a space velocity of 50 km/s, but it's moving entirely across the sky (perpendicular to our line of sight). What Doppler shift do we measure?

3. **Telescope Comparison:** Telescope A has a 4m mirror; Telescope B has a 2m mirror. How much more light does A collect? How does A's resolution compare to B's (at the same wavelength)?

4. **Multi-wavelength Astronomy:** Why do astronomers observe the same object at different wavelengths? Give an example of something you'd learn from infrared that you couldn't learn from visible light alone.

### Challenge

5. **Exoplanet or Binary?:** A star's spectral lines shift with amplitude ±0.005 nm around a rest wavelength of 500 nm, with a period of 3 days. Calculate the star's radial velocity amplitude. Is this likely caused by a planet or a stellar companion? Explain your reasoning.

6. **Dark Matter:** Explain in your own words how galaxy rotation curves provide evidence for dark matter. Use the concepts of orbital velocity, gravity, and mass.

---

## Glossary

| Term | Definition |
|------|------------|
| **Rest wavelength ($\lambda_0$)** | The wavelength of a line measured in the lab with no relative motion |
| **Doppler shift** | The change in observed wavelength due to relative motion |
| **Radial velocity** | The component of velocity along the line of sight |
| **Transverse velocity** | The component of velocity across the sky (perpendicular to line of sight) |
| **Blueshift** | Shift to shorter wavelengths (source approaching) |
| **Redshift** | Shift to longer wavelengths (source receding) |
| **Barycentric correction** | Correcting for Earth's orbital motion around the Sun |
| **Dark matter** | Invisible matter that has gravity but doesn't interact with light |
| **Light-gathering power** | A telescope's ability to collect light; ∝ D² |
| **Angular resolution** | Ability to distinguish closely-spaced objects; ∝ λ/D |
| **Rayleigh criterion** | The formula $\theta = 1.22\lambda/D$ for diffraction-limited resolution |
| **Interferometry** | Combining signals from multiple telescopes to achieve higher resolution |

---

## Figure Checklist

| Figure ID | Description | Status |
|-----------|-------------|--------|
| `radial-vs-transverse` | Velocity components diagram | ☐ |
| `radial-velocity-method` | Star-planet wobble and Doppler curve | ☐ |
| `galaxy-rotation-curve` | Expected vs. observed rotation curves | ☐ |

---

## Module 1 Completion Check

**With L10 complete, students have the full toolkit:**

✅ Scale of the universe and our place in it (L1-L2)
✅ Celestial coordinates, seasons, Moon phases, eclipses (L3-L4)
✅ Kepler's Laws: ellipses, equal areas, $P^2 \propto a^3$ (L5)
✅ Newton's Laws: gravity explains Kepler; orbits reveal mass (L6)
✅ Light as information: wavelength, EM spectrum, scattering (L7)
✅ Temperature from light: Wien's Law, Stefan-Boltzmann, L-T-R (L8)
✅ Composition from light: spectral lines, stellar classification (L9)
✅ Motion from light: Doppler effect, exoplanets, dark matter (L10)
✅ Telescopes: how we collect and analyze light (L10)

**Next:** Module 1 Exam (Week 7), then Module 2 — Stars!

---

*End of L10 Outline (v1)*
