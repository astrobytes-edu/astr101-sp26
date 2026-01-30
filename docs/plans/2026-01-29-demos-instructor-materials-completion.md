# Demos Instructor Materials Completion (All 11 Demos) — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Provide complete, navigable, instructor-facing resources (guides, model notes, activities, assessments, and capstones) for **all 11 demos** in `demos/`, without exposing instructor pages in student-facing navigation or site search.

**Architecture:** Keep a **single-site** Quarto build. Instructor materials live under `demos/_instructor/` (and instructor meta-indexing under `activities/_instructor/` as needed). All instructor pages remain **`search: false`** and are reachable only via direct URL + instructor hub cross-links.

**Tech Stack:** Quarto (`.qmd`), Markdown, callouts, existing demo READMEs + model code under `demos/_assets/*-model.js`, verification via `conda run -n astro make render` + search-index grep.

**Skill note (VERIFY):** `lecture-writing` routes to `astr101-lecture-writing`, but that skill is currently missing. Until it exists, follow the repo contracts directly:
- `docs/contracts/astr101-pedagogical-contract.md`
- `docs/contracts/demo-pedagogy-contract.md`
- `docs/contracts/astr101-activities-contract.md`

---

## Hard Invariants (do not violate)

- **Single-site build:** Do not introduce a second deploy target.
- **No student-facing links:** Do not add instructor URLs to `_quarto.yml` navbar/sidebar.
- **No search leakage:** Instructor pages must keep `search: false` and not appear in `_site/search.json`.
- **No drive-by refactors:** Claude is doing DRY/code polish in parallel; this plan is **instructor materials first**. Only touch demo JS if explicitly required for instructor materials (and coordinate first).

---

## Phase A — Understanding (no solutions)

**What is known**
- There are 11 demo folders under `demos/`:
  - `angular-size`, `binary-orbits`, `blackbody-radiation`, `conservation-laws`, `eclipse-geometry`, `em-spectrum`, `keplers-laws`, `moon-phases`, `parallax-distance`, `seasons`, `telescope-resolution`.
- Instructor packs already exist for:
  - `seasons`, `moon-phases`, `angular-size`, `eclipse-geometry`, `keplers-laws`, `binary-orbits`, `conservation-laws`, plus suite pages under `demos/_instructor/` (hub + cosmic-playground + capstone).
- Missing instructor packs for:
  - `blackbody-radiation`, `em-spectrum`, `parallax-distance`, `telescope-resolution`.

**What is requested**
- “Make all the instructor facing docs and design activities, capstones, etc.” for the full demos suite.

**What is unknown / VERIFY**
- Which weeks/modules you want each new activity/capstone to map to (we can draft without committing to schedule placement).
- Whether the capstones should live under `demos/_instructor/<suite>/` (current pattern) or under `activities/` (course-wide activity registry).

---

## Phase B — Assumption Audit

- **Assumption (explicit):** Instructor pages should be navigable via the instructor hub and cross-links, but not exposed to students through nav/search.
- **Assumption (inferred):** “Complete (roughly)” means each demo has the 5 required instructor resources from `docs/contracts/demo-pedagogy-contract.md`:
  - `index.qmd`, `model.qmd`, `activities.qmd`, `assessment.qmd`, `backlog.qmd`.
- **Assumption (inferred):** It is acceptable to draft content using demo `README.md` + code comments as sources of truth, and mark anything not verifiable as `VERIFY` / `[TBD]`.

If any assumption is wrong, stop before writing lots of content.

---

## Phase C — Exploration (approaches; no code)

### Approach 1: Full “demo pack” coverage + 2 suite capstones (recommended)
- Preserves invariants; matches demo pedagogy contract; yields “ready-to-teach” materials.
- Risk: lots of writing; needs tight templates to avoid drift.

### Approach 2: Minimal skeletons for missing 4 demos
- Lowest risk/effort now; still unblocks navigation + incremental filling.
- Risk: instructor experience still “not done” if activities/assessments remain placeholders.

Choose Approach 1, executed incrementally with small commits per demo.

---

## Implementation Tasks (bite-sized, verification-first)

### P0 (Blocking): Ensure instructor-only content remains undiscoverable

#### Task 1: Re-verify “no search leakage” baseline

