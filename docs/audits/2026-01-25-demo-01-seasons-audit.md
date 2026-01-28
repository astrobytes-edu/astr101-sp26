# Demo 1 Audit — Seasons (`demos/seasons/`)

**Date:** 2026-01-25
**Auditor:** Codex (GPT-5.2)
**Scope:** Demo 1 only (`demos/seasons/`). No other demos reviewed in this audit.

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

Audit `demos/seasons/` with a fine-tooth comb for:
- Scientific model correctness
- Visual correctness
- UX/UI
- Accessibility
- Copy/formatting
- Interactions/features
- Performance/stability (console hygiene, rapid input, edge states)

Deliverables:
- Model summary + explicit assumptions
- Completed checklist + issue table (with evidence + minimal fix sketches)
- Prioritized fix plan (no code)

### What is known

- Demo purpose (per `demos/seasons/README.md`): show that **axial tilt causes seasons, not distance**.
- Demo exposes controls: date/day-of-year, axial tilt (0–180°), latitude (−90° to +90°), season presets, planet presets, animation, overlay toggles.
- Key computations live in `demos/seasons/seasons.js` (declination, day length, sun altitude, distance proxy).

### What is unknown / requires VERIFY

- Intended meaning of “Planet Presets”: **tilt-only** vs **full orbital + calendar** behavior.
- Intended semantics of “Date (Day of Year)”: 0-based vs 1-based and what day number should correspond to March 21 / equinox.
- Intended physical fidelity of the globe “terminator” + celestial equator/ecliptic overlays (schematic vs physically faithful).

---

## Phase B — Assumption Audit

Assumptions used for this audit:

- **(Explicitly stated)** This is a **conceptual** seasons model, not an ephemeris. Evidence: “Model note” in `demos/seasons/index.html`.
- **(Reasonably inferred)** The “lecture defaults” are: Earth, day ~ March equinox, tilt 23.5°, latitude 40°N. Evidence: `demos/seasons/seasons.js` reset handler.
- **(Reasonably inferred)** The “Planet Presets” are intended for meaningful comparison (otherwise the UI label is misleading). Evidence: `demos/seasons/index.html` + `demos/seasons/planets.json`.
- **(Unknown / underspecified)** Whether “seasons” labels should disappear when effective tilt is ~0° (I assume yes, because the demo’s core claim is tilt → seasons). Evidence: `demos/seasons/README.md` Q1.

If any of the “unknown/underspecified” assumptions are wrong, the fix plan should change accordingly.

---

## Phase C — Exploration (no code)

### Model summary (what the demo claims to model)

**Claim:** Seasons are driven by **axial tilt**, not Earth–Sun distance. The demo shows:
- A simplified Sun-declination model as a sinusoid over a 365-day year.
- Derived quantities at a chosen latitude: **day length** and **noon Sun altitude**.
- A schematic orbit view with **exaggerated eccentricity** and a distance readout (AU).
- A schematic globe view with illumination overlays and latitude bands.

**Explicit assumptions (as implemented / displayed):**
- Year length is 365 days; no leap day.
- Solar declination is sinusoidal with equinox anchored near day 80 (`demos/seasons/seasons.js#getSunDeclination`).
- Earth–Sun distance is a simple cosine model with amplitude 0.017 AU (`demos/seasons/seasons.js#getEarthSunDistance`).
- Retrograde tilts (>90°) use an “effective obliquity” in 0–90° for seasonal amplitude (`demos/seasons/seasons.js#effectiveObliquityDegrees`).
- “Orbit exaggerated for visibility” note is present in `demos/seasons/index.html`.

### Evidence: local run + systematic checks

- Local server: `conda run -n astro python -m http.server 8002 --bind 127.0.0.1` (verified by `curl` returning HTTP 200 for `/demos/seasons/`).
- Playwright navigation: `http://127.0.0.1:8002/demos/seasons/`
- Console hygiene: Playwright `browser_console_messages` at `warning` level returned **no messages** on load and during interactions.
- Mobile width check: `375×750` viewport showed no horizontal overflow (DOM `scrollWidth === innerWidth`).

### Audit checklist (executed item-by-item)

