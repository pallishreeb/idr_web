import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {  useSelector } from "react-redux";
import AddTechnicianModal from "./AddTechnicianModal";
import {
  getWorkOrderDetails,
  assignPeopleToWorkOrder
} from "../actions/workOrderActions";
import { getClients } from "../actions/clientActions";
import { fetchIDREmployees } from "../actions/employeeActions";
import { toast } from "react-toastify";

const AssigneePeopleCard = ({
  assignees,
  idrEmployees,
  handleAssigneeChange,
  workOrderId,
}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
 
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAssignee = (newTechnician) => {
    dispatch(assignPeopleToWorkOrder(newTechnician))
      .then((response) => {
        if (response.code == "WO201") {
          // navigate("/workorder");
          // toast.success("People assigned to work order.")
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
        <h1 className="font-normal text-xl mb-2"> Technicians And Managers</h1>
        {access.includes(user_type) &&
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded"
          onClick={handleOpenModal}
        >
          Add Technician
        </button>
}
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 gap-6">
        {assignees?.map((technician, index) => (
          <div key={index} className="border border-gray-200 p-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="mb-4">
                <label className="font-normal text-base">Technician Name</label>
                <select
                  className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
                  name="technician_name"
                  value={technician.technician_name || ""}
                  onChange={(e) => handleAssigneeChange(index, e)}
                  disabled={!isEditing}
                >
                  <option value="">Choose technician</option>
                  {idrEmployees.map((employee) => (
                    <option
                      key={employee.idr_emp_id}
                      value={employee.first_name +''+ employee.last_name}
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
                  onChange={(e) => handleAssigneeChange(index, e)}
                  disabled={!isEditing}
                >
                  <option value="">Choose project manager</option>
                  {idrEmployees?.map((employee) => (
                    <option
                      key={employee.idr_emp_id}
                      value={employee.first_name +''+ employee.last_name}
                    >
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Add Note Modal */}
      <AddTechnicianModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddAssignee}
        workOrderId={workOrderId}
        idrEmployees={idrEmployees}
      />
    </div>
  );
};

export default AssigneePeopleCard;
