# Module 01 — Lectures 05–13: Fix Plan (Comprehensive)

Date: 2026-02-02  
Scope: `modules/module-01/slides/lecture-05..13-*-slides.qmd` paired with `modules/module-01/readings/lecture-05..13-*-reading.qmd`  
Status: **Implemented (MODE: PATCH)** on 2026-02-02. Render gate passed: `conda run -n astro make render`.

## Implementation notes (what was actually changed)

- Slide–reading mismatch fixes: Kepler III shorthand messaging, Drake scenario values, and star-count framing were brought into agreement with their paired readings.
- No-fabrication cleanup: removed “Actual: … ✓” badges and any unsourced hard constants from in-class calculations where not supported by the paired reading.
- Engagement cadence: added “Predict First!” prompts to lectures that lacked them and added an additional synthesis quiz in Lecture 13.
- Base-path safety: updated Module 1 slide background-image paths, updated Module 1 reading demo links, and made `{{< fig >}}` / `{{< img >}}` path resolution base-path safe via `_extensions/course/shortcodes.lua`.

## Priority order rationale

1) Fix **science/consistency blockers** that would teach the wrong model.  
2) Fix **slide–reading mismatches** that will confuse students and break “pre-class reading → in-class slides” continuity.  
3) Remove/flag **numerical “fact checks”** that violate the no-fabrication rule.  
4) Upgrade equation handling (meaning + units + assumptions + sanity checks) with minimal rewriting, preferring the existing equation system where feasible.  
5) Improve pedagogy (TPS/prediction cadence) in the smallest-possible edits (new micro-slides, not rewrites).

---

## Top 10 highest-impact edits (first-pass priority)

### 1) Fix the equilibrium-temperature baseline used for the frost line (science blocker)

- **Why:** Slide currently contradicts its paired reading and the later climate lecture, and appears to mislabel Earth’s equilibrium temperature.
- **Edit targets:**
  - `modules/module-01/slides/lecture-11-solar-system-slides.qmd:592`
  - `modules/module-01/readings/lecture-11-solar-system-reading.qmd:374`
  - `modules/module-01/readings/lecture-11-solar-system-reading.qmd:402`
- **Proposed change (minimal):**
  - Replace “assumes Earth’s equilibrium temp ~280 K” with the reading-consistent baseline (~255 K for Earth’s equilibrium temperature in the “no atmosphere” sense), and explicitly state the assumption set (no greenhouse; averaged over surface; albedo matters).
  - Reframe the frost line slide to match the reading’s “order-of-magnitude and not a fixed wall” framing, and avoid an “exact” frost-line derivation from Earth’s present-day equilibrium temperature.

### 2) Remove or downgrade unsourced “Actual: … ✓” fact-check badges (no-fabrication)

- **Why:** These parentheticals present authoritative “verified” values that are not consistently supported by the paired reading, and they can be wrong without us noticing.
- **Edit targets:**
  - `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:809`
  - `modules/module-01/slides/lecture-11-solar-system-slides.qmd:574`
  - `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:979`
- **Proposed change (minimal):**
  - Remove the “Actual: … ✓” parentheticals entirely and keep the pedagogical point (“ballpark reasoning + unit checks”), except where we explicitly teach a lab reference value (e.g., Hα 656.28 nm).

### 3) Make the Drake-scenario numbers match the paired reading (major mismatch)

- **Why:** Slides and reading currently disagree on the scenario table values, breaking student trust and making homework/quiz alignment harder.
- **Edit targets:**
  - `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:529`
  - `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:256`
- **Proposed change (minimal):**
  - Update the slide’s “optimistic estimates” table and step-by-step multiplication to use the same values as the reading’s “Three Drake Scenarios” table (or refactor the slide to directly present the three scenarios instead of a single “optimistic” run).

### 4) Bring the “total stars” scale slide into agreement with the reading’s range framing

- **Why:** Slides compute a single-point estimate that conflicts with the reading’s stated uncertainty/range; this is a “big number” concept where ranges matter.
- **Edit targets:**
  - `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:607`
  - `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:278`
- **Proposed change (minimal):**
  - Replace the single multiplication with the reading-consistent range framing (order-of-magnitude up to ~10^24) and explicitly label the result as an order-of-magnitude estimate.

### 5) Fix Kepler III notation messaging in the “Common Unit Mistakes” slide (lecture 05)

- **Why:** The slide currently undermines the reading’s “do not use $P^2=a^3$ shorthand” policy.
- **Edit targets:**
  - `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1145`
  - `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd:487`
- **Proposed change (minimal):**
  - Replace “Fix: It’s $P^2=a^3$ …” with a unit-safe reminder: either the ratio method or the explicit Sun-only scaling form already used earlier in the deck.

