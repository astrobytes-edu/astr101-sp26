/**
 * demos/_assets/physics/astro-constants.js
 *
 * Single source of truth for definitional constants and time scales used across demos.
 *
 * Notes:
 * - We intentionally keep this small: definitional unit conversions + a few mean time scales.
 * - “Teaching normalization” for gravity in AU/yr/M☉ is provided as a unit-system convention:
 *     G = 4π² AU³ / yr² / M☉
 *   so that (for a 1 M☉ central mass) Kepler's Third Law is P² = a³ with P in years and a in AU.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.AstroConstants = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ============================================
  // Time scales
  // ============================================

  const TIME = {
    // Exact definitions
    DAY_S: 86400,
    JULIAN_YEAR_S: 31557600,

    // Default “mechanics year” used widely by dynamics demos.
    // This is the Julian year by definition (exact seconds).
    YEAR_S: 31557600,

    // Mean/teaching values (epoch-dependent; keep the "MEAN_*" honesty).
    // Source (in-repo): demos/_assets/seasons-model.js
    MEAN_TROPICAL_YEAR_DAYS: 365.2422,

    // Source (in-repo): demos/eclipse-geometry/eclipse-geometry.js
    MEAN_SIDEREAL_MONTH_DAYS: 27.321661,
    MEAN_SYNODIC_MONTH_DAYS: 29.530588,

    // NOAA (user-verified): "node cycle" ≈ 18.61 Julian years (mean regression period).
    MEAN_NODE_REGRESSION_JULIAN_YEARS: 18.61,
  };

  TIME.MEAN_TROPICAL_YEAR_S = TIME.MEAN_TROPICAL_YEAR_DAYS * TIME.DAY_S;
  TIME.MEAN_SIDEREAL_MONTH_S = TIME.MEAN_SIDEREAL_MONTH_DAYS * TIME.DAY_S;
  TIME.MEAN_SYNODIC_MONTH_S = TIME.MEAN_SYNODIC_MONTH_DAYS * TIME.DAY_S;

  TIME.MEAN_NODE_REGRESSION_S = TIME.MEAN_NODE_REGRESSION_JULIAN_YEARS * TIME.JULIAN_YEAR_S;
  TIME.MEAN_NODE_REGRESSION_DAYS = TIME.MEAN_NODE_REGRESSION_S / TIME.DAY_S;

  // Eclipse-relevant: draconic month (node-to-node) derived from sidereal month + nodal regression.
  // If Moon advances +360/P_sid per day and the node regresses −360/P_node per day,
  // the relative rate is (1/P_sid + 1/P_node) cycles/day.
  // So: P_drac = 1 / (1/P_sid + 1/P_node)
  TIME.MEAN_DRACONIC_MONTH_DAYS =
    1 / (1 / TIME.MEAN_SIDEREAL_MONTH_DAYS + 1 / TIME.MEAN_NODE_REGRESSION_DAYS);
  TIME.MEAN_DRACONIC_MONTH_S = TIME.MEAN_DRACONIC_MONTH_DAYS * TIME.DAY_S;

  // ============================================
  // Length conversions
  // ============================================

  const LENGTH = {
    CM_PER_M: 100,
    M_PER_KM: 1000,
    CM_PER_KM: 100000,

    // IAU-defined AU value already used elsewhere in this repo (km).
    KM_PER_AU: 149597870.7,
  };

  LENGTH.M_PER_AU = LENGTH.KM_PER_AU * LENGTH.M_PER_KM;
  LENGTH.CM_PER_AU = LENGTH.M_PER_AU * LENGTH.CM_PER_M;

  // ============================================
  // Gravity normalization for teaching wrappers
  // ============================================

  const GRAV = {
    // In AU/yr/M☉ teaching units, it is conventional to take:
    //   G = 4π² AU³ / yr² / M☉
    // so that for a 1 M☉ star: P² = a³ with P in years, a in AU.
    G_AU3_YR2_PER_SOLAR_MASS: 4 * Math.PI * Math.PI,
  };

  return { TIME, LENGTH, GRAV };
});

