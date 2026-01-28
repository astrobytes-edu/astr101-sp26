# ASTR 101 — Demo Audit + Hardening Prompt (Lectures 3–4)

Copy/paste this entire prompt into a **new Codex session** started at repo root (`/Users/anna/Teaching/astr101-sp26`).

---

## New Session Prompt (copy/paste)

You are Codex (GPT-5.2) working inside the ASTR 101 course repo. Your job is to **finalize, test, and harden** the 4 interactive demos used in **Lecture 03** and **Lecture 04**, ensuring **every student-facing instruction in the readings is executable exactly as written**.

These demos were initially implemented by another LLM; assume they may be messy/incomplete. Be skeptical: verify everything by reading code + running locally. Do not invent facts.

### Non‑Negotiables

- Follow `docs/llm-lab-protocol.md` phase separation: understanding → assumptions → exploration → implementation.
- Fix one root cause at a time; avoid drive‑by refactors.
- No new dependencies or build systems without explicit approval.
- If you edit Quarto content or site nav, you must run `quarto render` (or `make render`) before claiming success.
- **Traceability:** You must build and maintain a traceability matrix from lecture “Demo Mission” wording → demo UI/behavior → implementation file pointers.

### In Scope (exact files)

**Demos (4):**
- Seasons: `demos/seasons/index.html`, `demos/seasons/seasons.js`, `demos/seasons/planets.json`, `demos/seasons/README.md`
- Angular Size: `demos/angular-size/index.html`, `demos/angular-size/angular-size.js`, `demos/angular-size/angular-size.css`, `demos/angular-size/README.md`
- Moon Phases: `demos/moon-phases/index.html`, `demos/moon-phases/moon-phases.js`, `demos/moon-phases/README.md`
- Eclipse Geometry: `demos/eclipse-geometry/index.html`, `demos/eclipse-geometry/eclipse-geometry.js`, `demos/eclipse-geometry/README.md`

**Shared demo infrastructure (may affect all 4):**
- JS: `demos/_assets/astro-utils.js`, `demos/_assets/demo-polish.js`, `demos/_assets/challenge-engine.js`, `demos/_assets/starfield.js`, `demos/_assets/tour-engine.js`
- CSS: `demos/_assets/astro-theme.css`, `demos/_assets/demo-shell.css`, `demos/_assets/demo-legacy.css`
- `demos/polish-manifest.json`

**Lecture sources (mission text is source-of-truth):**
- Lecture 03 reading: `modules/module-01/readings/lecture-03-sky-is-a-map.qmd`
- Lecture 04 reading: `modules/module-01/readings/lecture-04-moon-geometry-reading.qmd`

### How to run locally (required)

1. From repo root, serve the repo so relative paths behave like GitHub Pages:
   - Run: `python3 -m http.server 8000`
2. In a browser, open (at least) these:
   - `http://localhost:8000/demos/seasons/`
   - `http://localhost:8000/demos/angular-size/`
   - `http://localhost:8000/demos/moon-phases/`
   - `http://localhost:8000/demos/eclipse-geometry/`
3. For each demo, keep DevTools console open and treat **any console error/warn** as a bug to fix (unless you justify it).

### Required Outputs (artifacts)

1. Create an audit report: `docs/audits/YYYY-MM-DD-lecture-03-04-demos-hardening.md` (replace `YYYY-MM-DD` with today) containing:
   - A completed traceability matrix (below) with **Pass/Fail** per row and code pointers per fix.
   - A bug list with reproduction steps and severity.
   - A “student-executable” checklist (keyboard + mouse, mobile-ish viewport, reset behavior).
2. Implement fixes/enhancements so all matrix rows are PASS.
3. Add lightweight, repo-appropriate verification where feasible (no new deps). At minimum:
   - No JS console errors during normal use.
   - Deterministic behavior (no NaN explosions, no unbounded values, predictable resets).

### Strict Workflow (you must follow)

#### Phase 1 — Understand

