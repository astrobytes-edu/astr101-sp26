# Module 01 — Lecture Slides Audit (Lectures 5–13)

Date: 2026-02-02  
Scope: paired audits of slides + readings for Lectures 05–13 in `modules/module-01/`.

## Patch status (implemented)

- **Implementation date:** 2026-02-02
- **Verification:** `conda run -n astro make render` succeeded (no render errors). I also scanned the rendered `_site/` output for shortcode error placeholders (e.g., missing figure/equation ids) and did not find any.

## Global notes (applies across 05–13)

- **Notation invariant check:** I did not find any violations of `D = diameter` and `d = distance` in these lecture materials. (Many decks also use `r` for distance-to-source; that is fine as long as `D`/`d` aren’t repurposed.)
- **Equation system adoption:** None of the audited slides/readings currently use the equation registry + meaning-card system (`data/equations.yml`, `data/eqcards.yml`, `_includes/equations/*.qmd`, `{{< eqrefcard >}}`). This is not a render blocker, but it increases drift risk and makes audits/fixes harder.
- **Verification status:** Render verification is now complete (see “Patch status” above).
- **Base-path / absolute-link risk:** For the audited lecture decks and readings (L05–L13), I updated slide background paths and demo links to be base-path safe, and updated the `fig`/`img` shortcodes to resolve project-root asset paths correctly from nested pages. Some other site pages (e.g., `course-info/schedule.qmd`) still contain root-relative markdown links and should be addressed separately if you want site-wide base-path perfection.
- **Date metadata sanity check (resolved for Presidents’ Day week):** Presidents’ Day in 2026 falls on Monday 2026-02-16, so Week 5 has no Monday meeting (`course-info/schedule.qmd:45`). I updated Lecture 9 to Wednesday 2026-02-18 and Lecture 10 to Friday 2026-02-20 in both slides + readings (`modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:5`, `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:5`, `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:5`, `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:5`).
- **Engagement cadence gap (systematic, not just “minor”):** Only L06 and L08 include an explicit “Predict First!” slide (`modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:432`, `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:286`). The other decks rely on quizzes, which are good retrieval practice but do not fully satisfy the “prediction prompt per chunk” standard in `docs/contracts/astr101-pedagogical-contract.md:101`.
- **“Actual: … ✓” fact-check badges:** Several slides include “Actual” comparisons. Some are supported by the paired reading (e.g. Hα lab wavelength appears in the reading), others are not. For perfection, treat these as either “lab reference values” (and teach what they are) or remove them unless we can explicitly verify and consistently present them in both slide + reading.

### Quick engagement summary (slides)

| Lecture | Quizzes | “Predict First!” | Notes |
| --- | ---: | ---: | --- |
| 05 | 7 | 1 | Added a Kepler III prediction prompt (doubling $a$ → what happens to $P$?). |
| 06 | 12 | 1 | Meets the “prediction” minimum; keep. |
| 07 | 9 | 1 | Added a wave-relation prediction prompt (doubling $\lambda$ → what happens to $f$?). |
| 08 | 8 | 2 | Meets “prediction” minimum; keep. |
| 09 | 6 | 1 | Added a Kirchhoff spectrum-type prediction prompt. |
| 10 | 6 | 1 | Added a Doppler sign prediction prompt ($\Delta\lambda > 0$ → toward/away). |
| 11 | 3 | 1 | Added an equilibrium-temperature scaling prediction prompt (distance doubling). |
| 12 | 4 | 1 | Added an equilibrium-temperature scaling prediction prompt (distance doubling). |
| 13 | 3 | 1 | Added an $N\\ll 1$ interpretation prediction prompt; added a toolkit quiz. |

---

## Lecture Audit: modules/module-01/slides/lecture-05-keplers-laws-slides.qmd

Paired reading: `modules/module-01/readings/lecture-05-keplers-laws-reading.qmd`

**Overall:** Needs Work

### Intended throughline

