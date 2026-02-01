/* Planetary Climate model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.PlanetaryClimateModel)
 * and in Node tests (via require()).
 *
 * Model: simple energy balance + toy greenhouse mapping, per
 * docs/specs/demos/planetary_climate_sandbox_demo_spec_narrative.md
 *
 * Notes:
 * - All constants are SI units.
 * - Redistribution is represented via absorbed-flux averaging:
 *   - "global": divide by 4 (full redistribution)
 *   - "dayside": divide by 2 (dayside-only emission)
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.PlanetaryClimateModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CONST = {
    // Stefan–Boltzmann constant (W m^-2 K^-4)
    SIGMA_W_M2_K4: 5.670374419e-8,
    // Solar luminosity (W)
    L_SUN_W: 3.828e26,
    // Astronomical unit (m)
    AU_M: 1.495978707e11,
  };

  function _isFinitePositive(x) {
    return Number.isFinite(x) && x > 0;
  }

  function _redistributionDivisor(redistribution) {
    if (redistribution === 'dayside') return 2;
    return 4; // default: global (full redistribution)
  }

  function stellarFluxWm2({ LStarW, dM }) {
    if (!_isFinitePositive(LStarW) || !_isFinitePositive(dM)) return NaN;
    return LStarW / (4 * Math.PI * dM * dM);
  }

  function absorbedFluxWm2({ fluxWm2, albedo, redistribution }) {
    if (!Number.isFinite(fluxWm2) || fluxWm2 < 0) return NaN;
    if (!Number.isFinite(albedo) || albedo < 0 || albedo > 1) return NaN;
    const div = _redistributionDivisor(redistribution);
    return (1 - albedo) * fluxWm2 / div;
  }

  function equilibriumTempK({ LStarW, dM, albedo, redistribution }) {
    const fluxWm2 = stellarFluxWm2({ LStarW, dM });
    const absorbedWm2 = absorbedFluxWm2({ fluxWm2, albedo, redistribution });
    if (!Number.isFinite(absorbedWm2) || absorbedWm2 < 0) return NaN;
    if (!_isFinitePositive(CONST.SIGMA_W_M2_K4)) return NaN;
    return Math.pow(absorbedWm2 / CONST.SIGMA_W_M2_K4, 1 / 4);
  }

  function epsilonOutFromTauIR({ tauIR }) {
    if (!Number.isFinite(tauIR)) return NaN;
    return Math.exp(-tauIR);
  }

  function surfaceTempK({ TeqK, tauIR }) {
    if (!_isFinitePositive(TeqK) || !Number.isFinite(tauIR)) return NaN;
    return TeqK * Math.exp(tauIR / 4);
  }

  function tauIRFromTemps({ TeqK, TsurfK }) {
    if (!_isFinitePositive(TeqK) || !_isFinitePositive(TsurfK)) return NaN;
    return 4 * Math.log(TsurfK / TeqK);
  }

  function spectralOpacityFromTauIR({ tauIR }) {
    // Monotonic map tau → [0, 1). Used only for a teaching visualization of spectral absorption depth.
    if (!Number.isFinite(tauIR) || tauIR < 0) return 0;
    return 1 - Math.exp(-0.7 * tauIR);
  }

  function insolationRatioSe({ LStarW, dM }) {
    // S/S_earth = (L/Lsun)/(d/AU)^2
    if (!_isFinitePositive(LStarW) || !_isFinitePositive(dM)) return NaN;
    return (LStarW / CONST.L_SUN_W) / Math.pow(dM / CONST.AU_M, 2);
  }

  return {
    CONST,
    stellarFluxWm2,
    absorbedFluxWm2,
    equilibriumTempK,
    epsilonOutFromTauIR,
    surfaceTempK,
    tauIRFromTemps,
    spectralOpacityFromTauIR,
    insolationRatioSe,
  };
});