- Read the four demo READMEs and the relevant “Demo Exploration” sections in Lectures 03–04 (verbatim mission text is included below).
- Inventory UI controls, labels, and outputs in each demo.
- Identify any mismatch between lecture instructions and the actual UI.

#### Phase 2 — Explore + Diagnose

- Run each mission step exactly as written while observing console + UI.
- For each failure, locate the root cause in code and write a short fix plan (1–3 bullets) before editing.

#### Phase 3 — Implement (tight diffs)

- Fix the smallest root cause that makes the most matrix rows pass.
- Prefer consistent patterns across all demos via shared assets when appropriate, but don’t refactor gratuitously.

#### Phase 4 — Verify

- Re-run all mission steps.
- Confirm every matrix row is PASS, and record evidence (what you saw, what readout changed, etc.).
- If any lecture edits are required for accuracy after demo changes, do them last and then run `quarto render`.

---

## Lecture Mission Wording (verbatim excerpts)

Use these excerpts as the authoritative contract. Do **not** paraphrase in the traceability matrix.

### Lecture 03 — Seasons demo excerpt (`modules/module-01/readings/lecture-03-sky-is-a-map.qmd:378+`)

```markdown
### 🔭 Demo Exploration: Seasons

**Open the Seasons Demo:** [astrobytes-edu.github.io/astr101-sp26/demos/seasons/](https://astrobytes-edu.github.io/astr101-sp26/demos/seasons/)

This interactive demo lets you see *why* tilt — not distance — causes seasons. You'll observe how day length, Sun altitude, and Earth-Sun distance change throughout the year.

**What you'll see in the demo:**
- **Season Presets:** Jump to solstices and equinoxes
- **Readouts:** Day Length, Sun Altitude, Earth-Sun Distance for the selected date
- **Display Overlays:** Celestial Equator, Ecliptic, Day/Night Terminator
- **Observer Latitude:** See how seasons differ at different latitudes

---

**Demo Mission 1: Testing the Distance Hypothesis**

**Do this:**
1. Click **Season Presets** and select each season in order: March Equinox → June Solstice → September Equinox → December Solstice
2. For each, record the **Earth-Sun Distance** reading

---

**Demo Mission 2: The Real Mechanism**

**Do this:**
1. Turn on **Display Overlays**: Celestial Equator, Ecliptic, and Day/Night Terminator
2. Go to **June Solstice** and observe the Day/Night Terminator position
3. Go to **December Solstice** and observe how it changes
4. Record the **Day Length** and **Sun Altitude** for both

---

**Demo Mission 3: Latitude Matters**

**Do this:**
1. Stay on **June Solstice**
2. Change **Observer Latitude** from the Equator (0°) to mid-latitudes (40°N) to near the pole (66.5°N, the Arctic Circle)
3. Watch what happens to **Day Length**
```

### Lecture 03 — Angular size demo excerpt (`modules/module-01/readings/lecture-03-sky-is-a-map.qmd:620+`)

```markdown
### 🔭 Demo Exploration: Angular Size

**Open the Angular Size Demo:** [astrobytes-edu.github.io/astr101-sp26/demos/angular-size/](https://astrobytes-edu.github.io/astr101-sp26/demos/angular-size/)

This demo lets you explore how angular size depends on both physical size and distance.

**What you'll see in the demo:**
- **Angular Size (degrees)** readout
- **Physical Size** and **Distance** sliders/values
- **Presets:** Everyday Objects and Astronomical Objects
- **Time Evolution (for Moon):** See how the Moon's angular size changes as its distance varies

---

**Demo Mission 1: Building Intuition**

**Do this:**
1. In **Presets**, choose **Everyday Objects**
2. Select an object (like a basketball)
3. Change the **Distance** slider and watch the **Angular Size** change

---

**Demo Mission 2: Astronomical Objects**

**Do this:**
1. Switch to **Astronomical Objects** presets
2. Select **Sun** and note its angular size
3. Select **Moon (Today)** and note its angular size

---

**Demo Mission 3: The Moon's Changing Angular Size**

**Do this:**
1. Keep **Moon** selected
2. Use the **Time Evolution** feature to see how the Moon's distance (and therefore angular size) changes over its orbit
3. Note the range of angular sizes
```

