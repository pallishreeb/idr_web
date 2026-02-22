import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeSubcontractorStatus } from "../../actions/subContractorAction";

const statusOptions = [
  "Active",
  "In Progress",
  "Re-Opened",
  "In Review",
];

const ChangeStatusForm = ({ id, data }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    contract_status: "",
    reject_reason: "",
    created_by: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data?.contract_status) {
      setFormData((prev) => ({
        ...prev,
        contract_status: data.contract_status,
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.contract_status === "Re-Opened") {
      if (!formData.reject_reason.trim()) {
        alert("Reject reason is required when Re-Opened");
        return;
      }
      if (!formData.created_by.trim()) {
        alert("Created by is required when Re-Opened");
        return;
      }
    }

    try {
      setLoading(true);

      await dispatch(
        changeSubcontractorStatus({
          subcontractor_id: id,
          contract_status: formData.contract_status,
          reject_reason:
            formData.contract_status === "Re-Opened"
              ? formData.reject_reason.trim()
              : "",
          created_by:
            formData.contract_status === "Re-Opened"
              ? formData.created_by.trim()
              : "",
        })
      );

      if (formData.contract_status !== "Re-Opened") {
        setFormData((prev) => ({
          ...prev,
          reject_reason: "",
          created_by: "",
        }));
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Change Contract Status
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Status Dropdown */}
        <div>
          <label className="block font-medium mb-2">
            Contract Status
          </label>
          <select
            name="contract_status"
            value={formData.contract_status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Conditional Fields */}
        {formData.contract_status === "Re-Opened" && (
          <>
            <div>
              <label className="block font-medium mb-2">
                Reject Reason
              </label>
              <textarea
                name="reject_reason"
                value={formData.reject_reason}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                rows="3"
                placeholder="Enter reason for reopening..."
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Created By
              </label>
              <input
                type="text"
                name="created_by"
                value={formData.created_by}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                placeholder="Your name"
              />
            </div>
          </>
        )}

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default ChangeStatusForm;