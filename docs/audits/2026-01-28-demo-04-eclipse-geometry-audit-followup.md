# Demo 4 Audit (Follow-up) — Eclipse Geometry (`demos/eclipse-geometry/`)

**Date:** 2026-01-28  
**Auditor:** Codex (GPT-5.2)  
**Scope:** Eclipse Geometry demo only (`demos/eclipse-geometry/`).  
**Method:** Static review of code + README (no browser/runtime verification in this audit).  
**Related prior audit:** `docs/audits/2026-01-25-demo-04-eclipse-geometry-audit.md` (some items there appear to be resolved in the current code; this follow-up focuses on *current* concerns, especially physics/modeling and log clearing).

---

## Protocol Compliance (Phase Separation)

### Task classification (per `docs/llm-lab-protocol.md`)

- **Dominant:** Numerical / physical correctness (conceptual orbital model + long-term simulation)
- **Also:** UI/UX correctness (log behavior, reset behavior), documentation consistency

### Invariants (for this demo)

- **Conceptual truth:** “Eclipses require (a) correct phase and (b) proximity to a node” stays true in all views and in the simulation.
- **Time-scale truth:** The demo should visibly support the README claim that eclipses cluster in “seasons” roughly ~6 months apart. (The exact cadence may be approximate, but it should not be qualitatively wrong.)
- **UI truth:** Reset/clear actions actually clear what the user sees (no “ghost logs” left in the table).

---

## Phase A — Understanding (no solutions)

### What the demo is trying to teach

Per `demos/eclipse-geometry/README.md`, the demo aims to explain why eclipses don’t happen every month by connecting orbital tilt + nodes to eclipse “seasons”, then letting students run multi-year simulations and inspect an eclipse log. See especially:
- Node regression and “eclipse seasons shift earlier…”: `demos/eclipse-geometry/README.md:29`
- “Notice eclipses cluster in ‘seasons’ ~6 months apart”: `demos/eclipse-geometry/README.md:168`

### What the code currently implements (high-level)

- Moon “ecliptic height” model: `heightDeg = tiltDeg * sin(moonAngle - nodeAngle)`. `demos/eclipse-geometry/eclipse-geometry.js:131`
- Phase buckets derived from `moonAngle` with New Moon centered at 180° and Full Moon centered at 0°. `demos/eclipse-geometry/eclipse-geometry.js:142`
- Eclipse classification uses only two conditions:
  1) phase bucket is exactly `"New Moon"` or `"Full Moon"` and
  2) `|heightDeg|` is below fixed thresholds. `demos/eclipse-geometry/eclipse-geometry.js:159`
- Long-term simulation checks New (180°) and Full (0°) once per synodic month and advances `nodeAngle` by ~19.3°/year. `demos/eclipse-geometry/eclipse-geometry.js:629`

---

## Phase B — Assumption Audit

Assumptions used in this audit:

- **(Explicitly stated)** This is a conceptual model, so approximate geometry is acceptable. (`Model note` in `demos/eclipse-geometry/index.html:437`)
- **(Reasonably inferred)** The simulation should qualitatively reproduce eclipse *seasons* (clusters spaced by roughly half a year), because the README explicitly instructs students to look for them. `demos/eclipse-geometry/README.md:168`
- **(Unknown / VERIFY)** Whether the numeric eclipse thresholds in degrees are intended as authoritative or just “nice-to-demonstrate” defaults. The README presents them as “actual eclipse limits”; without a cited source, treat as “VERIFY”. `demos/eclipse-geometry/README.md:52`

---

## Findings

**Overall:** Needs Work

**Update (2026-01-28):** The critical/major items called out below (E-01/E-02/E-03) have been implemented since this audit was written:
- Node motion is now modeled in the Sun-fixed frame (annual sweep + slow nodal regression) so eclipse seasons appear on ~6-month cadence.
- Eclipse detection now requires being near true New/Full (syzygy tolerance), rather than using the coarse phase-label buckets.
- Reset and reruns now clear the visible log table immediately.

Implementation: `demos/eclipse-geometry/eclipse-geometry.js` and `demos/eclipse-geometry/README.md`. The original “Observed (in code)” evidence lines below refer to the *pre-fix* version.

### E-01 (Critical) — Simulation omits the ~6-month “eclipse season” cadence described in the README

**Expected (per README):** In a 10-year simulation, eclipses should cluster in seasons spaced by ~6 months. `demos/eclipse-geometry/README.md:168`

**Observed (in code):** The only secular evolution in the simulation is nodal regression at ~19.3° per year:
- Constant: `demos/eclipse-geometry/eclipse-geometry.js:17`
- Used in simulation: `demos/eclipse-geometry/eclipse-geometry.js:662`

In the demo’s *Sun-fixed* frame (Sun direction drawn fixed to the left in `demos/eclipse-geometry/index.html:270`), using only nodal regression means the “node vs Sun” alignment changes on an ~18.6-year time-scale, not a “twice per year” season time-scale.

