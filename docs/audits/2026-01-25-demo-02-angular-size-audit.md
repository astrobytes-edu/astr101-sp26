# Demo 2 Audit — Angular Size (`demos/angular-size/`)

**Date:** 2026-01-25
**Auditor:** Codex (GPT-5.2)
**Scope:** Demo 2 only (`demos/angular-size/`). No other demos reviewed in this audit.

---

## Protocol Compliance (Phase Separation)

### Task classification (per `docs/llm-lab-protocol.md`)

- **Dominant:** Documentation / explanation (systematic audit report + fix plan)
- **Also:** Numerical / physical correctness; UI/UX & accessibility review

### Role assignment

Your role: **architectural referee and invariant enforcer** (do not let aesthetics override correctness).

---

## Phase A — Understanding (no solutions)

### What this audit is doing

Audit `demos/angular-size/` for:
- Scientific correctness (formula, units, limiting cases, edge conditions)
- Visual correctness (geometry vs stated model)
- UX/UI (readability, affordances, reset behavior)
- Accessibility (labels, keyboard nav, focus semantics)
- Copy/formatting (internal consistency between page + README)
- Interactions/features (sliders, presets, time control)
- Performance/stability (console hygiene, rapid input, extreme states)

Deliverables:
- Model summary + explicit assumptions
- Completed checklist + issue table (with evidence + minimal fix sketches)
- Prioritized fix plan (no code)

### What is known

- The page explicitly claims to use the **exact angular diameter** formula and to saturate near 180° at close distances. Evidence: model note in `demos/angular-size/index.html`.
- Core formula implementation exists in `demos/angular-size/angular-size.js#calculateAngularSize` and uses `2 * atan(d/(2D))`, clamped at 180°.
- Controls include: distance slider, physical size slider, preset category select, preset buttons, Moon-only “Time Evolution” slider, and a reset button.

### What is unknown / requires VERIFY

- Whether the course intends “Angular Size” to be reported primarily in **degrees** or to switch to **arcminutes/arcseconds** at small angles (README suggests unit switching, but UI currently does not).
- Intended reference values for some examples (e.g., Andromeda’s “size” depends on definition; verify whether the course wants ~3° or a larger “full extent” value).

---

## Phase B — Assumption Audit

Assumptions used for this audit:

- **(Explicitly stated)** The model is **conceptual** and uses an exact geometric formula, not a full observational pipeline. Evidence: model note in `demos/angular-size/index.html`.
- **(Reasonably inferred)** Presets are meant to be “teaching-faithful” and internally consistent with the demo’s own copy (README + in-page “thumb rule”). If not, mismatches are still UX/copy issues.
- **(Unknown / underspecified)** Keyboard shortcuts should not break standard keyboard semantics for interactive controls (selects/buttons). I assume preserving native behavior is required for accessibility.

---

## Phase C — Exploration (no code)

### Model summary (what the demo claims to model)

**Claim:** Apparent angular size depends on both physical diameter `d` and distance `D`. The demo models angular diameter as:

- **Exact angular diameter:** `θ = 2 atan(d/(2D))` (converted to degrees), with saturation near 180° for very close distances.
  Evidence: `demos/angular-size/angular-size.js#calculateAngularSize` + `demos/angular-size/index.html` model note.

**Units/scale used in code:**
- Preset values are stored in **kilometers** (both `diameter` and `distance`). Evidence: `demos/angular-size/angular-size.js` preset comments.
- Sliders are **log-scaled** from:
  - Distance: `DISTANCE_MIN = 1e-4 km` (10 cm) to `DISTANCE_MAX = 1e20 km` (~10 million ly)
  - Size: `SIZE_MIN = 1e-5 km` (1 cm) to `SIZE_MAX = 1e19 km` (large galaxy)
  Evidence: `demos/angular-size/angular-size.js` constants + `logSliderToValue`.

**Visualization:**
- Object horizontal position is log-scaled by distance; object radius is log-scaled by diameter; the angle rays are drawn from the “Observer” point to the object’s top/bottom edges, with a cap to avoid infinite tangents. Evidence: `demos/angular-size/angular-size.js#updateVisualization`.

### Evidence: local run + systematic checks

- Local server: `conda run -n astro python -m http.server 8003 --bind 127.0.0.1` (verified by `curl` returning HTTP 200 for `/demos/angular-size/`).
- Playwright navigation: `http://127.0.0.1:8003/demos/angular-size/`
- Console hygiene: Playwright `browser_console_messages` at `warning` level returned **no messages** on load and during interactions.
- Mobile width check: `375×750` viewport showed no horizontal overflow (DOM `scrollWidth === innerWidth`).

---