### Lecture 04 — Moon phases demo excerpt (`modules/module-01/readings/lecture-04-moon-geometry-reading.qmd:141+`)

```markdown
### 🔭 Demo Exploration: Moon Phases

**Open the Moon Phases Demo:** [astrobytes-edu.github.io/astr101-sp26/demos/moon-phases/](https://astrobytes-edu.github.io/astr101-sp26/demos/moon-phases/)

This interactive demo lets you connect the Moon's position in its orbit to what it looks like from Earth. You can drag the Moon and watch the phase change in real-time.

**What you'll see in the demo:**
- **Draggable Moon** that you can move around Earth
- **Phase** readout showing the current phase name
- **Illumination** percentage showing how much of the Moon's face is lit (from Earth's perspective)
- **Days Since New Moon** showing where you are in the lunar cycle
- **🎯 Challenges** for testing your understanding
- **Show Earth's Shadow** toggle to address the misconception

---

**Demo Mission 1: Killing the Shadow Misconception**

**Do this:**
1. Turn on **Show Earth's Shadow**
2. Drag the Moon to create a **First Quarter** phase
3. Observe where Earth's shadow is located

---

**Demo Mission 2: Position → Appearance**

**Do this:**
1. Drag the Moon to the position directly between Earth and Sun
2. Note the **Phase** reading
3. Drag the Moon to the position directly opposite the Sun from Earth
4. Note the **Phase** reading
5. Drag to intermediate positions and observe how phase changes smoothly

---

**Demo Mission 3: Challenge Mode**

**Do this:**
1. Open the **🎯 Challenges** panel
2. Try to create each of these phases:
   - New Moon
   - First Quarter
   - Full Moon
   - Third Quarter
```

### Lecture 04 — Eclipse geometry demo excerpt (`modules/module-01/readings/lecture-04-moon-geometry-reading.qmd:436+`)

```markdown
### 🔭 Demo Exploration: Eclipse Geometry

**Open the Eclipse Geometry Demo:** [astrobytes-edu.github.io/astr101-sp26/demos/eclipse-geometry/](https://astrobytes-edu.github.io/astr101-sp26/demos/eclipse-geometry/)

This interactive demo lets you see *why* eclipses don't happen every month — and when they do.

**What you'll see in the demo:**
- **NO ECLIPSE / SOLAR ECLIPSE / LUNAR ECLIPSE** status indicator
- **"Moon is X° above/below ecliptic plane"** readout
- **Orbital Tilt** slider (normally 5.1°)
- **Current Phase** indicator
- **Node markers** showing where the Moon's orbit crosses the ecliptic
- **Long-Term Simulation** controls

---

**Demo Mission 1: Break the Universe (Tilt = 0°)**

**Do this:**
1. Set **Orbital Tilt** to **0° (eclipse every month!)**
2. Drag the Moon to the new moon position
3. Check the eclipse status
4. Drag to the full moon position
5. Check the eclipse status again

---

**Demo Mission 2: Restore Reality (Tilt = 5.1°)**

**Do this:**
1. Set **Orbital Tilt** back to **5.1°**
2. Drag the Moon slowly around its orbit
3. Watch the **"Moon is X° above/below ecliptic plane"** readout
4. Try to find positions where eclipses ARE possible

---

**Demo Mission 3: Finding the Nodes**

**Do this:**
1. Look for the **Node markers** in the orbit view
2. Position the Moon at a node during new moon phase
3. Check if a solar eclipse is possible
4. Position the Moon at a node during full moon phase
5. Check if a lunar eclipse is possible

---

**Demo Mission 4: Long-Term Eclipse Statistics**

**Do this:**
1. Find the **Long-Term Simulation** controls
2. Set **Simulate Years = 10** and click **Run Simulation**
3. Count total solar eclipses and lunar eclipses
4. Repeat for **Simulate Years = 100**
```

---

## Traceability Matrices (pre‑scaffolded; fill during audit)

