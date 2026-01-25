# Lecture 03–04 Demos Next Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Turn the 4 updated Lecture 03–04 demos into “best-in-class” teaching tools by fixing remaining accessibility gaps, scientific/numerical correctness issues, and UI/design consistency drift (while explicitly deferring starfield changes).

**Architecture:** Keep each demo as a static, dependency-free HTML/CSS/JS app served from `demos/`. Prefer shared behavior via `demos/_assets/` (theme + polish + challenge engine) so fixes apply across demos without per-demo duplication. Add lightweight repo-local verification via a small standard-library Python script (no new deps).

**Tech Stack:** Static HTML/CSS/JS; Quarto site wrapper (renders `demos/`); conda Python for local serving; no build system or new dependencies.

**Source audit:** `docs/audits/2026-01-25-lecture-03-04-demos-comprehensive-audit.md`

**Explicit constraint:** Keep the starfield background **as-is** for now. Do **not** implement reduced-motion or starfield changes in this phase; record it as deferred work only.

---

## Preflight Notes (Read This First)

### Recommended worktree (keeps main clean)

Run:

```bash
git worktree add ../astr101-sp26-demos-next-hardening -b demos-next-hardening
cd ../astr101-sp26-demos-next-hardening
```

### Local run command (must use conda)

```bash
conda run -n astro python -m http.server 8000 --bind 127.0.0.1
```

Open:
- `http://127.0.0.1:8000/demos/seasons/`
- `http://127.0.0.1:8000/demos/angular-size/`
- `http://127.0.0.1:8000/demos/moon-phases/`
- `http://127.0.0.1:8000/demos/eclipse-geometry/`

---

## Task 1: Add a lightweight “static checks” script (verification scaffold)

**Files:**
- Create: `scripts/demo_static_checks.py`

**Step 1: Write the failing check (expected to FAIL initially)**

Create a script that fails if any of the targeted demo HTML files contains an unlabeled slider:
- `demos/seasons/index.html`
- `demos/angular-size/index.html`
- `demos/eclipse-geometry/index.html`

Definition: an `<input type="range">` is “labeled” if it has any of:
- `aria-label`, `aria-labelledby`, or `title`, OR
- an associated `<label for="<id>">…</label>` in the same document.

Minimal implementation sketch (stdlib only; intentionally simple parsing via regex for this narrow use):

```python
#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path

TARGETS = [
    Path("demos/seasons/index.html"),
    Path("demos/angular-size/index.html"),
    Path("demos/eclipse-geometry/index.html"),
]

RANGE_INPUT_RE = re.compile(r'<input\\b[^>]*\\btype\\s*=\\s*["\\\']range["\\\'][^>]*>', re.IGNORECASE)
ATTR_RE = re.compile(r'(\\w[\\w-]*)\\s*=\\s*(["\\\'])(.*?)\\2')
LABEL_FOR_RE = re.compile(r'<label\\b[^>]*\\bfor\\s*=\\s*["\\\'](.*?)["\\\'][^>]*>', re.IGNORECASE)

def attrs(tag: str) -> dict[str, str]:
    return {k.lower(): v for (k, _, v) in ATTR_RE.findall(tag)}

def main() -> int:
    failed: list[str] = []
    for path in TARGETS:
        html = path.read_text(encoding="utf-8")
        label_fors = set(LABEL_FOR_RE.findall(html))
        for m in RANGE_INPUT_RE.finditer(html):
            tag = m.group(0)
            a = attrs(tag)
            input_id = a.get("id", "")
            ok = (
                bool(a.get("aria-label") or a.get("aria-labelledby") or a.get("title"))
                or (input_id and input_id in label_fors)
            )
            if not ok:
                failed.append(f"{path}: unlabeled range input {input_id or tag}")
    if failed:
        print("\\n".join(failed))
        return 1
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
```

**Step 2: Run it to verify it fails**

Run:

```bash
conda run -n astro python scripts/demo_static_checks.py
```

Expected: **exit 1** with messages naming the unlabeled sliders.

**Step 3: Commit**

```bash
git add scripts/demo_static_checks.py
git commit -m "test(demos): add static slider-label check"
```

---

## Task 2: Fix slider labeling in Seasons (accessibility)

**Files:**
- Modify: `demos/seasons/index.html`

**Step 1: Reproduce (baseline)**

