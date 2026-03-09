# Lecture 11: Our Star — The Sun
## NotebookLM Figure Prompts

**Course:** ASTR 101 — Principles of Astronomy (Spring 2026)
**Instructor:** Dr. Anna Rosen
**Purpose:** Generate scientifically accurate, pedagogically clear infographics for an introductory astronomy lecture reading on the Sun. Target audience is undergraduate non-science-majors encountering solar physics for the first time.

---

## Global Style Directives

Paste this preamble before every figure prompt to enforce consistency:

> **Style preamble (paste before each prompt):**
>
> You are generating a pedagogical scientific infographic for an introductory college astronomy course. Enforce these constraints absolutely:
>
> 1. **Scientific accuracy is non-negotiable.** Every number, label, and spatial relationship must be physically correct. Do not invent values. If a quantity is approximate, label it with "~". Do not round in misleading ways.
> 2. **No decorative inaccuracies.** Do not add artistic flames, cartoon explosions, or anthropomorphized features. The Sun is plasma, not fire. Fusion is not combustion. Corona is not flame.
> 3. **Color encodes physics, not aesthetics.** Use color to represent temperature (blue = hotter, red = cooler in the standard astronomical convention) or density — never arbitrarily. Include a color bar or legend when color carries quantitative meaning.
> 4. **Scale matters.** If two objects appear in the same image, their relative sizes must be correct or the image must include an explicit "NOT TO SCALE" label. Never silently distort scale.
> 5. **Label everything.** Every region, arrow, and annotation must have a clear text label. Assume the reader cannot infer what anything represents from context alone.
> 6. **Typography:** Use a clean sans-serif font. Minimum readable size. No all-caps except for acronyms. Use proper scientific notation (e.g., 1.99 x 10^30 kg, not "2 trillion trillion tons").
> 7. **Accessibility:** Ensure sufficient contrast. Do not rely on color alone to distinguish elements — use hatching, patterns, or labels as backup. Colorblind-safe palette preferred (avoid pure red/green pairs).
> 8. **Illustration style:** Clean vector-style scientific illustration. Think "Nature Astronomy review article" rather than "children's science poster." Professional, minimal, purposeful.

---

## Figure 1: The Sun in Context — Vital Statistics

**Placement in reading:** Opening section, "The Sun in Context"

**Prompt:**

> [Paste style preamble above]
>
> Create a single-page infographic titled **"The Sun: Vital Statistics"** for an introductory astronomy course.
>
> **Layout:** The Sun shown as a circle at center-left, with annotated callout lines pointing to labeled quantities around it. A tiny silhouette of Earth shown at correct relative scale near the Sun's limb (Earth's diameter is ~1/109 of the Sun's diameter — Earth should be barely visible as a dot). Include a scale bar or explicit note: "109 Earths fit across the Sun's diameter."
>
> **Required annotations (use exact values):**
>
> | Property | Value | Note |
> |----------|-------|------|
> | Radius | 696,000 km | Label as "1 solar radius (R☉)" |
> | Mass | 1.989 x 10^30 kg | Label as "1 solar mass (M☉)" |
> | Luminosity | 3.828 x 10^26 W | Label as "1 solar luminosity (L☉)" |
> | Surface temperature | 5,778 K | Label as "photosphere" |
> | Core temperature | ~15 million K | |
> | Age | ~4.6 billion years | Note: "middle-aged; ~5 billion years of hydrogen fuel remain" |
> | Distance from Earth | 1 AU = 1.496 x 10^8 km | Note: "light travel time: ~8 minutes" |
> | Spectral type | G2V | |
> | Composition (by mass) | ~73% H, ~25% He, ~2% heavier | |
>
> **Scientific constraints:**
> - The Sun should appear as a smooth, slightly limb-darkened disk — NOT as a ball of fire or with cartoon flame tendrils.
> - Earth must be shown at correct relative size (it will be a tiny dot). If this is hard to see, include an inset magnification.
> - Do NOT include any features not listed (no sunspots, no corona in this figure — those come later).
>
> **Pedagogical goal:** Students should walk away knowing the Sun's key numbers and understanding that "1 solar mass" and "1 solar luminosity" are the reference units used to describe all other stars in the course.

---

## Figure 2: Solar Structure Cross-Section

**Placement in reading:** "Solar Structure: A Star in Layers"

**Prompt:**

