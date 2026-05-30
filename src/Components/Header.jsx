/** @format */

import logo from "../Images/logo.png";

import { IoLogOut } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";

import { useDispatch } from "react-redux";

import { logout } from "../reducers/userSlice";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/");

    toast.success("Logged Out From System.");
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      {/* TOP GRADIENT */}
      <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      {/* HEADER CONTENT */}
      <div className="h-[72px] px-4 md:px-6 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="flex items-center">
            <img
              className="h-10 md:h-11 object-contain"
              src={logo}
              alt="IDR Logo"
            />
          </div>

          {/* TITLE */}
          <div className="hidden lg:block">
            <h1 className="text-sm font-semibold text-[#1E1B4B] leading-tight">
              IDR Service Portal
            </h1>

            <p className="text-xs text-gray-500">
              Management Dashboard
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* NOTIFICATION */}
          {/* <button
            className="
              w-10
              h-10
              rounded-2xl
              bg-gray-50
              border
              border-gray-200
              flex
              items-center
              justify-center
              text-gray-600
              hover:text-indigo-600
              hover:border-indigo-200
              hover:bg-indigo-50
              transition-all
              duration-300
            "
          >
            <MdNotificationsNone className="text-xl" />
          </button> */}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-2xl
              bg-gradient-to-r
             from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
              text-white
              font-semibold
              text-sm
              shadow-md
              hover:shadow-lg
              hover:scale-[1.02]
              transition-all
              duration-300
            "
          >
            <span className="hidden sm:block">
              Logout
            </span>

            <IoLogOut className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;