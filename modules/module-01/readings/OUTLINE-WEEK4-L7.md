# Week 4, Lecture 7: The Cosmic Messenger — Light Carries Information

**Status:** DRAFT OUTLINE — v1
**Target length:** ~35-40 rendered pages
**Filename when complete:** `lecture-07-light-information-reading.qmd`

---

## Instructor Approval Checklist

### Content

- [ ] Opening hook effectively motivates "light as information"
- [ ] "Light is Information" theme runs throughout (~60% implicit, ~40% explicit)
- [ ] Wave nature of light explained clearly (wavelength, frequency, c = λf)
- [ ] EM spectrum presented from radio → gamma with astronomical examples
- [ ] **Deep Dive: Why is the sky blue?** — Rayleigh scattering explained correctly
  - [ ] Wavelength-dependent scattering (∝ 1/λ⁴) emphasized
  - [ ] Blue scattered more than red → blue sky, red/orange sunsets
  - [ ] "Spot the assumption" about air molecules included
- [ ] **Deep Dive: Why are lunar eclipses red?** — Same physics applied
  - [ ] Earth's atmosphere bends and filters sunlight
  - [ ] Blue scattered away, red transmitted → blood moon
  - [ ] Connection to exoplanet atmosphere detection mentioned
- [ ] Speed of light covered (finite, cosmic speed limit)
- [ ] Inverse-square law for light intensity introduced (primes L8 Stefan-Boltzmann)
- [ ] Transition to L8 sets up "light carries temperature information"

### Pedagogy

- [ ] "Light is Information" throughline explicit in opening, closing, and key transitions
- [ ] Course throughline connected: "Motion reveals mass" (L5-L6) → "Light reveals everything else" (L7-L8)
- [ ] Predict → Explain → Check structure for key concepts
- [ ] "What does X mean?" bridges for tricky concepts (wavelength, frequency)
- [ ] Poll-style misconception questions included
- [ ] Check Yourself questions test the right concepts
- [ ] Practice problems marked Core vs Challenge
- [ ] Math level is algebra-only
- [ ] Tone matches L1-L6 (conversational but rigorous)

### Formatting

- [ ] YAML front matter correct
- [ ] Math formatting clean (no duplication)
- [ ] Tables are proper markdown
- [ ] Figure placeholders well-described
- [ ] Demo connections appropriate (EM Spectrum demo)

**Instructor notes/requested changes:**

```text
[Leave blank for Anna to fill in]



```

**Approval:** _______ (initials) **Date:** _______

---

## YAML Front Matter

```yaml
---
title: "The Cosmic Messenger — Light Carries Information"
subtitle: "Lecture 7 Reading Companion"
author: "Dr. Anna Rosen"
date: "2026-02-09"
description: "You've never touched a star, yet you know what it's made of. Light is how the universe talks to us — its wavelength encodes temperature, composition, motion, and more."
draft: false
categories: [foundations, light, em-spectrum]
course: ASTR 101
module: "1 - Foundations"
learning-objectives:
  - Describe light as an electromagnetic wave and relate wavelength, frequency, and speed (c = λf)
  - Identify the major regions of the electromagnetic spectrum and their astronomical uses
  - Explain why the sky is blue and sunsets are red using Rayleigh scattering
  - Explain why lunar eclipses produce a "blood moon" using the same physics
  - Recognize that astronomers extract information (temperature, composition, motion) from light
  - Apply the inverse-square law for light intensity
math-level: algebra_only
prerequisites: Lecture 6 (Newton's Gravity); understanding of waves helpful but not required
---
```

---

## The Big Idea

> You've never touched a star. You never will. Yet you can tell me a star's temperature, composition, age, mass, and motion. How? **Light.** Light is the universe's messenger — and learning to decode it is the astronomer's superpower.

---

## Opening Hook: You've Never Touched a Star

**Target length:** ~1.5 pages

**Key narrative beats:**

1. Stars are impossibly far away — the nearest is 4 light-years (40 trillion km)
2. We can't visit, sample, or probe them directly
3. Yet we know extraordinary things about them: temperature, composition, motion, age
4. How is this possible? **Light carries information**
5. This lecture: What IS light? How does wavelength encode information?
6. Next lecture (L8): How do we read temperature from light?

**Draft opening:**

