# Demo 4 Audit — Eclipse Geometry (`demos/eclipse-geometry/`)

**Date:** 2026-01-25
**Auditor:** Codex (GPT-5.2)
**Scope:** Demo 4 only (`demos/eclipse-geometry/`). No other demos reviewed in this audit.

---

## Protocol Compliance (Phase Separation)

### Task classification (per `docs/llm-lab-protocol.md`)

- **Dominant:** Documentation / explanation (systematic audit report + fix plan)
- **Also:** Scientific correctness; UI/UX & accessibility review; performance/stability review

### Role assignment

Your role: **architectural referee and invariant enforcer** (do not let aesthetics override correctness).

---

## Phase A — Understanding (no solutions)

### What this audit is doing

Audit `demos/eclipse-geometry/` for:
- Scientific model correctness (assumptions, sign conventions, limiting cases)
- Visual correctness (geometry matches stated model; no misleading cues)
- UX/UI (layout, affordances, reset behavior)
- Accessibility (labels, keyboard navigation, focus management)
- Copy/formatting (consistency between README + in-page text)
- Interactions/features (drag, phase buttons, animations, simulation, log, challenge mode)
- Performance/stability (console errors, long-run simulation behavior)

Deliverables:
- Model summary + explicit assumptions
- Completed checklist + issue table (with evidence + minimal fix sketches)
- Prioritized fix plan (no code)

### What is known

- Demo goal (per README + page subtitle): explain why eclipses don’t happen every month; show dependence on orbital tilt + nodes; allow long-term frequency simulation.
- The model uses Moon “ecliptic height” as a sinusoid: `β = tilt * sin(angleFromNode)`. Evidence: `demos/eclipse-geometry/eclipse-geometry.js#L117`.
- Eclipse classification is by comparing `|β|` to fixed thresholds (total/partial solar/lunar). Evidence: `demos/eclipse-geometry/eclipse-geometry.js#L28`.

### What is unknown / requires VERIFY

- Whether the “eclipse limit” threshold values in degrees (0.94°, 1.63°, 0.41°, 1.09°) are intended to be treated as authoritative. They are presented as “based on actual eclipse limits” in code comments and as an “Eclipse Limits” table in the README; that likely warrants a source-backed verification (outside this audit).

---

## Phase B — Assumption Audit

Assumptions used for this audit:

- **(Explicitly stated)** The demo is a **conceptual** model and results are approximate. Evidence: “Model note” in `demos/eclipse-geometry/index.html`.
- **(Reasonably inferred)** The top-down and side views are intended to be mutually consistent: “New Moon” should place the Moon between Earth and Sun in both views, etc.
- **(Reasonably inferred)** Challenge Mode should meet the same “no console errors” and accessibility expectations as the main demo UI.

---

## Phase C — Exploration (no code)

### Model summary (what the demo claims to model)

**Claim:** Eclipses require **(1) the right phase** (New for solar, Full for lunar) and **(2) the Moon near a node**, so its ecliptic latitude is small enough.

**Implemented geometry:**
- Ecliptic “height” model: `heightDeg = tiltDeg * sin(moonAngle - nodeAngle)` (degrees). Evidence: `demos/eclipse-geometry/eclipse-geometry.js#L117`.
- Phase names bucket by `moonAngle` (0 = Full, 180 = New). Evidence: `demos/eclipse-geometry/eclipse-geometry.js#L127`.
- Eclipse classification compares `absHeight` against four fixed degree thresholds. Evidence: `demos/eclipse-geometry/eclipse-geometry.js#L150`.
- Long-term simulation advances through synodic months and checks New (180°) and Full (0°) each month, with node regression ~19.3°/yr. Evidence: `demos/eclipse-geometry/eclipse-geometry.js#L603`.

### Evidence: local run + systematic checks

