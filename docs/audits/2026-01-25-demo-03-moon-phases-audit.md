# Demo 3 Audit — Moon Phases (`demos/moon-phases/`)

**Date:** 2026-01-25  
**Auditor:** Codex (GPT-5.2)  
**Scope:** Demo 3 only (`demos/moon-phases/`). No other demos reviewed in this audit.  

---

## Protocol Compliance (Phase Separation)

### Task classification (per `docs/llm-lab-protocol.md`)

- **Dominant:** Documentation / explanation (systematic audit report + fix plan)
- **Also:** Scientific correctness; UI/UX & accessibility review

### Role assignment

Your role: **architectural referee and invariant enforcer** (do not let aesthetics override correctness).

---

## Phase A — Understanding (no solutions)

### What this audit is doing

Audit `demos/moon-phases/` for:
- Scientific model correctness (assumptions, sign conventions, limiting cases)
- Visual correctness (geometry matches stated model; no misleading cues)
- UX/UI (layout, affordances, reset behavior)
- Accessibility (labels, keyboard navigation, focus behavior, announcements)
- Copy/formatting (consistency, clarity)
- Interactions/features (drag, presets, timeline, animation controls, shadow insight, challenge mode)
- Performance/stability (console errors, runaway loops, rapid input)

Deliverables:
- Model summary + explicit assumptions
- Completed checklist + issue table (with evidence + minimal fix sketches)
- Prioritized fix plan (no code)

### What is known

- Demo goal: phases come from **geometry**, not Earth’s shadow (shadow only matters for eclipses). Evidence: `demos/moon-phases/README.md` + in-page “Key insight”.
- Primary interactive: draggable Moon around orbit; readouts for phase name, illumination %, days since new. Evidence: `demos/moon-phases/index.html`.
- There is an “Insights (optional)” shadow toggle and a **Challenge Mode** powered by shared `demos/_assets/challenge-engine.js`.

### What is unknown / requires VERIFY

- Whether the “timeline direction” (WAXING/WANING) is intended to be strictly correct at **exact** boundary phases (New/Full), or whether “boundary ambiguity” is acceptable (currently it is *wrong* at New; see issues).
- Whether Challenge Mode is required to meet a strict **no-console-errors** invariant in production (a console error is currently triggerable; see issue M-03).

---

## Phase B — Assumption Audit

Assumptions used for this audit:

- **(Explicitly stated)** Geometry-only, schematic (not to scale); no full ephemeris. Evidence: `demos/moon-phases/index.html` model note.
- **(Reasonably inferred)** Angle convention is intentionally nonstandard but must be *internally consistent* and clearly communicated through UI behavior. Evidence: `demos/moon-phases/moon-phases.js` comments + timeline presets.
- **(Reasonably inferred)** Challenge Mode should not break accessibility fundamentals (no focus escape from modal, no console errors on normal user flows).

---

## Phase C — Exploration (no code)

### Model summary (what the demo claims to model)

**Claim:** The Moon is always half-lit by the Sun; phases are the fraction of the lit hemisphere visible from Earth.

**Coordinate / sign conventions (as implemented):**
- Orbital view is “from above the North Pole”; sunlight comes from the **left**. Evidence: `demos/moon-phases/index.html` sunlight arrows + code comments.
- Internal `moonAngle` (degrees) uses:
  - `0°` = **Full Moon** (Moon opposite Sun, on the right)
  - `180°` = **New Moon** (Moon between Earth and Sun, on the left)
  - `270°` = **First Quarter** (bottom of orbit)
  - `90°` = **Third Quarter** (top of orbit)  
  Evidence: `demos/moon-phases/moon-phases.js` comments + timeline `data-angle` values.

**Physics/geometry:**
- Illumination fraction uses `f = (1 + cos(angle))/2` given the above convention. Evidence: `demos/moon-phases/moon-phases.js#getIllumination`.
- Days since new uses synodic month `29.53` days and maps angle → phase fraction relative to New at 180°. Evidence: `demos/moon-phases/moon-phases.js#getDaysSinceNew`.
- Orbital view shows the Sun-facing hemisphere by clipping the lit circle to the **left half** (consistent with sunlight from left). Evidence: `demos/moon-phases/moon-phases.js#updateOrbitalView`.

### Evidence: local run + systematic checks

- Local server: `conda run -n astro python -m http.server 8004 --bind 127.0.0.1` (verified by `curl` returning HTTP 200 for `/demos/moon-phases/`).
- Playwright navigation: `http://127.0.0.1:8004/demos/moon-phases/`
- Console hygiene (load + basic interaction): no warning/error console messages observed.
- Mobile width check: `375×750` viewport showed no horizontal overflow (DOM `scrollWidth === innerWidth`).

**Important exception (console error):** a user-reachable flow in Challenge Mode produces a console error (issue M-03).

---

### Audit checklist (executed item-by-item)

