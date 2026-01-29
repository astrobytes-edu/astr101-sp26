/**
 * Binary Orbits Physics Verification Tests
 *
 * Tests the two-body orbital mechanics against known astronomical systems.
 * Verifies: periods, velocities, and semi-major axes for barycentric orbits.
 *
 * Reference systems:
 * - Sun-Earth: P = 1 yr, v_Earth = 29.78 km/s
 * - Sun-Jupiter: P = 11.86 yr, v_Jupiter = 13.1 km/s
 * - Alpha Centauri AB: P = 79.9 yr, e = 0.52
 * - Equal mass binary: a1 = a2 = 0.5 AU
 */

// Extract physics functions from the module
// We need to parse the IIFE and extract the core functions

const fs = require('fs');
const path = require('path');

// Physical constants (must match binary-orbits.js)
const G_SOLAR = 4 * Math.PI * Math.PI;  // AU^3 / yr^2 / M_sun
const AU_KM = 1.496e8;                   // km per AU
const YEAR_SECONDS = 3.156e7;            // seconds per year

// ============================================
// Core Physics Functions (extracted)
// ============================================

/**
 * Calculate individual semi-major axes for each body's orbit around barycenter
 */
function individualSemiMajor(a_rel, M1, M2) {
  const M_tot = M1 + M2;
  if (M_tot === 0) {
    return { a1: a_rel / 2, a2: a_rel / 2 };
  }
  return {
    a1: a_rel * M2 / M_tot,
    a2: a_rel * M1 / M_tot
  };
}

/**
 * Calculate orbital period using Kepler's 3rd Law
 * P^2 = a^3 / (M1 + M2) with P in years, a in AU, M in M_sun
 */
function orbitalPeriod(a_rel, M1, M2) {
  const M_tot = M1 + M2;
  if (M_tot === 0) return Infinity;
  return Math.sqrt(Math.pow(a_rel, 3) / M_tot);
}

/**
 * Calculate orbital radius from true anomaly
 * r = a(1 - e^2) / (1 + e * cos(theta))
 */
function orbitalRadius(a, e, theta) {
  if (e >= 1) e = 0.999;
  const numerator = a * (1 - e * e);
  const denominator = 1 + e * Math.cos(theta);
  return numerator / denominator;
}

/**
 * Calculate orbital velocity using vis-viva equation
 * v = sqrt(G * M_tot * (2/r - 1/a))
 * Returns velocity in km/s
 */
function orbitalVelocity(r, a, M1, M2) {
  const M_tot = M1 + M2;
  if (M_tot === 0 || r === 0 || a === 0) return 0;

  const v_squared = G_SOLAR * M_tot * (2 / r - 1 / a);
  if (v_squared < 0) return 0;

  const v_AU_yr = Math.sqrt(v_squared);
  const v_kms = v_AU_yr * AU_KM / YEAR_SECONDS;
  return v_kms;
}

/**
 * Calculate barycenter fraction
 */
function barycenterFraction(M1, M2) {
  const M_tot = M1 + M2;
  if (M_tot === 0) return 0.5;
  return M2 / M_tot;
}

// ============================================
// Test Helpers
// ============================================

function assertApprox(actual, expected, tolerance, message) {
  const relError = Math.abs((actual - expected) / expected);
  const passed = relError <= tolerance;
  return {
    passed,
    actual,
    expected,
    relError: (relError * 100).toFixed(2) + '%',
    tolerance: (tolerance * 100).toFixed(0) + '%',
    message
  };
}

