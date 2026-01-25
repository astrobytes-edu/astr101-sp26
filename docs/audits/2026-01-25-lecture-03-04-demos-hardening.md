# Lecture 03–04 Demos Hardening Audit

**Date:** 2026-01-25  
**Auditor:** Codex (GPT-5.2)  
**Scope:** `demos/seasons/`, `demos/angular-size/`, `demos/moon-phases/`, `demos/eclipse-geometry/` (+ shared assets in `demos/_assets/`)  
**Source-of-truth:** mission text in `modules/module-01/readings/lecture-03-sky-is-a-map.qmd` and `modules/module-01/readings/lecture-04-moon-geometry-reading.qmd`  
**Overall Verdict:** PASS

---

## Local Run Setup (required)

1. From repo root, use the course conda env:
   - One-liner: `conda run -n astro python -m http.server 8000 --bind 127.0.0.1`
   - Or: `conda activate astro` then `python -m http.server 8000 --bind 127.0.0.1`
2. Open:
   - `http://localhost:8000/demos/seasons/`
   - `http://localhost:8000/demos/angular-size/`
   - `http://localhost:8000/demos/moon-phases/`
   - `http://localhost:8000/demos/eclipse-geometry/`
3. Keep DevTools console open; treat any console error/warn as a bug unless explicitly justified here.

---

## Executive Summary

- **Traceability:** All Lecture 03–04 demo mission rows are **PASS**; UI labels and behaviors match the readings’ wording closely enough for “do this” steps to be executed literally.
- **Console hygiene:** No console errors or warnings observed during normal use (verified by Playwright navigation across all 4 demos).
- **Mobile-ish viewport:** At ~375px width, all 4 demos load without horizontal overflow (scroll instead of clip; no forced sideways scroll).
- **Keyboard reachability:** Core controls are keyboard-focusable via Tab (sliders, buttons, toggles, selects; Moon is focusable and draggable target is labeled for assistive tech).
- **Repo verification:** `quarto render` succeeded (required gate for site changes; run with escalated permissions due to sandbox restrictions).

---

## Traceability Matrices (pre‑scaffolded; fill during audit)

Conventions:
- “Observed” should say what you actually saw (UI label text, readout values changing, etc.).
- “Code pointers” should list the most relevant files/functions (start with the demo’s main JS file).

