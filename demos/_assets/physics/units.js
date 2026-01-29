/**
 * demos/_assets/physics/units.js
 *
 * Unit conversion helpers built on AstroConstants (single source of truth).
 *
 * Rule: this module should be "dumb math" only (no DOM, no state).
 */

(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('./astro-constants.js'));
  } else {
    root.AstroUnits = factory(root.AstroConstants);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (AstroConstants) {
  'use strict';

  if (!AstroConstants) {
    throw new Error('AstroUnits: missing AstroConstants (load physics/astro-constants.js first)');
  }

  function daysToSeconds(days) {
    return days * AstroConstants.TIME.DAY_S;
  }

  function secondsToDays(seconds) {
    return seconds / AstroConstants.TIME.DAY_S;
  }

  function yearsToSeconds(years) {
    return years * AstroConstants.TIME.YEAR_S;
  }

  function secondsToYears(seconds) {
    return seconds / AstroConstants.TIME.YEAR_S;
  }

  function auToCm(au) {
    return au * AstroConstants.LENGTH.CM_PER_AU;
  }

  function cmToAu(cm) {
    return cm / AstroConstants.LENGTH.CM_PER_AU;
  }

  function auToKm(au) {
    return au * AstroConstants.LENGTH.KM_PER_AU;
  }

  function kmToAu(km) {
    return km / AstroConstants.LENGTH.KM_PER_AU;
  }

  function auPerYrToKmPerS(auPerYr) {
    return (auPerYr * AstroConstants.LENGTH.KM_PER_AU) / AstroConstants.TIME.YEAR_S;
  }

  function kmPerSToAuPerYr(kmPerS) {
    return (kmPerS * AstroConstants.TIME.YEAR_S) / AstroConstants.LENGTH.KM_PER_AU;
  }

  function auPerYrToCmPerS(auPerYr) {
    return (auPerYr * AstroConstants.LENGTH.CM_PER_AU) / AstroConstants.TIME.YEAR_S;
  }

  function cmPerSToAuPerYr(cmPerS) {
    return (cmPerS * AstroConstants.TIME.YEAR_S) / AstroConstants.LENGTH.CM_PER_AU;
  }

  function auPerYr2ToMPerS2(auPerYr2) {
    // 1 AU/yr² = AU_m / yr_s²
    return (auPerYr2 * AstroConstants.LENGTH.M_PER_AU) / (AstroConstants.TIME.YEAR_S * AstroConstants.TIME.YEAR_S);
  }

  function mPerS2ToAuPerYr2(mPerS2) {
    return (mPerS2 * AstroConstants.TIME.YEAR_S * AstroConstants.TIME.YEAR_S) / AstroConstants.LENGTH.M_PER_AU;
  }

  function auPerYr2ToCmPerS2(auPerYr2) {
    return (auPerYr2 * AstroConstants.LENGTH.CM_PER_AU) / (AstroConstants.TIME.YEAR_S * AstroConstants.TIME.YEAR_S);
  }

  function cmPerS2ToAuPerYr2(cmPerS2) {
    return (cmPerS2 * AstroConstants.TIME.YEAR_S * AstroConstants.TIME.YEAR_S) / AstroConstants.LENGTH.CM_PER_AU;
  }

  function au3PerYr2ToCm3PerS2(au3PerYr2) {
    // Convert mu from AU^3/yr^2 to cm^3/s^2.
    return (
      au3PerYr2 *
      Math.pow(AstroConstants.LENGTH.CM_PER_AU, 3) /
      Math.pow(AstroConstants.TIME.YEAR_S, 2)
    );
  }

  function cm3PerS2ToAu3PerYr2(cm3PerS2) {
    return (
      cm3PerS2 *
      Math.pow(AstroConstants.TIME.YEAR_S, 2) /
      Math.pow(AstroConstants.LENGTH.CM_PER_AU, 3)
    );
  }

  return {
    daysToSeconds,
    secondsToDays,
    yearsToSeconds,
    secondsToYears,
    auToCm,
    cmToAu,
    auToKm,
    kmToAu,
    auPerYrToKmPerS,
    kmPerSToAuPerYr,
    auPerYrToCmPerS,
    cmPerSToAuPerYr,
    auPerYr2ToMPerS2,
    mPerS2ToAuPerYr2,
    auPerYr2ToCmPerS2,
    cmPerS2ToAuPerYr2,
    au3PerYr2ToCm3PerS2,
    cm3PerS2ToAu3PerYr2,
  };
});