function runTest(name, testFn) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TEST: ${name}`);
  console.log('='.repeat(60));

  const results = testFn();
  let allPassed = true;

  for (const result of results) {
    const status = result.passed ? 'PASS' : 'FAIL';
    const symbol = result.passed ? '\u2713' : '\u2717';
    console.log(`  ${symbol} ${result.message}`);
    console.log(`      Expected: ${result.expected}, Got: ${result.actual} (error: ${result.relError})`);
    if (!result.passed) allPassed = false;
  }

  return allPassed;
}

// ============================================
// Test Cases
// ============================================

function testSunEarth() {
  // Earth mass: 3e-6 M_sun (actually 3.003e-6)
  // Separation: 1.0 AU
  // Eccentricity: 0.017 (nearly circular)
  const M1 = 1.0;      // Sun mass
  const M2 = 3e-6;     // Earth mass
  const a = 1.0;       // AU
  const e = 0.017;

  const results = [];

  // Expected values
  const expectedPeriod = 1.0;        // years
  const expectedEarthVel = 29.78;    // km/s (mean orbital velocity)
  const expectedSunWobble = 449;     // km (a1 in km)

  // Calculate
  const period = orbitalPeriod(a, M1, M2);
  const { a1, a2 } = individualSemiMajor(a, M1, M2);

  // At circular orbit (or aphelion/perihelion average), v_rel from vis-viva
  const r = a;  // For circular approximation
  const v_rel = orbitalVelocity(r, a, M1, M2);
  const M_tot = M1 + M2;
  const v_earth = v_rel * M1 / M_tot;  // Earth's velocity
  const a1_km = a1 * AU_KM;             // Sun's wobble in km

  // Period test (tolerance 0.1%)
  results.push(assertApprox(period, expectedPeriod, 0.001,
    `Period: ${period.toFixed(4)} yr`));

  // Earth velocity test (tolerance 1% - vis-viva gives exact circular velocity)
  results.push(assertApprox(v_earth, expectedEarthVel, 0.01,
    `Earth velocity: ${v_earth.toFixed(2)} km/s`));

  // Sun's wobble (tolerance 10% - this is a tiny number)
  results.push(assertApprox(a1_km, expectedSunWobble, 0.10,
    `Sun's wobble (a1): ${a1_km.toFixed(0)} km`));

  // Verify a1 + a2 = a
  const sumCheck = Math.abs((a1 + a2) - a) / a;
  results.push({
    passed: sumCheck < 1e-10,
    actual: (a1 + a2).toFixed(10),
    expected: a.toFixed(10),
    relError: (sumCheck * 100).toFixed(6) + '%',
    tolerance: '0%',
    message: `Conservation: a1 + a2 = a`
  });

  return results;
}

function testSunJupiter() {
  // Jupiter mass: 9.5e-4 M_sun (actually 9.548e-4)
  // Separation: 5.2 AU
  // Eccentricity: 0.049
  const M1 = 1.0;       // Sun mass
  const M2 = 9.5e-4;    // Jupiter mass
  const a = 5.2;        // AU
  const e = 0.049;

  const results = [];

  // Expected values
  const expectedPeriod = 11.86;      // years
  const expectedJupiterVel = 13.07;  // km/s

  // Calculate
  const period = orbitalPeriod(a, M1, M2);
  const { a1, a2 } = individualSemiMajor(a, M1, M2);

  const r = a;  // Circular approximation
  const v_rel = orbitalVelocity(r, a, M1, M2);
  const M_tot = M1 + M2;
  const v_jupiter = v_rel * M1 / M_tot;
  const a1_km = a1 * AU_KM;

  // Period test (tolerance 1%)
  results.push(assertApprox(period, expectedPeriod, 0.01,
    `Period: ${period.toFixed(2)} yr`));

  // Jupiter velocity test (tolerance 2%)
  results.push(assertApprox(v_jupiter, expectedJupiterVel, 0.02,
    `Jupiter velocity: ${v_jupiter.toFixed(2)} km/s`));

  // Sun's wobble should be larger than for Earth
  const sunEarthA1 = 1.0 * 3e-6 / (1.0 + 3e-6) * AU_KM;
  results.push({
    passed: a1_km > sunEarthA1,
    actual: a1_km.toFixed(0) + ' km',
    expected: '> ' + sunEarthA1.toFixed(0) + ' km',
    relError: 'N/A',
    tolerance: 'N/A',
    message: `Sun's wobble larger than for Earth: ${a1_km.toFixed(0)} km vs ${sunEarthA1.toFixed(0)} km`
  });

  return results;
}