| Checklist item | Result | Notes / evidence |
|---|---:|---|
| Load succeeds, no console errors | Pass | Playwright: no warning/error console messages observed. |
| Date slider extremes behave sensibly | **Fail** | Day 365 displays “January 1” instead of Dec 31 (see issue S-01). |
| Equinox/solstice presets match displayed dates | **Fail** | “March Equinox” preset uses day 80, but day 80 displays “March 22” (issue S-01). |
| Day length limiting cases (poles, solstices) | Pass | Example: lat 90°, day 172 → 24h; day 356 → 0h (Playwright run-to-fail). |
| Sun altitude limiting cases | Pass (but see note) | Can be negative at polar night (e.g., −23.5°), which is reasonable for “noon altitude below horizon”. |
| Season labels reflect model assumptions | **Fail** | With tilt 0° (or effective tilt ~0°), seasons should arguably vanish/neutralize (issue S-02). |
| Orbital view geometry matches labeling | **Fail** | Earth position uses perihelion-anchored angle, but month/season labels are fixed quadrants (issue S-03). |
| Planet preset behavior matches copy | **Fail** | Selecting Mars/Venus changes tilt/color but keeps “Earth-Sun Distance” and Earth calendar labels (issue S-04). |
| All controls have accessible names | Pass | Sliders have `aria-label`; checkboxes are label-wrapped; buttons have text. |
| Keyboard interaction doesn’t break default semantics | **Fail** | Global Spacebar handler overrides “Space activates focused button” (issue S-05). |
| Reset behavior matches user expectation | **Fail (minor)** | “Reset to Lecture Defaults” does not reset overlay toggles (issue S-06). |
| Overlay toggles do what they claim | Pass | Toggling changes SVG element `display` state (verified in Playwright). |
| Visual affordances match behavior | **Fail (minor)** | Cursor suggests Earth is draggable, but drag does nothing (issue S-07). |

---

### Issues table

| ID | Severity | Type | Repro steps (exact) | Expected vs Observed | Evidence | Likely root cause | Fix sketch (minimal; no code) |
|---|---|---|---|---|---|---|---|
| S-01 | Major | Bug / Consistency | 1) Open demo 2) Set `#date-slider` to **365** | **Expected:** max day corresponds to Dec 31. **Observed:** day 365 shows **January 1**. Also: day 80 shows **March 22** (not March 21) while model treats day 80 as equinox. | `demos/seasons/index.html` (`#date-slider max="365"`). `demos/seasons/seasons.js#dayOfYearToDate`. Playwright eval: day 365 → “January 1”; day 80 → “March 22”; day 79 → “March 21”. | Mixed 0-based vs 1-based day indexing; slider includes out-of-range 365 for a non-leap year. | Choose a single convention (recommend 1–365). Align: slider min/max, `dayOfYearToDate`, declination anchor, and preset day values. Add a quick “Dec 31 is the last day” sanity check. |
| S-02 | Major | Science / UX | 1) Set day to 172 2) Set `#tilt-slider` to **0** | **Expected:** demo indicates “no seasons” when effective tilt ~0°. **Observed:** “Season (North)” still shows “Summer” (and changes with day). | `demos/seasons/seasons.js#getSeasonNorth` uses day only; does not depend on tilt. Playwright run-to-fail: tilt 0°, day 172 → “Summer”. | Season label computed from day buckets, independent of obliquity. | When effective tilt is ~0°, switch season readouts to “No seasons” (or hide), and/or gray out season styling; keep day length + altitude (they remain meaningful). |
| S-03 | Major | Science / Visual | 1) Click “March Equinox” 2) Observe orbit labels vs Earth position 3) Compare with perihelion/aphelion markers | **Expected:** Either (a) orbit labels correspond to the Earth marker’s position, or (b) labels are explicitly schematic and not co-presented with distance-truthful geometry. **Observed:** Earth position is computed with perihelion anchored on +x axis, but month/season labels are hard-coded at quadrants; orbit path is forced to a circle in JS. | `demos/seasons/seasons.js#getOrbitAngleFromDay` (“Anchor perihelion … on the +x axis”). `demos/seasons/index.html` quadrant labels “March/June/September/December”. Playwright eval: day 80 Earth angle ≈ 75.9° (not at top); orbit path ends up rx=150, ry=150. | Conflicting design goals: “truthful perihelion anchor” + “intuitive quadrant season labels” combined in the same view. | Pick one: **Truthful geometry** (place equinox/solstice markers at their true longitudes) *or* **schematic seasons wheel** (remove perihelion/aphelion claims and keep quadrants). If keeping both, label them clearly and visually separate “calendar labels” from “distance model”. |
| S-04 | Major | Science / UX | 1) Click planet preset (e.g., Mars) 2) Check readout labels and date formatting | **Expected:** Either the entire demo switches to that planet’s orbit/calendar/readouts, or the UI clearly indicates only tilt is changing. **Observed:** planet name/tilt changes, but readout still says “Earth-Sun Distance” and uses Earth month names / day-of-year mapping. | `demos/seasons/index.html` readout label is literal “Earth-Sun Distance”. `demos/seasons/planets.json` contains perihelion/aphelion/orbitalPeriod but these are unused. Playwright: planet “Mars” while label remains “Earth-Sun Distance”. | Planet preset wiring updates `state.axialTilt` + color only; the rest of the model remains Earth-specific. | Decide intent: (A) rename “Planet Presets” → “Tilt Presets (Planets)” and keep Earth distance/calendar, or (B) use `planets.json` orbital params and change labels to “Sun distance” + planet-appropriate scales (and change “Date” to “Orbital position”). |
| S-05 | Major | A11y / UX | 1) Focus a button (e.g., `#preset-jun-solstice`) 2) Press **Space** | **Expected:** Space activates the focused button (standard keyboard semantics). **Observed:** Space starts/stops animation (Stop becomes enabled; Animate becomes disabled). | `demos/seasons/seasons.js#setupKeyboard` intercepts Space unless `event.target.tagName === 'INPUT'`. Playwright: focused `preset-jun-solstice` + Space → animation started. | Global key handler does not exclude buttons/links/checkbox labels, so it steals Space. | Restrict keyboard shortcuts: ignore events when focus is on interactive elements (`INPUT`, `BUTTON`, `SELECT`, `TEXTAREA`, links) and when modifier keys are used; only use Spacebar for animation when focus is on the page background (or add a dedicated shortcut like “A” for animate). |
| S-06 | Minor | UX / Consistency | 1) Toggle overlays (e.g., check Ecliptic) 2) Click “Reset to Lecture Defaults” | **Expected:** reset restores default overlays (Latitude Bands + Terminator on; others off). **Observed:** overlay toggles persist across reset. | `demos/seasons/seasons.js` reset handler sets day/tilt/lat/planet only. Playwright: after reset, `#toggle-ecliptic` remained checked. | Reset handler doesn’t reset overlay state/checkboxes. | Decide reset scope; if “Lecture Defaults” implies full UI reset, also restore overlay defaults and reflect in checkboxes. |
| S-07 | Minor | UX / Copy | 1) Hover Earth marker in orbit 2) Attempt drag | **Expected:** drag changes orbital position (as README and cursor imply). **Observed:** drag has no effect; only sliders/presets change position. | `demos/seasons/README.md` says “Drag Earth around its orbit”. CSS sets `.earth-marker { cursor: grab; }`. Playwright drag attempt: no change in `#date-slider`. | README/CSS affordance out of sync with implemented interaction set. | Either implement drag (if desired) or remove drag claims + “grab” cursor so affordances match reality. |

