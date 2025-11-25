/**
 * Session Manager - Handles automatic logout on inactivity
 * Tracks user activity and logs out after specified timeout period
 */

class SessionManager {
  constructor() {
    this.timeout = 120 * 60 * 1000; // 30 minutes in milliseconds
    this.warningTime = 2 * 60 * 1000; // Show warning 2 minutes before logout
    this.timerId = null;
    this.warningTimerId = null;
    this.onLogout = null;
    this.onWarning = null;
    this.isActive = false;
    
    // Events to track user activity
    this.events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];
  }

  /**
   * Initialize session manager
   * @param {Function} logoutCallback - Function to call when session expires
   * @param {Function} warningCallback - Function to call before session expires (optional)
   */
  init(logoutCallback, warningCallback = null) {
    this.onLogout = logoutCallback;
    this.onWarning = warningCallback;
    this.isActive = true;
    
    // Start tracking activity
    this.startTracking();
    
    // Reset timer on initialization
    this.resetTimer();
  }

  /**
   * Start tracking user activity
   */
  startTracking() {
    this.events.forEach((event) => {
      window.addEventListener(event, this.resetTimer.bind(this), true);
    });
  }

  /**
   * Stop tracking user activity
   */
  stopTracking() {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.resetTimer.bind(this), true);
    });
    
    this.clearTimers();
    this.isActive = false;
  }

  /**
   * Reset the inactivity timer
   */
  resetTimer() {
    if (!this.isActive) return;
    
    // Clear existing timers
    this.clearTimers();
    
    // Set warning timer (if callback provided)
    if (this.onWarning) {
      const warningDelay = this.timeout - this.warningTime;
      this.warningTimerId = setTimeout(() => {
        if (this.onWarning) {
          this.onWarning();
        }
      }, warningDelay);
    }
    
    // Set logout timer
    this.timerId = setTimeout(() => {
      this.handleLogout();
    }, this.timeout);
  }

  /**
   * Clear all timers
   */
  clearTimers() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.warningTimerId) {
      clearTimeout(this.warningTimerId);
      this.warningTimerId = null;
    }
  }

  /**
   * Handle logout
   */
  handleLogout() {
    this.stopTracking();
    if (this.onLogout) {
      this.onLogout();
    }
  }

  /**
   * Manually trigger logout
   */
  logout() {
    this.handleLogout();
  }

  /**
   * Set custom timeout duration
   * @param {number} minutes - Timeout in minutes
   */
  setTimeout(minutes) {
    this.timeout = minutes * 60 * 1000;
    this.resetTimer();
  }

  /**
   * Set custom warning time
   * @param {number} minutes - Warning time in minutes before logout
   */
  setWarningTime(minutes) {
    this.warningTime = minutes * 60 * 1000;
  }

  /**
   * Check if session is active
   */
  isSessionActive() {
    return this.isActive;
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;

