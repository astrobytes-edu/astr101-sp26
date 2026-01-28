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

  function effectiveObliquityDegrees(obliquityDeg) {
    const t = Math.abs(obliquityDeg % 360);
    const folded = t > 180 ? 360 - t : t; // 0..180
    return folded > 90 ? 180 - folded : folded; // 0..90
  }

  function sunDeclinationDeg({ dayOfYear, axialTiltDeg }) {
    const daysFromEquinox = dayOfYear - 80; // March 21 ~ day 80
    const eps = effectiveObliquityDegrees(axialTiltDeg);
    return eps * Math.sin((2 * Math.PI * daysFromEquinox) / 365);
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

  return {
    effectiveObliquityDegrees,
    sunDeclinationDeg,
    dayLengthHours,
    sunNoonAltitudeDeg,
  };
});

