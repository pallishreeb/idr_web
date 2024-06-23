import React, { useState } from "react";
import { toast } from "react-toastify";

const AddTechnicianModal = ({
  isOpen,
  onClose,
  onSave,
  workOrderId,
  idrEmployees,
}) => {
  const [technician, setTechnician] = useState({
    work_order_id: workOrderId,
    technician_user_id: "",
    technician_name: "",
    pm_user_id: "",
    project_manager: "",
    parts: "",
    labeling_methodology: "",
    other_details: "",
    procedures: "",
    required_deliverables: "",
    deliverable_instructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTechnician((prev) => ({ ...prev, [name]: value }));
    //set technician user id
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees?.find(
        (employee) => employee?.user_id === value
      );
      if (selectedTechnician) {
        setTechnician((prev) => ({
          ...prev,
          technician_user_id: selectedTechnician.user_id,
        }));
      }
    }
    //set technician manager user id
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees?.find(
        (employee) => employee?.user_id === value
      );
      if (selectedTechnician) {
        setTechnician((prev) => ({
          ...prev,
          pm_user_id: selectedTechnician.user_id,
        }));
      }
    }
  };

  const handleSave = () => {
    if (!validateStep()) {
      toast.error("Fill up all the fields.");
      return;
    }
    onSave(technician);
    setTechnician({
      technician_name: "",
      project_manager: "",
      parts: "",
      labeling_methodology: "",
      other_details: "",
      procedures: "",
      required_deliverables: "",
      deliverable_instructions: "",
      pm_user_id: "",
      technician_user_id: "",
    });
    onClose();
  };

  const validateStep = () => {
    // Example validation, adjust as per your field requirements
    return (
      technician.technician_name !== "" &&
      technician.project_manager !== "" &&
      technician.other_details !== "" &&
      technician.procedures !== "" &&
      technician.parts !== "" &&
      technician.labeling_methodology !== "" &&
      technician.equipment_installation !== "" &&
      technician.required_deliverables !== "" &&
      technician.deliverable_instructions !== ""
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
          Add Technician and Work order details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="font-normal text-base">Technician Name</label>
            <select
              className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
              name="technician_name"
              value={technician.technician_name}
              onChange={handleChange}
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
          <div className="mb-4">
            <label className="font-normal text-base">Project Manager</label>
            <select
              className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
              name="project_manager"
              value={technician.project_manager}
              onChange={handleChange}
            >
              <option value="">Choose project manager</option>
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
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Parts and Tools</label>
          <textarea
            className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
            name="parts"
            value={technician.parts}
            onChange={handleChange}
            rows={4}
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Labeling Methodology</label>
          <input
            type="text"
            className="px-2 py-2 border text-sm border-gray-200 rounded w-full"
            name="labeling_methodology"
            value={technician.labeling_methodology}
            onChange={handleChange}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Service Details</label>
          <textarea
            className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
            name="other_details"
            value={technician.other_details}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Procedures</label>
          <textarea
            className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
            name="procedures"
            value={technician.procedures}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Required Deliverables</label>
          <textarea
            className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
            name="required_deliverables"
            value={technician.required_deliverables}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">
            Deliverable Instructions
          </label>
          <textarea
            className="px-2 border border-gray-200 rounded text-sm w-full resize-y"
            name="deliverable_instructions"
            value={technician.deliverable_instructions}
            onChange={handleChange}
            rows={4}
          />
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