> Think about this for a moment: the closest star to the Sun — Proxima Centauri — is about 4 light-years away. That means light traveling at 300,000 km/s takes **four years** to reach us. In human terms, that's roughly 40 trillion kilometers. You will never go there. No one alive today will visit another star.
>
> And yet... we can tell you that Proxima Centauri is a red dwarf with a surface temperature of about 3,000 K. It has at least two planets. It occasionally releases violent flares. We know its mass, its age, its chemical composition.
>
> How do we know all this about something we've never touched?
>
> **Because light carries information.**
>
> Every photon that reaches your telescope has a story to tell. Its wavelength reveals the temperature of the surface that emitted it. Subtle shifts in that wavelength reveal whether the source is moving toward or away from you. Specific wavelengths absorbed or emitted reveal which chemical elements are present.
>
> In Lectures 5 and 6, we learned that **motion reveals mass** — by watching how things orbit, we can weigh the invisible. Now we'll discover that **light reveals everything else**: temperature, composition, distance, velocity, age.
>
> This lecture is about what light IS and why wavelength matters. Next lecture, we'll see how to read temperature from light. Together, they give astronomers the tools to decode the cosmos without ever leaving Earth.

**Figure placeholder:**

```
{{< fig proxima-centauri-info >}}

FIGURE: Information from Light
DESCRIPTION: Show Proxima Centauri with arrows pointing to different
pieces of information we know about it (temperature ~3,000 K, mass ~0.12
solar masses, distance 4.2 ly, composition, planets detected). Caption:
"We've never been there. We know all of this from light."
ALT TEXT: Proxima Centauri with labeled arrows showing temperature,
mass, distance, and other properties all determined from analyzing its light.
```

**🔍 Spot the Assumption:**

```
::: {.callout-note title="🔍 Spot the Assumption" collapse="false"}
Before this lecture, you might have assumed:
- **We can only study things we can touch or visit**
- **Distant objects are fundamentally unknowable**

The breakthrough: Light carries information across cosmic distances.
Every wavelength is a data point. Every spectrum is a message.
:::
```

---

## "How to Use This Reading" Callout

```
::: {.callout-important title="How to Use This Reading" collapse="true"}
This reading introduces light as astronomy's fundamental tool. Keep the
big picture in mind: **light is how the universe communicates with us.**

**Musts for today (~25 min):**
- The Big Idea
- What is light? (waves, wavelength, frequency, c = λf)
- The electromagnetic spectrum (at least know the order!)
- Why the sky is blue (Rayleigh scattering)
- Why lunar eclipses are red (same physics)

**Non-negotiable:** Stop at every **Check Yourself** question.

**Deep Dives (important but save for later):**
- Speed of light and its implications
- Inverse-square law for intensity (preview of L8)

**Connection to the Course:**
- L5-L6: Motion reveals mass
- L7-L8: Light reveals everything else
- L9 (next): Spectral lines reveal composition and motion
:::
```

**Optional "Light as Information in 60 Seconds" box:**

```
::: {.callout-tip title="Light as Information in 60 Seconds" collapse="true"}
If you only remember three things:

1. **Light is an electromagnetic wave.** Its wavelength determines its
   "color" — from radio (long) to gamma rays (short).

2. **Wavelength carries information.** The color of light tells you about
   the source: temperature, composition, motion.

3. **Astronomy is information extraction.** Every observation is about
   decoding the light that reaches us from cosmic sources.

Now for the details...
:::
```

---

## Transition from L5-L6

**Brief recap box:**

```
::: {.callout-note title="Where We Left Off (Lectures 5-6)"}
In the last two lectures, we discovered how **motion reveals mass**:

- Kepler found patterns in planetary motion (empirical laws)
- Newton explained those patterns with gravity (physical law)
- By measuring orbits, we can "weigh" invisible objects

**The key insight:** Watching how things move tells us about the
invisible forces and masses involved.

Now we turn to an even more powerful tool: **light**. With motion, we
can measure mass. With light, we can measure temperature, composition,
velocity, distance, and more — all without touching anything.
:::
```

---

# PART 1: WHAT IS LIGHT? (~35% of reading)

## Section 1.1: Light as a Wave

**Target length:** ~3 pages

### The Wave Model

**Key points:**

- Light is an **electromagnetic wave** — oscillating electric and magnetic fields
- Unlike ocean waves or sound waves, it doesn't need a medium (travels through vacuum)
- All electromagnetic waves travel at the same speed in vacuum: $c = 3 \times 10^8$ m/s

**Margin definitions:**

- **Electromagnetic wave:** A self-propagating wave of oscillating electric and magnetic fields
- **Wavelength ($\lambda$):** The distance between consecutive wave crests; measured in meters (or nm for visible light)
- **Frequency ($f$):** How many wave crests pass a point per second; measured in hertz (Hz)

### The Key Relationship

