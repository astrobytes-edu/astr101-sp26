/**
 * Binary Orbits Model - Two-Body Physics
 *
 * Pure functions usable both in the browser (via window.BinaryOrbitsModel)
 * and in Node tests (via require()).
 *
 * Units: Solar units (AU, years, M☉) unless otherwise specified.
 * Conversions to km/s provided for display.
 *
 * INVARIANTS (must always hold):
 * 1. a1 + a2 === aRel (semi-major axes sum to relative separation)
 * 2. a1/a2 === M2/M1 (inverse mass ratio for barycentric orbits)
 * 3. P² × M_tot === a³ (Kepler's 3rd Law in solar units)
 * 4. 0 <= e < 1 (bound orbit requirement)
 * 5. M1 > 0, M2 > 0 (positive masses)
 * 6. aRel > 0 (positive separation)
 * 7. Both bodies share the same orbital period P
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./physics/astro-constants.js'));
  } else {
    root.BinaryOrbitsModel = factory(root.AstroConstants);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants) {
  'use strict';

  if (!AstroConstants) {
    throw new Error('BinaryOrbitsModel: missing AstroConstants (load demos/_assets/physics/astro-constants.js first)');
  }

  const TwoBody =
    typeof window !== 'undefined'
      ? window.TwoBodyAnalytic
      : require('./physics/two-body-analytic.js');

  if (!TwoBody) {
    throw new Error('BinaryOrbitsModel: missing TwoBodyAnalytic (load demos/_assets/physics/two-body-analytic.js first)');
  }

  // ============================================
  // Physical Constants
  // ============================================

  // G in solar units: G = 4π² AU³/yr²/M☉ (Kepler's normalization)
  // This makes P² = a³/M_tot with P in years, a in AU, M in M☉
  const G_SOLAR = AstroConstants.GRAV.G_AU3_YR2_PER_SOLAR_MASS;

  // Unit conversions
  const AU_KM = AstroConstants.LENGTH.KM_PER_AU;        // km per AU
  const YEAR_SECONDS = AstroConstants.TIME.YEAR_S;      // seconds per (Julian) year

  // ============================================
  // Input Validation
  // ============================================

  /**
   * Validate mass input
   * @param {number} M - Mass value
   * @returns {boolean} True if valid
   */
  function isValidMass(M) {
    return Number.isFinite(M) && M > 0;
  }

  /**
   * Validate semi-major axis
   * @param {number} a - Semi-major axis
   * @returns {boolean} True if valid
   */
  function isValidSemiMajor(a) {
    return Number.isFinite(a) && a > 0;
  }

  /**
   * Validate eccentricity (bound orbit: 0 <= e < 1)
   * @param {number} e - Eccentricity
   * @returns {boolean} True if valid
   */
  function isValidEccentricity(e) {
    return Number.isFinite(e) && e >= 0 && e < 1;
  }

  // ============================================
  // Two-Body Physics Functions
  // ============================================

  /**
   * Calculate barycenter fraction (center of mass position)
   * x_cm = M2 / (M1 + M2) × separation from M1
   *
   * @param {Object} params
   * @param {number} params.M1 - Mass of body 1 (M☉)
   * @param {number} params.M2 - Mass of body 2 (M☉)
   * @returns {number} Fraction of separation from M1 to barycenter
   */
  function barycenterFraction({ M1, M2 }) {
    if (!isValidMass(M1) || !isValidMass(M2)) {
      // Handle edge case: if both zero, barycenter at midpoint
      if (M1 === 0 && M2 === 0) return 0.5;
      return NaN;
    }
    const M_tot = M1 + M2;
    return M2 / M_tot;
  }

  /**
   * Calculate individual semi-major axes for each body's orbit around barycenter
   *
   * Key insight: a1 + a2 = a_rel (relative separation)
   * And: a1/a2 = M2/M1 (inverse mass ratio)
   *
   * @param {Object} params
   * @param {number} params.aRel - Relative separation semi-major axis (AU)
   * @param {number} params.M1 - Mass of body 1 (M☉)
   * @param {number} params.M2 - Mass of body 2 (M☉)
   * @returns {{a1: number, a2: number}} Individual orbit semi-major axes (AU)
   */
  function individualSemiMajorAu({ aRel, M1, M2 }) {
    if (!isValidSemiMajor(aRel)) {
      return { a1: NaN, a2: NaN };
    }
    if (!isValidMass(M1) && !isValidMass(M2)) {
      // Both invalid: split evenly
      return { a1: aRel / 2, a2: aRel / 2 };
    }
    if (!isValidMass(M1)) M1 = 0;
    if (!isValidMass(M2)) M2 = 0;

    const M_tot = M1 + M2;
    if (M_tot === 0) {
      return { a1: aRel / 2, a2: aRel / 2 };
    }
    return {
      a1: aRel * M2 / M_tot,  // Body 1's orbit size (larger mass = smaller orbit)
      a2: aRel * M1 / M_tot   // Body 2's orbit size
    };
  }

  /**
   * Calculate orbital period using Kepler's 3rd Law
   * P² = a³ / (M1 + M2)  [with P in years, a in AU, M in M☉]
   *
   * @param {Object} params
   * @param {number} params.aRel - Relative separation semi-major axis (AU)
   * @param {number} params.M1 - Mass of body 1 (M☉)
   * @param {number} params.M2 - Mass of body 2 (M☉)
   * @returns {number} Orbital period (years)
   */
  function orbitalPeriodYr({ aRel, M1, M2 }) {
    if (!isValidSemiMajor(aRel)) return NaN;
    if (!isValidMass(M1)) M1 = 0;
    if (!isValidMass(M2)) M2 = 0;

    const M_tot = M1 + M2;
    if (M_tot === 0) return Infinity;
    return Math.sqrt(Math.pow(aRel, 3) / M_tot);
  }

  /**
   * Calculate orbital radius from true anomaly using polar equation
   * r = a(1 - e²) / (1 + e × cos(θ))
   *
   * @param {Object} params
   * @param {number} params.aAu - Semi-major axis (AU)
   * @param {number} params.e - Eccentricity (0 ≤ e < 1)
   * @param {number} params.thetaRad - True anomaly (radians)
   * @returns {number} Orbital radius (AU)
   */
  function orbitalRadiusAu({ aAu, e, thetaRad }) {
    if (!isValidSemiMajor(aAu)) return NaN;
    if (!isValidEccentricity(e)) {
      // Clamp invalid eccentricity for safety
      if (e >= 1) e = 0.999;
      if (e < 0) e = 0;
    }
    const numerator = aAu * (1 - e * e);
    const denominator = 1 + e * Math.cos(thetaRad);
    return numerator / denominator;
  }

  /**
   * Calculate orbital velocity using vis-viva equation
   * v = √(G × M_tot × (2/r - 1/a))
   *
   * @param {Object} params
   * @param {number} params.rAu - Current orbital radius (AU)
   * @param {number} params.aAu - Semi-major axis (AU)
   * @param {number} params.M1 - Mass of body 1 (M☉)
   * @param {number} params.M2 - Mass of body 2 (M☉)
   * @returns {number} Orbital velocity (km/s)
   */
  function orbitalVelocityKms({ rAu, aAu, M1, M2 }) {
    if (!isValidSemiMajor(rAu) || !isValidSemiMajor(aAu)) return NaN;
    if (!isValidMass(M1)) M1 = 0;
    if (!isValidMass(M2)) M2 = 0;

    const M_tot = M1 + M2;
    if (M_tot === 0) return 0;

    // v² = G × M_tot × (2/r - 1/a)  [AU³/yr²/M☉ × M☉ × 1/AU = AU²/yr²]
    const v_squared = G_SOLAR * M_tot * (2 / rAu - 1 / aAu);
    if (v_squared < 0) return 0;  // Safety for numerical edge cases

    const v_AU_yr = Math.sqrt(v_squared);  // AU/yr

    // Convert to km/s: 1 AU/yr = AU_KM / YEAR_SECONDS km/s
    const v_kms = v_AU_yr * AU_KM / YEAR_SECONDS;
    return v_kms;
  }

  /**
   * Calculate gravitational acceleration toward other body
   * a = G × M_other / r²
   *
   * @param {Object} params
   * @param {number} params.rAu - Distance from other body (AU)
   * @param {number} params.M - Mass of the other body (M☉)
   * @returns {number} Gravitational acceleration (m/s²)
   */
  function gravAccelerationMs2({ rAu, M }) {
    if (!isValidSemiMajor(rAu)) return NaN;
    if (!isValidMass(M)) return 0;

    // a = G × M / r²  [AU³/yr²/M☉ × M☉ / AU² = AU/yr²]
    const a_AU_yr2 = G_SOLAR * M / (rAu * rAu);

    // Convert to m/s²: 1 AU/yr² = (AU_KM × 1000) / (YEAR_SECONDS²) m/s²
    const AU_M = AU_KM * 1000;
    const a_ms2 = a_AU_yr2 * AU_M / (YEAR_SECONDS * YEAR_SECONDS);
    return a_ms2;
  }

  /**
   * Calculate the tangent angle to an elliptical orbit at given true anomaly
   * This is the direction of velocity, NOT simply θ + π/2 for eccentric orbits!
   *
   * Uses calculus: tangent = (dx/dθ, dy/dθ) where position is in polar coords
   *
   * Coordinate convention: x = r cos θ, y = r sin θ (standard polar)
   *
   * @param {Object} params
   * @param {number} params.aAu - Semi-major axis (AU)
   * @param {number} params.e - Eccentricity
   * @param {number} params.thetaRad - True anomaly (radians)
   * @returns {number} Tangent angle (radians)
   */
  function orbitTangentAngleRad({ aAu, e, thetaRad }) {
    const r = orbitalRadiusAu({ aAu, e, thetaRad });
    if (!Number.isFinite(r)) return NaN;

    // Semi-latus rectum
    const p = aAu * (1 - e * e);
    const denom = 1 + e * Math.cos(thetaRad);

    // dr/dθ for r = p/(1 + e cos θ)
    const drdTheta = (p * e * Math.sin(thetaRad)) / (denom * denom);

    // Position: x = r cos θ, y = r sin θ
    // dx/dθ = (dr/dθ)cos θ - r sin θ
    // dy/dθ = (dr/dθ)sin θ + r cos θ
    // But binary-orbits uses x = -r cos θ convention for perihelion to left
    // So: dx/dθ = -(dr/dθ)cos θ + r sin θ
    //     dy/dθ = (dr/dθ)sin θ + r cos θ
    const dx = -drdTheta * Math.cos(thetaRad) + r * Math.sin(thetaRad);
    const dy = drdTheta * Math.sin(thetaRad) + r * Math.cos(thetaRad);

    return Math.atan2(dy, dx);
  }

  function wrap2Pi(rad) {
    const twoPi = 2 * Math.PI;
    return ((rad % twoPi) + twoPi) % twoPi;
  }

  /**
   * Convert mean anomaly to true anomaly by solving Kepler's equation
   * M = E - e × sin(E)  (Kepler's equation)
   * θ = 2 × atan2(√(1+e) × sin(E/2), √(1-e) × cos(E/2))
   *
   * Uses Newton-Raphson iteration for eccentric anomaly E
   *
   * @param {Object} params
   * @param {number} params.meanAnomalyRad - Mean anomaly (radians)
   * @param {number} params.e - Eccentricity
   * @returns {number} True anomaly (radians)
   */
  function meanToTrueAnomalyRad({ meanAnomalyRad, e }) {
    if (!isValidEccentricity(e)) {
      if (e >= 1) e = 0.999;
      if (e < 0) e = 0;
    }

    // Binary Orbits uses a [0, 2π) convention for mean anomaly inputs.
    const twoPi = 2 * Math.PI;
    const M_norm = ((meanAnomalyRad % twoPi) + twoPi) % twoPi;

    // Delegate the Kepler solve to the shared TwoBodyAnalytic implementation, then wrap to [0, 2π).
    const theta = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M_norm, e });
    return wrap2Pi(theta);
  }

  /**
   * Convert true anomaly to mean anomaly (for time calculations)
   *
   * @param {Object} params
   * @param {number} params.thetaRad - True anomaly (radians)
   * @param {number} params.e - Eccentricity
   * @returns {number} Mean anomaly (radians)
   */
  function trueToMeanAnomalyRad({ thetaRad, e }) {
    if (!isValidEccentricity(e)) {
      if (e >= 1) e = 0.999;
      if (e < 0) e = 0;
    }

    // For circular orbit
    if (e < 1e-10) return thetaRad;
    return TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
  }

  /**
   * Project an in-plane velocity vector onto a line of sight (RV).
   *
   * Teaching convention:
   * - Positive RV means receding (redshift) when lineOfSightUnit points away from the observer.
   *
   * This helper is intentionally simple: it applies a sin(i) projection factor without
   * implementing full 3D orbital geometry. The host demo controls the meaning of i and LOS.
   *
   * @param {Object} params
   * @param {number} params.vxKms - x component of velocity in km/s
   * @param {number} params.vyKms - y component of velocity in km/s
   * @param {{x:number,y:number}} params.lineOfSightUnit - LOS direction (will be normalized)
   * @param {number} params.sinI - sin(inclination), where i=0 is face-on and i=90° is edge-on
   * @returns {number} Radial velocity in km/s
   */
  function radialVelocityKms({ vxKms, vyKms, lineOfSightUnit, sinI }) {
    if (!Number.isFinite(vxKms) || !Number.isFinite(vyKms)) return NaN;
    if (!Number.isFinite(sinI)) sinI = 1;

    const los = lineOfSightUnit ?? { x: 1, y: 0 };
    const lx = Number(los.x);
    const ly = Number(los.y);
    const norm = Math.sqrt(lx * lx + ly * ly);
    if (!Number.isFinite(norm) || norm === 0) return NaN;

    const dot = (vxKms * lx + vyKms * ly) / norm;
    return dot * sinI;
  }

  // ============================================
  // Module Export
  // ============================================

  return {
    // Constants
    G_SOLAR,
    AU_KM,
    YEAR_SECONDS,

    // Validation
    isValidMass,
    isValidSemiMajor,
    isValidEccentricity,

    // Core physics
    barycenterFraction,
    individualSemiMajorAu,
    orbitalPeriodYr,
    orbitalRadiusAu,
    orbitalVelocityKms,
    gravAccelerationMs2,
    radialVelocityKms,
    orbitTangentAngleRad,
    meanToTrueAnomalyRad,
    trueToMeanAnomalyRad
  };
});
