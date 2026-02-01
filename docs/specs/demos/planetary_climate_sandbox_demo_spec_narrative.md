# Planetary Climate Sandbox (Lecture 12) — Comprehensive Pedagogical Spec

This document is an implementation-ready specification for a new interactive demo that supports **Lecture 12: Planetary Climates & Finding Other Worlds**. The core idea is that students learn climate best when they can *touch the model*: change a parameter, watch the energy budget respond, and connect that response to a physical explanation.

The demo is designed to do two things at once. First, it makes the greenhouse effect intellectually *non-mystical* by rooting it in energy balance and infrared emission. Second, it bridges naturally into exoplanets by showing how “habitable zone” reasoning is just the same energy-balance physics applied to other stars.

---

## What this demo is (in plain language)

In astronomy, we almost never touch what we study. For planets, we mostly infer properties from light and motion. Climate is no exception: planetary temperatures are determined by a balance between **incoming energy** (mostly starlight) and **outgoing energy** (mostly infrared thermal radiation). The simplest version of that balance gives an **equilibrium temperature**, which is a baseline prediction for an airless world. Real planets often deviate from that baseline because atmospheres can change how efficiently infrared energy escapes.

This demo lets students vary the inputs to that balance—stellar brightness, distance, reflectivity, and greenhouse strength—and see what happens to the planet’s predicted temperature. The goal is not to build a full climate model; it is to build a *correct mental model* that students can use to reason about Venus, Earth, Mars, and exoplanets.

---

## Student-facing story arc

When students open the demo, they should feel like they are running a “planet climate experiment.” The interface should present a single world with clear readouts for (i) how much energy is arriving, (ii) how much is being absorbed, and (iii) how much must escape to space in the long run. Students then choose a preset (Venus, Earth, Mars) or create their own world and try to explain outcomes using the knobs.

The experience should follow the same cognitive loop as your reading: **Predict → Play → Explain**. Students are prompted to predict, for example, whether raising albedo makes a planet warmer or cooler, or whether Venus’s high reflectivity should make it cold. Then they adjust the knobs and reconcile their prediction with the results.

---

## Core terms (every term is defined the first time it appears)

**Stellar luminosity** $L_\star$ is the total power a star emits in all directions, measured in watts (W). A more luminous star delivers more energy to planets at a given distance.

**Flux** $F$ is power per unit area (W m$^{-2}$). When we talk about “how intense the sunlight is” at a planet, we mean flux.

**Distance** $d$ is the orbital distance from the star to the planet. In Solar System contexts we often use astronomical units (AU), where $1\,\mathrm{AU}$ is the average Earth–Sun distance.

**Bond albedo** $A$ is the fraction of the *total incoming energy* that is reflected back to space, averaged over all wavelengths and angles. Bond albedo is the correct kind of albedo for energy balance. (Students often encounter “geometric albedo” elsewhere; that is a reflectivity at a particular viewing geometry and is not what we want for climate calculations.)

**Equilibrium temperature** $T_{eq}$ is the temperature an idealized, airless, spherical planet would have if it balanced absorbed starlight with thermal emission to space. It is a *model prediction*, not a direct measurement of surface temperature.

**Surface temperature** $T_{surf}$ is the actual surface temperature we care about for habitability. On Earth we can measure it directly; for other planets we infer it from infrared emission and spacecraft data.

A **greenhouse gas** is an atmospheric gas that is relatively transparent to much of the incoming visible light but absorbs (and re-emits) outgoing infrared radiation in specific wavelength bands. The greenhouse effect arises because infrared escape becomes less efficient.

**Optical depth** $\tau_{IR}$ is a dimensionless way to describe how opaque an atmosphere is to infrared radiation. Larger $\tau_{IR}$ means infrared photons have a harder time escaping directly to space.

**Emissivity** $\varepsilon$ is a number between 0 and 1 that describes how efficiently something emits radiation compared to a perfect blackbody. In this demo we use an “effective emissivity to space” to represent how easily infrared escapes.

The **habitable zone** (HZ) is the range of orbital distances where a planet *could* have liquid water on its surface, given some assumptions about atmosphere and climate. It is a starting point for reasoning, not a guarantee of habitability.

---

## The physics model (with enough detail to be honest, but simple enough to teach)

### Constants (SI units)

The Stefan–Boltzmann constant is

$$\sigma = 5.670374419\times 10^{-8}\ \mathrm{W\,m^{-2}\,K^{-4}}.$$

The solar luminosity is

$$L_\odot = 3.828\times 10^{26}\ \mathrm{W},$$

