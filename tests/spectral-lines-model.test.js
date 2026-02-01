const test = require('node:test');
const assert = require('node:assert/strict');

const SpectralLinesModel = require('../demos/_assets/spectral-lines-model.js');

test('normalizeLinesNm: returns sorted unique numeric values', () => {
  const out = SpectralLinesModel.normalizeLinesNm([589.5924, 588.995, 588.995, 589.5924, 486.128]);
  assert.deepEqual(out, [486.128, 588.995, 589.5924]);
});

test('buildElementCards: includes hydrogen, sodium, calcium cards with line lists', () => {
  const cards = SpectralLinesModel.buildElementCards({ verifiedOnly: true });
  for (const id of ['H_I_Balmer', 'Na_I_D', 'Ca_lines']) {
    assert.ok(Array.isArray(cards[id]?.linesNm) && cards[id].linesNm.length > 0);
  }
});

test('matchByLines: exact hydrogen match identifies hydrogen card', () => {
  const lines = [656.281, 486.128, 434.0462];
  const best = SpectralLinesModel.matchByLines({
    unknownLinesNm: lines,
    candidates: ['H_I_Balmer', 'Na_I_D', 'Ca_lines'],
    verifiedOnly: true,
  });
  assert.equal(best.id, 'H_I_Balmer');
});

