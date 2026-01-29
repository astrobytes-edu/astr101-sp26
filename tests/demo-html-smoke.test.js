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

test('Kepler’s Laws loads the shared KeplersLawsModel', () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /_assets\/keplers-laws-model\.js/);
});

test('Kepler’s Laws labels animation speed units', () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /years\/sec/i);
});

test("Kepler's Laws includes a model note", () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /model note/i);
});

test("Kepler's Laws includes keyboard shortcuts help", () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /keyboard shortcuts/i);
});

test('Seasons hour-angle grid is not hardcoded as spoke-like lines', () => {
  const html = readText('demos', 'seasons', 'index.html');
  assert.doesNotMatch(html, /<line\\b[^>]*\\bclass\\s*=\\s*\"hour-grid\"/i);
});

test('Binary Orbits readouts include a collapsed advanced section for first-time users', () => {
  const html = readText('demos', 'binary-orbits', 'index.html');
  assert.match(html, /<details\b[^>]*>\s*<summary>\s*(Advanced|More)\s+readouts/i);
});

test('Conservation Laws includes animation controls', () => {
  const html = readText('demos', 'conservation-laws', 'index.html');
  assert.match(html, /id="btn-play"/);
  assert.match(html, /id="btn-pause"/);
  assert.match(html, /id="btn-reset"/);
});

test("Kepler's Laws includes an equal-time markers group", () => {
  const html = readText('demos', 'keplers-laws', 'index.html');
  assert.match(html, /id="equal-time-markers"/);
});

test('EM Spectrum loads the shared EMSpectrumModel', () => {
  const html = readText('demos', 'em-spectrum', 'index.html');
  assert.match(html, /_assets\/em-spectrum-model\.js/);
});

test('Parallax Distance loads the shared ParallaxDistanceModel', () => {
  const html = readText('demos', 'parallax-distance', 'index.html');
  assert.match(html, /_assets\/parallax-distance-model\.js/);
});