**Files:**
- Verify: `demos/_instructor/**/*.qmd`

**Step 1: Verify render + search index**

Run:
```bash
conda run -n astro make render
rg -n "demos/_instructor" _site/search.json || true
```

Expected:
- `make render` exits 0
- grep returns **no matches**

**Step 2: Rollback**
- N/A (verification only)

#### Task 2: Make `activities/_instructor/index.qmd` instructor-safe in search (recommended)

**Why**
- Even if it’s not in nav, it can show up in site search (students can discover via search box).

**Files:**
- Modify: `activities/_instructor/index.qmd`

**Step 1: Write a failing “check” (manual)**

Run:
```bash
conda run -n astro make render
rg -n "activities/_instructor" _site/search.json || true
```

Expected (current): likely **has matches** (VERIFY).

**Step 2: Minimal change**
- Add `search: false` to the YAML front matter of `activities/_instructor/index.qmd`.

**Step 3: Verify**
```bash
conda run -n astro make render
rg -n "activities/_instructor" _site/search.json || true
```

Expected:
- No matches for `activities/_instructor`.

**Step 4: Commit**
```bash
git add activities/_instructor/index.qmd
git commit -m "docs(instructor): hide activities instructor index from search"
```

**Rollback**
```bash
git restore activities/_instructor/index.qmd
```

---

### P0 (Blocking): Add missing instructor demo packs (skeleton + wired into build)

#### Task 3: Inventory missing instructor packs + required code paths

**Files:**
- Read: `demos/em-spectrum/README.md`, `demos/em-spectrum/em-spectrum.js`
- Read: `demos/parallax-distance/README.md`, `demos/parallax-distance/parallax.js`
- Read: `demos/blackbody-radiation/README.md`, `demos/blackbody-radiation/blackbody.js`
- Read: `demos/telescope-resolution/README.md`, `demos/telescope-resolution/resolution.js`

**Step 1: Verify which instructor folders exist**
```bash
find demos/_instructor -maxdepth 1 -type d -print | sort
```

Expected:
- Missing: `blackbody-radiation`, `em-spectrum`, `parallax-distance`, `telescope-resolution`.

**Step 2: Rollback**
- N/A

#### Task 4: Create instructor pack skeleton for `em-spectrum`

**Files:**
- Create: `demos/_instructor/em-spectrum/index.qmd`
- Create: `demos/_instructor/em-spectrum/model.qmd`
- Create: `demos/_instructor/em-spectrum/activities.qmd`
- Create: `demos/_instructor/em-spectrum/assessment.qmd`
- Create: `demos/_instructor/em-spectrum/backlog.qmd`

**Step 1: “Failing test” (file missing)**
```bash
test -f demos/_instructor/em-spectrum/index.qmd && echo "unexpected: exists" || echo "OK: missing"
```

Expected: `OK: missing`

**Step 2: Minimal scaffold**
- Copy the structure used in `demos/_instructor/seasons/`:
  - front matter: `page-layout: article`, `toc: true`, `search: false`
  - `::: {.callout-note title="Navigation"}` with:
    - Instructor hub: `/demos/_instructor/`
    - Student demo: `/demos/em-spectrum/`
    - Siblings: `model.qmd · activities.qmd · assessment.qmd · backlog.qmd`
  - `index.qmd` includes a `callout-roadmap` with code pointers:
    - Main: `demos/em-spectrum/em-spectrum.js`
    - Model: `demos/_assets/em-spectrum-model.js`
    - Data: `demos/em-spectrum/object-data.js`, `demos/em-spectrum/telescope-data.js`
  - Leave content bodies as `[TBD]` but include section headers matching contract:
    - Why this demo exists
    - Learning goals (101 + optional 201)
    - 10–15 minute live-teach script
    - Misconceptions + “prediction before observation” prompts

**Step 3: Verify render includes the new page**
> NOTE: this won’t render until `_quarto.yml` includes it (Task 8).

**Step 4: Commit (after Tasks 8–9 wire it into render + hub)**
- Defer commit until the pages are in the render list and hub links exist.

**Rollback**
```bash
git restore demos/_instructor/em-spectrum || true
rm -rf demos/_instructor/em-spectrum
```

#### Task 5: Repeat skeleton packs for `parallax-distance`, `blackbody-radiation`, `telescope-resolution`

**Files:**
- Create: `demos/_instructor/parallax-distance/*.{qmd}`
- Create: `demos/_instructor/blackbody-radiation/*.{qmd}`
- Create: `demos/_instructor/telescope-resolution/*.{qmd}`

**Step 1: Minimal scaffold requirements (same as Task 4)**
- Use the same nav callout pattern.
- Code pointers (VERIFY against actual files):
  - Parallax main: `demos/parallax-distance/parallax.js`
  - Parallax model: `demos/_assets/parallax-distance-model.js`
  - Blackbody main: `demos/blackbody-radiation/blackbody.js`
  - Blackbody model: `demos/_assets/blackbody-model.js`
  - Telescope main: `demos/telescope-resolution/resolution.js`
  - Telescope model: `demos/_assets/telescope-resolution-model.js`

**Step 2: Commit (after Tasks 8–9)**
- Same defer: commit once the site builds them and hub links point to them.

---

### P0 (Blocking): Wire new instructor pages into build + hub

#### Task 6: Add new demo cards to the instructor hub

**Files:**
- Modify: `demos/_instructor/index.qmd`

**Step 1: “Failing test” (hub missing the new links)**
```bash
rg -n "em-spectrum|parallax-distance|blackbody-radiation|telescope-resolution" demos/_instructor/index.qmd || true
```

Expected: missing or incomplete matches (VERIFY).

**Step 2: Minimal change**
- Add a new section (or extend existing) with cards for the 4 missing demos:
  - Student demo link: `/demos/<demo>/`
  - Instructor guide link: `/demos/_instructor/<demo>/`
  - Subpage links (relative): `model.qmd`, `activities.qmd`, `assessment.qmd`, `backlog.qmd`

**Step 3: Verify**
```bash
conda run -n astro make render
rg -n "em-spectrum|parallax-distance|blackbody-radiation|telescope-resolution" _site/demos/_instructor/index.html
```

Expected:
- Matches in built HTML.

**Step 4: Defer commit until Task 9 completes**

**Rollback**
```bash
git restore demos/_instructor/index.qmd
```

#### Task 7: Ensure instructor pages are rendered by Quarto (update render list)

**Why**
- `_quarto.yml` uses an explicit `project.render` list; new pages must be added or they won’t build.

**Files:**
- Modify: `_quarto.yml`

**Step 1: “Failing test” (built HTML missing)**
```bash
conda run -n astro make render
test -f _site/demos/_instructor/em-spectrum/index.html || echo "OK: not built yet"
```

**Step 2: Minimal change**
- Add these paths to `project.render` in `_quarto.yml`:
  - `demos/_instructor/em-spectrum/index.qmd`
  - `demos/_instructor/em-spectrum/model.qmd`
  - `demos/_instructor/em-spectrum/activities.qmd`
  - `demos/_instructor/em-spectrum/assessment.qmd`
  - `demos/_instructor/em-spectrum/backlog.qmd`
  - Repeat for `parallax-distance`, `blackbody-radiation`, `telescope-resolution`.

**Step 3: Verify**
```bash
conda run -n astro make render
test -f _site/demos/_instructor/em-spectrum/index.html
test -f _site/demos/_instructor/parallax-distance/index.html
test -f _site/demos/_instructor/blackbody-radiation/index.html
test -f _site/demos/_instructor/telescope-resolution/index.html
rg -n "demos/_instructor" _site/search.json || true
```

Expected:
- All 4 files exist
- No search leakage

**Step 4: Commit (first “MVP completeness” commit for new packs)**
```bash
git add _quarto.yml demos/_instructor/index.qmd demos/_instructor/em-spectrum demos/_instructor/parallax-distance demos/_instructor/blackbody-radiation demos/_instructor/telescope-resolution
git commit -m "docs(instructor): scaffold remaining demo packs and link from hub"
```

**Rollback**
```bash
git restore _quarto.yml demos/_instructor/index.qmd
git restore demos/_instructor/em-spectrum demos/_instructor/parallax-distance demos/_instructor/blackbody-radiation demos/_instructor/telescope-resolution
```

---

### P1: Fill instructor guides (teach-first) for the 4 new demos

