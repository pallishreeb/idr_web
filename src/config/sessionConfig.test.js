/**
 * Session Configuration for Testing
 * Use shorter timeouts for testing purposes
 * 
 * To use this for testing:
 * 1. Temporarily rename sessionConfig.js to sessionConfig.prod.js
 * 2. Rename this file to sessionConfig.js
 * 3. Test the session timeout functionality
 * 4. Restore original files after testing
 */

const sessionConfig = {
  // Short timeout for testing (2 minutes)
  TIMEOUT_MINUTES: 2,

  // Warning 30 seconds before logout
  WARNING_MINUTES: 0.5,

  // Enable session timeout
  ENABLE_SESSION_TIMEOUT: true,

  // Enable warning
  ENABLE_WARNING: true,
};

export default sessionConfig;

