/* Moon Phases model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.MoonPhasesModel)
 * and in Node tests (via require()).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.MoonPhasesModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Moon Phases demo convention:
  // - angleDeg = 0 is Full Moon
  // - angleDeg = 180 is New Moon
  function illuminationFractionFromMoonAngleDeg(angleDeg) {
    const radians = (angleDeg * Math.PI) / 180;
    return (1 + Math.cos(radians)) / 2;
  }

  return {
    illuminationFractionFromMoonAngleDeg,
  };
});

