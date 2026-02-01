const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test("Binary orbits instructor script: Sun's wobble is m/s, not km/s", () => {
  const filePath = path.join(__dirname, '..', 'demos', '_instructor', 'binary-orbits', 'activities.qmd');
  const text = fs.readFileSync(filePath, 'utf8');

  // Guardrail: the incorrect unit must not appear.
  assert.doesNotMatch(text, /\b13\s*km\/s\b/i);

  // Positive assertion: ensure the corrected magnitude is present.
  assert.match(text, /\b(12|13)\s*m\/s\b/i);
});

