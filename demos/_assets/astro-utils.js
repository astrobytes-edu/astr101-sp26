/**
 * AstroEd Demos - Shared Utilities
 * Common functionality for interactive astronomy visualizations
 */

// ============================================
// Number Formatting
// ============================================

/**
 * Format a number in scientific notation for display
 * @param {number} value - The number to format
 * @param {number} precision - Significant figures (default 3)
 * @returns {string} Formatted string like "1.5 × 10⁸"
 */
function formatScientific(value, precision = 3) {
  if (value === 0) return '0';

  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exponent);

  // Use superscript for exponent
  const superscripts = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const superMinus = '⁻';

  let expStr = '';
  const expAbs = Math.abs(exponent);
  if (exponent < 0) expStr += superMinus;

  String(expAbs).split('').forEach(d => {
    expStr += superscripts[parseInt(d)];
  });

  const mantissaStr = mantissa.toPrecision(precision);

  if (exponent === 0) return mantissaStr;
  if (exponent === 1 && mantissa === 1) return '10';
  if (mantissa === 1) return `10${expStr}`;

  return `${mantissaStr} × 10${expStr}`;
}

/**
 * Format a number with appropriate units
 * @param {number} value - Value in base units (km for distance)
 * @param {string} type - 'distance' | 'angle' | 'time'
 * @returns {object} { value: string, unit: string }
 */
function formatWithUnits(value, type) {
  switch (type) {
    case 'distance':
      return formatDistance(value);
    case 'angle':
      return formatAngle(value);
    case 'time':
      return formatTime(value);
    default:
      return { value: value.toFixed(2), unit: '' };
  }
}

/**
 * Format distance with appropriate units (km input)
 */
function formatDistance(km) {
  const AU = 1.496e8; // km
  const LY = 9.461e12; // km
  const PC = 3.086e13; // km

  if (km >= PC) {
    return { value: (km / PC).toPrecision(3), unit: 'pc' };
  } else if (km >= LY) {
    return { value: (km / LY).toPrecision(3), unit: 'ly' };
  } else if (km >= AU * 0.1) {
    return { value: (km / AU).toPrecision(3), unit: 'AU' };
  } else if (km >= 1e6) {
    return { value: formatScientific(km, 3), unit: 'km' };
  } else if (km >= 1) {
    return { value: km.toLocaleString(undefined, { maximumFractionDigits: 1 }), unit: 'km' };
  } else {
    return { value: (km * 1000).toFixed(1), unit: 'm' };
  }
}

/**
 * Format angle in degrees/arcminutes/arcseconds
 * @param {number} degrees - Angle in degrees
 */
function formatAngle(degrees) {
  if (degrees >= 1) {
    return { value: degrees.toFixed(2), unit: '°' };
  } else if (degrees >= 1/60) {
    const arcmin = degrees * 60;
    return { value: arcmin.toFixed(1), unit: "'" };
  } else {
    const arcsec = degrees * 3600;
    return { value: arcsec.toFixed(1), unit: '"' };
  }
}

/**
 * Format time in appropriate units
 * @param {number} years - Time in years
 */
function formatTime(years) {
  const absYears = Math.abs(years);
  const sign = years < 0 ? '-' : '+';

  if (absYears >= 1e9) {
    return { value: `${sign}${(absYears / 1e9).toFixed(1)}`, unit: 'Gyr' };
  } else if (absYears >= 1e6) {
    return { value: `${sign}${(absYears / 1e6).toFixed(1)}`, unit: 'Myr' };
  } else if (absYears >= 1000) {
    return { value: `${sign}${(absYears / 1000).toFixed(1)}`, unit: 'kyr' };
  } else {
    return { value: `${sign}${absYears.toFixed(0)}`, unit: 'years' };
  }
}


// ============================================
// Angular Size Calculations
// ============================================

/**
 * Calculate angular size in degrees
 * @param {number} diameter - Physical diameter (any units)
 * @param {number} distance - Distance in same units as diameter
 * @returns {number} Angular size in degrees
 */
