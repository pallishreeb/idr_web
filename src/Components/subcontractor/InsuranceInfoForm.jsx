import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateInsuranceInfo } from "../../actions/subContractorAction";
const formatToDisplay = (dateString) => {
  if (!dateString) return "";

  // If already DD/MM/YYYY
  if (dateString.includes("/")) return dateString;

  const date = new Date(dateString);
  if (isNaN(date)) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const formatToInput = (dateString) => {
  if (!dateString) return "";

  // Convert DD/MM/YYYY → YYYY-MM-DD
  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  return dateString;
};
const InsuranceInfoForm = ({ id, data }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    company_vehicles: "",
    emp_use_personal_vehicles: false,

    gl_coverage_amount_perocurance: "",
    gl_aggregate_coverage_amount: "",
    gl_insurer: "",
    gl_policy: "",
    gl_policy_startdate: "",
    gl_policy_enddate: "",

    ui_coverage_amount_perocurance: "",
    ui_aggregate_coverage_amount: "",
    ui_insurer: "",
    ui_policy: "",
    ui_policy_startdate: "",
    ui_policy_enddate: "",

    wc_coverage_amount_perocurance: "",
    wc_aggregate_coverage_amount: "",
    wc_insurer: "",
    wc_policy: "",
    wc_policy_startdate: "",
    wc_policy_enddate: "",

    commercial_auto_insurance_policy: false,
    hired_nonowned_auto_insurance_policy: false,
  });

useEffect(() => {
  if (data?.insurance_requirements?.length > 0) {
    const insurance = data.insurance_requirements[0];

    setFormData({
      company_vehicles: insurance.company_vehicles || "",
      emp_use_personal_vehicles: insurance.emp_use_personal_vehicles || false,

      gl_coverage_amount_perocurance:
        insurance.gl_coverage_amount_perocurance || "",
      gl_aggregate_coverage_amount:
        insurance.gl_aggregate_coverage_amount || "",
      gl_insurer: insurance.gl_insurer || "",
      gl_policy: insurance.gl_policy || "",
      gl_policy_startdate: insurance.gl_policy_startdate || "",
      gl_policy_enddate: insurance.gl_policy_enddate || "",

      ui_coverage_amount_perocurance:
        insurance.ui_coverage_amount_perocurance || "",
      ui_aggregate_coverage_amount:
        insurance.ui_aggregate_coverage_amount || "",
      ui_insurer: insurance.ui_insurer || "",
      ui_policy: insurance.ui_policy || "",
      ui_policy_startdate: insurance.ui_policy_startdate || "",
      ui_policy_enddate: insurance.ui_policy_enddate || "",

      wc_coverage_amount_perocurance:
        insurance.wc_coverage_amount_perocurance || "",
      wc_aggregate_coverage_amount:
        insurance.wc_aggregate_coverage_amount || "",
      wc_insurer: insurance.wc_insurer || "",
      wc_policy: insurance.wc_policy || "",
      wc_policy_startdate: insurance.wc_policy_startdate || "",
      wc_policy_enddate: insurance.wc_policy_enddate || "",

      commercial_auto_insurance_policy:
        insurance.commercial_auto_insurance_policy || false,
      hired_nonowned_auto_insurance_policy:
        insurance.hired_nonowned_auto_insurance_policy || false,
    });
  }
}, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateInsuranceInfo({
        subcontractor_id: id,
        ...formData,
      }),
    );
  };

  const renderPolicySection = (title, prefix) => (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-3 gap-4">
        <input
          name={`${prefix}_coverage_amount_perocurance`}
          value={formData[`${prefix}_coverage_amount_perocurance`]}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Coverage Per Occurrence"
        />
        <input
          name={`${prefix}_aggregate_coverage_amount`}
          value={formData[`${prefix}_aggregate_coverage_amount`]}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Aggregate Coverage"
        />
        <input
          name={`${prefix}_insurer`}
          value={formData[`${prefix}_insurer`]}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Insurer"
        />

        <input
          name={`${prefix}_policy`}
          value={formData[`${prefix}_policy`]}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Policy #"
        />
        <input
          type="date"
          name={`${prefix}_policy_startdate`}
          value={formatToInput(formData[`${prefix}_policy_startdate`])}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [`${prefix}_policy_startdate`]: formatToDisplay(e.target.value),
            }))
          }
          className="border p-2 rounded"
        />

        <input
          type="date"
          name={`${prefix}_policy_enddate`}
          value={formatToInput(formData[`${prefix}_policy_enddate`])}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [`${prefix}_policy_enddate`]: formatToDisplay(e.target.value),
            }))
          }
          className="border p-2 rounded"
        />
      </div>
    </div>
  );

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Insurance Information</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Vehicle Info */}
        <div>
          <h3 className="font-semibold mb-4">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="company_vehicles"
              value={formData.company_vehicles}
              onChange={handleChange}
              className="border p-2 rounded"
              placeholder="Company Vehicles"
            />

            <label className="flex items-center">
              <input
                type="checkbox"
                name="emp_use_personal_vehicles"
                checked={formData.emp_use_personal_vehicles}
                onChange={handleChange}
                className="mr-2"
              />
              Employees Use Personal Vehicles
            </label>
          </div>
        </div>

        {renderPolicySection("General Liability (GL)", "gl")}
        {renderPolicySection("Umbrella Insurance (UI)", "ui")}
        {renderPolicySection("Workers Compensation (WC)", "wc")}

        {/* Auto Policies */}
        <div>
          <h3 className="font-semibold mb-4">Auto Policies</h3>
          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="commercial_auto_insurance_policy"
                checked={formData.commercial_auto_insurance_policy}
                onChange={handleChange}
                className="mr-2"
              />
              Commercial Auto Insurance
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="hired_nonowned_auto_insurance_policy"
                checked={formData.hired_nonowned_auto_insurance_policy}
                onChange={handleChange}
                className="mr-2"
              />
              Hired/Non-Owned Auto Insurance
            </label>
          </div>
        </div>

        <div className="text-right">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Update Insurance Info
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsuranceInfoForm;
