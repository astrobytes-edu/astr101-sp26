# Lecture 03–04 Demos — Comprehensive Audit (Technical + Scientific + Pedagogical)

**Date:** 2026-01-25
**Auditor:** Codex (GPT-5.2)
**Scope:** `demos/seasons/`, `demos/angular-size/`, `demos/moon-phases/`, `demos/eclipse-geometry/` (+ shared assets in `demos/_assets/`)
**Related artifact (traceability gate):** `docs/audits/2026-01-25-lecture-03-04-demos-hardening.md`

---

## Protocol Compliance

### Task classification (per `docs/llm-lab-protocol.md`)

- **Dominant:** Documentation / explanation (audit report + recommended improvements)
- **Also:** Architectural exploration; Numerical / physical correctness; UI/UX & accessibility review

### Role assignment

Your role: **architectural referee and invariant enforcer** (do not let aesthetics override correctness).

---

## Executive Summary (What’s Great, What’s Next)

These 4 demos are now **instruction-faithful** to Lectures 03–04 and feel meaningfully more “class-ready” than the baseline. The shared theme shell + micro-polish are doing real work, and the Moon Phases / Eclipse Geometry pair in particular has strong misconception targeting + retrieval practice hooks via challenge mode.

However, the next “best demos” phase is blocked by a small set of **high-leverage correctness + accessibility gaps**:

1. **Accessibility (high priority):** Three demos have **unlabeled sliders** (no `<label for>` association and no `aria-label`), which is a real usability/accessibility regression for keyboard/screen-reader users. Evidence: Seasons has 3 missing names (date/tilt/latitude), Angular Size has 2, Eclipse Geometry has 2 (Playwright DOM audit).
2. **Angular Size scientific correctness + numerical stability (high priority):** Angular size is computed with the **small-angle approximation** (`θ ≈ D/d`) and can explode to absurd values (e.g., `5.7e+24°`) for extreme slider combos. This is avoidable by switching to the exact formula `θ = 2 atan(D/(2d))`. Evidence: `demos/angular-size/angular-size.js:190` + extreme slider run.
3. **Seasons orbit-view coherence (high priority):** The orbital visualization’s radius varies by **season position** (equinox vs solstice), not by the **Earth–Sun distance readout**; perihelion/aphelion are not shown at the correct orbital longitudes. This can accidentally reinforce the very misconception the demo is trying to kill. Evidence: computed pixel radius vs distance readout at key days.
4. **Design system drift (medium priority):** The demos (and shared challenge/tour UI) include many **raw hex colors and inline style strings**, which conflicts with the locked site design contract (`docs/contracts/course-site-design-contract.md`). This risks aesthetic inconsistency and maintenance pain.
5. **Motion/attention control (medium priority):** `demos/_assets/starfield.js` does not respect `prefers-reduced-motion` and uses continuous animation + occasional shooting stars. That can be distracting or inaccessible for some students.

---

## Evidence: Local Run + Console Hygiene

### Local run setup used for audit

- Served repo with conda python: `conda run -n astro python -m http.server 8000 --bind 127.0.0.1`
- Opened demos at:
  - `http://127.0.0.1:8000/demos/seasons/`
  - `http://127.0.0.1:8000/demos/angular-size/`
  - `http://127.0.0.1:8000/demos/moon-phases/`
  - `http://127.0.0.1:8000/demos/eclipse-geometry/`

### Results (Playwright run)

- **Console errors/warnings:** none observed on load + basic interactions across all 4 demos.
- **Mobile-ish width (~375px):** no horizontal overflow across all 4 demos.
- **A11y name audit (visible interactive controls lacking accessible names/labels):**
  - Seasons: **3** (range inputs `#date-slider`, `#tilt-slider`, `#latitude-slider`)
  - Angular Size: **2** (range inputs `#distance-slider`, `#size-slider`)
  - Moon Phases: **0** (notably, `#moon-group` is focusable and labeled)
  - Eclipse Geometry: **2** (range inputs `#tilt-slider`, `#sim-years-slider`)

