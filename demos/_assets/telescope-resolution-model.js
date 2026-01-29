/**
 * demos/_assets/telescope-resolution-model.js
 *
 * Telescope resolution physics model (diffraction, Rayleigh criterion, Airy disk).
 *
 * Physics (CGS units):
 * - Diffraction limit: theta = 1.22 * lambda / D (radians)
 * - theta (arcsec) = 251643 * lambda(cm) / D(cm)
 * - Rayleigh criterion: resolved if separation > theta_diffraction
 * - Airy disk intensity: I(x) = (2*J1(x)/x)^2 where x = pi*D*sin(theta)/lambda
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.TelescopeResolutionModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CONSTANTS = {
    // Conversion factors
    RAD_TO_ARCSEC: 206265,     // radians to arcseconds (exact: 648000/π)
    ARCSEC_TO_RAD: 4.848e-6,   // arcseconds to radians
    M_TO_CM: 100,              // meters to cm
    NM_TO_CM: 1e-7,            // nanometers to cm

    // Diffraction coefficient (in convenient units)
    // theta(arcsec) = 1.22 * 206264.806 * lambda(cm) / D(cm)
    // Exact: 1.22 * 206264.806 = 251643.1
    DIFF_COEFF: 251643.1,

    // Typical Strehl ratio for good adaptive optics
    AO_STREHL: 0.6
  };

  /**
   * Calculate diffraction limit in arcseconds
   * theta = 1.22 * lambda / D (radians)
   * theta(arcsec) = DIFF_COEFF * lambda(cm) / D(cm)
   *
   * @param {number} lambda_cm - Wavelength in cm
   * @param {number} D_cm - Aperture diameter in cm
   * @returns {number} Angular resolution in arcseconds, or NaN for invalid inputs
   */
  function diffractionLimitArcsec(lambda_cm, D_cm) {
    if (!Number.isFinite(lambda_cm) || lambda_cm <= 0) return NaN;
    if (!Number.isFinite(D_cm) || D_cm <= 0) return NaN;
    return CONSTANTS.DIFF_COEFF * lambda_cm / D_cm;
  }

  /**
   * Calculate effective resolution including atmospheric seeing
   *
   * For space telescopes (seeing = 0): resolution = diffraction limit
   * For ground without AO: resolution = max(diffraction_limit, seeing)
   * For ground with AO: resolution combines both quadratically with Strehl improvement
   *
   * @param {number} theta_diff - Diffraction limit in arcsec
   * @param {number} seeing - Atmospheric seeing in arcsec (0 for space)
   * @param {boolean} aoEnabled - Whether adaptive optics is enabled
   * @returns {number} Effective resolution in arcseconds
   */
  function effectiveResolution(theta_diff, seeing, aoEnabled) {
    if (seeing === 0) {
      // Space telescope - diffraction limited
      return theta_diff;
    }

    if (!aoEnabled) {
      // Ground without AO - seeing limited unless telescope is small
      return Math.max(theta_diff, seeing);
    }

    // Ground with AO - partial correction
    // AO reduces the seeing contribution by (1 - Strehl)
    const correctedSeeing = seeing * (1 - CONSTANTS.AO_STREHL);
    // Combine in quadrature
    return Math.sqrt(theta_diff * theta_diff + correctedSeeing * correctedSeeing);
  }

  /**
   * Determine if a binary pair is resolved according to Rayleigh criterion
   * @param {number} separation - Binary separation in arcsec
   * @param {number} resolution - Effective resolution in arcsec
   * @returns {string} 'resolved', 'marginal', or 'unresolved'
   */
  function resolutionStatus(separation, resolution) {
    const ratio = separation / resolution;
    if (ratio > 1.5) return 'resolved';
    if (ratio > 0.8) return 'marginal';
    return 'unresolved';
  }

  /**
   * Compute Bessel function J1(x) using polynomial approximation.
   *
   * Source: Numerical Recipes in C, 2nd Edition (1992), Section 6.5
   * Press, Teukolsky, Vetterling, Flannery
   * Cambridge University Press
   *
   * Coefficients from equations 6.5.8 and 6.5.9 for |x| < 8 and |x| >= 8
   * respectively. Accuracy: |error| < 4e-8 for all x.
   *
   * @param {number} x - Input value
   * @returns {number} J1(x)
   */
  function besselJ1(x) {
    if (Math.abs(x) < 1e-10) return 0;

    if (Math.abs(x) < 8) {
      // Polynomial approximation for small x
      const y = x * x;
      const ans1 = x * (72362614232.0 + y * (-7895059235.0 +
        y * (242396853.1 + y * (-2972611.439 +
        y * (15704.48260 + y * (-30.16036606))))));
      const ans2 = 144725228442.0 + y * (2300535178.0 +
        y * (18583304.74 + y * (99447.43394 +
        y * (376.9991397 + y * 1.0))));
      return ans1 / ans2;
    } else {
      // Asymptotic approximation for large x
      const ax = Math.abs(x);
      const z = 8.0 / ax;
      const y = z * z;
      const xx = ax - 2.356194491;  // 3*pi/4

      const ans1 = 1.0 + y * (0.183105e-2 + y * (-0.3516396496e-4 +
        y * (0.2457520174e-5 + y * (-0.240337019e-6))));
      const ans2 = 0.04687499995 + y * (-0.2002690873e-3 +
        y * (0.8449199096e-5 + y * (-0.88228987e-6 +
        y * 0.105787412e-6)));

      const ans = Math.sqrt(0.636619772 / ax) *
        (Math.cos(xx) * ans1 - z * Math.sin(xx) * ans2);
      return x < 0 ? -ans : ans;
    }
  }

  /**
   * Calculate Airy disk intensity pattern
   * I(x) = (2*J1(x)/x)^2
   * @param {number} x - Normalized radial coordinate (pi*D*sin(theta)/lambda)
   * @returns {number} Normalized intensity (0 to 1)
   */
  function airyIntensity(x) {
    if (Math.abs(x) < 1e-10) return 1.0;  // Central maximum
    const j1 = besselJ1(x);
    const term = 2 * j1 / x;
    return term * term;
  }

  return {
    CONSTANTS,
    diffractionLimitArcsec,
    effectiveResolution,
    resolutionStatus,
    besselJ1,
    airyIntensity,
  };
});
