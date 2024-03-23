import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPassword } from '../../actions/userActions';
import { useNavigate } from 'react-router-dom'; 
const SetPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (passwordValue !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Dispatch the setPassword action
    dispatch(setPassword({ password:passwordValue, email_id:email },navigate));
  };

  return (
    <div className="flex h-screen">
    {/* Left side with image */}
    <div className="hidden lg:block lg:w-1/2 bg-indigo-500 relative">
      {/* Overlay blue color */}
      <div className="absolute inset-0 bg-indigo-500 opacity-75"></div>
      <img
        src="login.png"
        alt="Login background"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>

    {/* Right side with login form */}
    <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full md:w-96 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="text-center mb-8">
            <img src="idr-logo.png" alt="Logo" className="mx-auto h-14 w-96 ml-4" />
          </div>
          <h1 className="text-2xl text-center mb-2">Set Your Password</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* Submit button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordForm;