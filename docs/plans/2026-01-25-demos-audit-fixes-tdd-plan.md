# Interactive Demos Audit Fixes (TDD) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Fix the UX/A11y/science issues found in the 2026-01-25 audits for the four interactive demos (`seasons`, `angular-size`, `moon-phases`, `eclipse-geometry`) and eliminate known documentation drift, without adding dependencies or changing the starfield system.

**Architecture:** Keep each demo as a static, dependency-free HTML/CSS/JS app served from `demos/`. Prefer fixing shared behavior in `demos/_assets/` when possible (e.g., ChallengeEngine) to avoid per-demo duplication. Use small, targeted refactors only when they reduce root-cause risk (e.g., isolating a brittle UI template) and keep behavior changes locally-scoped.

**Tech Stack:** Static HTML/CSS/JS; Quarto wrapper site; conda Python for repo tooling and local serving; Node’s built-in test runner (`node --test`) for small unit tests (no external deps).

**Source audits:**
- `docs/audits/2026-01-25-demo-01-seasons-audit.md`
- `docs/audits/2026-01-25-demo-02-angular-size-audit.md`
- `docs/audits/2026-01-25-demo-03-moon-phases-audit.md`
- `docs/audits/2026-01-25-demo-04-eclipse-geometry-audit.md`

---

## Protocol Compliance (condensed; see `docs/llm-lab-protocol.md`)

### Task classification
- **Dominant:** Refactor / restructuring + Documentation / explanation (fix drift) + Numerical / physical correctness (geometry mappings, boundary cases)
- **Also:** Accessibility + UI/UX hardening; stability/performance hygiene

### Hard invariants (must not change)
- **No new dependencies** (npm/pip/etc.) without explicit approval.
- **Do not modify** `demos/_assets/starfield.js` and do not add reduced-motion/starfield work in this plan.
- Demos must remain **static** (no build step required to run locally).
- Preserve each demo’s **teaching claim**:
  - Seasons: “tilt, not distance, drives seasons”
  - Angular size: “θ depends on size and distance”
  - Moon phases: “phases are geometry, not Earth’s shadow”
  - Eclipse geometry: “eclipses require phase + node alignment; not every month”

### Known underspecified decisions (VERIFY before locking fixes)
- **Angular Size / Andromeda**: **bright disk** definition. (Audit: A-04)
- **Seasons / Orbit view**: should it be a “truthful perihelion-anchored distance diagram” or a “schematic seasons wheel”? (Audit: S-03)
- **Eclipse limits**: whether the degree thresholds in `demos/eclipse-geometry/eclipse-geometry.js` and `demos/eclipse-geometry/README.md` should be treated as authoritative or softened as illustrative. (Audit: E-?? “VERIFY” note)

---

## Preflight (do once per branch)

### Task 0: Branch + baseline commands

**Files:** none

**Step 1: Create a local branch (no worktrees)**

```bash
git switch -c demos-audit-fixes
```

**Step 2: Record baseline static checks**

```bash
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
```

Expected: current pass/fail as baseline evidence (do not “fix” anything yet).

**Step 3: Start a local server for manual verification**

```bash
conda run -n astro python -m http.server 8000 --bind 127.0.0.1
```

Open:
- `http://127.0.0.1:8000/demos/seasons/`
- `http://127.0.0.1:8000/demos/angular-size/`
- `http://127.0.0.1:8000/demos/moon-phases/`
- `http://127.0.0.1:8000/demos/eclipse-geometry/`

---

## Shared: ChallengeEngine (root-cause fixes first)

### Task 1: Add a failing unit test reproducing the completion “Close” crash (M-03 / E-04)

**Files:**
- Create: `tests/challenge-engine.test.js`

**Step 1: Write the failing test**

```js
const test = require('node:test');
const assert = require('node:assert/strict');

const ChallengeEngine = require('../demos/_assets/challenge-engine.js');

test('ChallengeEngine._clearFeedback is null-safe', () => {
  const engine = new ChallengeEngine(
    [{ id: 'c1', question: 'q', type: 'boolean', answer: true, hints: [] }],
    { showUI: false }
  );

  engine.ui = { querySelector: () => null };

  assert.doesNotThrow(() => engine._clearFeedback());
});
```

**Step 2: Run to verify it fails**

