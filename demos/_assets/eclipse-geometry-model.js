/* Eclipse Geometry model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.EclipseGeometryModel)
 * and in Node tests (via require()).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.EclipseGeometryModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function normalizeAngleDeg(angleDeg) {
    return ((angleDeg % 360) + 360) % 360;
  }

  function angularSeparationDeg(aDeg, bDeg) {
    const diff = Math.abs(normalizeAngleDeg(aDeg - bDeg));
    return diff > 180 ? 360 - diff : diff;
  }

  function phaseAngleDeg({ moonLonDeg, sunLonDeg }) {
    return normalizeAngleDeg(moonLonDeg - sunLonDeg);
  }

  // Exact ecliptic latitude for an orbit inclined by i relative to the ecliptic:
  //   β = asin( sin(i) * sin(λ - Ω) )
  function eclipticLatitudeDeg({ tiltDeg, moonLonDeg, nodeLonDeg }) {
    const iRad = (tiltDeg * Math.PI) / 180;
    const dRad = ((moonLonDeg - nodeLonDeg) * Math.PI) / 180;
    const betaRad = Math.asin(Math.sin(iRad) * Math.sin(dRad));
    return (betaRad * 180) / Math.PI;
  }

  function nearestNodeDistanceDeg({ moonLonDeg, nodeLonDeg }) {
    const dAsc = angularSeparationDeg(moonLonDeg, nodeLonDeg);
    const dDesc = angularSeparationDeg(moonLonDeg, nodeLonDeg + 180);
    return Math.min(dAsc, dDesc);
  }

  // Convert a node-offset Δλ to ecliptic latitude β using the exact formula.
  function betaFromDeltaLambdaDeg({ tiltDeg, deltaLambdaDeg }) {
    const iRad = (tiltDeg * Math.PI) / 180;
    const dRad = (deltaLambdaDeg * Math.PI) / 180;
    const betaRad = Math.asin(Math.sin(iRad) * Math.sin(dRad));
    return (betaRad * 180) / Math.PI;
  }

  // Convert a latitude threshold |β| into a node window half-width Δλ such that
  // |β| <= betaDeg when |λ-Ω| <= Δλ.
  function deltaLambdaFromBetaDeg({ tiltDeg, betaDeg }) {
    const iRad = (tiltDeg * Math.PI) / 180;
    const denom = Math.sin(iRad);
    if (Math.abs(denom) < 1e-12) return 180;

    const bRad = (Math.abs(betaDeg) * Math.PI) / 180;
    const x = Math.min(1, Math.max(0, Math.sin(bRad) / Math.abs(denom)));
    const dRad = Math.asin(x);
    return (dRad * 180) / Math.PI;
  }

  return {
    normalizeAngleDeg,
    angularSeparationDeg,
    phaseAngleDeg,
    eclipticLatitudeDeg,
    nearestNodeDistanceDeg,
    betaFromDeltaLambdaDeg,
    deltaLambdaFromBetaDeg,
  };
});
