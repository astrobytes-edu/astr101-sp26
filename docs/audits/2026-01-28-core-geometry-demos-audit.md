# Core Geometry Demos Audit (Moon Phases, Eclipses, Seasons, Angular Size)

**Date:** 2026-01-28  
**Scope:** `demos/moon-phases/`, `demos/eclipse-geometry/`, `demos/seasons/`, `demos/angular-size/`  
**Goal:** Assess (1) scientific correctness for ASTR 101 teaching and (2) production readiness (robust UI, clear assumptions, low risk of teaching misconceptions).

## Executive Summary (Verdict)

These demos are **close to teaching-ready**, but they are **not “100% scientifically accurate”** in the literal sense because they intentionally use simplified models (which is fine for ASTR 101 if clearly labeled).

**Blocking correctness issue:**
- **Angular Size demo has an incorrect ISS preset diameter** (off by **×1000**), which makes that preset scientifically wrong and potentially misleading. See `demos/angular-size/angular-size.js:106`. Fix before classroom use if you plan to click the ISS preset.

**Non-blocking but important science/labeling issues:**
- **Eclipse Geometry “total” vs “partial” labels are geometry-only approximations** (latitude-only). They currently overcount “total” relative to real-world totals because the demo does not model umbra size, Moon distance, and solar/lunar apparent size variations. See `demos/eclipse-geometry/eclipse-geometry.js:46`.
- **Eclipse Geometry’s “partial lunar (including penumbral)” label is not consistent with common eclipse-limit definitions**; either rename it to “umbral lunar (partial/total)” or add a separate penumbral threshold. See `demos/eclipse-geometry/eclipse-geometry.js:49`.

**Production readiness:** UI/UX patterns (reset, model notes, responsive layout, ARIA labels) are generally strong across all four demos.

## Method

- Static code + UI inspection of each demo’s `index.html`, main JS, and README.
- Spot-checks of the math against known limiting cases (e.g., quarter/full/new phases, perihelion/aphelion, small-angle vs exact angular diameter).
- Ran the existing eclipse model unit tests: `node tests/eclipse-geometry-model.test.js` (PASS).
- Ran a quick node-only simulation (same logic as the demo) to sanity-check eclipse rates over long timescales (see “Eclipse Geometry” section).

## Demo-by-demo Findings

### 1) Moon Phases (`demos/moon-phases/`)

**Science model (good for ASTR 101):**
- Illumination fraction uses the standard phase-angle relation: `f = (1 + cos φ)/2`. See `demos/moon-phases/moon-phases.js:90`.
- Explicitly teaches “phases are geometry, not Earth’s shadow,” and the UI includes an “Eclipse insight” toggle and directs students to the eclipse demo. See `demos/moon-phases/index.html:668`.

**Important simplifications / risks:**
- The “Earth’s shadow” overlay is explicitly an *insight* tool, but it is still a schematic that does **not** include orbital tilt (so it can’t represent real eclipse rarity). This is mitigated by the explicit model note. See `demos/moon-phases/index.html:691`.
- The phase rendering is a stylized SVG construction (good for conceptual teaching, not photometric realism). See `demos/moon-phases/moon-phases.js:162`.

**Production readiness:**
- Good keyboard/ARIA affordances for phase navigation and announcements. See `demos/moon-phases/moon-phases.js:251` and `demos/moon-phases/index.html:593`.

**Verdict:** Teaching-ready **as-is**, assuming the class message is conceptual geometry (not an ephemeris or photoreal Moon).

---

### 2) Eclipse Geometry (`demos/eclipse-geometry/`)

**Science model (strong, but terminology needs tightening):**
- Uses an inertial-longitude model with explicit Sun/Moon/node longitudes and the exact ecliptic latitude formula:  
  \[
  \beta = \arcsin(\sin i\,\sin(\lambda-\Omega))
  \]
  See `demos/_assets/eclipse-geometry-model.js:29`.
- Uses a separate **syzygy tolerance** (tight) instead of relying on coarse phase labels (correct fix for earlier false positives). See `demos/eclipse-geometry/eclipse-geometry.js:32` and `demos/eclipse-geometry/eclipse-geometry.js:279`.
- Visuals are displayed in a Sun-fixed frame (subtracting `sunLonDeg` for display), while the state evolves in inertial longitudes. See `demos/eclipse-geometry/eclipse-geometry.js:55` and `demos/eclipse-geometry/eclipse-geometry.js:253`.

**Key scientific caveats (teaching-facing):**
1) **“Total” is not truly “total.”**  
   The demo’s “total” thresholds are based on a latitude-only window (distance to the ecliptic plane), not on the full eclipse-geometry constraints that determine *total vs annular vs partial* (Moon distance/size, Earth–Moon distance, umbra size). This makes the “total” label best interpreted as “central alignment possible.”  
   Evidence: thresholds + labeling are latitude-only. See `demos/eclipse-geometry/eclipse-geometry.js:46` and simulation logic `demos/eclipse-geometry/eclipse-geometry.js:856`.

2) **Lunar “including penumbral” label is likely incorrect.**  
   The current constant comment implies penumbral, but the value corresponds to a narrower node window than typical “any lunar eclipse” discussions. Decide whether the demo is modeling (a) umbral-only eclipses or (b) any including penumbral, and rename/add thresholds accordingly.  
   Evidence: `demos/eclipse-geometry/eclipse-geometry.js:49`.

