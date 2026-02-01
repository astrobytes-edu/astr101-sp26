const test = require('node:test');
const assert = require('node:assert/strict');

const DopplerShiftModel = require('../demos/_assets/doppler-shift-model.js');

test('dopplerShiftNm: v = 0 → no shift', () => {
  assert.equal(DopplerShiftModel.dopplerShiftNm({ lambda0Nm: 656.28, vKms: 0 }), 656.28);
});

test('dopplerShiftNm: positive v (receding) → positive Δλ (redshift)', () => {
  const lambda0 = 500;
  const lambdaObs = DopplerShiftModel.dopplerShiftNm({ lambda0Nm: lambda0, vKms: 100 });
  assert.ok(lambdaObs > lambda0);
  assert.ok(DopplerShiftModel.deltaLambdaNm({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs }) > 0);
});

test('dopplerShiftNm: negative v (approaching) → negative Δλ (blueshift)', () => {
  const lambda0 = 500;
  const lambdaObs = DopplerShiftModel.dopplerShiftNm({ lambda0Nm: lambda0, vKms: -100 });
  assert.ok(lambdaObs < lambda0);
  assert.ok(DopplerShiftModel.deltaLambdaNm({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs }) < 0);
});

test('velocityFromShiftKms: inverts dopplerShiftNm (v << c)', () => {
  const lambda0 = 589.0;
  const v = 30; // km/s
  const lambdaObs = DopplerShiftModel.dopplerShiftNm({ lambda0Nm: lambda0, vKms: v });
  const vBack = DopplerShiftModel.velocityFromShiftKms({ lambda0Nm: lambda0, lambdaObsNm: lambdaObs });
  assert.ok(Math.abs(vBack - v) < 1e-9);
});