```
::: {.callout-important title="The Wave Equation for Light"}
**For any electromagnetic wave:**

$$c = \lambda f$$

where:
- $c = 3 \times 10^8$ m/s (speed of light)
- $\lambda$ = wavelength (meters)
- $f$ = frequency (hertz = cycles per second)

**Since $c$ is constant:** longer wavelength ↔ lower frequency,
shorter wavelength ↔ higher frequency.
:::
```

### What Does This Mean?

> The equation $c = \lambda f$ has a profound implication: since the speed of light is fixed, wavelength and frequency are **inversely related**. A wave with twice the wavelength has half the frequency. A wave with 10× the frequency has 1/10 the wavelength.
>
> This means wavelength and frequency carry the same information — they're two ways of describing the same property. Astronomers often switch between them depending on convenience.

**Figure placeholder:**

```
{{< fig electromagnetic-wave >}}

FIGURE: Anatomy of an Electromagnetic Wave
DESCRIPTION: Show a sinusoidal wave with:
- Wavelength (λ) labeled as distance between crests
- Arrow showing direction of propagation
- Maybe show E and B field components perpendicular
- Keep it simple — focus on wavelength
ALT TEXT: An electromagnetic wave showing wavelength as the distance
between successive crests.
```

### Quick Calculation

> **Example:** Visible red light has a wavelength of about 700 nm (nanometers).
> What's its frequency?
>
> First, convert: $\lambda = 700 \text{ nm} = 700 \times 10^{-9} \text{ m} = 7 \times 10^{-7}$ m
>
> Then: $f = \frac{c}{\lambda} = \frac{3 \times 10^8}{7 \times 10^{-7}} \approx 4.3 \times 10^{14}$ Hz
>
> Red light oscillates about 430 trillion times per second!

**Check Yourself 1:**

```
::: {.callout-check-yourself title="Check Yourself 1 — Wavelength and Frequency"}
If one type of light has twice the wavelength of another, it has:

- A) Twice the frequency
- B) Half the frequency
- C) The same frequency
- D) Four times the frequency
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Half the frequency.** Since $c = \lambda f$ and $c$ is constant,
wavelength and frequency are inversely related. Double the wavelength
means half the frequency.
:::
```

---

## Section 1.2: The Electromagnetic Spectrum

**Target length:** ~3 pages

### More Than Meets the Eye

> What we call "visible light" — the colors of the rainbow — is just a tiny sliver of the electromagnetic spectrum. There's a vast range of wavelengths our eyes can't see, from radio waves longer than buildings to gamma rays smaller than atoms. **All of them are light.** All carry information.

### The Spectrum

| Region | Wavelength Range | Typical Sources | Astronomical Uses |
|--------|-----------------|-----------------|-------------------|
| **Radio** | > 1 mm | Radio transmitters, cold gas clouds | Mapping hydrogen, pulsars, cosmic background |
| **Microwave** | 1 mm – 1 cm | Ovens, cosmic microwave background | CMB, cold dust, molecular clouds |
| **Infrared** | 700 nm – 1 mm | Warm objects, heat | Dust-obscured regions, cool stars, exoplanet atmospheres |
| **Visible** | 400 – 700 nm | Hot objects (stars, light bulbs) | Direct imaging, stellar classification |
| **Ultraviolet** | 10 – 400 nm | Very hot stars, active galaxies | Hot gas, stellar nurseries |
| **X-ray** | 0.01 – 10 nm | Extremely hot gas, black hole accretion | Black holes, neutron stars, galaxy clusters |
| **Gamma ray** | < 0.01 nm | Nuclear reactions, cosmic explosions | Supernovae, gamma-ray bursts, pulsars |

**Figure placeholder:**

```
{{< fig em-spectrum-full >}}

FIGURE: The Electromagnetic Spectrum
DESCRIPTION: Show the full EM spectrum from radio to gamma rays:
- Wavelength scale (logarithmic) along the bottom
- Frequency scale along the top (increasing in opposite direction)
- Visible light expanded to show ROYGBIV
- Icons for astronomical sources at each region
- Arrows showing "longer wavelength / lower frequency" and "shorter / higher"
- Note that visible light is a tiny fraction of the whole
ALT TEXT: The electromagnetic spectrum from long-wavelength radio waves
to short-wavelength gamma rays, with visible light as a narrow band.
```

**Mnemonic for visible light order:**

> **R**ed, **O**range, **Y**ellow, **G**reen, **B**lue, **V**iolet — "Roy G. Biv"
> Red has the longest visible wavelength; violet has the shortest.

**Atmospheric windows (why we need space telescopes):**

