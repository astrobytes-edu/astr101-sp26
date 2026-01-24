# Demo Visual Polish Finish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Finish the “Cosmic Nebula” visual polish across all 9 demos by removing per-demo CSS overrides, refactoring shared layout into shared assets, wiring micro-interactions, and fixing correctness issues so the demo suite is consistent, maintainable, accessible, and scientifically accurate.

**Architecture:** Keep `demos/_assets/astro-theme.css` as the canonical design-token + component library. Add a shared “demo shell” stylesheet for layout and a shared “polish” script for behavior (ripple, slider progress/tooltip, reduced-motion respect). Migrate demos incrementally in small batches, using a repo-local checker script + a manifest to prevent “CLAUDE LIES” drift (docs claiming polish is complete when demos are still overriding it).

**Tech Stack:** Static HTML + CSS custom properties + vanilla JS + Canvas/SVG; Quarto website includes `demos/**` as resources.

**Plan References:**
- Design spec: `docs/plans/2026-01-22-demo-visual-polish-design.md`
- Original implementation plan: `docs/plans/2026-01-22-demo-visual-polish-implementation.md`

---

## Preconditions (Branch Hygiene)

### Task 0: Isolate demo work from unrelated changes

**Why:** The repo currently contains non-demo edits in the working tree; demo polish must be a clean, reviewable slice.

**Files:**
- Modify: none (git operations only)

**Step 1: Inspect current state**

Run: `git status -sb`

Expected: You’ll see any unrelated modified files (e.g., readings/solutions) and whether `main` is ahead/dirty.

**Step 2: Create a dedicated branch/worktree**

Preferred (worktree): create a new worktree for demo work, then work there.

Alternative (branch only):
```bash
git checkout -b demos/cosmic-nebula-finish
```

**Step 3: Move unrelated changes out of the demo branch**

Option A (stash):
```bash
git stash push -m "wip: non-demo edits"
```

Option B (separate branch): commit them elsewhere first, then return.

**Step 4: Confirm only demo files are changing**

Run: `git status --porcelain=v1`

Expected: either clean, or only `demos/**` changes after you begin.

---

## Phase A: Add Guardrails (Stop “lies” + enable incremental migration)

### Task 1: Add a demo polish manifest + checker (failing first)

**Goal:** A simple CI-like local gate: “These demos are fully migrated; they must not contain legacy inline overrides and must include shared assets.”

**Files:**
- Create: `demos/polish-manifest.json`
- Create: `scripts/check_demo_polish.py`

**Step 1: Create an initial manifest (empty list)**

Create `demos/polish-manifest.json`:
```json
{
  "polished": []
}
```

**Step 2: Write the checker script**

Create `scripts/check_demo_polish.py` that:
- Loads `demos/polish-manifest.json`
- For each demo in `polished`:
  - Asserts `demos/<demo>/index.html` exists
  - Asserts it links these assets:
    - `../_assets/astro-theme.css`
    - `../_assets/demo-shell.css`
    - `../_assets/demo-legacy.css`
    - `../_assets/astro-utils.js`
    - `../_assets/demo-polish.js`
    - `../_assets/starfield.js`
  - Fails if the HTML contains forbidden inline CSS patterns (these defeat the shared theme):
    - `".preset-btn {"`
    - `".readout-label {"`
    - `".readout-value {"`
    - hard-coded “too small” font sizes like `font-size: 0.7rem` / `0.75rem` in those selectors

Also include a `--all` mode later (optional) to report status across all demos without failing.

**Step 3: Run the checker (should pass with empty manifest)**

Run: `python scripts/check_demo_polish.py`

Expected: PASS and prints `0 polished demos checked`.

**Step 4: Commit**

```bash
git add demos/polish-manifest.json scripts/check_demo_polish.py
git commit -m "chore(demos): add polish manifest and checker"
```

---

## Phase B: Fix Correctness Bug (Starfield scaling)

### Task 2: Fix `starfield.js` resize scaling (prevent transform accumulation + correct coordinate system)

**Problem:** `demos/_assets/starfield.js` currently calls `ctx.scale(dpr, dpr)` on every resize without resetting transforms; this can accumulate on repeated resizes and can also mix CSS pixels vs device pixels in star placement.

**Files:**
- Modify: `demos/_assets/starfield.js`

**Step 1: Write a small manual repro checklist (no code yet)**

Open any demo, resize the window repeatedly (or rotate a tablet) and watch for:
- stars growing/shrinking incorrectly
- star positions drifting
- stars becoming blurry

Record expected behavior: stable density/appearance regardless of resizes.

**Step 2: Implement the fix**