function angularSize(diameter, distance) {
  // Angular size in radians = diameter / distance (small angle approx)
  // Convert to degrees
  return (diameter / distance) * (180 / Math.PI);
}

/**
 * Calculate distance needed for a given angular size
 * @param {number} diameter - Physical diameter
 * @param {number} angularDeg - Desired angular size in degrees
 * @returns {number} Required distance
 */
function distanceForAngularSize(diameter, angularDeg) {
  const angularRad = angularDeg * (Math.PI / 180);
  return diameter / angularRad;
}


// ============================================
// Animation Utilities
// ============================================

/**
 * Create a smooth animation loop
 * @param {function} callback - Called each frame with (deltaTime, totalTime)
 * @returns {object} Controller with start(), stop(), isRunning
 */
function createAnimationLoop(callback) {
  let animationId = null;
  let startTime = null;
  let lastTime = null;
  let running = false;

  function frame(timestamp) {
    if (!startTime) startTime = timestamp;
    if (!lastTime) lastTime = timestamp;

    const deltaTime = (timestamp - lastTime) / 1000; // seconds
    const totalTime = (timestamp - startTime) / 1000;
    lastTime = timestamp;

    callback(deltaTime, totalTime);

    if (running) {
      animationId = requestAnimationFrame(frame);
    }
  }

  return {
    start() {
      if (!running) {
        running = true;
        startTime = null;
        lastTime = null;
        animationId = requestAnimationFrame(frame);
      }
    },
    stop() {
      running = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    get isRunning() {
      return running;
    },
    reset() {
      startTime = null;
      lastTime = null;
    }
  };
}

/**
 * Ease in-out cubic for smooth transitions
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Linear interpolation
 */
function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Ease out cubic - fast start, slow end
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in cubic - slow start, fast end
 */
function easeInCubic(t) {
  return t * t * t;
}

/**
 * Ease out elastic - bouncy overshoot
 */
function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 :
    Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}

/**
 * Ease out back - slight overshoot
 */
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Custom easing for Kepler's 2nd law (faster at perihelion)
 */
function keplerianEasing(t, eccentricity = 0.5) {
  const M = t * 2 * Math.PI;
  let E = M;

  for (let i = 0; i < 5; i++) {
    E = E - (E - eccentricity * Math.sin(E) - M) / (1 - eccentricity * Math.cos(E));
  }

  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(E / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(E / 2)
  );

  return (trueAnomaly + Math.PI) / (2 * Math.PI);
}

/**
 * Animate a value from start to end over duration
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} duration - Duration in ms
 * @param {function} onUpdate - Called with current value
 * @param {function} onComplete - Called when done
 */
function animateValue(start, end, duration, onUpdate, onComplete) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const currentValue = lerp(start, end, easedProgress);

    onUpdate(currentValue);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else if (onComplete) {
      onComplete();
    }
  }

  requestAnimationFrame(update);
}

/**
 * Animate a numeric value change with visual feedback
 * @param {HTMLElement} element - Element displaying the value
 * @param {number} newValue - New value to display
 * @param {function} formatter - Function to format value for display
 * @param {object} options - Animation options
 */
function animateValueChange(element, newValue, formatter, options = {}) {
  const {
    duration = 300,
    flashColor = '#4ECDC4',
    pulseScale = 1.05
  } = options;

  const currentText = element.textContent;
  const currentValue = parseFloat(currentText.replace(/[^\d.-]/g, '')) || 0;

  if (Math.abs(newValue - currentValue) < 0.0001) {
    element.textContent = formatter ? formatter(newValue) : newValue;
    return;
  }

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const displayValue = lerp(currentValue, newValue, easedProgress);

    element.textContent = formatter ? formatter(displayValue) : displayValue.toFixed(2);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  element.style.transition = 'transform 0.15s ease-out, color 0.15s ease-out';
  element.style.transform = `scale(${pulseScale})`;
  element.style.color = flashColor;

  setTimeout(() => {
    element.style.transform = 'scale(1)';
    element.style.color = '';
  }, 150);

  requestAnimationFrame(update);
}