> Use `docs/contracts/demo-pedagogy-contract.md` and `docs/contracts/astr101-pedagogical-contract.md` as the writing checklist.

#### Task 8: Write `demos/_instructor/em-spectrum/index.qmd` content (no placeholders)

**Files:**
- Modify: `demos/_instructor/em-spectrum/index.qmd`
- Read for truth: `demos/em-spectrum/README.md`, `demos/em-spectrum/em-spectrum.js`, `demos/_assets/em-spectrum-model.js`

**Step 1: “Failing test” (placeholder detection)**
```bash
rg -n "\\[TBD\\]|VERIFY" demos/_instructor/em-spectrum/index.qmd
```

Expected: matches exist initially.

**Step 2: Minimal content completion (teach-first)**
- Replace placeholders by rewriting with:
  - A one-paragraph “Why this matters” anchored to observable→model→inference.
  - A 10–15 minute script that forces prediction before observation:
    - wavelength ↔ frequency ↔ photon energy
    - “Which band sees cold dust?” etc (based on README truth)
  - A misconception set + how the demo confronts each one.

**Step 3: Verify**
```bash
conda run -n astro make render
rg -n "\\[TBD\\]|VERIFY" demos/_instructor/em-spectrum/index.qmd || true
```

Expected:
- Render success
- No remaining placeholders in this file (or only `VERIFY` items with explicit verification steps).

**Step 4: Commit**
```bash
git add demos/_instructor/em-spectrum/index.qmd
git commit -m "docs(instructor): draft EM spectrum instructor guide"
```

**Rollback**
```bash
git restore demos/_instructor/em-spectrum/index.qmd
```

#### Task 9: Repeat “guide completion” for the other 3 demos

**Files:**
- Modify: `demos/_instructor/parallax-distance/index.qmd` (source truth: demo README + model)
- Modify: `demos/_instructor/blackbody-radiation/index.qmd`
- Modify: `demos/_instructor/telescope-resolution/index.qmd`

**Verification (each)**
```bash
conda run -n astro make render
```

Commit each demo separately:
```bash
git add demos/_instructor/<demo>/index.qmd
git commit -m "docs(instructor): draft <demo> instructor guide"
```

---

### P1: Fill model deep dives (math grammar + units discipline)

#### Task 10: Write `model.qmd` for each new demo using “math grammar rules”

**Files:**
- Modify: `demos/_instructor/em-spectrum/model.qmd`
- Modify: `demos/_instructor/parallax-distance/model.qmd`
- Modify: `demos/_instructor/blackbody-radiation/model.qmd`
- Modify: `demos/_instructor/telescope-resolution/model.qmd`

**Step 1: Add/verify a “Units” section**
- Explicitly state unit conventions used by the demo/model:
  - Many demos use CGS internally; instructor docs must say this plainly and map UI units to physics units.

**Step 2: Equation-as-language pattern**
- For each demo, include 2–4 key equations (each unpacked with meaning + units + assumptions + sanity checks), e.g.:
  - EM spectrum: `c = λν`, `E = hν = hc/λ`
  - Parallax: `d(pc) = 1/p(arcsec)` plus baseline geometry assumptions
  - Blackbody: Wien’s law + Stefan–Boltzmann (and optionally Planck function with a “don’t memorize” note)
  - Telescope: diffraction limit `θ = 1.22 λ/D` and seeing-limited effective resolution

**Step 3: Verification**
```bash
conda run -n astro make render
```

**Step 4: Commit (per demo)**
```bash
git add demos/_instructor/<demo>/model.qmd
git commit -m "docs(instructor): add <demo> model deep dive"
```

---

### P1: Design activities + capstones (demo-driven, contract format)

#### Task 11: Author Activities pages for the 4 new demos (MVP set)

**Files:**
- Modify: `demos/_instructor/<demo>/activities.qmd`

**Minimum content per `docs/contracts/demo-pedagogy-contract.md`:**
- MW Quick (3–5 min) with prediction prompt
- MW Short (8–12 min) guided exploration
- Friday Lab (20–30+ min) “claim–evidence” protocol
- Station (6–8 min) rotation version with artifact

**Verification**
```bash
conda run -n astro make render
```

**Commit (per demo)**
```bash
git add demos/_instructor/<demo>/activities.qmd
git commit -m "docs(instructor): add <demo> activity protocols"
```

