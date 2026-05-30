/** @format */

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { userLogin } from "../../actions/userActions";

import { MdEmail, MdLock, MdArrowForward } from "react-icons/md";

const Login = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const loginError = useSelector((state) => state.user.error);

  const loginLoading = useSelector((state) => state.user.loading);

  // =========================
  // REDIRECT IF LOGGED IN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("user");

    if (token) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please provide your email and password to login!");

      return;
    }

    dispatch(
      userLogin(
        {
          email_id: email,
          password,
        },
        navigate,
      ),
    );
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
          {/* LOGIN CARD */}
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
            <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="px-7 py-8">
              {/* MOBILE LOGO */}
              <div className="flex justify-center lg:hidden mb-6">
                <img
                  src="idr-logo.png"
                  alt="Logo"
                  className="h-16 object-contain"
                />
              </div>

              {/* HEADER */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#1E1B4B]">Sign In</h1>

                <p className="text-sm text-gray-500 mt-2">
                  Login to continue to your dashboard
                </p>
              </div>

              {/* ERROR */}
              {loginError && (
                <div
                  className="
                    mb-5
                    px-4
                    py-3
                    rounded-2xl
                    bg-red-50
                    border
                    border-red-100
                    text-sm
                    text-red-600
                  "
                >
                  {loginError}
                </div>
              )}

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      onChange={(e) => setEmail(e.target.value)}
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
                </div>

                {/* PASSWORD */}
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
                    Password
                  </label>

                  <div className="relative">
                    <MdLock
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
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                </div>

                {/* FORGOT PASSWORD */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="
                      text-sm
                      font-medium
                      text-indigo-600
                      hover:text-indigo-700
                      transition-all
                    "
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={!email || !password || loginLoading}
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
                      !email || !password || loginLoading
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] hover:shadow-lg hover:scale-[1.01]"
                    }
                  `}
                >
                  {loginLoading ? (
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
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <MdArrowForward className="text-lg" />
                    </>
                  )}
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

export default Login;