function createAnimatedValue(element, formatter) {
  let currentValue = 0;

  return {
    setValue(newValue) {
      animateValueChange(element, newValue, formatter);
      currentValue = newValue;
    },
    getValue() {
      return currentValue;
    },
    setInstant(newValue) {
      element.textContent = formatter ? formatter(newValue) : newValue;
      currentValue = newValue;
    }
  };
}

function addRippleEffect(element, options = {}) {
  const {
    color = 'rgba(78, 205, 196, 0.3)',
    duration = 400
  } = options;

  element.style.position = 'relative';
  element.style.overflow = 'hidden';

  element.addEventListener('click', (e) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      transform: scale(0);
      animation: ripple-effect ${duration}ms ease-out;
      pointer-events: none;
      left: ${x}px;
      top: ${y}px;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      margin-top: -5px;
    `;

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), duration);
  });
}

if (typeof document !== 'undefined' && !document.getElementById('astro-ripple-styles')) {
  const style = document.createElement('style');
  style.id = 'astro-ripple-styles';
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(20);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

function showSuccessIndicator(targetElement, message = '', options = {}) {
  const {
    duration = 2000,
    position = 'top'
  } = options;

  const indicator = document.createElement('div');
  indicator.className = 'success-indicator-popup';
  indicator.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    ${message ? `<span>${message}</span>` : ''}
  `;

  indicator.style.cssText = `
    position: absolute;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(80, 250, 123, 0.2);
    color: #50FA7B;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 9999px;
    border: 1px solid rgba(80, 250, 123, 0.4);
    animation: success-pop 0.3s ease-out;
    z-index: 1000;
    pointer-events: none;
  `;

  const rect = targetElement.getBoundingClientRect();
  const parentRect = targetElement.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

  (targetElement.offsetParent || document.body).appendChild(indicator);

  const indicatorRect = indicator.getBoundingClientRect();
  indicator.style.left = `${rect.left - parentRect.left + rect.width / 2 - indicatorRect.width / 2}px`;
  indicator.style.top = `${rect.top - parentRect.top - indicatorRect.height - 8}px`;

  setTimeout(() => {
    indicator.style.opacity = '0';
    indicator.style.transition = 'opacity 0.3s ease';
    setTimeout(() => indicator.remove(), 300);
  }, duration);
}

if (typeof document !== 'undefined' && !document.getElementById('astro-success-styles')) {
  const style = document.createElement('style');
  style.id = 'astro-success-styles';
  style.textContent = `
    @keyframes success-pop {
      0% { transform: scale(0.8); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}


// ============================================
// Slider Helpers
// ============================================

/**
 * Add a lightweight tooltip above a range slider while interacting.
 * Intended for demos that already use `.astro-slider`.
 *
 * @param {HTMLInputElement} slider - The range input element
 * @param {function} formatter - Optional (value:number) => string formatter
 * @param {object} options - Optional options
 * @returns {{destroy: function}} Cleanup handle
 */
function addSliderTooltip(slider, formatter, options = {}) {
  const {
    offsetY = -30,
    thumbWidth = 20
  } = options;

  if (typeof document === 'undefined' || !slider) {
    return { destroy() {} };
  }

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const container = slider.closest('.slider-with-value') || slider.parentElement;
  if (!container) {
    return { destroy() {} };
  }

  if (getComputedStyle(container).position === 'static') {
    container.style.position = 'relative';
  }

  const tooltip = document.createElement('div');
  tooltip.className = 'astro-slider-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    top: ${offsetY}px;
    left: 0;
    transform: translateX(-50%);
    opacity: 0;
    pointer-events: none;
    z-index: 20;
    font-family: var(--font-mono, monospace);
    font-size: 12px;
    color: var(--text-primary, #F8F8F2);
    background: var(--space-deep, #12121f);
    border: 1px solid var(--border-color, rgba(255,255,255,0.1));
    border-radius: 9999px;
    padding: 4px 10px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    transition: ${prefersReducedMotion ? 'none' : 'opacity 150ms ease-out'};
  `;
  container.appendChild(tooltip);

  function parseNumber(value) {
    const n = typeof value === 'string' ? parseFloat(value) : Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  function formatValue(value) {
    if (typeof formatter === 'function') return formatter(value);
    return String(value);
  }

  function update() {
    const min = parseNumber(slider.min || 0);
    const max = parseNumber(slider.max || 100);
    const value = parseNumber(slider.value);
    const denom = max - min || 1;
    const percent = (value - min) / denom;

    const sliderRect = slider.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const trackWidth = sliderRect.width - thumbWidth;
    const left = (sliderRect.left - containerRect.left) + (thumbWidth / 2) + (percent * trackWidth);

    tooltip.style.left = `${left}px`;
    tooltip.textContent = formatValue(value);
  }

  function show() {
    update();
    tooltip.style.opacity = '1';
  }

  function hide() {
    tooltip.style.opacity = '0';
  }

  const onInput = () => update();
  const onPointerDown = () => show();
  const onPointerUp = () => hide();
  const onFocus = () => show();
  const onBlur = () => hide();

  slider.addEventListener('input', onInput);
  slider.addEventListener('pointerdown', onPointerDown);
  slider.addEventListener('pointerup', onPointerUp);
  slider.addEventListener('pointercancel', onPointerUp);
  slider.addEventListener('focus', onFocus);
  slider.addEventListener('blur', onBlur);

  // Keep tooltip positioned if layout changes while focused/active.
  const onWindowResize = () => update();
  window.addEventListener('resize', onWindowResize);

  return {
    destroy() {
      window.removeEventListener('resize', onWindowResize);
      slider.removeEventListener('input', onInput);
      slider.removeEventListener('pointerdown', onPointerDown);
      slider.removeEventListener('pointerup', onPointerUp);
      slider.removeEventListener('pointercancel', onPointerUp);
      slider.removeEventListener('focus', onFocus);
      slider.removeEventListener('blur', onBlur);
      tooltip.remove();
    }
  };
}

/**
 * Create a logarithmic slider for astronomical scales
 * @param {HTMLInputElement} slider - The range input element
 * @param {number} minValue - Minimum actual value
 * @param {number} maxValue - Maximum actual value
 * @param {function} onChange - Called with actual value
 */
/**
 * Update slider progress indicator for WebKit browsers
 * Sets the --slider-progress CSS custom property
 * @param {HTMLInputElement} slider - The range input element
 */
function updateSliderProgress(slider) {
  const min = parseFloat(slider.min) || 0;
  const max = parseFloat(slider.max) || 100;
  const value = parseFloat(slider.value);
  const percentage = ((value - min) / (max - min)) * 100;
  slider.style.setProperty('--slider-progress', percentage + '%');
}

function createLogSlider(slider, minValue, maxValue, onChange) {
  const minLog = Math.log10(minValue);
  const maxLog = Math.log10(maxValue);

  // Set slider to 0-1000 range for smooth control
  slider.min = 0;
  slider.max = 1000;

  function sliderToValue(sliderVal) {
    const fraction = sliderVal / 1000;
    const logVal = minLog + fraction * (maxLog - minLog);
    return Math.pow(10, logVal);
  }

  function valueToSlider(value) {
    const logVal = Math.log10(value);
    const fraction = (logVal - minLog) / (maxLog - minLog);
    return Math.round(fraction * 1000);
  }

  slider.addEventListener('input', () => {
    updateSliderProgress(slider);
    const value = sliderToValue(parseFloat(slider.value));
    onChange(value);
  });

  // Initialize progress indicator
  updateSliderProgress(slider);

  return {
    getValue: () => sliderToValue(parseFloat(slider.value)),
    setValue: (value) => {
      slider.value = valueToSlider(value);
      updateSliderProgress(slider);
      onChange(value);
    }
  };
}

/**
 * Create a linear slider with formatting
 * @param {HTMLInputElement} slider - The range input element
 * @param {HTMLElement} display - Element to show formatted value
 * @param {function} formatter - Function to format value for display
 * @param {function} onChange - Called with value on change
 */
function createLinearSlider(slider, display, formatter, onChange) {
  function update() {
    updateSliderProgress(slider);
    const value = parseFloat(slider.value);
    if (display && formatter) {
      display.textContent = formatter(value);
    }
    if (onChange) {
      onChange(value);
    }
  }

  slider.addEventListener('input', update);

  // Initialize progress indicator
  updateSliderProgress(slider);

  return {
    getValue: () => parseFloat(slider.value),
    setValue: (value) => {
      slider.value = value;
      update();
    },
    update
  };
}


// ============================================
// DOM Utilities
// ============================================

/**
 * Create an SVG element with attributes
 * @param {string} tag - SVG element tag name
 * @param {object} attrs - Attributes to set
 * @returns {SVGElement}
 */
function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, value);
  }
  return el;
}