In `createStarfield(...).resize()`:
- compute `rect = canvas.getBoundingClientRect()`
- set canvas pixel dimensions: `canvas.width = Math.round(rect.width * dpr)`, `canvas.height = Math.round(rect.height * dpr)`
- reset transform: `ctx.setTransform(dpr, 0, 0, dpr, 0, 0)` (or `ctx.setTransform(1,0,0,1,0,0)` then `ctx.scale(dpr,dpr)` exactly once)
- store logical drawing bounds in CSS pixels (e.g., `logicalWidth = rect.width`, `logicalHeight = rect.height`)
- update `initStars()` and `render()` to use logical bounds (CSS pixels), not `canvas.width/height`

This ensures star coordinates are in the same coordinate system as drawing commands.

**Step 3: Verify manually**

Reload a demo, resize the window ~10 times.

Expected: stable starfield, no compounding scale.

**Step 4: Commit**

```bash
git add demos/_assets/starfield.js
git commit -m "fix(demos): correct starfield canvas scaling on resize"
```

---

## Phase C: Finish Missing Shared Utilities (from the original plan)

### Task 3: Implement slider tooltip utility in `astro-utils.js`

**Problem:** `docs/plans/2026-01-22-demo-visual-polish-implementation.md` includes a slider tooltip task, but `demos/_assets/astro-utils.js` does not currently export `addSliderTooltip`.

**Files:**
- Modify: `demos/_assets/astro-utils.js`

**Step 1: Add `addSliderTooltip(slider, formatter, options)`**

Implement a tooltip that appears on drag/interaction:
- Create a positioned tooltip element in the slider’s parent container
- Update position on `input` events using percent along the track
- Show on pointer down / touchstart; hide on pointer up / touchend
- Respect reduced motion: if `prefers-reduced-motion: reduce`, disable transitions

**Step 2: Export it**

Add to `window.AstroUtils = { ... }` export block:
```js
addSliderTooltip,
```

**Step 3: Quick smoke check**

Temporarily add a 5-line usage snippet in one demo (or in devtools) to confirm tooltip appears and moves.

**Step 4: Commit**

```bash
git add demos/_assets/astro-utils.js
git commit -m "feat(demos): add slider tooltip micro-interaction utility"
```

---

## Phase D: Shared Shell + Legacy Bridging (reduce per-demo duplication)

### Task 4: Create shared demo shell CSS

**Files:**
- Create: `demos/_assets/demo-shell.css`

**Step 1: Build the shared layout styles**

Extract the repeated patterns from demo inline `<style>` blocks into `demo-shell.css`, e.g.:
- full-height page baseline
- `.demo-wrapper`, `#starfield` fixed background canvas
- `.demo-content` container sizing + padding
- `.demo-header`, `.demo-title`, `.demo-subtitle`
- `.viz-panel`, `.panel-title`
- `.controls-grid`, `.control-card`, `.control-title`, `.control-value`
- common responsive breakpoints

Use tokens from `astro-theme.css` (no hard-coded colors/sizes).

**Step 2: Commit**

```bash
git add demos/_assets/demo-shell.css
git commit -m "style(demos): add shared demo shell layout stylesheet"
```

### Task 5: Create shared legacy-bridge CSS (apply Cosmic Nebula to existing class names)

**Goal:** Preserve class names while removing inline overrides. This is the fastest, lowest-risk path to consistency.

**Files:**
- Create: `demos/_assets/demo-legacy.css`

**Step 1: Map legacy button classes to `.astro-btn` styling**

Add rules so these behave like Cosmic Nebula buttons without changing JS:
- `.mode-btn`, `.anim-btn`, `.sim-btn`, `.phase-btn`, `.unit-btn`
- `.mode-toggle` / button groups
- focus-visible styling

**Step 2: Map readout classes to value-card styling**

Add rules for:
- `.readout-item`, `.readout-label`, `.readout-value`, `.readout-unit`

Target: the design spec minimum sizes (labels ~14px, primary values ~20–24px, titles 24–28px), using `var(--font-size-*)`.

**Step 3: Commit**

```bash
git add demos/_assets/demo-legacy.css
git commit -m "style(demos): add legacy class bridge to Cosmic Nebula components"
```

---

## Phase E: Shared Behavior Wiring (micro-interactions everywhere)

### Task 6: Add global demo polish script

**Files:**
- Create: `demos/_assets/demo-polish.js`

**Step 1: Implement `demo-polish.js`**

On `DOMContentLoaded`:
- Add ripple effects:
  - Select buttons by classes: `.astro-btn, .preset-btn, .mode-btn, .anim-btn, .sim-btn, .phase-btn, .unit-btn`
  - Call `AstroUtils.addRippleEffect(btn)` once per element (use `data-ripple-init` guard)
- Ensure slider progress fill:
  - For each `.astro-slider`, call `AstroUtils.updateSliderProgress(slider)`
  - Add an `input` listener to keep fill updated
- Add slider tooltips:
  - For each `.astro-slider`, call `AstroUtils.addSliderTooltip(slider, formatter)`
  - Default formatter: show `slider.value` (per-demo refinements can opt-out via `data-tooltip="off"`)
