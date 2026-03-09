# Module 2: Stars & Stellar Evolution — Design Document

**Course:** ASTR 101 — Principles of Astronomy (Spring 2026)
**Instructor:** Dr. Anna Rosen
**Weeks:** 8–12 (Mar 9 – Apr 10) + Review/Exam Week 13 (Apr 13–17)
**Lectures:** 8 (L11–L18) | Mon & Wed new content
**Friday Activities:** 3 (Weeks 8, 9, 12)
**Module 2 Exam:** Friday, April 17
**Status:** DRAFT — iterating

---

## Narrative Arc: "The Life Story of a Star"

Module 1 gave students the *toolkit* — sky navigation, gravity, light. Module 2 puts
that toolkit to work on the most fundamental objects in the universe.

The arc follows a biographical structure: start with the star we know best (the Sun),
learn to read any star's vital signs, then trace the full life cycle from interstellar
cradle to compact remnant.

**Throughline question:** *"How do we know the life story of something that lives
billions of years?"*

**Capstone insight:** Mass is destiny — a star's birth mass determines its luminosity,
lifetime, death, and remnant.

---

## Primary SLOs Addressed

| SLO | Description | Key Lectures |
|-----|-------------|--------------|
| **SLO 5** | Connect stellar properties to physics — relate mass, color, luminosity, lifetime; trace evolution from birth to remnant | L11–L18 (all) |
| **SLO 4** | Reason quantitatively across scales — units, scientific notation, proportional reasoning | L12, L14, L18 |
| **SLO 1** | Interpret light as information — use spectra to infer stellar properties | L11, L13 |
| **SLO 8** | Evaluate astronomical claims critically | L15 (IR reveals hidden nurseries), L18 (black hole "images") |

---

## Observable → Model → Inference Map

| Observable | Model / Physical Law | Inference |
|-----------|---------------------|-----------|
| Apparent brightness + parallax angle | Inverse-square law, trigonometry | Distance, luminosity |
| Color (spectrum) | Wien's law, spectral classification | Surface temperature |
| Binary orbit period + separation | Kepler's 3rd law (Newton's form) | Stellar masses |
| Position on H-R diagram | Stefan-Boltzmann, stellar models | Evolutionary stage, radius |
| Doppler shifts in binary spectra | Orbital mechanics | Radial velocities → mass ratio |
| X-ray emission near compact object | Accretion physics | Black hole / neutron star presence |
| Gravitational wave signal | General relativity | Merger masses, distance |

---

## Prerequisites from Module 1

Students entering Module 2 should be comfortable with:

- Light as EM radiation; wavelength ↔ energy ↔ color (L7)
- Blackbody radiation and Wien's law (L8)
- Spectral lines — emission, absorption, fingerprints (L9)
- Doppler effect — redshift / blueshift → radial velocity (L9)
- Kepler's laws and Newton's gravity (L5, L6)
- Inverse-square law for light (L7)
- Scientific notation, unit tracking, proportional reasoning (L2)

---

## Lecture-by-Lecture Outline

### L11 — Our Star: The Sun

**Date:** Monday, March 9
**Big Idea:** The Sun is a physics laboratory 8 light-minutes away — everything we
learn here applies to every star.