```bash
node --test tests/challenge-engine.test.js
```

Expected: **FAIL** with a `TypeError` from `challenge-engine.js` when accessing `.style` on `null`.

**Step 3: Commit**

```bash
git add tests/challenge-engine.test.js
git commit -m "test(challenges): reproduce null feedback crash"
```

---

### Task 2: Fix the null feedback crash with minimal guards (M-03 / E-04)

**Files:**
- Modify: `demos/_assets/challenge-engine.js` (around `_showFeedback` and `_clearFeedback`)
- Test: `tests/challenge-engine.test.js`

**Step 1: Implement the minimal fix**
- In `_showFeedback`, if `.challenge-feedback` is missing, return without throwing.
- In `_clearFeedback`, if `.challenge-feedback` is missing, return without throwing.

**Step 2: Run tests**

```bash
node --test tests/challenge-engine.test.js
```

Expected: **PASS**.

**Step 3: Manual verification (must do before declaring fixed)**
1. Serve locally (`conda run -n astro python -m http.server 8000 --bind 127.0.0.1`)
2. Open:
   - `http://127.0.0.1:8000/demos/moon-phases/` → Challenges → Finish → Close
   - `http://127.0.0.1:8000/demos/eclipse-geometry/` → Challenge Mode → Finish → Close
3. Expected: **no console errors**.

**Step 4: Commit**

```bash
git add demos/_assets/challenge-engine.js
git commit -m "fix(challenges): guard missing feedback element"
```

---

### Task 3: Prevent “completion screen nukes base UI” (restart/close robustness)

**Why:** `_showCompletion()` replaces `.challenge-content` and `.challenge-actions` markup, which removes elements `_updateUI()` expects. Even if this is not currently crashing for every path, it is a brittle root cause.

**Files:**
- Modify: `demos/_assets/challenge-engine.js` (around `_createUI`, `_showCompletion`, `reset`, `start`)
- Test: `tests/challenge-engine.test.js`

**Step 1: Add a failing test for “completion then reset then start doesn’t throw”**
- Build a minimal stub `ui` object with `querySelector()` that returns objects for:
  - `.challenge-content`, `.challenge-actions`, `.challenge-nav`
  - `.restart-btn`, `.close-complete-btn`
  - `.challenge-number`, `.challenge-question`, `.challenge-progress`, `.prev-btn`, `.next-btn`, `.hint-btn`
- Call `_showCompletion()` then `reset()` then `start()` and assert no throw.

**Step 2: Run test to verify it fails** (expected failure pre-fix)

```bash
node --test tests/challenge-engine.test.js
```

**Step 3: Implement the minimal robust fix (choose one)**
- **Option A (preferred, least invasive):** store initial innerHTML templates from `_createUI()` and restore them in `reset()` (and/or before `start()` updates UI) before calling `_updateUI()`.
- **Option B (simpler but heavier):** on `reset()`, remove the UI DOM node and set `this.ui = null` so `start()` recreates a fresh UI via `_createUI()`.

**Step 4: Run tests again**

```bash
node --test tests/challenge-engine.test.js
```

Expected: **PASS**.

**Step 5: Manual verification**
- In both Moon Phases and Eclipse Geometry, confirm:
  - “Try Again” works from completion screen.
  - “Close” works from completion screen.
  - Starting challenges again works without reload.

**Step 6: Commit**

```bash
git add demos/_assets/challenge-engine.js tests/challenge-engine.test.js
git commit -m "fix(challenges): make completion/reset UI robust"
```

---

### Task 4: Add focus trapping + correct dialog semantics (M-06 / E-05)

**Files:**
- Modify: `demos/_assets/challenge-engine.js` (dialog attributes + key handling)

**Step 1: Add a manual-only acceptance test checklist (no deps)**
- With Challenge Mode open, Tab and Shift+Tab should cycle within the dialog.
- Escape closes the dialog.
- Focus returns to the element that opened Challenge Mode.

**Step 2: Implement**
- Set `aria-modal="true"` on the wrapper.
- Implement a small focus-trap handler on `keydown` for Tab that keeps focus within focusable elements inside the panel.
- Ensure focus restoration works for all close paths (`stop()`, `reset()` from completion, close button, Escape).

