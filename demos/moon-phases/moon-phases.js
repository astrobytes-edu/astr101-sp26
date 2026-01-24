/**
 * Moon Phases Demo
 * Interactive demonstration showing how lunar phases work geometrically
 */

(function() {
  'use strict';

  // ============================================
  // Constants
  // ============================================

  const ORBITAL_CENTER = { x: 200, y: 200 };
  const ORBITAL_RADIUS = 120;
  const MOON_RADIUS = 15;
  const EARTH_RADIUS = 25;
  const PHASE_MOON_RADIUS = 60;
  const SYNODIC_MONTH = 29.53; // days

  // Phase names by angle range (angle = 0 is Full Moon, 180 is New Moon)
  // Angle measured from the direction opposite to the Sun
  const PHASE_NAMES = [
    { min: 0, max: 22.5, name: 'Full Moon' },
    { min: 22.5, max: 67.5, name: 'Waning Gibbous' },
    { min: 67.5, max: 112.5, name: 'Third Quarter' },
    { min: 112.5, max: 157.5, name: 'Waning Crescent' },
    { min: 157.5, max: 202.5, name: 'New Moon' },
    { min: 202.5, max: 247.5, name: 'Waxing Crescent' },
    { min: 247.5, max: 292.5, name: 'First Quarter' },
    { min: 292.5, max: 337.5, name: 'Waxing Gibbous' },
    { min: 337.5, max: 360, name: 'Full Moon' }
  ];

  // ============================================
  // State
  // ============================================

  // Angle in degrees: 0 = Full Moon (Moon opposite Sun, on right side)
  // 90 = Third Quarter, 180 = New Moon, 270 = First Quarter
  let moonAngle = 0;

  // Animation state
  let isAnimating = false;
  let animationId = null;
  let animationSpeed = 5;  // Default to 5x speed

  // ============================================
  // DOM Elements
  // ============================================

  let orbitalSvg, phaseSvg;
  let moonGroup, moonDark, moonLit, moonTerminator;
  let litPortion;
  let phaseName, illumination, daysSinceNew;
  let phaseButtons;
  let timelineDirection, timelineDay, timelinePhases;

  function initElements() {
    orbitalSvg = document.getElementById('orbital-svg');
    phaseSvg = document.getElementById('phase-svg');

    moonGroup = document.getElementById('moon-group');
    moonDark = document.getElementById('moon-dark');
    moonLit = document.getElementById('moon-lit');
    moonTerminator = document.getElementById('moon-terminator');

    litPortion = document.getElementById('lit-portion');

    phaseName = document.getElementById('phase-name');
    illumination = document.getElementById('illumination');
    daysSinceNew = document.getElementById('days-since-new');

    phaseButtons = document.querySelectorAll('.phase-btn');

    timelineDirection = document.getElementById('timeline-direction');
    timelineDay = document.getElementById('timeline-day');
    timelinePhases = document.querySelectorAll('.timeline-phase');
  }

  // ============================================
  // Calculations
  // ============================================

  /**
   * Get illumination fraction (0 = new moon, 1 = full moon)
   * @param {number} angle - Angle in degrees (0 = full, 180 = new)
   */
  function getIllumination(angle) {
    // At angle 0 (full moon), illumination = 1
    // At angle 180 (new moon), illumination = 0
    return (1 + Math.cos(angle * Math.PI / 180)) / 2;
  }

  /**
   * Get phase name from angle
   */
  function getPhaseName(angle) {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    for (const phase of PHASE_NAMES) {
      if (normalizedAngle >= phase.min && normalizedAngle < phase.max) {
        return phase.name;
      }
    }
    return 'Full Moon';
  }

  /**
   * Get days since new moon
   * New moon is at angle 180
   */
  function getDaysSinceNew(angle) {
    // Normalize angle to 0-360
    const normalized = ((angle % 360) + 360) % 360;
    // New moon is at 180, so offset by 180
    const daysFraction = ((normalized - 180 + 360) % 360) / 360;
    return daysFraction * SYNODIC_MONTH;
  }

  // ============================================
  // Visualization Updates
  // ============================================

  /**
   * Update the orbital view (top-down)
   */
  function updateOrbitalView() {
    // Moon position on orbit
    // Angle 0 = right side (full moon position, opposite Sun)
    // We add 180 to convert because our angle 0 is "full moon" which is
    // when Moon is on the opposite side from the Sun (which comes from left)
    const orbitalAngle = moonAngle * Math.PI / 180;
    const moonX = ORBITAL_CENTER.x + ORBITAL_RADIUS * Math.cos(orbitalAngle);
    const moonY = ORBITAL_CENTER.y - ORBITAL_RADIUS * Math.sin(orbitalAngle);

    // Update moon position
    moonDark.setAttribute('cx', moonX);
    moonDark.setAttribute('cy', moonY);
    moonLit.setAttribute('cx', moonX);
    moonLit.setAttribute('cy', moonY);
    moonTerminator.setAttribute('cx', moonX);
    moonTerminator.setAttribute('cy', moonY);

    // The lit side of the Moon always faces the Sun (left side of diagram)
    // We need to show which half is lit from the top-down view

    // Calculate the terminator (boundary between light and dark)
    // The Sun is to the left, so the left half of the Moon is lit
    // But we're viewing from above, so we need to clip the lit portion

    // For the orbital view, we'll show the Moon with its lit side facing left
    // Use a clip or mask to show the lit half

    // Simple approach: use the terminator ellipse to cover the dark side
    // The terminator width depends on viewing angle (from above, it's always half)
    moonTerminator.setAttribute('rx', MOON_RADIUS);

    // Rotate the terminator to show which side is lit
    // Sun is at left (angle 180 from right), so left half is always lit
    moonLit.setAttribute('cx', moonX);
    moonLit.setAttribute('cy', moonY);

    // Create a clip path for the lit portion (left half of moon)
    // For simplicity, we'll use a covering rectangle approach
    const litClipX = moonX - MOON_RADIUS;
    moonTerminator.setAttribute('cx', moonX);
  }

  /**
   * Update the phase view (as seen from Earth)
   */
  function updatePhaseView() {
    const illum = getIllumination(moonAngle);

    // Create the lit portion path
    // This is more complex because we need to show a crescent/gibbous shape

    // The phase appearance depends on which part of the lit hemisphere faces Earth
    // We use a combination of two arcs to create the phase shape

    const r = PHASE_MOON_RADIUS;

    // Determine if we're waxing (right side lit) or waning (left side lit)
    // Angle 0-180: waning (left side lit from Earth's view)
    // Angle 180-360: waxing (right side lit from Earth's view)
    const normalizedAngle = ((moonAngle % 360) + 360) % 360;
    const isWaxing = normalizedAngle > 180;

    // The terminator position determines the phase shape
    // At full moon (angle 0): entire disk lit
    // At new moon (angle 180): nothing lit (or thin crescent)
    // At quarters (90, 270): half lit

    // Calculate terminator curve
    // The "squeeze" of the inner curve determines the phase
    // At full/new: squeeze = r (full circle)
    // At quarter: squeeze = 0 (straight line)
    // Gibbous: squeeze is positive (bulging toward dark side)
    // Crescent: squeeze is negative (curving away from dark side)

    const phaseAngle = normalizedAngle * Math.PI / 180;
    const squeeze = r * Math.cos(phaseAngle);

    // Build the path
    // Outer arc is always a semicircle
    // Inner edge is an ellipse-like curve determined by squeeze

    let path;

    if (illum < 0.01) {
      // New moon - just show earthshine (handled by background)
      path = '';
    } else if (illum > 0.99) {
      // Full moon - full circle
      path = `M 0 ${-r} A ${r} ${r} 0 1 1 0 ${r} A ${r} ${r} 0 1 1 0 ${-r}`;
    } else {
      // Partial phase
      // Outer arc (the side facing the Sun - always a semicircle)
      // Inner arc (the terminator - an ellipse)

      if (isWaxing) {
        // Right side lit
        // Outer arc on right, inner curve on left
        if (squeeze >= 0) {
          // Gibbous - inner curve bulges left
          path = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${Math.abs(squeeze)} ${r} 0 0 1 0 ${-r}`;
        } else {
          // Crescent - inner curve bulges right
          path = `M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${Math.abs(squeeze)} ${r} 0 0 0 0 ${-r}`;
        }
      } else {
        // Left side lit (waning)
        // Outer arc on left, inner curve on right
        if (squeeze >= 0) {
          // Gibbous
          path = `M 0 ${-r} A ${r} ${r} 0 0 0 0 ${r} A ${Math.abs(squeeze)} ${r} 0 0 0 0 ${-r}`;
        } else {
          // Crescent
          path = `M 0 ${-r} A ${r} ${r} 0 0 0 0 ${r} A ${Math.abs(squeeze)} ${r} 0 0 1 0 ${-r}`;
        }
      }
    }

    litPortion.setAttribute('d', path);
  }

  /**
   * Update the readout displays
   */
  function updateReadouts() {
    const illum = getIllumination(moonAngle);
    const name = getPhaseName(moonAngle);
    const days = getDaysSinceNew(moonAngle);
    const moonGroupEl = document.getElementById('moon-group');

    phaseName.textContent = name;
    illumination.textContent = Math.round(illum * 100) + '%';
    daysSinceNew.textContent = days.toFixed(1);

    // Update ARIA attributes for accessibility
    if (moonGroupEl) {
      moonGroupEl.setAttribute('aria-valuenow', Math.round(moonAngle));
      moonGroupEl.setAttribute('aria-valuetext',
        `${name}, ${Math.round(illum * 100)}% illuminated, Day ${days.toFixed(0)} of lunar cycle`);
    }

    // Update button states
    phaseButtons.forEach(btn => {
      const btnAngle = parseFloat(btn.dataset.angle);
      const diff = Math.abs(((moonAngle - btnAngle + 180) % 360) - 180);
      btn.classList.toggle('active', diff < 22.5);
    });
  }

  /**
   * Update the timeline strip
   */
  function updateTimeline() {
    const normalized = ((moonAngle % 360) + 360) % 360;
    const days = getDaysSinceNew(moonAngle);

    // Update direction indicator
    const isWaxing = normalized > 180 || normalized === 0;
    if (timelineDirection) {
      timelineDirection.textContent = isWaxing ? 'WAXING →' : '← WANING';
      timelineDirection.classList.toggle('waning', !isWaxing);
    }

    // Update day counter
    if (timelineDay) {
      timelineDay.textContent = `Day ${days.toFixed(1)} of ${SYNODIC_MONTH}`;
    }

    // Update active phase in timeline
    if (timelinePhases) {
      timelinePhases.forEach(phase => {
        const phaseAngle = parseFloat(phase.dataset.angle);
        const diff = Math.abs(((normalized - phaseAngle + 180) % 360) - 180);
        phase.classList.toggle('active', diff < 22.5);
      });
    }
  }

  /**
   * Main update function
   */
  function update() {
    updateOrbitalView();
    updatePhaseView();
    updateReadouts();
    updateTimeline();
  }

  // ============================================
  // Drag Handling
  // ============================================

  function setupDrag() {
    let isDragging = false;

    function getAngleFromEvent(event) {
      const rect = orbitalSvg.getBoundingClientRect();
      const svgX = (event.clientX - rect.left) / rect.width * 400;
      const svgY = (event.clientY - rect.top) / rect.height * 400;

      const dx = svgX - ORBITAL_CENTER.x;
      const dy = ORBITAL_CENTER.y - svgY; // Flip Y for standard math coordinates

      let angle = Math.atan2(dy, dx) * 180 / Math.PI;
      return angle;
    }

    function handleStart(event) {
      isDragging = true;
      event.preventDefault();
    }

    function handleMove(event) {
      if (!isDragging) return;

      let clientX, clientY;
      if (event.touches) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      const rect = orbitalSvg.getBoundingClientRect();
      const svgX = (clientX - rect.left) / rect.width * 400;
      const svgY = (clientY - rect.top) / rect.height * 400;

      const dx = svgX - ORBITAL_CENTER.x;
      const dy = ORBITAL_CENTER.y - svgY;

      moonAngle = Math.atan2(dy, dx) * 180 / Math.PI;
      update();
    }

    function handleEnd() {
      isDragging = false;
    }

    // Mouse events
    moonGroup.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch events
    moonGroup.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    // Make moon look draggable
    moonGroup.style.cursor = 'grab';
  }

  // ============================================
  // Preset Buttons
  // ============================================

  function setupPresets() {
    phaseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetAngle = parseFloat(btn.dataset.angle);

        // Animate to the target angle
        const startAngle = moonAngle;
        let diff = targetAngle - startAngle;

        // Take the shorter path around the circle
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        const endAngle = startAngle + diff;

        AstroUtils.animateValue(startAngle, endAngle, 500, (value) => {
          moonAngle = value;
          update();
        });
      });
    });
  }

  // ============================================
  // Timeline Strip
  // ============================================

  function setupTimeline() {
    if (timelinePhases) {
      timelinePhases.forEach(phase => {
        phase.addEventListener('click', () => {
          const targetAngle = parseFloat(phase.dataset.angle);

          // Animate to target
          const startAngle = moonAngle;
          let diff = targetAngle - startAngle;
          if (diff > 180) diff -= 360;
          if (diff < -180) diff += 360;

          AstroUtils.animateValue(startAngle, startAngle + diff, 400, (value) => {
            moonAngle = ((value % 360) + 360) % 360;
            update();
          });
        });
      });
    }
  }

  // ============================================
  // Keyboard Navigation
  // ============================================

  function setupKeyboard() {
    const moonGroup = document.getElementById('moon-group');

    moonGroup.addEventListener('keydown', (event) => {
      let delta = 0;
      let jump = null;

      switch (event.key) {
        case 'ArrowLeft':
          delta = event.shiftKey ? -1 : -5;
          break;
        case 'ArrowRight':
          delta = event.shiftKey ? 1 : 5;
          break;
        case 'ArrowUp':
          delta = event.shiftKey ? -1 : -5;
          break;
        case 'ArrowDown':
          delta = event.shiftKey ? 1 : 5;
          break;
        case 'Home':
          jump = 0;  // Full Moon
          break;
        case 'End':
          jump = 180;  // New Moon
          break;
        case '1':
          jump = 180;  // New Moon
          break;
        case '2':
          jump = 225;  // Waxing Crescent
          break;
        case '3':
          jump = 270;  // First Quarter
          break;
        case '4':
          jump = 315;  // Waxing Gibbous
          break;
        case '5':
          jump = 0;    // Full Moon
          break;
        case '6':
          jump = 45;   // Waning Gibbous
          break;
        case '7':
          jump = 90;   // Third Quarter
          break;
        case '8':
          jump = 135;  // Waning Crescent
          break;
        default:
          return;  // Don't prevent default for other keys
      }

      event.preventDefault();

      if (jump !== null) {
        // Animate to jump position
        const startAngle = moonAngle;
        let diff = jump - startAngle;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        AstroUtils.animateValue(startAngle, startAngle + diff, 300, (value) => {
          moonAngle = ((value % 360) + 360) % 360;
          update();
        });
      } else if (delta !== 0) {
        moonAngle = ((moonAngle + delta) % 360 + 360) % 360;
        update();

        // Announce change for screen readers
        const announce = document.getElementById('status-announce');
        if (announce) {
          const name = getPhaseName(moonAngle);
          const illum = getIllumination(moonAngle);
          announce.textContent = `${name}, ${Math.round(illum * 100)}% illuminated`;
        }
      }
    });

    // Visual focus indicator
    moonGroup.addEventListener('focus', () => {
      moonGroup.style.outline = '2px solid var(--accent-blue)';
      moonGroup.style.outlineOffset = '4px';
    });

    moonGroup.addEventListener('blur', () => {
      moonGroup.style.outline = 'none';
    });
  }

  // ============================================
  // Animation
  // ============================================

  function startAnimation() {
    if (isAnimating) return;

    isAnimating = true;
    document.getElementById('btn-play').disabled = true;
    document.getElementById('btn-pause').disabled = false;

    let lastTime = performance.now();

    function animate(currentTime) {
      if (!isAnimating) return;

      const delta = (currentTime - lastTime) / 1000;  // seconds
      lastTime = currentTime;

      // Move Moon based on speed setting
      // 360 degrees / 29.53 days = 12.19 degrees per day
      // At 1x speed, 1 second = 1 day
      const degreesPerSecond = 12.19 * animationSpeed;
      moonAngle = (moonAngle + degreesPerSecond * delta) % 360;

      update();

      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    isAnimating = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    document.getElementById('btn-play').disabled = false;
    document.getElementById('btn-pause').disabled = true;
  }

  function stepForward() {
    stopAnimation();
    // Jump to next named phase (45° increments)
    const currentPhaseIndex = Math.round(moonAngle / 45) % 8;
    const nextAngle = ((currentPhaseIndex + 1) % 8) * 45;

    AstroUtils.animateValue(moonAngle, moonAngle + ((nextAngle - moonAngle + 360) % 360), 300, (val) => {
      moonAngle = val % 360;
      update();
    });
  }

  function stepBackward() {
    stopAnimation();
    const currentPhaseIndex = Math.round(moonAngle / 45) % 8;
    const prevAngle = ((currentPhaseIndex - 1 + 8) % 8) * 45;

    let diff = prevAngle - moonAngle;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    AstroUtils.animateValue(moonAngle, moonAngle + diff, 300, (val) => {
      moonAngle = ((val % 360) + 360) % 360;
      update();
    });
  }

  function setupAnimationControls() {
    document.getElementById('btn-play').addEventListener('click', startAnimation);
    document.getElementById('btn-pause').addEventListener('click', stopAnimation);
    document.getElementById('btn-step-forward').addEventListener('click', stepForward);
    document.getElementById('btn-step-back').addEventListener('click', stepBackward);

    document.getElementById('speed-select').addEventListener('change', (e) => {
      animationSpeed = parseFloat(e.target.value);
    });

    // Reset button
    document.getElementById('btn-reset').addEventListener('click', () => {
      stopAnimation();

      // Reset to Full Moon (angle 0)
      AstroUtils.animateValue(moonAngle, 0, 300, (val) => {
        moonAngle = ((val % 360) + 360) % 360;
        update();
      });

      // Hide shadow if shown
      const shadowToggle = document.getElementById('show-shadow-toggle');
      const shadowGroup = document.getElementById('earth-shadow-group');
      if (shadowToggle && shadowGroup) {
        shadowToggle.checked = false;
        shadowGroup.style.display = 'none';
      }

      // Announce reset for screen readers
      const announce = document.getElementById('status-announce');
      if (announce) {
        announce.textContent = 'Reset to Full Moon position.';
      }
    });
  }

  // ============================================
  // Shadow Toggle
  // ============================================

  /**
   * Show insight popup when shadow is first toggled on
   */
  let shadowInsightShown = false;

  function showShadowInsight() {
    if (shadowInsightShown) return;
    shadowInsightShown = true;

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'insight-popup';
    popup.innerHTML = `
      <div class="insight-popup-content">
        <strong>Key Observation:</strong> Earth's shadow always points
        <em>away</em> from the Sun. The Moon is almost never in the shadow —
        that's why phases are NOT caused by Earth's shadow!
        <button class="insight-close" aria-label="Close">Got it!</button>
      </div>
    `;
    popup.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(46, 204, 113, 0.95);
      color: #1a1a2e;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      max-width: 400px;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease-out;
    `;

    document.body.appendChild(popup);

    popup.querySelector('.insight-close').addEventListener('click', () => {
      popup.remove();
    });

    // Auto-dismiss after 8 seconds
    setTimeout(() => {
      if (popup.parentNode) {
        popup.remove();
      }
    }, 8000);
  }

  function setupShadowToggle() {
    const shadowToggle = document.getElementById('show-shadow-toggle');
    const shadowGroup = document.getElementById('earth-shadow-group');

    if (shadowToggle && shadowGroup) {
      shadowToggle.addEventListener('change', () => {
        shadowGroup.style.display = shadowToggle.checked ? 'block' : 'none';

        if (shadowToggle.checked) {
          showShadowInsight();
        }

        // Announce for screen readers
        const announce = document.getElementById('status-announce');
        if (announce) {
          announce.textContent = shadowToggle.checked
            ? "Earth's shadow cone is now visible. Notice it points away from the Sun and rarely touches the Moon."
            : "Earth's shadow cone hidden.";
        }
      });
    }
  }

  // ============================================
  // Initialization
  // ============================================

  function init() {
    initElements();
    setupDrag();
    setupPresets();
    setupTimeline();
    setupKeyboard();
    setupAnimationControls();
    setupShadowToggle();

    // Initialize starfield
    const starfieldCanvas = document.getElementById('starfield');
    if (starfieldCanvas && window.Starfield) {
      const starfield = Starfield.create(starfieldCanvas, {
        starCount: 150,
        twinkleSpeed: 0.01
      });
      starfield.start();
    }

    // Initial update
    moonAngle = 0; // Start at full moon
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