```
::: {.callout-note title="Atmospheric Windows" collapse="true"}
Earth's atmosphere is transparent mainly in two broad windows: **visible light** and parts of **radio**.
It absorbs most **ultraviolet, X-rays, and gamma rays**, and it absorbs a lot of **infrared** (though some IR gets through from high, dry sites).

This is why some astronomy must be done from space: the atmosphere blocks the very wavelengths that would carry that information to the ground.
:::
```

### Demo Connection

```
::: {.callout-tip title="🖥️ Demo: Explore the Spectrum" collapse="false"}
Open the **[EM Spectrum Interactive Demo](/demos/em-spectrum/)** to
explore different wavelengths and see what each region reveals about
the universe. Try clicking on different astronomical sources!
:::
```

### Why Multiple Wavelengths Matter

> Different wavelengths reveal different phenomena. Radio waves penetrate dust that blocks visible light. X-rays reveal million-degree gas invisible to optical telescopes. Infrared shows warm dust and forming stars hidden behind clouds.
>
> **The universe looks different at every wavelength.** To understand the cosmos fully, we need to observe across the spectrum — which is why astronomers build radio dishes, infrared satellites, X-ray telescopes, and more.

**Figure placeholder:**

```
{{< fig multiwavelength-crab >}}

FIGURE: The Crab Nebula at Multiple Wavelengths
DESCRIPTION: Show the Crab Nebula observed in radio, infrared, visible,
X-ray, and gamma-ray. Each reveals different structures:
- Radio: synchrotron emission, magnetic fields
- Infrared: warm dust
- Visible: expanding gas filaments
- X-ray: high-energy particles from central pulsar
ALT TEXT: The Crab Nebula looks strikingly different at each wavelength,
revealing different physical processes happening simultaneously.
```

**Check Yourself 2:**

```
::: {.callout-check-yourself title="Check Yourself 2 — Ordering the Spectrum"}
Which correctly orders these types of light from longest wavelength
to shortest?

- A) Gamma rays → X-rays → UV → Visible → Infrared → Radio
- B) Radio → Infrared → Visible → UV → X-rays → Gamma rays
- C) Visible → UV → Infrared → Radio → X-rays → Gamma rays
- D) Microwave → Radio → Visible → Infrared → Gamma rays
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Radio → Infrared → Visible → UV → X-rays → Gamma rays.**
Radio has the longest wavelengths (meters to kilometers), gamma rays
the shortest (smaller than atoms). This order goes from low-energy,
low-frequency light to high-energy, high-frequency light.
:::
```

**Check Yourself 3 — Why Multiple Wavelengths:**

```
::: {.callout-check-yourself title="Check Yourself 3 — Multiwavelength Astronomy"}
Why do astronomers observe the same object at different wavelengths?

- A) Different telescopes are in different locations
- B) Different wavelengths reveal different physical processes
- C) It's cheaper to use old telescopes
- D) Visible light is too faint
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Different wavelengths reveal different physical processes.**
Radio waves might show cold gas, infrared reveals dust, X-rays show
hot plasma. A single wavelength gives an incomplete picture — combining
observations across the spectrum reveals the full story.
:::
```

---

## Section 1.3: The Speed of Light

**Target length:** ~2 pages

### A Cosmic Speed Limit

**Key points:**

- Light travels at $c = 299,792,458$ m/s (≈ 300,000 km/s) in vacuum
- This is the fastest speed possible for any information or object
- Nothing with mass can reach $c$; only massless particles (like photons) travel at this speed

**Margin definition:**

- **Speed of light ($c$):** The universal speed limit; approximately 300,000 km/s or 186,000 miles/s

### Light-Travel Time

> Because light has finite speed, when we look at distant objects, we see them **as they were in the past**:
>
> - Sun: 8 minutes ago
> - Nearest star (Proxima Centauri): 4 years ago
> - Andromeda Galaxy: 2.5 million years ago
> - Distant galaxies: billions of years ago
>
> Looking out in space is looking back in time. The farther we see, the younger the universe appears.

**Light-year definition:**

```
::: {.callout-note title="What's a Light-Year?"}
A **light-year** is the distance light travels in one year:

$$1 \text{ light-year} = c \times (1 \text{ year}) \approx 9.5 \times 10^{12} \text{ km}$$

It's a unit of **distance**, not time! When astronomers say a star is
"10 light-years away," they mean light from that star takes 10 years
to reach us.
:::
```

### The More You Know: How We Measured $c$