### Demo: Seasons (`demos/seasons/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **Season Presets:** Jump to solstices and equinoxes | “Season Presets” control | Presets exist + switch date/season | Control titled “Season Presets” with buttons “March Equinox”, “June Solstice”, “September Equinox”, “December Solstice”. | PASS |  | `demos/seasons/index.html`, `demos/seasons/seasons.js` |
| Overview | **Readouts:** Day Length, Sun Altitude, Earth-Sun Distance for the selected date | Readout panel(s) | Readouts exist + update with preset/date | Readout panel includes “Day Length”, “Sun Altitude”, “Earth-Sun Distance” and updates with presets/slider. | PASS |  | `demos/seasons/index.html`, `demos/seasons/seasons.js` |
| Overview | **Display Overlays:** Celestial Equator, Ecliptic, Day/Night Terminator | Overlay toggles | Toggles exist + affect visualization | “Display Overlays” checkboxes include “Celestial Equator”, “Ecliptic”, “Day/Night Terminator”. | PASS |  | `demos/seasons/index.html`, `demos/seasons/seasons.js` |
| Overview | **Observer Latitude:** See how seasons differ at different latitudes | “Observer Latitude” control | Latitude changes affect day length / sun altitude | Slider labeled “Observer Latitude” updates “Day Length”/“Sun Altitude” as latitude changes. | PASS |  | `demos/seasons/index.html`, `demos/seasons/seasons.js` |
| M1 | Click **Season Presets** and select each season in order: March Equinox → June Solstice → September Equinox → December Solstice | Preset buttons/options with these names | Each selection changes the state consistently | Clicking presets updates date/readouts (note: transitions are animated; need to wait for the update to settle). | PASS |  | `demos/seasons/seasons.js:setupControls`, `demos/seasons/seasons.js:animateToDay` |
| M1 | For each, record the **Earth-Sun Distance** reading | “Earth-Sun Distance” readout | Readout visible + stable number + updates per preset | Observed values (Playwright): March ≈ `0.996 AU`, June ≈ `1.017 AU`, September ≈ `1.003 AU`, December ≈ `0.983 AU`. | PASS |  | `demos/seasons/seasons.js:getEarthSunDistance`, `demos/seasons/seasons.js:updateReadouts`, `demos/seasons/planets.json` |
| M2 | Turn on **Display Overlays**: Celestial Equator, Ecliptic, and Day/Night Terminator | Overlay toggles | All three toggles exist + can be on simultaneously | All three toggles can be enabled simultaneously (`toggle-celestial-equator`, `toggle-ecliptic`, `toggle-terminator`). | PASS |  | `demos/seasons/index.html`, `demos/seasons/seasons.js` |
| M2 | Go to **June Solstice** and observe the Day/Night Terminator position | June Solstice preset | Terminator visibly changes position/orientation | Terminator ellipse (`#terminator`) shifts position on June Solstice vs equinox/December (changes `cx`). | PASS |  | `demos/seasons/seasons.js:updateGlobeView` |
| M2 | Go to **December Solstice** and observe how it changes | December Solstice preset | Terminator position changes from June | Terminator position differs between June and December (different `cx` shift sign/magnitude). | PASS |  | `demos/seasons/seasons.js:updateGlobeView` |
| M2 | Record the **Day Length** and **Sun Altitude** for both | “Day Length”, “Sun Altitude” readouts | Both readouts visible + update per solstice | Observed (at ~40°N): June ≈ `14h 51m`, `73.5°`; December ≈ `9h 9m`, `26.5°`. | PASS |  | `demos/seasons/seasons.js:updateReadouts`, `demos/seasons/seasons.js:getDayLengthHours`, `demos/seasons/seasons.js:getSunAltitude` |
| M3 | Stay on **June Solstice** | June Solstice preset | State remains June Solstice during latitude changes | After selecting June Solstice, changing latitude preserves June-solstice state (date remains June). | PASS |  | `demos/seasons/seasons.js` |
| M3 | Change **Observer Latitude** from the Equator (0°) to mid-latitudes (40°N) to near the pole (66.5°N, the Arctic Circle) | Latitude control accepting 0°, 40°N, 66.5°N | Latitude can be set precisely (or via presets) | Latitude slider supports 0.5° steps; setting `66.5°N` is accepted and displayed as `66.5°N`. | PASS |  | `demos/seasons/index.html:571`, `demos/seasons/seasons.js:formatLatitude` |
| M3 | Watch what happens to **Day Length** | “Day Length” readout | Day length changes meaningfully with latitude | At June Solstice, “Day Length” changes from `12h 0m` (0°) → `14h 51m` (40°N) → `24h 0m` (~67°N). | PASS |  | `demos/seasons/seasons.js:getDayLengthHours`, `demos/seasons/seasons.js:updateReadouts` |

