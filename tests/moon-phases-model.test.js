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
