/**
 * Tour Engine for Astronomy Demos
 * Provides scripted step-by-step presentations for instructors
 *
 * @module TourEngine
 * @version 1.0.0
 *
 * Usage:
 *   const tour = TourEngine.create({
 *     steps: [...],
 *     getState: () => currentState,
 *     setState: (state) => applyState(state),
 *     container: document.querySelector('.demo-content'),
 *     onStepChange: (step, index) => console.log('Step changed'),
 *     onComplete: () => console.log('Tour complete')
 *   });
 *
 *   tour.start();
 */

(function() {
  'use strict';

  // Unique ID counter for highlight rings
  let highlightIdCounter = 0;

  /**
   * Create a tour engine
   * @param {Object} config - Configuration object
   * @param {Array} config.steps - Array of tour step definitions
   * @param {Function} [config.getState] - Function returning current demo state
   * @param {Function} [config.setState] - Function to set demo state
   * @param {HTMLElement} config.container - Container for tour UI
   * @param {Function} [config.onStepChange] - Callback when step changes (step, index)
   * @param {Function} [config.onComplete] - Callback when tour completes
   * @returns {Object} Tour engine API
   *
   * Step object structure:
   * {
   *   id: string,           // Optional unique identifier
   *   title: string,        // Step title
   *   content: string,      // Step description/content (supports HTML)
   *   target: string,       // Optional CSS selector for element to highlight
   *   position: string,     // Panel position: 'top', 'bottom', 'left', 'right', 'center'
   *   state: object,        // Optional state to apply when step loads
   *   action: function      // Optional function to execute when step loads
   * }
   */
  function createTourEngine(config) {
    const {
      steps,
      getState,
      setState,
      container,
      onStepChange,
      onComplete
    } = config;

    // Validate required config
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
      throw new Error('TourEngine: steps array is required and must not be empty');
    }
    if (!container || !(container instanceof HTMLElement)) {
      throw new Error('TourEngine: container must be a valid HTMLElement');
    }

    let currentIndex = -1;
    let isActiveState = false;
    let ui = null;
    let highlightOverlay = null;
    let stylesInjected = false;

    /**
     * Inject CSS styles for tour components
     */
    function injectStyles() {
      if (stylesInjected) return;
      stylesInjected = true;

      const style = document.createElement('style');
      style.id = 'tour-engine-styles';
      style.textContent = `
        /* Tour Panel */
        .tour-panel {
          background: linear-gradient(135deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 35, 0.98));
          border: 2px solid var(--soft-magenta, #C792EA);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 0 30px rgba(199, 146, 234, 0.3);
          position: relative;
          z-index: 1000;
        }

        .tour-panel--positioned {
          position: fixed;
          max-width: 400px;
          z-index: 10001;
        }

        .tour-panel--top {
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .tour-panel--bottom {
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        }

        .tour-panel--left {
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .tour-panel--right {
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .tour-panel--center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Header */
        .tour-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .tour-badge {
          background: var(--soft-magenta, #C792EA);
          color: var(--space-black, #0a0a14);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .tour-close {
          background: none;
          border: none;
          color: var(--text-muted, #6272A4);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 0.5rem;
          line-height: 1;
          transition: color 0.15s ease;
        }

        .tour-close:hover {
          color: var(--text-primary, #F8F8F2);
        }

        .tour-close:focus-visible {
          outline: 2px solid var(--soft-magenta, #C792EA);
          outline-offset: 2px;
        }

        /* Content */
        .tour-content {
          margin-bottom: 1rem;
        }

        .tour-step-number {
          font-size: 0.875rem;
          color: var(--soft-magenta, #C792EA);
          margin-bottom: 0.5rem;
        }

        .tour-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary, #F8F8F2);
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .tour-description {
          font-size: 1rem;
          color: var(--text-secondary, #BFBFBF);
          line-height: 1.6;
        }

        .tour-description em {
          color: var(--stellar-amber, #FFB86C);
          font-style: normal;
          font-weight: 500;
        }

        .tour-description strong {
          color: var(--text-primary, #F8F8F2);
        }

        .tour-description code {
          background: var(--space-light, #252538);
          padding: 0.1rem 0.3rem;
          border-radius: 3px;
          font-family: var(--font-mono, monospace);
          font-size: 0.9em;
        }

        /* Navigation */
        .tour-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color, rgba(255,255,255,0.1));
        }

        .tour-progress {
          flex: 1;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted, #6272A4);
        }

        .tour-progress-bar {
          display: flex;
          gap: 4px;
          justify-content: center;
          margin-top: 4px;
        }

        .tour-progress-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--space-light, #252538);
          transition: all 0.2s ease;
        }

        .tour-progress-dot.completed {
          background: var(--soft-magenta, #C792EA);
        }

        .tour-progress-dot.current {
          background: var(--soft-magenta, #C792EA);
          box-shadow: 0 0 8px rgba(199, 146, 234, 0.6);
          transform: scale(1.2);
        }

        /* Buttons */
        .tour-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 6px;
          border: 1px solid var(--border-color, rgba(255,255,255,0.1));
          background: var(--space-light, #252538);
          color: var(--text-secondary, #BFBFBF);
          cursor: pointer;
          font-size: 0.9rem;
          font-family: inherit;
          transition: all 0.15s ease;
          min-height: 36px;
        }

        .tour-btn:hover:not(:disabled) {
          background: var(--space-medium, #1a1a2e);
          border-color: var(--soft-magenta, #C792EA);
          color: var(--text-primary, #F8F8F2);
        }

        .tour-btn:focus-visible {
          outline: 2px solid var(--soft-magenta, #C792EA);
          outline-offset: 2px;
        }

        .tour-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tour-btn.primary {
          background: var(--soft-magenta, #C792EA);
          color: var(--space-black, #0a0a14);
          border-color: var(--soft-magenta, #C792EA);
          font-weight: 500;
        }

        .tour-btn.primary:hover:not(:disabled) {
          background: #d4a8f0;
          box-shadow: 0 0 15px rgba(199, 146, 234, 0.4);
        }

        /* Highlight overlay */
        .tour-highlight-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10000;
        }

        .tour-highlight-ring {
          position: absolute;
          border: 3px solid var(--soft-magenta, #C792EA);
          border-radius: 8px;
          box-shadow: 0 0 0 4000px rgba(10, 10, 20, 0.7),
                      0 0 20px rgba(199, 146, 234, 0.5),
                      inset 0 0 20px rgba(199, 146, 234, 0.2);
          pointer-events: none;
          transition: all 0.3s ease;
        }

        .tour-highlight-pulse {
          animation: tour-pulse 2s ease-in-out infinite;
        }

        @keyframes tour-pulse {
          0%, 100% {
            box-shadow: 0 0 0 4000px rgba(10, 10, 20, 0.7),
                        0 0 20px rgba(199, 146, 234, 0.5),
                        inset 0 0 20px rgba(199, 146, 234, 0.2);
          }
          50% {
            box-shadow: 0 0 0 4000px rgba(10, 10, 20, 0.7),
                        0 0 30px rgba(199, 146, 234, 0.7),
                        inset 0 0 30px rgba(199, 146, 234, 0.3);
          }
        }

        /* Entrance animation */
        .tour-panel-enter {
          animation: tour-slide-in 0.3s ease-out;
        }

        @keyframes tour-slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tour-panel--positioned.tour-panel-enter {
          animation: tour-fade-in 0.3s ease-out;
        }

        @keyframes tour-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .tour-panel-enter,
          .tour-highlight-ring,
          .tour-progress-dot {
            animation: none;
            transition: none;
          }

          .tour-highlight-pulse {
            animation: none;
          }
        }
      `;

      document.head.appendChild(style);
    }

    /**
     * Create the tour UI panel
     */
    function createUI() {
      const wrapper = document.createElement('div');
      wrapper.className = 'tour-panel tour-panel-enter';
      wrapper.setAttribute('role', 'dialog');
      wrapper.setAttribute('aria-label', 'Instructor Tour');
      wrapper.innerHTML = `
        <div class="tour-header">
          <span class="tour-badge">Instructor Tour</span>
          <button class="tour-close" aria-label="Exit tour" title="Exit tour">&times;</button>
        </div>
        <div class="tour-content">
          <div class="tour-step-number" aria-live="polite"></div>
          <h3 class="tour-title"></h3>
          <div class="tour-description"></div>
        </div>
        <div class="tour-nav">
          <button class="tour-btn prev-btn" aria-label="Previous step">&larr; Back</button>
          <div class="tour-progress">
            <span class="tour-progress-text"></span>
            <div class="tour-progress-bar" aria-hidden="true"></div>
          </div>
          <button class="tour-btn next-btn primary" aria-label="Next step">Next &rarr;</button>
        </div>
      `;

      return wrapper;
    }

    /**
     * Create the highlight overlay for targeting elements
     */
    function createHighlightOverlay() {
      const overlay = document.createElement('div');
      overlay.className = 'tour-highlight-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      return overlay;
    }

    /**
     * Update the progress bar dots
     */
    function updateProgressBar() {
      const progressBar = ui.querySelector('.tour-progress-bar');
      progressBar.innerHTML = '';

      steps.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'tour-progress-dot';
        if (index < currentIndex) {
          dot.classList.add('completed');
        } else if (index === currentIndex) {
          dot.classList.add('current');
        }
        progressBar.appendChild(dot);
      });
    }

    /**
     * Highlight a target element
     * @param {string} selector - CSS selector for target element
     */
    function highlightTarget(selector) {
      // Clear existing highlight
      clearHighlight();

      if (!selector) return;

      const targetElement = document.querySelector(selector);
      if (!targetElement) {
        console.warn(`TourEngine: Target element not found: ${selector}`);
        return;
      }

      // Create and position highlight ring
      const rect = targetElement.getBoundingClientRect();
      const padding = 8;

      const ring = document.createElement('div');
      ring.className = 'tour-highlight-ring tour-highlight-pulse';
      ring.id = `tour-highlight-${++highlightIdCounter}`;
      ring.style.left = `${rect.left - padding}px`;
      ring.style.top = `${rect.top - padding}px`;
      ring.style.width = `${rect.width + padding * 2}px`;
      ring.style.height = `${rect.height + padding * 2}px`;

      highlightOverlay.appendChild(ring);

      // Scroll target into view if needed
      if (!isElementInViewport(targetElement)) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }

    /**
     * Clear the highlight overlay
     */
    function clearHighlight() {
      if (highlightOverlay) {
        highlightOverlay.innerHTML = '';
      }
    }

    /**
     * Check if element is in viewport
     */
    function isElementInViewport(el) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    /**
     * Position the panel based on step configuration
     * @param {string} position - Position value from step
     */
    function positionPanel(position) {
      // Remove all position classes
      ui.classList.remove(
        'tour-panel--positioned',
        'tour-panel--top',
        'tour-panel--bottom',
        'tour-panel--left',
        'tour-panel--right',
        'tour-panel--center'
      );

      if (position && position !== 'inline') {
        ui.classList.add('tour-panel--positioned', `tour-panel--${position}`);

        // Move to body for fixed positioning
        if (ui.parentElement !== document.body) {
          document.body.appendChild(ui);
        }
      } else {
        // Inline positioning (default) - put in container
        if (ui.parentElement !== container) {
          container.insertBefore(ui, container.firstChild);
        }
      }
    }

    /**
     * Load a specific step
     * @param {number} index - Step index to load
     */
    function loadStep(index) {
      if (index < 0 || index >= steps.length) return;

      const previousIndex = currentIndex;
      currentIndex = index;
      const step = steps[index];

      // Update UI content
      ui.querySelector('.tour-step-number').textContent =
        `Step ${index + 1} of ${steps.length}`;
      ui.querySelector('.tour-title').textContent = step.title || '';
      ui.querySelector('.tour-description').innerHTML = step.content || step.description || '';

      // Update navigation
      ui.querySelector('.prev-btn').disabled = index === 0;
      const nextBtn = ui.querySelector('.next-btn');
      nextBtn.textContent = index === steps.length - 1 ? 'Finish' : 'Next \u2192';

      // Update progress
      ui.querySelector('.tour-progress-text').textContent = `${index + 1} / ${steps.length}`;
      updateProgressBar();

      // Position panel
      positionPanel(step.position);

      // Highlight target element
      highlightTarget(step.target);

      // Apply state if provided
      if (step.state && setState) {
        setState(step.state);
      }

      // Execute action callback if provided
      if (step.action && typeof step.action === 'function') {
        try {
          step.action(step, index, getState ? getState() : null);
        } catch (err) {
          console.error('TourEngine: Error in step action:', err);
        }
      }

      // Call onStepChange callback
      if (onStepChange && typeof onStepChange === 'function') {
        try {
          onStepChange(step, index, previousIndex);
        } catch (err) {
          console.error('TourEngine: Error in onStepChange callback:', err);
        }
      }
    }

    /**
     * Go to the next step
     */
    function next() {
      if (currentIndex < steps.length - 1) {
        loadStep(currentIndex + 1);
      } else {
        stop();
      }
    }

    /**
     * Go to the previous step
     */
    function previous() {
      if (currentIndex > 0) {
        loadStep(currentIndex - 1);
      }
    }

    /**
     * Start the tour
     */
    function start() {
      injectStyles();

      // Create UI if needed
      if (!ui) {
        ui = createUI();

        // Wire up event handlers
        ui.querySelector('.tour-close').addEventListener('click', stop);
        ui.querySelector('.prev-btn').addEventListener('click', previous);
        ui.querySelector('.next-btn').addEventListener('click', () => {
          if (currentIndex === steps.length - 1) {
            stop();
          } else {
            next();
          }
        });

        // Keyboard navigation
        ui.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            stop();
          } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (currentIndex < steps.length - 1) {
              next();
            }
          } else if (e.key === 'ArrowLeft') {
            previous();
          }
        });
      }

      // Create highlight overlay
      if (!highlightOverlay) {
        highlightOverlay = createHighlightOverlay();
        document.body.appendChild(highlightOverlay);
      }

      isActiveState = true;
      ui.style.display = 'block';
      highlightOverlay.style.display = 'block';

      // Focus the panel for keyboard navigation
      ui.setAttribute('tabindex', '-1');
      ui.focus();

      loadStep(0);
    }

    /**
     * Stop the tour
     */
    function stop() {
      isActiveState = false;
      const wasComplete = currentIndex === steps.length - 1;

      if (ui) {
        ui.style.display = 'none';
        // Move back to container if it was positioned
        if (ui.parentElement === document.body) {
          container.insertBefore(ui, container.firstChild);
          ui.classList.remove(
            'tour-panel--positioned',
            'tour-panel--top',
            'tour-panel--bottom',
            'tour-panel--left',
            'tour-panel--right',
            'tour-panel--center'
          );
        }
      }

      clearHighlight();
      if (highlightOverlay) {
        highlightOverlay.style.display = 'none';
      }

      // Call onComplete callback if tour was finished
      if (wasComplete && onComplete && typeof onComplete === 'function') {
        try {
          onComplete();
        } catch (err) {
          console.error('TourEngine: Error in onComplete callback:', err);
        }
      }

      currentIndex = -1;
    }

    /**
     * Check if tour is active
     * @returns {boolean}
     */
    function isActive() {
      return isActiveState;
    }

    /**
     * Get the current step
     * @returns {Object|null} Current step object or null if tour is not active
     */
    function getCurrentStep() {
      if (!isActiveState || currentIndex < 0) return null;
      return steps[currentIndex];
    }

    /**
     * Get progress information
     * @returns {Object} Progress object with current, total, and percentage
     */
    function getProgress() {
      return {
        current: currentIndex + 1,
        total: steps.length,
        percentage: steps.length > 0 ? Math.round(((currentIndex + 1) / steps.length) * 100) : 0
      };
    }

    /**
     * Go to a specific step by index
     * @param {number} index - Step index
     */
    function goToStep(index) {
      if (isActiveState && index >= 0 && index < steps.length) {
        loadStep(index);
      }
    }

    // Return public API
    return {
      start,
      stop,
      next,
      previous,
      isActive,
      getCurrentStep,
      getProgress,
      goToStep,
      // Alias for backwards compatibility
      loadStep: goToStep
    };
  }

  // Export to window
  if (typeof window !== 'undefined') {
    window.TourEngine = {
      create: createTourEngine
    };
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { create: createTourEngine };
  }

})();