### Demo: Angular Size (`demos/angular-size/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **Angular Size (degrees)** readout | Readout labeled “Angular Size (degrees)” | Updates when size/distance changes | Readout label is “Angular Size (degrees)” and the value stays in degrees (e.g., Sun ≈ `0.53°`). | PASS |  | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js:updateReadouts` |
| Overview | **Physical Size** and **Distance** sliders/values | Sliders + numeric readouts | Values change + clamp sensibly | Distance + Physical Size sliders exist and update readouts; values remain finite across typical use. | PASS |  | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js:setupSliders` |
| Overview | **Presets:** Everyday Objects and Astronomical Objects | Preset selector with these categories | Switching categories updates available items | “Presets” selector switches between “Everyday Objects” and “Astronomical Objects” and shows the matching preset list. | PASS |  | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js:setupPresetCategory` |
| Overview | **Time Evolution (for Moon):** See how the Moon's angular size changes as its distance varies | Time evolution UI | Runs/pauses + updates distance + angular size | Selecting “Moon (Today)” reveals a “Time Evolution (for Moon)” slider that varies distance over the orbit (perigee↔apogee), updating angular size accordingly. | PASS |  | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js:getMoonDistanceAtOrbitAngle` |
| M1 | In **Presets**, choose **Everyday Objects** | Presets UI | “Everyday Objects” selectable | “Presets” selector includes “Everyday Objects”; selecting it shows everyday-object presets. | PASS |  | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js:setupPresetCategory` |
| M1 | Select an object (like a basketball) | Object selector/list | Object selection changes size baseline | Preset button “Basketball @ 10m” exists; clicking changes size/distance baselines and readouts. | PASS |  | `demos/angular-size/angular-size.js:PRESETS`, `demos/angular-size/angular-size.js:selectPreset` |
| M1 | Change the **Distance** slider and watch the **Angular Size** change | Distance slider + angular size readout | Angular size responds immediately + monotonically | Distance slider changes angular size readout as expected (inverse relationship). | PASS |  | `demos/angular-size/angular-size.js:calculateAngularSize`, `demos/angular-size/angular-size.js:setupSliders` |
| M2 | Switch to **Astronomical Objects** presets | Presets UI | “Astronomical Objects” selectable | “Presets” selector includes “Astronomical Objects”; selecting it shows astronomical presets. | PASS |  | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js:setupPresetCategory` |
| M2 | Select **Sun** and note its angular size | Object selector/list | Sun available + angular size computed sensibly | “Sun” preset exists; angular size readout shows ~`0.53°`. | PASS |  | `demos/angular-size/angular-size.js:calculateAngularSize`, `demos/angular-size/angular-size.js:updateReadouts` |
| M2 | Select **Moon (Today)** and note its angular size | Object selector/list | Moon (Today) available + angular size computed sensibly | “Moon (Today)” preset exists; angular size readout is ~`0.52°` at the default distance. | PASS |  | `demos/angular-size/angular-size.js:PRESETS.moon`, `demos/angular-size/angular-size.js:updateReadouts` |
| M3 | Keep **Moon** selected | Object selector/list | Moon remains selected during time evolution | While “Moon (Today)” is active, the Time Evolution slider remains visible and changing it updates Moon distance/angular size without clearing the preset. | PASS |  | `demos/angular-size/angular-size.js:setupSliders`, `demos/angular-size/angular-size.js:selectPreset` |
| M3 | Use the **Time Evolution** feature to see how the Moon's distance (and therefore angular size) changes over its orbit | Time evolution UI | Distance changes over time; angular size updates accordingly | Time Evolution slider moves Moon through perigee/apogee and angular size varies smoothly (e.g., `0.49°` at apogee to `0.56°` at perigee). | PASS |  | `demos/angular-size/angular-size.js:getMoonDistanceAtOrbitAngle`, `demos/angular-size/angular-size.js:updateReadouts` |
| M3 | Note the range of angular sizes | Readout(s) | UI makes min/max/range observable or inferable | Moon Time Evolution panel shows an explicit range (“Range: 0.49°–0.56°”). | PASS |  | `demos/angular-size/index.html:#moon-angular-range`, `demos/angular-size/angular-size.js:selectPreset` |