Use the historical puzzle of retrograde motion to motivate model revision, then land on Kepler’s three empirical laws (especially the period–distance scaling) as the “pattern” Newton will later explain.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Strong narrative arc; speaker notes support pacing. |
| Math grammar | ⚠️ | One Kepler-III notation slide contradicts the reading’s notation policy; a preview equation appears without meaning scaffolding. |
| Engagement | ⚠️ | Frequent quizzes, but no explicit prediction prompt slide. |
| Throughline | ✅ | Clear “puzzle → laws → limits → Newton” structure. |
| Figures | ✅ | Uses `{{< fig >}}` consistently for content figures. |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **Kepler III notation conflict (“use $P^2=a^3$”)** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1145`): the slide’s “Fix” text directly contradicts the reading’s explicit policy to avoid the shorthand because it hides units and Sun-mass assumptions (`modules/module-01/readings/lecture-05-keplers-laws-reading.qmd:487`).
   - **Fix:** Replace the “Fix” line to point to the unit-safe forms used earlier in the deck (ratio method and/or Sun-only scaling), e.g. reference `(\!P/1\,\text{yr}\!)^2=(\!a/1\,\text{AU}\!)^3` rather than “$P^2=a^3$”.

2. **Equation shown without meaning scaffold (gravity preview)** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:912`): the gravitational force law is introduced without symbol meanings/assumptions, which violates the slide-level equation handling contract.
   - **Fix:** Add a short meaning scaffold (on-slide or in `::: notes`) defining symbols + what it predicts + one assumption (two-body / Newtonian / point-mass approximation).

### Recommendations (should fix)

1. **Define $P$ at first Kepler III appearance** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:652`): the deck defines $a$ but never explicitly defines $P$ before using it in the headline law.
   - **Fix:** Add a 1-line symbol definition fragment on the Kepler III intro slide (e.g., “$P$ = orbital period (time per orbit)”).

2. **Align “unit analysis” phrasing with the reading’s caution language** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1087`): the slide says “$P^2=a^3$ only works with these specific units,” which is correct, but the deck later uses the shorthand casually on the “Common Unit Mistakes” slide (see critical issue).
   - **Fix:** After fixing the “Common Unit Mistakes” slide, consider adding a brief “don’t memorize the shorthand” reminder to keep messaging consistent.

3. **Add an explicit “Predict First!” moment in the Kepler III chunk** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:652`): quizzes are present, but the course contract calls for prediction prompts.
   - **Fix:** Insert a short prediction slide just before introducing the formula (“If $a$ doubles, does $P$ double, quadruple, or something else?”), then reveal the scaling $P \\propto a^{3/2}$.

4. **Deeper dive alignment: Vis-Viva is slide-only** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1222`): the vis-viva preview introduces a new equation and symbols late in the deck.
   - **Fix:** Either add a collapsible “Deeper Dive” callout in the paired reading that mirrors this preview (and states assumptions), or explicitly label it as “in-class only / not assessed” in slides and keep it out of the reading.

5. **Use the equation system for first introductions (reduce drift)** (`modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:657`, `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:912`).
   - **Fix:** Replace the first appearance of Kepler scaling and the gravity preview with `include + eqrefcard` (or add equivalent meaning scaffolds) so symbol meaning/assumptions are standardized across slides and readings.

6. **Demo alignment (reading has an explicit demo mission; slides only reference it briefly)** (`modules/module-01/readings/lecture-05-keplers-laws-reading.qmd:612`, `modules/module-01/slides/lecture-05-keplers-laws-slides.qmd:1017`).
   - **Fix:** Add a short in-class slide or speaker-note callout that explicitly points students to the same “Demo Exploration” mission framing used in the reading.

---

## Lecture Audit: modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd

Paired reading: `modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd`

**Overall:** Pass (pending verification)

### Intended throughline

Build Newton’s three laws as a toolkit, then show how universal gravitation plus circular motion explains Kepler and enables mass inference from orbital data.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Good “concept → check → application” rhythm. |
| Math grammar | ✅ | Key equations are accompanied by interpretation tables and checks. |
| Engagement | ✅ | Contains explicit prediction moment plus frequent quizzes. |
| Throughline | ✅ | Clean “rules of motion → gravity → explains Kepler → measure mass” arc. |
| Figures | ✅ | Uses registry-based figures (e.g. `gravity-equation-visual`, `inverse-square-diagram`). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **None found in this audit pass.** (`VERIFY`: still run `conda run -n astro make render` before teaching/publishing.)

