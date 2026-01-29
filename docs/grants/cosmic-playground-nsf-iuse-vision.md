# Cosmic Playground: NSF IUSE Vision Document

*A modern, open-source interactive astronomy and physics simulation ecosystem for reasoning-based instruction — from introductory through upper-division undergraduate courses.*

**PI:** Dr. Anna Rosen (Computational Astrophysicist)
**Target Program:** NSF IUSE: EDU (Engaged Student Learning, Level 2)
**Target Audience:** Undergraduate students (lower-division and upper-division)
**Target Courses:** ASTR 101 (intro lecture), ASTR 109 (intro lab), ASTR 201+ (upper-division), PHYS 195/196/197 (physics for scientists)
**Status:** Draft vision document for grant development

---

## Executive Summary

**The hook:** A computational astrophysicist built 10 validated simulations with unit-tested physics using AI-augmented development — and wants funding to study whether physically correct simulations improve learning transfer across course levels.

**Cosmic Playground** is an open-source ecosystem of interactive astronomy and physics simulations spanning introductory through advanced courses. Designed by a computational astrophysicist, every simulation uses **physically correct theory under the hood** — not pedagogical simplifications that break at the edges.

Unlike general-purpose physics simulators from the 2000s era, Cosmic Playground:

1. **Embeds epistemological pedagogy** — Every demo follows the Observable → Model → Inference pattern, teaching students *how astronomers know* not just *what we know*

2. **Provides complete instructor scaffolding** — Each simulation includes Think-Pair-Share activities, clicker questions, misconception registries, and lab protocols

3. **Uses rigorously correct physics** — Separated, unit-tested physics models validated against analytic solutions and real astronomical systems (not black-box simulations)

4. **Layered complexity architecture** — Each demo serves multiple course levels through progressive disclosure; the same simulation works in ASTR 101 (conceptual) and upper-division courses (quantitative) with toggled depth

5. **Modern, accessible design** — Web-native (no Flash/Java), responsive, WCAG-compliant, embeddable in any LMS

The project fills a gap: existing astronomy simulations were built for "explore and discover" pedagogy with simplified (often incorrect) physics. Cosmic Playground is designed for the prediction-observation-explanation cycle with theory that actually works.

---

## The Problem

### Intro Astronomy Is Often Taught Badly

Most introductory astronomy courses emphasize memorization over understanding:

- Students recall that "seasons are caused by tilt" without understanding *why* tilt matters
- Assessment tests factual recall, not reasoning ability
- The epistemological dimension ("how do we know?") is rarely addressed

### Existing Simulations Are Outdated

| Tool | Era | Limitations |
|------|-----|-------------|
| PhET | 2000s | Flash legacy, general physics focus, minimal instructor scaffolding |
| Nebraska Astronomy Applets | 2000s | Java applets (dead technology), no mobile support |
| NAAP | 2010s | "Play with sliders" without pedagogical structure |
| Stellarium/Celestia | Planetarium | Beautiful but not designed for misconception-based teaching |

None have: prediction checkpoints, instructor activity protocols, unit-tested physics, or epistemological framing.

---

## Our Approach

### Core Philosophy

**Astronomy synthesizes observation, theory, and computation.** Students must understand that we *infer* physical reality by testing theoretical models against observational constraints — and increasingly, against computational simulations.

Every Cosmic Playground demo embodies this triad:

- **Observable:** What can students see or measure in the simulation?
- **Model:** What physical mechanism explains the observation?
- **Inference:** What can we conclude about things we can't directly see?

### Design Principles

#### Principle 1: Misconception-Activated Learning

Each demo targets specific, documented misconceptions from astronomy education research:

| Demo | Target Misconception |
|------|---------------------|
| Seasons | "Earth is closer to Sun in summer" |
| Moon Phases | "Phases caused by Earth's shadow" |
| Binary Orbits | "Stars don't move, only planets orbit" |
| Eclipse Geometry | "Eclipses should happen every month" |
| Angular Size | "The Sun and Moon are actually the same size" |
| Kepler's Laws | "Planets move at constant speed" |

The design requires **prediction before observation** — students commit to their (often incorrect) mental model before the demo reveals the correct physics.