### Demo: Moon Phases (`demos/moon-phases/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **Draggable Moon** that you can move around Earth | Draggable Moon UI | Drag works with mouse + touchpad; no stuck states | Moon is draggable in orbital SVG (“Drag the Moon…” hint); drag updates position without stuck states in Playwright. | PASS |  | `demos/moon-phases/index.html:#moon-group`, `demos/moon-phases/moon-phases.js:setupDrag` |
| Overview | **Phase** readout showing the current phase name | Phase label/readout | Updates continuously with position | “Phase” readout (`#phase-name`) updates (e.g., Full Moon → First Quarter → New Moon) when dragging. | PASS |  | `demos/moon-phases/moon-phases.js:getPhaseName`, `demos/moon-phases/moon-phases.js:updateReadouts` |
| Overview | **Illumination** percentage showing how much of the Moon's face is lit (from Earth's perspective) | Illumination readout | Percent updates + stays within [0,100] | “Illumination” stays within `[0%,100%]` and updates with phase (e.g., Full `100%`, First Quarter `50%`, New `0%`). | PASS |  | `demos/moon-phases/moon-phases.js:getIllumination`, `demos/moon-phases/moon-phases.js:updateReadouts` |
| Overview | **Days Since New Moon** showing where you are in the lunar cycle | Days-since readout | Updates + stays within expected bounds | “Days Since New Moon” updates smoothly; near cardinal phases, releasing the drag snaps so New Moon reliably shows ~`0.0`. | PASS |  | `demos/moon-phases/moon-phases.js:setupDrag`, `demos/moon-phases/moon-phases.js:getDaysSinceNew` |
| Overview | **🎯 Challenges** for testing your understanding | Challenges panel/button | Panel opens; challenges are solvable | “🎯 Challenges” button opens ChallengeEngine UI with “Check Answer” workflow. | PASS |  | `demos/moon-phases/moon-phases.js:setupChallenges`, `demos/_assets/challenge-engine.js` |
| Overview | **Show Earth's Shadow** toggle to address the misconception | Toggle labeled exactly | Toggle shows a shadow overlay clearly | Toggle label matches exactly (“Show Earth's Shadow”); enabling shows shadow cone overlay (`#earth-shadow-group`). | PASS |  | `demos/moon-phases/index.html:#show-shadow-toggle`, `demos/moon-phases/moon-phases.js` |
| M1 | Turn on **Show Earth's Shadow** | Toggle | Turning on visibly changes view | Shadow group display changes from `none` → `block`. | PASS |  | `demos/moon-phases/moon-phases.js` |
| M1 | Drag the Moon to create a **First Quarter** phase | Drag + phase readout | Achievable; phase readout reaches “First Quarter” | Dragging Moon to bottom of orbit yields Phase = “First Quarter”. | PASS |  | `demos/moon-phases/moon-phases.js:setupDrag`, `demos/moon-phases/moon-phases.js:getPhaseName` |
| M1 | Observe where Earth's shadow is located | Shadow overlay | Shadow direction/position is interpretable (anti-solar) | Shadow cone points anti-solar (to the right); at First Quarter the Moon is ~90° away from shadow line. | PASS |  | `demos/moon-phases/index.html:#earth-shadow-group`, `demos/moon-phases/moon-phases.js` |
| M2 | Drag the Moon to the position directly between Earth and Sun | Drag | Achievable “between” state; phase becomes New Moon | Dragging Moon to left side yields Phase = “New Moon”. | PASS |  | `demos/moon-phases/moon-phases.js:setupDrag`, `demos/moon-phases/moon-phases.js:getPhaseName` |
| M2 | Note the **Phase** reading | Phase readout | Readout updates correctly | At “between Earth and Sun”, phase readout shows “New Moon”. | PASS |  | `demos/moon-phases/moon-phases.js:updateReadouts` |
| M2 | Drag the Moon to the position directly opposite the Sun from Earth | Drag | Achievable “opposite” state; phase becomes Full Moon | Dragging Moon to right side yields Phase = “Full Moon”. | PASS |  | `demos/moon-phases/moon-phases.js:setupDrag` |
| M2 | Note the **Phase** reading | Phase readout | Readout updates correctly | At “opposite Sun from Earth”, phase readout shows “Full Moon”. | PASS |  | `demos/moon-phases/moon-phases.js:updateReadouts` |
| M2 | Drag to intermediate positions and observe how phase changes smoothly | Drag | Phase transitions smoothly; no discontinuities/glitches | Phase label and illumination vary smoothly through crescents/gibbous between cardinal points. | PASS |  | `demos/moon-phases/moon-phases.js:update` |
| M3 | Open the **🎯 Challenges** panel | Challenges UI | Panel opens reliably | Challenges panel opens; shows “Challenge 1 of 5” with buttons including “Check Answer”. | PASS |  | `demos/moon-phases/moon-phases.js`, `demos/_assets/challenge-engine.js` |
| M3 | Try to create each of these phases: | Challenge prompts | A list of target phases is shown | Challenges include prompts for New Moon, First Quarter, Full Moon, and Third Quarter (via Next/Previous). | PASS |  | `demos/moon-phases/moon-phases.js:PHASE_CHALLENGES` |
| M3 |    - New Moon | Challenge prompts | “New Moon” challenge exists + is solvable | “Position the Moon for a New Moon” challenge exists. | PASS |  | `demos/moon-phases/moon-phases.js:PHASE_CHALLENGES#new-moon` |
| M3 |    - First Quarter | Challenge prompts | “First Quarter” challenge exists + is solvable | “Find the First Quarter Moon position” challenge exists. | PASS |  | `demos/moon-phases/moon-phases.js:PHASE_CHALLENGES#first-quarter` |
| M3 |    - Full Moon | Challenge prompts | “Full Moon” challenge exists + is solvable | “Set the Moon to show a Full Moon phase” challenge exists. | PASS |  | `demos/moon-phases/moon-phases.js:PHASE_CHALLENGES#full-moon` |
| M3 |    - Third Quarter | Challenge prompts | “Third Quarter” challenge exists + is solvable | “Create a Third Quarter Moon” challenge exists. | PASS |  | `demos/moon-phases/moon-phases.js:PHASE_CHALLENGES#third-quarter` |
| M3 | For each challenge, position the Moon correctly, then check your answer. | “Check” control | Check/feedback works; failure feedback is helpful | Challenge UI includes “Check Answer”; feedback text appears. | PASS |  | `demos/_assets/challenge-engine.js` |