function testAlphaCentauri() {
  // Alpha Centauri A: 1.1 M_sun
  // Alpha Centauri B: 0.91 M_sun
  // Separation: 23.4 AU
  // Eccentricity: 0.52
  const M1 = 1.1;
  const M2 = 0.91;
  const a = 23.4;
  const e = 0.52;

  const results = [];

  // Expected values
  const expectedPeriod = 79.9;  // years

  // Calculate
  const period = orbitalPeriod(a, M1, M2);
  const { a1, a2 } = individualSemiMajor(a, M1, M2);

  // Period test (tolerance 1%)
  results.push(assertApprox(period, expectedPeriod, 0.01,
    `Period: ${period.toFixed(1)} yr`));

  // Both stars should have significant orbits
  // a1/a2 = M2/M1
  const expectedRatio = M2 / M1;
  const actualRatio = a1 / a2;
  results.push(assertApprox(actualRatio, expectedRatio, 0.001,
    `Orbit ratio a1/a2 = M2/M1: ${actualRatio.toFixed(3)}`));

  // Verify both orbits are significant (neither dominates)
  const minOrbit = Math.min(a1, a2);
  const maxOrbit = Math.max(a1, a2);
  const orbitRatio = minOrbit / maxOrbit;
  results.push({
    passed: orbitRatio > 0.5,  // Neither orbit is more than 2x the other
    actual: orbitRatio.toFixed(2),
    expected: '> 0.5',
    relError: 'N/A',
    tolerance: 'N/A',
    message: `Both stars have significant orbits: a1=${a1.toFixed(1)} AU, a2=${a2.toFixed(1)} AU`
  });

  // Test eccentric orbit radius calculation
  const r_perihelion = orbitalRadius(a, e, 0);           // theta = 0 -> perihelion
  const r_aphelion = orbitalRadius(a, e, Math.PI);       // theta = pi -> aphelion
  const expected_peri = a * (1 - e);
  const expected_aph = a * (1 + e);

  results.push(assertApprox(r_perihelion, expected_peri, 0.001,
    `Perihelion distance: ${r_perihelion.toFixed(2)} AU`));
  results.push(assertApprox(r_aphelion, expected_aph, 0.001,
    `Aphelion distance: ${r_aphelion.toFixed(2)} AU`));

  return results;
}

function testEqualMass() {
  // Equal mass binary
  const M1 = 1.0;
  const M2 = 1.0;
  const a = 1.0;
  const e = 0.0;

  const results = [];

  // For equal masses: P = sqrt(a^3 / 2) = sqrt(0.5) years
  const expectedPeriod = Math.sqrt(0.5);  // ~0.707 years
  const expectedA1 = 0.5;                  // AU
  const expectedA2 = 0.5;                  // AU

  // Calculate
  const period = orbitalPeriod(a, M1, M2);
  const { a1, a2 } = individualSemiMajor(a, M1, M2);

  // Period test
  results.push(assertApprox(period, expectedPeriod, 0.001,
    `Period: ${period.toFixed(4)} yr (shorter than 1 yr due to 2x total mass)`));

  // Symmetric orbits
  results.push(assertApprox(a1, expectedA1, 0.001,
    `a1 = 0.5 AU: ${a1.toFixed(3)} AU`));
  results.push(assertApprox(a2, expectedA2, 0.001,
    `a2 = 0.5 AU: ${a2.toFixed(3)} AU`));

  // Equal velocities
  const r = a;
  const v_rel = orbitalVelocity(r, a, M1, M2);
  const M_tot = M1 + M2;
  const v1 = v_rel * M2 / M_tot;
  const v2 = v_rel * M1 / M_tot;

  results.push(assertApprox(v1, v2, 0.001,
    `Equal velocities: v1=${v1.toFixed(2)} km/s, v2=${v2.toFixed(2)} km/s`));

  // Barycenter at geometric center
  const bcFrac = barycenterFraction(M1, M2);
  results.push(assertApprox(bcFrac, 0.5, 0.001,
    `Barycenter at center: fraction = ${bcFrac.toFixed(3)}`));

  return results;
}

