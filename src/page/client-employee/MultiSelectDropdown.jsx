import React, { useState } from "react";

const MultiSelectDropdown = ({ options, selectedValues, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckboxChange = (value) => {
    const updatedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected

    onChange(updatedValues); // Notify parent component
  };

  return (
    <div className="relative">
      {/* Dropdown Button */}
      <button
        type="button"
        className="w-full border border-gray-300 rounded p-2 bg-white text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedValues.length > 0
          ? `Selected (${selectedValues.length})`
          : "Select Locations"}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-48 border border-gray-300 bg-white rounded shadow overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center px-3 py-2 hover:bg-gray-100"
            >
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
