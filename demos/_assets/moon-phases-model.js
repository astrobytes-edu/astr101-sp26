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

  // Approximate Moon rise/set times based on phase angle.
  //
  // Teaching model: At equinox with 12h day, the Sun rises at 06:00 and sets at 18:00.
  // The Moon's rise/set times depend on its angular separation from the Sun:
  //   - Full Moon (0°): opposite Sun → rises at sunset (18:00), sets at sunrise (06:00)
  //   - New Moon (180°): same direction as Sun → rises at sunrise (06:00), sets at sunset (18:00)
  //   - First Quarter (270°): 90° ahead → rises at noon (12:00), sets at midnight (00:00)
  //   - Third Quarter (90°): 90° behind → rises at midnight (00:00), sets at noon (12:00)
  //
  // Formula: rise/set shifts by (phaseAngle / 360) * 24 hours from the Sun's times.
  // This is a simplified model ignoring latitude, season, and orbital mechanics.
  function moonRiseSetHoursFromPhase(angleDeg) {
    // Normalize angle to 0-360
    const normalized = ((angleDeg % 360) + 360) % 360;

    // Sun rises at 06:00, sets at 18:00 (equinox reference)
    const sunRise = 6;
    const sunSet = 18;

    // Moon position relative to Sun determines rise/set times
    // Demo convention: 0° = Full (opposite Sun), 180° = New (with Sun)
    // At 0° (Full): Moon is opposite Sun → rises when Sun sets (shift +12h)
    // At 180° (New): Moon is with Sun → rises when Sun rises (shift 0h)
    // At 90° (Third Quarter): Moon lags Sun by 90° → rises at midnight (shift -6h)
    // At 270° (First Quarter): Moon leads Sun by 90° → rises at noon (shift +6h)
    // Shift = (angleDeg - 180) / 360 * 24 hours
    const shiftHours = ((normalized - 180) / 360) * 24;

    let riseHour = (sunRise + shiftHours + 24) % 24;
    let setHour = (sunSet + shiftHours + 24) % 24;

    return {
      riseHour: Math.round(riseHour * 10) / 10,
      setHour: Math.round(setHour * 10) / 10,
    };
  }

  return {
    illuminationFractionFromMoonAngleDeg,
    moonRiseSetHoursFromPhase,
  };
});

