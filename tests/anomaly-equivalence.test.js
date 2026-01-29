const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const Keplers = require('../demos/_assets/keplers-laws-model.js');
const Binary = require('../demos/_assets/binary-orbits-model.js');

function wrapPi(rad) {
  const twoPi = 2 * Math.PI;
  let x = ((rad + Math.PI) % twoPi + twoPi) % twoPi - Math.PI;
  if (x <= -Math.PI) x += twoPi;
  return x;
}

test('KeplersLawsModel anomaly conversions match TwoBodyAnalytic (mod 2π)', () => {
  const eValues = [0, 0.3, 0.6, 0.9];
  const degValues = [0, 20, 60, 120, 179, 240, 300];

  for (const e of eValues) {
    for (const deg of degValues) {
      const thetaRad = (deg * Math.PI) / 180;

      const M1 = Keplers.trueToMeanAnomalyRad({ thetaRad, e });
      const M2 = TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
      assert.ok(Math.abs(wrapPi(M1 - M2)) < 1e-10);

      const t1 = Keplers.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      const t2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      assert.ok(Math.abs(wrapPi(t1 - t2)) < 1e-10);
    }
  }
});

test('BinaryOrbitsModel anomaly conversions match TwoBodyAnalytic (mod 2π)', () => {
  const eValues = [0, 0.3, 0.6, 0.9];
  const degValues = [0, 20, 60, 120, 179, 240, 300];

  for (const e of eValues) {
    for (const deg of degValues) {
      const thetaRad = (deg * Math.PI) / 180;

      const M1 = Binary.trueToMeanAnomalyRad({ thetaRad, e });
      const M2 = TwoBody.trueToMeanAnomalyRad({ thetaRad, e });
      assert.ok(Math.abs(wrapPi(M1 - M2)) < 1e-10);

      const t1 = Binary.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      const t2 = TwoBody.meanToTrueAnomalyRad({ meanAnomalyRad: M1, e });
      assert.ok(Math.abs(wrapPi(t1 - t2)) < 1e-10);
    }
  }
});