#### Task 12: Author Assessment banks for the 4 new demos (MVP set)

**Files:**
- Modify: `demos/_instructor/<demo>/assessment.qmd`

**Minimum content**
- 6 clickers with:
  - explicit demo setup
  - distractors tied to misconceptions
  - follow-up explanation
- 4 short-answer prompts
- 1 exit-ticket set (3 questions)

**Verification**
```bash
conda run -n astro make render
```

**Commit (per demo)**
```bash
git add demos/_instructor/<demo>/assessment.qmd
git commit -m "docs(instructor): add <demo> assessment bank"
```

---

### P2: Suite-level capstones (cross-demo synthesis)

#### Task 13: “Light & Telescopes” suite page + capstone

**What**
- Create an instructor suite page that ties together:
  - `em-spectrum`, `blackbody-radiation`, `telescope-resolution`
- Provide one capstone activity that forces Observable→Model→Inference across all three.

**Files:**
- Create: `demos/_instructor/light-and-telescopes/index.qmd`
- Create: `demos/_instructor/light-and-telescopes/capstone.qmd`
- Modify: `_quarto.yml` (add both to render list)
- Modify: `demos/_instructor/index.qmd` (add suite card/section)

**Verification**
```bash
conda run -n astro make render
test -f _site/demos/_instructor/light-and-telescopes/index.html
rg -n "demos/_instructor" _site/search.json || true
```

**Commit**
```bash
git add demos/_instructor/light-and-telescopes _quarto.yml demos/_instructor/index.qmd
git commit -m "docs(instructor): add Light & Telescopes suite and capstone"
```

#### Task 14: “Distance & Measurement” suite page + capstone

**What**
- Create a suite page that ties together:
  - `parallax-distance` plus (optionally) the existing `activities/cosmic-distance-builder.qmd` as a companion
- Provide a capstone that makes students:
  - translate between parallax, parsecs, and light-years
  - reason about measurability limits (tie to telescope resolution if desired, but keep it optional)

**Files:**
- Create: `demos/_instructor/distance-and-measurement/index.qmd`
- Create: `demos/_instructor/distance-and-measurement/capstone.qmd`
- Modify: `_quarto.yml` (add both)
- Modify: `demos/_instructor/index.qmd` (add suite card/section)

**Verification**
```bash
conda run -n astro make render
test -f _site/demos/_instructor/distance-and-measurement/index.html
rg -n "demos/_instructor" _site/search.json || true
```

**Commit**
```bash
git add demos/_instructor/distance-and-measurement _quarto.yml demos/_instructor/index.qmd
git commit -m "docs(instructor): add Distance & Measurement suite and capstone"
```

---

### P3: Backlogs + consistency polishing (low risk)

#### Task 15: Ensure every demo pack has a meaningful backlog (no placeholders)

**Files:**
- Modify: `demos/_instructor/*/backlog.qmd`

**Rules**
- Backlog items must be:
  - concise
  - prioritized (P0/P1/P2)
  - linked to evidence where possible (e.g., “see demo README”, “see audit note”, “see plan doc”)
- Do not propose refactors already being handled by Claude; link to the relevant existing plan doc instead (example: `docs/plans/2026-01-29-em-spectrum-parallax-demo-refactor.md`).

**Verification**
```bash
conda run -n astro make render
```

**Commit**
```bash
git add demos/_instructor/*/backlog.qmd
git commit -m "docs(instructor): expand demo backlogs and priorities"
```

---

## Acceptance Gates (whole batch)

- `conda run -n astro make render`
- `rg -n "demos/_instructor" _site/search.json || true` (expect no hits)
- Manual navigation check:
  - open `_site/demos/_instructor/index.html` and click through:
    - each of the 4 newly added demos
    - 1 suite capstone page

---

## Rollback Strategy

- Revert instructor materials only:
```bash
git restore demos/_instructor _quarto.yml activities/_instructor/index.qmd
conda run -n astro make render
```

---

## Execution Handoff

Plan saved to `docs/plans/2026-01-29-demos-instructor-materials-completion.md`.

If you want me to execute it task-by-task, tell me to switch to `superpowers:executing-plans` and confirm whether you want both suite capstones (P2) included now or deferred.