Run the static checks from Task 1; confirm Seasons fails with unlabeled range inputs.

**Step 2: Implement minimal a11y labeling**

Add `aria-label` to these inputs:
- `#date-slider` → `aria-label="Date/Position"`
- `#tilt-slider` → `aria-label="Axial Tilt"`
- `#latitude-slider` → `aria-label="Observer Latitude"`

Also ensure the “Stop” button is discoverable (already has text) and that toggles are labeled via `<label>` (already).

Example (pattern):

```html
<input type="range" id="latitude-slider" aria-label="Observer Latitude" ...>
```

**Step 3: Re-run static checks**

```bash
conda run -n astro python scripts/demo_static_checks.py
```

Expected: Seasons no longer listed as failing.

**Step 4: Manual sanity**

Serve locally and confirm keyboard focus + screen-reader name announcement is plausible (VO/NVDA if available).

**Step 5: Commit**

```bash
git add demos/seasons/index.html
git commit -m "fix(a11y): label Seasons sliders"
```

---

## Task 3: Fix slider labeling in Angular Size (accessibility)

**Files:**
- Modify: `demos/angular-size/index.html`

**Step 1: Implement minimal a11y labeling**

Add `aria-label`:
- `#distance-slider` → `aria-label="Distance"`
- `#size-slider` → `aria-label="Physical Size"`

**Step 2: Re-run static checks**

```bash
conda run -n astro python scripts/demo_static_checks.py
```

Expected: Angular Size no longer listed as failing.

**Step 3: Commit**

```bash
git add demos/angular-size/index.html
git commit -m "fix(a11y): label Angular Size sliders"
```

---

## Task 4: Fix slider labeling in Eclipse Geometry (accessibility)

**Files:**
- Modify: `demos/eclipse-geometry/index.html`

**Step 1: Implement minimal a11y labeling**

Add `aria-label`:
- `#tilt-slider` → `aria-label="Orbital Tilt"`
- `#sim-years-slider` → `aria-label="Simulate Years"`

**Step 2: Re-run static checks**

```bash
conda run -n astro python scripts/demo_static_checks.py
```

Expected: Eclipse Geometry no longer listed as failing.

**Step 3: Commit**

```bash
git add demos/eclipse-geometry/index.html
git commit -m "fix(a11y): label Eclipse Geometry sliders"
```

---

## Task 5: Make Angular Size scientifically correct + numerically stable

**Files:**
- Modify: `demos/angular-size/angular-size.js`

**Step 1: Reproduce the blow-up**

Serve locally, set distance slider to minimum and size slider to maximum; observe angular size can become astronomically large (per audit evidence).

**Step 2: Replace small-angle approximation with exact formula**

Replace:

```js
const radians = diameter / distance;
return radians * (180 / Math.PI);
```

With:

```js
function calculateAngularSize(diameter, distance) {
  if (distance <= 0) return 180;
  // Exact angular diameter in radians, robust for all regimes.
  const radians = 2 * Math.atan(diameter / (2 * distance));
  return radians * (180 / Math.PI);
}
```

**Step 3: Add regime guardrail messaging**

Add a small, non-intrusive message element near the angular size readout, e.g.:
- Create in `demos/angular-size/index.html`: `<div id="angle-warning" class="angle-warning" style="display:none"></div>`
- Style in `demos/angular-size/angular-size.css` using existing tokens.
- In `updateReadouts()` (or equivalent), show when `diameter >= distance`:
  - “You are ‘inside’ the object (D ≥ d). Angular size saturates near 180°.”

**Step 4: Format output to avoid scientific notation**

For the main readout, always display a bounded, student-friendly number, e.g.:
- `0.00–1.00` range: show 2 decimals
- `1–180`: show 1–2 decimals

Example:

```js
elements.angularSizeValue.textContent = angularDeg.toFixed(2);
```

**Step 5: Manual verification**

- Baseline: Sun at 1 AU still ~0.53° (order-of-magnitude check).
- Extreme: distance min + size max results in **≤ 180°**, and the warning appears.
- Moon time-evolution still shows ~`0.49°–0.56°`.

**Step 6: Commit**

```bash
git add demos/angular-size/angular-size.js demos/angular-size/index.html demos/angular-size/angular-size.css
git commit -m "fix(angular-size): use exact angular diameter and add guardrails"
```

