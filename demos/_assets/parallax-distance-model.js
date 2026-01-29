/* Parallax & Distance model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.ParallaxDistanceModel)
 * and in Node tests (via require()).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.ParallaxDistanceModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // p(") = 1 / d(pc)
  function parallaxFromDistance(dPc) {
    if (dPc <= 0) return null;
    return 1 / dPc;
  }

  // d(pc) = 1 / p(")
  function distanceFromParallax(pArcsec) {
    if (pArcsec <= 0) return null;
    return 1 / pArcsec;
  }

  // January (yearFraction=0): Earth at +x, July (0.5): Earth at -x.
  function earthPosition(yearFraction) {
    const angle = yearFraction * 2 * Math.PI;
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }

  // Nearby star appears to shift opposite the Earth's x-position.
  function apparentShift(yearFraction, parallaxArcsec) {
    if (!parallaxArcsec) return 0;
    const earthPos = earthPosition(yearFraction);
    return -earthPos.x * parallaxArcsec;
  }

  return {
    parallaxFromDistance,
    distanceFromParallax,
    earthPosition,
    apparentShift,
  };
});

