const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('Planetary Climate Sandbox loads shared model + datasets', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'demos', 'planetary-climate-sandbox', 'index.html'), 'utf8');

  assert.match(html, /_assets\/planetary-climate-model\.js/);
  assert.match(html, /_assets\/blackbody-model\.js/);
  assert.match(html, /_assets\/spectra\/spectra-data\.v1\.js/);
  assert.match(html, /_assets\/climate\/planet-presets\.v1\.js/);
  assert.match(html, /planetary-climate-sandbox\.js/);
});