| Checklist item | Result | Notes / evidence |
|---|---:|---|
| Load succeeds, no console errors | Pass | No warning/error console messages on initial load. |
| Drag interaction works and snaps | Pass | Dragging Moon to near-cardinal angles snaps within 5° (verified via Playwright coordinate drag). |
| Limiting cases: New/Full/Quarter readouts | Pass | New: 0% + ~0.0 days; Full: 100% + ~14.8 days; Quarter: 50% + ~7.4 days. |
| Visual correctness: sunlight vs lit hemisphere | Pass | Orbital lit clip always faces Sun (left). Phase rendering switches lit side for waxing/waning. |
| Timeline direction correctness | **Fail** | Shows “← WANING” at New Moon and “WAXING →” at Full Moon (issue M-01). |
| Timeline control accessibility | **Fail** | Desktop timeline buttons have ambiguous names (“Gibbous”, “Crescent” duplicated); accessible name changes across breakpoints (issue M-02). |
| Animation controls behave (play/pause/step/reset) | Pass | Play advances; Pause stops; Step advances by 45°; Reset stops + returns to Full + hides shadow. |
| Drag while animating behaves sensibly | **Fail (UX)** | Dragging while Play is running is overwritten by animation; does not pause on drag start (issue M-07). |
| Shadow insight toggle works and announces | Pass (with focus caveat) | Toggles shadow visibility + announces; first toggle shows popup with Escape to dismiss (issue M-05). |
| Challenge Mode basic flow | **Fail** | “Close” on completion screen triggers console error (issue M-03); modal focus is not trapped (issue M-06). |

---

### Issues table

| ID | Severity | Type | Repro steps (exact) | Expected vs Observed | Evidence | Likely root cause | Fix sketch (minimal; no code) |
|---|---|---|---|---|---|---|---|
| M-01 | Major | Science / UX | 1) Click timeline “New” (angle 180) 2) Read `#timeline-direction` | **Expected:** New Moon should be the start of **waxing** (illumination increasing after new). **Observed:** at New Moon, direction shows “← WANING”. At Full Moon (angle 0), direction shows “WAXING →” despite animation advancing into waning. | Playwright snapshot: at New Moon, `#timeline-direction` = “← WANING”; at Full Moon, “WAXING →”. Code: `demos/moon-phases/moon-phases.js#updateTimeline` uses `normalized > 180 || normalized === 0`. | Boundary conditions mishandled: angle exactly `180` is treated as waning; full is hard-coded as waxing. | Define waxing/waning via days-since-new: waxing when `0 ≤ days < SYNODIC_MONTH/2`, waning otherwise (choose explicit conventions at exactly 0 and half). |
| M-02 | Major | A11y / UX | 1) At desktop width, Tab into timeline strip 2) Inspect button names (screen reader) | **Expected:** Timeline buttons have unique, descriptive accessible names (e.g., “Waxing Gibbous”, “Waning Gibbous”). **Observed:** at desktop width, two buttons are named “Gibbous” and two are “Crescent” (ambiguous). At mobile width (span hidden), accessible names change to the `title` text (full names), making behavior inconsistent across breakpoints. | `demos/moon-phases/index.html` timeline buttons use short visible spans (“Gibbous”, “Crescent”) with `title` for full name; spans are `display:none` under 600px. Playwright snapshot shows name differences across viewport widths. | Accessible name derived from visible text; `title` only “wins” when the text span is hidden. | Add `aria-label` to timeline buttons with full names (always), keep visible short labels as-is. |
| M-03 | Blocker | Bug / Performance | 1) Click “🎯 Challenges” 2) Finish challenges (Finish → Close on completion screen) | **Expected:** Challenge Mode completion “Close” does not error. **Observed:** console error thrown. | Console error: `TypeError: Cannot read properties of null (reading 'style')` at `demos/_assets/challenge-engine.js:865` called from `...:937`. Trigger observed after clicking completion “Close”. | Completion UI replaces `.challenge-feedback` element; `reset()` calls `_clearFeedback()` without null-guard. | In `_clearFeedback`, null-check the feedback element before touching `.style`, or ensure completion screen preserves the feedback container. |
| M-04 | Major | UX / Consistency | 1) Start Challenges 2) Click “Exit challenge mode” (×) | **Expected:** Exiting challenge mode fully deactivates UI state (button not “active”, dialog removed or properly `aria-hidden`). **Observed:** dialog becomes `display:none` but remains in DOM; `#btn-challenges` keeps `.active` class (state implies “on” while hidden). | Playwright eval after ×: dialog `display:none` and `#btn-challenges.classList.contains('active') === true`. | Close path in ChallengeEngine hides UI without synchronizing external button state (moon-phases.js only toggles class on button click). | Provide an `onStop` callback (or similar) to update the host button state whenever ChallengeEngine closes itself; alternatively, have the engine remove itself from DOM on stop. |
| M-05 | Minor | A11y / UX | 1) Open Insights 2) Toggle shadow ON (popup appears) 3) Press Escape | **Expected:** Dismissing popup returns focus to a sensible control (e.g., shadow toggle). **Observed:** focus falls back to `BODY`. | Playwright eval after Escape: `document.activeElement` becomes `BODY`. Popup close button has `aria-label=\"Close\"` but visible text “Got it!”. | Dismiss handler removes popup without restoring prior focus. | Capture previously focused element before opening popup; restore focus on dismiss; align `aria-label` with visible text (or remove if redundant). |
| M-06 | Major | A11y | 1) Start Challenges 2) Press Tab repeatedly | **Expected:** Modal dialog traps focus while open. **Observed:** Tab order escapes the dialog into underlying page controls (moon slider, timeline buttons, etc.). | Playwright tab sequence moved from dialog buttons into `#moon-group` and timeline buttons while dialog remained open. | ChallengeEngine lacks focus trapping for `role=\"dialog\"`. | Add focus trap (cycle within dialog) + restore focus on close; optionally support Escape to close. |
| M-07 | Minor | UX | 1) Click Play 2) Drag the Moon to a target phase | **Expected:** Dragging should pause animation or otherwise “take control”. **Observed:** animation continues, overriding user drag selection. | Playwright run: after drag during animation, moon angle continued changing; user could not hold a target position. | Drag handlers do not stop animation state. | On drag start, call `stopAnimation()`; optionally disable drag while animating and communicate that state. |
| M-08 | Nit | Consistency / A11y | 1) Observe `aria-valuenow` near full/new boundaries | **Expected:** `aria-valuenow` stays within a stable interpretation (0–359 or similar). **Observed:** `aria-valuenow` can show 360 due to rounding near 359.6° while `aria-valuemax` is 360. | Playwright observed `aria-valuenow` = 360 at “Full Moon” before animation. Code: `Math.round(moonAngle)`. | Rounding at boundary produces duplicate representation of 0/360. | Consider using `Math.floor` for `aria-valuenow` and/or set max to 359; ensure `aria-valuetext` carries the semantic phase. |
| M-09 | Minor | A11y / Consistency | 1) Change phase via timeline click (mouse) 2) Observe `#status-announce` | **Expected:** If an `aria-live` region exists, major interaction pathways update it (not just keyboard). **Observed:** `#status-announce` updates on keyboard arrow movement, shadow toggle, and reset, but not on timeline/preset clicks. | No writes to `#status-announce` in timeline click handlers; only in keyboard handler + shadow toggle + reset. | Partial announcement wiring. | Add minimal announcements on timeline/preset clicks (phase + illumination) or remove the live region if it’s intentionally limited. |