**Concern:** This is likely the root cause of “the eclipse demo is incorrect,” because it conflicts directly with the intended qualitative takeaway (“seasons”) and with the discussion question “Why does the eclipse season occur twice per year?” `demos/eclipse-geometry/README.md:155`

**Minimal fix direction (no implementation in this audit):**
- Decide what `nodeAngle` represents: **node longitude in an inertial frame** vs **node direction in the Sun-fixed frame**.
- If the visualization is Sun-fixed (as drawn), the node direction in that frame should sweep by roughly one full rotation per year (plus nodal regression) so that the Sun crosses the node line about twice per year (consistent with eclipse seasons). (Exact sign conventions can be chosen for pedagogy, but the time-scale should be correct.)

---

### E-02 (Major) — Eclipse detection is phase-bucketed too loosely (can mark eclipses far from exact New/Full)

**Observed:** Eclipse checks depend on `getPhase(moonAngle)` returning exactly `"New Moon"` or `"Full Moon"`. `demos/eclipse-geometry/eclipse-geometry.js:165` and `demos/eclipse-geometry/eclipse-geometry.js:181`

But `getPhase()` uses 45°-wide buckets; “New Moon” spans 157.5°–202.5° and “Full Moon” spans ±22.5° around 0°. `demos/eclipse-geometry/eclipse-geometry.js:145`

**Why this matters:** A solar eclipse requires the Moon to be very close to the Sun–Earth line (i.e., very close to true New Moon), not merely “somewhere in the New Moon phase bucket.” The current logic can therefore label configurations as eclipses when the Moon is visibly not between Earth and Sun.

**Minimal fix direction (no implementation in this audit):**
- Keep `getPhase()` for labeling, but use a separate “near New/Full” angular tolerance for eclipse checks (and for challenge checks), e.g. a small Δangle around 180° and 0°. The tolerance can be pedagogical (hours-level realism is not required), but it should be much tighter than ±22.5°.

---

### E-03 (Major) — “Reset” and “Run Simulation” don’t reliably clear the visible log table (“logs can’t be erased”)

**Observed:**
- “Reset” clears `state.eclipseLog = []` but does not call `updateLogTable()`. `demos/eclipse-geometry/eclipse-geometry.js:480`
- “Show Log” just toggles visibility; it does not rebuild/clear the table. `demos/eclipse-geometry/eclipse-geometry.js:598`
- `simulateYears()` also clears `state.eclipseLog = []` but does not clear the DOM table immediately; for ≤100-year runs it only updates the table periodically (every 50 months) and at the end. `demos/eclipse-geometry/eclipse-geometry.js:639` and `demos/eclipse-geometry/eclipse-geometry.js:693`

**User-facing consequence:** After a run, the table can continue to display stale entries even after “Reset” or after starting a new run, until the next periodic refresh or the end of the run. This matches the complaint that the log can’t be erased.

**Minimal fix direction (no implementation in this audit):**
- On reset (and at the start of `simulateYears()`), call `updateLogTable()` so the DOM reflects the cleared state immediately.
- Consider adding an explicit “Clear Log” button if you want “Reset” to preserve other state.

---

### E-04 (Minor) — README claims status banner includes TOTAL/PARTIAL, but UI label is SOLAR/LUNAR only

**README:** “TOTAL/PARTIAL SOLAR ECLIPSE” / “TOTAL/PARTIAL LUNAR ECLIPSE”. `demos/eclipse-geometry/README.md:122`

**Code:** Banner text is only `SOLAR ECLIPSE` or `LUNAR ECLIPSE`; total/partial is relegated to `statusNote`. `demos/eclipse-geometry/eclipse-geometry.js:312`

**Recommendation:** Either update README to match the UI, or update the banner text to match README.

---

### E-05 (Minor) — “Partial lunar” threshold is described as including penumbral, but labeled as “Partial lunar eclipse”

**Code comment:** `PARTIAL_LUNAR_THRESHOLD` is described as “including penumbral”. `demos/eclipse-geometry/eclipse-geometry.js:33`

**UI strings/log labels:** use “Partial lunar eclipse” as the type label. `demos/eclipse-geometry/eclipse-geometry.js:190`

**Recommendation:** If you intend to include penumbral eclipses, label them as such (or explicitly say “any lunar eclipse (including penumbral)” in the UI). If you intend “partial” to mean umbral partial only, tighten the threshold and adjust copy.

---

## Suggested Next Actions (if you want fixes)

1) Fix the season time-scale mismatch (E-01) so the 10-year log shows clusters ~6 months apart as promised by the README.
2) Tighten eclipse gating to “near true New/Full” (E-02), and apply the same criterion in Challenge Mode checks.
3) Make log clearing immediate and explicit (E-03): call `updateLogTable()` on reset and at simulation start, and/or add “Clear Log”.