### Demo: Eclipse Geometry (`demos/eclipse-geometry/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **NO ECLIPSE / SOLAR ECLIPSE / LUNAR ECLIPSE** status indicator | Status label | Updates correctly with geometry | Status indicator uses exactly `NO ECLIPSE`, `SOLAR ECLIPSE`, `LUNAR ECLIPSE`. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| Overview | **"Moon is X° above/below ecliptic plane"** readout | Readout with exact phrasing | Updates continuously and remains finite | Persistent readout shows exactly “Moon is X° above/below ecliptic plane” and updates continuously. | PASS |  | `demos/eclipse-geometry/index.html:#status-detail`, `demos/eclipse-geometry/eclipse-geometry.js:getMoonEclipticHeight` |
| Overview | **Orbital Tilt** slider (normally 5.1°) | Slider labeled “Orbital Tilt” | Defaults to 5.1°; can set to 0° | Slider labeled “Orbital Tilt” shows default `5.1°` and can be set to `0.0°`. | PASS |  | `demos/eclipse-geometry/index.html:#tilt-slider`, `demos/eclipse-geometry/eclipse-geometry.js:setupControls` |
| Overview | **Current Phase** indicator | Phase label | Updates with Moon position | “Current Phase” display updates (Full Moon / New Moon / etc.) during drag/animation. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:getPhase`, `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| Overview | **Node markers** showing where the Moon's orbit crosses the ecliptic | Node markers | Visible + labeled/understandable | “Node” markers visible in orbit view and labeled. | PASS |  | `demos/eclipse-geometry/index.html` |
| Overview | **Long-Term Simulation** controls | Simulation panel | Controls exist and run | “Long-Term Simulation” panel includes animate buttons, years slider, “Run Simulation”, and stats/log. | PASS |  | `demos/eclipse-geometry/index.html`, `demos/eclipse-geometry/eclipse-geometry.js:simulateYears` |
| M1 | Set **Orbital Tilt** to **0° (eclipse every month!)** | Tilt slider | 0° achievable + stable | Tilt can be set to `0.0°` and remains stable. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:setupControls` |
| M1 | Drag the Moon to the new moon position | Drag control | New moon position achievable | New moon position achievable via drag or “New Moon” button (button animates to target). | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:setupDrag`, `demos/eclipse-geometry/eclipse-geometry.js:animateToAngle` |
| M1 | Check the eclipse status | Status indicator | Shows SOLAR ECLIPSE at new moon when tilt=0° | At tilt=0° and New Moon, status reads “SOLAR ECLIPSE”. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:updateStatus`, `demos/eclipse-geometry/eclipse-geometry.js:checkEclipse` |
| M1 | Drag to the full moon position | Drag control | Full moon position achievable | Full moon position achievable via drag or “Full Moon” button (button animates to target). | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M1 | Check the eclipse status again | Status indicator | Shows LUNAR ECLIPSE at full moon when tilt=0° | At tilt=0° and Full Moon, status reads “LUNAR ECLIPSE”. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| M2 | Set **Orbital Tilt** back to **5.1°** | Tilt slider | 5.1° achievable + stable | Can return to `5.1°`. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:setupControls` |
| M2 | Drag the Moon slowly around its orbit | Drag control | Smooth dragging around orbit | Dragging works smoothly (mouse events update `state.moonAngle`). | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:setupDrag` |
| M2 | Watch the **"Moon is X° above/below ecliptic plane"** readout | Above/below readout | Readout changes sign/magnitude appropriately | Readout remains visible for all phases and changes sign/magnitude as the Moon moves around the orbit. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:getMoonEclipticHeight`, `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| M2 | Try to find positions where eclipses ARE possible | Nodes + status indicator | Eclipses possible only near nodes at right phase | Status flips from “NO ECLIPSE” to “SOLAR ECLIPSE”/“LUNAR ECLIPSE” only when phase + node alignment permit eclipses. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:checkEclipse`, `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| M3 | Look for the **Node markers** in the orbit view | Node markers | Findable; visually distinct | Node markers are visible and labeled “Node”. | PASS |  | `demos/eclipse-geometry/index.html` |
| M3 | Position the Moon at a node during new moon phase | Drag + node markers | Achievable; eclipse status indicates solar eclipse possible | Achievable by dragging near node at New Moon; status flips to solar eclipse conditions when sufficiently close. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:checkEclipse` |
| M3 | Check if a solar eclipse is possible | Status indicator | Clear “possible”/“not possible” signal | Status is a clear signal: “SOLAR ECLIPSE” vs “NO ECLIPSE”. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| M3 | Position the Moon at a node during full moon phase | Drag + node markers | Achievable; eclipse status indicates lunar eclipse possible | Achievable by dragging near node at Full Moon; status flips to lunar eclipse conditions when close enough. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:checkEclipse` |
| M3 | Check if a lunar eclipse is possible | Status indicator | Clear “possible”/“not possible” signal | Status is a clear signal: “LUNAR ECLIPSE” vs “NO ECLIPSE”. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:updateStatus` |
| M4 | Find the **Long-Term Simulation** controls | Simulation controls | Findable; labels match | Controls are findable; includes “Simulate Years” and “Run Simulation”. | PASS |  | `demos/eclipse-geometry/index.html` |
| M4 | Set **Simulate Years = 10** and click **Run Simulation** | Years input + run button | Runs without freezing; results appear | “Simulate Years” display can show `10`; simulation runs and updates stats after a short batch animation. | PASS |  | `demos/eclipse-geometry/eclipse-geometry.js:simulateYears` |
| M4 | Count total solar eclipses and lunar eclipses | Results display | Totals are visible and countable | Stats panel shows totals (e.g., `13 (23 total)` solar, `5 (15 total)` lunar for ~`9.2` years simulated). | PASS |  | `demos/eclipse-geometry/index.html:#stats-panel`, `demos/eclipse-geometry/eclipse-geometry.js:updateStats` |
| M4 | Repeat for **Simulate Years = 100** | Years input + run button | Runs for 100y without crashing; results update | “Simulate Years” can be set to exactly `100` and simulation completes with updated totals. | PASS |  | `demos/eclipse-geometry/index.html:#sim-years-slider`, `demos/eclipse-geometry/eclipse-geometry.js:sliderToYears` |