**Step 3: Manual verification (required)**
- Moon Phases and Eclipse Geometry:
  - Tab does not escape dialog.
  - Escape closes dialog.
  - Focus returns to the “Challenges” button.

**Step 4: Commit**

```bash
git add demos/_assets/challenge-engine.js
git commit -m "fix(a11y): trap focus in challenge dialog"
```

---

### Task 5: Add `onStop` callback to synchronize host UI (M-04 / E-09)

**Files:**
- Modify: `demos/_assets/challenge-engine.js` (call `options.onStop?.(...)` from `stop()` and from “completion close” path)
- Modify: `demos/moon-phases/moon-phases.js` (wire `onStop` to update `#btn-challenges`)
- Modify: `demos/eclipse-geometry/eclipse-geometry.js` (wire `onStop` to update `#btn-challenges`)

**Step 1: Add a failing unit test (engine calls onStop)**
- In `tests/challenge-engine.test.js`, create an engine with `options.onStop = () => { called = true }`.
- Call `engine.stop()` and assert callback ran.

**Step 2: Run tests to verify it fails** (expected pre-fix)

```bash
node --test tests/challenge-engine.test.js
```

**Step 3: Implement engine callback**
- Add `onStop` to the ChallengeOptions typedef.
- In `stop()` and in completion “Close”, call `this.options.onStop?.()`.

**Step 4: Re-run tests**

```bash
node --test tests/challenge-engine.test.js
```

Expected: **PASS**.

**Step 5: Update host demos**
- Ensure button state and text reflect reality after any close path (×, Escape, completion Close).

**Step 6: Manual verification**
- Moon Phases: after closing the panel via × or completion Close, `#btn-challenges` should not remain `.active` and should read “🎯 Challenges” (or equivalent).
- Eclipse Geometry: after completion Close, `#btn-challenges` should not still read “Exit Challenges”.

**Step 7: Commit**

```bash
git add demos/_assets/challenge-engine.js demos/moon-phases/moon-phases.js demos/eclipse-geometry/eclipse-geometry.js tests/challenge-engine.test.js
git commit -m "fix(challenges): sync host state on close"
```

---

## Demo 1: Seasons (`demos/seasons/`) — align calendar conventions and UI truth

### Task 6: Decide the day index convention (S-01) and document it

**Files:**
- Modify: `demos/seasons/README.md`
- Modify (later tasks): `demos/seasons/index.html`, `demos/seasons/seasons.js`

**Step 1: Choose and record (decision)**
- **Option A:** 0–364 internal day index, display as calendar date with day 0 = Jan 1.
- **Option B (preferred for pedagogy):** 1–365 day number, display as calendar date with day 1 = Jan 1.

**Step 2: Update README to match the chosen convention**
- Fix the text that currently claims `d` is “(1–365)” while code is currently 0-based.

**Step 3: Commit**

```bash
git add demos/seasons/README.md
git commit -m "docs(seasons): clarify day-of-year convention"
```

---

### Task 7: Fix day→date conversion edge case (S-01)

**Files:**
- Modify: `demos/seasons/index.html` (date slider min/max if needed)
- Modify: `demos/seasons/seasons.js` (`dayOfYearToDate`, preset day constants, any wrap logic)

**Step 1: Write a lightweight regression check (script)**
- Create `scripts/seasons_checks.py` (stdlib-only) that asserts:
  - The slider max matches the year length convention.
  - If using 0–364: day 364 maps to Dec 31 and day 0 maps to Jan 1.
  - If using 1–365: day 365 maps to Dec 31 and day 1 maps to Jan 1.

**Step 2: Run it to verify it fails pre-fix**

```bash
conda run -n astro python scripts/seasons_checks.py
```

Expected: **FAIL** on the current bug (Dec 31 mapping / day 365 wrap).

**Step 3: Implement the minimal fix**
- Fix the strict `<` month-boundary logic (currently makes the last day fall through).
- Align slider bounds and wrap logic to the chosen convention.
- Align preset day numbers so presets land on the intended displayed dates (and/or update preset labels if the model intentionally anchors differently).

**Step 4: Re-run the check**

```bash
conda run -n astro python scripts/seasons_checks.py
```

Expected: **PASS**.