### Audit checklist (executed item-by-item)

| Checklist item | Result | Notes / evidence |
|---|---:|---|
| Load succeeds, no console errors | Pass | No warning/error console messages observed. |
| Run-to-fail: extreme close / large object | Pass (with UX caveat) | At distance slider=0 (10 cm) + size slider=1000 (~1.06 Mly), angular size saturates at **180.00°** and warning displays. However, angle rays extend far off-canvas (issue A-03). |
| Run-to-fail: extreme far / tiny object | **Fail** | At max distance + min size, angular size displays **0.00°** (precision collapse; issue A-01). |
| Scientific formula matches on-page claim | Pass | Exact `2 atan(d/(2D))` in code; on-page model note says exact formula. |
| Presets produce plausible angular sizes | **Fail (copy mismatch)** | Example: Andromeda preset displays **5.25°**, while README claims “~3°” (issue A-04, marked VERIFY). |
| Moon “Time Evolution” feature behaves consistently | Pass | Time slider at 0° → Perigee, **0.56°**; at 180° → Apogee, **0.49°**; range displayed as `0.49°–0.56°`. |
| UI communicates units well at small angles | **Fail** | Angular size is always shown in degrees with 2 decimals (e.g., Jupiter shows **0.01°**), despite README describing arcseconds/arcminutes usage (issue A-01). |
| Controls have accessible names/labels | Pass | Sliders have `aria-label`; select has `<label for="preset-category">`; object has `role="img"` + `aria-label`. |
| Keyboard navigation preserves standard semantics | **Fail** | Global keyboard handler intercepts Arrow keys and number keys even when focus is on `<select>` (issue A-02). |
| Reset behavior matches label promise | Pass | “Reset to Lecture Defaults” returns to Sun preset and hides Moon-only time control. |

---

### Issues table

| ID | Severity | Type | Repro steps (exact) | Expected vs Observed | Evidence | Likely root cause | Fix sketch (minimal; no code) |
|---|---|---|---|---|---|---|---|
| A-01 | Major | Science / UX / A11y | 1) Click “Jupiter” preset 2) Observe angular-size readout; repeat with “ISS overhead” | **Expected:** small angles shown with meaningful precision and/or in arcminutes/arcseconds (per README + common astronomy convention). **Observed:** always “degrees” with 2 decimals; Jupiter shows **0.01°** (rounding hides value); tiny angles become **0.00°**. | `demos/angular-size/angular-size.js#updateReadouts` hard-codes degrees + `toFixed(2)`. `demos/angular-size/README.md` describes arcsec formula + “appropriate units”. Playwright: Jupiter preset shows `0.01°`; far/tiny extreme shows `0.00°`. | `formatAngle()` exists but is not used; display format chosen is too coarse for typical astro examples. | Use `formatAngle()` for the readout (and for `#angle-text` and `aria-label`), or increase precision dynamically (e.g., more decimals <1°). Update labels (“Angular Size”) to match actual unit-switch behavior. |
| A-02 | Blocker | A11y / UX / Bug | 1) Focus the “Presets” `<select>` (`#preset-category`) 2) Press ArrowUp/ArrowDown or press `1` | **Expected:** Arrow keys change the select option (native behavior); number keys shouldn’t trigger unrelated shortcuts while a control is focused. **Observed:** key presses change demo state instead (ArrowUp increases size; `1` selects Sun preset) while the select remains focused. | `demos/angular-size/angular-size.js#setupKeyboard` ignores only `INPUT`, not `SELECT`/`BUTTON`. Playwright: with focus on `#preset-category`, ArrowUp changed `#size-display` from `1.00 cm` to `1.26 cm`; pressing `1` activated Sun preset. | Global keyboard handler is too broad (steals keys from interactive controls). | Gate keyboard shortcuts: return early when `event.target` is an interactive element (e.g., `INPUT`, `SELECT`, `BUTTON`, `TEXTAREA`, links) or when a modifier is held; consider scoping shortcuts to when focus is on the main demo container. |
| A-03 | Minor | UX / Visual / Performance | 1) Set size slider to max (1000) 2) Set distance slider to min (0) 3) Observe angle rays | **Expected:** even in saturated regimes, visualization remains bounded/readable. **Observed:** angle line endpoints become huge off-canvas values (e.g., y2 ≈ −11849 and +12149). | Playwright run-to-fail captured `#angle-line-top y2 = -11849.6` and `#angle-line-bottom y2 = 12149.6` at saturation. Code uses `tan(halfAngleCapped)` with `halfAngleCapped ≈ (π/2 - 0.01)`. | Extreme angles + tangent geometry → enormous line offsets; cap avoids infinity but still creates huge numbers. | When `angularDeg` is large (or when warning “inside object” triggers), clamp the drawn ray endpoints to the SVG bounds and/or switch to a different “saturated” visual state (e.g., show a semicircle + label). |
| A-04 | Major | Science / Copy (VERIFY) | 1) Click “Andromeda” preset 2) Compare displayed value to README claim | **Expected:** internal documentation and presets agree on headline examples (or explicitly explain differences). **Observed:** Demo displays **5.25°** for Andromeda; README says “~3°”. | Playwright: Andromeda preset shows `5.25°`. README: “Andromeda Galaxy ~3°”. Preset data in `demos/angular-size/angular-size.js` uses `diameter: 2.2e18 km (~220,000 ly)` and `distance: 2.4e19 km (~2.5 million ly)`. | Example depends on definition (bright disk vs extended halo) and/or preset values are not aligned with the narrative. | Decide which definition the course wants (VERIFY against course materials). Then align either the README copy or the preset values/description to match. Consider adding a parenthetical: “bright disk” vs “full extent”. |
| A-05 | Minor | Copy / Consistency | 1) Click “Your thumb” preset 2) Compare to the page’s “Thumb rule” | **Expected:** reference guide aligns with demo’s own “thumb” preset within stated approximation. **Observed:** thumb preset displays **1.64°**, while the guide says “about 2°”. | Playwright: “Your thumb” preset shows `1.64°`. Reference guide in `demos/angular-size/index.html` says `2°`. | Reference guide is a rounded mnemonic; preset is computed from specific assumed dimensions (2 cm @ 70 cm). | Add “~” / “about” language more explicitly (already present) and/or adjust the thumb preset assumptions if you want the preset to land closer to 2°. |
| A-06 | Major | Copy / Maintenance | 1) Open `demos/angular-size/README.md` “Technical Details” section 2) Compare file list to actual directory | **Expected:** README file list matches actual files. **Observed:** README references `presets.json`, but the directory does not contain it. | `demos/angular-size/README.md` file tree includes `presets.json`. `find demos/angular-size` shows only `README.md`, `index.html`, `angular-size.js`, `angular-size.css`. | README drift after refactor to inline presets in JS. | Update README to reflect current structure (either add `presets.json` back intentionally or remove it from docs and describe where presets live now). |
| A-07 | Minor | A11y | 1) Inspect page for `#status-announce` updates during interactions | **Expected:** if an `aria-live` region is present, it should announce meaningful changes (or be removed). **Observed:** `#status-announce` exists but is not updated by the demo JS. | `demos/angular-size/index.html` includes `#status-announce` region; no writes found in `demos/angular-size/angular-size.js`. | Copy/paste from shared shell pattern without implementation. | Either wire up announcements (e.g., on preset change / slider input) or remove the unused live region to avoid maintenance confusion. |