/**
 * Query selector with error if not found
 */
function $(selector, parent = document) {
  const el = parent.querySelector(selector);
  if (!el) {
    console.warn(`Element not found: ${selector}`);
  }
  return el;
}

/**
 * Query selector all
 */
function $$(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}


// ============================================
// Drag Handling
// ============================================

/**
 * Make an SVG element draggable within a circle (for orbital motion)
 * @param {SVGElement} element - Element to make draggable
 * @param {object} center - { x, y } center of orbit
 * @param {number} radius - Orbital radius
 * @param {function} onDrag - Called with angle in radians
 */
function makeOrbitalDraggable(element, center, radius, onDrag) {
  let isDragging = false;

  function getAngle(event) {
    const svg = element.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

    return Math.atan2(svgP.y - center.y, svgP.x - center.x);
  }

  function updatePosition(angle) {
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    element.setAttribute('cx', x);
    element.setAttribute('cy', y);
    if (onDrag) onDrag(angle);
  }

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  element.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const angle = getAngle(e);
      updatePosition(angle);
    }
  });

  document.addEventListener('touchmove', (e) => {
    if (isDragging && e.touches.length === 1) {
      const touch = e.touches[0];
      const angle = getAngle(touch);
      updatePosition(angle);
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  return {
    setAngle: updatePosition
  };
}


// ============================================
// Astronomical Constants
// ============================================

const ASTRO = {
  // Distances (km)
  AU: 1.496e8,           // Astronomical Unit
  LIGHT_YEAR: 9.461e12,  // Light year
  PARSEC: 3.086e13,      // Parsec
  EARTH_MOON: 384400,    // Earth-Moon distance

  // Sizes (km)
  SUN_DIAMETER: 1.392e6,
  MOON_DIAMETER: 3474,
  EARTH_DIAMETER: 12742,
  JUPITER_DIAMETER: 139820,

  // Angular sizes (degrees, as seen from Earth)
  SUN_ANGULAR: 0.53,
  MOON_ANGULAR: 0.52,

  // Time
  SYNODIC_MONTH: 29.53,  // days
  SIDEREAL_MONTH: 27.32, // days

  // Moon recession rate (cm/year, for time evolution)
  MOON_RECESSION_RATE: 3.8,

  // Orbital parameters
  MOON_ORBITAL_TILT: 5.145, // degrees
};


// ============================================
// Preset Data for Angular Size Demo
// ============================================

const ANGULAR_SIZE_PRESETS = {
  // Astronomical objects
  sun: {
    name: 'Sun',
    diameter: ASTRO.SUN_DIAMETER,
    distance: ASTRO.AU,
    category: 'astronomical',
    description: 'Our star, 150 million km away'
  },
  moon: {
    name: 'Moon',
    diameter: ASTRO.MOON_DIAMETER,
    distance: ASTRO.EARTH_MOON,
    category: 'astronomical',
    description: 'Earth\'s natural satellite'
  },
  jupiter: {
    name: 'Jupiter',
    diameter: ASTRO.JUPITER_DIAMETER,
    distance: 628.7e6, // at opposition
    category: 'astronomical',
    description: 'The largest planet (at opposition)'
  },
  andromeda: {
    name: 'Andromeda Galaxy',
    diameter: 2.2e18, // ~220,000 ly diameter in km
    distance: 2.537e19, // ~2.5 million ly in km
    category: 'astronomical',
    description: 'Nearest large galaxy, 2.5 million light-years'
  },

  // Easter eggs - everyday objects
  basketball_10m: {
    name: 'Basketball (10m)',
    diameter: 0.000239, // 23.9 cm in km
    distance: 0.01, // 10m in km
    category: 'easter-egg',
    description: 'A basketball 10 meters away'
  },
  quarter_arms: {
    name: 'Quarter (arm\'s length)',
    diameter: 0.0000243, // 24.3 mm in km
    distance: 0.0007, // ~70cm arm's length in km
    category: 'easter-egg',
    description: 'A US quarter held at arm\'s length'
  },
  thumb_arms: {
    name: 'Your thumb (arm\'s length)',
    diameter: 0.00002, // ~2cm thumb width in km
    distance: 0.0007, // ~70cm
    category: 'easter-egg',
    description: 'Your thumb at arm\'s length ≈ 2°'
  },
  soccer_20m: {
    name: 'Soccer ball (20m)',
    diameter: 0.00022, // 22 cm in km
    distance: 0.02, // 20m in km
    category: 'easter-egg',
    description: 'A soccer ball across the field'
  },
  airplane_10km: {
    name: 'Airplane (10 km up)',
    diameter: 0.06, // ~60m wingspan in km
    distance: 10, // 10 km altitude
    category: 'easter-egg',
    description: 'Commercial jet at cruising altitude'
  }
};


// ============================================
// KaTeX Math Rendering
// ============================================

/**
 * Render KaTeX math to an element
 * @param {string} selector - CSS selector for target element
 * @param {string} latex - LaTeX string to render
 * @param {boolean} displayMode - true for display style, false for inline
 */
function renderMath(selector, latex, displayMode = false) {
  const element = document.querySelector(selector);
  if (element && window.katex) {
    katex.render(latex, element, {
      throwOnError: false,
      displayMode: displayMode
    });
  }
}

/**
 * Render all elements with data-math attribute
 * Scans the DOM for elements with data-math="latex string"
 * Use data-math-display attribute for display mode (block) equations
 */
function renderAllMath() {
  document.querySelectorAll('[data-math]').forEach(el => {
    const latex = el.getAttribute('data-math');
    const displayMode = el.hasAttribute('data-math-display');
    if (window.katex) {
      katex.render(latex, el, {
        throwOnError: false,
        displayMode: displayMode
      });
    }
  });
}


// ============================================
// Export for use in demos
// ============================================

// Make available globally for standalone HTML files
if (typeof window !== 'undefined') {
  window.AstroUtils = {
    // Formatting
    formatScientific,
    formatWithUnits,
    formatDistance,
    formatAngle,
    formatTime,

    // Calculations
    angularSize,
    distanceForAngularSize,

    // Animation
    createAnimationLoop,
    easeInOutCubic,
    easeOutCubic,
    easeInCubic,
    easeOutElastic,
    easeOutBack,
    keplerianEasing,
    lerp,
    animateValue,

    // Micro-interactions
    animateValueChange,
    createAnimatedValue,
    addRippleEffect,
    showSuccessIndicator,

    // Sliders
    updateSliderProgress,
    addSliderTooltip,
    createLogSlider,
    createLinearSlider,

    // DOM
    createSVGElement,
    $,
    $$,

    // Drag
    makeOrbitalDraggable,

    // Math rendering (KaTeX)
    renderMath,
    renderAllMath,

    // Constants
    ASTRO,
    ANGULAR_SIZE_PRESETS
  };
}