**Step 5: Manual verification**
- On the Seasons page:
  - Max slider value shows Dec 31 (not Jan 1).
  - Presets land on the labeled calendar dates (or are clearly labeled as approximate model anchors).

**Step 6: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js scripts/seasons_checks.py
git commit -m "fix(seasons): correct day-to-date mapping and slider bounds"
```

---

### Task 8: Make “Season” readouts tilt-aware at zero tilt (S-02)

**Files:**
- Modify: `demos/seasons/seasons.js` (`getSeasonNorth`, readout update path)

**Step 1: Add a small unit-level check (script)**
- Extend `scripts/seasons_checks.py` to assert that when effective tilt is 0°, the season label becomes “No seasons” (or equivalent).

**Step 2: Run to confirm failure**

```bash
conda run -n astro python scripts/seasons_checks.py
```

**Step 3: Implement minimal behavior**
- If `effectiveObliquityDegrees(state.axialTilt)` is ~0, set season labels to “No seasons” (or hide season styling) while leaving day-length and altitude readouts intact.

**Step 4: Re-run checks**

```bash
conda run -n astro python scripts/seasons_checks.py
```

**Step 5: Manual verification**
- Tilt=0° at any day: season labels do not imply “Spring/Summer/Fall/Winter”.

**Step 6: Commit**

```bash
git add demos/seasons/seasons.js scripts/seasons_checks.py
git commit -m "fix(seasons): make season labels depend on tilt"
```

---

### Task 9: Resolve orbit-view semantic conflict (S-03) with minimal UI truthfulness

**Files:**
- Modify: `demos/seasons/index.html` (labels/notes)
- Modify: `demos/seasons/seasons.js` (orbit label placement and/or distance model disclosure)
- Modify: `demos/seasons/README.md`

**Step 1: Pick an approach (decision)**
- **Option A:** Keep perihelion-anchored geometry; compute equinox/solstice markers at their actual orbital longitudes within this simplified model; remove hard-coded quadrant month labels.
- **Option B:** Make orbit view explicitly schematic; keep quadrant labels; remove perihelion/aphelion anchoring claims and any cues implying “distance diagram truth”.

**Step 2: Implement the chosen approach minimally**
- Do not change the underlying teaching goal (“distance changes are small”); only remove contradictions.

**Step 3: Manual verification**
- Orbit view contains no mutually contradictory cues (calendar quadrants vs perihelion-anchored Earth position).

**Step 4: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js demos/seasons/README.md
git commit -m "fix(seasons): resolve orbit-view labeling semantics"
```

---

### Task 10: Remove planet presets; Earth-only tilt range 0–90° (re-scoped)

**Files:**
- Modify: `demos/seasons/index.html`
- Modify: `demos/seasons/seasons.js`
- Modify: `demos/seasons/README.md`

**Goal:** Seasons demo is Earth-only for now. Remove planet UI/logic and restrict axial tilt slider to `0°–90°` (no retrograde/effective-obliquity behavior in the UI).

**Step 1: Implement UI removal + slider bounds**
- Remove the “Planet Presets” section and planet indicator from `demos/seasons/index.html`.
- Change `#tilt-slider max` from `180` to `90` and update the tick labels (“0° … 90°”).
- Remove any UI copy that references “retrograde” or “effective obliquity”.

**Step 2: Implement JS simplification**
- Remove `PLANET_DATA`, `loadPlanetsJson()`, `state.currentPlanet`, and any planet highlight/indicator/color logic.
- Ensure distance readout remains Earth-only and label stays “Earth-Sun Distance”.

**Step 3: Manual verification**
- Page loads with no missing-element errors after removing those DOM nodes.
- Tilt slider cannot exceed 90°.

**Step 4: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js demos/seasons/README.md
git commit -m "fix(seasons): remove planet presets and cap tilt at 90°"
```

---

### Task 11: Fix global Spacebar shortcut stealing button semantics (S-05)

**Files:**
- Modify: `demos/seasons/seasons.js` (`setupKeyboard` around line ~993)

**Step 1: Manual reproduction (baseline)**
- Focus `#preset-jun-solstice`, press Space; confirm it starts animation (current bug).

**Step 2: Implement minimal gating**
- Ignore keyboard shortcuts when focus is inside interactive elements:
  - `INPUT`, `SELECT`, `BUTTON`, `TEXTAREA`, links, and elements with `contenteditable`.