---

## Task 6: Fix Seasons “retrograde/large obliquity” scientific handling

**Problem:** Current declination model uses `state.axialTilt` directly, which is wrong for obliquity > 90° (e.g., Venus 177.4° should behave like ~2.6° effective obliquity, not 177° seasons).

**Files:**
- Modify: `demos/seasons/seasons.js`
- (Optional) Modify: `demos/seasons/index.html` (labels)
- (Optional) Modify: `demos/seasons/README.md` (document interpretation)

**Step 1: Implement “effective obliquity”**

Add helper:

```js
function effectiveObliquityDegrees(obliquityDeg) {
  const t = Math.abs(obliquityDeg % 360);
  const folded = t > 180 ? 360 - t : t;      // 0..180
  return folded > 90 ? 180 - folded : folded; // 0..90
}
```

Use it inside `getSunDeclination()`:

```js
function getSunDeclination(dayOfYear) {
  const daysFromEquinox = dayOfYear - 80;
  const eps = effectiveObliquityDegrees(state.axialTilt);
  return eps * Math.sin(2 * Math.PI * daysFromEquinox / 365);
}
```

**Step 2: Make the UI honest**

If you keep the tilt slider 0–180:
- Update the tilt display text to show both values when `tilt > 90`, e.g.:
  - `177.4° (effective 2.6°)`

**Step 3: Manual verification**

- Select Venus tilt (177.4): readouts should show **minimal** seasonal variation (not huge declinations).
- Select Uranus (97.8): effective ~82.2°; extreme seasons (near-polar) should remain plausible.

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js demos/seasons/index.html demos/seasons/README.md
git commit -m "fix(seasons): handle retrograde obliquity via effective tilt"
```

---

## Task 7: Fix Seasons orbit-view coherence with distance readout (misconception risk)

**Goal:** Ensure the orbit visualization does not contradict the Earth–Sun distance readout, and that perihelion/aphelion occur at the right time-of-year relative to the distance function.

**Files:**
- Modify: `demos/seasons/seasons.js`
- (Optional) Modify: `demos/seasons/index.html` (add “schematic/not-to-scale” note if needed)

**Step 1: Choose the approach (pick one; implement fully)**

**Approach A (recommended):** Keep the pedagogical “seasons day numbers” but make the orbital-view radius reflect the same distance model (with controlled exaggeration).

Implementation sketch:

```js
function getOrbitAngleFromDay(dayOfYear) {
  // Anchor perihelion (day ~3) on the +x axis for visual truthfulness.
  const daysFromPerihelion = dayOfYear - 3;
  return (daysFromPerihelion / 365) * 2 * Math.PI;
}

function getExaggeratedOrbitRadiusPx(distanceAU) {
  const base = 150;
  const exaggeration = 8; // 1 AU ±1.7% becomes visually noticeable
  return base * (1 + exaggeration * (distanceAU - 1));
}
```

Then in `updateOrbitalView()` set Earth position using `distanceAU` and the angle from `getOrbitAngleFromDay()` instead of the current sin/cos mapping anchored to day 80 at top.

**Approach B:** Keep the current season-anchored orbit drawing but remove/neutralize visual distance cues (distance line length) and label orbit “schematic”.

**Step 2: Implement approach A (if chosen)**

- Earth is closest (minimum radius) near day ~3 and farthest near day ~185.
- The numeric distance readout and the distance line length move together (no contradiction).

**Step 3: Manual verification checklist**

In Seasons demo:
- Day ~3: distance readout ~0.983 AU and Earth is visibly closest.
- Day ~185: distance readout ~1.017 AU and Earth is visibly farthest.
- Equinox/solstice buttons still function and readouts still change correctly.

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js demos/seasons/index.html
git commit -m "fix(seasons): align orbit view geometry with distance model"
```

---

## Task 8: Remove Seasons duplicate planet data (single source of truth)

**Goal:** Avoid drift between `demos/seasons/planets.json` and hard-coded `PLANET_DATA`.

**Files:**
- Modify: `demos/seasons/seasons.js`
- Modify: `demos/seasons/planets.json`
- Modify: `demos/seasons/README.md`

**Step 1: Add stable keys to JSON**

Update `demos/seasons/planets.json` entries to include a `key` field matching the preset button IDs, e.g.:

