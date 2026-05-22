/** @format */

import React, { useState } from "react";

import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import { toast } from "react-toastify";

import { forgotPassword } from "../../actions/userActions";

import { MdEmail, MdArrowForward, MdLockReset } from "react-icons/md";

const ForgotPassword = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {
    if (!email) {
      setErrorMessage("Please provide your email");

      return;
    }

    try {
      setLoading(true);

      await dispatch(
        forgotPassword({
          email_id: email.trim(),
        }),
      );

      toast.success("Password reset email sent successfully!");

      setEmail("");

      setErrorMessage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* LEFT SIDE WITH IMAGE */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 relative">
        <img
          src="login.png"
          alt="Login background"
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      </div>

      {/* RIGHT SIDE */}
      <div
        className="
          flex-1
          flex
          items-center
          justify-center
          px-5
          py-10
        "
      >
        <div className="w-full max-w-md">
          {/* CARD */}
          <div
            className="
              bg-white
              rounded-[32px]
              border
              border-gray-100
              shadow-xl
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="px-7 py-8">
              {/* MOBILE LOGO */}
              <div className="flex justify-center lg:hidden mb-6">
                <img
                  src="idr-logo.png"
                  alt="Logo"
                  className="h-16 object-contain"
                />
              </div>

              {/* ICON */}
              <div className="flex justify-center mb-5">
                <div
                  className="
                    w-20
                    h-20
                    rounded-3xl
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                >
                  <MdLockReset className="text-4xl" />
                </div>
              </div>

              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1E1B4B]">
                  Forgot Password
                </h1>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Enter your email address below and we'll send reset
                  instructions.
                </p>
              </div>

              {/* FORM */}
              <div className="space-y-5">
                {/* EMAIL */}
                <div>
                  <label
                    className="
                      text-sm
                      font-semibold
                      text-[#1E1B4B]
                      mb-2
                      block
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <MdEmail
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        text-xl
                      "
                    />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);

                        setErrorMessage("");
                      }}
                      className="
                        w-full
                        h-14
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-50
                        pl-12
                        pr-4
                        text-sm
                        text-gray-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                        focus:border-transparent
                        transition-all
                      "
                    />
                  </div>

                  {errorMessage && (
                    <p className="text-red-500 text-xs mt-2">{errorMessage}</p>
                  )}
                </div>

                {/* LOGIN LINK */}
                <div className="flex justify-end">
                  <Link
                    to="/"
                    className="
                      text-sm
                      font-medium
                      text-indigo-600
                      hover:text-indigo-700
                      transition-all
                    "
                  >
                    Back to Login
                  </Link>
                </div>

                {/* BUTTON */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`
                    w-full
                    h-14
                    rounded-2xl
                    text-white
                    text-sm
                    font-semibold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    ${
                      loading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-lg hover:scale-[1.01]"
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <div
                        className="
                          w-5
                          h-5
                          border-2
                          border-white
                          border-t-transparent
                          rounded-full
                          animate-spin
                        "
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <MdArrowForward className="text-lg" />
                    </>
                  )}
                </button>
              </div>
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

export default ForgotPassword;