**Step 3: Manual verification**
- Space activates a focused button (native behavior).
- Optional shortcuts still work when focus is on the “page background”.

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js
git commit -m "fix(a11y): do not steal Space from focused controls (seasons)"
```

---

### Task 12: Decide reset scope and make it consistent (S-06)

**Files:**
- Modify: `demos/seasons/seasons.js`
- Modify (if needed): `demos/seasons/index.html` (copy clarifying what Reset does)

**Step 1: Decide reset contract**
- “Reset to Lecture Defaults” resets only core state (day/tilt/lat), or full UI including overlays?

**Step 2: Implement to match the chosen contract**

**Step 3: Manual verification**
- Toggle overlays, reset, confirm the intended overlay defaults (or clear disclosure that overlays persist).

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js demos/seasons/index.html
git commit -m "fix(seasons): make reset behavior consistent"
```

---

### Task 13: Fix drag affordance vs reality (S-07)

**Files:**
- Modify: `demos/seasons/index.html` and/or `demos/seasons/seasons.js` and/or `demos/seasons/seasons.css`
- Modify: `demos/seasons/README.md`

**Step 1: Choose intent**
- **Option A:** Implement drag of Earth marker to set day-of-year.
- **Option B (minimal):** remove “grab” cursor + remove drag claims from README + remove hover hints implying drag.

**Step 2: Implement chosen option**

**Step 3: Manual verification**
- Affordances match reality (either drag works, or nothing suggests it).

**Step 4: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js demos/seasons/seasons.css demos/seasons/README.md
git commit -m "fix(seasons): align drag affordances with behavior"
```

---

## Demo 2: Angular Size (`demos/angular-size/`) — formatting and keyboard correctness

### Task 14: Fix angular-size readout precision/units (A-01)

**Files:**
- Modify: `demos/angular-size/angular-size.js` (readout formatting)
- Modify (if needed): `demos/angular-size/index.html` (labels/copy)
- Modify: `demos/angular-size/README.md` (ensure docs match UI)

**Step 1: Decide unit behavior**
- Use degrees only (with dynamic precision), or switch units (° / arcmin / arcsec).

**Step 2: Implement minimal formatting**
- Replace hard-coded `toFixed(2)` degrees in readouts with a formatting helper (existing `formatAngle()` in this file, or `window.AstroUtils.formatAngle` if consistent with UI).
- Ensure the visual label and accessible text match the chosen units.

**Step 3: Manual verification**
- Presets with small angles do not collapse to `0.00°` (or equivalent).
- `aria-label`/`aria-valuetext` for the angle readout conveys the unit correctly.

**Step 4: Commit**

```bash
git add demos/angular-size/angular-size.js demos/angular-size/index.html demos/angular-size/README.md
git commit -m "fix(angular-size): improve angle readout units/precision"
```

---

### Task 15: Fix keyboard shortcuts stealing keys from `<select>` (A-02)

**Files:**
- Modify: `demos/angular-size/angular-size.js` (`setupKeyboard` around line ~605)

**Step 1: Manual reproduction (baseline)**
- Focus `#preset-category`, press ArrowUp; confirm it changes size instead of changing selection (current bug).

**Step 2: Implement minimal gating**
- Like Seasons: ignore shortcuts when focus is on interactive elements (`INPUT`, `SELECT`, `BUTTON`, `TEXTAREA`, links).

**Step 3: Manual verification**
- Arrow keys work normally inside the select.
- Shortcuts still work when focus is outside controls.

**Step 4: Commit**

```bash
git add demos/angular-size/angular-size.js
git commit -m "fix(a11y): do not steal keys from focused controls (angular-size)"
```

---

### Task 16: Clamp saturated-angle rays to SVG bounds (A-03)

**Files:**
- Modify: `demos/angular-size/angular-size.js` (`updateVisualization` around line ~314)

**Step 1: Manual reproduction**
- Set size max + distance min; observe huge `y2` ray endpoints.

**Step 2: Implement minimal clamp**
- If `angularDeg` exceeds a threshold (pick visually, not “physically”), clamp line endpoints to the SVG viewBox bounds and optionally swap to a “saturated” visual state.

**Step 3: Manual verification**
- Rays remain within bounds; no huge coordinate values.

