/* Doppler shift utilities (non-relativistic; v << c).
 *
 * Sign convention (must match the ASTR 101 L10 reading):
 *   Δλ = λ_obs - λ0
 *   v_r > 0 (receding) → Δλ > 0 (redshift)
 *   v_r < 0 (approaching) → Δλ < 0 (blueshift)
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else {
    root.DopplerShiftModel = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Exact speed of light in km/s.
  const C_KM_S = 299792.458;

  function dopplerShiftNm({ lambda0Nm, vKms }) {
    return lambda0Nm * (1 + vKms / C_KM_S);
  }

  function deltaLambdaNm({ lambda0Nm, lambdaObsNm }) {
    return lambdaObsNm - lambda0Nm;
  }

  function velocityFromShiftKms({ lambda0Nm, lambdaObsNm }) {
    const d = deltaLambdaNm({ lambda0Nm, lambdaObsNm });
    return (d / lambda0Nm) * C_KM_S;
  }

  return { C_KM_S, dopplerShiftNm, deltaLambdaNm, velocityFromShiftKms };
});