- Local server: `conda run -n astro python -m http.server 8005 --bind 127.0.0.1` (verified by `curl` returning HTTP 200 for `/` and page load in Playwright).
- Playwright navigation: `http://127.0.0.1:8005/demos/eclipse-geometry/`
- Console hygiene:
  - No warning/error console messages on initial load and non-challenge interactions.
  - **Console error is triggerable via Challenge Mode completion close** (issue E-04).
- Mobile width check: `375×750` viewport showed no horizontal overflow (DOM `scrollWidth === innerWidth`).

---

### Audit checklist (executed item-by-item)

| Checklist item | Result | Notes / evidence |
|---|---:|---|
| Load succeeds, no console errors | Pass (main UI) | No warnings/errors on load and basic interactions. |
| Tilt slider limiting cases (0°, 10°) | Pass | At tilt=0: Solar eclipse at New, Lunar eclipse at Full. At tilt=10: “NO ECLIPSE” typical. |
| Phase buttons behave | Pass | “New Moon” animates to New; “Full Moon” animates to Full. |
| Drag works (mouse/touch) and stops animation | Pass | Dragging calls `stopAnimation()` on mousedown/touchstart. |
| Side view matches stated phase geometry | **Fail** | At New Moon, side-view Moon is drawn to the **right** of Earth (issue E-01). |
| Animations keep geometry in bounds | **Fail** | During animations, side-view Moon can move off-canvas (negative `cx`) (issue E-02). |
| Eclipse “zone” indicator works | **Fail** | `#eclipse-zone-path` exists but stays empty; no visual eclipse window (issue E-03). |
| Simulation (1 year) completes + shows stats | Pass | 1-year run completes; stats/log update. |
| Simulation (1000 years) completes + truncates log | Pass | 1000-year run completes; log shows last 100 rows + “…and N more”. |
| Challenge Mode works with no console errors | **Fail** | Completion “Close” triggers ChallengeEngine error (issue E-04). |
| Challenge Mode accessibility | **Fail** | Modal focus is not trapped; Tab escapes into page controls (issue E-05). |
| Basic control labeling | Pass | Sliders have `aria-label`; buttons have text. |
| Drag interaction accessibility | **Fail** | Drag-only Moon control is not keyboard reachable and has no slider semantics (issue E-06). |

---

### Issues table

