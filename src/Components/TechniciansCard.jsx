import React, { useState } from "react";
import {  useSelector } from "react-redux";


const TechniciansCards = ({
  technicians,
  handleTechnicianChange,
  handleSaveTechnicians,
  isWorkOrderEditing,
  setIsWorkOrderEditing,
  loading
}) => {

  // const [isWorkOrderEditing, setisWorkOrderEditing] = useState(false);
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const handleEditToggle = () => {
    setIsWorkOrderEditing(!isWorkOrderEditing);
  };

  return (
    <div className="flex flex-col mt-2 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2"> Work Order Details</h1>
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 gap-6">
        {technicians?.map((technician, index) => (
          <div key={index} className="border p-4">
            <div className="flex justify-end items-center mb-4">
              {access.includes(user_type) && 
              <div>
          {isWorkOrderEditing ? (
            <>
            <button
                className="bg-indigo-600 text-white px-4 py-1 rounded"
                onClick={() => handleSaveTechnicians(index)}
              >
                Save Work Order Details
              </button>
               <button
               className="bg-gray-500 text-white px-6 py-2 rounded ml-2"
               onClick={handleEditToggle}
             >
               Cancel
             </button>
            </>
          
          ) : (
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
              </div>}

            </div>
          
            <div className="mb-4">
              <label className="font-normal text-base">Parts and Tools</label>
              <textarea
                className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
                name="parts"
                value={technician.parts || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4}
                disabled={!isWorkOrderEditing}
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">
                Labeling Methodology
              </label>
              <input
                type="text"
                className="px-2 py-2 border text-sm border-gray-200 rounded w-full"
                name="labeling_methodology"
                value={technician.labeling_methodology || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                disabled={!isWorkOrderEditing}
              />
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">Service Details</label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
                name="other_details"
                value={technician.other_details || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
                disabled={!isWorkOrderEditing}
              />
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">Procedures</label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
                name="procedures"
                value={technician.procedures || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
                disabled={!isWorkOrderEditing}
              />
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">
                Required Deliverables
              </label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
                name="required_deliverables"
                value={technician.required_deliverables || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
                disabled={!isWorkOrderEditing}
              />
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">
                Deliverable Instructions
              </label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
                name="deliverable_instructions"
                value={technician.deliverable_instructions || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
                disabled={!isWorkOrderEditing}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniciansCards;