```
::: {.callout-tip title="The More You Know: Measuring the Speed of Light" collapse="true"}
The first successful measurement of light's speed came from astronomy!
In 1676, Danish astronomer Ole Rømer noticed that Jupiter's moons
seemed to orbit faster when Earth was closer to Jupiter and slower
when farther away. He realized this was because light took more time
to reach Earth across the larger distance.

From his observations, Rømer calculated $c \approx 220,000$ km/s —
not bad for the 1670s! Modern measurements give exactly
$c = 299,792,458$ m/s, now used to *define* the meter.
:::
```

**Check Yourself 4:**

```
::: {.callout-check-yourself title="Check Yourself 4 — Light Travel Time"}
When we observe the Andromeda Galaxy (2.5 million light-years away),
we see it as it was:

- A) Right now, in real time
- B) 2.5 years ago
- C) 2.5 million years ago
- D) Billions of years ago
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) 2.5 million years ago.** Light from Andromeda takes 2.5 million
years to reach us. We're seeing Andromeda as it existed 2.5 million
years in the past. Looking at distant objects is literally looking
back in time.
:::
```

---

# PART 2: WHY IS THE SKY BLUE? (~25% of reading)

## Section 2.1: Deep Dive — Rayleigh Scattering

**Target length:** ~4 pages

### The Question

> On a clear day, the sky is blue. At sunset, it turns orange and red. Why? And what does this have to do with astronomy?

### 🔍 Spot the Assumption First

```
::: {.callout-note title="🔍 Spot the Assumption" collapse="false"}
You might assume:
- **The sky has an inherent color** (like paint)
- **Sunlight is already colored** when it enters the atmosphere
- **Blue and red are different kinds of light** that behave identically

Which of these is wrong? (Hint: all of them, but especially the last one.)
:::
```

### Sunlight Is All Colors

> First, the setup: sunlight is **white light** — a mix of all visible wavelengths. When a prism spreads sunlight into a rainbow, it reveals the full spectrum: red, orange, yellow, green, blue, violet.
>
> The key question: if sunlight contains all colors equally, why does the sky favor blue?

### The Key Physics: Wavelength-Dependent Scattering

> When light encounters particles much smaller than its wavelength, something interesting happens: the light gets **scattered** — redirected in random directions. But not all wavelengths scatter equally.

**The Rayleigh Scattering Law:**

```
::: {.callout-important title="Rayleigh Scattering"}
When light interacts with particles much smaller than its wavelength
(like air molecules), the amount of scattering depends on wavelength:

$$\text{Scattering} \propto \frac{1}{\lambda^4}$$

**Shorter wavelengths scatter MUCH more than longer wavelengths.**
:::
```

### What Does This Mean?

> Let's compare blue light ($\lambda \approx 450$ nm) and red light ($\lambda \approx 700$ nm):
>
> $$\frac{\text{Blue scattering}}{\text{Red scattering}} = \left(\frac{700}{450}\right)^4 \approx \left(1.56\right)^4 \approx 5.9$$
>
> Blue light scatters about **6 times more** than red light! This is why the sky is blue — blue photons get scattered all over the sky, while red photons mostly travel straight through.

**But why not violet? (common misconception):**

```
::: {.callout-tip title="The Sky Isn't Violet (Even Though Violet Scatters More)" collapse="true"}
Violet light *does* scatter strongly. But the sky doesn't look violet because:

1. The Sun emits less violet than green and blue.
2. Some of the shortest-wavelength light is absorbed in the atmosphere.
3. Human eyes are less sensitive to violet than to blue/green.

The result is a sky that looks blue to us, not violet.
:::
```

**Figure placeholder:**

```
{{< fig rayleigh-scattering-sky >}}

FIGURE: Rayleigh Scattering Explains the Blue Sky
DESCRIPTION: Show sunlight entering Earth's atmosphere:
- White light from the Sun (all colors)
- Blue photons being scattered in many directions by air molecules
- Red/yellow photons passing through with less scattering
- Observer on ground sees blue scattered from all directions
- Direct Sun path shows mostly red/yellow getting through
ALT TEXT: Blue light scatters more than red as sunlight passes through
air, filling the sky with scattered blue while red passes through.
```

### Why Sunsets Are Red and Orange

> At sunset, sunlight travels through **much more atmosphere** to reach your eyes. The blue light has been scattered away so many times that very little remains — you see what's left: the reds and oranges that weren't scattered.
>
> The same physics, different geometry: at noon, you're looking at scattered blue from a short path through the atmosphere. At sunset, the direct sunlight has lost most of its blue.

**Figure placeholder:**

