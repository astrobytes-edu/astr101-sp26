# Demos + Instructor Resources Audit (ASTR 101)

**Date:** 2026-01-30  
**Auditor role:** Architectural referee + invariant enforcer (plus STEM pedagogy audit)  
**Scope:** `demos/` (11 demos + shared assets + tests) and `demos/_instructor/` (all demo packs + suite guides)  
**Primary standards:**  
- `docs/contracts/demo-pedagogy-contract.md` (Observable → Model → Inference; instructor resources required)  
- `docs/contracts/demos-physics-library-contract.md` (units + shared physics invariants + verification gates)  
- `docs/contracts/astr101-pedagogical-contract.md` (truth/uncertainty + math grammar)  
- `docs/software-engineering-playbook.md` (DRY, boundaries, verification discipline)  

**Overall verdict:** **PASS (production-ready)** — strong scientific correctness and a well-integrated instructor layer; only small documentation fixes were needed.

---

## 0) Task classification + invariants (LLM lab protocol)

**Dominant task type:** Documentation / explanation + correctness audit (with light refactoring of docs only).  
**Hard invariants checked:**

- **Physics correctness:** no wrong formulas/units/constants in code or instructor-facing “model” docs.  
- **Units discipline:** shared physics uses explicit unit conventions; no silent ad-hoc AU/yr/month constants in models.  
- **Architecture:** model math is separated from UI; shared utilities are DRY; tests cover shared physics.  
- **Instructor alignment:** every instructor demo pack exists and points at real code paths + real demo URLs; activities and assessments match the shipped UI affordances.

---

## 1) Evidence-based verification (what I actually ran)

### Automated checks (passed)

- `node --test` → **PASS** (145 tests).  
- `conda run -n astro python scripts/check_demo_polish.py` → **PASS** (11 polished demos checked).  
- `conda run -n astro python scripts/demo_static_checks.py` → **PASS**.

### Site build verification

- `conda run -n astro make render` → **PASS** (Quarto render completed; `_site/index.html` produced).

---

## 2) What I changed during this audit (doc-level fixes only)

These were concrete correctness/consistency issues discovered during review; fixes were applied immediately.

- `demos/blackbody-radiation/README.md`: fixed mixed-unit constant listing for Planck’s constant and added an explicit CGS-units note.  
- `demos/em-spectrum/README.md`: fixed Planck’s constant units for consistency with the CGS conventions used elsewhere in the README and in code.  
- `demos/README.md`: updated to reflect the full current 11-demo suite; refreshed course-alignment tables; moved already-built demos out of the “future roadmap.”  
- `demos/CHANGELOG.md`: added an `[Unreleased]` section capturing current suite/documentation status and removed a misleading “see polish manifest” reference from an older entry.

No demo physics code or instructor-guide content changes were required to meet correctness/consistency.

---

## 3) Suite-level architecture & code quality audit (demos/)

### 3.1 Strengths (meets/exceeds the engineering + demo contracts)

1) **Clean separation of concerns (model vs UI).**  
   - Shared, testable model/math lives under `demos/_assets/*-model.js` and `demos/_assets/physics/*`.  
   - UI/controller code lives in per-demo JS files (e.g., `demos/seasons/seasons.js`).

2) **Single source of truth for units and constants.**  
   - The shared physics library (`demos/_assets/physics/astro-constants.js`, `units.js`, `two-body-analytic.js`) provides a strong “no drift” spine.  
   - Unit-bearing naming and wrapper patterns are reinforced by tests.

3) **Verification gates exist and are used.**  
   - Node test suite covers physics + invariants and passes.  
   - “Polish migration” is enforced by `polish-manifest.json` + `scripts/check_demo_polish.py`.

4) **DRY & consistency across demos.**  
   - Shared theme + shell + polish assets reduce per-demo boilerplate and UI drift.  
   - Centralized angle conversion (`AstroUnits`) and formatting reduce the classic “copied constant” failure mode.

### 3.2 Remaining engineering recommendations (non-blocking)

These are improvements to maintainability and future-proofing rather than correctness fixes.

1) **Expand static checks to cover the full suite.**  
   - `scripts/demo_static_checks.py` currently targets a small subset of demos. Consider extending it to all demos with sliders/range inputs (or generalizing it to scan `demos/*/index.html`).

2) **Quarto hub pages: reduce inline CSS drift.**  
   - `demos/index.qmd` and `demos/_instructor/index.qmd` contain substantial inline CSS blocks. Consider moving these styles into a shared stylesheet (e.g., under `assets/` or a Quarto theme layer) to avoid divergence and simplify maintenance.

---

## 4) Pedagogical + scientific correctness audit (demo + instructor layer)