Conventions:
- “Observed” should say what you actually saw (UI label text, readout values changing, etc.).
- “Code pointers” should list the most relevant files/functions (start with the demo’s main JS file).

### Demo: Seasons (`demos/seasons/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **Season Presets:** Jump to solstices and equinoxes | “Season Presets” control | Presets exist + switch date/season |  |  |  | `demos/seasons/seasons.js` |
| Overview | **Readouts:** Day Length, Sun Altitude, Earth-Sun Distance for the selected date | Readout panel(s) | Readouts exist + update with preset/date |  |  |  | `demos/seasons/seasons.js` |
| Overview | **Display Overlays:** Celestial Equator, Ecliptic, Day/Night Terminator | Overlay toggles | Toggles exist + affect visualization |  |  |  | `demos/seasons/seasons.js` |
| Overview | **Observer Latitude:** See how seasons differ at different latitudes | “Observer Latitude” control | Latitude changes affect day length / sun altitude |  |  |  | `demos/seasons/seasons.js` |
| M1 | Click **Season Presets** and select each season in order: March Equinox → June Solstice → September Equinox → December Solstice | Preset buttons/options with these names | Each selection changes the state consistently |  |  |  | `demos/seasons/seasons.js` |
| M1 | For each, record the **Earth-Sun Distance** reading | “Earth-Sun Distance” readout | Readout visible + stable number + updates per preset |  |  |  | `demos/seasons/seasons.js`, `demos/seasons/planets.json` |
| M2 | Turn on **Display Overlays**: Celestial Equator, Ecliptic, and Day/Night Terminator | Overlay toggles | All three toggles exist + can be on simultaneously |  |  |  | `demos/seasons/seasons.js` |
| M2 | Go to **June Solstice** and observe the Day/Night Terminator position | June Solstice preset | Terminator visibly changes position/orientation |  |  |  | `demos/seasons/seasons.js` |
| M2 | Go to **December Solstice** and observe how it changes | December Solstice preset | Terminator position changes from June |  |  |  | `demos/seasons/seasons.js` |
| M2 | Record the **Day Length** and **Sun Altitude** for both | “Day Length”, “Sun Altitude” readouts | Both readouts visible + update per solstice |  |  |  | `demos/seasons/seasons.js` |
| M3 | Stay on **June Solstice** | June Solstice preset | State remains June Solstice during latitude changes |  |  |  | `demos/seasons/seasons.js` |
| M3 | Change **Observer Latitude** from the Equator (0°) to mid-latitudes (40°N) to near the pole (66.5°N, the Arctic Circle) | Latitude control accepting 0°, 40°N, 66.5°N | Latitude can be set precisely (or via presets) |  |  |  | `demos/seasons/seasons.js` |
| M3 | Watch what happens to **Day Length** | “Day Length” readout | Day length changes meaningfully with latitude |  |  |  | `demos/seasons/seasons.js` |

### Demo: Angular Size (`demos/angular-size/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **Angular Size (degrees)** readout | Readout labeled “Angular Size (degrees)” | Updates when size/distance changes |  |  |  | `demos/angular-size/angular-size.js` |
| Overview | **Physical Size** and **Distance** sliders/values | Sliders + numeric readouts | Values change + clamp sensibly |  |  |  | `demos/angular-size/angular-size.js` |
| Overview | **Presets:** Everyday Objects and Astronomical Objects | Preset selector with these categories | Switching categories updates available items |  |  |  | `demos/angular-size/angular-size.js` |
| Overview | **Time Evolution (for Moon):** See how the Moon's angular size changes as its distance varies | Time evolution UI | Runs/pauses + updates distance + angular size |  |  |  | `demos/angular-size/angular-size.js` |
| M1 | In **Presets**, choose **Everyday Objects** | Presets UI | “Everyday Objects” selectable |  |  |  | `demos/angular-size/angular-size.js` |
| M1 | Select an object (like a basketball) | Object selector/list | Object selection changes size baseline |  |  |  | `demos/angular-size/angular-size.js` |
| M1 | Change the **Distance** slider and watch the **Angular Size** change | Distance slider + angular size readout | Angular size responds immediately + monotonically |  |  |  | `demos/angular-size/angular-size.js` |
| M2 | Switch to **Astronomical Objects** presets | Presets UI | “Astronomical Objects” selectable |  |  |  | `demos/angular-size/angular-size.js` |
| M2 | Select **Sun** and note its angular size | Object selector/list | Sun available + angular size computed sensibly |  |  |  | `demos/angular-size/angular-size.js` |
| M2 | Select **Moon (Today)** and note its angular size | Object selector/list | Moon (Today) available + angular size computed sensibly |  |  |  | `demos/angular-size/angular-size.js` |
| M3 | Keep **Moon** selected | Object selector/list | Moon remains selected during time evolution |  |  |  | `demos/angular-size/angular-size.js` |
| M3 | Use the **Time Evolution** feature to see how the Moon's distance (and therefore angular size) changes over its orbit | Time evolution UI | Distance changes over time; angular size updates accordingly |  |  |  | `demos/angular-size/angular-size.js` |
| M3 | Note the range of angular sizes | Readout(s) | UI makes min/max/range observable or inferable |  |  |  | `demos/angular-size/angular-size.js` |