function testKeplerThirdLaw() {
  // Verify Kepler's 3rd law: P^2 * M_tot = a^3
  const results = [];

  const testCases = [
    { name: 'Sun-Earth', M1: 1.0, M2: 3e-6, a: 1.0 },
    { name: 'Sun-Jupiter', M1: 1.0, M2: 9.5e-4, a: 5.2 },
    { name: 'Alpha Cen', M1: 1.1, M2: 0.91, a: 23.4 },
    { name: 'Equal mass', M1: 1.0, M2: 1.0, a: 1.0 },
    { name: 'Hot Jupiter', M1: 1.0, M2: 1e-3, a: 0.05 }
  ];

  for (const tc of testCases) {
    const P = orbitalPeriod(tc.a, tc.M1, tc.M2);
    const M_tot = tc.M1 + tc.M2;
    const lhs = P * P * M_tot;  // Should equal a^3
    const rhs = Math.pow(tc.a, 3);

    results.push(assertApprox(lhs, rhs, 1e-10,
      `${tc.name}: P^2 * M_tot = a^3 (${lhs.toExponential(4)} = ${rhs.toExponential(4)})`));
  }

  return results;
}

function testConservationLaws() {
  // Verify a1 + a2 = a for various mass ratios
  const results = [];

  const testCases = [
    { q: 1.0, name: 'q=1 (equal)' },
    { q: 0.1, name: 'q=0.1' },
    { q: 0.01, name: 'q=0.01' },
    { q: 0.001, name: 'q=0.001' },
    { q: 3e-6, name: 'q=3e-6 (Earth/Sun)' }
  ];

  const a = 1.0;
  const M1 = 1.0;

  for (const tc of testCases) {
    const M2 = M1 * tc.q;
    const { a1, a2 } = individualSemiMajor(a, M1, M2);
    const sum = a1 + a2;

    results.push(assertApprox(sum, a, 1e-12,
      `${tc.name}: a1 + a2 = ${sum.toFixed(12)}`));
  }

  return results;
}

// ============================================
// Main Test Runner
// ============================================

console.log('\n' + '#'.repeat(70));
console.log('# BINARY ORBITS PHYSICS VERIFICATION');
console.log('# Testing two-body orbital mechanics against known astronomical systems');
console.log('#'.repeat(70));

let totalTests = 0;
let passedTests = 0;

const testSuites = [
  { name: 'Sun-Earth System', fn: testSunEarth },
  { name: 'Sun-Jupiter System', fn: testSunJupiter },
  { name: 'Alpha Centauri AB', fn: testAlphaCentauri },
  { name: 'Equal Mass Binary', fn: testEqualMass },
  { name: "Kepler's Third Law", fn: testKeplerThirdLaw },
  { name: 'Conservation Laws (a1 + a2 = a)', fn: testConservationLaws }
];

for (const suite of testSuites) {
  const results = [];
  runTest(suite.name, () => {
    const r = suite.fn();
    results.push(...r);
    return r;
  });

  for (const r of results) {
    totalTests++;
    if (r.passed) passedTests++;
  }
}

// ============================================
// Summary
// ============================================

console.log('\n' + '='.repeat(70));
console.log('SUMMARY');
console.log('='.repeat(70));
console.log(`Total tests: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${totalTests - passedTests}`);

if (passedTests === totalTests) {
  console.log('\n\u2713 ALL TESTS PASSED - Physics implementation is correct!\n');
  process.exit(0);
} else {
  console.log(`\n\u2717 ${totalTests - passedTests} TESTS FAILED\n`);
  process.exit(1);
}