---

## Invariants Ledger (What Future Hardening MUST Preserve)

This section is intentionally “contract-like” so future iterations don’t drift.

### Shared (all 4 demos)

- **No-console-errors invariant:** normal use produces **zero** console errors/warnings.
- **Determinism invariant:** same inputs → same readouts (no NaN/Infinity; predictable resets).
- **Lecture-contract UI invariant:** labels used in the readings remain present and unchanged (especially mission-critical strings).
- **Accessibility invariant:** all core controls are keyboard reachable and have accessible names; motion respects user preferences.
- **Design contract invariant:** new styling must use token roles (no raw hex creep).

### Seasons

- **Conceptual core:** seasons are driven by **tilt** (solar altitude + day length), not distance.
- **Numerical invariants (Earth mode):** declination, day length, sun altitude, and distance should remain physically plausible (order-of-magnitude right; units consistent).

### Angular Size

- **Conceptual core:** angular size depends on **both** physical size and distance; students can reason about scaling.
- **Numerical invariant:** angular size must stay bounded and meaningful (no impossible angles from a formula outside its regime).

### Moon Phases

- **Conceptual core:** phases are illumination geometry; Earth’s shadow is not the cause.
- **UI invariant:** draggable Moon remains the primary interaction; readouts remain stable near canonical phases.

### Eclipse Geometry

- **Conceptual core:** eclipses require **phase + near-node alignment**; tilt makes monthly eclipses rare.
- **Interpretation invariant:** “Moon is X° above/below ecliptic plane” readout remains persistent (lecture contract).

---

## Cross-Cutting Technical / Architecture Audit

### Strengths

- Each demo is a self-contained IIFE with explicit state and `update()` flows; relatively easy to reason about locally.
- Shared “polish” layer is a good architectural choice: `demos/_assets/demo-polish.js:1` adds UI affordances without forcing per-demo rewrites.
- Challenge mode is reusable and encourages retrieval practice: `demos/_assets/challenge-engine.js:1`.

### Architecture / maintainability issues (ranked)

1. **Duplicate sources of truth / drift risk:** Seasons has both `PLANET_DATA` in JS and `demos/seasons/planets.json` with the same values; `planets.json` appears unused (no `fetch`/load found). Evidence: `demos/seasons/seasons.js:28` vs `demos/seasons/planets.json:1`.
2. **Duplicate utility logic:** Angular Size reimplements distance/angle formatting and angular-size math that overlaps `demos/_assets/astro-utils.js`. Evidence: `demos/angular-size/angular-size.js:190` and `demos/_assets/astro-utils.js:1` (formatting + `angularSize`).
3. **Inline-style injection:** Moon Phases shows a popup via `popup.style.cssText = ...` containing raw colors. Evidence: `demos/moon-phases/moon-phases.js:672`.
4. **Challenge UI lacks explicit accessibility semantics:** The challenge panel is injected as a plain `div` without `role="dialog"`/`role="region"` and no focus management. Evidence: `demos/_assets/challenge-engine.js:553`.

---

## Cross-Cutting Design / Aesthetics Audit (Design System Compliance)

**Contract:** `docs/contracts/course-site-design-contract.md` applies to student-facing outputs and forbids ad-hoc styling drift and raw hex usage (outside token files).

### Findings

- Many demo pages include raw hex colors in inline SVG/styling and JS-set fills (e.g., Seasons planet colors, Angular Size object fills, Moon Phases popup colors, Eclipse SVG gradients). Evidence:
  - Seasons: `demos/seasons/seasons.js:28`
  - Angular Size: `demos/angular-size/angular-size.js:410`
  - Moon Phases popup: `demos/moon-phases/moon-phases.js:682`
  - Eclipse Geometry SVG: `demos/eclipse-geometry/index.html:350`
  - Challenge UI styles: `demos/_assets/challenge-engine.js:603`
  - Starfield colors: `demos/_assets/starfield.js:16`

### Why this matters pedagogically

Visual consistency reduces extraneous cognitive load. If each demo “feels like a different app,” students spend attention on interface mapping instead of physics reasoning.

---

## Cross-Cutting Accessibility Audit (High Priority)

### Findings

- **Unlabeled range inputs** in 3/4 demos (screen readers may announce “slider” with no name). Evidence:
  - Seasons sliders: `demos/seasons/index.html:542`, `demos/seasons/index.html:570` (and date slider earlier in file)
  - Angular Size sliders: `demos/angular-size/index.html:115`, `demos/angular-size/index.html:123`
  - Eclipse Geometry sliders: `demos/eclipse-geometry/index.html:376` (and tilt slider earlier in file)
- Challenge panel lacks dialog semantics and focus management: `demos/_assets/challenge-engine.js:553`.
- Motion preferences are not respected by starfield: `demos/_assets/starfield.js:12`.

### Recommended baseline for “best demos”

- Every interactive control has:
  - an accessible name (`<label for>` or `aria-label`)
  - visible focus treatment
  - predictable keyboard operation
- All continuous animations respect `prefers-reduced-motion` (disable starfield motion and reduce animated transitions).

---

## Per-Demo Audit

### 1) Seasons (`demos/seasons/…`)

**What’s working (strong)**
- Correct “tilt not distance” narrative is reinforced by readouts (day length + solar altitude + distance).
- Mission-critical latitude value `66.5°N` is supported and displayed correctly (`demos/seasons/seasons.js:308`).
- Overlays are well-chosen for spatial reasoning (equator/ecliptic/terminator).

**Scientific / representation issues**
- **Orbit distance representation conflicts with readout:** orbit radius varies with equinox/solstice placement, not with perihelion/aphelion. Evidence: pixel radius ~145 at day 80/266 but distance readout near ~1 AU; pixel radius ~150 at day 356 even though distance readout is minimum `0.983 AU`.
  - Root: orbital position mapping is anchored to seasons for pedagogy, while distance uses a perihelion-anchored cosine. Evidence: `demos/seasons/seasons.js:318` (day→angle mapping) vs `demos/seasons/seasons.js:226` (distance model).
- **Planet presets imply more than implemented:** “Planet presets” change tilt but not orbital period, calendar, perihelion/aphelion distance model, etc. Evidence: `demos/seasons/seasons.js:700`.

**Technical / UX issues**
- Sliders lack accessible names (see cross-cutting a11y).
- Orbit-view axis indicator does not visually encode tilt magnitude; `tiltRad` is computed but not used. Evidence: `demos/seasons/seasons.js:349`.
- Duplicate planet data source (`planets.json` vs `PLANET_DATA`).

**Recommended enhancements**
- **Must (next phase):** Make orbit-view geometry consistent with distance readout OR explicitly label the orbit as “schematic (not to scale)” and remove the misleading distance line-length cue.
- **Must:** Add `<label for>` / `aria-label` for date/tilt/latitude sliders.
- **Should:** Replace planet presets label with “Tilt presets” unless full-planet modeling is implemented; alternatively wire `planets.json` as a single source of truth.
- **Could:** Add “Reset to Lecture Default” button (Earth, 23.5°, 40°N, March Equinox) to reduce instructor overhead.

### 2) Angular Size (`demos/angular-size/…`)

**What’s working (strong)**
- Lecture contract items now exist: category presets + “Moon (Today)” + “Time Evolution (for Moon)” + range readout.
- Log sliders give huge dynamic range without overwhelming students.

**Scientific / numerical issues (high priority)**
- **Small-angle approximation used everywhere**: `θ ≈ D/d` in degrees. Evidence: `demos/angular-size/angular-size.js:190`.
  - This is fine for small angles but becomes wrong for large angles and can produce absurd results.
- **Numerical blow-up in extreme states:** a realistic UI should never show angular size `5.7e+24°`. This happens today when you choose extremely large “size” with extremely small “distance” (sliders allow it). Evidence: observed extreme run with `distance ≈ 10 cm` and `size ≈ 1.06 Mly` producing `5.7295e+24°`.

**Technical / UX issues**
- Sliders lack accessible names: `demos/angular-size/index.html:115`, `demos/angular-size/index.html:123`.
- Duplicated formatting utilities that overlap `AstroUtils` (maintenance risk): `demos/angular-size/angular-size.js:217`.
- Raw hex colors used for SVG fills: `demos/angular-size/angular-size.js:410`.

**Recommended enhancements**
- **Must (next phase):** Replace angular size calculation with the exact formula:
  - `θ = 2 * atan(D / (2d))` (then convert to degrees), which naturally caps at 180° and fixes the blow-up.
- **Must:** Add guardrails in the UI for regime violations:
  - If `D > d`, show “You are inside the object; angular size saturates” (or clamp to 180° with a label).
- **Must:** Add proper slider labeling (`<label for>` or `aria-label`).
- **Should:** Use shared `AstroUtils` formatting helpers (or explicitly justify why this demo needs custom formatting).
- **Could:** Add a one-line “small-angle approximation vs exact” toggle + explanation to reinforce math grammar.

### 3) Moon Phases (`demos/moon-phases/…`)

**What’s working (strong)**
- Best-in-class interaction: draggable Moon, clear readouts, and high-quality misconception targeting (“Show Earth’s Shadow”).
- Accessibility is notably stronger here: the Moon drag target is focusable and has keyboard support; focus styling exists. Evidence: `demos/moon-phases/moon-phases.js:520`.
- Drag-end snapping makes the “between Earth and Sun” mission robust without removing exploratory freedom.

**Scientific accuracy / representation notes**
- Phase naming and days-since-new mapping are internally consistent with the chosen geometry (new at 180°, full at 0°). Evidence: `demos/moon-phases/moon-phases.js:111`.
- Phase rendering is schematic; that’s appropriate for ASTR 101, but it should be labeled as schematic (students may over-interpret terminator shape).

**Design / UX issues**
- The “shadow insight” popup injects inline CSS with raw colors that likely violates the design contract and may not meet contrast expectations depending on display. Evidence: `demos/moon-phases/moon-phases.js:682`.
- Reduced-motion preferences aren’t respected (starfield continues animating).
- Minor HTML semantics: the speed “label” isn’t associated with its `<select>`. Evidence: `demos/moon-phases/index.html:538`.

**Recommended enhancements**
- **Must:** Move popup styling into CSS using tokens; ensure contrast and keyboard dismissal (Escape).
- **Should:** Add a “schematic” label or short explainer for the phase-disk rendering.
- **Could:** Add a “Check yourself” micro-prompt sequence aligned to the reading (e.g., predict illumination % at quarters before revealing).

### 4) Eclipse Geometry (`demos/eclipse-geometry/…`)

**What’s working (strong)**
- Status wording and persistent readout match the lecture contract and are easy to interpret. Evidence: `demos/eclipse-geometry/eclipse-geometry.js:278`.
- Long-term simulation is engaging and supports inquiry (pattern-finding in “eclipse seasons”).
- Challenge mode includes good near-miss feedback (close vs incorrect).

**Scientific-model limitations (important to message clearly)**
- Model treats “ecliptic height” as `tilt * sin(angleFromNode)` and checks thresholds at idealized New/Full Moon positions. This is a good conceptual model but not a physical ephemeris.
- Threshold values are explained in comments but should be explicitly marked as **approximate** (and verified against a trusted source if you want to present them as “actual eclipse limits”). Evidence: `demos/eclipse-geometry/eclipse-geometry.js:17`.

