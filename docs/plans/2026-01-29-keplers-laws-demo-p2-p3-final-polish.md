# Kepler’s Laws Demo (ASTR 201) — P2/P3 Final Polish Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Finish P2/P3 backlog items for `demos/keplers-laws/` so it’s *maximally* robust for ASTR 201 teaching: clearer model assumptions, better “guided exploration” support, and stronger automated verification without changing the core physics model.

**Architecture:** Keep DOM/SVG wiring in `demos/keplers-laws/keplers-laws.js`. Keep pure orbital/units math in `demos/_assets/keplers-laws-model.js` and cover it with `node:test`. UI-only “help/pedagogy” elements live in `demos/keplers-laws/index.html` and are validated via HTML smoke tests.

**Tech Stack:** Vanilla JS + SVG + KaTeX, Node built-in tests (`node --test`), repo demo checks (`conda run -n astro python scripts/*`), Quarto site build (`conda run -n astro make render`).

---

## Pre-flight (verify current baseline)

Run from repo root:

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.

---

## Task 1 (P1): Add an explicit “Model note” box in the student demo UI

**Files:**
- Modify: `demos/keplers-laws/index.html`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Add a failing smoke test**

In `tests/demo-html-smoke.test.js`, add:

```js
test("Kepler's Laws includes a model note", () => {
  const html = read('demos/keplers-laws/index.html');
  assert.match(html, /Model note/i);
});
```

**Step 2: Run the test to confirm it fails**

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: FAIL (no “Model note” yet).

**Step 3: Implement the model note (minimal, readable, non-scary)**

In `demos/keplers-laws/index.html`, add a small, collapsible block near the insight box (or just below the mode toggle):
- Title text contains **“Model note”**.
- Content states the key assumptions in one short paragraph:
  - planar orbit (2D)
  - 2-body / no perturbations
  - planet mass negligible (in Newton mode)
  - animation time is a teaching scale (not real time)

Prefer a native `<details><summary>…</summary>…</details>` for accessibility.

**Step 4: Re-run the smoke test**

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/keplers-laws/index.html tests/demo-html-smoke.test.js
git commit -m "docs(keplers-laws): add student-facing model note"
```

---

## Task 2 (P3): Tighten README “units + model” language (no new features)

**Files:**
- Modify: `demos/keplers-laws/README.md`

**Step 1: Edit README with a short, explicit note**

Add a brief section that clarifies:
- Kepler mode uses **AU + years + solar masses** scaling (and the general mass dependence)
- Newton mode readouts are computed in physical units then displayed as:
  - 101: `km/s`, `m/s²`
  - 201: `cm/s`, `cm/s²`
- The demo is a teaching model (not an ephemeris)

**Step 2: Commit**

```bash
git add demos/keplers-laws/README.md
git commit -m "docs(keplers-laws): clarify units and model assumptions"
```

---

## Task 3 (P2): Add an on-screen “Keyboard shortcuts” help panel

**Files:**
- Modify: `demos/keplers-laws/index.html`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Add a failing smoke test**

In `tests/demo-html-smoke.test.js`, add:

```js
test("Kepler's Laws includes keyboard shortcuts help", () => {
  const html = read('demos/keplers-laws/index.html');
  assert.match(html, /Keyboard shortcuts/i);
});
```

**Step 2: Run the test to confirm it fails**

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: FAIL.

**Step 3: Implement help panel (HTML-only)**

In `demos/keplers-laws/index.html`, add a `<details>` block with summary **“Keyboard shortcuts”** and a short list (match what the demo actually supports):
- `Space`: Play/Pause
- `Home` / `End`: Perihelion / Aphelion
- `←` / `→` (and Shift for fine control)
- `K` / `N`: Mode switch
- `1–6`: Presets

**Step 4: Re-run the smoke test**

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/keplers-laws/index.html tests/demo-html-smoke.test.js
git commit -m "feat(keplers-laws): add on-screen keyboard shortcuts help"
```

---

## Task 4 (P3): Move Newton “core physics” helpers into the shared model module + expand unit tests

**Files:**
- Modify: `demos/_assets/keplers-laws-model.js`
- Modify: `demos/keplers-laws/keplers-laws.js`
- Test: `tests/keplers-laws-model.test.js`

**Step 1: Write failing tests for scaling laws (robust, not constant-sensitive)**

In `tests/keplers-laws-model.test.js`, add tests for:
- `orbitalPeriodYears({aAu, massSolar})` scales as `a^(3/2)/sqrt(M)`
- `orbitalVelocityKms({aAu, rAu, massSolar})` scales as `sqrt(M)` for fixed geometry
- `gravitationalAccelMs2({rAu, massSolar})` scales as `M/r^2`

Example (keep tolerances loose but meaningful):

