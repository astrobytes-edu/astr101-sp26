# Geometry Demos (Cosmic Playground) Backlog Completion — Design/Roadmap

**Date:** 2026-01-30  
**Scope:** Seasons, Moon Phases, Angular Size, Eclipse Geometry demos  

**Primary goal:** Complete *all* backlog items for the four geometry demos while preserving (1) scientific correctness, (2) teach-first pedagogy, and (3) a cohesive “Cosmic Playground” visual system.

**Source backlogs (single source of truth for scope):**
- `demos/_instructor/seasons/backlog.qmd`
- `demos/_instructor/moon-phases/backlog.qmd`
- `demos/_instructor/angular-size/backlog.qmd`
- `demos/_instructor/eclipse-geometry/backlog.qmd`

---

## Non‑negotiable constraints (invariants)

1) **Physics correctness + units discipline**
- Any new “physics” computation must either (a) live in a shared model module under `demos/_assets/*-model.js` (preferred), or (b) be small, audited, and tested if it stays in the UI file.
- No silent unit assumptions; display strings must not contradict the code’s unit conventions.

2) **Teach-first pedagogy**
- Every new feature must serve an explicit learning move: prediction → observation → explanation.
- Progressive disclosure: new overlays/modes should be opt-in and default to the simplest conceptual layer.

3) **Design consistency**
- New UI surfaces should reuse existing shell styling and component patterns; avoid bespoke one-off UI widgets.

4) **Verification gates**
- At minimum: `node --test`, `conda run -n astro python scripts/check_demo_polish.py`, `conda run -n astro python scripts/demo_static_checks.py`, `conda run -n astro make render`.

---

## Backlog inventory (what’s left)

### Seasons (`demos/seasons/`)
- **P0 Physics (partial):** calendar slider uses 365-day wrap while “physics” uses tropical year constants.
- **P1 Pedagogy:** add an “insolation proxy” readout (relative daily energy).
- **P1 Physics:** replace distance toy model with a simple Kepler-solver for \(r(t)\).
- **P1 UX:** add a “compare hemispheres” toggle that pins both 40°N and 40°S readouts.
- **P2 UX:** station-mode overlay + built-in data table export (CSV copy).
- **P2 Pedagogy:** expand clickers after classroom pilots (requires evidence).

### Angular Size (`demos/angular-size/`)
- **P1 Pedagogy:** guided “Sun–Moon coincidence” mini-challenge with prediction checkpoints.
- **P1 Physics:** replace linear Moon recession with “toy vs geology-informed” option (units explicit).
- **P1 UX:** side-by-side compare two presets (ratio reasoning).
- **P2 Accessibility:** audit/ensure aria labels + keyboard focus order.
- **P2 Pedagogy:** expand assessment after pilot (requires evidence).

### Moon Phases (`demos/moon-phases/`)
- **P0 UX:** add on-screen “Sun direction” arrow label.
- **P1 Pedagogy:** prediction checkpoints in Challenge Mode (misconception-aligned).
- **P1 Physics:** simple “3D inclination” toggle that hands off to Eclipse Geometry.
- **P1 UX:** rise/set time intuition overlay (optional).
- **P2 Pedagogy:** expand assessment after pilot (requires evidence).

### Eclipse Geometry (`demos/eclipse-geometry/`)
- **P1 Pedagogy:** built-in station mode (printable table template + synthesis prompt).
- **P1 Physics:** include Earth orbital eccentricity (Sun distance) as a second-order effect on cone sizes.
- **P1 UX:** “show shadow cones” overlay (umbra/penumbra) with scale disclaimer.
- **P2 Accessibility:** keyboard shortcuts help panel.
- **P2 Docs:** update `demos/eclipse-geometry/README.md` thresholds language to match current model.

---

## Proposed roadmap (sequenced to minimize risk)

### Phase 1 — “Teach-first clarity” (lowest risk, highest immediate classroom payoff)

1) **Moon Phases: Sun direction arrow (P0)**  
Make the geometry coordinate system explicit on-screen so student explanations match what they’re seeing.

2) **Seasons: insolation proxy (P1)**  
Add a single readout that directly operationalizes “more direct + longer days = more energy” while staying interpretive (relative units).

3) **Eclipse Geometry: keyboard shortcuts help (P2)**  
Small, accessibility-forward improvement; low risk.

4) **Angular Size: accessibility audit (P2)**  
Treat as a systematic check with a short checklist (labels, focus order, keyboard reachability).

### Phase 2 — “Structured learning modes” (consistent across the suite)

1) **Station mode (Seasons P2 + Eclipse P1)**  
Goal: a predictable “lab surface” that reduces instructor overhead.  
Design decision: either implement per-demo (fast) or factor a tiny shared “station mode overlay” helper in `demos/_assets/` (cleaner).

2) **Challenge/prediction checkpoints (Angular Size P1 + Moon Phases P1)**  
Use the existing challenge framing and add explicit “pause + predict” prompts tied to misconceptions.

### Phase 3 — “Second-order physics fidelity” (avoid turning demos into ephemerides)

1) **Seasons: Kepler-solver for \(r(t)\) (P1)**  
Keep the “distance doesn’t cause seasons” teaching point, but make the distance curve internally consistent with a simple solver.

2) **Eclipse Geometry: Earth–Sun distance effect (P1)**  
Add as optional/advanced toggle with a “small effect” disclaimer to avoid cognitive overload.

3) **Angular Size: recession model upgrade (P1)**  
Provide a clearly-labeled “toy” mode (linear) and a “geology-informed” mode with explicit assumptions and caveats.

### Phase 4 — “Post-pilot assessment polish” (requires classroom evidence)

Each of the “expand assessment after pilot” backlog items can be pre-drafted now, but should not be marked “DONE” until after at least one classroom use + revision.

---

## Cross-demo design opportunities (optional, but likely worth it)

1) **Shared “mode surface” patterns**  
Unify how “Station mode,” “Challenge mode,” and “Help” appear and are dismissed (same look/feel and keyboard behavior).

2) **Explicit “model note” conventions**  
Every non-realistic simplification should be disclosed in a consistent, low-clutter way (collapsible “Model note” or small panel note).

---

## Definition of done (per feature)

For each backlog item implemented:
- UI: the feature is discoverable, optional where appropriate, and does not increase cognitive load by default.
- Pedagogy: there is an explicit prediction prompt or a clear “what to notice” statement.
- Science: units are explicit; code matches docs; any approximations are labeled.
- Verification: the repo verification gates pass (see invariants).