> [Paste style preamble above]
>
> Create a **vertical cross-section diagram of the Sun** showing its internal and atmospheric layers. The diagram should look like the Sun has been sliced in half, with the left half showing the external appearance (smooth photosphere) and the right half showing the labeled internal layers.
>
> **Layers to include (from center outward), with approximate radial boundaries and physical properties:**
>
> | Layer | Radial extent | Temperature | Density | Key process |
> |-------|---------------|-------------|---------|-------------|
> | **Core** | 0 – 0.25 R☉ | ~15 million K | ~150 g/cm³ | Nuclear fusion (pp-chain) |
> | **Radiative zone** | 0.25 – 0.70 R☉ | 7 million – 2 million K | Decreasing | Photon diffusion (radiative transport) |
> | **Convective zone** | 0.70 – 1.0 R☉ | 2 million – 5,800 K | Decreasing | Bulk gas motion (convection) |
> | **Photosphere** | Thin layer at surface | ~5,800 K | ~10^-7 g/cm³ | Visible light emission |
> | **Chromosphere** | Just above photosphere | ~10,000 – 20,000 K | Very low | H-alpha emission |
> | **Corona** | Extends millions of km | 1 – 3 million K | Extremely low | X-ray emission, solar wind origin |
>
> **Visual encoding:**
> - Use a **temperature-mapped color gradient**: hottest (core) in white/blue-white, transitioning through yellow to orange-red at the convective zone surface. The corona should NOT be colored hot — it is extremely tenuous despite being hot; show it as a faint, diffuse outer glow.
> - In the **radiative zone**, show small arrows in random directions representing photon paths (zigzag/random walk). Include a label: "A photon takes ~170,000 years to travel from core to surface."
> - In the **convective zone**, show convection cells: curved arrows indicating hot material rising (lighter shade) and cool material sinking (darker shade). Label: "Granulation visible at surface."
> - Include a **temperature profile** along the right margin: a small line graph showing temperature vs. radius. The key feature to highlight is the temperature *minimum* at the photosphere followed by the dramatic *rise* in the chromosphere and corona.
>
> **Scientific constraints:**
> - The core occupies 25% of the radius but contains ~50% of the mass. Do NOT draw it too large.
> - The photosphere is only ~500 km thick — essentially a thin line at this scale. Do not exaggerate its thickness.
> - The chromosphere and corona are NOT drawn to scale (they would be invisibly thin / enormous respectively). Include a "NOT TO SCALE" note for the atmospheric layers.
> - The tachocline (boundary between radiative and convective zones at ~0.70 R☉) should be marked with a dashed line.
>
> **Pedagogical goal:** Students should be able to identify all six layers, understand that energy transport changes from radiation to convection at ~0.70 R☉, and recognize that the temperature profile is NOT monotonically decreasing (the corona is hotter than the photosphere — a mystery discussed in the reading).

---

## Figure 3: The Proton-Proton Chain

**Placement in reading:** "Nuclear Fusion: The Engine of a Star"

**Prompt:**

> [Paste style preamble above]
>
> Create a **step-by-step diagram of the proton-proton (pp) chain** — the dominant nuclear fusion reaction powering the Sun. This is for non-science-majors who have NOT taken physics or chemistry beyond high school.
>
> **Show the three steps of the pp-I chain:**
>
> **Step 1:** Two protons (¹H) collide. One proton converts to a neutron (via the weak force). Products: deuterium (²H) + positron (e⁺) + neutrino (ν_e).
> - Label: "This step is incredibly rare — a given proton waits ~10 billion years on average before this happens."
>
> **Step 2:** Deuterium (²H) + proton (¹H) → helium-3 (³He) + gamma ray (γ).
> - Label: "This step happens quickly — within seconds."
>
> **Step 3:** Two helium-3 (³He) nuclei collide → helium-4 (⁴He) + two protons (¹H, returned to the pool).
>
> **Net reaction (shown prominently at bottom):**
> 4 ¹H → ¹ ⁴He + 2 e⁺ + 2 ν_e + energy (gamma rays)
>
> **Mass-energy annotation:**
> - Mass of 4 protons: 6.693 x 10^-27 kg
> - Mass of 1 He-4 nucleus: 6.645 x 10^-27 kg
> - Mass deficit: 0.048 x 10^-27 kg (0.7% of the original mass)
> - Energy released per reaction: E = mc² → 4.3 x 10^-12 J → 26.7 MeV
> - Label: "The Sun converts ~4 million tonnes of mass into energy every second."
>
> **Visual encoding:**
> - Protons: red circles labeled "p" or "¹H"
> - Neutrons: blue circles labeled "n"
> - Deuterium: one red + one blue bound together
> - Helium-3: two red + one blue
> - Helium-4: two red + two blue
> - Positrons: small green circle labeled "e⁺"
> - Neutrinos: small open (hollow) circle labeled "ν" with a wavy arrow showing it escaping
> - Gamma rays: wavy yellow arrows labeled "γ"
> - Use arrows between steps to show the reaction flow (left to right or top to bottom)
>
> **Scientific constraints:**
> - Do NOT show the nuclei as touching or overlapping before fusion — they must be shown overcoming a repulsive barrier (the Coulomb barrier). A small annotation near Step 1: "Requires T > 15 million K to overcome electromagnetic repulsion."
> - The positrons annihilate almost immediately with electrons (producing additional gamma rays). Include a small note but don't make this a major visual element.
> - Neutrinos escape the Sun directly (they barely interact with matter). Show them with arrows pointing outward, labeled: "Neutrinos escape the Sun in ~2 seconds."
>
> **Pedagogical goal:** Students should understand that (1) four hydrogen nuclei become one helium nucleus, (2) the "missing" mass becomes energy via E = mc², (3) this process requires extreme temperature/pressure, and (4) neutrinos are a direct probe of the core because they escape immediately. They do NOT need to memorize the intermediate steps.

