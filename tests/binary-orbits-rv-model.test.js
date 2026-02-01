const test = require('node:test');
const assert = require('node:assert/strict');

const BinaryOrbitsModel = require('../demos/_assets/binary-orbits-model.js');

test('radialVelocityKms: face-on (sin i = 0) produces zero RV', () => {
  assert.equal(
    BinaryOrbitsModel.radialVelocityKms({
      vxKms: 10,
      vyKms: 0,
      lineOfSightUnit: { x: 1, y: 0 },
      sinI: 0,
    }),
    0
  );
});

test('radialVelocityKms: receding positive when velocity aligns with +LOS', () => {
  const vr = BinaryOrbitsModel.radialVelocityKms({
    vxKms: 10,
    vyKms: 0,
    lineOfSightUnit: { x: 1, y: 0 },
    sinI: 1,
  });
  assert.equal(vr, 10);
});

