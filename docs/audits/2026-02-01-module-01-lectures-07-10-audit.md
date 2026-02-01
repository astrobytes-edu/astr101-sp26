# Module 01 Audit — Lectures 7–10 (Light → Temperature → Spectra → Doppler → Telescopes)

Date: 2026-02-01  
Scope:
- `modules/module-01/readings/lecture-07-light-information-reading.qmd`
- `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd`
- `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`
- `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`
- Figures in `assets/images/module-01/week-04/` (especially `absorption-emission-spectra-jwst.png`)
- Related demos in `demos/` and `demos/_instructor/`

## Executive Summary (honest + actionable)

**Overall:** Lectures 7–8 are pedagogically strong and essentially ready pending a small number of figure completions. Lectures 9–10 have solid narrative and correct core physics, but are **not publish-ready** because multiple `{{< fig ... >}}` IDs are missing from `assets/figures.yml`, so the rendered pages show explicit error text.  

**Top priorities (must fix before students rely on these pages):**
1. **Fix missing figure IDs in L9 and L10** — currently renders `[ERROR: Figure '...' not found in registry]` because the `fig` shortcode hard-fails missing IDs (`_extensions/course/shortcodes.lua:252-263`).  
2. **Move spectra-setup figures out of L8 and into L9** so L8 stays focused on blackbodies and L9 owns “spectral fingerprints” (L8 currently embeds hydrogen absorption/emission figures in its transition section: `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:745-764`).  
3. **Resolve remaining “FIGURE PLACEHOLDER” blocks** in L7 and L8 (not blockers for render, but they are pedagogical gaps and create student uncertainty).

**Verification:** All four files render with `quarto render` (2026-02-01), but L9/L10 output contains figure-error text due to missing registry IDs (confirmed by searching `_site/.../*.html` for `"[ERROR: Figure"`).  

---

## Lecture Audit: `modules/module-01/readings/lecture-07-light-information-reading.qmd`

**Overall:** Needs Work (content is strong; a few factual `VERIFY` items + 3 figure placeholders)

### Throughline (1–2 sentences)
Light is an information channel: wavelength/frequency encode “what kind of light,” scattering changes what reaches us, and inverse-square geometry turns brightness into distance inference.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Consistent narrative voice with short, purposeful lists; frequent “predict first” prompts. |
| Math grammar | ✅ | Core relations are stated with meaning + units and are used in short, interpretable calculations (`c=λf`, Rayleigh scaling, inverse-square). |
| Engagement | ✅ | Many “Check Yourself” items and demo missions; cadence is strong. |
| Throughline | ✅ | Explicitly ties L5–L6 → L7 and previews L8 (`modules/module-01/readings/lecture-07-light-information-reading.qmd:79-82`, `:685-697`). |
| Figures | ⚠️ | Three explicit placeholders remain and block the visual story at key moments (`:83`, `:370`, `:394`). |
| Verification | ✅ | `quarto render` succeeds (2026-02-01). |

### Critical Issues (must fix)

1. **Three “FIGURE PLACEHOLDER” callouts remain** (`modules/module-01/readings/lecture-07-light-information-reading.qmd:83`, `:370`, `:394`).
   - **Why it matters:** These are the *exact* conceptual pivots where students benefit most from a picture (information-from-light hook; scattering geometry; sunset path length). Leaving placeholders increases cognitive load and invites misconceptions (“sky is blue because it *is* blue”).
   - **Fix:** Create/register 3 figures and replace placeholders with `{{< fig ... >}}`:
     - `proxima-centauri-info` (hook)
     - `rayleigh-scattering-sky` (mechanism)
     - `sunset-scattering` (geometry change)

### Recommendations (should fix)

1. **Mark a couple of numeric claims as explicitly approximate or VERIFY** (`modules/module-01/readings/lecture-07-light-information-reading.qmd:71`, `:500-502`).
   - **Issue:** “multiple confirmed planets” around Proxima Centauri is plausibly correct but time-sensitive; the “Pinatubo → dark eclipses for about two years” claim may be correct but is specific.
   - **Fix:** Add “(approximately)” language or a `VERIFY` note in instructor-only prep; avoid hard numbers unless you’re comfortable defending them in 2026.

2. **Tighten one over-strong phrasing** (`modules/module-01/readings/lecture-07-light-information-reading.qmd:342-344`).
   - **Issue:** “sunlight is white light — a mix of all visible wavelengths” is correct; “contains all colors equally” is not literally true.
   - **Fix:** Replace “equally” with “in a broad spread” (keeps concept without inviting nitpicks).

---

## Lecture Audit: `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd`

**Overall:** Needs Work (excellent pedagogy; 2 placeholders; spectra figures should move to L9)

### Throughline (1–2 sentences)
Thermal spectra turn an observable (spectrum shape/peak) into temperature and power inferences (Wien + Stefan–Boltzmann), which then connect to radius and the “giants vs dwarfs” idea.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Clear and engaging; good anticipation of student confusions (“peak depends on plotting,” etc.). |
| Math grammar | ✅ | Strong: unit checks + worked examples + interpretation (“what this means”) appear consistently (e.g., `modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:297-327`, `:485-545`). |
| Engagement | ✅ | Predict-first prompts and frequent checks; demo mission is well-scaffolded. |
| Throughline | ✅ | Explicitly sets up spectral lines as the “missing information” and previews L9. |
| Figures | ⚠️ | Two placeholders remain; also, two spectral-line figures are placed in L8’s transition section and should be owned by L9 (`:80`, `:567`, `:745-764`). |
| Verification | ✅ | `quarto render` succeeds (2026-02-01). |

### Critical Issues (must fix)

1. **Move spectral-lines setup figures to Lecture 9** (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:745-764`).
   - **Why it matters:** L8 is already cognitively dense (Wien + Stefan–Boltzmann + L–T–R). The hydrogen absorption/emission pair is perfect for L9, where students are mentally primed for “fingerprints.”
   - **Fix:** Remove the 2-column figure block from L8 and reinsert it early in L9 (see L9 figure plan below). Keep L8’s transition as text-only or use a single “types of spectra” figure as a teaser.

2. **Two “FIGURE PLACEHOLDER” callouts remain** (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:80`, `:567`).
   - **Fix:** Create/register:
     - `infrared-thermal-image` (photo or high-quality schematic)
     - `giant-vs-dwarf` (SVG recommended — see Figure Plan)

### Recommendations (should fix)

1. **Consider adding one explicit “units sanity check” sentence for Stefan–Boltzmann** (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:485-492`).
   - **Fix:** A one-line “(W/m²) = (W/m²/K⁴)·K⁴” helps reduce symbol anxiety.

---

## Lecture Audit: `modules/module-01/readings/lecture-09-spectral-lines-reading.qmd`

**Overall:** Fail (good text; broken/missing figure registry IDs mean the page renders with explicit errors)

### Throughline (1–2 sentences)
Spectral lines are physical fingerprints: Kirchhoff’s setups explain *how* lines appear, quantized energy levels explain *why* lines are discrete, and the OBAFGKM sequence connects spectra to temperature and stellar properties.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Strong narrative; good “why this matters” framing. |
| Math grammar | ✅ | Hydrogen deep dive is well done and interpretable (energy levels → photon energy → wavelength) (`modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:263-387`). |
| Engagement | ✅ | Frequent checks; good “wrong model first” prompts. |
| Throughline | ✅ | Connects L8 → L10 cleanly. |
| Figures | ❌ | Multiple `{{< fig ... >}}` IDs are missing from `assets/figures.yml` and render as error text (`:73`, `:126`, `:242`, `:331`, `:516`). |
| Verification | ⚠️ | `quarto render` succeeds but output contains `[ERROR: Figure '...' not found in registry]` because missing IDs are handled by the shortcode (`_extensions/course/shortcodes.lua:252-263`). |

### Critical Issues (must fix)

1. **Missing figure IDs break the page’s credibility** (`modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:73`, `:126`, `:242`, `:331`, `:516`).
   - **Why it matters:** Students see literal error strings in the reading; this undermines trust right at the moment you’re asking them to treat spectra as “data.”
   - **Fix (minimum viable):** Replace missing IDs with existing registered week-04 figures where possible, and create SVGs for the rest:
     - Replace `kirchhoff-three-laws` → `types-of-spectra-jwst` (already registered) (`assets/figures.yml` entry near the week-04 block).
     - Replace `hr-diagram-preview` → `hr-diagram` (already registered) (`assets/figures.yml:16-21`).
     - For the other three, either (a) register existing assets if they exist, or (b) create new SVGs (recommended): `fraunhofer-lines`, `energy-level-ladder`, `hydrogen-energy-levels`.

2. **Spectra figures currently live in L8, but L9 needs them** (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:760-764`).
   - **Fix:** Move `absorption-of-light-hydrogen-jwst` and `emission-of-light-hydrogen-jwst` into L9 Part 1 immediately after introducing absorption vs emission.

### Recommendations (should fix)

1. **Add “schematic vs real” framing when using multi-element line charts** (if you use `absorption-emission-spectra-jwst`).
   - **Issue:** The figure is excellent for the “same wavelengths” message, but it can accidentally suggest that real stellar spectra look like tidy, isolated lines for a few elements.
   - **Fix:** Caption add-on: “Real stellar spectra contain many overlapping lines; here we’re isolating the idea that each element has a repeatable fingerprint.”

2. **Make the Sun-composition numbers explicitly approximate** (`modules/module-01/readings/lecture-09-spectral-lines-reading.qmd:179`).
   - **Fix:** Add “approximately” (keeps the conceptual takeaway without making the reading feel like it requires memorizing fractions).

---

## Lecture Audit: `modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd`

**Overall:** Fail (good text; missing figure IDs leave error strings in the rendered page)

### Throughline (1–2 sentences)
Spectral fingerprints become kinematics: Doppler shifts turn wavelength offsets into velocities, which then power two “wow” inferences (exoplanets and dark matter) — and telescopes set the measurement limits.

### Scores

| Dimension | Score | Notes |
| --- | --- | --- |
| Voice | ✅ | Clear, confident, and misconception-aware (good “redshift naming” and “Doppler vs cosmological” warnings). |
| Math grammar | ✅ | Doppler formula is defined with sign conventions; worked example is clean (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:126-139`, `:262-286`). |
| Engagement | ✅ | Predict-first + checks + two rich applications (RV exoplanets; Rubin/dark matter). |
| Throughline | ✅ | The “Motion reveals mass + light carries information” synthesis is excellent (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:105-108`). |
| Figures | ❌ | Three missing `fig` IDs render as error strings (`:187`, `:317`, `:378`). |
| Verification | ⚠️ | `quarto render` succeeds but output contains `[ERROR: Figure ...]` strings due to missing registry IDs (`_extensions/course/shortcodes.lua:252-263`). |

### Critical Issues (must fix)

1. **Missing figure IDs in L10** (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:187`, `:317`, `:378`).
   - **Fix:** Replace or create:
     - `radial-vs-transverse` (SVG recommended — line-of-sight vs across-sky)
     - `radial-velocity-method` (SVG recommended — star wobble + RV curve)
     - `galaxy-rotation-curve` → consider using existing `rotation-curve` (already registered for Module 4: `assets/figures.yml:926-929`) or create a Module 1 version with consistent styling.

### Recommendations (should fix)

1. **Add a direct demo bridge from Doppler → binary-orbits** (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:307-351`).
   - **Fix:** A one-sentence link like “See the wobble geometry in `/demos/binary-orbits/`” would connect kinematics to the orbit visual students already trust.

2. **Optionally add one sentence about the limits of the non-relativistic Doppler approximation** (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:126-139`).
   - **Fix:** “For high velocities/redshifts we use a relativistic formula (later).” This prevents a common “why doesn’t this work for galaxies at z=2?” question.

---

## Figures Audit — `assets/images/module-01/week-04/` (with placement recommendations)

### What’s strong (keep and use more)

The week-04 figure set is coherent and high-value. Several assets are already used well in L7–L8:
- `electromagnetic-wave` (L7) (`modules/module-01/readings/lecture-07-light-information-reading.qmd:139`)
- `em-spectrum-full` (L7) (`modules/module-01/readings/lecture-07-light-information-reading.qmd:208`)
- `blackbody-spectrum-temps`, `sun-spectrum-green`, `star-colors-temperature`, `betelgeuse-size-eso` (L8) (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:237`, `:394`, `:432`, `:595`)

### The requested figure: `absorption-emission-spectra-jwst.png`

Registry ID: `absorption-emission-spectra-jwst` (already registered).  
Pedagogical read: excellent for the single targeted claim “absorption and emission lines match the same wavelengths for a given element.” It belongs in **Lecture 9** after Kirchhoff’s laws, not in Lecture 8.

**Misconception to guard against:** Students may infer “real stellar spectra are clean, isolated lines for a few elements.”  
**Mitigation:** Pair it with either (a) a real stellar spectrum image/plot (e.g., `altair-spectrum-jwst`) or (b) a one-sentence caption note that real spectra contain many blended lines.

### “Move to L9” plan (spectra-related assets)

Move these from L8 to L9:
- `absorption-of-light-hydrogen-jwst` and `emission-of-light-hydrogen-jwst` currently in L8 (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:760-764`)

Add these into L9 Part 1:
- `types-of-spectra-jwst` (best visual for Kirchhoff’s three laws)
- `absorption-emission-spectra-jwst` (deep-dive reinforcement)
- `altair-spectrum-jwst` (bridges “pretty strip” ↔ “data plot” and shows absorption dips)
- `light-matter-interactions` (optional conceptual support if you want one “mechanism panel” figure)

### Missing figures to create as SVG (recommendations)

These should be SVGs (misconception-resistant, theme-consistent, reusable in slides):
- L7: `proxima-centauri-info`, `rayleigh-scattering-sky`, `sunset-scattering`
- L8: `giant-vs-dwarf` (same color/temperature, different radius and luminosity)
- L9: `fraunhofer-lines` (solar spectrum with labeled missing wavelengths), `energy-level-ladder`, `hydrogen-energy-levels` (energy-level diagram with transitions)
- L10: `radial-vs-transverse`, `radial-velocity-method` (star wobble + RV curve)

For SVG design constraints and export workflow, follow `astro-svg-figures` conventions (template + palette + accessibility metadata).

---

## Demos Audit — radiation/spectra sequence + gaps

### What exists and is in good shape

**Student-facing demos**
- EM spectrum: `demos/em-spectrum/` (used in L7) (`modules/module-01/readings/lecture-07-light-information-reading.qmd:587-589`)
- Blackbody radiation: `demos/blackbody-radiation/` (used in L8) (`modules/module-01/readings/lecture-08-blackbody-radiation-reading.qmd:632-637`)
- Telescope resolution: `demos/telescope-resolution/` (used in L10) (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:536-538`)
- Binary orbits: `demos/binary-orbits/` (excellent bridge for RV, but not currently linked from L10)

**Instructor-facing materials**
- Strong “teach-first” guides exist for EM spectrum, blackbody, telescope resolution, and binary orbits: `demos/_instructor/*/index.qmd`
- The “Light & Telescopes” suite guide + capstone is a standout and aligns tightly with L7–L8–L10: `demos/_instructor/light-and-telescopes/index.qmd`, `demos/_instructor/light-and-telescopes/capstone.qmd`

**Hardening win:** Core physics models have automated tests:
- `tests/em-spectrum-model.test.js`
- `tests/blackbody-model.test.js`
- `tests/telescope-resolution-model.test.js`
- `tests/binary-orbits-physics.test.js`

### Critical demo issue (must fix)

1. **Unit error in instructor script for stellar wobble** (`demos/_instructor/binary-orbits/activities.qmd:114`).
   - **Issue:** “13 km/s” should be ~13 **m/s** (order-of-magnitude/unit mistake).
   - **Fix:** Change to “~13 m/s” (or “~12 m/s”) to match the physics and the L10 reading (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:315`).

### Demo gaps (what’s missing for Lectures 9–10)

Right now, there is no student-facing demo that lets students *practice*:
- identifying element fingerprints from line patterns (L9),
- seeing spectra shift with Doppler velocity (L10),
- connecting orbit geometry → radial velocity curve (L10 RV method).

### High-impact new demos to add (aligned to your request)

1. **Spectral Lines Lab (ASTR 101 core)**
   - **Goal:** Students toggle between continuous/emission/absorption setups and match line patterns to “element cards.”
   - **Must-have interactions:** choose element(s), choose spectrum type (emission vs absorption), overlay “unknown spectrum,” check matches.
   - **Data requirement:** Use real line wavelengths — do not invent. Start with a small verified set (e.g., H Balmer, Na D) and expand later. Mark everything else `VERIFY` until sourced.
   - **Nice extension:** Add a “molecules in IR” mode with broad absorption bands (CO, CO₂, CH₄, H₂O) — but only if the band locations are sourced and verified.

2. **Doppler Shift Spectrometer (ASTR 101 core)**
   - **Goal:** Students move a “radial velocity” slider and watch spectral lines shift; they compute $v$ from $\Delta\lambda/\lambda_0$ with sign.
   - **Must-have interactions:** rest vs observed spectrum overlay, automatic readout of $\Delta\lambda$, and a “check your sign” prompt.
   - **Bridge to L10:** include a toggle for “radial vs transverse” to reinforce that only line-of-sight motion shifts lines.

3. **Binary Orbits: RV Curve Overlay (already in backlog, high priority)**
   - **Goal:** Plot star’s radial velocity vs time synchronized to the orbit, showing period + amplitude and the $\\sin i$ idea (even a simplified inclination toggle).
   - **Why it’s perfect:** It uses an existing, tested physics model and directly supports L10’s exoplanet section.
   - **Reference:** This is already specified as P1 in `demos/_instructor/binary-orbits/backlog.qmd:29-76`.

### Hardening recommendations for the radiation lecture demos (should fix)

1. **Unify sign conventions and “what counts as positive v” across reading + demos.**
   - L10 defines $\Delta\lambda = \lambda_{obs} - \lambda_0$ and “positive = receding” (`modules/module-01/readings/lecture-10-doppler-telescopes-reading.qmd:126-139`). New Doppler demos should match exactly.

2. **Add station cards for any new L9/L10 demos** (keep the existing 6–8 minute pattern).
   - Pattern reference: `demos/_assets/station-cards/em-spectrum.qmd`, `.../blackbody-radiation.qmd`, `.../telescope-resolution.qmd`.

3. **Testing expectation:** any new “spectrum” model should have a small unit-test suite (like the existing model tests) so future refactors cannot silently change line positions or Doppler behavior.

---

## Suggested next actions (sequenced)

### Must fix (publish-ready gate)
1. Replace/register missing `fig` IDs in L9 and L10 (and remove error strings).
2. Move the hydrogen absorption/emission figures from L8 → L9.
3. Fix the `13 km/s` → `13 m/s` unit error in `demos/_instructor/binary-orbits/activities.qmd:114`.

### Should fix (polish + coherence)
1. Fill the L7 and L8 figure placeholders.
2. Add one new demo: either “Doppler Shift Spectrometer” or “Spectral Lines Lab” (the other can follow).
3. Add a direct link from L10 to the binary-orbits demo as an RV-method visual support.

