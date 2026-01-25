const test = require('node:test');
const assert = require('node:assert/strict');

const ChallengeEngine = require('../demos/_assets/challenge-engine.js');

test('ChallengeEngine._clearFeedback is null-safe', () => {
  const engine = new ChallengeEngine(
    [{ id: 'c1', question: 'q', type: 'boolean', answer: true, hints: [] }],
    { showUI: false }
  );

  engine.ui = { querySelector: () => null };

  assert.doesNotThrow(() => engine._clearFeedback());
});

test('ChallengeEngine._showFeedback is null-safe', () => {
  const engine = new ChallengeEngine(
    [{ id: 'c1', question: 'q', type: 'boolean', answer: true, hints: [] }],
    { showUI: false }
  );

  engine.ui = { querySelector: () => null };

  assert.doesNotThrow(() => engine._showFeedback('correct', 'ok'));
});

test('ChallengeEngine calls onStop from stop()', () => {
  let called = false;
  const engine = new ChallengeEngine(
    [{ id: 'c1', question: 'q', type: 'boolean', answer: true, hints: [] }],
    { showUI: false, onStop: () => { called = true; } }
  );

  engine.stop();
  assert.equal(called, true);
});

