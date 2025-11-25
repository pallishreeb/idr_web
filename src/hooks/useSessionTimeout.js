import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/userSlice';
import sessionManager from '../utils/sessionManager';
import { toast } from 'react-toastify';

/**
 * Custom hook to handle session timeout and auto-logout
 * @param {number} timeoutMinutes - Session timeout in minutes (default: 30)
 * @param {number} warningMinutes - Show warning before timeout in minutes (default: 2)
 */
const useSessionTimeout = (timeoutMinutes = 30, warningMinutes = 2) => {
  const dispatch = useDispatch();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('user_idr_token');

    if (!token) {
      // No token, don't start session manager
      return;
    }

    // Configure timeout durations
    sessionManager.setTimeout(timeoutMinutes);
    sessionManager.setWarningTime(warningMinutes);

    // Handle warning before logout
    const handleWarning = () => {
      setShowWarning(true);
    };

    // Handle automatic logout
    const handleLogout = () => {
      setShowWarning(false);

      // Clear all user data
      localStorage.removeItem('user_idr_token');
      localStorage.removeItem('user');

      // Dispatch logout action
      dispatch(logout());

      // Show logout message
      toast.info('You have been logged out due to inactivity.', {
        autoClose: 5000,
        position: 'top-center',
      });

      // Redirect to login page
      window.location.href = '/';
    };

    // Initialize session manager
    sessionManager.init(handleLogout, handleWarning);

    // Cleanup on unmount
    return () => {
      sessionManager.stopTracking();
    };
  }, [dispatch, timeoutMinutes, warningMinutes]);

  // Function to manually extend session
  const extendSession = () => {
    setShowWarning(false);
    sessionManager.resetTimer();
    toast.success('Session extended successfully!', {
      autoClose: 3000,
    });
  };

  // Function to manually trigger logout (for when countdown reaches 0)
  const forceLogout = () => {
    setShowWarning(false);

    // Clear all user data
    localStorage.removeItem('user_idr_token');
    localStorage.removeItem('user');

    // Dispatch logout action
    dispatch(logout());

    // Show logout message
    toast.info('You have been logged out due to inactivity.', {
      autoClose: 5000,
      position: 'top-center',
    });

    // Redirect to login page
    window.location.href = '/';
  };

  return {
    showWarning,
    extendSession,
    forceLogout,
    warningTimeSeconds: warningMinutes * 60,
  };
};

export default useSessionTimeout;

