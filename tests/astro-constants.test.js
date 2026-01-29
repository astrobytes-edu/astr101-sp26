const test = require('node:test');
const assert = require('node:assert/strict');

const AstroConstants = require('../demos/_assets/physics/astro-constants.js');

test('AstroConstants exposes exact day and Julian year in seconds', () => {
  assert.equal(AstroConstants.TIME.DAY_S, 86400);
  assert.equal(AstroConstants.TIME.JULIAN_YEAR_S, 31557600);
  assert.equal(AstroConstants.TIME.YEAR_S, AstroConstants.TIME.JULIAN_YEAR_S);
});

test('AstroConstants exposes IAU AU length in km and derived cm per AU', () => {
  assert.equal(AstroConstants.LENGTH.KM_PER_AU, 149597870.7);
  assert.equal(AstroConstants.LENGTH.M_PER_AU, 149597870.7 * 1000);
  assert.equal(AstroConstants.LENGTH.CM_PER_AU, 149597870.7 * 1000 * 100);
});

test('AstroConstants provides teaching-unit gravity normalization (G = 4π²)', () => {
  assert.ok(Math.abs(AstroConstants.GRAV.G_AU3_YR2_PER_SOLAR_MASS - 4 * Math.PI * Math.PI) < 1e-15);
});

test('AstroConstants derives a positive draconic month from sidereal month + node regression', () => {
  assert.ok(Number.isFinite(AstroConstants.TIME.MEAN_DRACONIC_MONTH_DAYS));
  assert.ok(AstroConstants.TIME.MEAN_DRACONIC_MONTH_DAYS > 0);
  assert.ok(AstroConstants.TIME.MEAN_DRACONIC_MONTH_DAYS < AstroConstants.TIME.MEAN_SIDEREAL_MONTH_DAYS);
});

test('AstroConstants exposes distance presets (AU, LY, PC in km)', () => {
  assert.equal(AstroConstants.LENGTH.KM_PER_AU, 149597870.7);
  assert.ok(Math.abs(AstroConstants.LENGTH.KM_PER_LY - 9.461e12) / 9.461e12 < 0.001);
  assert.ok(Math.abs(AstroConstants.LENGTH.KM_PER_PC - 3.086e13) / 3.086e13 < 0.001);
});