---

## Figure 4: Energy Transport — Radiative vs. Convective

**Placement in reading:** Transition between radiative zone and convective zone sections

**Prompt:**

> [Paste style preamble above]
>
> Create a **side-by-side comparison infographic** showing the two energy transport mechanisms inside the Sun: **radiative transport** (left panel) and **convective transport** (right panel).
>
> **Left panel — Radiative Transport:**
> - Title: "Radiative Zone (0.25 – 0.70 R☉)"
> - Show a photon (wavy arrow) being emitted, absorbed by a particle, re-emitted in a random direction, absorbed again, re-emitted, etc. — a **random walk** path from bottom (hotter) to top (cooler).
> - The path should look chaotic and wandering, NOT straight.
> - Include ~10-15 absorption/re-emission events to convey the randomness.
> - Annotation: "Each photon is absorbed and re-emitted ~10^25 times."
> - Annotation: "Average travel time from core to convective zone: ~170,000 years."
> - Analogy callout box: "Like a person stumbling through a dense crowd — always getting bumped sideways."
> - Background: gradient from hot (bottom, white/yellow) to cooler (top, orange).
>
> **Right panel — Convective Transport:**
> - Title: "Convective Zone (0.70 – 1.0 R☉)"
> - Show convection cells: large blobs of hot gas rising (colored warm, with upward arrows) and cooler gas sinking (colored cool, with downward arrows). Draw 3-4 cells side by side.
> - At the top surface, show the **granulation pattern**: a top-down view inset showing ~5-6 irregular polygonal bright cells separated by dark lanes. Label: "Each granule is ~1,000 km across — about the size of Texas."
> - Annotation: "Hot gas physically carries energy upward — like boiling water."
> - Annotation: "Travel time through convective zone: ~10 days."
> - Background: gradient from warm (bottom) to cooler (top).
>
> **Comparison bar at bottom:**
>
> | Property | Radiative | Convective |
> |----------|-----------|------------|
> | Mechanism | Photon absorption/re-emission | Bulk gas motion |
> | Speed | ~170,000 years | ~10 days |
> | Analogy | Random walk through a crowd | Boiling water |
> | Where in Sun | 0.25 – 0.70 R☉ | 0.70 – 1.0 R☉ |
>
> **Scientific constraints:**
> - The transition at 0.70 R☉ occurs because opacity increases (partially ionized gas blocks photons more effectively), NOT because of a change in temperature alone. Include a brief annotation: "At ~0.70 R☉, opacity rises sharply → photons can't escape fast enough → convection takes over."
> - Convection cells are NOT uniform circles — draw them as irregular, somewhat blobby shapes.
> - The granulation inset must show a realistic granulation pattern (bright cell interiors, dark intergranular lanes), not a regular grid.
>
> **Pedagogical goal:** Students should understand WHY the Sun uses two different transport mechanisms, be able to identify which dominates where, and grasp the dramatic difference in timescale (170,000 years vs. 10 days).

---

## Figure 5: Solar Activity — Sunspots, Flares, and the Solar Cycle

**Placement in reading:** "Solar Activity: The Magnetic Sun"

**Prompt:**

