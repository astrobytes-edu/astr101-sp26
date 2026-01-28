/* Seasons model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.SeasonsModel)
 * and in Node tests (via require()).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.SeasonsModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  function effectiveObliquityDegrees(obliquityDeg) {
    const t = Math.abs(obliquityDeg % 360);
    const folded = t > 180 ? 360 - t : t; // 0..180
    return folded > 90 ? 180 - folded : folded; // 0..90
  }

  // Solar declination from the obliquity geometry:
  //   δ = asin( sin ε * sin L )
  // where L is the Sun's ecliptic longitude measured from the (March) equinox.
  //
  // We approximate L as uniform in time: L ≈ 2π * (day - dayOfMarchEquinox) / tropicalYearDays.
  function sunDeclinationDeg({
    dayOfYear,
    axialTiltDeg,
    tropicalYearDays = 365.2422,
    dayOfMarchEquinox = 80,
  }) {
    const eps = effectiveObliquityDegrees(axialTiltDeg);
    const L = (2 * Math.PI * (dayOfYear - dayOfMarchEquinox)) / tropicalYearDays;
    const deltaRad = Math.asin(Math.sin(degToRad(eps)) * Math.sin(L));
    return radToDeg(deltaRad);
  }

  function dayLengthHours({ latitudeDeg, sunDeclinationDeg }) {
    const phi = (latitudeDeg * Math.PI) / 180;
    const delta = (sunDeclinationDeg * Math.PI) / 180;
    const cosH = -Math.tan(phi) * Math.tan(delta);

    if (cosH < -1) return 24;
    if (cosH > 1) return 0;

    const Hdeg = (Math.acos(cosH) * 180) / Math.PI;
    return (2 * Hdeg) / 15;
  }

  function sunNoonAltitudeDeg({ latitudeDeg, sunDeclinationDeg }) {
    return 90 - Math.abs(latitudeDeg - sunDeclinationDeg);
  }

  // Earth–Sun distance (AU) in a simple eccentric-orbit toy model:
  // r ≈ 1 - e cos(2π * (t - t_peri) / year)
  //
  // This is not a Kepler solver; it's a pedagogical approximation that preserves
  // the key fact that Earth's distance variation is small (~±1.7%).
  function earthSunDistanceAu({
    dayOfYear,
    yearDays = 365.2422,
    eccentricity = 0.017,
    perihelionDay = 3,
  }) {
    const daysFromPerihelion = dayOfYear - perihelionDay;
    const angle = (2 * Math.PI * daysFromPerihelion) / yearDays;
    return 1 - eccentricity * Math.cos(angle);
  }

  // Orbital angle (radians) for a given day-of-year in the same toy model.
  // Anchors perihelion at angle 0.
  function orbitAngleRadFromDay({
    dayOfYear,
    yearDays = 365.2422,
    perihelionDay = 3,
  }) {
    const daysFromPerihelion = dayOfYear - perihelionDay;
    return (2 * Math.PI * daysFromPerihelion) / yearDays;
  }

  return {
    effectiveObliquityDegrees,
    sunDeclinationDeg,
    dayLengthHours,
    sunNoonAltitudeDeg,
    earthSunDistanceAu,
    orbitAngleRadFromDay,
  };
});
