import React, { useState } from "react";
import { useDispatch } from "react-redux";
import AddTechnicianModal from "./AddTechnicianModal";
import {
  addTechnicianToTicket,
  getWorkOrderDetails,
} from "../actions/workOrderActions";
import { getClients } from "../actions/clientActions";
import { fetchIDREmployees } from "../actions/employeeActions";

const TechniciansCards = ({
  technicians,
  idrEmployees,
  handleTechnicianChange,
  handleEditTechnician,
  handleSaveTechnicians,
  workOrderId,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNote = (newTechnician) => {
    dispatch(addTechnicianToTicket(newTechnician))
      .then((response) => {
        if (response.code == "WO201") {
          // navigate("/workorder");
          handleCloseModal();
          dispatch(getWorkOrderDetails(workOrderId));
          dispatch(getClients());
          dispatch(fetchIDREmployees());
        } else {
          console.error("Error adding new technician:", response.error);
        }
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
  };
  return (
    <div className="flex flex-col mt-2 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2"> Work Order Details</h1>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded"
          onClick={handleOpenModal}
        >
          Add Technician
        </button>
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 gap-6">
        {technicians?.map((technician, index) => (
          <div key={index} className="border border-indigo-500 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Technician {index + 1}</h2>
              <button
                className="bg-indigo-600 text-white px-4 py-1 rounded"
                onClick={() => handleSaveTechnicians(index)}
              >
                Save Work Order Details
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="mb-4">
                <label className="font-normal text-base">Technician Name</label>
                <select
                  className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
                  name="technician_name"
                  value={technician.technician_name || ""}
                  onChange={(e) => handleTechnicianChange(index, e)}
                >
                  <option value="">Choose technician</option>
                  {idrEmployees.map((employee) => (
                    <option
                      key={employee.idr_emp_id}
                      value={employee?.user_id}
                    >
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2 */}
              <div className="mb-4">
                <label className="font-normal text-base">Project Manager</label>
                <select
                  className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
                  name="project_manager"
                  value={technician.project_manager || ""}
                  onChange={(e) => handleTechnicianChange(index, e)}
                >
                  <option value="">Choose project manager</option>
                  {idrEmployees?.map((employee) => (
                    <option
                      key={employee.idr_emp_id}
                      value={employee?.user_id}
                    >
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">Parts and Tools</label>
              <textarea
                className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
                name="parts"
                value={technician.parts || ""}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4}
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
              />
            </div>
          </div>
        ))}
      </div>
      {/* Add Note Modal */}
      <AddTechnicianModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNote}
        workOrderId={workOrderId}
        idrEmployees={idrEmployees}
      />
    </div>
  );
};

export default TechniciansCards;
