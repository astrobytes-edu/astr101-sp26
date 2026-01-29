const test = require('node:test');
const assert = require('node:assert/strict');

const TwoBody = require('../demos/_assets/physics/two-body-analytic.js');
const Keplers = require('../demos/_assets/keplers-laws-model.js');

test('KeplersLawsModel delegates anomaly conversions to TwoBodyAnalytic (by reference)', () => {
  assert.equal(Keplers.trueToMeanAnomalyRad, TwoBody.trueToMeanAnomalyRad);
  assert.equal(Keplers.meanToTrueAnomalyRad, TwoBody.meanToTrueAnomalyRad);
});

