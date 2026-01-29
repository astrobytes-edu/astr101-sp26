/* Kepler's Laws model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.KeplersLawsModel)
 * and in Node tests (via require()).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.KeplersLawsModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeAngleRad(rad) {
    const twoPi = 2 * Math.PI;
    return ((rad % twoPi) + twoPi) % twoPi;
  }

  // r(θ) = a(1-e^2) / (1 + e cos θ)
  function orbitalRadiusAu({ aAu, e, thetaRad }) {
    if (!Number.isFinite(aAu) || aAu <= 0) return NaN;
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;
    const denom = 1 + e * Math.cos(thetaRad);
    return (aAu * (1 - e * e)) / denom;
  }

  // Demo’s coordinate convention is focus-centered with perihelion to the left:
  // x = -r cos θ, y = r sin θ.
  function positionFromFocusAu({ aAu, e, thetaRad }) {
    const r = orbitalRadiusAu({ aAu, e, thetaRad });
    return { xAu: -r * Math.cos(thetaRad), yAu: r * Math.sin(thetaRad) };
  }

  // Tangent direction in the same (x,y) convention as positionFromFocusAu.
  function orbitTangentAngleRad({ aAu, e, thetaRad }) {
    const r = orbitalRadiusAu({ aAu, e, thetaRad });
    if (!Number.isFinite(r)) return NaN;

    // dr/dθ for r = p/(1 + e cos θ)
    const p = aAu * (1 - e * e);
    const denom = 1 + e * Math.cos(thetaRad);
    const drdTheta = (p * e * Math.sin(thetaRad)) / (denom * denom);

    // x = -r cosθ; y = r sinθ
    // dx/dθ = -(dr/dθ)cosθ + r sinθ
    // dy/dθ = (dr/dθ)sinθ + r cosθ
    const dx = -drdTheta * Math.cos(thetaRad) + r * Math.sin(thetaRad);
    const dy = drdTheta * Math.sin(thetaRad) + r * Math.cos(thetaRad);

    return Math.atan2(dy, dx);
  }

  function trueToEccentricAnomalyRad({ thetaRad, e }) {
    if (!Number.isFinite(e) || e < 0 || e >= 1) return NaN;

    // Robust conversion using atan2 forms (avoids tan-half-angle quadrant issues).
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
    // Keep the caller's mean anomaly unwrapped so demos can build "time windows"
    // (e.g., the equal-areas wedge) without discontinuities at 0/2π.
    const M = meanAnomalyRad;

    // Solve Kepler’s equation: M = E - e sin E
    let E = M;
    for (let i = 0; i < 20; i++) {
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

  function formatNewtonReadouts({ vKms, aMs2, units }) {
    if (!Number.isFinite(vKms) || !Number.isFinite(aMs2)) {
      return { vValue: NaN, vUnit: '', aValue: NaN, aUnit: '' };
    }

    if (units === '201') {
      return {
        vValue: vKms * 1e5,
        vUnit: 'cm/s',
        aValue: aMs2 * 100,
        aUnit: 'cm/s²',
      };
    }

    return {
      vValue: vKms,
      vUnit: 'km/s',
      aValue: aMs2,
      aUnit: 'm/s²',
    };
  }

  return {
    orbitalRadiusAu,
    positionFromFocusAu,
    orbitTangentAngleRad,
    trueToMeanAnomalyRad,
    meanToTrueAnomalyRad,
    formatNewtonReadouts,
  };
});