| ID | Severity | Type | Repro steps (exact) | Expected vs Observed | Evidence | Likely root cause | Fix sketch (minimal; no code) |
|---|---|---|---|---|---|---|---|
| E-01 | Blocker | Science / Visual | 1) Click “↺ Reset” 2) Click “New Moon” 3) Observe side view | **Expected:** at New Moon, Moon lies between Earth and Sun (left of Earth in the side view, near Sun). **Observed:** Moon is drawn at `cx ≈ 225`, which is **right of Earth** (`x=200`) and far from Sun (`x≈30`). | Playwright measurement: New Moon → `#moon-side[cx]=225` while Earth is at `x=200` and Sun at `x=30`. Code comment claims new is left: `demos/eclipse-geometry/eclipse-geometry.js#L232`. | Side-view x-mapping is inconsistent with the physical diagram; it uses a linear mapping of raw angle and does not match top view geometry. | Compute side-view x from the same geometric projection as the top view (e.g., map via `cos(angle)` so New is left and Full is right), and ensure the “Sun” marker aligns with that axis. Update node-side markers and the sinusoid x parameterization accordingly. |
| E-02 | Major | Bug / Visual | 1) Click “↺ Reset” 2) Click “Animate 1 Year” 3) Wait ~1s 4) Observe side-view Moon x-position | **Expected:** Moon remains within the side-view SVG bounds during animations. **Observed:** side-view Moon can leave the canvas (e.g., `cx` becomes negative). | Playwright captured `#moon-side[cx] ≈ -40.5` during/after animation. Cause: sideX uses un-normalized `state.moonAngle`: `demos/eclipse-geometry/eclipse-geometry.js#L234`, while animations set `state.moonAngle` well beyond 0–360: `demos/eclipse-geometry/eclipse-geometry.js#L556`. | Side view uses raw `state.moonAngle` instead of a normalized (0–360) value; animation accumulates beyond 360. | Normalize angle before side-view mapping (and in any “angle → x” mapping); optionally clamp to a cycle. |
| E-03 | Major | UX / Consistency | 1) Load demo 2) Look for “eclipse zone indicator” near nodes | **Expected:** “near-node” window is visible/communicated (especially since UI includes an `eclipse-zone` group). **Observed:** no eclipse zone is rendered; the path has empty `d`. | `demos/eclipse-geometry/index.html` includes `#eclipse-zone-path` with `d=\"\"`. Playwright: `document.querySelector('#eclipse-zone-path').getAttribute('d') === \"\"`. No JS updates found (no references to `eclipse-zone` in `demos/eclipse-geometry/eclipse-geometry.js`). | Feature stub: SVG element exists but there is no logic to draw it. | Either remove the unused SVG element (if out of scope) or implement a minimal “eclipse window” overlay based on thresholds and current tilt/node angle; ensure it matches the model and does not imply false physical precision. |
| E-04 | Blocker | Bug / Performance | 1) Click “Challenge Mode” 2) Skip to “Finish” 3) Click “Finish” then “Close” | **Expected:** no console errors on Challenge completion close. **Observed:** console error thrown. | Console error: `TypeError: Cannot read properties of null (reading 'style')` at `demos/_assets/challenge-engine.js:865` called from `...:937`. Trigger reproduced in this demo. | Shared `ChallengeEngine._clearFeedback()` assumes `.challenge-feedback` exists; completion screen likely removes it. | Fix in shared `demos/_assets/challenge-engine.js`: null-guard `.challenge-feedback` before using `.style` (or keep feedback container in completion layout). |
| E-05 | Major | A11y | 1) Open Challenge Mode 2) Press Tab repeatedly | **Expected:** modal dialog traps focus while open. **Observed:** Tab escapes into underlying page controls (e.g., tilt slider, buttons). | Playwright tab sequence: from dialog “Next →”, focus moved to `#tilt-slider`, then other page controls while dialog was still open. | ChallengeEngine lacks focus trap for its `role=\"dialog\"`. | Add focus trapping to ChallengeEngine and restore focus to the trigger button on close; support Escape-to-close. |
| E-06 | Major | A11y / UX | 1) Attempt to use demo without a mouse (keyboard-only) 2) Try to move Moon position | **Expected:** Moon position is adjustable via keyboard (or an alternate control exists) with clear focus + `aria` semantics. **Observed:** Moon drag handle (`#moon-top`) is not focusable and has no keyboard interaction; only mouse/touch drag works. | `demos/eclipse-geometry/index.html` has `<g id=\"moon-top\" class=\"moon-draggable\">` without `tabindex`/`role`. JS drag handlers are mouse/touch only: `demos/eclipse-geometry/eclipse-geometry.js#L341`. | Drag-only control lacks keyboard affordance. | Add keyboard-adjustable control for moon angle (e.g., a slider or focusable `role=\"slider\"` with arrow key handlers), mirroring the Moon Phases demo pattern. |
| E-07 | Minor | Science / Consistency | 1) Read README claims about node regression direction/speed 2) Compare month vs year animations | **Expected:** node regression direction and magnitude are consistent across animations and documentation. **Observed:** “Animate 1 Year” regresses node angle (`nodeAngle = startNode - progress*19.3`), but “Animate 1 Month” increments `nodeAngle += 0.02` each frame (different sign and unclear magnitude). | `demos/eclipse-geometry/eclipse-geometry.js#L525` vs `demos/eclipse-geometry/eclipse-geometry.js#L557`. | Month animation uses a hard-coded per-frame increment rather than a consistent physical rate. | Use a consistent node regression model across animations (and scale per animation duration). If month animation should demonstrate regression, compute regression from elapsed time with the same sign convention as the year animation. |
| E-08 | Minor | UX | 1) Run 1000-year simulation 2) Click “↺ Reset” | **Expected:** reset clears stats values (even if stats panel is hidden) or makes the cleared state explicit when re-opened. **Observed:** reset hides panels but stat text can remain stale when hidden (then updates on next run). | Reset hides panels but does not call `updateStats()`: `demos/eclipse-geometry/eclipse-geometry.js#L459`. Playwright: before running 1-year sim, `#stat-years` still read “1000.0” while stats panel was hidden. | Reset pathway doesn’t refresh stat text; relies on hiding. | Optionally call `updateStats()` with cleared state (or set stat text to 0) during reset for internal consistency and easier debugging. |
| E-09 | Minor | UX / Consistency | 1) Click “Challenge Mode” 2) Complete and “Close” challenges | **Expected:** Challenge toggle button reflects actual state after close. **Observed:** dialog is hidden, but button still reads “Exit Challenges”. | Playwright after completion close: dialog `display:none` while `#btn-challenges` text remains “Exit Challenges”. | Host button text only updates on its own click handler; engine-internal close doesn’t notify host. | Add a stop/close callback from ChallengeEngine to host, or have the engine fully remove itself and invoke a provided `onStop` to restore button label/state. |