```js
test('orbitalPeriodYears scales as a^(3/2)/sqrt(M)', () => {
  const P1 = Model.orbitalPeriodYears({ aAu: 1, massSolar: 1 });
  const P8 = Model.orbitalPeriodYears({ aAu: 8, massSolar: 1 });
  assert.ok(Math.abs(P8 / P1 - Math.pow(8, 1.5)) < 1e-12);

  const Pm4 = Model.orbitalPeriodYears({ aAu: 1, massSolar: 4 });
  assert.ok(Math.abs(Pm4 / P1 - 0.5) < 1e-12);
});
```

**Step 2: Run tests to confirm they fail**

Run:

```bash
node --test tests/keplers-laws-model.test.js
```

Expected: FAIL (new functions missing).

**Step 3: Implement the new pure helpers in `keplers-laws-model.js`**

Add exports:
- `orbitalPeriodYears({ aAu, massSolar })`
- `orbitalVelocityKms({ aAu, rAu, massSolar })`
- `gravitationalAccelMs2({ rAu, massSolar })`

Use the same approximations already in the demo (keep behavior consistent; do not “silently change constants”).

**Step 4: Wire demo to use model helpers (no behavioral change expected)**

In `demos/keplers-laws/keplers-laws.js`:
- Replace internal `orbitalVelocity`, `orbitalPeriod`, `gravitationalAccel` bodies to call the model helpers (or delete the local helpers if safe).
- Ensure readouts and timeline still match.

**Step 5: Re-run unit tests**

Run:

```bash
node --test tests/keplers-laws-model.test.js
```

Expected: PASS.

**Step 6: Commit**

```bash
git add demos/_assets/keplers-laws-model.js demos/keplers-laws/keplers-laws.js tests/keplers-laws-model.test.js
git commit -m "refactor(keplers-laws): centralize Newton helpers in shared model module"
```

---

## Task 5 (P2): Add a “Guided checkpoints” mode (prediction prompts + pause)

**Definition of done:** A *toggleable* guided mode that pauses the animation and shows short prompts at key moments, without blocking normal free exploration when off.

**Files:**
- Modify: `demos/keplers-laws/index.html`
- Modify: `demos/keplers-laws/keplers-laws.js`
- Test: `tests/demo-html-smoke.test.js`

**Step 1: Add failing smoke test for guided UI elements**

In `tests/demo-html-smoke.test.js`, add:

```js
test("Kepler's Laws includes guided checkpoints UI", () => {
  const html = read('demos/keplers-laws/index.html');
  assert.match(html, /Guided checkpoints/i);
});
```

**Step 2: Implement minimal UI**

In `demos/keplers-laws/index.html`:
- Add a checkbox toggle labeled **“Guided checkpoints”**.
- Add a hidden modal/overlay container with:
  - title
  - prompt text
  - “Continue” button
  - “Turn off guided mode” link/button (optional)

**Step 3: Implement guided logic (JS)**

In `demos/keplers-laws/keplers-laws.js`:
- Add `state.guided = false` and a `completedCheckpoints` set.
- When guided mode is on:
  - When student first enables “Equal Areas”, pause and prompt: “Predict: where is the planet fastest? Explain.”
  - When student switches to Newton mode, pause and prompt: “Predict: which way does the force vector point? Why?”
  - When student changes star mass, pause and prompt: “Predict: does the period increase or decrease? By what scaling?”
- Implementation constraint: prompts must be short and *in the student’s language*, not derivations.
- Ensure guided mode never traps the student (always a clear way to continue / disable).

**Step 4: Re-run smoke tests**

Run:

```bash
node --test tests/demo-html-smoke.test.js
```

Expected: PASS.

**Step 5: Commit**

```bash
git add demos/keplers-laws/index.html demos/keplers-laws/keplers-laws.js tests/demo-html-smoke.test.js
git commit -m "feat(keplers-laws): add guided checkpoints mode"
```

---

## Task 6: Update instructor backlog statuses

**Files:**
- Modify: `demos/_instructor/keplers-laws/backlog.qmd`

**Step 1: Mark completed items as DONE with date**

Update the relevant backlog rows (P1 model note, P2 keyboard help, P2 guided checkpoints, P3 model-module consolidation) to `DONE (2026-01-29)` with pointers to the file entrypoints.

**Step 2: Commit**

```bash
git add demos/_instructor/keplers-laws/backlog.qmd
git commit -m "docs(keplers-laws): update backlog statuses"
```

---

## Final verification (must be green)

```bash
node --test
conda run -n astro python scripts/check_demo_polish.py
conda run -n astro python scripts/demo_static_checks.py
conda run -n astro make render
```

Expected: all commands exit `0`.

---

## Execution handoff

Plan complete and saved to `docs/plans/2026-01-29-keplers-laws-demo-p2-p3-final-polish.md`.

Two execution options:
1. **This session:** use `superpowers:executing-plans` and implement task-by-task with checkpoints.
2. **Parallel session:** open a new session and run `superpowers:executing-plans` there.

Which approach do you want?

