import React, { useState } from "react";

import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

const AccordionSection = ({
  id,
  title,
  children,
  defaultOpen = false,
  loading = false,
}) => {
  const [open, setOpen] =
    useState(defaultOpen);

  return (
    <div
      id={id}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300"
    >
      {/* TOP GRADIENT BAR */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* HEADER */}
      <button
        onClick={() =>
          setOpen(!open)
        }
        className="w-full flex items-center justify-between gap-4 px-5 md:px-6 py-4 text-left group transition-all duration-300 hover:bg-gray-50"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* ICON */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-sm transition-all duration-300">
            {open ? (
              <MdKeyboardArrowUp className="text-xl" />
            ) : (
              <MdKeyboardArrowDown className="text-xl" />
            )}
          </div>

          {/* TITLE */}
          <div>
            <h2 className="text-base md:text-lg font-semibold text-[#1E1B4B] leading-tight">
              {title}
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Click to{" "}
              {open
                ? "collapse"
                : "expand"}{" "}
              section
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div
          className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-300 ${
            open
              ? "bg-indigo-100 text-indigo-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {open
            ? "Opened"
            : "Closed"}
        </div>
      </button>

      {/* CONTENT */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          open
            ? "max-h-[5000px] opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-gray-100 px-5 md:px-6 py-5 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              {/* LOADER */}
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-3" />

              <p className="text-sm text-gray-500 font-medium">
                Loading...
              </p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionSection;