import React,{useEffect} from 'react';


const ForgotPassword = () => {
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

            <title>ForgotPassword</title>
          {/* Logo */}
          <div className="text-center mb-8">
            <img
              src="idr-logo.png"
              alt="Logo"
              className="mx-auto h-14 w-96 ml-4"
            />
          </div>
          <h1 className="text-2xl text-center mb-2">Forgot Password Form</h1>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            
            {/* Submit button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
                type="button"
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

export default ForgotPassword;