---

## Bug List (fill during audit)

| Demo | Severity | Steps to reproduce | Expected | Observed | Root cause | Fix | Code pointers | Status |
|---|---|---|---|---|---|---|---|---|
| Seasons | Low | Open `http://localhost:8000/demos/seasons/` with DevTools console open | No console errors | `GET /favicon.ico 404` console error | No explicit icon link; browser requests `/favicon.ico` | Added shared SVG favicon and linked it in demo heads. | `demos/_assets/favicon.svg`, `demos/seasons/index.html` | Fixed |
| Seasons | Medium | Mission 3: set Observer Latitude to 66.5°N | UI accepts 66.5° exactly | Slider snaps to 67°N | Range input step is integer default | Set `step=\"0.5\"` and formatted latitude display to show one decimal when needed. | `demos/seasons/index.html`, `demos/seasons/seasons.js` | Fixed |
| Angular Size | High | Follow lecture mission: Presets → choose Everyday Objects; read Angular Size (degrees); select Moon (Today); use Time Evolution for orbit | UI labels + controls match lecture, and Moon orbit evolution exists | Missing category selector; readout not labeled “(degrees)” and unit-switches; “Moon (Today)” label missing; time evolution is recession not orbit | UI/feature mismatch vs lecture contract | Added category selector, kept angular readout in degrees, renamed “Moon (Today)”, implemented orbit-distance Time Evolution + range display. | `demos/angular-size/index.html`, `demos/angular-size/angular-size.js`, `demos/angular-size/angular-size.css` | Fixed |
| Moon Phases | Medium | Drag Moon to “between Earth and Sun” but not perfectly centered | Days Since New Moon near 0 when at New Moon | Days Since New Moon can show ~29.5 near “New Moon” phase label | No snap-to-phase | Snap-to-cardinal-phase on drag end (New/Full/Quarter) so readouts stabilize. | `demos/moon-phases/moon-phases.js` | Fixed |
| Moon Phases | Medium | Open 🎯 Challenges and look for “Third Quarter” | “Third Quarter” challenge exists | No Third Quarter challenge in PHASE_CHALLENGES | Challenge set missing required target | Replaced a non-required challenge with a Third Quarter challenge. | `demos/moon-phases/moon-phases.js` | Fixed |
| Eclipse Geometry | High | Follow lecture mission: check status indicator labels and “Moon is X° above/below ecliptic plane” readout | Status uses exactly NO ECLIPSE / SOLAR ECLIPSE / LUNAR ECLIPSE and readout persists | Status uses emoji/total/partial; readout not persistent | UI multiplexed for multiple messages | Status now matches lecture strings and persistent readout is always shown; extra info moved to `#status-note`. | `demos/eclipse-geometry/index.html`, `demos/eclipse-geometry/eclipse-geometry.js` | Fixed |
| Eclipse Geometry | Medium | Mission 4: set Simulate Years = 100 | Control can be set to exactly 100 | Slider can only hit ~95 or ~102 | Integer step + rounding in slider mapping | Set years slider `step=\"0.1\"` and changed mapping/display so `100` is reachable. | `demos/eclipse-geometry/index.html`, `demos/eclipse-geometry/eclipse-geometry.js` | Fixed |

