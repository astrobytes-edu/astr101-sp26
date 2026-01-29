const test = require('node:test');
const assert = require('node:assert/strict');

const AstroUnits = require('../demos/_assets/physics/units.js');

test('AstroUnits.degToRad converts degrees to radians', () => {
  assert.ok(Math.abs(AstroUnits.degToRad(0) - 0) < 1e-15);
  assert.ok(Math.abs(AstroUnits.degToRad(90) - Math.PI / 2) < 1e-15);
  assert.ok(Math.abs(AstroUnits.degToRad(180) - Math.PI) < 1e-15);
  assert.ok(Math.abs(AstroUnits.degToRad(360) - 2 * Math.PI) < 1e-15);
  assert.ok(Math.abs(AstroUnits.degToRad(-90) - (-Math.PI / 2)) < 1e-15);
});

test('AstroUnits.radToDeg converts radians to degrees', () => {
  assert.ok(Math.abs(AstroUnits.radToDeg(0) - 0) < 1e-15);
  assert.ok(Math.abs(AstroUnits.radToDeg(Math.PI / 2) - 90) < 1e-15);
  assert.ok(Math.abs(AstroUnits.radToDeg(Math.PI) - 180) < 1e-15);
  assert.ok(Math.abs(AstroUnits.radToDeg(2 * Math.PI) - 360) < 1e-15);
  assert.ok(Math.abs(AstroUnits.radToDeg(-Math.PI / 2) - (-90)) < 1e-15);
});

test('AstroUnits.degToRad and radToDeg are inverses', () => {
  const testValues = [0, 45, 90, 135, 180, 270, 360, -45, -90];
  for (const deg of testValues) {
    assert.ok(Math.abs(AstroUnits.radToDeg(AstroUnits.degToRad(deg)) - deg) < 1e-12);
  }
});
