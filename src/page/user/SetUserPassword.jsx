import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { fetchUsers, setUserPasswordByAdmin } from "../../actions/userActions";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  MdLockReset,
  MdSave,
  MdArrowBack,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

const SetUserPasswordForm = () => {
  const { userId } = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const [email, setEmail] = useState("");

  const [passwordValue, setPasswordValue] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const users = useSelector((state) => state.user.users);

  const { loading } = useSelector((state) => state.user);

  const user = users?.data?.find((user) => user.user_id === userId);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEmail(user.email_id);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (passwordValue !== confirmPassword) {
      alert("Passwords do not match");

      return;
    }

    dispatch(
      setUserPasswordByAdmin(
        {
          password: passwordValue,

          email_id: email,
        },
        navigate,
        location.state,
        "/client-employees",
      ),
    );
  };

  const inputClass = `
      w-full
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-4
      py-3
      text-sm
      text-gray-700
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      transition-all
    `;

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div
          className="
            flex-1
            p-4
            md:p-6
            overflow-x-hidden
          "
        >
          {/* PAGE HEADER */}
          <div
            className="
              bg-white
              rounded-[28px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-6
            "
          >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-14
                    h-14
                    rounded-3xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                >
                  <MdLockReset className="text-3xl" />
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
                    Set User Password
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Create or update secure user login credentials
                  </p>
                </div>
              </div>

              {/* BACK BUTTON */}
              <button
                onClick={() => navigate(-1)}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  font-medium
                  hover:bg-gray-50
                  transition-all
                "
              >
                <MdArrowBack className="text-xl" />
                Back
              </button>
            </div>
          </div>



  {/* FORM CARD */}
<div className="flex justify-center">

  {/* FORM CARD */}
  <div
    className="
      w-full
      max-w-3xl
      bg-white
      rounded-[28px]
      shadow-sm
      border
      border-gray-100
      overflow-hidden
    "
  >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div
                  className="
                    w-14
                    h-14
                    border-4
                    border-indigo-200
                    border-t-indigo-600
                    rounded-full
                    animate-spin
                    mb-5
                  "
                />

                <p className="text-gray-500 font-medium">
                  Updating password...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 md:p-7">
                {/* SECTION TITLE */}
                <div className="mb-7">
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Password Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Set a strong password for secure account access
                  </p>
                </div>

                {/* FORM GRID */}
                <div className="grid grid-cols-1 gap-5">
                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={email}
                      readOnly
                      className={`
                        ${inputClass}
                        bg-gray-50
                        cursor-not-allowed
                      `}
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      New Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        value={passwordValue}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className={`
                          ${inputClass}
                          pr-12
                        `}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          hover:text-indigo-600
                          transition-all
                        "
                      >
                        {showPassword ? (
                          <MdVisibilityOff className="text-xl" />
                        ) : (
                          <MdVisibility className="text-xl" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Confirm Password
                    </label>

                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`
                          ${inputClass}
                          pr-12
                        `}
                        required
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="
                          absolute
                          right-4
                          top-1/2
                          -translate-y-1/2
                          text-gray-400
                          hover:text-indigo-600
                          transition-all
                        "
                      >
                        {showConfirmPassword ? (
                          <MdVisibilityOff className="text-xl" />
                        ) : (
                          <MdVisibility className="text-xl" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* PASSWORD TIPS */}
                {/* <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-indigo-100
                    bg-indigo-50
                    px-5
                    py-4
                  "
                >
                  <h3 className="text-sm font-semibold text-indigo-900 mb-2">
                    Password Requirements
                  </h3>

                  <ul className="text-sm text-indigo-700 space-y-1">
                    <li>• Minimum 8 characters recommended</li>

                    <li>• Use uppercase and lowercase letters</li>

                    <li>• Include numbers and special characters</li>

                    <li>• Avoid common or easy passwords</li>
                  </ul>
                </div> */}

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                  {/* CANCEL */}
                  <button
                    type="button"
                    className="
                      px-5
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      text-gray-700
                      font-medium
                      hover:bg-gray-50
                      transition-all
                    "
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>

                  {/* SAVE */}
                  <button
                    type="submit"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-pink-500
                      text-white
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                    "
                  >
                    <MdSave className="text-xl" />

                    {loading ? "Saving..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
          </div>
        </div>
        </div>
    </>
  );
};

export default SetUserPasswordForm;
