/**
 * Challenge Engine for Astronomy Demos
 *
 * A reusable challenge system for interactive astronomy demonstrations.
 * Provides structured puzzles with feedback, hints, and progress tracking.
 *
 * @module ChallengeEngine
 * @version 1.0.0
 */

(function() {
  'use strict';

  /**
   * Challenge object structure:
   * @typedef {Object} Challenge
   * @property {string} id - Unique identifier for the challenge
   * @property {string} question - The challenge prompt/question
   * @property {string} type - Answer type: 'angle', 'phase', 'position', 'boolean'
   * @property {*} answer - The correct answer (type depends on 'type' field)
   * @property {number} [tolerance] - Acceptable tolerance for numeric answers (default varies by type)
   * @property {string[]} hints - Array of progressive hints
   * @property {string} explanation - Explanation shown after correct answer
   */

  /**
   * Options for ChallengeEngine
   * @typedef {Object} ChallengeOptions
   * @property {Function} [onCorrect] - Callback when answer is correct: (challenge, userAnswer) => void
   * @property {Function} [onIncorrect] - Callback when answer is incorrect: (challenge, userAnswer, result) => void
   * @property {Function} [onComplete] - Callback when all challenges complete: (stats) => void
   * @property {Function} [onProgress] - Callback on progress change: (current, total, challenge) => void
   * @property {HTMLElement} [container] - Container for challenge UI (optional)
   * @property {boolean} [showUI=true] - Whether to render built-in UI
   */

  // Default tolerances by answer type
  const DEFAULT_TOLERANCES = {
    angle: 15,      // degrees
    phase: 0.1,     // phase fraction
    position: 20,   // pixels or units
    boolean: 0      // exact match
  };

  /**
   * ChallengeEngine class
   * Manages a set of challenges with progress tracking and feedback
   */
  class ChallengeEngine {
    /**
     * Factory method to create a ChallengeEngine with config object
     * @param {Object} config - Configuration object
     * @param {Array} config.challenges - Array of challenge definitions
     * @param {Function} [config.getState] - Function returning current demo state
     * @param {Function} [config.setState] - Function to set demo state
     * @param {HTMLElement} [config.container] - Container for challenge UI
     * @returns {ChallengeEngine} New engine instance
     */
    static create(config) {
      const { challenges, getState, setState, container } = config;

      // Transform challenge format: prompt -> question, hint (string) -> hints (array)
      const transformedChallenges = challenges.map(c => {
        const transformed = { ...c };

        // Map 'prompt' to internal 'question'
        if (c.prompt !== undefined && c.question === undefined) {
          transformed.question = c.prompt;
        }

        // Map 'hint' (string) to internal 'hints' (array)
        if (typeof c.hint === 'string' && c.hints === undefined) {
          transformed.hints = [c.hint];
        }

        // If challenge has a check function, mark it as custom type
        if (typeof c.check === 'function' && c.type === undefined) {
          transformed.type = 'custom';
        }

        return transformed;
      });

      const options = {
        container,
        getState,
        setState,
        showUI: true
      };

      return new ChallengeEngine(transformedChallenges, options);
    }

    /**
     * Create a ChallengeEngine
     * @param {Challenge[]} challenges - Array of challenge definitions
     * @param {ChallengeOptions} [options={}] - Configuration options
     */
    constructor(challenges, options = {}) {
      if (!Array.isArray(challenges) || challenges.length === 0) {
        throw new Error('ChallengeEngine requires a non-empty array of challenges');
      }

      this.challenges = challenges.map((c, i) => ({
        ...c,
        id: c.id || `challenge-${i + 1}`,
        hints: c.hints || [],
        tolerance: c.tolerance ?? DEFAULT_TOLERANCES[c.type] ?? 0
      }));

      // Options with defaults
      this.options = {
        showUI: true,
        ...options
      };

      // State
      this.currentIndex = -1;
      this._isActive = false;
      this.hintsUsed = 0;
      this.attempts = 0;
      this.stats = {
        correct: 0,
        incorrect: 0,
        skipped: 0,
        hintsUsed: 0,
        totalAttempts: 0
      };

      // UI elements
      this.ui = null;
      this.styleSheet = null;
      this._previousActiveElement = null;

      // Bind methods
      this.start = this.start.bind(this);
      this.check = this.check.bind(this);
      this.skip = this.skip.bind(this);
      this.getHint = this.getHint.bind(this);
      this.reset = this.reset.bind(this);
    }

    /**
     * Start challenge mode from the beginning or resume
     * @returns {Challenge} The first/current challenge
     */
    start() {
      this._isActive = true;

      if (this.currentIndex < 0) {
        this.currentIndex = 0;
      }

      // Create UI if needed
      if (this.options.showUI && this.options.container && !this.ui) {
        this._createUI();
      }

      // Reset per-challenge state
      this.hintsUsed = 0;
      this.attempts = 0;

      // Apply initialState for the first/current challenge
      const challenge = this.getCurrentChallenge();
      if (challenge && challenge.initialState && this.options.setState) {
        this.options.setState(challenge.initialState);
      }

      // Show UI
      if (this.ui) {
        this._previousActiveElement = document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;

        this.ui.style.display = 'block';
        this._updateUI();

        const closeBtn = this.ui.querySelector('.challenge-close');
        if (closeBtn) {
          closeBtn.focus();
        } else {
          this.ui.focus();
        }
      }

      // Fire progress callback
      this._fireProgress();

      return challenge;
    }

    /**
     * Check if user's answer is correct
     * @param {*} userAnswer - The user's answer to check
     * @returns {Object} Result object with { correct, close, message }
     */
    check(userAnswer) {
      if (!this._isActive || this.currentIndex < 0) {
        return { correct: false, close: false, message: 'No active challenge' };
      }

      const challenge = this.getCurrentChallenge();
      this.attempts++;
      this.stats.totalAttempts++;

      const result = this._evaluateAnswer(challenge, userAnswer);

      if (result.correct) {
        this.stats.correct++;

        // Fire callback
        if (this.options.onCorrect) {
          this.options.onCorrect(challenge, userAnswer);
        }

        // Update UI
        if (this.ui) {
          this._showFeedback('correct', result.message || challenge.explanation || 'Correct!');
        }

        // Auto-advance after delay if more challenges
        if (this.currentIndex < this.challenges.length - 1) {
          setTimeout(() => this._nextChallenge(), 1500);
        } else {
          // All complete
          setTimeout(() => this._complete(), 1500);
        }
      } else {
        this.stats.incorrect++;

        // Fire callback
        if (this.options.onIncorrect) {
          this.options.onIncorrect(challenge, userAnswer, result);
        }

        // Update UI
        if (this.ui) {
          const feedbackType = result.close ? 'close' : 'incorrect';
          this._showFeedback(feedbackType, result.message || 'Not quite. Try again.');
        }
      }

      return result;
    }

    /**
     * Skip the current challenge
     * @returns {Challenge|null} The next challenge, or null if none
     */
    skip() {
      if (!this._isActive || this.currentIndex < 0) {
        return null;
      }

      this.stats.skipped++;

      if (this.currentIndex < this.challenges.length - 1) {
        return this._nextChallenge();
      } else {
        this._complete();
        return null;
      }
    }

    /**
     * Get the next hint for the current challenge
     * @returns {string|null} The hint text, or null if no more hints
     */
    getHint() {
      if (!this._isActive || this.currentIndex < 0) {
        return null;
      }

      const challenge = this.getCurrentChallenge();

      if (this.hintsUsed >= challenge.hints.length) {
        return null; // No more hints
      }

      const hint = challenge.hints[this.hintsUsed];
      this.hintsUsed++;
      this.stats.hintsUsed++;

      // Update UI
      if (this.ui) {
        this._showHint(hint);
      }

      return hint;
    }

    /**
     * Get the current challenge
     * @returns {Challenge|null} The current challenge object, or null if not active
     */
    getCurrentChallenge() {
      if (this.currentIndex < 0 || this.currentIndex >= this.challenges.length) {
        return null;
      }
      return this.challenges[this.currentIndex];
    }

    /**
     * Get current progress
     * @returns {Object} Progress object with { current, total, percent, stats }
     */
    getProgress() {
      return {
        current: this.currentIndex + 1,
        total: this.challenges.length,
        percent: Math.round(((this.currentIndex + 1) / this.challenges.length) * 100),
        stats: { ...this.stats }
      };
    }

    /**
     * Reset to initial state
     */
    reset() {
      this.currentIndex = -1;
      this._isActive = false;
      this.hintsUsed = 0;
      this.attempts = 0;
      this.stats = {
        correct: 0,
        incorrect: 0,
        skipped: 0,
        hintsUsed: 0,
        totalAttempts: 0
      };

      if (this.ui) {
        this.ui.style.display = 'none';
        this._clearFeedback();
        this._clearHint();
      }
    }

    /**
     * Stop challenge mode (hide UI but preserve progress)
     */
    stop() {
      this._isActive = false;
      if (this.ui) {
        this.ui.style.display = 'none';
      }

      if (this._previousActiveElement && document.contains(this._previousActiveElement)) {
        this._previousActiveElement.focus();
      }
      this._previousActiveElement = null;
    }

    /**
     * Check if challenge mode is currently active
     * @returns {boolean}
     */
    isRunning() {
      return this._isActive;
    }

    /**
     * Check if challenge mode is currently active (alias for isRunning)
     * @returns {boolean}
     */
    isActive() {
      return this._isActive;
    }

    // ========================================
    // Private Methods
    // ========================================

    /**
     * Evaluate user's answer against challenge
     * @private
     */
    _evaluateAnswer(challenge, userAnswer) {
      const { type, answer, tolerance } = challenge;

      switch (type) {
        case 'custom':
          // Use the challenge's check function with getState
          if (typeof challenge.check === 'function') {
            // If userAnswer is provided, use it; otherwise use getState
            const state = userAnswer !== undefined ? userAnswer :
              (this.options.getState ? this.options.getState() : {});
            return challenge.check(state);
          }
          return { correct: false, close: false, message: 'No check function defined' };

        case 'angle':
          return this._checkAngle(userAnswer, answer, tolerance);

        case 'phase':
          return this._checkPhase(userAnswer, answer, tolerance);

        case 'position':
          return this._checkPosition(userAnswer, answer, tolerance);

        case 'boolean':
          return this._checkBoolean(userAnswer, answer);

        default:
          // Fallback: direct comparison
          return {
            correct: userAnswer === answer,
            close: false,
            message: userAnswer === answer ? 'Correct!' : 'Incorrect.'
          };
      }
    }

    /**
     * Check angle answer (handles wraparound)
     * @private
     */
    _checkAngle(userAngle, correctAngle, tolerance) {
      // Normalize both angles to 0-360
      const normalizeAngle = (a) => ((a % 360) + 360) % 360;
      const user = normalizeAngle(userAngle);
      const correct = normalizeAngle(correctAngle);

      // Calculate angular difference (handles wraparound)
      let diff = Math.abs(user - correct);
      if (diff > 180) {
        diff = 360 - diff;
      }

      const isCorrect = diff <= tolerance;
      const isClose = diff <= tolerance * 2;

      return {
        correct: isCorrect,
        close: !isCorrect && isClose,
        difference: diff,
        message: isCorrect
          ? `Correct! Angle: ${user.toFixed(0)}deg`
          : isClose
            ? `Close! You're ${diff.toFixed(0)}deg off.`
            : `Off by ${diff.toFixed(0)}deg. Try again.`
      };
    }

    /**
     * Check phase answer (0-1 range)
     * @private
     */
    _checkPhase(userPhase, correctPhase, tolerance) {
      // Normalize to 0-1
      const normalizePhase = (p) => ((p % 1) + 1) % 1;
      const user = normalizePhase(userPhase);
      const correct = normalizePhase(correctPhase);

      // Handle wraparound at 0/1
      let diff = Math.abs(user - correct);
      if (diff > 0.5) {
        diff = 1 - diff;
      }

      const isCorrect = diff <= tolerance;
      const isClose = diff <= tolerance * 2;

      return {
        correct: isCorrect,
        close: !isCorrect && isClose,
        difference: diff,
        message: isCorrect
          ? 'Correct phase!'
          : isClose
            ? `Close! Phase is ${(diff * 100).toFixed(0)}% off.`
            : 'Try a different phase position.'
      };
    }

    /**
     * Check position answer (x, y coordinates)
     * @private
     */
    _checkPosition(userPos, correctPos, tolerance) {
      // Handle both {x, y} objects and [x, y] arrays
      const getCoords = (pos) => {
        if (Array.isArray(pos)) return { x: pos[0], y: pos[1] };
        return { x: pos.x || 0, y: pos.y || 0 };
      };

      const user = getCoords(userPos);
      const correct = getCoords(correctPos);

      const dx = user.x - correct.x;
      const dy = user.y - correct.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const isCorrect = distance <= tolerance;
      const isClose = distance <= tolerance * 2;

      return {
        correct: isCorrect,
        close: !isCorrect && isClose,
        distance: distance,
        message: isCorrect
          ? 'Correct position!'
          : isClose
            ? `Close! ${distance.toFixed(0)} units away.`
            : `Position is ${distance.toFixed(0)} units off.`
      };
    }

    /**
     * Check boolean answer
     * @private
     */
    _checkBoolean(userAnswer, correctAnswer) {
      // Convert to actual boolean
      const user = Boolean(userAnswer);
      const correct = Boolean(correctAnswer);

      return {
        correct: user === correct,
        close: false,
        message: user === correct ? 'Correct!' : 'Not quite.'
      };
    }

    /**
     * Advance to next challenge
     * @private
     */
    _nextChallenge() {
      this.currentIndex++;
      this.hintsUsed = 0;
      this.attempts = 0;

      // Apply initialState if challenge has one
      const challenge = this.getCurrentChallenge();
      if (challenge && challenge.initialState && this.options.setState) {
        this.options.setState(challenge.initialState);
      }

      if (this.ui) {
        this._updateUI();
        this._clearFeedback();
        this._clearHint();
      }

      this._fireProgress();
      return challenge;
    }

    /**
     * Handle completion of all challenges
     * @private
     */
    _complete() {
      this._isActive = false;

      const finalStats = this.getProgress().stats;

      if (this.options.onComplete) {
        this.options.onComplete(finalStats);
      }

      if (this.ui) {
        this._showCompletion(finalStats);
      }
    }

    /**
     * Fire progress callback
     * @private
     */
    _fireProgress() {
      if (this.options.onProgress) {
        this.options.onProgress(
          this.currentIndex + 1,
          this.challenges.length,
          this.getCurrentChallenge()
        );
      }
    }

    // ========================================
    // UI Methods
    // ========================================

    /**
     * Create the challenge UI panel
     * @private
     */
    _createUI() {
      // Add styles if not already added
      if (!this.styleSheet) {
        this._injectStyles();
      }

      const wrapper = document.createElement('div');
      wrapper.className = 'challenge-panel';
      wrapper.setAttribute('role', 'dialog');
      wrapper.setAttribute('aria-label', 'Challenge Mode');
      wrapper.setAttribute('aria-modal', 'false');
      wrapper.tabIndex = -1;
      wrapper.innerHTML = `
        <div class="challenge-header">
          <span class="challenge-badge">Challenge Mode</span>
          <button class="challenge-close" aria-label="Exit challenge mode">&times;</button>
        </div>
        <div class="challenge-content">
          <div class="challenge-number"></div>
          <div class="challenge-question"></div>
          <div class="challenge-hint" style="display: none;"></div>
          <div class="challenge-feedback" style="display: none;"></div>
        </div>
        <div class="challenge-actions">
          <button class="challenge-btn hint-btn">Show Hint</button>
          <button class="challenge-btn skip-btn">Skip</button>
          <button class="challenge-btn check-btn primary">Check Answer</button>
        </div>
        <div class="challenge-nav">
          <button class="challenge-btn prev-btn" disabled>&larr; Previous</button>
          <span class="challenge-progress"></span>
          <button class="challenge-btn next-btn">Next &rarr;</button>
        </div>
      `;

      // Wire up event handlers
      wrapper.querySelector('.challenge-close').addEventListener('click', () => this.stop());
      wrapper.querySelector('.hint-btn').addEventListener('click', () => this.getHint());
      wrapper.querySelector('.skip-btn').addEventListener('click', () => this.skip());
      wrapper.querySelector('.prev-btn').addEventListener('click', () => this._goToPrevious());
      wrapper.querySelector('.next-btn').addEventListener('click', () => this._goToNext());
      wrapper.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          this.stop();
        }
      });

      // Hook up check-btn: for custom type challenges, use getState and the challenge's check function
      wrapper.querySelector('.check-btn').addEventListener('click', () => {
        const challenge = this.getCurrentChallenge();
        if (challenge && challenge.type === 'custom' && typeof challenge.check === 'function') {
          // Get current state and check using the challenge's check function
          const state = this.options.getState ? this.options.getState() : {};
          this.check(state);
        } else {
          // For non-custom types, the demo must call check() with the answer
          // Fire a custom event that demos can listen for
          const event = new CustomEvent('challengeCheckRequested', {
            detail: { challenge }
          });
          this.options.container.dispatchEvent(event);
        }
      });

      this.options.container.insertBefore(wrapper, this.options.container.firstChild);
      this.ui = wrapper;
    }

    /**
     * Inject CSS styles for challenge UI
     * @private
     */
    _injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .challenge-panel {
          background: rgba(18, 18, 31, 0.95);
          border: 2px solid var(--cosmic-teal, #4ecdc4);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.2);
        }
        .challenge-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .challenge-badge {
          background: var(--cosmic-teal, #4ecdc4);
          color: var(--space-black, #0d0d1a);
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .challenge-close {
          background: none;
          border: none;
          color: var(--text-muted, #6b7280);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 0.5rem;
          line-height: 1;
        }
        .challenge-close:hover {
          color: var(--text-primary, #f5f5f5);
        }
        .challenge-close:focus-visible,
        .challenge-btn:focus-visible {
          outline: 2px solid var(--accent-blue, #4ecdc4);
          outline-offset: 2px;
        }
        .challenge-number {
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
          margin-bottom: 0.5rem;
        }
        .challenge-question {
          font-size: 1.1rem;
          color: var(--text-primary, #f5f5f5);
          margin-bottom: 1rem;
          line-height: 1.5;
        }
        .challenge-hint {
          background: rgba(255, 184, 108, 0.1);
          border-left: 3px solid var(--stellar-amber, #ffb86c);
          padding: 0.75rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--stellar-amber, #ffb86c);
        }
        .challenge-feedback {
          padding: 0.75rem;
          border-radius: 6px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }
        .challenge-feedback.correct {
          background: rgba(80, 250, 123, 0.1);
          border-left: 3px solid var(--nebula-green, #50fa7b);
          color: var(--nebula-green, #50fa7b);
        }
        .challenge-feedback.incorrect {
          background: rgba(255, 121, 198, 0.1);
          border-left: 3px solid var(--nova-pink, #ff79c6);
          color: var(--nova-pink, #ff79c6);
        }
        .challenge-feedback.close {
          background: rgba(255, 184, 108, 0.1);
          border-left: 3px solid var(--stellar-amber, #ffb86c);
          color: var(--stellar-amber, #ffb86c);
        }
        .challenge-actions,
        .challenge-nav {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .challenge-nav {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color, #2d2d44);
        }
        .challenge-progress {
          flex: 1;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-muted, #6b7280);
        }
        .challenge-btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          border: 1px solid var(--border-color, #2d2d44);
          background: var(--space-light, #1a1a2e);
          color: var(--text-secondary, #a0a0a0);
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.15s ease;
        }
        .challenge-btn:hover:not(:disabled) {
          background: var(--space-medium, #252538);
          color: var(--text-primary, #f5f5f5);
          border-color: var(--cosmic-teal, #4ecdc4);
        }
        .challenge-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .challenge-btn.primary {
          background: var(--cosmic-teal, #4ecdc4);
          color: var(--space-black, #0d0d1a);
          border-color: var(--cosmic-teal, #4ecdc4);
          font-weight: 500;
        }
        .challenge-btn.primary:hover:not(:disabled) {
          background: #7dd8d2;
        }
        .challenge-complete {
          text-align: center;
          padding: 1.5rem;
        }
        .challenge-complete h3 {
          color: var(--nebula-green, #50fa7b);
          margin-bottom: 1rem;
        }
        .challenge-complete .stats {
          color: var(--text-secondary, #a0a0a0);
          font-size: 0.9rem;
        }
      `;
      document.head.appendChild(style);
      this.styleSheet = style;
    }

    /**
     * Update the UI to reflect current challenge
     * @private
     */
    _updateUI() {
      if (!this.ui) return;

      const challenge = this.getCurrentChallenge();
      if (!challenge) return;

      this.ui.querySelector('.challenge-number').textContent =
        `Challenge ${this.currentIndex + 1} of ${this.challenges.length}`;

      this.ui.querySelector('.challenge-question').textContent = challenge.question;

      this.ui.querySelector('.challenge-progress').textContent =
        `${this.currentIndex + 1} / ${this.challenges.length}`;

      // Update navigation buttons
      this.ui.querySelector('.prev-btn').disabled = this.currentIndex === 0;
      this.ui.querySelector('.next-btn').textContent =
        this.currentIndex === this.challenges.length - 1 ? 'Finish' : 'Next \u2192';

      // Update hint button state
      const hintBtn = this.ui.querySelector('.hint-btn');
      if (challenge.hints.length === 0) {
        hintBtn.style.display = 'none';
      } else {
        hintBtn.style.display = '';
        hintBtn.textContent = this.hintsUsed > 0
          ? `Next Hint (${challenge.hints.length - this.hintsUsed} left)`
          : 'Show Hint';
        hintBtn.disabled = this.hintsUsed >= challenge.hints.length;
      }
    }

    /**
     * Show feedback message
     * @private
     */
    _showFeedback(type, message) {
      if (!this.ui) return;

      const feedback = this.ui.querySelector('.challenge-feedback');
      feedback.className = `challenge-feedback ${type}`;
      feedback.innerHTML = `<strong>${type === 'correct' ? 'Correct!' : type === 'close' ? 'Close!' : 'Not quite.'}</strong> ${message}`;
      feedback.style.display = 'block';
    }

    /**
     * Clear feedback message
     * @private
     */
    _clearFeedback() {
      if (!this.ui) return;
      const feedback = this.ui.querySelector('.challenge-feedback');
      feedback.style.display = 'none';
    }

    /**
     * Show hint
     * @private
     */
    _showHint(text) {
      if (!this.ui) return;

      const hint = this.ui.querySelector('.challenge-hint');
      hint.textContent = text;
      hint.style.display = 'block';

      // Update button
      const challenge = this.getCurrentChallenge();
      const hintBtn = this.ui.querySelector('.hint-btn');
      if (this.hintsUsed >= challenge.hints.length) {
        hintBtn.disabled = true;
        hintBtn.textContent = 'No more hints';
      } else {
        hintBtn.textContent = `Next Hint (${challenge.hints.length - this.hintsUsed} left)`;
      }
    }

    /**
     * Clear hint display
     * @private
     */
    _clearHint() {
      if (!this.ui) return;
      const hint = this.ui.querySelector('.challenge-hint');
      hint.style.display = 'none';
      hint.textContent = '';
    }

    /**
     * Show completion screen
     * @private
     */
    _showCompletion(stats) {
      if (!this.ui) return;

      const content = this.ui.querySelector('.challenge-content');
      const actions = this.ui.querySelector('.challenge-actions');
      const nav = this.ui.querySelector('.challenge-nav');

      content.innerHTML = `
        <div class="challenge-complete">
          <h3>Challenges Complete!</h3>
          <div class="stats">
            <p>Correct: ${stats.correct} / ${this.challenges.length}</p>
            <p>Hints used: ${stats.hintsUsed}</p>
            <p>Total attempts: ${stats.totalAttempts}</p>
          </div>
        </div>
      `;

      actions.innerHTML = `
        <button class="challenge-btn primary restart-btn">Try Again</button>
        <button class="challenge-btn close-complete-btn">Close</button>
      `;

      nav.style.display = 'none';

      // Wire up new buttons
      this.ui.querySelector('.restart-btn').addEventListener('click', () => {
        this.reset();
        this.start();
      });

      this.ui.querySelector('.close-complete-btn').addEventListener('click', () => {
        this.reset();
      });
    }

    /**
     * Navigate to previous challenge (for review)
     * @private
     */
    _goToPrevious() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.hintsUsed = 0;

        // Apply initialState for the challenge
        const challenge = this.getCurrentChallenge();
        if (challenge && challenge.initialState && this.options.setState) {
          this.options.setState(challenge.initialState);
        }

        this._updateUI();
        this._clearFeedback();
        this._clearHint();
        this._fireProgress();
      }
    }

    /**
     * Navigate to next challenge
     * @private
     */
    _goToNext() {
      if (this.currentIndex < this.challenges.length - 1) {
        this._nextChallenge();
      } else {
        this._complete();
      }
    }

    /**
     * Get the check button element for external event binding
     * @returns {HTMLElement|null}
     */
    getCheckButton() {
      return this.ui ? this.ui.querySelector('.check-btn') : null;
    }
  }

  // ========================================
  // Export
  // ========================================

  // Export for ES modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeEngine;
  }

  // Export for browser
  if (typeof window !== 'undefined') {
    window.ChallengeEngine = ChallengeEngine;
  }

})();