and one astronomical unit is

$$1\,\mathrm{AU} = 1.495978707\times 10^{11}\ \mathrm{m}.$$

These can be hard-coded in the demo.

### Step 1: How much starlight arrives?

At a distance $d$ from a star of luminosity $L_\star$, the flux is

$$F_\star(d) = \frac{L_\star}{4\pi d^2}.$$

This is the “spread over a sphere” idea: the same total power is distributed across a sphere whose area is $4\pi d^2$.

### Step 2: Why does the planet intercept a disk, not a sphere?

A sphere does not catch light over its whole surface because the light comes from one direction. The planet intercepts starlight across its cross-sectional area, which is a circle of area $\pi R_p^2$. This is why the eclipse analogy is so good: the Moon’s shadow is a disk because it blocks parallel rays.

### Step 3: Include reflectivity (Bond albedo)

If the Bond albedo is $A$, then the planet absorbs only a fraction $(1-A)$ of the incoming power. The absorbed power is

$$P_{in} = (1-A)\,\pi R_p^2\,F_\star(d).$$

### Step 4: Thermal emission and equilibrium temperature

A blackbody at temperature $T$ emits $\sigma T^4$ watts per square meter. A spherical planet radiates from an area $4\pi R_p^2$, so its emitted power is

$$P_{out} = 4\pi R_p^2\,\sigma T_{eq}^4.$$

Setting $P_{in} = P_{out}$ and solving for $T_{eq}$ gives

$$T_{eq} = \left[\frac{(1-A)L_\star}{16\pi\sigma d^2}\right]^{1/4}.$$

A pedagogical moment that matters: $R_p$ cancels out. In this simple model, planet size does not change $T_{eq}$.

### A very useful normalized quantity: insolation

Students often think more clearly in ratios than in absolute numbers. Define insolation relative to Earth as

$$\frac{S}{S_\oplus} = \frac{L_\star/L_\odot}{(d/\mathrm{AU})^2}.$$

This tells you how much starlight a planet receives compared to Earth.

### Step 5: A greenhouse model that is transparent and calibratable

A full greenhouse model requires radiative transfer. For ASTR 101 we want a toy model that behaves correctly and is easy to explain.

We represent greenhouse strength using an infrared optical depth $\tau_{IR}$. We convert that into an effective “to-space emissivity”

$$\varepsilon_{out} = e^{-\tau_{IR}}.$$

We then enforce energy balance at the top of the atmosphere by requiring that the outgoing flux to space equals $\sigma T_{eq}^4$. In the toy model, the surface must radiate more if only a fraction escapes:

$$\sigma T_{eq}^4 = \varepsilon_{out}\,\sigma T_{surf}^4.$$

Therefore,

$$T_{surf} = T_{eq}\,\varepsilon_{out}^{-1/4} = T_{eq}\,e^{\tau_{IR}/4}.$$

This is not a full physical greenhouse calculation, but it captures the right causal logic: making infrared escape less efficient forces the surface to be warmer to maintain the same outgoing power.

A nice benefit is that we can calibrate $\tau_{IR}$ from known planets:

$$\tau_{IR} = 4\ln\left(\frac{T_{surf}}{T_{eq}}\right).$$

---

## Solar System calibration presets (v1)

The demo should ship with Solar System presets that reproduce familiar numbers and set up the Venus/Earth/Mars comparison.

Use $L_\star = L_\odot$ for these, and use Bond albedos.

| Planet | $d$ (AU) | $A$ (Bond) | $T_{eq}$ (K) | $T_{surf}$ (K) | Calibrated $\tau_{IR}$ |
|---|---:|---:|---:|---:|---:|
| Venus | 0.72 | 0.76 | 230 | 735 | 4.65 |
| Earth | 1.00 | 0.30 | 255 | 288 | 0.49 |
| Mars | 1.52 | 0.25 | 210 | 218 | 0.15 |

Students should be encouraged to notice the “Venus paradox”: Venus has the highest albedo of the three and *should* be cooler by reflectivity alone, yet it is far hotter because $\tau_{IR}$ is enormous.

---

## Exoplanet presets (what to include, and why)

Exoplanet presets are pedagogically valuable because they force students to confront what is **known** and what is **assumed**. For most exoplanets we know orbital period and distance reasonably well, and we often know radius (from transits) or minimum mass (from radial velocity). We almost never know Bond albedo or greenhouse strength directly. The demo should therefore display these as “unknown” by default and allow students to explore plausible assumptions.