### Demo: Moon Phases (`demos/moon-phases/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **Draggable Moon** that you can move around Earth | Draggable Moon UI | Drag works with mouse + touchpad; no stuck states |  |  |  | `demos/moon-phases/moon-phases.js` |
| Overview | **Phase** readout showing the current phase name | Phase label/readout | Updates continuously with position |  |  |  | `demos/moon-phases/moon-phases.js` |
| Overview | **Illumination** percentage showing how much of the Moon's face is lit (from Earth's perspective) | Illumination readout | Percent updates + stays within [0,100] |  |  |  | `demos/moon-phases/moon-phases.js` |
| Overview | **Days Since New Moon** showing where you are in the lunar cycle | Days-since readout | Updates + stays within expected bounds |  |  |  | `demos/moon-phases/moon-phases.js` |
| Overview | **🎯 Challenges** for testing your understanding | Challenges panel/button | Panel opens; challenges are solvable |  |  |  | `demos/moon-phases/moon-phases.js`, `demos/_assets/challenge-engine.js` |
| Overview | **Show Earth's Shadow** toggle to address the misconception | Toggle labeled exactly | Toggle shows a shadow overlay clearly |  |  |  | `demos/moon-phases/moon-phases.js` |
| M1 | Turn on **Show Earth's Shadow** | Toggle | Turning on visibly changes view |  |  |  | `demos/moon-phases/moon-phases.js` |
| M1 | Drag the Moon to create a **First Quarter** phase | Drag + phase readout | Achievable; phase readout reaches “First Quarter” |  |  |  | `demos/moon-phases/moon-phases.js` |
| M1 | Observe where Earth's shadow is located | Shadow overlay | Shadow direction/position is interpretable (anti-solar) |  |  |  | `demos/moon-phases/moon-phases.js` |
| M2 | Drag the Moon to the position directly between Earth and Sun | Drag | Achievable “between” state; phase becomes New Moon |  |  |  | `demos/moon-phases/moon-phases.js` |
| M2 | Note the **Phase** reading | Phase readout | Readout updates correctly |  |  |  | `demos/moon-phases/moon-phases.js` |
| M2 | Drag the Moon to the position directly opposite the Sun from Earth | Drag | Achievable “opposite” state; phase becomes Full Moon |  |  |  | `demos/moon-phases/moon-phases.js` |
| M2 | Note the **Phase** reading | Phase readout | Readout updates correctly |  |  |  | `demos/moon-phases/moon-phases.js` |
| M2 | Drag to intermediate positions and observe how phase changes smoothly | Drag | Phase transitions smoothly; no discontinuities/glitches |  |  |  | `demos/moon-phases/moon-phases.js` |
| M3 | Open the **🎯 Challenges** panel | Challenges UI | Panel opens reliably |  |  |  | `demos/moon-phases/README.md`, `demos/_assets/challenge-engine.js` |
| M3 | Try to create each of these phases: | Challenge prompts | A list of target phases is shown |  |  |  | `demos/moon-phases/moon-phases.js` |
| M3 |    - New Moon | Challenge prompts | “New Moon” challenge exists + is solvable |  |  |  | `demos/moon-phases/moon-phases.js` |
| M3 |    - First Quarter | Challenge prompts | “First Quarter” challenge exists + is solvable |  |  |  | `demos/moon-phases/moon-phases.js` |
| M3 |    - Full Moon | Challenge prompts | “Full Moon” challenge exists + is solvable |  |  |  | `demos/moon-phases/moon-phases.js` |
| M3 |    - Third Quarter | Challenge prompts | “Third Quarter” challenge exists + is solvable |  |  |  | `demos/moon-phases/moon-phases.js` |
| M3 | For each challenge, position the Moon correctly, then check your answer. | “Check” control | Check/feedback works; failure feedback is helpful |  |  |  | `demos/_assets/challenge-engine.js` |

