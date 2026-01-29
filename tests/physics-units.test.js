const test = require('node:test');
const assert = require('node:assert/strict');

const AstroConstants = require('../demos/_assets/physics/astro-constants.js');
const Units = require('../demos/_assets/physics/units.js');

test('Units converts days ↔ seconds using the exact day', () => {
  assert.equal(Units.daysToSeconds(1), AstroConstants.TIME.DAY_S);
  assert.equal(Units.secondsToDays(AstroConstants.TIME.DAY_S), 1);
});

test('Units converts years ↔ seconds using the defined mechanics year', () => {
  assert.equal(Units.yearsToSeconds(1), AstroConstants.TIME.YEAR_S);
  assert.equal(Units.secondsToYears(AstroConstants.TIME.YEAR_S), 1);
});

test('Units converts AU ↔ cm exactly (from AstroConstants)', () => {
  assert.equal(Units.auToCm(1), AstroConstants.LENGTH.CM_PER_AU);
  assert.equal(Units.cmToAu(AstroConstants.LENGTH.CM_PER_AU), 1);
});

test('Units converts AU/yr speed to km/s and is consistent with definitions', () => {
  // 1 AU/yr = AU_km / year_s  km/s
  const expected = AstroConstants.LENGTH.KM_PER_AU / AstroConstants.TIME.YEAR_S;
  assert.ok(Math.abs(Units.auPerYrToKmPerS(1) - expected) < 1e-15);
  assert.ok(Math.abs(Units.kmPerSToAuPerYr(expected) - 1) < 1e-15);
});

test('Units converts AU/yr speed to cm/s and is consistent with definitions', () => {
  const expected = AstroConstants.LENGTH.CM_PER_AU / AstroConstants.TIME.YEAR_S;
  assert.ok(Math.abs(Units.auPerYrToCmPerS(1) - expected) < 1e-15);
  assert.ok(Math.abs(Units.cmPerSToAuPerYr(expected) - 1) < 1e-15);
});

test('Units converts AU/yr^2 acceleration to cm/s^2 and inverts', () => {
  const expected = AstroConstants.LENGTH.CM_PER_AU / (AstroConstants.TIME.YEAR_S * AstroConstants.TIME.YEAR_S);
  assert.ok(Math.abs(Units.auPerYr2ToCmPerS2(1) - expected) < 1e-15);
  assert.ok(Math.abs(Units.cmPerS2ToAuPerYr2(expected) - 1) < 1e-15);
});

test('Units converts AU^3/yr^2 to cm^3/s^2 (for mu)', () => {
  const one = Units.au3PerYr2ToCm3PerS2(1);
  const expected = Math.pow(AstroConstants.LENGTH.CM_PER_AU, 3) / Math.pow(AstroConstants.TIME.YEAR_S, 2);
  assert.ok(Math.abs(one - expected) / expected < 1e-15);
  assert.ok(Math.abs(Units.cm3PerS2ToAu3PerYr2(expected) - 1) < 1e-15);
});

// Angle conversion tests
const AstroUnits = Units;  // Alias for consistency with plan

test('degToRad converts 180° to π radians', () => {
  const result = AstroUnits.degToRad(180);
  assert.ok(Math.abs(result - Math.PI) < 1e-12, `expected π, got ${result}`);
});

test('radToDeg converts π radians to 180°', () => {
  const result = AstroUnits.radToDeg(Math.PI);
  assert.ok(Math.abs(result - 180) < 1e-12, `expected 180, got ${result}`);
});

test('degToRad and radToDeg are inverses', () => {
  const original = 45;
  const result = AstroUnits.radToDeg(AstroUnits.degToRad(original));
  assert.ok(Math.abs(result - original) < 1e-12, `expected ${original}, got ${result}`);
});
