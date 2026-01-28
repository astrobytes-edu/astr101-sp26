const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readText(...segments) {
  const filePath = path.join(__dirname, '..', ...segments);
  return fs.readFileSync(filePath, 'utf8');
}

test('Seasons has an explicit not-to-scale disclaimer', () => {
  const html = readText('demos', 'seasons', 'index.html');
  assert.match(html, /not to scale/i);
});

test('Angular Size notes internal units are km', () => {
  const html = readText('demos', 'angular-size', 'index.html');
  assert.match(html, /internal units\s*=\s*km/i);
});

test('Moon Phases loads the shared MoonPhasesModel', () => {
  const html = readText('demos', 'moon-phases', 'index.html');
  assert.match(html, /_assets\/moon-phases-model\.js/);
});