### 6) Add missing symbol/assumption scaffolds where equations first appear in the *main path*

- **Why:** Several decks have the right equations, but the meaning/units/assumptions are sometimes deferred to “deeper dive” slides; the main path should stand alone.
- **Edit targets (high ROI):**
  - Define orbital period symbol: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:652`
  - Define Stefan–Boltzmann constant on first appearance: `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:534` (paired reading defines immediately at `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:484`)
  - Add “Rayleigh regime” assumption: `modules/module-01/slides/lecture-07-light-information-slides.qmd:434` (paired reading defines at `modules/module-01/readings/lecture-07-light-information-reading.qmd:361`)
  - Clarify Kepler step units/assumptions in RV mass example: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:757`
- **Proposed change (minimal):**
  - Add 1–2 line fragments (or `::: notes`) that explicitly state symbol meanings + one assumption + one sanity check when feasible.

### 7) Start using the existing equation registry + meaning cards for “first introduction” slides

- **Why:** The system already exists (`data/equations.yml`, `data/eqcards.yml`, `_includes/equations/*.qmd`) and is the lowest-effort way to standardize “what the equation is saying” across slides/readings.
- **Existing equation IDs available now:**
  - `wave-relation`, `photon-energy`, `wien-displacement`, `stefan-boltzmann`, `newton-gravity`, `flux-luminosity-distance`, `lookback-time`, `kepler`
- **Proposed change (minimal, incremental):**
  - For each lecture, replace the *first* appearance of a canonical equation with:
    - `{{< include _includes/equations/<...>.qmd >}}`
    - `{{< eqrefcard <equation-id> >}}`
  - Leave later repeated uses as-is initially to minimize churn.
- **Known follow-up decision needed (before implementing broadly):**
  - The registry uses `\\nu` for frequency (`wave-relation`, `photon-energy`) while the slides often use `f`. Decide whether to (a) standardize slides to `\\nu`, or (b) update the include files + meaning cards to use `f` for consistency.

### 8) Add equation-system coverage for 4 “missing” canonical relations (to reduce drift)

- **Why:** Several frequently-used equations are not yet in `data/equations.yml`, so their meaning scaffolds drift deck-to-deck.
- **Proposed new equation IDs (names TBD; do not implement until approved):**
  - Doppler (non-relativistic): `doppler-shift`
  - Transit depth: `transit-depth`
  - Equilibrium temperature: `equilibrium-temperature`
  - Drake equation: `drake-equation`
- **Edit targets (first appearances):**
  - Doppler: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:144`
  - Transit: `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:318`
  - Equilibrium temperature: `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:140`
  - Drake: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:123`
- **Proposed change (minimal):**
  - Add `_includes/equations/<id>.qmd` + `data/equations.yml` entry + `data/eqcards.yml` meaning card, then swap the first appearance in slides/readings to `include + eqrefcard`.

### 9) Tighten engagement where it’s currently thin (Lecture 13) and add explicit TPS prompts

- **Why:** Lecture 13 only has two quizzes and is conceptually heavy; adding one or two TPS/quiz moments improves retention without rewriting.
- **Edit targets:**
  - `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:180`
  - `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:574`
- **Proposed change (minimal):**
  - Add one `::: {.quiz}` or TPS slide right after “What We Know (Terms 1–3)” to diagnose which Drake terms Kepler/TESS constrain.
  - Add one short TPS prompt around interpreting `N ≪ 1` vs `N ≫ 1` (expected value language), matching the reading’s framing (`modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:262`).

### 10) Reduce “false precision” drift between slides and readings in worked examples

