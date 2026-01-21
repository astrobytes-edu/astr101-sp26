/**
 * Kepler's Laws Sandbox
 * Interactive orbital mechanics demonstration
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  // Physical constants
  const G = 6.674e-11;                    // N⋅m²/kg² (SI)
  const M_SUN = 1.989e30;                 // kg
  const AU_KM = 1.496e8;                  // km per AU
  const AU_M = 1.496e11;                  // m per AU
  const YEAR_S = 3.156e7;                 // seconds per year

  // SVG layout
  const SVG_CENTER = { x: 300, y: 200 };
  const SVG_SCALE = 150;                  // pixels per AU at a=1

  // Slider ranges
  const A_MIN = 0.3;                      // AU
  const A_MAX = 40;                       // AU
  const E_MIN = 0;
  const E_MAX = 0.99;
  const M_MIN = 0.1;                      // M☉
  const M_MAX = 10;                       // M☉

  // ============================================
  // State
  // ============================================

  const state = {
    mode: 'kepler',          // 'kepler' | 'newton'
    units: '101',            // '101' | '201'
    a: 1.0,                  // semi-major axis (AU)
    e: 0.017,                // eccentricity
    M: 1.0,                  // star mass (M☉)
    theta: 0,                // true anomaly (radians)
    t: 0,                    // time (years)
    playing: false,
    speed: 1.0,
    animationId: null,

    // Overlay visibility
    overlays: {
      foci: true,
      apsides: true,
      equalAreas: false,
      vectors: false
    }
  };

  // ============================================
  // DOM Elements
  // ============================================

  let elements = {};

  function initElements() {
    elements = {
      // TODO: populate in Task 2
    };
  }

  // ============================================
  // Physics Calculations
  // ============================================

  // TODO: implement in Task 2

  // ============================================
  // Rendering
  // ============================================

  // TODO: implement in Task 3

  // ============================================
  // Controls
  // ============================================

  // TODO: implement in Task 4

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    console.log('Kepler\'s Laws Sandbox initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
