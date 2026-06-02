import React from "react";

import { useSelector } from "react-redux";

import {
  MdBuild,
  MdEdit,
  MdSave,
  MdClose,
  MdAssignment,
  MdEngineering,
} from "react-icons/md";

const TechniciansCards = ({
  technicians,
  handleTechnicianChange,
  handleSaveTechnicians,
  isWorkOrderEditing,
  setIsWorkOrderEditing,
  loading,
}) => {
  const { user_type } = useSelector((state) => state.user.user);

  const { access } = useSelector((state) => state.user);

  const handleEditToggle = () => {
    setIsWorkOrderEditing(!isWorkOrderEditing);
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
  resize-y
  overflow-auto
  min-h-[200px]
  focus:outline-none
  focus:ring-2
  focus:ring-indigo-500
  focus:border-transparent
  transition-all
  duration-200
`;

  const labelClass = "text-sm font-medium text-[#1E1B4B] mb-2";
  const ReadOnlyContent = ({ value }) => (
    <div
      className="
        w-full
        min-h-[200px]
        rounded-2xl
        border
        border-gray-200
        bg-gray-50
        px-4
        py-3
        text-sm
        text-gray-700
        whitespace-pre-wrap
        break-words
        overflow-x-auto
      "
    >
      {value || "N/A"}
    </div>
  );
  return (
    <div className="mt-4 bg-white border border-gray-100 rounded-[30px] shadow-sm">
      {/* TOP BAR */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      <div className="p-5 md:p-7">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
              <MdBuild className="text-2xl" />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                Work Order Details
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Technician work scope, procedures & deliverables
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {access.includes(user_type) && (
            <div className="flex flex-wrap gap-3">
              {isWorkOrderEditing ? (
                <>
                  <button
                    className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-2xl
                        bg-gradient-to-r
                        from-[#1E1B4B]
                      via-[#312E81]
                      to-[#4338CA]
                        text-white
                        text-sm
                        font-semibold
                        shadow-md
                        hover:shadow-lg
                        hover:scale-[1.02]
                        transition-all
                        duration-300
                      "
                    onClick={() => handleSaveTechnicians()}
                    disabled={loading}
                  >
                    <MdSave className="text-lg" />

                    {loading ? "Saving..." : "Save Details"}
                  </button>

                  <button
                    className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
                        rounded-2xl
                        border
                        border-gray-200
                        bg-gray-100
                        text-gray-700
                        text-sm
                        font-semibold
                        hover:bg-gray-200
                        transition-all
                        duration-300
                      "
                    onClick={handleEditToggle}
                  >
                    <MdClose className="text-lg" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
                      via-[#312E81]
                      to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                      duration-300
                    "
                  onClick={handleEditToggle}
                >
                  <MdEdit className="text-lg" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          {technicians?.map((technician, index) => (
            <div
              key={index}
              className="
                    border
                    border-gray-100
                    rounded-[28px]
                    p-5
                    md:p-6
                    bg-gradient-to-br
                    from-white
                    to-gray-50
                    shadow-sm
                  "
            >
              {/* TECH HEADER */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <MdEngineering className="text-2xl" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-[#1E1B4B]">
                    Technician Details
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Work order execution information
                  </p>
                </div>
              </div>

              {/* FORM GRID */}
              <div className="space-y-6">
                {/* PARTS */}
                <div className="flex flex-col">
                  <label className={labelClass}>Parts and Tools</label>

                  {isWorkOrderEditing ? (
                    <textarea
                      className={inputClass}
                      name="parts"
                      value={technician.parts || ""}
                      onChange={(e) => handleTechnicianChange(index, e)}
                      rows={8}
                    />
                  ) : (
                     <ReadOnlyContent
                      value={technician.parts}
                    />
                  )}
                </div>

                {/* LABELING */}
                <div className="flex flex-col">
                  <label className={labelClass}>Labeling Methodology</label>

                  <input
                    type="text"
                    className={inputClass}
                    name="labeling_methodology"
                    value={technician.labeling_methodology || ""}
                    onChange={(e) => handleTechnicianChange(index, e)}
                    readOnly={!isWorkOrderEditing}
                  />
                </div>

                {/* SERVICE DETAILS */}
                <div className="flex flex-col">
                  <label className={labelClass}>Service Details</label>

                  {isWorkOrderEditing ? (
                    <textarea
                      className={inputClass}
                      name="other_details"
                      value={technician.other_details || ""}
                      onChange={(e) => handleTechnicianChange(index, e)}
                      rows={8}
                    />
                  ) : (
                    <ReadOnlyContent
                      value={technician.other_details}
                    />
                  )}
                </div>

                {/* PROCEDURES */}
                <div className="flex flex-col">
                  <label className={labelClass}>Procedures</label>

                  {isWorkOrderEditing ? (
                    <textarea
                      className={inputClass}
                      name="procedures"
                      value={technician.procedures || ""}
                      onChange={(e) => handleTechnicianChange(index, e)}
                      rows={8}
                    />
                  ) : (
                    <ReadOnlyContent
                      value={technician.procedures}
                    />
                  )}
                </div>

                {/* REQUIRED DELIVERABLES */}
                <div className="flex flex-col">
                  <label className={labelClass}>Required Deliverables</label>

                  {isWorkOrderEditing ? (
                      <textarea
                        className={inputClass}
                        name="required_deliverables"
                        value={technician.required_deliverables || ""}
                        onChange={(e) => handleTechnicianChange(index, e)}
                        rows={8}
                      />
                    ) : (
                      <ReadOnlyContent
                        value={technician.required_deliverables}
                      />
                    )}
                </div>

                {/* INSTRUCTIONS */}
                <div className="xl:col-span-2 flex flex-col">
                  <label className={labelClass}>Deliverable Instructions</label>

                  {isWorkOrderEditing ? (
                    <textarea
                      className={inputClass}
                      name="deliverable_instructions"
                      value={technician.deliverable_instructions || ""}
                      onChange={(e) => handleTechnicianChange(index, e)}
                      rows={8}
                    />
                  ) : (
                     <ReadOnlyContent
                      value={technician.deliverable_instructions}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechniciansCards;