> [Paste style preamble above]
>
> Create a **multi-panel infographic** on solar activity with **four panels** arranged in a 2x2 grid, plus a timeline strip along the bottom.
>
> **Panel A (upper left) — Sunspots:**
> - Title: "Sunspots"
> - Show a close-up view of 2-3 sunspots on the solar photosphere. Each sunspot should have a dark **umbra** (center, ~3,700 K) and a lighter **penumbra** (surrounding, ~4,500 K) against the bright photosphere (~5,800 K).
> - Include Earth for size comparison — a typical large sunspot group can be several times Earth's diameter. Show Earth as a small circle overlaid or adjacent with a scale note.
> - Annotation: "Sunspots are ~1,500 K cooler than the surrounding photosphere."
> - Annotation: "They appear dark by contrast — a sunspot in isolation would still be blindingly bright."
> - Show magnetic field lines emerging from one sunspot and arcing to a nearby sunspot of opposite polarity (a bipolar pair).
>
> **Panel B (upper right) — Solar Flare and CME:**
> - Title: "Flares & Coronal Mass Ejections"
> - Show a solar flare as a bright, localized brightening near a sunspot group, with magnetic field lines shown reconnecting (two opposing field lines meeting, breaking, and reforming in a new configuration). Label: "Magnetic reconnection releases stored energy."
> - Show a CME as a large bubble of plasma and magnetic field expanding outward from the Sun. Label: "CMEs can travel at 1,000+ km/s and reach Earth in 1-3 days."
> - Annotation: "A single large flare releases ~10^25 J — equivalent to billions of nuclear bombs."
> - Show Earth at a distance with its magnetosphere deflecting the CME particles. Label: "Earth's magnetic field provides partial protection → aurorae at poles."
>
> **Panel C (lower left) — The Solar Cycle:**
> - Title: "The ~11-Year Solar Cycle"
> - Show a **butterfly diagram**: a plot with time on the x-axis (spanning ~22 years, or two full cycles) and solar latitude on the y-axis (from -40° to +40°). Sunspot positions shown as colored bands that start at high latitudes and migrate toward the equator over each ~11-year half-cycle.
> - Below the butterfly diagram, show a simple line graph of **sunspot number vs. time** over the same period, showing the rise and fall of activity.
> - Label the maximum and minimum points.
> - Annotation: "The magnetic polarity of sunspot pairs reverses every 11 years → the full magnetic cycle is ~22 years."
>
> **Panel D (lower right) — Solar Wind and Space Weather:**
> - Title: "Solar Wind & Space Weather"
> - Show the Sun at left, with radial arrows streaming outward representing the solar wind (~400 km/s for slow wind, ~800 km/s for fast wind from coronal holes).
> - Show Earth at right with its magnetosphere (teardrop shape: compressed on the Sun-facing side, extended tail on the opposite side).
> - Show aurora ovals at Earth's magnetic poles.
> - Label: "Solar wind: ~1 million tonnes of charged particles per second."
> - Label the heliosphere boundary (conceptual).
>
> **Bottom timeline strip:**
> - Show recent solar cycles (Cycles 23, 24, 25) with approximate dates and sunspot count peaks.
> - Mark: "We are currently in Solar Cycle 25 (began ~2019, expected peak ~2025)."
>
> **Scientific constraints:**
> - Sunspots are NOT holes in the Sun. They are regions of strong magnetic field where convection is locally suppressed.
> - The butterfly diagram must show the correct equatorward migration pattern. Do NOT show sunspots at latitudes above ~40° or at the equator itself.
> - Magnetic reconnection is NOT an explosion — it is a topological rearrangement of field lines that converts magnetic energy to kinetic and thermal energy. Do not depict it as a bomb going off.
> - The CME is a structured magnetic bubble, not an amorphous blob of fire. Show internal magnetic field structure if possible.
> - Earth's magnetosphere is shaped by the solar wind: compressed sunward side (~10 Earth radii), elongated magnetotail (~100+ Earth radii). Do not draw it as a symmetric sphere.
>
> **Pedagogical goal:** Students should understand that (1) solar activity is driven by magnetic fields, not thermal processes, (2) the ~11-year cycle produces a predictable pattern of sunspot migration, (3) flares and CMEs are the Sun's most energetic events and have real effects on Earth, and (4) the solar wind is a continuous outflow, not an occasional event.

---

## Usage Notes

- **Paste the style preamble before each individual prompt** — do not assume NotebookLM retains instructions across generations.
- **Review every generated image against the scientific constraints** before using it in the reading. Common failure modes:
  - Sun depicted with cartoon flames or fire tendrils
  - Incorrect relative sizes (Earth too large relative to Sun)
  - Temperature gradient colors reversed or arbitrary
  - Fusion shown as a single-step reaction
  - Sunspots shown as surface holes rather than magnetic features
- **If a generated image violates any constraint**, regenerate with the specific correction noted. Do not manually fix scientific errors in post-processing.
- **Alt text:** After finalizing each figure, write alt text that conveys the same information for screen readers. This is required for the course website's accessibility compliance.
