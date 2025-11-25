/**
 * Session Configuration
 * Centralized configuration for session timeout and security settings
 */

const sessionConfig = {
  // Session timeout in minutes
  // After this period of inactivity, user will be automatically logged out
  // Production: 120 minutes (2 hours)
  // Testing: Set to 1-2 minutes for quick testing
  TIMEOUT_MINUTES: 120, // 2 hours

  // Warning time in minutes before session expires
  // User will receive a warning notification before being logged out
  WARNING_MINUTES: 2, // 2 minutes warning

  // Enable/disable session timeout feature
  ENABLE_SESSION_TIMEOUT: true,

  // Enable/disable warning before logout
  ENABLE_WARNING: true,

  // Quick reference for common timeout values:
  // 30 minutes = 30
  // 1 hour = 60
  // 2 hours = 120
  // 4 hours = 240
  // For testing = 1 or 2
};

export default sessionConfig;