---

### Fix plan (prioritized, sequential; no implementation)

1) **Fix keyboard shortcut gating (A-02)**
   - Minimal change: ignore key handlers when focus is on interactive controls (at least `SELECT` and `BUTTON`, not just `INPUT`).
   - Verify: focus `#preset-category`, press ArrowUp/ArrowDown and `1` — ensure the select behaves normally and no preset/size/distance changes occur.

2) **Fix angular-size unit/precision handling (A-01)**
   - Minimal change: use `formatAngle()` (already in file) for readout + `#angle-text` + object `aria-label`.
   - Verify: Jupiter shows a stable, interpretable value (e.g., arcseconds/arcminutes) and tiny-angle presets no longer collapse to `0.00°`.

3) **Clamp or switch visualization in saturated regimes (A-03)**
   - Minimal change: when warning triggers (“inside object”), cap ray endpoints to SVG bounds or replace with a simpler saturated graphic.
   - Verify: extreme close/large case stays within the SVG without huge coordinate values.

4) **Resolve Andromeda example mismatch (A-04) (VERIFY)**
   - Decide which “Andromeda angular size” definition the course wants, then align README/preset accordingly.
   - Verify: README and preset display agree, or the UI labels the definition clearly.

5) **Update README drift (A-06)**
   - Remove `presets.json` from README tree or actually introduce it intentionally (requires explicit approval if it changes workflow).
   - Verify: README “Files” section matches `find demos/angular-size -maxdepth 2 -type f`.

6) **Optional: `aria-live` announcements (A-07)**
   - Either add minimal announcements for preset selection/slider changes or remove the unused region.
   - Verify: screen reader output is non-spammy and reflects meaningful state changes.

---

## Stop point

Audit stops here (end of Phase C — Exploration). No fixes implemented.

**Proceed to Demo 3 (`demos/moon-phases/`)?**