#### Principle 2: Observable → Model → Inference Epistemology

Students don't just see "what happens" — they understand *how we know*:

- The binary orbits demo shows stellar wobble → connects to radial velocity detection → explains how we find exoplanets we can't see directly
- The eclipse geometry demo shows alignment requirements → connects to eclipse prediction → explains how ancient astronomers validated their models

#### Principle 3: Cognitive Load Management

Based on cognitive load theory:

- **Curated presets** from real astronomical systems (51 Pegasi b, Alpha Centauri, not arbitrary parameters)
- **Progressive disclosure** (advanced features hidden until needed)
- **Visual hierarchy** (primary physics > readouts > controls)

#### Principle 4: Dual-Use Design (Classroom + Self-Study)

Demos serve two distinct modes:

| Context | How students use it |
|---------|---------------------|
| **In class** | Instructor-guided POE, prediction checkpoints, structured activities |
| **Self-study** | Free exploration — "what if I change this?" while studying for exams |

This is why it's a "Playground" — designed equipment (presets, structured UI), but students can still play freely.

**Homework integration:** Assignments are designed around the demos:

- Use the simulation to verify your calculations
- Explore parameter space to build intuition before solving problems
- "Set up the demo to match this system, then predict what happens when..."

This extends learning beyond classroom contact hours. Students who struggle with the math can build visual intuition first; students who grasp concepts quickly can explore edge cases.

### What Makes This Different

| Feature | PhET / NAAP | Cosmic Playground |
|---------|-------------|-------------------|
| Pedagogical structure | "Explore freely" | Prediction → Observation → Explanation |
| Instructor support | Teacher tips PDF | Full activity protocols, clicker banks, rubrics |
| Physics verification | Black box | Unit-tested models, documented invariants |
| Epistemology | Implicit | Explicit "how do we know?" framing |
| Technology | Flash/Java legacy | Modern web, accessible, responsive |
| Presets | Generic | Real astronomical systems |
| Assessment | External | Built-in prediction logging capability |

---

## Methodological Innovation: Research-Grade Standards for Teaching Tools

### The Core Insight

Educational software has historically been built *ad-hoc* — one-off tools by individual instructors, or flashy products without verified physics. Cosmic Playground asks: **What happens when you apply professional software engineering practices to educational simulation development?**

> "The same standards we apply to research simulations — tested, documented, reproducible — should apply to the simulations we use to teach."

This is STEM pedagogical software built on **correctness + software engineering best practices**, where four domains converge:

| Domain | Contribution |
|--------|--------------|
| **Computational science** | Physics correctness, numerical validation against analytic solutions |
| **Software engineering** | Unit tests, documented invariants, modular architecture, version control |
| **STEM pedagogy** | POE cycle, misconception confrontation, cognitive load management |
| **AI-augmented development** | Accelerated iteration with extensive testing and validation |

### Why This Hasn't Been Done

1. **STEM Ed researchers** don't have computational skills to build simulations from scratch
2. **Computational scientists** typically don't prioritize pedagogy (or teach service courses)
3. **Building simulations was expensive/slow** before modern AI-assisted development
4. **The layered complexity insight** requires teaching across multiple course levels — most faculty teach one course repeatedly

The PI sits at an unusual intersection: computational astrophysicist with software engineering expertise, teaching intro (non-majors and majors) through graduate computational courses, applying AI tools to accelerate development while maintaining physics rigor.

**The inverted model:** Most IUSE proposals feature STEM education researchers partnering with content experts. This proposal inverts that — a content expert with methodological rigor seeking STEM Ed partnership to measure whether that rigor improves learning outcomes. The simulations exist; the research question is whether research-grade standards for teaching tools actually matter.

### The Research Question

The STEM Ed collaborator provides the research framework to *measure* whether this rigor actually improves learning outcomes:

- Does physics correctness at the conceptual level improve transfer to quantitative reasoning?
- Does the layered complexity architecture help students build on prior tool familiarity?
- Does the prediction-checkpoint structure improve misconception correction compared to free exploration?

The grant funds this research component — the methodology exists, but we need assessment instruments and multi-site testing to validate it.

---

## Deliverables

### Core Simulation Toolkit (Layered Complexity Architecture)

**Innovation:** Rather than separate demos for different course levels, Cosmic Playground uses a **layered complexity model**. Each simulation serves multiple audiences through progressive disclosure — the same demo works in ASTR 101 (conceptual, visual) and upper-division courses (quantitative, mathematical) with toggled depth.

#### How Layered Complexity Works

| Layer | Audience | Features Visible | Example (Binary Orbits) |
|-------|----------|------------------|-------------------------|
| **Conceptual** | ASTR 101/109 | Animation, presets, key observables | See the wobble, understand barycenter |
| **Quantitative** | ASTR 201, PHYS 195-197 | Equations, derivations, parameter exploration | Calculate mass ratios from orbit sizes |
| **Advanced** | Upper-division | Full physics, edge cases, research connections | Analyze RV curves, inclination effects |

**Benefits:**

- Students see the *same* simulation across courses, building familiarity
- Instructors control complexity via UI toggles, not separate tools
- No "watered-down" version — the physics is always correct, just progressively revealed
- Lab courses (ASTR 109) use conceptual + hands-on data collection modes

#### Current Demo Suite (Layered)

| Demo | Conceptual Layer | Quantitative Layer | Advanced Layer |
|------|------------------|-------------------|----------------|
| **Seasons** | Axial tilt animation | Solar angle calculations | Milankovitch cycles |
| **Moon Phases** | Viewing geometry | Terminator position math | Libration, phase curves |
| **Eclipse Geometry** | Node + phase requirement | Saros cycle prediction | Eclipse magnitude |
| **Angular Size** | Distance-size visual | Small-angle formula | Parsec derivation |
| **Kepler's Laws** | Equal areas animation | Vis-viva equation | Newton mode, perturbations |
| **Binary Orbits** | Barycenter wobble | Mass ratio from orbits | RV curves, inclination, light curves |
| **Parallax Distance** | Annual motion visual | Trigonometric parallax | Gaia data, distance ladder |
| **Blackbody Radiation** | Color-temperature visual | Wien's law, Stefan-Boltzmann | Planck function, stellar spectra |
| **EM Spectrum** | Wavelength visualization | Energy-wavelength relation | Atmospheric windows, detector types |
| **Telescope Resolution** | Diffraction visual | Rayleigh criterion | Aperture synthesis, adaptive optics |

#### Planned Demos (Layered)

**Classical Misconceptions (High Priority):**

- Retrograde Motion — Apparent reversal → heliocentric geometry → reference frames
- Tides — Two-bulge visual → differential gravity → Roche limit, tidal locking
- Inverse Square Law — Visual falloff → 1/r² math → flux, luminosity, apparent magnitude

**Observational Astronomy:**

- Doppler/Redshift — Color shift → wavelength math → spectral fitting
- H-R Diagram — Classification → luminosity-temperature → stellar evolution tracks
- Light Curves — Transit shape → depth analysis → limb darkening
- Magnitude System — Apparent brightness → logarithmic scale → distance modulus
- Spectral Classification — OBAFGKM visual → temperature sequence → spectral types
- Color Index — B-V color → temperature proxy → reddening, extinction

**Stellar Physics:**

- Spectroscopy — Absorption lines → Planck function → curve of growth
- Hydrostatic Equilibrium — Pressure balance concept → Lane-Emden → polytropes
- Nuclear Reactions — Energy source → pp-chain → CNO cycle energetics
- Stellar Structure — Onion model → equations of stellar structure → MESA comparison
- Stellar Evolution — Main sequence lifetime → post-MS phases → endpoint fates
- Kelvin-Helmholtz Contraction — Gravitational heating → contraction timescale → pre-main-sequence
- Radiative Losses — Energy escape → cooling curves → thermal equilibrium

**Gravitational Physics:**

- Tidal Forces — Differential gravity → Roche limit → tidal locking timescales
- Gravitational Lensing — Light bending → Einstein ring → mass estimation
- Orbital Mechanics — Kepler → Newton → post-Newtonian corrections
- Escape Velocity — Throw-and-fall → energy equation → Schwarzschild radius