### Recommendations (should fix)

1. **Make units explicit on the first appearance of $F=ma$** (`modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:221`).
   - **Fix:** Add a compact “symbol + units” line (force in N, mass in kg, acceleration in m/s²) either on-slide or in notes.

2. **Flag the gravitational-law validity assumptions once** (`modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:467`).
   - **Fix:** Add a short note (“works well for point-mass / spherically symmetric objects; Newtonian regime”) to model “assumptions” explicitly.

3. **Deeper dive alignment: escape velocity content is slide-heavy** (`modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:1294`): the paired reading only mentions escape velocity as a future topic (`modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd:1012`).
   - **Fix:** Either add a collapsible “Deeper Dive” section to the reading that mirrors the escape-velocity/orbital-velocity slides, or explicitly label the slides as “optional/in-class only” and ensure they are not required for reading-based assessment.

4. **Adopt the equation system for the first appearance of Newton gravity** (`modules/module-01/slides/lecture-06-newtons-gravity-slides.qmd:467`).
   - **Fix:** Swap the first appearance to `include + eqrefcard` using the existing registry entry (`data/equations.yml` has `newton-gravity`) to standardize symbol meaning and assumptions.

5. **Demo alignment (reading includes a demo exploration; slides do not reference it)** (`modules/module-01/readings/lecture-06-newtons-gravity-reading.qmd:834`).
   - **Fix:** Add a slide or speaker-note callout pointing students to the “Motion Reveals Mass” demo mission so pre-class and in-class artifacts reinforce each other.

---

## Lecture Audit: modules/module-01/slides/lecture-07-light-information-slides.qmd

Paired reading: `modules/module-01/readings/lecture-07-light-information-reading.qmd`

**Overall:** Pass (pending verification)

### Intended throughline

Establish light as a measurable wave with a spectrum, then show how interactions with matter (scattering) and geometric spreading (inverse-square) turn light into an inference engine.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Strong “light reveals everything else” framing. |
| Math grammar | ✅ | Equations generally paired with interpretation and unit checks in worked examples. |
| Engagement | ⚠️ | Frequent quizzes, but no explicit prediction prompt slide. |
| Throughline | ✅ | Wave → spectrum → scattering → inverse-square → inference. |
| Figures | ✅ | Uses registry figures (`electromagnetic-wave`, `jwst-em-spectrum`, `light-inverse-square`, etc.). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **None found in this audit pass.** (`VERIFY`: still run `conda run -n astro make render` before teaching/publishing.)

### Recommendations (should fix)

1. **State the Rayleigh-scattering regime assumption** (`modules/module-01/slides/lecture-07-light-information-slides.qmd:434`): the reading defines Rayleigh scattering as “particles smaller than the wavelength” (`modules/module-01/readings/lecture-07-light-information-reading.qmd:361`), but the slide equation omits that condition.
   - **Fix:** Add a short “valid when scatterers ≪ wavelength” line (on-slide or in notes).

2. **Add at least one explicit prediction prompt** (`modules/module-01/slides/lecture-07-light-information-slides.qmd:212` or `modules/module-01/slides/lecture-07-light-information-slides.qmd:591`).
   - **Fix:** Insert a short “Predict First!” slide before revealing the wave relation or inverse-square scaling.

3. **Deeper dive mismatch: “1240 eV·nm” appears in slides but not in the reading** (`modules/module-01/slides/lecture-07-light-information-slides.qmd:983`, `modules/module-01/slides/lecture-07-light-information-slides.qmd:998`).
   - **Fix:** Add a collapsible callout in the reading that derives/justifies the 1240 shortcut (or remove the “memorize” language in slides and keep it as optional instructor enrichment).

