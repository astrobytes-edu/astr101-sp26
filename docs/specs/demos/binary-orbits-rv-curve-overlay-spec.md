# Binary Orbits — RV Curve Overlay + Spectral Inset (L10) — Spec

## One-sentence goal

Make the RV method feel real by synchronizing the binary-orbits animation with (1) a radial-velocity curve and (2) a shifting spectral line inset that visually produces that curve.

## Lecture alignment

- Primary: Lecture 10 (radial velocity method; $m\sin i$ idea)
- Bridge: Lecture 9 (spectral lines as measurable features)

## Teach-first → museum later

Implement and teach with it here first (fast iteration with the L10 reading and instructor script). After it’s stable, migrate into Cosmic Playground with the same Doppler logic and shared spectra dataset.

## Existing starting point

- Student demo: `demos/binary-orbits/`
- Shared physics model (tested): `demos/_assets/binary-orbits-model.js` + `tests/binary-orbits-physics.test.js`
- Backlog reference: `demos/_instructor/binary-orbits/backlog.qmd` (RV curve item)

## Learning goals (students can…)

1. Explain how an orbit produces a periodic RV signal.
2. Interpret RV amplitude and period qualitatively (bigger planet → bigger star wobble; closer orbit → shorter period).
3. Explain why inclination reduces RV amplitude by $\sin i$ (face-on → no RV signal).

## UX / structure (shared demo principles)

- Default view stays simple; RV overlay is opt-in.
- Single stage with compact readouts; avoid new side panels.

## Must-have interactions

- Period control (existing a/M controls are OK; do not introduce redundant controls unless needed).
- Inclination slider:
  - Range: 0° to 90°
  - RV amplitude scales as $\sin i$
- Mass ratio controls (existing star+planet vs binary mode already provides this).
- “Show barycenter” toggle (existing, if present; otherwise add).
- Toggle “Show RV curve” (collapsed by default).

## RV curve overlay requirements

- Plot $v_r(t)$ for the star (at minimum). Optionally show both bodies in binary-star mode.
- Show a moving marker synchronized to the orbit phase.
- Updating parameters (masses, separation, eccentricity, inclination) updates the curve in real time.

## Spectral line inset (the “magic” add-on)

### Purpose

Connect the orbit to the actual measurement: students see an absorption line shift back and forth over time, and that motion is what builds the RV curve.

### Requirements

- A small inset showing a single absorption line (choose one from the shared dataset; Na D or Hα are fine).
- The line shifts left/right using the current star’s instantaneous RV:
  - Use the same sign convention as the Doppler demo:
    - $\Delta\lambda = \lambda_{\text{obs}} - \lambda_0$
    - $v_r > 0$ (receding) → redshift → line moves to longer wavelength
- Highlight the same time/phase moment in:
  - the orbit view
  - the RV curve marker
  - the spectral inset cursor/marker

## Data dependencies

- Use the shared spectra contract: `docs/contracts/spectra-data-contract.md`.
- Reuse the Doppler shift helper used by the Doppler demo (single source of truth).

## Acceptance tests (done-definition)

- Circular orbit case: RV is sinusoidal and centered on 0.
- Inclination: i = 0° → RV is identically 0; i = 90° → max amplitude.
- Spectral inset shift direction matches sign convention (positive RV shifts to longer wavelength).
- The RV marker and the spectral inset are synchronized (same phase/time).

