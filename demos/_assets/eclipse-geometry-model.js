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

  return {
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
  };
});