- **Why:** Some slides use more precise inputs than the paired reading, which can look like we’re “hiding” the answer in precision rather than modeling estimation discipline.
- **Edit targets (examples):**
  - Io orbit distance/period: slides use `421,700 km` while the reading uses `422,000 km` (`modules/module-01/readings/lecture-11-solar-system-reading.qmd:301`; slide occurrence near `modules/module-01/slides/lecture-11-solar-system-slides.qmd:518`)
  - Rounded vs precise “Sun” constants in blackbody slides (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:319` vs `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:865`)
- **Proposed change (minimal):**
  - Prefer a single rounding convention per deck and match the reading where possible (keep extra precision only in explicitly labeled “Deeper Dive” sections).

---

## Post-approval verification (required once edits start)

1. Run `conda run -n astro make render` and fix any errors.
2. Confirm figure ids referenced by `{{< fig >}}` / `{{< img >}}` resolve.
3. Spot-check that slide–reading pairs now agree on:
   - Kepler III notation policy (Lecture 05 and any review checklists).
   - Drake scenario values + “big number” range language (Lecture 13).
   - Equilibrium temperature baseline (Lecture 11 and Lecture 12).

---

## Comprehensive fix inventory (cover everything, including “minor” issues)

This section is the exhaustive checklist derived from the audit. The intent is that after approval we work through these in order, but we can still execute in batches (blockers → alignment → polish) to keep changes reviewable.

### Cross-cutting fixes (apply across multiple lectures)

1) **Base-path correctness for assets and internal links (Module 1 complete; site-wide still `VERIFY`)**
   - **Why:** Root-relative paths like `/assets/...` and `/modules/...` likely break on a GitHub Pages project site unless a `<base href>` is set or paths are rewritten.
   - **Evidence targets (representative):**
     - Slide background examples: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:19`, `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:19`
     - Figure registry paths: `assets/figures.yml:17`
     - Schedule root-relative links: `course-info/schedule.qmd:36`
     - Published URL hints a subpath deploy: `_quarto.yml:24`
   - **Proposed approach (choose one, then apply consistently):**
     - Option A (preferred if supported by Quarto): configure a base URL / base href so root-relative links resolve under `/astr101-sp26/` on GitHub Pages.
     - Option B: eliminate root-relative paths in slides/readings/registry and generate base-path-safe URLs (requires coordinated changes to `assets/figures.yml` and `_extensions/course/shortcodes.lua`).
   - **Implemented for this scope:** updated Module 1 slide background-image paths, updated Module 1 reading demo links, and made `{{< fig >}}` / `{{< img >}}` resolve project-root asset paths correctly from nested pages via `_extensions/course/shortcodes.lua`.
   - **Still `VERIFY` for full-site perfection:** other site pages (e.g., schedule, announcements, and any other root-relative markdown links) should be audited and made base-path safe.

2) **Date metadata consistency (resolved for Presidents’ Day week)**
   - **Why:** Presidents’ Day 2026 is Monday 2026-02-16, so Week 5 shifts to Wed/Fri for the two “lecture” meetings.
   - **Evidence targets:**
     - Lecture 9: `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:5`, `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:5`
     - Lecture 10: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:5`, `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:5`
   - **Implemented:** set Lecture 9 to Wednesday 2026-02-18 and Lecture 10 to Friday 2026-02-20 in both slides + readings.

3) **Equation-meaning compliance (systematize, don’t hand-edit everywhere)**
   - **Why:** For perfection, any displayed equation needs meaning + units + assumptions + a sanity check, at least at first introduction.
   - **Proposed approach:**
     - Use the existing equation system where it exists (`data/equations.yml`, `data/eqcards.yml`, `_includes/equations/*.qmd`) for first introductions.
     - Add new canonical equation ids for missing “core” relations introduced in these lectures (Doppler, transit depth, equilibrium temperature, Drake).
   - **Known consistency decision:** the equation system currently uses `\\nu` in `wave-relation` and `photon-energy`, while slides/readings often use `f`. Decide and standardize.

4) **Engagement cadence: add explicit prediction prompts**
   - **Why:** Several decks rely on quizzes but lack explicit prediction prompts, which the ASTR 101 contract requires.
   - **Proposed approach:** add 1 short “Predict First!” slide per major chunk in the lectures that currently have none (L05, L07, L09–L13).

5) **“Actual: … ✓” policy: remove, or convert to “lab reference”**
   - **Why:** These can accidentally embed unverified facts.
   - **Proposed approach:** if it’s a lab reference value that we teach (e.g., Hα 656.28 nm), label it as such; otherwise remove or move to notes as `VERIFY`.

### Lecture-by-lecture checklist

#### Lecture 05 — Kepler’s Laws

- Fix Kepler III shorthand conflict: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1145` ↔ `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd:487`
- Add meaning scaffold for gravity preview: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:912`
- Define $P$ at first use: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:652`
- Add explicit prediction prompt in Kepler III chunk: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:652`
- Deeper dive alignment (vis-viva preview): `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1222` (decide: add collapsible reading callout vs label in-class-only)
- Equation system adoption for first introductions: `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:657`, `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:912`
- Demo alignment (reading has explicit mission; slides should point to it): `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd:612`, `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1017`

#### Lecture 06 — Newton’s Gravity

- Add units for $F=ma$ when first introduced: `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:221`
- Add explicit gravity-law assumptions once: `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:467`
- Deeper dive alignment (escape velocity): `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:1294` ↔ reading only mentions in preview: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd:1012`
- Equation system adoption for Newton gravity first introduction: `modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:467`
- Demo alignment (reading has mission; slides should point to it): `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd:834`

#### Lecture 07 — Light as Information

- Add Rayleigh regime assumption: `modules/module-01/slides/lecture-07-light-information-slides.qmd:434` ↔ `modules/module-01/readings/lecture-07-light-information-reading.qmd:361`
- Add an explicit prediction prompt: `modules/module-01/slides/lecture-07-light-information-slides.qmd:212` or `modules/module-01/slides/lecture-07-light-information-slides.qmd:591`
- Deeper dive alignment (“1240 eV·nm”): `modules/module-01/slides/lecture-07-light-information-slides.qmd:983`, `modules/module-01/slides/lecture-07-light-information-slides.qmd:998`
- Demo alignment (reading has demo exploration, slides don’t): `modules/module-01/readings/lecture-07-light-information-reading.qmd:575`
- Decide and standardize frequency symbol (`f` vs `\\nu`) before adopting equation registry here.

#### Lecture 08 — Blackbody Radiation

- Define $\sigma$ at first Stefan–Boltzmann appearance (main flow): `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:534` ↔ `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:484`
- Add symbol meanings for $L$, $R$, $T$ when $L=4\\pi R^2\\sigma T^4$ first appears: `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:575`
- Removed unverified “Actual: … ✓” comparison: `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:979`
- Precision/rounding consistency (main vs deeper dive): `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:319`, `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:865`
- Deeper dive alignment (Planck function equation): `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:1056` ↔ reading is qualitative: `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:245`
- Convert first introductions to equation system: `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:319`, `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:575`
- Demo alignment (reading has mission; slides should point to it): `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:620`

#### Lecture 09 — Spectral Lines

- Add $h$ and $c$ definitions or pointer to L7: `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:315`
- Add an explicit prediction prompt: `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:141` or `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:256`
- Reframed the Hα value as a lab reference value: `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:750`
- Deeper dive alignment (Rydberg, multi-electron complications): `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:850`, `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:958`
- Demo alignment (reading has mission; slides should point to it): `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:116`

#### Lecture 10 — Doppler & Telescopes

- Removed unverified “Actual: 0.47 $M_J$”: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:809`
- Clarify Kepler step units/assumptions for $a^3 = M_* P^2$: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:757`
- Remove or soften precision claim in notes: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:737`
- Add an explicit prediction prompt: `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:141` or `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:489`
- Deeper dive alignment (relativistic Doppler / interferometry math): `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:913`, `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:961` ↔ reading is conceptual: `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:250`, `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:640`
- Date metadata consistency: set Lecture 10 to Friday 2026-02-20 (Presidents’ Day week shift): `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:5`, `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:5`
- Demo alignment (reading has mission; slides should point to it): `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:309`

#### Lecture 11 — Solar System

- Fix equilibrium-temperature baseline (blocker): `modules/module-01/slides/lecture-11-solar-system-slides.qmd:592` ↔ `modules/module-01/readings/lecture-11-solar-system-reading.qmd:374`, `modules/module-01/readings/lecture-11-solar-system-reading.qmd:402`
- Removed “Actual” Jupiter mass badge: `modules/module-01/slides/lecture-11-solar-system-slides.qmd:574`
- Add dependence/approx language for “170 K” claim: `modules/module-01/slides/lecture-11-solar-system-slides.qmd:587`
- Align frost line messaging with “not a fixed wall”: `modules/module-01/readings/lecture-11-solar-system-reading.qmd:546`
- Deeper dive alignment (orbital velocities, Roche limit, Lagrange points): `modules/module-01/slides/lecture-11-solar-system-slides.qmd:687`, `modules/module-01/slides/lecture-11-solar-system-slides.qmd:740`, `modules/module-01/slides/lecture-11-solar-system-slides.qmd:796`
- Standardize equilibrium-temperature notation/labels: `modules/module-01/readings/lecture-11-solar-system-reading.qmd:398` ↔ `modules/module-01/slides/lecture-11-solar-system-slides.qmd:592`
- Add an explicit prediction prompt: `modules/module-01/slides/lecture-11-solar-system-slides.qmd:137` or `modules/module-01/slides/lecture-11-solar-system-slides.qmd:383`

#### Lecture 12 — Climates & Exoplanets

- Add an explicit prediction prompt in the equilibrium/greenhouse section: `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:135`
- Deeper dive alignment (atmospheric escape, Rule of Six): `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:787`
- Deeper dive alignment (biosignatures, JWST transmission spectroscopy): `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:811`, `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:835`
- Decide whether these deeper-dive topics are assessed; if yes, mirror them in the reading with collapsible callouts.

#### Lecture 13 — Are We Alone?

- Align Drake scenario values with the reading: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:529` ↔ `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:256`
- Align “total stars” framing with reading range language: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:607` ↔ `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:278`
- Remove or support the “0.14 stars/ly³” density constant: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:785`
- Tone down certainty on “Kepler mission estimate” to match reading’s uncertainty: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:633` ↔ `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:161`
- Replace Kepler III shorthand in exam checklist with unit-safe form: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:807`
- Add at least one quiz in synthesis: `modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:369`
