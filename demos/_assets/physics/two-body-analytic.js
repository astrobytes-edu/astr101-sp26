/**
 * demos/_assets/physics/two-body-analytic.js
 *
 * Pure, testable analytic two-body relations.
 *
 * Design:
 * - Geometry helpers are unit-agnostic (they work in any consistent length unit).
 * - “Teaching wrappers” use the AU/yr/M☉ normalization in AstroConstants (G = 4π²).
 * - Conversions (AU ↔ km ↔ cm, yr ↔ s) are delegated to AstroUnits.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./astro-constants.js'), require('./units.js'));
  } else {
    root.TwoBodyAnalytic = factory(root.AstroConstants, root.AstroUnits);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants, AstroUnits) {
  'use strict';

  if (!AstroConstants) {
    throw new Error('TwoBodyAnalytic: missing AstroConstants (load physics/astro-constants.js first)');
  }
  if (!AstroUnits) {
    throw new Error('TwoBodyAnalytic: missing AstroUnits (load physics/units.js first)');
  }

  // -------------------------------------------
  // Geometry (unit-agnostic)
  // -------------------------------------------

  // r(θ) = a(1-e^2) / (1 + e cos θ)
  function orbitalRadius({ a, e, thetaRad }) {
    if (!Number.isFinite(a) || a <= 0) return NaN;
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const denom = 1 + e * Math.cos(thetaRad);
    return (a * (1 - e * e)) / denom;
  }

  function trueToEccentricAnomalyRad({ thetaRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const cosT = Math.cos(thetaRad);
    const sinT = Math.sin(thetaRad);
    const denom = 1 + e * cosT;
    const cosE = (e + cosT) / denom;
    const sinE = (Math.sqrt(1 - e * e) * sinT) / denom;
    return Math.atan2(sinE, cosE);
  }

  function trueToMeanAnomalyRad({ thetaRad, e }) {
    const E = trueToEccentricAnomalyRad({ thetaRad, e });
    return E - e * Math.sin(E);
  }

  function meanToTrueAnomalyRad({ meanAnomalyRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;

    // Intentionally do NOT normalize mean anomaly: callers can build continuous
    // "time windows" without discontinuities at 0/2π.
    const M = meanAnomalyRad;

    // Solve Kepler’s equation: M = E - e sin E using Newton iterations.
    let E = M;
    for (let i = 0; i < 25; i++) {
      const f = E - e * Math.sin(E) - M;
      const fp = 1 - e * Math.cos(E);
      const dE = -f / fp;
      E += dE;
      if (Math.abs(dE) < 1e-12) break;
    }

    const denom = 1 - e * Math.cos(E);
    const cosT = (Math.cos(E) - e) / denom;
    const sinT = (Math.sqrt(1 - e * e) * Math.sin(E)) / denom;
    return Math.atan2(sinT, cosT);
  }

  // -------------------------------------------
  // Teaching-unit helpers (AU / yr / M☉)
  // -------------------------------------------

  function muAu3Yr2FromMassSolar(massSolar) {
    if (!Number.isFinite(massSolar) || massSolar <= 0) return NaN;
    return AstroConstants.GRAV.G_AU3_YR2_PER_SOLAR_MASS * massSolar;
  }

  function orbitalPeriodYrFromAuSolar({ aAu, massSolar }) {
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(massSolar) || massSolar <= 0) return NaN;
    return Math.sqrt((aAu * aAu * aAu) / massSolar);
  }

  function circularSpeedAuPerYr({ muAu3Yr2, rAu }) {
    if (!Number.isFinite(muAu3Yr2) || muAu3Yr2 <= 0) return NaN;
    if (!Number.isFinite(rAu) || rAu <= 0) return NaN;
    return Math.sqrt(muAu3Yr2 / rAu);
  }

  function escapeSpeedAuPerYr({ muAu3Yr2, rAu }) {
    if (!Number.isFinite(muAu3Yr2) || muAu3Yr2 <= 0) return NaN;
    if (!Number.isFinite(rAu) || rAu <= 0) return NaN;
    return Math.sqrt((2 * muAu3Yr2) / rAu);
  }

  function visVivaSpeedAuPerYr({ rAu, aAu, muAu3Yr2 }) {
    if (!Number.isFinite(rAu) || rAu <= 0) return NaN;
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(muAu3Yr2) || muAu3Yr2 <= 0) return NaN;

    const v2 = muAu3Yr2 * (2 / rAu - 1 / aAu);
    if (v2 < 0) return 0; // numerical safety near edges
    return Math.sqrt(v2);
  }

  function visVivaSpeedAuPerYrFromAuSolar({ rAu, aAu, massSolar }) {
    const muAu3Yr2 = muAu3Yr2FromMassSolar(massSolar);
    return visVivaSpeedAuPerYr({ rAu, aAu, muAu3Yr2 });
  }

  function specificEnergyAu2Yr2({ rAu, vRelAuYr, muAu3Yr2 }) {
    if (!Number.isFinite(rAu) || rAu <= 0) return NaN;
    if (!Number.isFinite(vRelAuYr)) return NaN;
    if (!Number.isFinite(muAu3Yr2) || muAu3Yr2 <= 0) return NaN;
    return 0.5 * vRelAuYr * vRelAuYr - muAu3Yr2 / rAu;
  }

  function specificAngularMomentumAu2YrFromOrbit({ aAu, e, muAu3Yr2 }) {
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    if (!Number.isFinite(muAu3Yr2) || muAu3Yr2 <= 0) return NaN;
    return Math.sqrt(muAu3Yr2 * aAu * (1 - e * e));
  }

  function arealVelocityAu2Yr({ hAu2Yr }) {
    if (!Number.isFinite(hAu2Yr)) return NaN;
    return 0.5 * hAu2Yr;
  }

  function orbitElementsFromStateAuYr({ rVecAu, vVecAuYr, muAu3Yr2 }) {
    if (!rVecAu || !vVecAuYr) return { orbitType: 'invalid' };
    const x = rVecAu.xAu;
    const y = rVecAu.yAu;
    const vx = vVecAuYr.vxAuYr;
    const vy = vVecAuYr.vyAuYr;
    if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(vx) || !Number.isFinite(vy)) {
      return { orbitType: 'invalid' };
    }
    if (!Number.isFinite(muAu3Yr2) || muAu3Yr2 <= 0) return { orbitType: 'invalid' };

    const r = Math.sqrt(x * x + y * y);
    if (!(r > 0)) return { orbitType: 'invalid' };

    const v2 = vx * vx + vy * vy;
    const eps = 0.5 * v2 - muAu3Yr2 / r; // AU^2/yr^2

    // Specific angular momentum (z-component in 2D).
    const hz = x * vy - y * vx; // AU^2/yr
    const h = Math.abs(hz);

    // Eccentricity vector: e = (v × h)/μ - r̂
    // In 2D: v×h_z = (vy*hz, -vx*hz)
    const rx = x / r;
    const ry = y / r;
    const ex = (vy * hz) / muAu3Yr2 - rx;
    const ey = (-vx * hz) / muAu3Yr2 - ry;
    const ecc = Math.sqrt(ex * ex + ey * ey);

    // Semi-latus rectum p = h^2 / μ
    const p = (h * h) / muAu3Yr2;

    // Semi-major axis a = -μ/(2ε) (infinite for ε=0)
    const EPS_TOL = 1e-12;
    const a = Math.abs(eps) < EPS_TOL ? Number.POSITIVE_INFINITY : -muAu3Yr2 / (2 * eps);

    // Periapsis direction is along eccentricity vector.
    const omega = ecc < 1e-14 ? 0 : Math.atan2(ey, ex);

    const E_TOL = 1e-8;
    let orbitType = 'elliptical';
    if (!Number.isFinite(ecc)) orbitType = 'invalid';
    else if (ecc < 1e-10) orbitType = 'circular';
    else if (Math.abs(ecc - 1) < E_TOL) orbitType = 'parabolic';
    else if (ecc > 1) orbitType = 'hyperbolic';

    return {
      rAu: r,
      v2Au2Yr2: v2,
      epsAu2Yr2: eps,
      hAu2Yr: hz,
      hAbsAu2Yr: h,
      ecc,
      eVec: { ex, ey },
      pAu: p,
      aAu: a,
      omegaRad: omega,
      orbitType,
    };
  }

  // -------------------------------------------
  // Conversions / interoperability
  // -------------------------------------------

  function muCgsFromMuAu3Yr2(muAu3Yr2) {
    return AstroUnits.au3PerYr2ToCm3PerS2(muAu3Yr2);
  }

  function speedKmPerSFromAuPerYr(vAuYr) {
    return AstroUnits.auPerYrToKmPerS(vAuYr);
  }

  function accelMPerS2FromAuPerYr2(aAuYr2) {
    return AstroUnits.auPerYr2ToMPerS2(aAuYr2);
  }

  return {
    orbitalRadius,
    trueToMeanAnomalyRad,
    meanToTrueAnomalyRad,

    muAu3Yr2FromMassSolar,
    orbitalPeriodYrFromAuSolar,
    circularSpeedAuPerYr,
    escapeSpeedAuPerYr,
    visVivaSpeedAuPerYr,
    visVivaSpeedAuPerYrFromAuSolar,

    specificEnergyAu2Yr2,
    specificAngularMomentumAu2YrFromOrbit,
    arealVelocityAu2Yr,
    orbitElementsFromStateAuYr,

    muCgsFromMuAu3Yr2,
    speedKmPerSFromAuPerYr,
    accelMPerS2FromAuPerYr2,
  };
});
