/* Blackbody Radiation model utilities.
 *
 * Goal: pure functions usable both in the browser (via window.BlackbodyModel)
 * and in Node tests (via require()).
 *
 * PHYSICS (CGS units):
 * - Wien's Law: λ_peak = b / T, where b = 0.2898 cm·K
 * - Planck Function: B_λ(T) = (2hc²/λ⁵) × 1/(exp(hc/λkT) - 1)
 * - Stefan-Boltzmann: F = σT⁴
 *
 * MODEL LIMITATIONS:
 * - Temperature-to-color is a perceptual approximation, not CIE colorimetry
 * - Planck function overflow protection kicks in at exp(700)
 * - All wavelengths in cm internally; conversion helpers provided
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.BlackbodyModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // ============================================
  // Physical Constants (CGS)
  // ============================================

  const CONSTANTS = {
    c: 2.998e10,           // Speed of light (cm/s)
    h: 6.626e-27,          // Planck constant (erg·s)
    k: 1.381e-16,          // Boltzmann constant (erg/K)
    sigma: 5.670e-5,       // Stefan-Boltzmann (erg/cm²/s/K⁴)
    wien_b: 0.2898,        // Wien displacement constant (cm·K)

    // Unit conversions
    cm_to_nm: 1e7,         // cm to nm
    nm_to_cm: 1e-7,        // nm to cm

    // Solar reference values
    T_sun: 5772,           // K (IAU 2015 nominal)
    R_sun: 6.957e10,       // cm (IAU 2015 nominal)
    L_sun: 3.828e33        // erg/s (IAU 2015 nominal)
  };

  // ============================================
  // Wien's Displacement Law
  // ============================================

  /**
   * Wien's peak wavelength in cm
   * λ_peak = b / T
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (cm)
   */
  function wienPeakCm(T) {
    if (!Number.isFinite(T) || T <= 0) return NaN;
    return CONSTANTS.wien_b / T;
  }

  /**
   * Wien's peak wavelength in nm (for display)
   * @param {number} T - Temperature (K)
   * @returns {number} Peak wavelength (nm)
   */
  function wienPeakNm(T) {
    const cm = wienPeakCm(T);
    return Number.isNaN(cm) ? NaN : cm * CONSTANTS.cm_to_nm;
  }

  // ============================================
  // Planck Function
  // ============================================

  /**
   * Planck function B_λ(T) - spectral radiance
   * B_λ = (2hc²/λ⁵) × 1/(exp(hc/λkT) - 1)
   *
   * @param {number} lambda - Wavelength (cm)
   * @param {number} T - Temperature (K)
   * @returns {number} Spectral radiance (erg/s/cm²/sr/cm)
   */
  function planckFunction(lambda, T) {
    if (!Number.isFinite(lambda) || lambda <= 0) return 0;
    if (!Number.isFinite(T) || T <= 0) return 0;

    const c = CONSTANTS.c;
    const h = CONSTANTS.h;
    const k = CONSTANTS.k;

    const factor1 = (2 * h * c * c) / Math.pow(lambda, 5);
    const exponent = (h * c) / (lambda * k * T);

    // Prevent overflow for very small wavelengths or low temperatures
    if (exponent > 700) return 0;

    return factor1 / (Math.exp(exponent) - 1);
  }

  return {
    CONSTANTS,
    wienPeakCm,
    wienPeakNm,
    planckFunction,
  };
});
