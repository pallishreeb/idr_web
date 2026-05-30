import React, {
  useState,
  useRef,
  useEffect,
} from "react";

import {
  MdKeyboardArrowDown,
  MdCheck,
  MdLocationOn,
} from "react-icons/md";

const MultiSelectDropdown = ({
  options,
  selectedValues,
  onChange,
}) => {
  const [isOpen, setIsOpen] =
    useState(false);

  const dropdownRef = useRef(null);

  // CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target,
        )
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleCheckboxChange = (
    value,
  ) => {
    const updatedValues =
      selectedValues.includes(value)
        ? selectedValues.filter(
            (item) => item !== value,
          )
        : [
            ...selectedValues,
            value,
          ];

    onChange(updatedValues);
  };

  const selectedLabels =
    options
      .filter((option) =>
        selectedValues.includes(
          option.value,
        ),
      )
      .map((option) => option.label);

  return (
    <div
      className="relative w-full"
      ref={dropdownRef}
    >
      {/* DROPDOWN BUTTON */}
      <button
        type="button"
        onClick={() =>
          setIsOpen(!isOpen)
        }
        className={`w-full min-h-[56px] px-4 py-3 rounded-2xl border bg-white transition-all duration-300 flex items-center justify-between gap-3
          
          ${
            isOpen
              ? "border-indigo-400 ring-2 ring-indigo-200 shadow-md"
              : "border-gray-200 hover:border-indigo-300"
          }
        `}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#312E81] shadow-md flex-shrink-0">
            <MdLocationOn size={20} />
          </div>

          <div className="text-left overflow-hidden">
            {selectedValues.length >
            0 ? (
              <>
                <p className="text-xs font-medium text-indigo-500 uppercase tracking-wide">
                  Selected Locations
                </p>

                <p className="text-sm font-semibold text-[#1E1B4B] truncate max-w-[220px]">
                  {selectedLabels.join(
                    ", ",
                  )}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  No Locations Selected
                </p>

                <p className="text-sm font-semibold text-[#1E1B4B]">
                  Select Locations
                </p>
              </>
            )}
          </div>
        </div>

        {/* COUNT + ICON */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {selectedValues.length >
            0 && (
            <div className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold">
              {
                selectedValues.length
              }
            </div>
          )}

          <MdKeyboardArrowDown
            className={`text-2xl text-gray-500 transition-transform duration-300
              
              ${
                isOpen
                  ? "rotate-180"
                  : ""
              }
            `}
          />
        </div>
      </button>

      {/* DROPDOWN MENU */}
      {isOpen && (
        <div className="absolute z-50 mt-3 w-full bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* HEADER */}
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
            <h3 className="text-sm font-bold text-[#1E1B4B]">
              Select Locations
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Choose one or more
              locations
            </p>
          </div>

          {/* OPTIONS */}
          <div className="max-h-72 overflow-y-auto p-2">
            {options.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No locations available
              </div>
            ) : (
              options.map((option) => {
                const isSelected =
                  selectedValues.includes(
                    option.value,
                  );

                return (
                  <label
                    key={option.value}
                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-200 mb-1
                      
                      ${
                        isSelected
                          ? "bg-indigo-50 border border-indigo-100"
                          : "hover:bg-gray-50 border border-transparent"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* CUSTOM CHECKBOX */}
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                              isSelected
                            ? "bg-[#312E81] border-[#312E81] text-white"
                            : "border-gray-300 bg-white"
                            }`}
                          >
                        {isSelected && (
                          <MdCheck size={14} />
                        )}
                      </div>

                      {/* HIDDEN INPUT */}
                      <input
                        type="checkbox"
                        value={
                          option.value
                        }
                        checked={
                          isSelected
                        }
                        onChange={() =>
                          handleCheckboxChange(
                            option.value,
                          )
                        }
                        className="hidden"
                      />

                      {/* LABEL */}
                      <span
                        className={`text-sm font-medium truncate
                          
                          ${
                            isSelected
                              ? "text-indigo-700"
                              : "text-gray-700"
                          }
                        `}
                      >
                        {option.label}
                      </span>
                    </div>

                    {/* SELECTED BADGE */}
                    {isSelected && (
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full bg-indigo-100 text-indigo-600">
                        Selected
                      </span>
                    )}
                  </label>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              {selectedValues.length}{" "}
              selected
            </p>

            <button
              type="button"
              onClick={() =>
                setIsOpen(false)
              }
              className="px-4 py-2 rounded-xl bg-[#EEF2FF] text-[#312E81] text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;