**Technical / UX issues**
- Sliders lack accessible names (tilt, years): `demos/eclipse-geometry/index.html:376` (and tilt slider earlier).
- Challenge UI style uses raw hex fallbacks and no dialog semantics: `demos/_assets/challenge-engine.js:553`.
- Uses `innerHTML` with inline style for stats output: `demos/eclipse-geometry/eclipse-geometry.js:327` (not dangerous here, but creates style drift).

**Recommended enhancements**
- **Must:** Add accessible labeling for sliders.
- **Should:** Add a concise “Model assumptions” box:
  - “We model the Moon’s ecliptic latitude as a sinusoid; we ignore lunar eccentricity and Earth’s shadow size; results are approximate.”
- **Could:** Add a toggle to show/hide partial vs total classification on the main status badge (without breaking lecture wording), while keeping the stats panel detailed.

---

## Recommended Enhancements (Ranked Backlog)

### Must-fix (next hardening phase)

1. **A11y labeling pass** for all sliders + key controls (Seasons, Angular Size, Eclipse Geometry).
2. **Angular Size exact-angle formula** + regime guardrails (fix numerical blow-up).
3. **Seasons orbit-view coherence fix** (align perihelion/aphelion geometry with distance model or explicitly mark orbit as schematic and remove misleading cues).

### Should-fix (quality + consistency)

4. **Design system compliance pass**: replace raw hex and inline CSS strings with token-based styling (including challenge UI and popups).
5. **Reduced motion support**: starfield should stop animating (or use a static render) under `prefers-reduced-motion`.
6. **De-dup utilities**: prefer `AstroUtils` for formatting and basic math; reduce bespoke formatting in Angular Size.

### Could-fix (delight + deeper learning)

7. Add “Reset to Lecture Defaults” buttons in Seasons + Angular Size.
8. Add short “Model assumptions” callouts in each demo (“schematic; ignores X”) to prevent over-interpretation.
9. Improve challenge UI accessibility (role + focus management) and add optional “practice mode” cadence cues aligned to the ASTR 101 pedagogical contract.

---

## Validation Checklist (for the next phase)

Run this checklist before declaring “best-in-class” readiness:

- [ ] `prefers-reduced-motion: reduce` → no continuous motion (starfield static; no surprise animations).
- [ ] All interactive controls have accessible names (screen reader announces “Distance slider”, not “slider”).
- [ ] Angular size never exceeds 180°; extreme inputs produce interpretable feedback.
- [ ] Seasons orbital visualization does not contradict the distance readout; perihelion/aphelion are correctly represented or clearly labeled schematic.
- [ ] No new raw hex values outside token files; demo UI matches the course design contract.
- [ ] Challenge mode is navigable by keyboard and has clear exit affordances.
- [ ] No console warnings/errors across typical interactions.

---

## Suggested PR Plan (PR-sized slices)

1. **PR: Accessibility labeling** (Seasons + Angular Size + Eclipse Geometry)
   - Add `<label for>` and/or `aria-label` for range inputs; ensure focus styles remain visible.
2. **PR: Angular size correctness** (exact formula + formatting)
   - Replace small-angle approximation; clamp/format outputs; add a short “model note”.
3. **PR: Seasons orbit coherence** (either align geometry or explicitly label schematic)
   - Decide the pedagogical goal: “distance is small + wrong sign for seasons” vs “true orbit orientation”; implement accordingly.
4. **PR: Reduce-motion & starfield** (shared)
   - Respect `prefers-reduced-motion`; consider a static background option.
5. **PR: Design-token pass** (shared + per-demo)
   - Remove raw hex in injected CSS/inline styles; move to shared CSS variables and token roles.
6. **PR: Challenge engine accessibility** (shared)
   - Add ARIA semantics + focus management; ensure keyboard-only students can fully use challenges.