```json
{ "key": "earth", "name": "Earth", "tilt": 23.5, "color": "var(--earth-blue)", ... }
```

Also migrate `color` from raw hex to a CSS var string (token-based), e.g.:
- `"var(--earth-blue)"`
- `"var(--mars-red)"`

**Step 2: Load JSON at runtime with fallback**

In `demos/seasons/seasons.js`, replace `PLANET_DATA = {...}` with:
- a small embedded fallback map (for offline/file://)
- a `fetch('planets.json')` on init that overwrites planet data if successful

**Step 3: Manual verification**

- No console errors on load.
- Planet preset buttons still set the correct tilt and planet label.

**Step 4: Commit**

```bash
git add demos/seasons/seasons.js demos/seasons/planets.json demos/seasons/README.md
git commit -m "refactor(seasons): use planets.json as planet preset source"
```

---

## Task 9: Challenge Engine accessibility improvements (shared)

**Files:**
- Modify: `demos/_assets/challenge-engine.js`
- (Optional) Modify: `demos/_assets/demo-shell.css` (focus styles)

**Step 1: Add semantics and focus management**

When `_createUI()` builds the wrapper:
- set `wrapper.setAttribute('role', 'dialog')`
- set `wrapper.setAttribute('aria-label', 'Challenge Mode')`
- set `wrapper.setAttribute('aria-modal', 'false')` (it’s a panel, not a true modal)
- set `wrapper.tabIndex = -1`

In `start()`:
- store `document.activeElement` (restore later)
- ensure the close button is focused after opening

In `stop()` (or equivalent stop handler):
- hide panel and restore focus to the prior element

Add keyboard support:
- Esc closes the panel
- Ensure Prev/Next/Check/Hint buttons are reachable and have visible focus

**Step 2: Commit**

```bash
git add demos/_assets/challenge-engine.js
git commit -m "fix(a11y): add semantics and focus management to challenge panel"
```

---

## Task 10: Moon Phases popup styling + schematic labeling

**Files:**
- Modify: `demos/moon-phases/moon-phases.js`
- Modify: `demos/moon-phases/index.html`
- (Optional) Modify: `demos/_assets/demo-shell.css` or a demo-specific CSS block in `demos/moon-phases/index.html`

**Step 1: Move shadow-insight popup CSS out of JS**

Replace `popup.style.cssText = ...` with a CSS class:
- Add `.shadow-insight-popup` styles using existing demo tokens (no raw hex outside `astro-theme.css`).
- In JS, set `popup.className = 'shadow-insight-popup insight-popup'` and remove inline CSS.

**Step 2: Add keyboard dismissal**

- Esc closes the popup if present.
- Ensure close button is focusable and has an accessible name (already uses `aria-label="Close"`).

**Step 3: Associate Speed label with select**

Change speed control markup to:
- `<label for="speed-select">Speed:</label>` + `<select id="speed-select">…</select>`

**Step 4: Add “schematic” micro-label**

Add a small note near the phase disk, e.g.:
- “Schematic (not to scale).”

**Step 5: Commit**

```bash
git add demos/moon-phases/index.html demos/moon-phases/moon-phases.js
git commit -m "fix(moon-phases): tokenized popup styling, Escape close, schematic label"
```

---

## Task 11: Add “model assumptions” boxes (all 4 demos)

**Goal:** Prevent over-interpretation; align with the ASTR 101 pedagogical contract’s “truth + uncertainty” clause.

**Files:**
- Modify: `demos/seasons/index.html`
- Modify: `demos/angular-size/index.html`
- Modify: `demos/moon-phases/index.html`
- Modify: `demos/eclipse-geometry/index.html`

**Step 1: Add a small callout in each demo**

Use a consistent class (e.g., `.model-note`) and token-based styling.

Suggested content (short, student-facing):
- Seasons: “We use a simplified Sun-declination model (good to ~1°). Orbit is exaggerated for visibility.”
- Angular Size: “Angular size uses the exact angular diameter formula; at very close distances, angles saturate.”
- Moon Phases: “Geometry-only; not to scale; phases are about illumination, not shadow.”
- Eclipse Geometry: “Conceptual model; ignores some real orbital details; results are approximate.”

**Step 2: Commit**

```bash
git add demos/seasons/index.html demos/angular-size/index.html demos/moon-phases/index.html demos/eclipse-geometry/index.html
git commit -m "docs(demos): add concise model assumptions notes"
```

---

## Task 12: Add “Reset to Lecture Defaults” buttons (Seasons + Angular Size)

**Files:**
- Modify: `demos/seasons/index.html`
- Modify: `demos/seasons/seasons.js`
- Modify: `demos/angular-size/index.html`
- Modify: `demos/angular-size/angular-size.js`
- (Optional) Modify: `demos/_assets/demo-shell.css` (shared button style)

**Lecture default targets**
- Seasons: Earth, 23.5°, 40°N, March Equinox (day 80)
- Angular Size: Astronomical Objects, Sun preset

**Step 1: Add buttons in HTML**

Example:

```html
<button class="sim-btn" id="btn-reset-defaults" type="button">Reset to Lecture Defaults</button>
```

**Step 2: Wire behavior in JS**

Ensure resets stop animations and restore state deterministically.

**Step 3: Commit**

```bash
git add demos/seasons/index.html demos/seasons/seasons.js demos/angular-size/index.html demos/angular-size/angular-size.js
git commit -m "feat(demos): add reset-to-defaults buttons"
```

---

## Task 13: Design-token cleanup (without changing starfield)

**Goal:** Remove “raw hex + inline style” drift from demo pages/JS by routing colors through `demos/_assets/astro-theme.css` variables (while keeping the existing starfield background unchanged).

**Files:**
- Modify: `demos/eclipse-geometry/index.html` (SVG colors → CSS vars)
- Modify: `demos/moon-phases/index.html` (SVG colors → CSS vars where practical)
- Modify: `demos/angular-size/angular-size.js` (set fills to CSS vars rather than hex)
- Modify: `demos/seasons/seasons.js` / `demos/seasons/planets.json` (colors → CSS vars, after Task 8)
- Modify: `demos/_assets/challenge-engine.js` (remove raw hex fallbacks in `var(--x, #hex)` if you decide the palette is guaranteed present)
- Modify: `demos/_assets/tour-engine.js` (same rationale)

**Step 1: Decide “contract interpretation”**

Because `docs/contracts/course-site-design-contract.md` is locked, decide which path you’re taking:
- **Path A (fast, local):** “All demo colors must be CSS vars defined in `astro-theme.css`” (no raw hex outside that file).
- **Path B (strict site contract):** Migrate demos to the course token system (may require ADR + wider site updates).

This plan implements **Path A** first to eliminate drift quickly; if Path B is desired later, do it as a separate, explicitly approved project.

**Step 2: Implement Path A**

- Replace inline SVG `stop-color="#ffcc00"` etc with `stop-color="var(--sun-glow)"` (verify browser support).
- Replace JS `setAttribute('fill', '#d9534f')` with `setAttribute('fill', 'var(--mars-red)')`.
- Replace injected CSS hex colors with CSS variables.

**Step 3: Commit**

```bash
git add demos/seasons demos/angular-size demos/moon-phases demos/eclipse-geometry demos/_assets/challenge-engine.js demos/_assets/tour-engine.js
git commit -m "style(demos): route colors through astro-theme tokens (no raw hex drift)"
```

---

## Task 14: Final verification (no new deps)

**Files:**
- (No code changes)

**Step 1: Run static checks**

```bash
conda run -n astro python scripts/demo_static_checks.py
```

Expected: exit 0.

**Step 2: Manual smoke (per demo)**

- Seasons:
  - season preset buttons work; latitude 66.5° works; orbit view does not contradict distance.
- Angular Size:
  - Sun/Moon values plausible; extreme sliders never exceed 180°; guardrail message appears for `D ≥ d`.
- Moon Phases:
  - drag to new moon gives days since new ~0; popup styling + Escape close works; schematic label visible.
- Eclipse Geometry:
  - “NO ECLIPSE / SOLAR ECLIPSE / LUNAR ECLIPSE” still exact; “Simulate Years” works; slider a11y fixed.

**Step 3: Quarto render gate**

Run (if needed in your environment, use escalated permissions):

```bash
quarto render
```

Expected: exit 0.

---

## Deferred (Explicitly NOT in this phase)

These are in the comprehensive audit, but deferred per instructor instruction:

- Starfield / reduced-motion changes: `demos/_assets/starfield.js` (keep as-is for now).

