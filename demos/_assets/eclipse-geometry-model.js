/* Eclipse Geometry model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.EclipseGeometryModel)
 * and in Node tests (via require()).
 *
 * MODEL SCOPE:
 * - Orbital inclination: Mean value 5.145° (does not model libration).
 * - Node regression: Mean 18.61-year cycle included in simulations.
 * - Nutation: NOT modeled. Short-period (~18.6 yr principal term) nutation
 *   causes ±9 arcsec wobble in obliquity — negligible for eclipse geometry
 *   teaching but important for precise eclipse predictions.
 * - Shadow geometry: Exact similar-triangle formulas for umbra/penumbra.
 * - Eclipse thresholds: Physically motivated from shadow radii, not empirical.
 *
 * These choices prioritize geometric intuition over ephemeris precision.
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.EclipseGeometryModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ============================================
  // Eclipse Cycle Constants
  // ============================================

  // Saros cycle: 223 synodic months = 6585.3211 days (18 years, 11 days, 8 hours)
  // After one Saros, Sun, Moon, and nodes return to nearly the same relative positions.
  const SYNODIC_MONTH_DAYS = 29.530588;
  const SAROS_SYNODIC_MONTHS = 223;
  const SAROS_CYCLE_DAYS = SYNODIC_MONTH_DAYS * SAROS_SYNODIC_MONTHS; // ≈ 6585.32

  // Exeligmos: 3 Saros cycles = 669 synodic months ≈ 19755.96 days (54 years, 33 days)
  // After one Exeligmos, eclipses return to same longitude (8-hour shift cancels out).
  const EXELIGMOS_CYCLE_DAYS = SAROS_CYCLE_DAYS * 3;

  // Tolerance for cycle matching (±1 day accounts for approximations)
  const CYCLE_TOLERANCE_DAYS = 1;

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }

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

  // Shadow radii from similar triangles.
  // At distance x from the shadowing body along the anti-solar direction:
  //   r_umbra(x)    = R_body - x * (R_sun - R_body) / D
  //   r_penumra(x)  = R_body + x * (R_sun + R_body) / D
  // where D is the distance from the body to the Sun.
  function shadowRadiiKmAtDistance({
    bodyRadiusKm,
    sunRadiusKm,
    distanceToSunKm,
    distanceFromBodyKm,
  }) {
    const D = distanceToSunKm;
    const x = distanceFromBodyKm;

    const umbraRadiusKm = bodyRadiusKm - (x * (sunRadiusKm - bodyRadiusKm)) / D;
    const penumbraRadiusKm = bodyRadiusKm + (x * (sunRadiusKm + bodyRadiusKm)) / D;
    return { umbraRadiusKm, penumbraRadiusKm };
  }

  function betaMaxDegFromImpactKm({ maxImpactKm, distanceKm }) {
    if (!(maxImpactKm > 0) || !(distanceKm > 0)) return 0;
    const s = Math.min(1, maxImpactKm / distanceKm);
    return radToDeg(Math.asin(s));
  }

  // Physically-motivated eclipse limits.
  //
  // Output values are *geocentric* maximum |β| (ecliptic latitude) in degrees for:
  // - Solar eclipses anywhere on Earth (partial/central), accounting for Earth radius (parallax)
  // - Lunar eclipses at the Moon (penumbral/umbral/total), accounting for Moon radius
  function eclipseThresholdsDeg({
    earthMoonDistanceKm,
    earthRadiusKm = 6371,
    moonRadiusKm = 1737.4,
    sunRadiusKm = 696000,
    auKm = 149597870.7,
  }) {
    const D_EM = earthMoonDistanceKm;

    // Lunar eclipse (Earth casts shadow at the Moon).
    const earthShadowAtMoon = shadowRadiiKmAtDistance({
      bodyRadiusKm: earthRadiusKm,
      sunRadiusKm,
      distanceToSunKm: auKm,
      distanceFromBodyKm: D_EM,
    });

    const bTotalLunarKm = Math.max(0, earthShadowAtMoon.umbraRadiusKm - moonRadiusKm);
    const bUmbralLunarKm = earthShadowAtMoon.umbraRadiusKm + moonRadiusKm;
    const bPenumbralLunarKm = earthShadowAtMoon.penumbraRadiusKm + moonRadiusKm;

    const lunarTotalDeg = betaMaxDegFromImpactKm({ maxImpactKm: bTotalLunarKm, distanceKm: D_EM });
    const lunarUmbralDeg = betaMaxDegFromImpactKm({ maxImpactKm: bUmbralLunarKm, distanceKm: D_EM });
    const lunarPenumbralDeg = betaMaxDegFromImpactKm({ maxImpactKm: bPenumbralLunarKm, distanceKm: D_EM });

    // Solar eclipse (Moon casts shadow toward Earth). The condition for an eclipse
    // somewhere on Earth includes Earth's radius (geocenter parallax).
    const moonShadowAtEarth = shadowRadiiKmAtDistance({
      bodyRadiusKm: moonRadiusKm,
      sunRadiusKm,
      distanceToSunKm: auKm,
      distanceFromBodyKm: D_EM,
    });

    const bSolarPartialKm = earthRadiusKm + moonShadowAtEarth.penumbraRadiusKm;
    const bSolarCentralKm = earthRadiusKm + Math.abs(moonShadowAtEarth.umbraRadiusKm);

    const solarPartialDeg = betaMaxDegFromImpactKm({ maxImpactKm: bSolarPartialKm, distanceKm: D_EM });
    const solarCentralDeg = betaMaxDegFromImpactKm({ maxImpactKm: bSolarCentralKm, distanceKm: D_EM });

    return {
      solarCentralDeg,
      solarPartialDeg,
      lunarTotalDeg,
      lunarUmbralDeg,
      lunarPenumbralDeg,
      _debug: {
        earthShadowAtMoon,
        moonShadowAtEarth,
      },
    };
  }

  function lunarEclipseTypeFromBetaDeg({
    betaDeg,
    earthMoonDistanceKm,
    earthRadiusKm = 6371,
    moonRadiusKm = 1737.4,
    sunRadiusKm = 696000,
    auKm = 149597870.7,
  }) {
    const D_EM = earthMoonDistanceKm;
    const absBetaRad = Math.abs(degToRad(betaDeg));
    const impactKm = D_EM * Math.sin(absBetaRad);

    const { umbraRadiusKm, penumbraRadiusKm } = shadowRadiiKmAtDistance({
      bodyRadiusKm: earthRadiusKm,
      sunRadiusKm,
      distanceToSunKm: auKm,
      distanceFromBodyKm: D_EM,
    });

    const totalLimitKm = umbraRadiusKm - moonRadiusKm;
    const umbralLimitKm = umbraRadiusKm + moonRadiusKm;
    const penumbralLimitKm = penumbraRadiusKm + moonRadiusKm;

    if (totalLimitKm > 0 && impactKm <= totalLimitKm) {
      return { type: 'total-lunar' };
    }
    if (impactKm <= umbralLimitKm) {
      return { type: 'partial-lunar' };
    }
    if (impactKm <= penumbralLimitKm) {
      return { type: 'penumbral-lunar' };
    }
    return { type: 'none' };
  }

  function solarEclipseTypeFromBetaDeg({
    betaDeg,
    earthMoonDistanceKm,
    earthRadiusKm = 6371,
    moonRadiusKm = 1737.4,
    sunRadiusKm = 696000,
    auKm = 149597870.7,
  }) {
    const D_EM = earthMoonDistanceKm;
    const absBetaRad = Math.abs(degToRad(betaDeg));
    const impactKm = D_EM * Math.sin(absBetaRad);

    const { umbraRadiusKm, penumbraRadiusKm } = shadowRadiiKmAtDistance({
      bodyRadiusKm: moonRadiusKm,
      sunRadiusKm,
      distanceToSunKm: auKm,
      distanceFromBodyKm: D_EM,
    });

    const partialLimitKm = earthRadiusKm + penumbraRadiusKm;
    const centralLimitKm = earthRadiusKm + Math.abs(umbraRadiusKm);

    if (impactKm <= centralLimitKm) {
      return { type: umbraRadiusKm > 0 ? 'total-solar' : 'annular-solar' };
    }
    if (impactKm <= partialLimitKm) {
      return { type: 'partial-solar' };
    }
    return { type: 'none' };
  }

  // ============================================
  // Saros Cycle Detection
  // ============================================

  /**
   * Check if two eclipses are Saros-related (separated by ~6585 days).
   * @param {object} params
   * @param {number} params.daysSeparation - Days between two eclipses
   * @returns {boolean} True if within tolerance of one Saros cycle
   */
  function isSarosRelated({ daysSeparation }) {
    if (!Number.isFinite(daysSeparation)) return false;
    const absDays = Math.abs(daysSeparation);
    return Math.abs(absDays - SAROS_CYCLE_DAYS) <= CYCLE_TOLERANCE_DAYS;
  }

  /**
   * Check if two eclipses are Exeligmos-related (separated by ~19756 days).
   * Exeligmos = 3 Saros cycles; eclipses return to same longitude.
   * @param {object} params
   * @param {number} params.daysSeparation - Days between two eclipses
   * @returns {boolean} True if within tolerance of one Exeligmos cycle
   */
  function isExeligmosRelated({ daysSeparation }) {
    if (!Number.isFinite(daysSeparation)) return false;
    const absDays = Math.abs(daysSeparation);
    return Math.abs(absDays - EXELIGMOS_CYCLE_DAYS) <= CYCLE_TOLERANCE_DAYS;
  }

  return {
    SAROS_CYCLE_DAYS,
    EXELIGMOS_CYCLE_DAYS,
    normalizeAngleDeg,
    angularSeparationDeg,
    phaseAngleDeg,
    eclipticLatitudeDeg,
    nearestNodeDistanceDeg,
    betaFromDeltaLambdaDeg,
    deltaLambdaFromBetaDeg,
    shadowRadiiKmAtDistance,
    eclipseThresholdsDeg,
    lunarEclipseTypeFromBetaDeg,
    solarEclipseTypeFromBetaDeg,
    isSarosRelated,
    isExeligmosRelated,
  };
});
