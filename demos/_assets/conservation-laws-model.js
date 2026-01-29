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

  /**
   * Plotting helper: for open orbits, optionally clip the domain so that r(ν) ≤ rMaxAu.
   *
   * This keeps escape/hyperbolic orbits visible in a finite view window and avoids
   * sampling arbitrarily close to asymptotes where r → ∞.
   */
  function conicTrueAnomalyDomainRadForPlot({ ecc, pAu, rMaxAu }) {
    const base = conicTrueAnomalyDomainRad({ ecc });
    if (!Number.isFinite(base.nuMin) || !Number.isFinite(base.nuMax)) return base;
    if (!(Number.isFinite(ecc) && ecc >= 1)) return base;
    if (!(Number.isFinite(pAu) && pAu > 0)) return base;
    if (!(Number.isFinite(rMaxAu) && rMaxAu > 0)) return base;

    const c = (pAu / rMaxAu - 1) / ecc;
    const cClamped = Math.max(-1, Math.min(1, c));
    const nuMaxClip = Math.acos(cClamped);
    if (!Number.isFinite(nuMaxClip)) return base;

    const clipped = Math.min(base.nuMax, nuMaxClip);
    return { nuMin: -clipped, nuMax: clipped };
  }

  function wrap2Pi(rad) {
    const twoPi = 2 * Math.PI;
    return ((rad % twoPi) + twoPi) % twoPi;
  }

  /**
   * Animation helper: advance ν for a simple parameter-sweep animation.
   *
   * - For elliptical orbits, wraps ν into [0, 2π).
   * - For open orbits, clamps at the plotting domain edge and returns stopped=true.
   */
  function advanceTrueAnomalyRad({ nuRad, ecc, nuMin, nuMax, dir, dtSec, nuSpeedRadPerSec }) {
    const d = Number.isFinite(dir) ? dir : 1;
    if (!Number.isFinite(nuRad)) return { nuRad: NaN, dir: d, stopped: true };

    const dt = Number.isFinite(dtSec) ? dtSec : 0;
    const speed = Number.isFinite(nuSpeedRadPerSec) ? nuSpeedRadPerSec : 0;
    const next = nuRad + d * speed * dt;

    if (!Number.isFinite(ecc) || ecc < 0) return { nuRad: next, dir: d, stopped: true };
    if (ecc < 1) {
      return { nuRad: wrap2Pi(next), dir: d, stopped: false };
    }

    if (!Number.isFinite(nuMin) || !Number.isFinite(nuMax)) return { nuRad: next, dir: d, stopped: true };
    if (next > nuMax) return { nuRad: nuMax, dir: d, stopped: true };
    if (next < nuMin) return { nuRad: nuMin, dir: d, stopped: true };
    return { nuRad: next, dir: d, stopped: false };
  }

  function sampleConicOrbitAu({ ecc, pAu, omegaRad, numPoints, rMaxAu }) {
    if (!Number.isFinite(ecc) || ecc < 0) return [];
    if (!Number.isFinite(pAu) || pAu <= 0) return [];
    if (!Number.isFinite(omegaRad)) return [];
    if (!Number.isFinite(numPoints) || numPoints < 3) return [];

    const { nuMin, nuMax } = conicTrueAnomalyDomainRadForPlot({ ecc, pAu, rMaxAu });
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
    conicTrueAnomalyDomainRadForPlot,
    advanceTrueAnomalyRad,
    sampleConicOrbitAu,
  };
});
