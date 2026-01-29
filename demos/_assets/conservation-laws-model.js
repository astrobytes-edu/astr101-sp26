/**
 * Conservation Laws (Orbits) model utilities.
 *
 * Goal: pure helpers for the Conservation Laws demo:
 * - convert initial-condition UI choices into state vectors
 * - sample conic sections (ellipse/parabola/hyperbola) for rendering
 *
 * Units:
 * - Positions: AU
 * - Velocities: AU/yr
 * - Conic parameters: p in AU, angles in radians
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.ConservationLawsModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  /**
   * At the initial point we place the particle on the +x axis:
   *   r0 = (r0Au, 0)
   *
   * Define directionDeg so that:
   * - 0°   means purely tangential (+y direction)
   * - +90° means purely radial outward (+x direction)
   * - −90° means purely radial inward (−x direction)
   */
  function velocityFromSpeedAndDirectionAuYr({ speedAuYr, directionDeg }) {
    if (!Number.isFinite(speedAuYr)) return { vxAuYr: NaN, vyAuYr: NaN };
    if (!Number.isFinite(directionDeg)) return { vxAuYr: NaN, vyAuYr: NaN };
    const a = degToRad(directionDeg);
    return {
      vxAuYr: speedAuYr * Math.sin(a),
      vyAuYr: speedAuYr * Math.cos(a),
    };
  }

  function initialStateAuYr({ r0Au, speedAuYr, directionDeg }) {
    if (!Number.isFinite(r0Au) || r0Au <= 0) return { rVecAu: null, vVecAuYr: null };
    const vVecAuYr = velocityFromSpeedAndDirectionAuYr({ speedAuYr, directionDeg });
    return {
      rVecAu: { xAu: r0Au, yAu: 0 },
      vVecAuYr,
    };
  }

  /**
   * Determine a safe true-anomaly domain for plotting a conic.
   *
   * Conic in polar form: r(ν) = p / (1 + e cos ν)
   *
   * For hyperbolas, we must keep the denominator positive:
   *   1 + e cos ν > 0  ⇒  cos ν > -1/e.
   */
  function conicTrueAnomalyDomainRad({ ecc }) {
    if (!Number.isFinite(ecc) || ecc < 0) return { nuMin: NaN, nuMax: NaN };

    const EPS = 1e-3;
    if (ecc < 1) {
      return { nuMin: 0, nuMax: 2 * Math.PI };
    }
    if (Math.abs(ecc - 1) < 1e-10) {
      return { nuMin: -Math.PI + EPS, nuMax: Math.PI - EPS };
    }

    const nuMax = Math.acos(-1 / ecc) - EPS;
    return { nuMin: -nuMax, nuMax };
  }

  function sampleConicOrbitAu({ ecc, pAu, omegaRad, numPoints }) {
    if (!Number.isFinite(ecc) || ecc < 0) return [];
    if (!Number.isFinite(pAu) || pAu <= 0) return [];
    if (!Number.isFinite(omegaRad)) return [];
    if (!Number.isFinite(numPoints) || numPoints < 3) return [];

    const { nuMin, nuMax } = conicTrueAnomalyDomainRad({ ecc });
    if (!Number.isFinite(nuMin) || !Number.isFinite(nuMax)) return [];

    const cosO = Math.cos(omegaRad);
    const sinO = Math.sin(omegaRad);

    const pts = [];
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const nu = nuMin + t * (nuMax - nuMin);
      const denom = 1 + ecc * Math.cos(nu);
      if (denom <= 0) continue;
      const r = pAu / denom;
      const xOrb = r * Math.cos(nu);
      const yOrb = r * Math.sin(nu);
      const x = xOrb * cosO - yOrb * sinO;
      const y = xOrb * sinO + yOrb * cosO;
      pts.push({ xAu: x, yAu: y });
    }

    return pts;
  }

  return {
    velocityFromSpeedAndDirectionAuYr,
    initialStateAuYr,
    conicTrueAnomalyDomainRad,
    sampleConicOrbitAu,
  };
});

