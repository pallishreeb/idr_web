import React, { useState } from "react";


const AddTechnicianModal = ({
  isOpen,
  onClose,
  onSave,
  workOrderId,
  idrEmployees,
}) => {
  const [assigns, setAssigns] = useState({
    work_order_id: workOrderId,
    technician_user_id: "",
    technician_name: "",
    pm_user_id: "",
    project_manager: "",
    technician_contact:"",
    project_manager_contact:""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssigns((prev) => ({ ...prev, [name]: value }));

    // Set technician user id
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees?.find(
        (employee) => employee.first_name + ' ' + employee.last_name === value
      );

      if (selectedTechnician) {
        setAssigns((prev) => ({
          ...prev,
          technician_user_id: selectedTechnician.user_id,
          technician_contact: selectedTechnician.contact_number,
        }));
      }
    }
    // Set project manager user id
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees?.find(
        (employee) => employee.first_name + ' ' + employee.last_name === value
      );
      if (selectedTechnician) {
        setAssigns((prev) => ({
          ...prev,
          pm_user_id: selectedTechnician.user_id,
          project_manager_contact: selectedTechnician.contact_number,
        }));
      }
    }
  };

  const handleSave = () => {
    if (!validateStep()) {
      return;
    }
    // Filter out keys with empty values
    let filteredAssigns = Object.fromEntries(
      Object.entries(assigns).filter(([key, value]) => value !== "")
    );
    onSave(filteredAssigns);
    setAssigns({
      technician_name: "",
      project_manager: "",
      pm_user_id: "",
      technician_user_id: "",
    });
    onClose();
  };

  const validateStep = () => {
    // Example validation, adjust as per your field requirements
    return (
      assigns.technician_name !== "" ||
      assigns.project_manager !== ""
    );
  };
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8 max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">
          Add Technician and Manager
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="font-normal text-base">Technician Name</label>
            <select
              className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
              name="technician_name"
              value={assigns.technician_name}
              onChange={handleChange}
            >
              <option value="">Choose technician</option>
              {idrEmployees.map((employee) => (
                <option
                  key={employee.idr_emp_id}
                  value={employee.first_name +' '+ employee.last_name}
                >
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="font-normal text-base">Project Manager</label>
            <select
              className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
              name="project_manager"
              value={assigns.project_manager}
              onChange={handleChange}
            >
              <option value="">Choose project manager</option>
              {idrEmployees.map((employee) => (
                <option
                  key={employee.idr_emp_id}
                  value={employee.first_name +' '+ employee.last_name}
                >
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTechnicianModal;