---

### Fix plan (prioritized, sequential; no implementation)

1) **Fix day indexing + slider range (S-01)**
   - Minimal change: choose 1-based (1–365) *or* keep 0–364; make it consistent everywhere (slider, presets, declination anchor, date formatting).
   - Verify: set to min and max; confirm displayed dates are Jan 1 and Dec 31; confirm “March Equinox” preset shows March 21 (or explicitly documented alternative).

2) **Fix Spacebar keyboard semantics (S-05)**
   - Minimal change: don’t intercept Space unless focus is on non-interactive background.
   - Verify: focus each button and press Space; confirm it activates that button and does not start animation. Confirm Space still toggles animation when focus is not on a control (if keeping that shortcut).

3) **Neutralize seasons when effective tilt ~0° (S-02)**
   - Minimal change: when `effectiveObliquityDegrees(axialTilt)` is below a small threshold, set season readouts to “No seasons” (and adjust styling).
   - Verify: tilt 0° and 180° at multiple days → season readouts remain “No seasons”; day length + altitude still update smoothly.

4) **Resolve orbital-view coherence (S-03)**
   - Minimal change option A (schematic): remove perihelion/aphelion markers and align orbit labels to the model’s “season quadrants”.
   - Minimal change option B (truthful): keep perihelion/aphelion anchor and move equinox/solstice markers/labels to their true longitudes for the chosen calendar anchor.
   - Verify: at each preset day, Earth marker visually aligns with the corresponding label; distance marker remains consistent with position.

5) **Clarify/repair “Planet Presets” scope (S-04)**
   - Minimal change option A: rename UI copy to “Tilt presets” and keep Earth-only calendar/distance.
   - Minimal change option B: make distance + orbit scale planet-aware and replace “Date” with “Orbital position” (fraction of orbit / solar longitude).
   - Verify: switching presets cannot produce “Earth-Sun Distance” while planet label reads “Mars” (either label changes or feature is removed).

6) **Decide reset scope (S-06)**
   - Minimal: either rename to “Reset sliders” (if overlays persist by design) or reset overlays too.
   - Verify: after reset, UI state matches the chosen label’s promise.

7) **Align affordances with behavior (S-07)**
   - Minimal: remove drag claims + cursor styling, *or* add drag support.
   - Verify: user can discover how to change date without reading external docs; no misleading cursor.

---

## Stop point

Audit stops here (end of Phase C — Exploration). No fixes implemented.

**Proceed to Demo 2 (`demos/angular-size/`)?**

