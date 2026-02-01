# Rotation Curve Demo (Roadmap) — Spec Stub

## One-sentence goal

Students see how galaxy rotation curves are measured with Doppler shifts and why “flat” rotation curves imply unseen mass.

## Status

Roadmap item (not part of L7–L10 completion gate). Write the full spec and acceptance tests before implementation.

## Teach-first → museum later

Prototype and validate pedagogy here first (tight integration with readings). Migrate into Cosmic Playground once stable, reusing the Doppler measurement UI patterns and spectra data contract.

## Concept throughline

1. Keplerian expectation (solar-system intuition): $v(r) \propto r^{-1/2}$ for a central mass.
2. What astronomers actually measure: line-of-sight velocities from Doppler shifts across a galaxy disk.
3. The surprise: observed curves are often flat-ish at large radius → mass continues to grow with radius → dark matter inference.

## Proposed v1 modes

1. **Solar-system mode (central mass)**
   - Show a simple “expected” curve: $v(r) \propto r^{-1/2}$.

2. **Galaxy mode**
   - “Visible matter only” curve that declines.
   - “Visible + halo” curve that stays approximately flat.

## Measurement layer (must-have)

- Reuse the Doppler idea: measure $v$ from a spectral line shift.
- Provide an interaction that samples two sides of a disk and returns opposite-sign velocities (approaching vs receding).

## Data and contracts

- Reuse `docs/contracts/spectra-data-contract.md` for any line data used in the measurement UI.

## Accessibility

- The “approaching/receding” distinction must not be color-only (icons + text).

