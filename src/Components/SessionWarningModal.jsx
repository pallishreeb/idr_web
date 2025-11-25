import { useState, useEffect } from 'react';
import { IoWarning } from 'react-icons/io5';

/**
 * Session Warning Modal
 * Displays a warning when user session is about to expire
 */
const SessionWarningModal = ({ show, onExtend, onTimeout, timeRemaining = 120 }) => {
  const [countdown, setCountdown] = useState(timeRemaining);

  useEffect(() => {
    if (show) {
      setCountdown(timeRemaining);

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Trigger logout when countdown reaches 0
            if (onTimeout) {
              onTimeout();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [show, timeRemaining, onTimeout]);

  if (!show) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-yellow-100 rounded-full p-3">
            <IoWarning className="text-yellow-600 text-4xl" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Session Expiring Soon
        </h2>
        
        <p className="text-center text-gray-600 mb-4">
          Your session will expire due to inactivity in:
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="text-center">
            <span className="text-4xl font-bold text-red-600">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <p className="text-sm text-gray-600 mt-2">minutes remaining</p>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-600 mb-6">
          Click the button below to stay logged in, or you will be automatically logged out.
        </p>
        
        <button
          onClick={onExtend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default SessionWarningModal;

