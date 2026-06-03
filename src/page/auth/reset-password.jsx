/** @format */

import React from "react";

const ResetPassword = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* LEFT SIDE WITH IMAGE */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#312E81]
via-[#4338CA]
to-[#6366F1] relative">
        <img
          src="login.png"
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          {/* LOGO */}
          <div className="w-full max-w-md flex justify-center">
          <img
            src="IDRLogo.png"
            alt="IDR Logo"
            className="w-[85%] h-[145px]"
          />
        </div>
          {/* CARD */}
          <div
            className="
              bg-white
              rounded-[30px]
              border
              border-gray-100
              shadow-2xl
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="px-8 py-8">
              <title>ResetPassword</title>
              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1E1B4B]">
                  Reset Password
                </h1>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Enter your new password and verification code to continue.
                </p>
              </div>

              {/* FORM */}
              <form className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#1E1B4B]
                      mb-2
                    "
                    htmlFor="email"
                  >
                    Email Address
                  </label>

                  <input
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-100
                      px-4
                      text-sm
                      text-gray-500
                      cursor-not-allowed
                      focus:outline-none
                    "
                    id="email"
                    type="email"
                    placeholder="johndoe@email.com"
                    disabled
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#1E1B4B]
                      mb-2
                    "
                    htmlFor="password"
                  >
                    New Password
                  </label>

                  <input
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      text-sm
                      text-gray-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      focus:border-transparent
                      transition-all
                    "
                    id="password"
                    type="password"
                    placeholder="Enter your new password"
                  />
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#1E1B4B]
                      mb-2
                    "
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>

                  <input
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      text-sm
                      text-gray-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      focus:border-transparent
                      transition-all
                    "
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                  />
                </div>

                {/* OTP */}
                <div>
                  <label
                    className="
                      block
                      text-sm
                      font-semibold
                      text-[#1E1B4B]
                      mb-2
                    "
                    htmlFor="otp"
                  >
                    One Time Password (OTP)
                  </label>

                  <input
                    className="
                      w-full
                      h-14
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      px-4
                      text-sm
                      text-gray-700
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      focus:border-transparent
                      transition-all
                    "
                    id="otp"
                    type="text"
                    placeholder="Enter your OTP"
                  />
                </div>

                {/* LOGIN LINK */}
                <div className="flex justify-end">
                  <a
                    className="
                      text-sm
                      font-medium
                      text-indigo-600
                      hover:text-indigo-700
                      transition-all
                    "
                    href="/"
                  >
                    Back to Login
                  </a>
                </div>

                {/* BUTTON */}
                <button
                  className="
                    w-full
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    text-sm
                    font-semibold
                    hover:shadow-xl
                    hover:scale-[1.01]
                    transition-all
                  "
                  type="button"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>

          {/* FOOTER */}
          <p className="text-center text-xs text-gray-400 mt-5">
            © {new Date().getFullYear()} IDR. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