4. **Demo alignment (reading mentions a demo; slides do not)** (`modules/module-01/readings/lecture-07-light-information-reading.qmd:575`).
   - **Fix:** Add one slide (or speaker-note callout) that points students to the demo exploration so pre-class and in-class artifacts reinforce each other.

---

## Lecture Audit: modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd

Paired reading: `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd`

**Overall:** Needs Work

### Intended throughline

Use blackbody radiation as a “remote thermometer” (Wien) and “power meter” (Stefan–Boltzmann), then connect temperature + luminosity + radius as the inference bridge to stellar classification and spectral lines.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Strong conceptual sequencing; “Sun is green” misconception is well surfaced. |
| Math grammar | ⚠️ | Core equations appear before symbol meanings/units are introduced in the main path. |
| Engagement | ✅ | Two prediction prompts + multiple quizzes. |
| Throughline | ✅ | Wien → color puzzle → Stefan–Boltzmann → L–T–R → limits of blackbodies. |
| Figures | ✅ | Uses registry figures (`blackbody-spectrum-temps`, `betelgeuse-size-eso`, etc.). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **Stefan–Boltzmann shown without defining $\sigma$ (main flow)** (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:534`): the reading defines $\sigma$ immediately (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:484`), but the slide introduces the equation without symbol meaning/units until much later in the “Sun’s luminosity” calculation.
   - **Fix:** Add a compact meaning line on the Stefan–Boltzmann slide (define $\sigma$ as a constant; optionally include units/value or state “value not required today”), and state the “blackbody approximation” assumption once.

### Recommendations (should fix)

1. **Add symbol meanings for $L$, $R$, $T$ when $L=4\pi R^2\sigma T^4$ first appears** (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:575`).
   - **Fix:** Add a 1–2 line glossary fragment (luminosity = total power, radius = size, temperature in K).

2. **Avoid unearned precision drift in constants/inputs** (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:319`, `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:865`): the main flow uses rounded values (e.g., 2,900,000 nm·K; 5800 K), while deeper-dive sections switch to more precise values (e.g., 2.898×10⁶; 5778 K).
   - **Fix:** Add an explicit “rounded vs. precise” note or standardize to one convention per deck (rounded in main, precise only in labeled advanced slides).

3. **Remove/soften “Actual: … ✓” where not present in the paired reading** (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:979`).
   - **Fix:** Replace with “Published value (VERIFY)” or remove the parenthetical to comply with the “no fabricated numbers” rule.

4. **Deeper dive alignment: Planck function details are slide-heavy** (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:1056`): the reading explains the ultraviolet catastrophe and Planck’s idea qualitatively (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:245`) but does not mirror the full equation-level treatment.
   - **Fix:** Either add a collapsible “Deeper Dive: Planck function” block in the reading, or explicitly label the slide section as “in-class only / not assessed” and keep it out of the reading.

5. **Equation system adoption (reduce drift across L7–L9)** (`modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:319`, `modules/module-01/slides/lecture-08-blackbody-radiation-slides.qmd:575`).
   - **Fix:** Swap first appearances of Wien and Stefan–Boltzmann to `include + eqrefcard` using the existing registry entries (`wien-displacement`, `stefan-boltzmann`).

6. **Demo alignment (reading includes a demo exploration; slides do not reference it)** (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:620`).
   - **Fix:** Add a slide or speaker-note callout to the Blackbody Radiation demo mission to keep slide and reading workflows aligned.

---

## Lecture Audit: modules/module-01/slides/lecture-09-spectral-lines-slides.qmd

Paired reading: `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`

**Overall:** Pass (pending verification)

### Intended throughline

Move from “missing colors” to Kirchhoff’s empirical laws, then explain discrete spectral lines via quantized energy levels and connect spectra to stellar classification.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Clear “data → explanation” flow. |
| Math grammar | ✅ | Worked example includes unit checks and stepwise reasoning. |
| Engagement | ⚠️ | Multiple quizzes, but no explicit prediction prompt slide. |
| Throughline | ✅ | Kirchhoff → quantum → hydrogen → OBAFGKM. |
| Figures | ✅ | Uses registry figures (`kirchhoff-three-laws`, `hydrogen-energy-levels`, etc.). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **None found in this audit pass.** (`VERIFY`: still run `conda run -n astro make render` before teaching/publishing.)

### Recommendations (should fix)

1. **Define $h$ and $c$ on first appearance of $E=hc/\\lambda$ (or point back to L7)** (`modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:315`).
   - **Fix:** Add a small fragment (“$h$ = Planck constant; $c$ = speed of light”) or explicitly use the “1240 eV·nm” shortcut immediately.

2. **Treat “Actual” wavelength values as reference data (not a fact-check badge)** (`modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:750`).
   - **Fix:** If keeping the “Actual” column, add a brief note that these are laboratory-measured reference wavelengths (and ensure they match the reading’s listed values).

3. **Add at least one explicit prediction prompt** (`modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:141` or `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:256`).
   - **Fix:** Example: before revealing Kirchhoff’s laws, have students predict what spectrum type they expect from “hot gas alone” vs “hot object behind cooler gas”.

4. **Deeper dive mismatch: Rydberg / multi-electron complications are slide-only** (`modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:850`, `modules/module-01/slides/lecture-09-spectral-lines-slides.qmd:958`).
   - **Fix:** Either add collapsible reading callouts mirroring these deeper-dive slides or explicitly label them as “in-class only / not assessed”.

5. **Demo alignment (reading includes a demo exploration; slides do not reference it)** (`modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:116`).
   - **Fix:** Add a slide or speaker-note callout that references the Spectral Lines Lab missions so students see continuity between pre-class reading and in-class activity.

---

## Lecture Audit: modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd

Paired reading: `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`

**Overall:** Needs Work

### Intended throughline

Show how motion imprints on spectra (Doppler), then apply “motion reveals mass” to exoplanets and galaxies, and finish with telescope design as the practical measurement interface.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Good “physics → inference → tool” cadence. |
| Math grammar | ⚠️ | One “Actual: … ✓” claim lacks support in the paired reading; a few unit/assumption notes would reduce confusion. |
| Engagement | ⚠️ | Multiple quizzes, but no explicit prediction prompt slide. |
| Throughline | ✅ | Doppler → wobble → mass inference → instruments. |
| Figures | ✅ | Uses registry figures (`radial-velocity-method`, `galaxy-rotation-curve`, etc.). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **Unsourced “Actual: 0.47 $M_J$” checkmark** (`modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:809`): the paired reading does not provide this value, and the slide presents it as a verified fact.
   - **Fix:** Remove the “Actual” parenthetical, or replace with “Published value (VERIFY)” and provide a concrete verification step in notes (e.g., “verify from a trusted catalog before publishing”).

### Recommendations (should fix)

1. **State the unit system/assumptions for the Kepler step ($a^3 = M_* P^2$)** (`modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:757`).
   - **Fix:** Add “AU, years, solar masses; assumes $M_p \\ll M_*$” in a small fragment or notes.

2. **Avoid asserting measurement precision without source** (`modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:737`).
   - **Fix:** Rephrase as “modern spectrographs can reach ~m/s precision (VERIFY)” or drop the number.

3. **Add an explicit prediction prompt in Part 1 or Part 2** (`modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:141` or `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:489`).
   - **Fix:** Example: “If the observed line shifts to longer wavelength, is the source approaching or receding?” or “If diameter doubles, does resolution double or halve?”.

4. **Deeper dive alignment: advanced redshift/interferometry math is slide-only** (`modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:913`, `modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:961`): the reading mentions cosmological redshift and interferometry conceptually (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:250`, `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:640`) but does not mirror the detailed equations.
   - **Fix:** Add collapsible “Deeper Dive” callouts in the reading for these math sections or label them “in-class only / not assessed”.

5. **Date metadata consistency** (`modules/module-01/slides/lecture-10-doppler-telescopes-slides.qmd:5`, `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:5`): resolved for Presidents’ Day week by setting Lecture 10 to Friday 2026-02-20.

6. **Demo alignment (reading includes a demo exploration; slides do not reference it)** (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:309`).
   - **Fix:** Add a slide or speaker-note callout to the Doppler Shift Spectrometer demo missions to reinforce the reading’s workflow.