### 4.1 Instructor-resource completeness (contract compliance)

For each of the 11 demos, the instructor pack exists at `demos/_instructor/<demo>/` and includes the required pages:

- `index.qmd` (teach-first guide + live-teach script)
- `model.qmd` (math/assumptions/sanity checks)
- `activities.qmd` (MW quick, MW short, Friday lab, station)
- `assessment.qmd` (clickers + short-answer + exit ticket)
- `backlog.qmd` (future enhancements)

Suite guides exist and are appropriately scoped:
- `demos/_instructor/cosmic-playground/` (geometry throughline)
- `demos/_instructor/light-and-telescopes/` (light/instrumentation throughline)
- `demos/_instructor/distance-and-measurement/` (measurement throughline)

### 4.2 Instructor-to-demo alignment (no drift found)

Systematic cross-checks performed:

- All instructor “Main code:” and “Model code:” references point to real files (no broken paths).  
- All activity packs include MW quick + MW short + Friday lab sections (consistency check across all `activities.qmd`).  
- All assessment packs include clickers + short-answer + exit ticket sections (consistency check across all `assessment.qmd`).  
- Spot checks of button/label references (e.g., seasons solstice/equinox buttons; eclipse new/full moon controls) match the shipped HTML labels.

### 4.3 Scientific correctness (high confidence)

Why confidence is high:

- The model code is under test (Node) with physics-specific checks (scaling laws, anomaly conversions, orbit classification, etc.).  
- Shared constants and unit conversions are centralized and tested.  
- Instructor “model” deep dives explicitly state units, assumptions, and sanity checks for the conceptually-risky demos (e.g., blackbody, EM spectrum, parallax).

**Only issue found:** two student-facing READMEs listed Planck’s constant in SI while using CGS for other constants. This was a documentation-only inconsistency and has been corrected (see §2).

---

## 5) Per-demo scorecard (current state)

Scoring key:
- ✅ = meets contract / ready to teach
- ⚠️ = minor polish opportunity (non-blocking)
- ❌ = must fix (blocking)

| Demo | Physics | Pedagogy | Accessibility/UX | Instructor alignment | Notes |
| --- | --- | --- | --- | --- | --- |
| Angular size | ✅ | ✅ | ✅ | ✅ | Strong misconception targeting; good “toy model” labeling for recession mode. |
| Moon phases | ✅ | ✅ | ✅ | ✅ | Clear geometry story; model locked to shared equation module. |
| Eclipse geometry | ✅ | ✅ | ✅ | ✅ | Two-condition framing is strong; long-run simulation is a standout for pattern discovery. |
| Seasons | ✅ | ✅ | ✅ | ✅ | Excellent misconception busting; model doc cleanly separates “tilt driver” from distance toy model. |
| Kepler’s laws | ✅ | ✅ | ✅ | ✅ | Solid Newton/Kepler dual framing; good unit discipline and tests. |
| Conservation laws | ✅ | ✅ | ✅ | ✅ | Strong bridge from “shapes” to conserved quantities; works for 101 + stretch. |
| Binary orbits | ✅ | ✅ | ✅ | ✅ | Correct barycenter physics across mass ratios; clean path to RV method discussion. |
| Blackbody radiation | ✅ | ✅ | ✅ | ✅ | Instructor model doc is exemplary on units/sanity checks. |
| EM spectrum | ✅ | ✅ | ✅ | ✅ | Unit-aware “translator” demo is pedagogically clean; constants tested. |
| Telescope resolution | ✅ | ✅ | ✅ | ✅ | Diffraction + seeing/AO framing is clear; includes numeric guardrails. |
| Parallax distance | ✅ | ✅ | ✅ | ✅ | Strong inference framing (baseline + precision); good tie-in to “measurement limits.” |

---

## 6) Must-fix issues (blockers)

**None found.**

---

## 7) Should-fix recommendations (non-blocking, high leverage)

1) **Move Quarto hub-page inline CSS into a shared stylesheet** to reduce drift and improve maintainability.  
   - Candidate files: `demos/index.qmd`, `demos/_instructor/index.qmd`.

2) **Generalize demo static checks** so they scale with new demos (especially accessibility labeling checks).  
   - Candidate file: `scripts/demo_static_checks.py`.

3) **Consider an instructor-pack linter** (simple structural checks):  
   - Each `demos/_instructor/<demo>/` directory contains the 5 required files  
   - Each file contains the standard navigation callout block  
   - All “Student demo:” links match real demo directories

---

## 8) Next actions (optional)

- If you want, I can implement the non-blocking maintainability improvements in §7 as a small, testable PR-sized slice (starting with a generalized `demo_static_checks.py` and/or extracting hub CSS).