A good core set for Lecture 12 includes at least one nearby M-dwarf planet, one compact multi-planet system, one habitable-zone candidate found by TESS, and one hot Jupiter that demonstrates detection bias.

If you include **Proxima Centauri b**, you get the closest habitable-zone candidate and an example of an M-dwarf planet found by radial velocity. The teaching value is huge because it highlights uncertainties: potential tidal locking, stellar activity, and unknown atmosphere.

If you include **TRAPPIST-1 e**, you get a transiting, Earth-sized planet in a famous compact system around an ultracool dwarf. This is ideal for discussing transits, densities (if you include mass), and the way habitable zones shift inward for dim stars.

If you include **TOI-700 d** (and optionally TOI-700 e), you get clean, modern TESS-era examples of potentially temperate terrestrial/super-Earth planets with well-known transit parameters.

If you include **51 Pegasi b**, you get a canonical hot Jupiter discovered by radial velocity. It is not habitable, and that is the point: it teaches selection effects (close-in big planets are easiest) and helps students understand why early exoplanet catalogs looked “weird.”

You can expand later with historically important or conceptually rich cases such as Kepler-186 f (first Earth-size HZ-ish), LHS 1140 b (nearby transiting super-Earth), or K2-18 b (mini-Neptune in the HZ-ish regime, great for “HZ \(\neq\) habitable” and density degeneracy). In a first release, keep the set small and well-explained.

For each exoplanet preset, the dataset should store $L_\star/L_\odot$ (host-star luminosity), $a$ (semi-major axis in AU), and whichever of $R_p$ and $M_p$ is known. Bond albedo and $\tau_{IR}$ should default to “unknown,” but the preset can include a clearly labeled “assumed Earth-like” option (e.g., $A=0.30$, $\tau_{IR}=0.49$) so students can explore.

---

## What the student actually controls (and what each knob means)

The interface should give students a small number of meaningful knobs, each tied to a physical story.

The **stellar luminosity** control changes how much energy the star emits. In practice students can treat this as “how bright the star is.” Increasing $L_\star$ increases $T_{eq}$ and shifts the habitable zone outward.

The **distance** control changes how far the planet is from its star. Because flux decreases as $1/d^2$, moving a planet closer rapidly increases heating.

The **Bond albedo** control changes how reflective the planet is. Increasing albedo means less absorbed energy and therefore lower $T_{eq}$.

The **greenhouse strength** control changes $\tau_{IR}$, the infrared optical depth. Increasing $\tau_{IR}$ makes infrared escape less efficient and raises $T_{surf}$ above $T_{eq}$.

An optional advanced control is a **heat redistribution** toggle. Many planets do not evenly distribute heat from day to night. A simple way to teach this is to allow two modes: “full redistribution” (the whole planet emits, the factor of 4 case) versus “dayside emission” (less area emits, so the dayside must be hotter). If you include this, define a redistribution factor $f$ and modify the equilibrium calculation as

$$T_{eq}(f)=\left[\frac{(1-A)L_\star}{4\pi\sigma d^2\,f}\right]^{1/4},$$

where $f=4$ corresponds to uniform emission and $f=2$ corresponds to dayside-only emission.

Another optional advanced concept is **internal heat**, which matters for gas giants. Internal heat can be represented as an additional flux term added to the absorbed stellar flux. This is not required for L12, but it is a nice bridge to L11 and to later giant-planet discussions.

---

## Spectral greenhouse view (extension that ties directly to L7–L9)

A powerful optional mode is a “spectral view” that connects greenhouse warming to wavelength-dependent absorption. In this view, the demo should show a simplified blackbody curve for the planet’s thermal emission and then overlay broad absorption bands for common greenhouse gases.

In real spectroscopy, greenhouse absorption is line-by-line and depends on pressure, temperature, and composition. For ASTR 101, use band centers and approximate widths as illustrative “dips,” and label the visualization as a teaching model.

In the first version, support at least CO$_2$ (around 4.3 and 15 $\mu\mathrm{m}$), H$_2$O (around 6–7 $\mu\mathrm{m}$), CH$_4$ (around 3.3 $\mu\mathrm{m}$), and CO (around 4.67 $\mu\mathrm{m}$). These are stable anchor points for an IR “fingerprint” story.

This spectral mode should reinforce a key idea: the atmosphere is mostly transparent to incoming visible light, but selectively absorbs outgoing infrared in key wavelength bands, which reduces infrared escape and raises $T_{surf}$.

---

## Activities that make the demo teach (not just entertain)

This demo is at its best when paired with structured prompts. Students should not only “see” results but explain them in words.

