# Scientific Correctness Verification Checklist — ASTR 101 Interactive Demos

**Scope:** `demos/seasons/`, `demos/angular-size/`, `demos/moon-phases/`, `demos/eclipse-geometry/`
**Purpose:** A post-fix checklist to validate that each demo’s *scientific model* matches its stated assumptions, coordinate/sign conventions, units, and limiting-case behavior.

> If any item is uncertain or depends on an external reference, mark it `VERIFY` and record what source you used (course slides/textbook) before changing numbers or claims.

---

## Preflight (required)

1. Serve locally using conda:
   - Run: `conda run -n astro python -m http.server 8000 --bind 127.0.0.1`
2. Open each demo and confirm the on-page “model note”/assumptions (if present) are visible and match what you intend to teach.
3. Open devtools console and confirm:
   - No console errors on load
   - No console errors during the checks below (especially Challenge Mode flows)

---

## Demo 1 — Seasons (`demos/seasons/`)

### Model/assumptions consistency
- Confirm the demo explicitly states it is a simplified conceptual model (not an ephemeris).
- Confirm the “date/day-of-year” convention used in UI matches the README (1–365), and the equinox/solstice presets match the displayed calendar dates (or are explicitly described as approximate anchors).
- Confirm the demo is **Earth-only** (no planet presets exposed), and the tilt control is 0–90°.
- Confirm any “distance” readout label matches what is actually modeled (do not imply a planet-specific real orbit if the demo is schematic).

### Sign conventions and units
- Verify latitude sign convention: positive = Northern Hemisphere; negative = Southern Hemisphere.
- Verify tilt is in degrees and the readouts (declination/altitude) are consistently in degrees.

### Limiting cases (run-to-fail)
- Tilt = 0:
  - Seasonal amplitude should disappear in whatever way the UI claims (e.g., “No seasons”).
  - Declination should not vary over “date/position” (within the model).
- Latitude = 0 (equator):
  - Day length should not show extreme polar behavior.
  - Noon Sun altitude should track declination in a consistent way.
- Latitude near ±90 (poles):
  - The demo should handle polar edge cases without NaN/undefined readouts.
  - Day-length behavior should be internally consistent with the demo’s own polar special-case rules.
### Future extension (not shipped; `VERIFY`)
- If/when planet presets return, do **not** claim “planet-real seasons” unless you have a VERIFIED convention/source for perihelion ↔ equinox alignment and you explicitly document assumptions.

### Visual correctness
- Orbit view: confirm labels/markers do not contradict the modeled geometry (e.g., “perihelion-anchored” positioning vs quadrant season labels). Choose either a truthful geometry story or an explicitly schematic story; avoid mixing cues.
- Globe view: confirm any overlays (ecliptic/celestial equator/terminator/latitude bands) match their labels and do not invert hemispheres or seasons.

---

## Demo 2 — Angular Size (`demos/angular-size/`)

### Model/assumptions consistency
- Confirm the page claim matches the implementation:
  - Exact angular diameter formula: `θ = 2 arctan(d / (2D))` (with `d` and `D` in the same units).
  - Saturation toward a maximum angular size for extreme close-range cases (as stated by the demo).

### Units and formatting correctness
- Verify the displayed angle unit is consistent and unambiguous:
  - If using degrees only: ensure precision is sufficient for small angles (no “0.00°” for canonical astronomy examples).
  - If switching units: ensure thresholds and displayed unit symbols are consistent across readouts and accessibility text.
- Verify distance and size units are clearly indicated and internally consistent with the preset definitions.

### Limiting cases (run-to-fail)
- Small-angle regime:
  - Pick a “far” distance / “small” diameter combination and verify the demo behaves like the small-angle approximation qualitatively (linear scaling with `d`, inverse with `D`), without relying on specific numeric benchmarks.
- Large-angle regime:
  - Move distance very close and/or object very large; verify the visualization stays bounded/readable and the demo’s warning/copy (if any) matches what is happening.

### Definition (locked)
- Andromeda preset: use the **bright disk** definition. Ensure README and preset values agree and explicitly define what “size” means.

---

## Demo 3 — Moon Phases (`demos/moon-phases/`)

### Model/assumptions consistency
- Confirm the demo’s core claim is explicit: phases are geometry, not Earth’s shadow (except during eclipses).
- Confirm the internal angle convention matches the UI:
  - Which angle corresponds to New/Full/Quarter phases (and which side sunlight comes from).
  - Timeline labels/presets align with what the visual orbit shows.

### Phase geometry checks (limiting cases)
- New Moon:
  - Illumination readout is near minimum and the phase label is “New” (within the demo’s rounding/labeling rules).
  - Waxing/waning direction indicator follows the chosen boundary convention (document it).
- Full Moon:
  - Illumination readout is near maximum and phase label is “Full”.
  - Waxing/waning direction indicator follows the chosen boundary convention.
- First/Third quarter:
  - Illumination readout is near half and quarter labels match the Moon position shown.

### Visual correctness (shadow insight)
- Toggle the “shadow” insight:
  - Confirm it does not change the computed illumination/phase (it should only change the explanatory overlay).
  - Confirm it does not accidentally imply “shadow causes phases” in any labels/copy.

### Accessibility/science coupling
- Timeline buttons:
  - Ensure accessible names uniquely identify the phase (no ambiguous “Crescent”/“Gibbous” without waxing/waning).
- Any `aria-valuetext` describing the phase:
  - Ensure the text aligns with the visual state (phase name + illumination description).

---

## Demo 4 — Eclipse Geometry (`demos/eclipse-geometry/`)

### Model/assumptions consistency
- Confirm the demo’s claim is explicit:
  - Eclipses require the correct phase (New for solar, Full for lunar) AND proximity to a node (small ecliptic latitude).
- Confirm the “ecliptic height/latitude” model is consistent with what the UI shows:
  - `heightDeg` behaves like a sinusoid with amplitude equal to the tilt setting.
  - Nodes correspond to “height crosses zero”.

### View consistency checks (high priority)
- At New Moon, the side view must place the Moon between Earth and Sun (left of Earth in the side view, near the Sun direction marker).
- At Full Moon, the side view must place the Moon on the far side of Earth from the Sun.
- During animations, the Moon should remain inside the SVG bounds (no negative `cx` / off-canvas positions).

### Limiting cases (run-to-fail)
- Tilt = 0:
  - The demo should show eclipses “every month” behavior consistent with its own threshold model (as the UI suggests).
- Large tilt:
  - Most New/Full events should be “no eclipse” except when close to nodes (within the demo’s illustrative model).

### VERIFY items (numbers/precision claims)
- Eclipse threshold (“eclipse limits”) values:
  - VERIFY whether the exact degree thresholds shown in code/README are intended to be authoritative.
  - If not VERIFIED, ensure the README/UI labels them as illustrative and avoid implying high precision.
- Node regression rate and direction:
  - VERIFY the intended direction/sign convention and ensure month/year animations match it qualitatively (avoid hard numeric claims unless VERIFIED).

---

## Cross-demo consistency (recommended)

- Confirm New/Full phase conventions are consistent between:
  - `demos/moon-phases/` and `demos/eclipse-geometry/` (especially if both label New/Full and use a shared “Sun from left” geometry).
- Confirm any shared concept wording is consistent:
  - “Waxing/Waning”, “First/Third quarter”, “node/line of nodes”, “ecliptic latitude/height”.