**Cosmology:**

- Hubble's Law — Raisin bread visual → v = H₀d → dark energy, deceleration parameter
- Scale of the Universe — Powers-of-ten zoom → logarithmic scaling → cosmic distance ladder
- Universe Expansion — Expanding space → comoving coordinates → topology, curvature

**Physics Foundations (PHYS 195-197):**

- Thermodynamics — Ideal gas → equation of state → stellar interiors
- Waves & Optics — Interference → diffraction → spectroscopy
- E&M Waves / Spectra — Wave propagation → polarization, interference → spectral analysis
- Gravity & Orbits — Newton's law → orbital energy → escape velocity
- Energy Conservation — KE + PE visual → virial theorem → bound vs unbound systems
- Angular Momentum Conservation — Ice skater spin-up → collapsing cloud → accretion disk formation

#### Design Principle: Correct Theory Under the Hood

Every demo uses **physically correct models**, not pedagogical simplifications that break at the edges:

- Hydrostatic equilibrium: actual pressure-gravity balance, not "hand-wavy explanations"
- GR effects: real Schwarzschild precession, not "gravity is like a bowling ball on a trampoline"
- Radiative transfer: proper optical depth treatment, not "light gets absorbed"

The physics is **testable** (unit tests against analytic solutions) and **documented** (invariants, assumptions, limitations explicit).

**Why this matters:** Students develop correct intuitions at the conceptual level. When they encounter the math in upper-division courses, the simulation *still works* — they're just seeing deeper layers of the same system.

### Instructor Resource Suite (Per Demo)

Each demo includes:
- `index.qmd` — Overview, learning goals, live-teach script (10-15 min)
- `model.qmd` — Physics deep dive, assumptions, limitations
- `activities.qmd` — MW quick (3-5 min), MW short (8-12 min), Friday lab (20-30 min), station version
- `assessment.qmd` — Clicker questions, short-answer with rubrics, exit tickets
- `backlog.qmd` — Future enhancements, prioritized

### Assessment Framework

**What We're NOT Measuring:** Factual recall ("What causes seasons?")

**What We ARE Measuring:**
- **Reasoning under novelty** — Can students apply the model to unseen systems?
- **Prediction accuracy** — Do students predict correctly before the demo reveals?
- **Explanation quality** — Rubric-scored short answers rewarding mechanistic reasoning

**Built-in Capabilities:**
- Prediction checkpoint system (pause/predict/reveal flow)
- Optional prediction logging for instructors who want data
- Exportable clicker response integration
- Rubric-aligned prompts with scoring guides

### Technical Infrastructure

- **Modern web stack** — Vanilla JavaScript, SVG visualization, no dependencies
- **Separated physics models** — Testable in Node.js, validated against known systems
- **Documented invariants** — Conservation laws, unit systems explicit in code
- **Accessibility** — WCAG 2.1 AA compliant, keyboard navigable, screen reader tested
- **Embeddable** — Works in any LMS via iframe or Quarto shortcode

---

## Evidence Base

### Research Foundation

The design draws on established findings in science education:

1. **Misconception-based instruction** — Activating and confronting misconceptions produces deeper learning than direct instruction alone (Posner et al., 1982; Sadler et al., 2010)

2. **Prediction-Observation-Explanation (POE)** — The specific sequence of predict → observe → explain is superior to observe-first approaches (White & Gunstone, 1992)

3. **Interactive engagement** — Interactive simulations outperform passive lecture (Hake, 1998; PhET research program)

4. **Cognitive load theory** — Managed complexity improves learning (Sweller, 1988)

### Pilot Data (Grant Scope)

- Year 1: Implement in PI's ASTR 101 (lecture), ASTR 109 (lab), and upper-division courses; collect prediction checkpoint data
- Year 2: Partner institutions (2-3 sites) test across their intro and upper-division astronomy courses
- Year 3: Public release, AAS workshop, journal publication (Astronomy Education Journal, Physics Teacher)

---

## Dissemination & Sustainability

### Open Source Model

**License:** CC BY-NC-SA 4.0
- **BY** — Must credit the project
- **NC** — No commercial use (textbook companies cannot sell it)
- **SA** — Share-alike (derivatives must use same license)

