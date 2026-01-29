const test = require('node:test');
const assert = require('node:assert/strict');

const MoonPhasesModel = require('../demos/_assets/moon-phases-model.js');

test('illuminationFraction: Full Moon = 1, New Moon = 0 (demo angle convention)', () => {
  assert.equal(MoonPhasesModel.illuminationFractionFromMoonAngleDeg(0), 1);
  assert.equal(MoonPhasesModel.illuminationFractionFromMoonAngleDeg(180), 0);
});

test('illuminationFraction: quarter = 0.5', () => {
  const eps = 1e-12;
  assert.ok(Math.abs(MoonPhasesModel.illuminationFractionFromMoonAngleDeg(90) - 0.5) < eps);
  assert.ok(Math.abs(MoonPhasesModel.illuminationFractionFromMoonAngleDeg(270) - 0.5) < eps);
});

test('moonRiseSetHoursFromPhase: Full Moon rises at sunset (~18:00), sets at sunrise (~06:00)', () => {
  assert.ok(typeof MoonPhasesModel.moonRiseSetHoursFromPhase === 'function', 'expected moonRiseSetHoursFromPhase export');
  const fullMoon = MoonPhasesModel.moonRiseSetHoursFromPhase(0); // 0° = Full Moon
  // Full Moon rises ~6pm (18:00), sets ~6am (06:00) at equinox
  assert.ok(Math.abs(fullMoon.riseHour - 18) < 1, `expected rise ~18, got ${fullMoon.riseHour}`);
  assert.ok(Math.abs(fullMoon.setHour - 6) < 1, `expected set ~6, got ${fullMoon.setHour}`);
});

test('moonRiseSetHoursFromPhase: New Moon rises at sunrise (~06:00), sets at sunset (~18:00)', () => {
  const newMoon = MoonPhasesModel.moonRiseSetHoursFromPhase(180); // 180° = New Moon
  // New Moon rises ~6am, sets ~6pm (follows the Sun)
  assert.ok(Math.abs(newMoon.riseHour - 6) < 1, `expected rise ~6, got ${newMoon.riseHour}`);
  assert.ok(Math.abs(newMoon.setHour - 18) < 1, `expected set ~18, got ${newMoon.setHour}`);
});

test('moonRiseSetHoursFromPhase: First Quarter rises at noon (~12:00), sets at midnight (~00:00)', () => {
  const firstQuarter = MoonPhasesModel.moonRiseSetHoursFromPhase(270); // 270° = First Quarter in demo convention
  // First Quarter rises ~noon, sets ~midnight
  assert.ok(Math.abs(firstQuarter.riseHour - 12) < 1, `expected rise ~12, got ${firstQuarter.riseHour}`);
  assert.ok(firstQuarter.setHour < 1 || firstQuarter.setHour > 23, `expected set ~0/24, got ${firstQuarter.setHour}`);
});

test('moonRiseSetHoursFromPhase: Third Quarter rises at midnight (~00:00), sets at noon (~12:00)', () => {
  const thirdQuarter = MoonPhasesModel.moonRiseSetHoursFromPhase(90); // 90° = Third Quarter in demo convention
  // Third Quarter rises ~midnight, sets ~noon
  assert.ok(thirdQuarter.riseHour < 1 || thirdQuarter.riseHour > 23, `expected rise ~0/24, got ${thirdQuarter.riseHour}`);
  assert.ok(Math.abs(thirdQuarter.setHour - 12) < 1, `expected set ~12, got ${thirdQuarter.setHour}`);
});
