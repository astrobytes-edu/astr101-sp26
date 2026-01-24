/* Shared demo polish wiring.
   Applies micro-interactions (ripple, slider progress, slider tooltips) without per-demo JS changes. */

(() => {
  function prefersReducedMotion() {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function initRipple(element) {
    if (!element || !window.AstroUtils?.addRippleEffect) return;
    if (element.dataset.rippleInit === 'true') return;
    element.dataset.rippleInit = 'true';

    // Avoid ripples on elements that opt out (e.g., draggable SVG handles).
    if (element.dataset.ripple === 'off') return;

    window.AstroUtils.addRippleEffect(element);
  }

  function initSlider(slider) {
    if (!slider || slider.dataset.polishInit === 'true') return;
    slider.dataset.polishInit = 'true';

    if (window.AstroUtils?.updateSliderProgress) {
      window.AstroUtils.updateSliderProgress(slider);
      slider.addEventListener('input', () => window.AstroUtils.updateSliderProgress(slider), { passive: true });
    }

    // Tooltips: opt-in only, because many demos use "0–1000" sliders internally mapped to physical values.
    // Use `data-tooltip-source="#some-element"` on the slider to show the *displayed* value.
    if (!prefersReducedMotion() && window.AstroUtils?.addSliderTooltip) {
      const sourceSelector = slider.dataset.tooltipSource;
      if (sourceSelector) {
        const source = document.querySelector(sourceSelector);
        if (source) {
          window.AstroUtils.addSliderTooltip(slider, () => source.textContent.trim());
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Ripple on common control elements (buttons + preset chips)
    document
      .querySelectorAll(
        'button, .preset-btn, .mode-btn, .anim-btn, .sim-btn, .phase-btn, .unit-btn, .astro-btn'
      )
      .forEach(initRipple);

    // Sliders
    document.querySelectorAll('input[type="range"].astro-slider').forEach(initSlider);
  });
})();