**Hosting:**
- GitHub repository with version control and issue tracking
- Documentation-first approach (instructor guides, not just code)
- Static files, no server costs, host anywhere

### Adoption Pathway

| Phase | Activity |
|-------|----------|
| Year 1 | Pilot at PI's institution, refine based on classroom use |
| Year 2 | Partner institutions test, community feedback loop |
| Year 3 | Public release, AAS workshop, journal publication |

### Sustainability

- **Zero hosting costs** — Static files run in any browser
- **AI-augmented development** — Demos built using AI pair-programming; documented architecture enables rapid iteration and instructor customization
- **Community maintenance** — Open contributions via GitHub

### Broader Impacts

- **Accessibility-first** — WCAG compliant, usable by students with disabilities
- **Community college focus** — Where most intro astro is taught, often with fewest resources
- **HSI/MSI partnerships** — Outreach to institutions serving underrepresented students
- **Science museum outreach** — Partnership with Fleet Science Center (San Diego) to adapt demos for exhibit use and informal learning environments

---

## Team & Expertise

### PI: Dr. Anna Rosen

**Computational astrophysicist** with expertise in:
- Numerical simulation (stellar feedback, radiation hydrodynamics)
- Scientific visualization
- Software engineering best practices
- AI-augmented scientific computing

**Teaching span:** Intro astronomy for non-majors (ASTR 101) → intro for majors (ASTR 201) → graduate computational science and computational astrophysics courses. This range — from general education to research methods — directly informs the layered complexity architecture.

**Pedagogical approach:**
- Evidence-based design grounded in learning science research
- Focus on reasoning and epistemology over memorization
- "Recognition, not retention" philosophy

### Potential Collaborators

- **STEM Education Researcher (SDSU)** — San Diego State has strong science education faculty; co-PI for assessment framework design and research question formulation
- **Partner Instructors** — At community colleges and HSI/MSI institutions for pilot testing
- **Fleet Science Center (San Diego)** — Science museum partnership for public outreach; demos adapted for exhibit use and informal learning
- **Accessibility Consultant** — For WCAG compliance verification

---

## What We Have vs. What the Grant Funds

**This is a Development & Implementation proposal.** The grant funds the *creation and testing* of innovations, not validation of completed work.

### Already Developed (Proof of Concept)

| Asset | Purpose |
|-------|---------|
| 10 working demos | Technical feasibility demonstrated |
| Instructor resource suite | Adoption model proven |
| Pedagogy contract | Design principles articulated |
| Layered complexity architecture | Innovation defined |
| Unit-tested physics models | Quality standard established |

**These assets demonstrate the PI can execute** — not that the research is complete.

**Development methodology:** The PI uses AI pair-programming (Claude Code, Codex) to accelerate development while maintaining extensive testing and validation. This is not a shortcut — it's a computational astrophysicist applying modern software engineering practices to education research. The approach enables:

- Accelerated iteration with physics correctness maintained through automated testing
- Documented, testable code from the start — unit tests validate against analytic solutions
- Modular architecture that other instructors can customize using the same AI tools
- Sustainable development velocity that makes 30+ demos in 3 years achievable

This is transparent and intentional: AI augmentation is a force multiplier for domain expertise, not a replacement for it. The rigor comes from the methodology (tests, invariants, validation), and AI accelerates the implementation.

### What the Grant Funds

| Activity | Year | Deliverable |
|----------|------|-------------|
| Expand demo suite | 1-2 | 20+ new layered demos (misconceptions, observational, stellar, gravitational, cosmology, physics) |
| Develop assessment framework | 1 | With SDSU STEM Ed co-PI; research instruments for measuring reasoning transfer |
| Pilot across courses | 1-3 | ASTR 101/109, PHYS 195-197, upper-division at PI's institution |
| Partner institution testing | 2-3 | Community colleges, HSIs, Fleet Science Center |
| Research on effectiveness | 1-3 | Does layered complexity improve transfer across course levels? |
| Dissemination | 3 | AAS workshop, journal publications, open-source release |

**The grant enables the research component** — assessment design, multi-site testing, and effectiveness studies — that cannot be done without funding and collaborators.