---

### Fix plan (prioritized, sequential; no implementation)

1) **Fix side-view phase geometry mapping (E-01)**
   - Minimal change: define side-view x-position so New Moon is left of Earth and Full Moon is right (consistent with top view + Sun position).
   - Verify: click New/Full; confirm `#moon-side` is left/right of Earth as expected and the status phase matches.

2) **Fix shared ChallengeEngine console error (E-04)**
   - Minimal change in `demos/_assets/challenge-engine.js`: null-guard `.challenge-feedback` in `_clearFeedback()`.
   - Verify: Challenge Mode → Finish → Close yields no console errors.

3) **Add Challenge modal focus trap (E-05)**
   - Minimal change: trap Tab within dialog; restore focus to `#btn-challenges` on close.
   - Verify: with dialog open, Tab never focuses underlying page controls.

4) **Normalize angles for side-view mapping (E-02)**
   - Minimal change: use a normalized angle before mapping to x; keep moon within viewBox during animateMonth/animateYear.
   - Verify: during animations, `#moon-side` stays within visible bounds (no negative `cx`).

5) **Decide and implement/remove eclipse-zone overlay (E-03)**
   - Minimal change: either remove the dead SVG element or render a simple “near-node window” overlay matching the current thresholds.
   - Verify: eclipse window is discoverable and correctly tied to the current model.

6) **Add keyboard-accessible Moon angle control (E-06)**
   - Minimal change: add a slider or make the Moon handle a true `role=\"slider\"` with arrow key support.
   - Verify: keyboard-only user can set New/Full and move near nodes without a mouse.

7) **Unify node regression across animations (E-07)**
   - Minimal change: compute node regression from elapsed time with the same sign convention in both month/year animations.
   - Verify: month and year animations move nodes in the same direction and approximately consistent rates (scaled by simulated time).

8) **Optional: reset stat text for coherence (E-08)**
   - Minimal change: set stat fields to 0 (or call `updateStats()`) on reset.
   - Verify: after reset, hidden stats state is internally consistent when shown again.

9) **Sync Challenge toggle button label with engine close (E-09)**
   - Minimal change: restore “Challenge Mode” label when the engine closes via its own UI.
   - Verify: after × / Close, the button label matches actual inactive state.

---

## Stop point

Audit stops here (end of Phase C — Exploration). No fixes implemented.

Want me to switch to “implement fixes” mode (and if so, start with the shared `ChallengeEngine` console error first)?