### Demo: Eclipse Geometry (`demos/eclipse-geometry/…`)

| Mission | Instruction (verbatim) | Expected UI element (label/id) | Expected behavior/output | Observed | Pass/Fail | Fix plan | Code pointers |
|---|---|---|---|---|---|---|---|
| Overview | **NO ECLIPSE / SOLAR ECLIPSE / LUNAR ECLIPSE** status indicator | Status label | Updates correctly with geometry |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| Overview | **"Moon is X° above/below ecliptic plane"** readout | Readout with exact phrasing | Updates continuously and remains finite |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| Overview | **Orbital Tilt** slider (normally 5.1°) | Slider labeled “Orbital Tilt” | Defaults to 5.1°; can set to 0° |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| Overview | **Current Phase** indicator | Phase label | Updates with Moon position |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| Overview | **Node markers** showing where the Moon's orbit crosses the ecliptic | Node markers | Visible + labeled/understandable |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| Overview | **Long-Term Simulation** controls | Simulation panel | Controls exist and run |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M1 | Set **Orbital Tilt** to **0° (eclipse every month!)** | Tilt slider | 0° achievable + stable |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M1 | Drag the Moon to the new moon position | Drag control | New moon position achievable |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M1 | Check the eclipse status | Status indicator | Shows SOLAR ECLIPSE at new moon when tilt=0° |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M1 | Drag to the full moon position | Drag control | Full moon position achievable |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M1 | Check the eclipse status again | Status indicator | Shows LUNAR ECLIPSE at full moon when tilt=0° |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M2 | Set **Orbital Tilt** back to **5.1°** | Tilt slider | 5.1° achievable + stable |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M2 | Drag the Moon slowly around its orbit | Drag control | Smooth dragging around orbit |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M2 | Watch the **"Moon is X° above/below ecliptic plane"** readout | Above/below readout | Readout changes sign/magnitude appropriately |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M2 | Try to find positions where eclipses ARE possible | Nodes + status indicator | Eclipses possible only near nodes at right phase |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M3 | Look for the **Node markers** in the orbit view | Node markers | Findable; visually distinct |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M3 | Position the Moon at a node during new moon phase | Drag + node markers | Achievable; eclipse status indicates solar eclipse possible |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M3 | Check if a solar eclipse is possible | Status indicator | Clear “possible”/“not possible” signal |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M3 | Position the Moon at a node during full moon phase | Drag + node markers | Achievable; eclipse status indicates lunar eclipse possible |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M3 | Check if a lunar eclipse is possible | Status indicator | Clear “possible”/“not possible” signal |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M4 | Find the **Long-Term Simulation** controls | Simulation controls | Findable; labels match |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M4 | Set **Simulate Years = 10** and click **Run Simulation** | Years input + run button | Runs without freezing; results appear |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M4 | Count total solar eclipses and lunar eclipses | Results display | Totals are visible and countable |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |
| M4 | Repeat for **Simulate Years = 100** | Years input + run button | Runs for 100y without crashing; results update |  |  |  | `demos/eclipse-geometry/eclipse-geometry.js` |

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

---