**Sanity check vs expected rates (demo’s own model):**
- Running the demo’s simplified model over long times yields ~2.5 solar eclipses/year and ~1.7 lunar eclipses/year (counting any). This is in-family for “any eclipse” rates, but the demo’s “total” counts are higher than real-world totals (consistent with the “total is geometry-only” caveat).  
  (Computed with a local node script mirroring `simulateYears` in `demos/eclipse-geometry/eclipse-geometry.js:807`.)

**Production readiness:**
- The log can be cleared/reset cleanly. See `demos/eclipse-geometry/eclipse-geometry.js:624`.
- Model is unit-tested independently. See `tests/eclipse-geometry-model.test.js`.

**Verdict:** Teaching-ready **with terminology fixes** before you claim “total lunar/solar” as literally total.

---

### 3) Seasons (`demos/seasons/`)

**Science model (appropriate for ASTR 101, explicitly approximate):**
- Declination modeled as a sine curve anchored to a March equinox reference day; explicitly described as simplified and approximate. See `demos/seasons/seasons.js:154` and `demos/seasons/index.html:592`.
- Day length uses the standard \(\cos H = -\tan\phi\tan\delta\) relation with polar-day/night handling. See `demos/seasons/seasons.js:166`.
- Earth–Sun distance uses a simple eccentricity model with perihelion near day 3, reinforcing “closest in January.” See `demos/seasons/seasons.js:193`.
- Orbit is explicitly exaggerated in the UI note (good). See `demos/seasons/index.html:592`.

**Important simplifications / risks:**
- The globe “terminator” visualization is schematic (shifted ellipse), while the quantitative day length is computed separately. This is fine pedagogically, but students should not interpret the terminator ellipse as a rigorous projection. See `demos/seasons/seasons.js:408`.
- Uses a fixed 365-day year for declination phasing (fine for ASTR 101; not an ephemeris). See `demos/seasons/seasons.js:157`.

**Production readiness:**
- Sliders have ARIA labels and responsive layout is in place. See `demos/seasons/index.html:496`.

**Verdict:** Teaching-ready **as-is** for the “tilt, not distance” goal, with the existing model note.

---

### 4) Angular Size (`demos/angular-size/`)

**Science model (excellent):**
- Uses the exact angular diameter formula \( \theta = 2\arctan(d/2D) \), not the small-angle approximation (good). See `demos/angular-size/angular-size.js:199`.
- UI explicitly states that rays/object are visually magnified while numeric readout is authoritative. See `demos/angular-size/index.html:179`.

**Blocking correctness issue:**
- **ISS diameter is wrong by a factor of 1000.**  
  The code claims “109m in km” but uses `0.000109` km, which is **0.109 m**, not 109 m. It should be `0.109` km.  
  Evidence: `demos/angular-size/angular-size.js:106`.

**Documentation mismatch:**
- The README describes a “Moon Recession slider” and geological-time story, but the current UI is a perigee↔apogee orbit-distance variation slider (not a recession model). Either update the README or implement what the README claims.  
  Evidence: README claim in `demos/angular-size/README.md:53` vs UI in `demos/angular-size/index.html:163`.

**Verdict:** **Not 100% correct as-is** due to the ISS preset bug; otherwise very strong.

## Cross-demo Concerns (Teaching + Maintenance)

1) **Angle convention differences across demos are fine, but must be explicit.**  
   Moon Phases uses “0° = Full, 180° = New” (`demos/moon-phases/moon-phases.js:38`), while Eclipse Geometry uses “phase angle 0° = New, 180° = Full” (`demos/eclipse-geometry/eclipse-geometry.js:238`). Both are valid, but the UI text should continue to define conventions to avoid instructor confusion when switching demos quickly.

2) **“Total” terminology should match what the model actually computes.**  
   If we keep latitude-only thresholds, prefer labels like “central/near-center alignment” instead of “total,” or add a note that “total/annular distinction requires modeling apparent sizes.”

3) **READMEs should not overpromise features that the UI doesn’t have.**  
   This is currently true for Angular Size.

## Recommended Next Steps (PR-sized)

1) **Fix ISS preset** in `demos/angular-size/angular-size.js:106` (0.000109 → 0.109).  
2) **Update Angular Size README** to match the current “perigee↔apogee” time slider (or implement a clearly-labeled recession-time mode).  
3) **Rename Eclipse Geometry “total” labels** to reflect geometry-only centrality (or add a “model note” line clarifying).  
4) **Clarify lunar eclipse threshold semantics** (umbral vs penumbral) in `demos/eclipse-geometry/eclipse-geometry.js:49` and README.  
5) Optional: add tiny unit tests for Angular Size presets (at least ISS and Moon) similar to the eclipse model tests.

## Validation Checklist (Before Teaching)

- Run: `conda run -n astro make render` (site still renders cleanly).
- Run: `node tests/eclipse-geometry-model.test.js`.
- Manually open each demo page and verify:
  - Reset buttons restore defaults
  - Sliders/dragging work on trackpad + touch
  - No console errors
  - Model notes are visible and match what the demo actually computes