```
{{< fig sunset-scattering >}}

FIGURE: Why Sunsets Are Red
DESCRIPTION: Compare midday vs sunset geometry:
- Midday: short path through atmosphere, plenty of blue scattered
- Sunset: long path through atmosphere, blue scattered away, red remains
- Show the much longer atmospheric path at sunset
ALT TEXT: At sunset, sunlight travels through more atmosphere; blue is
scattered away, leaving red and orange to reach the observer.
```

### Check Yourself 5:

```
::: {.callout-check-yourself title="Check Yourself 5 — Scattering"}
Blue light scatters more than red light because:

- A) Blue light is faster than red light
- B) Shorter wavelengths scatter more in Rayleigh scattering ($\propto 1/\lambda^4$)
- C) Air molecules are blue
- D) The Sun emits more blue light
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Shorter wavelengths scatter more.** Rayleigh scattering goes as
$1/\lambda^4$ — the fourth power makes a huge difference. Blue light
(shorter wavelength) scatters about 6× more than red light (longer
wavelength).
:::
```

### Check Yourself 6 — Misconception Poll:

```
::: {.callout-check-yourself title="Check Yourself 6 — Sunsets"}
Sunsets appear red because:

- A) The Sun turns red as it sets
- B) The atmosphere filters out red light, leaving blue
- C) Blue light has been scattered away on the long path through atmosphere
- D) Dust particles block the blue
:::

::: {.callout-tip title="Solution" collapse="true"}
**C) Blue light has been scattered away.** At sunset, sunlight travels
through much more atmosphere. After all that scattering, the blue is
gone — redirected in other directions. What remains is the less-scattered
red and orange, giving sunsets their characteristic colors.

Note: dust and aerosols can **enhance** reds and oranges, but the baseline
reason sunsets redden is the long path through the atmosphere plus
wavelength-dependent scattering.
:::
```

---

## Section 2.2: Deep Dive — Why Are Lunar Eclipses Red?

**Target length:** ~3 pages

### The Blood Moon Puzzle

> During a total lunar eclipse, the Moon doesn't go dark — it turns a deep red, sometimes called a "blood moon." Why?

### Predict First

```
::: {.callout-note title="🤔 Predict First"}
During a total lunar eclipse, the Moon is in Earth's shadow.
So why doesn't it go completely dark?

Hint: Apply what you just learned about Rayleigh scattering...
:::
```

### The Answer: Earth's Atmosphere as a Lens and Filter

> Here's what happens during a total lunar eclipse:
>
> 1. The Moon enters Earth's shadow — no direct sunlight reaches it
> 2. But sunlight passing through Earth's atmosphere **bends** toward the Moon
> 3. As it passes through the atmosphere, **blue light scatters away** (Rayleigh!)
> 4. Only the **red light** makes it through and reaches the Moon
> 5. The Moon reflects this reddish light back to us
>
> It's the same physics as a sunset, but projected onto the Moon!

**Physical explanation:**

> Earth's atmosphere acts like a lens, bending sunlight around our planet. But it's also a filter: the same Rayleigh scattering that makes skies blue removes blue light from the transmitted beam. What reaches the Moon is essentially the light from every sunset on Earth, all focused together.

**Figure placeholder:**

```
{{< fig lunar-eclipse-red >}}

FIGURE: Why Lunar Eclipses Are Red
DESCRIPTION: Show Earth blocking direct sunlight to the Moon:
- Sun on left, Earth in middle, Moon on right (in shadow)
- Earth's atmosphere bending light around the edges
- Blue light scattered away, red transmitted through atmosphere
- Red light reaching the Moon
- Label showing this is "sunset/sunrise light" bent toward Moon
ALT TEXT: During a lunar eclipse, Earth's atmosphere bends sunlight
around the planet; blue scatters away, and only red reaches the Moon.
```

### The Cosmic Connection

> This isn't just pretty — it's useful! The same principle applies to **exoplanet atmospheres**. When a planet transits (passes in front of) its host star, some starlight filters through the planet's atmosphere. By measuring which wavelengths are absorbed or scattered, astronomers can detect what gases are present.
>
> If an exoplanet has oxygen, water vapor, or methane in its atmosphere, we can detect it — using the same physics that turns our Moon red during an eclipse.

**"The More You Know" callout:**

```
::: {.callout-tip title="The More You Know: Exoplanet Atmospheres" collapse="true"}
Astronomers can detect gases in some exoplanet atmospheres by the same
basic trick you just used for lunar eclipses: **light filters through a
planet’s atmosphere**, and different wavelengths are absorbed or scattered
by different molecules.

This is how we might someday detect signs of life on distant worlds:
by looking for atmospheric signatures (like oxygen + methane together)
that would be hard to explain without biology.
:::
```

### Check Yourself 7:

```
::: {.callout-check-yourself title="Check Yourself 7 — Blood Moon"}
During a total lunar eclipse, the Moon appears red because:

- A) The Moon reflects Mars's light
- B) Earth's atmosphere scatters blue away, letting red sunlight reach the Moon
- C) The Moon's surface is actually red
- D) The Sun becomes cooler during eclipses
:::

::: {.callout-tip title="Solution" collapse="true"}
**B) Earth's atmosphere scatters blue away.** Sunlight passing through
Earth's atmosphere has its blue light scattered out (Rayleigh scattering),
leaving red. This reddened light bends around Earth and illuminates the
Moon — like projecting every sunset on Earth onto the lunar surface.
:::
```

---

# PART 3: LIGHT INTENSITY AND DISTANCE (~15% of reading)

## Section 3.1: The Inverse-Square Law for Light

**Target length:** ~2 pages

### Another Inverse-Square Law!

> In Lecture 6, we learned that gravity follows an inverse-square law: $F \propto 1/r^2$. It turns out light intensity does too — for the same fundamental reason.

### The Law

```
::: {.callout-important title="Inverse-Square Law for Light Intensity"}
The **intensity** (received power per unit area — astronomers often call this **flux** or **apparent brightness**) of light from a source
decreases with distance squared:

$$I \propto \frac{1}{r^2}$$

Double your distance from a light source → receive 1/4 the intensity.
:::
```

### Why?

> The explanation is geometric: light spreads out in all directions from a source. At distance $r$, the light is spread over a sphere of surface area $4\pi r^2$. The same total light spread over a larger area means less light per unit area.
>
> This is the same "spreading over a sphere" argument we used for gravity in L6!

**Figure placeholder:**

```
{{< fig light-inverse-square >}}

FIGURE: Light Spreads Over Larger Spheres
DESCRIPTION: Show a light source with concentric spheres:
- At radius r: light spread over area 4πr²
- At radius 2r: same light spread over area 4π(2r)² = 16πr²
- At radius 3r: spread over 36πr²
- Show intensity squares at each distance, with 1 square at r,
  1/4 intensity at 2r, 1/9 at 3r
ALT TEXT: Light from a source spreads over ever-larger spheres; at twice
the distance, the same light covers 4× the area, so intensity is 1/4.
```

### Astronomical Implications

> The inverse-square law is why distant stars appear dim even if they're intrinsically very luminous. A star with the same luminosity as the Sun but 10 times farther away appears **100 times fainter**.
>
> This also means that if we know a star's true luminosity and measure its flux (apparent brightness), we can calculate its distance. We'll return to this idea when we discuss "standard candles" and the cosmic distance ladder.

### Check Yourself 8:

```
::: {.callout-check-yourself title="Check Yourself 8 — Distance and Brightness"}
A star appears 16 times fainter than an identical star nearby.
How much farther away is the faint star?

- A) 4× farther
- B) 16× farther
- C) 8× farther
- D) 2× farther
:::

::: {.callout-tip title="Solution" collapse="true"}
**A) 4× farther.** By the inverse-square law, intensity $\propto 1/r^2$.
If intensity is 1/16, then $1/r^2 = 1/16$, so $r^2 = 16$ and $r = 4$.
The faint star is 4 times more distant.
:::
```

---

## Section 3.2: Light as Information — The Throughline

**Target length:** ~1.5 pages

### What We've Learned

> Let's step back and see the big picture:
>
> 1. **Light is an electromagnetic wave** with wavelength and frequency related by $c = \lambda f$
> 2. **The EM spectrum spans radio to gamma rays** — each region reveals different physics
> 3. **Wavelength affects how light interacts with matter** — scattering depends on $1/\lambda^4$
> 4. **Light intensity follows the inverse-square law** — distance affects brightness predictably
>
> But we haven't yet answered the most important question: **How do we read temperature from light?**

### Preview of Lecture 8

> Everything with temperature glows. Not just stars — everything. Your body emits infrared light. A stovetop burner glows red, then orange as it heats up. The Sun glows yellow-white at 5,500 K.
>
> The key insight: **hotter objects emit shorter-wavelength light**. There's a precise relationship between temperature and the peak wavelength of emission. That's what L8 is about.

**Transition callout:**

```
::: {.callout-note title="Coming Up: Temperature Written in Light"}
**Lecture 7 (today):** Light carries information — wavelength matters
because different wavelengths interact differently with matter.

**Lecture 8 (next):** Temperature writes its signature in wavelength.
By measuring the spectrum of emitted light, we can read an object's
temperature — even from billions of kilometers away.

**Together:** Motion reveals mass (L5-L6). Light reveals temperature
(L7-L8). Spectral lines reveal composition and motion (L9).
:::
```