---

### Fix plan (prioritized, sequential; no implementation)

1) **Fix Challenge Mode console error (M-03)**  
   - Minimal change: null-guard `.challenge-feedback` in `ChallengeEngine._clearFeedback()` (or preserve it in completion layout).  
   - Verify: run Challenge Mode → Finish → Close; confirm Playwright console has no errors.

2) **Add modal focus trap + close semantics for Challenge Mode (M-06)**  
   - Minimal change: trap Tab within the dialog and support Escape to close (optional but high-value).  
   - Verify: with dialog open, Tab cycles within dialog only; focus restored to `#btn-challenges` on close.

3) **Fix timeline direction boundary behavior (M-01)**  
   - Minimal change: compute waxing/waning from days-since-new rather than raw angle comparisons.  
   - Verify: at New Moon, direction indicates waxing; at Full Moon, direction indicates waning (or “Full (turning point)” if you choose neutral wording).

4) **Fix timeline button accessible names (M-02)**  
   - Minimal change: add `aria-label="Waxing Gibbous"` etc on `.timeline-phase` buttons.  
   - Verify: at desktop and mobile widths, screen-reader names are unique and stable.

5) **Fix Challenge exit button state sync (M-04)**  
   - Minimal change: have ChallengeEngine stop/close event notify the host so `#btn-challenges` class reflects actual state.  
   - Verify: after × exit, dialog hidden/removed and `#btn-challenges` is not `.active`.

6) **Improve drag+animation interaction (M-07)**  
   - Minimal change: stop animation on drag start.  
   - Verify: while playing, drag pauses and leaves Moon where user releases it.

7) **Focus restoration for insight popup (M-05)**  
   - Minimal change: restore focus to the shadow toggle on dismiss.  
   - Verify: Escape/close returns focus to the toggle and does not strand focus on `BODY`.

8) **Optional: announcement completeness (M-09)**  
   - Minimal change: announce phase changes for mouse-driven timeline/preset clicks.  
   - Verify: `#status-announce` updates for both mouse and keyboard interactions without spamming during animation.

---

## Stop point

Audit stops here (end of Phase C — Exploration). No fixes implemented.

**Proceed to Demo 4 (`demos/eclipse-geometry/`)?**