---

## Student-Executable Checklist (fill during Phase 4)

- **Keyboard reachability:** PASS (Tab reaches core controls in all 4 demos; focus lands on sliders/buttons/toggles/selects; Moon is focusable).
- **Mouse/touchpad usability:** PASS (Moon can be dragged; drag-end snap yields stable phase + days since new; no console errors while dragging).
- **Reset behavior:** PASS where present (Moon Phases reset returns to Full Moon; Eclipse Geometry reset returns to baseline). N/A for Seasons/Angular Size (use presets to return baseline).
- **Mobile-ish viewport (~375px):** PASS (no horizontal overflow in any demo; controls stack responsively).
- **Deterministic readouts:** PASS (no `NaN`/`Infinity` observed in text readouts during spot checks; stable formatting like `66.5°N` and Moon range `0.49°–0.56°`).
- **Console hygiene:** PASS (no console errors/warnings on page load or normal interactions).

---

## Cross‑Cutting Hardening Checklist (apply to all 4)

Treat each item as a requirement unless you explicitly justify “not applicable”.

- **Instruction fidelity:** UI labels match lecture wording (case/punctuation matters for students).
- **Accessibility:** keyboard reachability for core controls; visible focus; sufficient contrast; no info conveyed by color alone.
- **Robustness:** clamp inputs; handle NaN; avoid division-by-zero; guard array bounds; deterministic reset.
- **Responsiveness:** usable at ~375px width; no overlapping controls; scroll instead of clip.
- **Performance:** no runaway intervals; cancel animations/timers on reset; avoid unbounded allocations.
- **Polish consistency:** consistent typography and control styling via `demos/_assets/*` where possible.
- **Diagnostics:** no console errors; meaningful console warnings only when genuinely exceptional.

When done, summarize changes per demo and link each fix to matrix rows.