**Step 4: Commit**

```bash
git add demos/angular-size/angular-size.js
git commit -m "fix(angular-size): clamp saturated-angle rays"
```

---

### Task 17: Resolve Andromeda example mismatch (A-04)

**Files:**
- Modify: `demos/angular-size/README.md` and/or `demos/angular-size/angular-size.js` preset values

**Decision (locked):** Use the **bright disk** definition for Andromeda (not “full extent”).

**Step 2: Align code and docs**
- Either adjust README to match the preset and add a definition note, or adjust preset to match the intended definition.

**Step 3: Manual verification**
- The preset and README are consistent and explicitly define what “size” means.

**Step 4: Commit**

```bash
git add demos/angular-size/README.md demos/angular-size/angular-size.js
git commit -m "docs(angular-size): align Andromeda example with intended definition"
```

---

### Task 18: Fix README file-tree drift (A-06) and aria-live confusion (A-07)

**Files:**
- Modify: `demos/angular-size/README.md`
- Modify: `demos/angular-size/index.html` and/or `demos/angular-size/angular-size.js`
- Create: `scripts/demo_readme_checks.py` (optional but recommended for regression)

**Step 1: Add a failing README drift check**
- Implement `scripts/demo_readme_checks.py` (stdlib-only) that fails if:
  - A README references files that do not exist (e.g., `demos/angular-size/presets.json`).
  - A README claims a major interaction that is not implemented (only if we can check deterministically).

**Step 2: Run it to verify it fails pre-fix**

```bash
conda run -n astro python scripts/demo_readme_checks.py
```

Expected: **FAIL** (due to `presets.json` mention).

**Step 3: Fix README drift**
- Update Angular Size README’s “Technical Details” file list to match reality.

**Step 4: Resolve `#status-announce`**
- Either remove unused `aria-live` region, or wire it up for major interactions (presets/slider changes).

**Step 5: Re-run README checks**

```bash
conda run -n astro python scripts/demo_readme_checks.py
```

Expected: **PASS**.

**Step 6: Commit**

```bash
git add demos/angular-size/README.md demos/angular-size/index.html demos/angular-size/angular-size.js scripts/demo_readme_checks.py
git commit -m "docs(angular-size): fix README drift and aria-live wiring"
```

---

## Demo 3: Moon Phases (`demos/moon-phases/`) — boundary conventions + a11y polish

### Task 19: Fix waxing/waning direction at boundaries (M-01)

**Files:**
- Modify: `demos/moon-phases/moon-phases.js` (`updateTimeline` around line ~268)

**Step 1: Decide explicit boundary convention**
- At exactly New and exactly Full, decide whether direction displays “waxing” or “waning” (pick one and be consistent).

**Step 2: Implement minimal logic**
- Prefer deriving from `daysSinceNew` rather than raw angle to avoid boundary quirks.

**Step 3: Manual verification**
- At New: direction indicates waxing after New.
- At Full: direction indicates waning after Full (or matches the chosen boundary convention).

**Step 4: Commit**

```bash
git add demos/moon-phases/moon-phases.js
git commit -m "fix(moon-phases): correct waxing/waning direction at boundaries"
```

---

### Task 20: Make timeline button accessible names unambiguous (M-02)

**Files:**
- Modify: `demos/moon-phases/index.html`

**Step 1: Add `aria-label` to each timeline button**
- Use full phase names (“Waxing Gibbous”, “Waning Gibbous”, etc.) regardless of breakpoint.

**Step 2: Manual verification**
- Screen reader (if available): timeline buttons are uniquely named at desktop and mobile widths.

**Step 3: Commit**

```bash
git add demos/moon-phases/index.html
git commit -m "fix(a11y): add stable aria-labels for moon timeline buttons"
```

---

### Task 21: Pause animation on drag start (M-07)

**Files:**
- Modify: `demos/moon-phases/moon-phases.js` (`setupDrag`)

**Step 1: Manual reproduction**
- Click Play; start dragging; observe animation overwriting drag.

**Step 2: Implement minimal fix**
- Call `stopAnimation()` at drag start (mouse/touch).

**Step 3: Manual verification**
- Dragging reliably “takes control”.

**Step 4: Commit**

```bash
git add demos/moon-phases/moon-phases.js
git commit -m "fix(moon-phases): stop animation on drag"
```

---

### Task 22: Restore focus after insight popup + improve announcements (M-05 / M-09)

**Files:**
- Modify: `demos/moon-phases/moon-phases.js`

**Step 1: Implement focus restoration**
- Store previously focused element before opening the popup; restore focus on close.

**Step 2: Implement minimal announcements**
- If keeping `#status-announce`, update it for timeline/preset clicks (not just keyboard).

**Step 3: Manual verification**
- Closing the popup returns focus to the shadow toggle.
- Timeline click triggers a meaningful announcement (phase + illumination), if announcements are intended.

**Step 4: Commit**

```bash
git add demos/moon-phases/moon-phases.js
git commit -m "fix(a11y): restore focus and complete announcements (moon-phases)"
```

---

## Demo 4: Eclipse Geometry (`demos/eclipse-geometry/`) — fix side-view geometry first

### Task 23: Fix side-view x-mapping so New is between Earth and Sun (E-01 / E-02)

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js` (side-view mapping around line ~229 and `updateMoonPath`)

**Step 1: Add a small pure-function unit test (recommended)**
- Create `tests/eclipse-geometry-sideview.test.js` that asserts:
  - With Earth at x=200 and radius=100: angle 0 → x=300; angle 180 → x=100.
  - Output stays in bounds for any angle input (normalize).

**Step 2: Run test to verify it fails pre-fix**

```bash
node --test tests/eclipse-geometry-sideview.test.js
```

**Step 3: Implement minimal mapping**
- Use a bounded projection for x (e.g., `x = earthX + radiusX * cos(angleRad)`).
- Normalize angles before use.
- Update node markers and `moon-path-side` generation to use the same x mapping (so all side-view geometry is internally consistent).

**Step 4: Re-run tests**

```bash
node --test tests/eclipse-geometry-sideview.test.js
```

Expected: **PASS**.

**Step 5: Manual verification**
- Reset → New Moon:
  - side-view moon is left of Earth and right of Sun (between them).
- Animate 1 Year:
  - moon stays within bounds.

**Step 6: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js tests/eclipse-geometry-sideview.test.js
git commit -m "fix(eclipse-geometry): correct side-view x mapping and normalize angle"
```

---

### Task 23.1: Keep node labels attached to node markers (node text/marker mismatch)

**Files:**
- Modify: `demos/eclipse-geometry/index.html` (node label elements)
- Modify: `demos/eclipse-geometry/eclipse-geometry.js` (update label positions during `updateVisualization`)

**Step 1: Manual reproduction (baseline)**
- Change the node angle (via animation) and observe node circles move while the “Node” text stays fixed.

**Step 2: Implement minimal fix**
- Add IDs to the node label `<text>` elements (e.g., `ascending-node-label`, `descending-node-label`).
- In `updateVisualization()`, set label `x/y` from the node circle positions with a small offset.

**Step 3: Manual verification**
- Node labels remain adjacent to the node markers as the node angle changes.

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/index.html demos/eclipse-geometry/eclipse-geometry.js
git commit -m "fix(eclipse-geometry): keep node labels aligned with node markers"
```

---

### Task 24: Decide and address `#eclipse-zone-path` stub (E-03)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`
- Modify (if implementing): `demos/eclipse-geometry/eclipse-geometry.js`

**Step 1: Choose intent**
- **Option A (remove):** delete the unused SVG group and any copy implying it exists.
- **Option B (implement minimal):** draw a simple “eclipse window near nodes” overlay that matches the demo’s own threshold model (and is explicitly labeled as schematic).

**Step 2: Implement chosen option**

**Step 3: Manual verification**
- No empty/unused UI elements remain; if kept, the zone visually corresponds to “near node” and does not imply false precision.

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/index.html demos/eclipse-geometry/eclipse-geometry.js
git commit -m "fix(eclipse-geometry): remove or implement eclipse-zone indicator"
```

---

### Task 25: Add keyboard-accessible control for Moon position (E-06)

**Files:**
- Modify: `demos/eclipse-geometry/index.html` (add a labeled slider or keyboard control)
- Modify: `demos/eclipse-geometry/eclipse-geometry.js` (wire control to `state.moonAngle`)
- Update: `scripts/demo_static_checks.py` (if a new slider is added, include this demo in checks)

**Step 1: Add the control**
- Prefer a range slider with clear labeling (“Moon orbital angle” or “Moon position”) rather than trying to make a drag handle keyboard-operable.

**Step 2: Manual verification**
- Keyboard-only: user can change Moon position and observe phase/ecliptic height updates.

**Step 3: Commit**

```bash
git add demos/eclipse-geometry/index.html demos/eclipse-geometry/eclipse-geometry.js scripts/demo_static_checks.py
git commit -m "fix(a11y): add keyboard control for moon position (eclipse-geometry)"
```

---

### Task 26: Make node regression direction consistent across animations (E-07)

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js`
- Modify: `demos/eclipse-geometry/README.md` (if it describes direction/speed)

**Step 1: Decide the convention**
- Pick a sign convention for “regression” and use it consistently in month and year animations.

**Step 2: Implement**
- Replace frame-based `nodeAngle += 0.02` with an elapsed-time-based update consistent with the year animation.

**Step 3: Manual verification**
- Month and year animations move nodes in the same direction and at a plausible relative rate (no exact numeric claims unless VERIFIED).

**Step 4: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js demos/eclipse-geometry/README.md
git commit -m "fix(eclipse-geometry): make node regression consistent across animations"
```

---

### Task 27: Reset clears stats values coherently (E-08)

**Files:**
- Modify: `demos/eclipse-geometry/eclipse-geometry.js` (reset path)

**Step 1: Implement**
- When resetting, update any hidden stats values to a cleared state (or call `updateStats()`).

**Step 2: Manual verification**
- After a long sim, reset; reopen stats and see cleared values.

**Step 3: Commit**

```bash
git add demos/eclipse-geometry/eclipse-geometry.js
git commit -m "fix(eclipse-geometry): clear stats on reset"
```

---

## Documentation: eliminate drift across demo READMEs

### Task 28: Add a README drift regression script (recommended)

**Files:**
- Create: `scripts/demo_readme_checks.py`

**Step 1: Write the check**
- For each demo README, fail if it references a file path that does not exist under that demo directory (e.g., `presets.json`).
- Optional: add a small allowlist for intentional “conceptual” references that are not files.

**Step 2: Run to verify it fails pre-fix**

```bash
conda run -n astro python scripts/demo_readme_checks.py
```

Expected: **FAIL** until README drift is corrected (at minimum Angular Size; likely Seasons too).

**Step 3: Commit**

```bash
git add scripts/demo_readme_checks.py
git commit -m "test(docs): add demo README drift checks"
```

---

### Task 29: Fix Seasons README drift (S-01/S-07 and model truthfulness)

**Files:**
- Modify: `demos/seasons/README.md`

**Step 1: Update claims to match implementation**
- Remove or correct the claim “Drag Earth around its orbit” if drag is not implemented.
- Align day-number convention and equinox day mapping with the code after Task 7.
- If planet presets remain tilt-only, update the README accordingly.

**Step 2: Run README checks**

```bash
conda run -n astro python scripts/demo_readme_checks.py
```

Expected: Seasons passes.

**Step 3: Commit**

```bash
git add demos/seasons/README.md
git commit -m "docs(seasons): remove drift and match implemented interactions"
```

---

### Task 30: Fix Eclipse Geometry README drift / clarify “illustrative thresholds” (VERIFY)

**Files:**
- Modify: `demos/eclipse-geometry/README.md`

**Step 1: Update wording**
- If thresholds are not source-backed, phrase them as “illustrative” and avoid implying high precision (unless VERIFIED).

**Step 2: Run README checks**

```bash
conda run -n astro python scripts/demo_readme_checks.py
```

Expected: Eclipse Geometry passes.

**Step 3: Commit**

```bash
git add demos/eclipse-geometry/README.md
git commit -m "docs(eclipse-geometry): clarify assumptions and avoid false precision"
```

---

## Final verification / acceptance (do before merging)

### Task 31: Run repo checks and render

**Files:** none

**Step 1: Run static checks**

```bash
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro python scripts/demo_readme_checks.py
```

**Step 2: Run unit tests**

```bash
node --test
```

**Step 3: Render**

```bash
conda run -n astro quarto render
```

Expected: render completes without errors.