---

# CLOSING ELEMENTS

## Summary Box

```
::: {.callout-important title="Key Takeaways from Lecture 7"}
1. **Light is an electromagnetic wave.** Wavelength ($\lambda$) and
   frequency ($f$) are related by $c = \lambda f$, where $c = 3 \times 10^8$ m/s.

2. **The EM spectrum spans radio → gamma rays.** Visible light is a tiny
   sliver. Different wavelengths reveal different physics — astronomers
   observe across the spectrum.

3. **Rayleigh scattering:** Small particles scatter short wavelengths
   more ($\propto 1/\lambda^4$). This is why the sky is blue and sunsets
   are red.

4. **Lunar eclipses are red** because Earth's atmosphere scatters away
   blue light, leaving only red to reach the Moon — same physics as sunsets.

5. **Light intensity follows the inverse-square law:** $I \propto 1/r^2$.
   Double the distance → 1/4 the brightness.

6. **Light is the astronomer's primary tool.** We extract temperature,
   composition, motion, and distance from light — without ever leaving Earth.
:::
```

---

## Practice Problems

### Core (do these first)

1. **Wave equation:** Green light has a wavelength of about 550 nm. Calculate its frequency. (Remember: $c = 3 \times 10^8$ m/s, and 1 nm = $10^{-9}$ m)

2. **Spectrum ordering:** Rank these from longest to shortest wavelength: X-rays, visible light, radio waves, infrared, ultraviolet.

3. **Rayleigh scattering:** Why is the sky blue at noon but red/orange at sunset? Explain using Rayleigh scattering.

4. **Inverse-square law:** A star is observed to be 25 times fainter than an identical star nearby. How many times farther away is it?

5. **Light travel time:** The star Vega is about 25 light-years away. When you look at Vega tonight, how long ago did that light leave the star?

### Challenge

6. **Scattering ratio:** Calculate how many times more a 400 nm (violet) photon scatters compared to a 600 nm (orange) photon, using the Rayleigh scattering law $\propto 1/\lambda^4$.

7. **Lunar eclipse colors:** During some lunar eclipses, the Moon appears darker red than others. Suggest what factor might affect how red the Moon appears. (Hint: think about what else might be in Earth's atmosphere.)

8. **Distance from brightness:** A supernova in a distant galaxy appears 10,000 times fainter than an identical supernova in a nearby galaxy. If the nearby supernova is 10 Mpc away, how far is the distant galaxy?

9. **Conceptual:** Mars appears red from Earth. Is this because of Rayleigh scattering in Mars's atmosphere, or something else? Explain.

10. **Connection to L8:** If hotter objects emit shorter-wavelength light (preview of L8), predict: would a red star or a blue star have the higher surface temperature?

---

## Glossary

| Term | Definition |
|------|------------|
| **Electromagnetic wave** | Self-propagating oscillation of electric and magnetic fields; light is an EM wave |
| **Wavelength ($\lambda$)** | Distance between consecutive wave crests |
| **Frequency ($f$)** | Number of wave crests passing a point per second (Hz) |
| **Speed of light ($c$)** | The speed of electromagnetic waves in vacuum: $3 \times 10^8$ m/s |
| **Electromagnetic spectrum** | The full range of EM wavelengths, from radio to gamma rays |
| **Rayleigh scattering** | Scattering of light by particles smaller than the wavelength; scattering $\propto 1/\lambda^4$ |
| **Light-year** | The distance light travels in one year; ~9.5 trillion km |
| **Inverse-square law** | Intensity decreases with distance squared: $I \propto 1/r^2$ |
| **Intensity** | Power received per unit area (brightness) |
| **Photon** | A particle of light; the quantum of electromagnetic radiation |

---

## Figure Checklist

| Figure ID | Description | Status |
|-----------|-------------|--------|
| `proxima-centauri-info` | All we know about a star from light alone | ☐ |
| `electromagnetic-wave` | Simple wave with wavelength labeled | ☐ |
| `em-spectrum-full` | Full spectrum radio → gamma with visible expanded | ☐ |
| `multiwavelength-crab` | Crab Nebula at different wavelengths | ☐ |
| `rayleigh-scattering-sky` | Why the sky is blue | ☐ |
| `sunset-scattering` | Why sunsets are red (path length geometry) | ☐ |
| `lunar-eclipse-red` | Why lunar eclipses are red | ☐ |
| `light-inverse-square` | Light spreading over spheres | ☐ |

---

*End of L7 Outline (v1)*