---

## Lecture Audit: modules/module-01/slides/lecture-11-solar-system-slides.qmd

Paired reading: `modules/module-01/readings/lecture-11-solar-system-reading.qmd`

**Overall:** Fail (science/consistency blocker)

### Intended throughline

Apply the Module 1 toolkit (gravity, light, spectra) to the Solar System’s architecture and origin story: we infer composition, mass, and formation history from remote measurements.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Strong “toolkit applied to real worlds” framing. |
| Math grammar | ❌ | A key equilibrium-temperature assumption contradicts the reading and later climate lecture; this impacts a quantitative inference (frost line). |
| Engagement | ⚠️ | Quizzes are present, but no explicit prediction prompt slide. |
| Throughline | ✅ | Architecture → toolkit → formation → frost line inference. |
| Figures | ✅ | Uses registry figures (`solar-system-architecture`, `nebular-hypothesis`, `protoplanetary-disk`). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **Incorrect/contradictory equilibrium-temperature baseline** (`modules/module-01/slides/lecture-11-solar-system-slides.qmd:592`): the slide claims “Earth’s equilibrium temp ~280 K,” but the paired reading explicitly defines Earth’s equilibrium temperature as ~255 K (`modules/module-01/readings/lecture-11-solar-system-reading.qmd:402`), and treats equilibrium as “no atmosphere” baseline (`modules/module-01/readings/lecture-11-solar-system-reading.qmd:374`).
   - **Fix:** Replace the 280 K baseline with the reading-consistent equilibrium framework (and make the assumptions explicit). If the frost-line calculation is retained, it should use a consistent equilibrium baseline and clearly state whether albedo is included.

2. **Unsourced “Actual: … ✓” checkmark for Jupiter mass** (`modules/module-01/slides/lecture-11-solar-system-slides.qmd:574`): the paired reading uses a rounded value without presenting a fact-check badge (`modules/module-01/readings/lecture-11-solar-system-reading.qmd:329`).
   - **Fix:** Remove the “Actual” parenthetical or mark it as `VERIFY` in notes before publishing.

### Recommendations (should fix)

1. **Treat the “170 K” ice stability claim as an approximation, and name the dependence** (`modules/module-01/slides/lecture-11-solar-system-slides.qmd:587`).
   - **Fix:** Add “order-of-magnitude / pressure-dependent (VERIFY)” language to avoid a hard threshold that could be misleading.

2. **Align frost-line messaging with the reading’s “not a fixed wall” framing** (`modules/module-01/readings/lecture-11-solar-system-reading.qmd:546`).
   - **Fix:** Once the equilibrium-temperature baseline is corrected, add a brief note that the snow line moves over time and depends on disk conditions.

3. **Deeper dive mismatch: orbital velocities / Roche / Lagrange are slide-only** (`modules/module-01/slides/lecture-11-solar-system-slides.qmd:687`, `modules/module-01/slides/lecture-11-solar-system-slides.qmd:740`, `modules/module-01/slides/lecture-11-solar-system-slides.qmd:796`).
   - **Fix:** Add collapsible reading callouts mirroring these slides or label them “in-class only / not assessed”.

4. **Notation consistency: $T_{eq}$ vs `T_equilibrium`** (`modules/module-01/readings/lecture-11-solar-system-reading.qmd:398`, `modules/module-01/slides/lecture-11-solar-system-slides.qmd:592`).
   - **Fix:** Standardize the label used for equilibrium temperature across slides and reading (either symbol + subscript everywhere or the spelled-out table header everywhere).

5. **Add an explicit prediction prompt** (`modules/module-01/slides/lecture-11-solar-system-slides.qmd:137` or `modules/module-01/slides/lecture-11-solar-system-slides.qmd:383`).
   - **Fix:** Example: “Before we compute: would doubling distance change $T_{eq}$ by 2×, 4×, or √2×?” then reveal the inverse-square/square-root scaling.