---

## Why Level 2? (Engaged Student Learning)

NSF IUSE Level 2 ("Development and Implementation") is the right fit for this project:

| Level 2 Criterion | How Cosmic Playground Meets It |
|-------------------|-------------------------------|
| **Develop and test innovations** | Novel layered complexity architecture; prediction-checkpoint pedagogy |
| **Multiple contexts** | ASTR 101/109, ASTR 201+, PHYS 195/196/197 — astronomy and physics courses |
| **Evidence-based design** | Grounded in misconception research, POE, cognitive load theory |
| **Broader impact** | Open-source, accessible, community college focus, HSI/MSI partnerships |
| **Sustainability plan** | Zero hosting costs, AI-adaptable, community maintenance |

**Scope is undergraduate-focused:**

- Lower-division: ASTR 101 (intro lecture) + ASTR 109 (intro lab)
- Upper-division: ASTR 201+, physics majors taking astrophysics courses
- Physics sequence: PHYS 195/196/197 (physics for scientists) — demos for blackbody radiation, thermodynamics, gravity, waves
- Not targeting graduate students — the layered architecture serves the full undergraduate pathway

**Innovation claim:** The layered complexity model is genuinely novel. Existing simulation ecosystems (PhET, NAAP) create separate "intro" and "advanced" versions of the same concept — fragmenting the ecosystem and preventing students from building familiarity across courses. Cosmic Playground demonstrates that one simulation can serve multiple audiences through progressive disclosure. The physics is always correct; only the visible complexity changes.

**Why this matters:** A student who uses the Binary Orbits demo in ASTR 101 to understand the barycenter can return to the *same* tool in ASTR 201 to calculate mass ratios from orbital parameters. The interface is familiar; only the depth increases. No other simulation ecosystem does this.

---

## Budget Considerations (Sketch)

| Category | Purpose |
|----------|---------|
| Graduate student | Demo development, testing, documentation |
| Undergraduate assistants | User testing, accessibility audits |
| Partner institution stipends | Faculty time for pilot testing |
| Travel | AAS presentations, partner site visits |
| Equipment | None (browser-based, no special hardware) |

---

## Appendix: Current Demo Suite

### Implemented Demos (as of January 2026)

| Demo | Misconception Target | Key Features |
|------|---------------------|--------------|
| **Seasons** | Distance causes seasons | Axial tilt, solar angle, hemisphere comparison |
| **Moon Phases** | Earth's shadow causes phases | Viewing geometry, terminator position |
| **Eclipse Geometry** | Eclipses every month | Node + phase requirement, Saros cycle |
| **Angular Size** | Sun/Moon same actual size | Distance-size tradeoff, recession mode |
| **Kepler's Laws** | Uniform orbital speed | Equal areas, vis-viva, Newton mode |
| **Binary Orbits** | Star doesn't move | Barycenter, mass ratio, 51 Peg b preset |
| **Parallax Distance** | Stars don't move | Annual motion, trigonometric parallax |
| **Blackbody Radiation** | Color unrelated to temperature | Wien's law, Stefan-Boltzmann, stellar spectra |
| **EM Spectrum** | All light is the same | Wavelength-energy relation, atmospheric windows |
| **Telescope Resolution** | Bigger is always better | Diffraction limit, Rayleigh criterion |

### Instructor Resources Complete

All 10 demos have full instructor resource suites:
- Think-Pair-Share activities with explicit prediction checkpoints
- Named misconceptions with confrontation strategies
- Clicker questions with distractors tied to misconceptions
- Friday lab protocols (20-30 min investigations)
- Station rotation versions (6-8 min self-guided)

---

## Next Steps

1. **Finalize demo pedagogy contract** — Document design principles formally ✓
2. **Identify STEM Ed collaborator** — For assessment instrument development
3. **Draft NSF IUSE Level 2 proposal** — Using this vision document as foundation
4. **Begin Year 1 pilot** — Spring 2026 in ASTR 101, ASTR 109, and upper-division courses

---

*This document captures the vision for NSF IUSE grant development. It will be refined with input from STEM education collaborators and NSF program officers.*
