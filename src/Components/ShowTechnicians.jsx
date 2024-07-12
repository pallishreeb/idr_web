import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import Swal from 'sweetalert2';
import AddTechnicianModal from "./AddTechnicianModal";
import {
  getWorkOrderDetails,
  assignPeopleToWorkOrder,
  deleteAssignee
} from "../actions/workOrderActions";
import { getClients } from "../actions/clientActions";
import { fetchIDREmployees } from "../actions/employeeActions";
import { toast } from "react-toastify";

const ShowTechnicians = ({
  assignees,
  idrEmployees,
  workOrderId,
}) => {
  const dispatch = useDispatch();
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddAssignee = (newTechnician) => {
    dispatch(assignPeopleToWorkOrder(newTechnician))
      .then((response) => {
        if (response.code === "WO201") {
          toast.success("People assigned to work order.");
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

  const handleDelete = (assigneeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this assignee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
         dispatch(deleteAssignee(assigneeId)).then((res) =>{
          dispatch(getWorkOrderDetails(workOrderId));
          dispatch(getClients());
          dispatch(fetchIDREmployees());
         });

      }
  
    });
  };
  return (
    <div className="flex flex-col mt-2 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2">Technicians And Managers</h1>
        {access.includes(user_type) && (
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded"
            onClick={handleOpenModal}
          >
            Add Technician
          </button>
        )}
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 gap-6">
        {assignees?.map((technician, index) => (
          <div key={index} className="border border-gray-200 p-4">
            <div className="flex justify-end">
              {user_type === "Admin" && (
               <button
               className="p-[4px] bg-gray-100 cursor-pointer"
               onClick={() => handleDelete(technician.assignee_id)}
             >
               <AiFillDelete/>
             </button>
                )}
                </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Technician Name */}
              <div className="mb-4">
                <label className="font-normal text-base">Technician Name</label>
                <div className="px-2 py-2 border border-gray-200 h-10 rounded text-sm w-full">
                  {technician.technician_name || "NA"}
                </div>
              </div>

              {/* Project Manager */}
              <div className="mb-4">
                <label className="font-normal text-base">Project Manager</label>
                <div className="px-2 py-2 border border-gray-200 h-10 rounded text-sm w-full">
                  {technician.project_manager || "NA"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Technician Modal */}
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

export default ShowTechnicians;