A strong in-class workflow is to begin with a short prediction: ask students whether Venus should be cooler than Earth because it reflects more sunlight. Then have them load presets and record $T_{eq}$, $T_{surf}$, and $\Delta T = T_{surf}-T_{eq}$. They should notice immediately that Venus’s albedo cannot explain its heat, which forces the greenhouse discussion.

Next, have students run a controlled experiment: hold distance fixed at Venus’s orbit, set albedo to Venus-like, but set greenhouse strength to Earth-like. They should see Venus become much cooler in the model. Then increase $\tau_{IR}$ step-by-step and ask them to identify when the planet becomes “runaway-hot” in this simplified sense.

Finally, connect to Earth: keep Earth distance and albedo fixed and increase $\tau_{IR}$ slightly. The demo should make it obvious that small changes in greenhouse strength can yield a few degrees of warming, and the instructor can emphasize why “a few degrees globally” is a big deal.

For homework, give one short calculation and one interpretation prompt. A good calculation is to compute $T_{eq}$ for a planet around a dim star using the normalized formula. A good interpretation is: “Two planets have the same $T_{eq}$ but different $T_{surf}$. What must be different?”

---

## Instructor resources (facilitation notes)

The instructor-facing version should include a “lock preset” mode for the first five minutes of the activity so students don’t immediately wander into parameter space. Then the instructor can unlock the greenhouse knob for exploration.

During discussion, keep the narrative anchored to energy flow. The most pedagogically durable phrasing is: “Energy in must equal energy out in the long run. If the atmosphere makes it harder for infrared to escape, the surface must become warmer to push enough energy out.” This keeps students from imagining greenhouse gases as a solid barrier.

If you want a quick formative assessment, use a single concept check: “If albedo increases, does $T_{eq}$ increase or decrease?” followed by “If greenhouse strength increases, does $T_{surf}$ increase or decrease?” The demo makes both visually undeniable.

---

## Engineering notes (JS-first implementation)

This demo can be implemented as a standalone JavaScript module on your Astro 101 course site. The only required computation is evaluating the equations above and rendering simple plots/arrows.

All presets and molecular bands should live in JSON files. Each record should carry provenance fields such as `verified` and a list of `sources`. This keeps your pedagogy honest: if a parameter is assumed (e.g., exoplanet albedo), it is explicitly labeled as assumed.

You can still use Zod in a JS-first workflow by running validation scripts in Node during development and CI. Zod is a runtime schema validator that works in JavaScript; you do not need TypeScript to benefit from it. The student-facing demos do not need to ship Zod in the browser bundle; validation can remain a developer-facing step.

---

## Acceptance tests (what “done” means)

When the Earth preset is loaded with $A=0.30$, $d=1\,\mathrm{AU}$, and $L_\star=L_\odot$, the demo should report $T_{eq}\approx255\,\mathrm{K}$ to within rounding, and with the Earth-calibrated greenhouse setting it should report $T_{surf}\approx288\,\mathrm{K}$. The Venus and Mars presets should similarly reproduce $T_{eq}$ values near 230 K and 210 K, and the calibrated $T_{surf}$ values near 735 K and 218 K.

If the student increases Bond albedo while holding other parameters fixed, the absorbed flux should decrease and $T_{eq}$ should decrease. If the student increases $\tau_{IR}$ while holding $T_{eq}$ fixed, $T_{surf}$ should increase.

If the student switches between “full redistribution” and “dayside emission” (if implemented), the reported equilibrium temperature should increase in the dayside case, and the interface should explain that less emitting area requires a higher temperature to radiate the same total power.

The demo should behave sensibly for exoplanet presets even when albedo and greenhouse are unknown: defaults should be clearly labeled as assumptions, and the readouts should distinguish “baseline $T_{eq}$” from “assumed $T_{surf}$.”

---

## Roadmap and related demos

This climate sandbox is part of a larger “radiation-focused” demo suite. It will pair naturally with your Spectral Lines Lab (L9) and Doppler Shift Spectrometer (L10), because the spectral greenhouse view depends on the same idea: molecules absorb in specific wavelength bands.

You should absolutely write a separate spec for each demo (even when building JS-first). Specs prevent scope creep, enforce scientific correctness, and make future porting to Cosmic Playground straightforward.

A strong future addition is a rotation-curve demo that connects Doppler shifts to galaxy rotation curves and dark matter inference. The logic is exactly the same: measure a wavelength shift, infer a velocity, and compare the velocity profile to what Newtonian gravity predicts from visible matter alone.