---

## Lecture Audit: modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd

Paired reading: `modules/module-01/readings/lecture-12-climates-exoplanets-reading.qmd`

**Overall:** Pass (pending verification)

### Intended throughline

Use equilibrium temperature as the “first-guess” model for climates, show why atmospheres create deviations (greenhouse), then connect detection methods (transit/RV) to habitability inference.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Clear “prediction vs reality” framing across Venus/Mars/Earth. |
| Math grammar | ✅ | Derivation is stepwise with units and sanity checks. |
| Engagement | ⚠️ | Quizzes are present, but no explicit prediction prompt slide. |
| Throughline | ✅ | Climate model → greenhouse → exoplanet methods → habitability caveats. |
| Figures | ✅ | Uses registry figures (`greenhouse-effect`, `transit-light-curve`, `habitable-zone`). |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **None found in this audit pass.** (`VERIFY`: still run `conda run -n astro make render` before teaching/publishing.)

### Recommendations (should fix)

1. **If the “Deeper Dive” content is intended for students, ensure the reading also contains it or explicitly labels it as optional** (`modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:761`).
   - **Fix:** Add a one-line note in the reading pointing to the optional slide content, or move the key idea into a collapsible callout in the reading (only if you want students to study it).

2. **Add an explicit prediction prompt** (`modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:135`).
   - **Fix:** Example: “If albedo increases, does $T_{eq}$ increase or decrease?” then reveal the $(1-A)^{1/4}$ dependence in the derivation slides.

3. **Deeper dive mismatch: biosignatures / JWST transmission spectroscopy are slide-only** (`modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:811`, `modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:835`).
   - **Fix:** Add collapsible reading sections for these topics or label them “in-class only / not assessed”.

4. **Deeper dive mismatch: atmospheric escape “Rule of Six” is slide-only** (`modules/module-01/slides/lecture-12-climates-exoplanets-slides.qmd:787`).
   - **Fix:** Add a reading callout that clearly labels this as a heuristic (with assumptions) or remove it from student-facing artifacts if it won’t be assessed.

---

## Lecture Audit: modules/module-01/slides/lecture-13-are-we-alone-slides.qmd

Paired reading: `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd`

**Overall:** Pass

### Intended throughline

Use the Drake Equation as an “uncertainty map,” contrast what exoplanet science has constrained versus what remains unknown, then use the Fermi Paradox to motivate scientific humility and next-step questions.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Strong framing; good synthesis role for end of module. |
| Math grammar | ✅ | Slides now match reading’s scenario framing; removed unsourced “radio bubble” constants and avoided unsourced planet-count arithmetic. |
| Engagement | ✅ | Added an explicit prediction prompt ($N\\ll 1$ meaning) and an additional synthesis quiz linking tools → inferences. |
| Throughline | ✅ | Drake → unknowns → Fermi → synthesis. |
| Figures | ✅ | Uses registry figure for Drake scenarios in the reading; slides should stay aligned. |
| Verification | ✅ | `conda run -n astro make render` passed. |

### Critical Issues (must fix)

1. **None (resolved in patch).**

### Recommendations (should fix)

1. **Keep the “~22%” statement explicitly uncertainty-framed (as in the reading)** (`modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:666` vs `modules/module-01/readings/lecture-13-are-we-alone-reading.qmd:161`).
   - **Fix:** Ensure slides present this as “some studies suggest… estimates vary” rather than a single settled fact.

2. **Kepler III notation consistency (resolved)** (`modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:822`).
   - **Fix:** Done: replaced with Sun-only scaling form.

3. **Synthesis retrieval practice (resolved)** (`modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:373`).
   - **Fix:** Done: added a toolkit quiz linking a measurement to the inferred property.

4. **Deeper dive mismatch: radio bubble calculation uses constants not in the reading** (`modules/module-01/slides/lecture-13-are-we-alone-slides.qmd:790`).
   - **Fix:** Keep this slide qualitative/order-of-magnitude unless the constants are introduced in the paired reading.
