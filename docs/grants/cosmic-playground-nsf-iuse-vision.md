# Cosmic Playground: NSF IUSE Vision Document

*A modern, open-source interactive astronomy and physics simulation ecosystem for reasoning-based instruction — from intro courses through advanced astrophysics.*

**PI:** Dr. Anna Rosen (Computational Astrophysicist)
**Target Program:** NSF IUSE: EDU (Engaged Student Learning, Level 2 or 3)
**Status:** Draft vision document for grant development

---

## Executive Summary

**Cosmic Playground** is an open-source ecosystem of interactive astronomy and physics simulations spanning introductory through advanced courses. Designed by a computational astrophysicist, every simulation uses **physically correct theory under the hood** — not pedagogical simplifications that break at the edges.

Unlike general-purpose physics simulators from the 2000s era, Cosmic Playground:

1. **Embeds epistemological pedagogy** — Every demo follows the Observable → Model → Inference pattern, teaching students *how astronomers know* not just *what we know*

2. **Provides complete instructor scaffolding** — Each simulation includes Think-Pair-Share activities, clicker questions, misconception registries, and lab protocols

3. **Uses rigorously correct physics** — Separated, unit-tested physics models validated against analytic solutions and real astronomical systems (not black-box simulations)

4. **Scales from intro to advanced** — Tier 1 (ASTR 101) through Tier 3 (upper-division/grad) with consistent architecture: hydrostatic equilibrium, radiative transfer, GR, fluid dynamics

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

## Deliverables

### Core Simulation Toolkit (Multi-Level)

Cosmic Playground spans introductory through advanced courses, with rigorously correct physics under the hood.

#### Tier 1: Intro Astronomy (ASTR 101)

**Currently Implemented:**

- Seasons — Axial tilt and solar angle
- Moon Phases — Viewing geometry of illumination
- Eclipse Geometry — Alignment requirements (node + phase)
- Angular Size — Distance-size relationship
- Kepler's Laws — Orbital mechanics (Kepler and Newton modes)
- Binary Orbits — Two-body barycenter physics

**Planned:**

- Stellar Parallax — Distance measurement via annual motion
- Doppler/Redshift — Spectral line shifts and radial velocity
- H-R Diagram — Stellar classification and evolution
- Hubble's Law — Expanding universe
- Light Curves — Transit and eclipse detection

#### Tier 2: Intro Astrophysics (ASTR 201 / Physics Majors)

- Spectroscopy — Blackbody radiation, Wien's law, absorption lines
- Hydrostatic Equilibrium — Pressure-gravity balance in stars
- Gas Laws / Equation of State — Ideal gas, degeneracy pressure
- Radiative Transfer — Optical depth, emission, absorption
- Tidal Forces — Differential gravity, Roche limit, tidal locking
- Gravitational Lensing — Light bending, Einstein rings

#### Tier 3: Advanced Astrophysics (Upper Division / Grad Intro)

- Stellar Structure — Lane-Emden equation, polytropes
- Nuclear Reaction Networks — CNO cycle, pp-chain energetics
- Accretion Disks — Viscous transport, temperature profiles
- General Relativity Basics — Schwarzschild metric, orbital precession
- Radiative Processes — Bremsstrahlung, synchrotron, Compton
- Fluid Instabilities — Rayleigh-Taylor, Kelvin-Helmholtz

#### Design Principle: Correct Theory Under the Hood

Every demo uses **physically correct models**, not pedagogical simplifications that break at the edges:

- Hydrostatic equilibrium: actual pressure-gravity balance, not "hand-wavy explanations"
- GR effects: real Schwarzschild precession, not "gravity is like a bowling ball on a trampoline"
- Radiative transfer: proper optical depth treatment, not "light gets absorbed"

The physics is **testable** (unit tests against analytic solutions) and **documented** (invariants, assumptions, limitations explicit).

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

- Year 1: Implement in PI's ASTR 101/201 courses, collect prediction checkpoint data
- Year 2: Partner institutions (2-3 sites) test and provide feedback
- Year 3: Publish findings in Astronomy Education Journal, present at AAS

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
- **AI-adaptable architecture** — Documented design enables AI-assisted customization by adopting instructors
- **Community maintenance** — Open contributions via GitHub

### Broader Impacts

- **Accessibility-first** — WCAG compliant, usable by students with disabilities
- **Community college focus** — Where most intro astro is taught, often with fewest resources
- **HSI/MSI partnerships** — Outreach to institutions serving underrepresented students

---

## Team & Expertise

### PI: Dr. Anna Rosen

**Computational astrophysicist** with expertise in:
- Numerical simulation (stellar feedback, radiation hydrodynamics)
- Scientific visualization
- Software engineering best practices

**Pedagogical approach:**
- Evidence-based design grounded in learning science research
- Focus on reasoning and epistemology over memorization
- "Recognition, not retention" philosophy

### Potential Collaborators

- **STEM Education Researcher** — For assessment instrument development and validation
- **Partner Instructors** — At community colleges and HSI/MSI institutions for pilot testing
- **Accessibility Consultant** — For WCAG compliance verification

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

### Instructor Resources Complete

All six demos have full instructor resource suites:
- Think-Pair-Share activities with explicit prediction checkpoints
- Named misconceptions with confrontation strategies
- Clicker questions with distractors tied to misconceptions
- Friday lab protocols (20-30 min investigations)
- Station rotation versions (6-8 min self-guided)

---

## Next Steps

1. **Finalize demo pedagogy contract** — Document design principles formally ✓
2. **Identify STEM Ed collaborator** — For assessment instrument development
3. **Draft NSF IUSE proposal** — Using this vision document as foundation
4. **Begin Year 1 pilot** — Spring 2026 in ASTR 101/201

---

*This document captures the vision for NSF IUSE grant development. It will be refined with input from STEM education collaborators and NSF program officers.*