**Learning Objectives (Bloom's):**

1. Describe the layered structure of the Sun (core through corona) and the role of each layer (Understand)
2. Explain conceptually how the proton-proton chain converts hydrogen to helium and releases energy (Understand)
3. Distinguish radiative and convective energy transport and identify where each dominates in the Sun (Understand)
4. Identify solar activity features (sunspots, flares, CMEs) and connect them to magnetic field behavior (Apply)
5. Explain why the solar neutrino problem was important and how it was resolved (Evaluate)

**Content Outline:**

1. **Opening hook:** The Sun is a *typical* star — understanding it gives us a template for all stars
2. **Solar structure:** Core → radiative zone → convective zone → photosphere → chromosphere → corona
   - Why the corona is hotter than the surface (open question — briefly)
3. **Energy generation:** Proton-proton chain (conceptual: 4 H → 1 He + energy + neutrinos)
   - $E = mc^2$ — mass deficit → energy; ~4 million tons/second converted
   - Why fusion requires extreme temperature and pressure (Coulomb barrier)
4. **Energy transport:** Radiation (inner) vs. convection (outer); granulation as visible convection
5. **Solar activity:**
   - Sunspots: cooler regions, magnetic field emergence, ~11-year cycle
   - Solar flares and coronal mass ejections: magnetic reconnection
   - Solar wind: charged particles streaming outward → aurorae, space weather
6. **The solar neutrino problem** (brief): predicted vs. observed neutrinos → neutrino oscillations → confirmed solar model

**OMI Application:** Observable = sunspot count, brightness variations. Model = magnetic dynamo, nuclear physics. Inference = interior rotation rate, energy generation mechanism.

**Key Misconceptions:**
- "The Sun burns fuel like a fire" → No: nuclear fusion, not chemical combustion
- "The Sun is a ball of gas" → Technically plasma (ionized gas with collective magnetic behavior)
- "The Sun will explode as a supernova" → No: too low mass (preview of L17)

**Connections:**
- Back to Module 1: blackbody spectrum of photosphere (L8), absorption lines in solar spectrum (L9)
- Forward: solar mass and luminosity become reference points for all stellar measurements (L12–L14)

**OpenStax Reference:** Chapter 15 (The Sun: A Garden-Variety Star)

---

### L12 — Measuring the Stars

**Date:** Wednesday, March 11
**Big Idea:** We can't visit stars, but parallax + brightness give us the two most
fundamental numbers: distance and luminosity.

**Learning Objectives (Bloom's):**

1. Explain stellar parallax and calculate distance from parallax angle using $d = 1/p$ (Apply)
2. Distinguish apparent brightness, apparent magnitude, and absolute magnitude (Understand)
3. Apply the inverse-square law to relate apparent brightness, luminosity, and distance (Apply)
4. Describe the concept of a "distance ladder" and identify parallax as its first rung (Understand)
5. Explain how the Gaia mission revolutionized stellar distance measurements (Understand)

**Content Outline:**

1. **Opening hook:** "How far is that star?" — the most fundamental question, and surprisingly hard to answer
2. **Stellar parallax:**
   - Geometry: Earth's orbit → baseline; nearby stars shift against distant background
   - The parsec: distance at which parallax angle = 1 arcsecond ($d_{\rm pc} = 1/p''$)
   - Worked example: Proxima Centauri ($p = 0.768''$ → $d = 1.30$ pc = 4.24 ly)
   - Limitations: ground-based ~0.01" precision; Gaia → microarcseconds (billions of stars)
3. **Brightness and luminosity:**
   - Apparent brightness: what we *measure* (flux at Earth)
   - Luminosity: intrinsic power output (what the star *actually* emits)
   - Inverse-square law: $b = L / 4\pi d^2$
   - Worked example: Two stars with same apparent brightness but different distances
4. **Magnitude system** (conceptual):
   - Apparent magnitude ($m$): brighter = smaller number (historical, Hipparchus)
   - Absolute magnitude ($M$): apparent magnitude at standard distance (10 pc)
   - Distance modulus (conceptual): $m - M$ tells you distance
5. **The distance ladder** (preview):
   - Rung 1: Parallax (direct geometry, ~few thousand pc with Gaia)
   - Rung 2: Standard candles (coming in L14, L17, and Module 3)
   - Why we need multiple methods: each has a limited range

**OMI Application:** Observable = parallax angle → distance. Then: apparent brightness + distance → luminosity.

**Key Misconceptions:**
- "Brighter-looking stars are closer" → Not necessarily: some are intrinsically very luminous
- "Magnitudes are intuitive" → They're backwards and logarithmic; emphasize the concept, not computation

**Key Calculations:**
- $d = 1/p$ (parsecs from arcseconds)
- $b = L / 4\pi d^2$ (inverse-square law)
- Ratio problems: "Star A is 4× farther than Star B but appears equally bright — how do their luminosities compare?"

**Demo:** Parallax Distance (existing Cosmic Playground demo)

**Connections:**
- Back to Module 1: inverse-square law (L7)
- Forward: distances enable the H-R diagram (L13) and mass measurements in binaries (L14)

**OpenStax Reference:** Chapters 17.1–17.2 (Analyzing Starlight), Chapter 19.1 (Celestial Distances)

---

### L13 — The H-R Diagram

**Date:** Monday, March 16
**Big Idea:** When you plot temperature vs. luminosity for thousands of stars, patterns
emerge that reveal the physics of stellar structure.

**Learning Objectives (Bloom's):**

1. List the spectral types in order (OBAFGKM) and associate each with a temperature range (Remember)
2. Construct and interpret an H-R diagram with temperature on the x-axis and luminosity on the y-axis (Apply)
3. Identify the main sequence, giant branch, supergiant region, and white dwarf region on the H-R diagram (Understand)
4. Use the Stefan-Boltzmann relation ($L \propto R^2 T^4$) to explain why giants are luminous despite being cool (Apply)
5. Explain why the main sequence is fundamentally a *mass sequence* (Understand)

**Content Outline:**

1. **Opening hook:** "Astronomy's most important graph" — one diagram that organizes all of stellar physics
2. **Spectral classification:**
   - OBAFGKM: temperature sequence from hot (O, ~30,000+ K) to cool (M, ~3,000 K)
   - Mnemonics (student favorites welcome)
   - Each type defined by which absorption lines dominate (hydrogen, metals, molecules)
3. **Building the H-R diagram:**
   - Axes: temperature (hot → cool, LEFT to RIGHT — note: reversed!) vs. luminosity (low → high)
   - Plotting thousands of stars → patterns emerge
   - Why it's sometimes plotted as spectral type vs. absolute magnitude (historical)
4. **Regions of the H-R diagram:**
   - **Main sequence:** ~90% of all stars; a diagonal band from hot/luminous (upper left) to cool/dim (lower right)
   - **Red giants / supergiants:** upper right — cool but very luminous (why? They're *enormous*)
   - **White dwarfs:** lower left — hot but very dim (why? They're *tiny*)
5. **The Stefan-Boltzmann connection:**
   - $L = 4\pi R^2 \sigma T^4$ → luminosity depends on BOTH size and temperature
   - Lines of constant radius on the H-R diagram → giants above, dwarfs below
   - Red giants: $T$ is low but $R$ is huge → $L$ is large
   - White dwarfs: $T$ is high but $R$ is tiny → $L$ is small
6. **The main sequence is a mass sequence:**
   - Upper left = massive, hot, luminous; lower right = low-mass, cool, dim
   - This is NOT a coincidence — more mass → more gravity → hotter core → more luminosity
   - Preview: mass determines everything (L14 will quantify this)

**OMI Application:** Observable = color + brightness for many stars. Model = Stefan-Boltzmann relation, spectral classification. Inference = temperature, luminosity class, approximate size.

**Key Misconceptions:**
- "Red stars are dim" → Red *giants* are among the most luminous stars (size matters!)
- "Stars move along the main sequence as they age" → No: the MS is a mass sequence at one snapshot in time. Stars move *off* the MS as they evolve (L16).
- "The H-R diagram temperature axis goes the normal way" → It's reversed; point this out explicitly.

**Proposed Demo:** H-R Diagram Explorer (new Cosmic Playground demo — interactive plot with real stellar data, radius contours, spectral type overlays)

**Connections:**
- Back: spectral lines (L9), blackbody radiation + Wien's law (L8), luminosity + distance (L12)
- Forward: mass-luminosity relation (L14), evolutionary tracks on the H-R diagram (L16)

**OpenStax Reference:** Chapter 18 (The Stars: A Celestial Census)

---

### L14 — Binary Stars & Stellar Masses

**Date:** Wednesday, March 18
**Big Idea:** Mass is the single most important property of a star — and the *only* way
to measure it directly is through binary systems and gravity.

**Learning Objectives (Bloom's):**

1. Identify three types of binary star systems (visual, eclipsing, spectroscopic) and explain what each reveals (Understand)
2. Apply Newton's form of Kepler's 3rd law to calculate stellar masses from orbital data (Apply)
3. State the mass-luminosity relation and use it to predict a main-sequence star's luminosity from its mass (Apply)
4. Calculate approximate main-sequence lifetimes using the mass-lifetime relation (Apply)
5. Justify the statement "mass is destiny" using evidence from this and previous lectures (Evaluate)

**Content Outline:**

1. **Opening hook:** "You can't weigh a star — unless it has a dance partner."
2. **Why mass matters:**
   - Mass determines luminosity, temperature, lifetime, and death → "mass is destiny"
   - But how do you measure the mass of something light-years away?
3. **Binary star types:**
   - **Visual binaries:** Both stars resolved; track orbits over years/decades
   - **Eclipsing binaries:** Orbit edge-on; periodic dips in brightness → sizes and inclination
   - **Spectroscopic binaries:** Detected via Doppler shifts in spectra → radial velocity curves
   - Many systems are multiple types simultaneously
4. **Extracting masses:**
   - Newton's form of Kepler's 3rd law: $M_1 + M_2 = a^3 / P^2$ (solar units)
   - Worked example: a binary with known period and separation
   - Spectroscopic binaries: velocity amplitudes → mass ratio
5. **The mass-luminosity relation:**
   - Empirical: $L \propto M^{3.5}$ (approximately) for main-sequence stars
   - Consequence: a 10 M☉ star is ~3,000× more luminous than the Sun
6. **Main-sequence lifetimes:**
   - Lifetime $\propto$ fuel / burn rate $\propto M / L \propto M^{-2.5}$
   - The Sun: ~10 billion years. A 10 M☉ star: ~20 million years.
   - Massive stars "live fast and die young"

**OMI Application:** Observable = orbital period + velocity amplitudes (or angular separation). Model = Newtonian gravity / Kepler's 3rd law. Inference = stellar masses.

**Key Misconceptions:**
- "Heavier stars last longer because they have more fuel" → They burn fuel *much* faster
- "All star systems are single stars" → Most stars are in binary or multiple systems

**Key Calculations:**
- $M_1 + M_2 = a^3 / P^2$ (solar units)
- $L \propto M^{3.5}$ → ratio problems
- $t_{\rm MS} \propto M^{-2.5}$ → "How long does a 2 M☉ star live on the main sequence?"

**Demo:** Binary Orbits (existing Cosmic Playground demo)

**Connections:**
- Back: Kepler's 3rd law (L5), Newton's gravity (L6), Doppler effect (L9)
- Forward: mass-lifetime relation is the key to understanding stellar evolution (L16) and death (L17)

**OpenStax Reference:** Chapter 18.3 (Diameters of Stars), Chapter 17.3 (Using Spectra)

---

### L15 — From Gas to Stars

**Date:** Monday, March 23
**Big Idea:** Stars are born from the gravitational collapse of cold, dense clouds of
gas and dust — the same material enriched by previous generations of dying stars.

**Learning Objectives (Bloom's):**

1. Describe the components of the interstellar medium (gas, dust) and their observable signatures (Understand)
2. Distinguish emission, reflection, and dark nebulae and explain what produces each (Understand)
3. Explain interstellar extinction and reddening and why infrared astronomy is essential for studying star formation (Understand)
4. Describe the Jeans criterion conceptually: a cloud must be sufficiently massive and cold for gravity to overcome pressure (Understand)
5. Outline the stages of star formation from molecular cloud to main-sequence star (Apply)
6. Explain why protostars are surrounded by disks that can form planets (Understand)

**Content Outline:**

1. **Opening hook / narrative bridge:** "We've been studying stars that already exist. Where do they come from? The answer is hiding in the dark lanes you can see cutting across the Milky Way."

2. **The interstellar medium (ISM)** (~15 min):
   - Gas (~99%) + dust (~1%) between stars; ~1% of Milky Way mass
   - **Emission nebulae** (H II regions): hot gas ionized by nearby O/B stars → glows (e.g., Orion Nebula)
   - **Reflection nebulae:** starlight scattered by dust → blue (like daytime sky)
   - **Dark nebulae:** cold, dense — block background starlight (e.g., Horsehead Nebula)
   - Interstellar extinction and reddening: dust scatters/absorbs blue light more than red → stars appear dimmer and redder

3. **Star formation** (~30 min):
   - Giant molecular clouds (GMCs): cold (~10 K), dense, massive (~10⁵ M☉)
   - **Jeans criterion** (conceptual): gravity vs. thermal pressure; cloud must be massive enough and cold enough for gravity to win
   - Triggers: shock waves from supernovae, spiral arm compression, cloud-cloud collisions
   - Collapse sequence:
     1. Fragmentation: cloud breaks into smaller clumps
     2. Protostar: contracting core heats up (Kelvin-Helmholtz contraction)
     3. T Tauri phase: pre-main-sequence; strong stellar winds, jets
     4. Main sequence: core temperature reaches ~15 million K → hydrogen fusion ignites → hydrostatic equilibrium
   - Protoplanetary disks: conservation of angular momentum → flattened disk → planets form as byproduct
   - Infrared astronomy: dust is opaque at visible wavelengths but transparent in IR → Spitzer, JWST reveal hidden stellar nurseries

**OMI Application:** Observable = infrared emission from warm dust, molecular line emission. Model = thermal radiation from collapsing cloud, Jeans criterion. Inference = protostar properties, formation rate, cloud conditions.

**Key Misconceptions:**
- "Space is empty between stars" → It's not — it's filled with gas and dust
- "Stars form from nothing" → They form from the recycled debris of previous stars
- "Star formation is rare" → It's ongoing; the Milky Way forms ~1–3 M☉ of new stars per year

**Connections:**
- Back: blackbody radiation and Wien's law (L8) applied to cool clouds; gravity (L6)
- Forward: once on the main sequence, evolution begins (L16); stellar death enriches the ISM for the next generation (L17)
- Module 3 forward: ISM recycling and chemical enrichment matter for galaxy evolution

**OpenStax Reference:** Chapter 20 (Between the Stars), Chapter 21 (The Birth of Stars)

---

### L16 — Stellar Evolution: Life on the Main Sequence and Beyond

**Date:** Wednesday, March 25
**Big Idea:** A star's life is a battle between gravity pulling in and pressure pushing
out. When the fuel runs out, gravity wins — and what happens next depends on mass.

**Learning Objectives (Bloom's):**

1. Explain hydrostatic equilibrium as the balance between gravity and pressure that defines a stable star (Understand)
2. Calculate approximate main-sequence lifetimes and explain why massive stars evolve faster (Apply)
3. Describe what happens when a star exhausts its core hydrogen: shell burning, expansion to red giant (Understand)
4. Distinguish the post-main-sequence evolution of low-mass vs. high-mass stars at a conceptual level (Analyze)
5. Trace a star's evolutionary path on the H-R diagram from main sequence through red giant (Apply)

**Content Outline:**

1. **Opening hook:** "Stars don't live forever — and the clock is set at birth by mass."
2. **Hydrostatic equilibrium:**
   - The fundamental balance: gravity (inward) vs. gas pressure (outward, powered by fusion)
   - Thermostat: if core contracts → heats up → fusion rate increases → restores balance
   - This self-regulation is why main-sequence stars are stable for millions to billions of years
3. **Main-sequence lifetimes (revisit from L14, deepen):**
   - $t_{\rm MS} \propto M / L \propto M^{-2.5}$
   - Reference table: 0.5 M☉ → ~50 Gyr; 1 M☉ → ~10 Gyr; 10 M☉ → ~20 Myr; 50 M☉ → ~few Myr
   - "The universe is ~13.8 Gyr old — all stars < ~0.8 M☉ ever born are *still on the main sequence*"
4. **Post-main-sequence evolution:**
   - Core hydrogen exhaustion → inert helium core
   - Core contracts (no fusion → no outward pressure) → heats up
   - Hydrogen shell burning ignites around core → enormous luminosity → outer layers expand
   - Star becomes a **red giant**: cool surface, huge radius, high luminosity
   - Evolution on the H-R diagram: star moves off the main sequence to the upper right
5. **Low-mass stars (< ~2 M☉):**
   - Degenerate helium core → **helium flash** (sudden, brief ignition)
   - Horizontal branch: stable helium core burning
   - Asymptotic giant branch (AGB): second red giant phase
6. **High-mass stars:**
   - Non-degenerate core → smooth helium ignition, then carbon burning, etc.
   - Preview: the onion-shell structure (detailed in L17)
7. **Key point — the H-R diagram as a map of stellar lives:**
   - The main sequence is where stars *spend most of their time*
   - Giants, supergiants = later evolutionary stages (not different "kinds" of stars)
   - Stellar evolution = motion on the H-R diagram

**OMI Application:** Observable = star's current position on H-R diagram. Model = nuclear physics + stellar structure (hydrostatic equilibrium). Inference = evolutionary stage, approximate age.

**Key Misconceptions:**
- "Stars move along the main sequence as they age" → They move *off* it
- "Red giants are a different type of star" → They're evolved main-sequence stars
- "The Sun will become a red giant soon" → ~5 billion years from now

**Proposed Demo:** Stellar Lifecycle (new Cosmic Playground demo — animate evolutionary tracks on H-R diagram for different initial masses)

**Connections:**
- Back: H-R diagram (L13), mass-luminosity and mass-lifetime relations (L14)
- Forward: what happens after the red giant phase → stellar death (L17)

**OpenStax Reference:** Chapter 22 (Stars from Adolescence to Old Age)

---

*— SPRING BREAK (March 27 – April 5) —*

---

### L17 — How Stars Die

**Date:** Monday, April 6
**Big Idea:** A star's mass at birth determines its fate — a gentle death that creates
cosmic art, or a catastrophic explosion that scatters the building blocks of life.

**Learning Objectives (Bloom's):**

1. Describe the end stages of low-mass stars: planetary nebula → white dwarf (Understand)
2. Explain electron degeneracy pressure and the Chandrasekhar limit (1.4 M☉) (Understand)
3. Describe the onion-shell structure of a massive star's core and explain why iron is the end of the line (Understand)
4. Explain the mechanism of a core-collapse supernova at a conceptual level (Understand)
5. Distinguish Type Ia (thermonuclear) and Type II (core-collapse) supernovae by mechanism and use (Analyze)
6. Explain the origin of elements heavier than iron and connect stellar death to chemical enrichment (Evaluate)

**Content Outline:**

1. **Opening hook:** "Every atom of carbon in your body was made inside a star. Every atom of iron was forged in a star's final moments."

2. **Low-mass stellar death** (stars $\lesssim 8$ M☉, ~20 min):
   - AGB phase: thermal pulses, mass loss via stellar winds
   - **Planetary nebulae:** ejected outer layers illuminated by hot core — beautiful, brief (~10,000 yr)
   - **White dwarfs:** exposed core; no fusion; supported by electron degeneracy pressure
     - What is degeneracy pressure? Quantum mechanics: electrons resist compression (Pauli exclusion)
     - Properties: ~Earth-sized, ~0.6 M☉, incredibly dense (~10⁶ g/cm³)
   - **Chandrasekhar limit (1.4 M☉):** maximum WD mass; above this, electron degeneracy fails
   - **Type Ia supernovae:** WD in binary accretes matter → exceeds Chandrasekhar limit → thermonuclear detonation
     - Importance: standardizable candles → used to measure cosmic distances (Module 3 connection!)

3. **High-mass stellar death** (stars $\gtrsim 8$ M☉, ~20 min):
   - **Onion-shell structure:** H → He → C → O → Ne → Si → Fe in concentric shells
   - **Iron catastrophe:** iron fusion *absorbs* energy (binding energy peak) → core loses pressure support
   - **Core collapse:** core implodes in <1 second → bounces off nuclear density → shock wave + neutrino burst
   - **Core-collapse supernova (Type II):** envelope blown off; ~10⁴⁴ J released (briefly outshines entire galaxy)
   - **Nucleosynthesis:** elements heavier than iron created in the explosion (r-process: rapid neutron capture)
   - "We are star stuff" — chemical enrichment of the ISM → next generation of stars and planets

4. **Summary comparison table:**

   | Property | Low-mass death | High-mass death |
   |----------|---------------|-----------------|
   | Progenitor mass | < ~8 M☉ | > ~8 M☉ |
   | End stage | Planetary nebula + WD | Core-collapse SN |
   | Remnant | White dwarf | Neutron star or black hole |
   | Key physics | Electron degeneracy | Nuclear physics, neutron degeneracy |
   | Element production | C, N, O (dredge-up) | All elements up to and beyond Fe |

**OMI Application:** Observable = supernova light curves, nebular spectra, remnant properties. Model = nuclear physics, degeneracy pressure, Chandrasekhar limit. Inference = progenitor mass, explosion mechanism, element yields.

**Key Misconceptions:**
- "All stars explode as supernovae" → Only massive stars (or WDs in special binaries)
- "Planetary nebulae have something to do with planets" → Historical misnomer; they looked round in early telescopes
- "The Sun will become a black hole" → Way too low mass; it will become a white dwarf

**Connections:**
- Back: mass-lifetime relation (L14, L16), stellar evolution (L16)
- Forward: remnants — neutron stars and black holes (L18)
- Module 3 forward: Type Ia SNe as standard candles for measuring cosmic expansion (L22)

**OpenStax Reference:** Chapter 23 (The Death of Stars)

---

### L18 — Neutron Stars & Black Holes

**Date:** Wednesday, April 8
**Big Idea:** When gravity wins completely, the remnants are the most extreme objects in
the universe — and they push our understanding of physics to its limits.

**Learning Objectives (Bloom's):**

1. Describe neutron star properties (size, density, magnetic field) and explain what supports them against gravity (Understand)
2. Explain how pulsars work and why their discovery was significant (Understand)
3. Calculate the Schwarzschild radius for a given mass and explain the concept of an event horizon (Apply)
4. Describe at least three lines of observational evidence for black holes (Understand)
5. Explain how gravitational waves are produced and detected, and what they reveal (Understand)
6. Articulate the "cosmic recycling" theme: stellar death enriches the ISM, enabling new star and planet formation (Evaluate)

**Content Outline:**

1. **Opening hook:** "What happens when even *atoms* can't withstand gravity?"

2. **Neutron stars** (~20 min):
   - Left behind after core-collapse supernova (from L17)
   - **Neutron degeneracy pressure:** neutrons resist compression (like electrons, but at higher density)
   - Properties: ~10 km radius, ~1.4–2 M☉, density of an atomic nucleus (~10¹⁴ g/cm³)
   - A teaspoon would weigh ~billion tons
   - **Pulsars:** rapidly rotating neutron stars with beamed radio emission
     - Lighthouse model: magnetic axis ≠ rotation axis → sweeping beam
     - Jocelyn Bell Burnell's discovery (1967) — initially called "LGM-1" (Little Green Men)
     - Millisecond pulsars: recycled, spun up by accretion
   - **Magnetars:** ultra-strong magnetic fields (~10¹⁵ G); occasional giant flares
   - TOV limit (~2–3 M☉): maximum neutron star mass; above this → black hole

3. **Black holes** (~20 min):
   - When neutron degeneracy fails → nothing stops collapse
   - **Schwarzschild radius:** $R_s = 2GM/c^2$
     - Worked example: $R_s$ for 10 M☉ → ~30 km
     - For the Sun (hypothetical): ~3 km
   - **Event horizon:** not a physical surface; the boundary where escape velocity = $c$
   - Nothing escapes — not light, not information (classically)
   - **Observational evidence:**
     1. X-ray binaries: matter from companion spirals in → accretion disk → heats to millions of K → X-rays
     2. Stellar orbits at galactic center: S-stars orbit Sgr A* → 4 million M☉ in tiny volume
     3. EHT images: M87* (2019) and Sgr A* (2022) — the "shadow" of the event horizon
     4. Gravitational waves: LIGO/Virgo detect spacetime ripples from BH–BH and NS–NS mergers
   - **Gravitational waves** (brief):
     - Predicted by Einstein (1916), detected 2015 (GW150914)
     - Two merging BHs → spacetime ripples → mirrors in LIGO shift by ~10⁻¹⁸ m
     - NS–NS merger (GW170817): gravitational waves + light → multi-messenger astronomy; confirmed r-process nucleosynthesis

4. **Coda — Cosmic recycling:**
   - Stellar death → enriched ISM → new stars and planets
   - The carbon in your body, the oxygen you breathe, the iron in your blood — all forged in stars and scattered by supernovae and neutron star mergers
   - Full circle: "We started Module 2 with the Sun — a middle-aged, ordinary star. Now you can trace the life of *any* star from birth to remnant."

**OMI Application:** Observable = X-ray emission, radio pulses, gravitational waves, EHT images. Model = general relativity, neutron degeneracy, accretion physics. Inference = compact object masses, spins, existence of event horizons.

**Key Misconceptions:**
- "Black holes suck everything in" → Gravity at distance is the same as any object of equal mass; orbits are stable
- "You'd be crushed at the event horizon" → For supermassive BHs, tidal forces at the horizon are gentle; for stellar-mass BHs, spaghettification occurs
- "The EHT photo shows the black hole itself" → It shows the shadow (silhouette) against the bright accretion disk
- "Nothing can escape a black hole" → Hawking radiation (theoretical, undetected) — brief mention only

**Connections:**
- Back: core-collapse mechanism (L17), Kepler's laws applied to extreme orbits (L5/L6), Doppler shifts (L9)
- Module 3 forward: supermassive BHs at galaxy centers (L19); gravitational lensing and dark matter (L21)

**OpenStax Reference:** Chapter 23.4–23.6 (Neutron Stars, Black Holes)

---

## Friday Activities

### Week 8 (Fri Mar 13) — Solar Detective

**Format:** Think-Pair-Share with real images
**Materials:** SDO/SOHO images (sunspots, prominences, coronal loops, CMEs)
**Activity:**
1. *Think:* Identify 3 features in a set of solar images; classify each
2. *Pair:* Compare identifications; resolve disagreements using L11 concepts
3. *Share:* Gallery walk — groups present one image with annotations
**Connection:** L11 content applied to real observational data

### Week 9 (Fri Mar 20) — H-R Diagram Lab

**Format:** Data-driven group activity with demo
**Materials:** Stellar data table (subset of Hipparcos/Gaia catalog: star name, spectral type, apparent magnitude, distance, calculated luminosity, temperature)
**Activity:**
1. Plot stars on provided H-R diagram grid (temperature vs. luminosity)
2. Identify: main sequence, red giants, white dwarfs
3. Use H-R Diagram Explorer demo to check and extend
4. Prediction: "If I tell you a star has spectral type G2 and luminosity 1 L☉, what can you infer?"
**Connection:** L12 (distances/luminosities) + L13 (H-R diagram)

### Week 12 (Fri Apr 10) — Stellar Graveyard

**Format:** Calculation-based group activity
**Materials:** Property cards for compact objects (WD, NS, BH)
**Activity:**
1. Calculate density: given mass and radius for each object type
2. Calculate escape velocity: $v_{\rm esc} = \sqrt{2GM/R}$ for each
3. Calculate Schwarzschild radius for given masses
4. "Could you survive?" questions: surface gravity, tidal forces
5. Synthesis: rank objects by density, size, escape velocity — what pattern emerges?
**Connection:** L17 (stellar death) + L18 (compact remnants)

---

## Proposed Cosmic Playground Demos (New)

| Demo | Priority | Lectures Served | Description |
|------|----------|----------------|-------------|
| **H-R Diagram Explorer** | HIGH | L13, L16, Fri W9 | Interactive T-L plot with real data, radius contours, spectral type bands, evolution tracks |
| **Stellar Lifecycle** | MEDIUM | L16, L17 | Animated evolution on H-R diagram; mass slider; shows path from ZAMS to remnant |
| **Compact Object Comparator** | LOW | L18, Fri W12 | Side-by-side size/density/gravity comparison; Earth, WD, NS, BH |

---

## Homework Mapping (Tentative)

| HW # | Due Date (Mon) | Covers | Topics |
|------|----------------|--------|--------|
| HW 6 | Mon Mar 16 | L11, L12 | Solar structure, parallax, distance, luminosity |
| HW 7 | Mon Mar 23 | L13, L14 | H-R diagram, binary stars, stellar masses |
| HW 8 | Mon Apr 6 (after break) | L15, L16 | ISM, star formation, stellar evolution |
| HW 9 | Mon Apr 13 | L17, L18 | Stellar death, compact remnants |

---

## Module 2 Exam (Friday, April 17)

**Format:** Closed-note, calculator allowed, formula sheet provided
**Duration:** 50 minutes (regular class period)

**Topic Coverage:**
- Solar structure and fusion (L11)
- Stellar distances: parallax, magnitudes, inverse-square law (L12)
- H-R diagram: spectral types, regions, Stefan-Boltzmann relation (L13)
- Binary stars and stellar masses: Kepler's 3rd law, mass-luminosity relation (L14)
- Interstellar medium and star formation (L15)
- Stellar evolution: hydrostatic equilibrium, MS lifetimes, red giants (L16)
- Stellar death: low-mass (PN, WD, Chandrasekhar) and high-mass (SN, core collapse) (L17)
- Compact remnants: neutron stars, black holes, Schwarzschild radius (L18)

**Problem Types (estimated distribution):**
- Conceptual: ~40% (explain, compare, identify misconceptions)
- Calculation: ~35% (parallax, inverse-square law, Kepler's 3rd, Schwarzschild radius, mass-luminosity)
- Synthesis: ~25% (trace a star's life based on mass, connect OMI chains)

**Review Session:** Week 13 Mon (Apr 13) and Wed (Apr 15)

---

## Open Design Questions

> These are flagged for discussion and should be resolved before readings are written.

1. **L15 density:** Combining ISM + star formation into one lecture is the tightest fit in the module. If it proves too dense, the most natural relief valve is splitting it across two days and moving L16 content partially into L17 (which already covers late-stage evolution + death). Revisit after writing the reading.

2. **Math level:** Module 1 readings were tagged `math-level: algebra_only`. Module 2 introduces scaling relations ($L \propto M^{3.5}$, $t \propto M^{-2.5}$). Should these be presented as "trust me" relations with worked ratio problems, or should we sketch the reasoning behind them?

3. **Demo development timeline:** The H-R Diagram Explorer is the highest-priority new demo. Should it be built before or in parallel with the readings?

4. **Exoplanet label:** The syllabus Module 2 exam label currently reads "Stars, Stellar Evolution, Exoplanets." This should be updated to "Stars & Stellar Evolution." (Tracked separately in schedule/syllabus updates.)