- Respect reduced motion:
  - If `prefers-reduced-motion: reduce`, disable ripple and tooltip animations (but keep functional updates)

**Step 2: Commit**

```bash
git add demos/_assets/demo-polish.js
git commit -m "feat(demos): add shared polish script for ripple + slider interactions"
```

---

## Phase F: Demo-by-Demo Migration (2–3 demos per checkpoint)

### Migration rule (apply to every demo)

For each `demos/<demo>/index.html`:
1. Add stylesheet links after `astro-theme.css`:
   - `../_assets/demo-shell.css`
   - `../_assets/demo-legacy.css`
2. Add `demo-polish.js` after `astro-utils.js`
3. Remove inline CSS overrides that conflict with shared theme:
   - `.preset-btn { ... }`
   - `.readout-* { ... }`
   - button class styling that duplicates what `demo-legacy.css` now provides
4. Optional best practice (preferred): extract remaining demo-specific CSS into `demos/<demo>/<demo>.css` and replace `<style>` with a `<link>`.
5. Update `demos/polish-manifest.json` to include the demo once it’s clean.
6. Run: `python scripts/check_demo_polish.py` (must pass for all demos in manifest).

### Batch 1 (Checkpoint): Angular Size + Kepler’s Laws + Blackbody Radiation

**Files:**
- Modify: `demos/angular-size/index.html`
- Create: `demos/angular-size/angular-size.css` (if extracting)
- Modify: `demos/keplers-laws/index.html`
- Create: `demos/keplers-laws/keplers-laws.css`
- Modify: `demos/blackbody-radiation/index.html`
- Create: `demos/blackbody-radiation/blackbody-radiation.css`
- Modify: `demos/polish-manifest.json`

**Verification checklist (scientific + UX):**
- Angular size: moving “distance” slider changes angular size in the correct direction; presets still work.
- Kepler’s laws: orbit still animates; mode toggle works; no UI regressions.
- Blackbody: spectrum redraws; mode toggle works; KaTeX renders; controls remain usable.

**Commit per demo (small, reviewable):**
- `style(demos/angular-size): migrate to shared shell + nebula components`
- `style(demos/keplers-laws): migrate to shared shell + nebula components`
- `style(demos/blackbody): migrate to shared shell + nebula components`

### Batch 2 (Checkpoint): Parallax Distance + Telescope Resolution + EM Spectrum

**Files:**
- Modify/Create equivalents for each demo
- Update `demos/polish-manifest.json`

**Verification checklist:**
- Parallax: animation controls still work; presets render correctly.
- Telescope resolution: “resolved/unresolved” statuses still update.
- EM spectrum: interactions remain responsive; labels readable.

### Batch 3 (Checkpoint): Seasons + Moon Phases + Eclipse Geometry

**Files:**
- Modify/Create equivalents for each demo
- Update `demos/polish-manifest.json`

**Verification checklist:**
- Seasons: planet presets and animations work; readouts visible.
- Moon phases: draggable moon still works; phase buttons still toggle.
- Eclipse geometry: dragging works; simulation log toggles; status color legible.

---

## Phase G: Fix the “Claude Lies” Documentation

### Task 7: Make the demos changelog truthful during migration

**Files:**
- Modify: `demos/CHANGELOG.md`

**Step 1: Add an explicit migration status section**

Option A (preferred): Add `[Unreleased]` at top with a checklist that tracks which demos are fully migrated (mirrors `demos/polish-manifest.json`).

Option B: If keeping `2.0.0` as-is, add a prominent note:
- “Shared assets implemented; per-demo migrations tracked in `demos/polish-manifest.json`.”

**Step 2: Commit**

```bash
git add demos/CHANGELOG.md
git commit -m "docs(demos): align changelog with actual migration status"
```

---

## Phase H: Final Verification + Release Posture

### Task 8: Full suite smoke + reduced-motion check

**Files:** none

**Step 1: Run checker**

Run: `python scripts/check_demo_polish.py`

Expected: PASS with all 9 demos listed as polished.

**Step 2: Manual smoke for each demo**

Open each `demos/<demo>/index.html` and verify:
- Typography readability (projection-friendly)
- Buttons/sliders consistent
- No broken layouts on narrow screens
- Reduced motion: enable OS “Reduce motion” and confirm UI is still usable and decorative effects are minimized

**Step 3: Commit any final fixes**

Small commits only (avoid bundling).

---

## Execution Handoff

Plan complete and saved to `docs/plans/2026-01-24-demo-visual-polish-finish.md`.

Two execution options:

1. **Subagent-Driven (this session)** — (not available in Codex CLI; I’ll execute task-by-task here with checkpoints instead).
2. **Parallel Session (separate)** — Open a new session/worktree and implement using `superpowers:executing-plans` with “Batch 1/2/3” checkpoints.

Which approach do you want?

