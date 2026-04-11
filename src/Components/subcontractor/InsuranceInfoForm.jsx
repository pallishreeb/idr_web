import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateInsuranceInfo } from "../../actions/subContractorAction";

/* ===========================
   Date Helpers
=========================== */
const formatToDisplay = (dateString) => {
  if (!dateString) return "";
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

  if (dateString.includes("/")) {
    const [day, month, year] = dateString.split("/");
    return `${year}-${month}-${day}`;
  }

  return dateString;
};

const InsuranceInfoForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();

  const disabledClass = !isEditable
    ? "bg-gray-100 cursor-not-allowed"
    : "";

  const [formData, setFormData] = useState({
    company_vehicles: "",
    emp_use_personal_vehicles: false,

    /* ✅ NEW VEHICLE POLICY FIELDS */
    vehicle_policy_number: "",
    vehicle_bodily_injury_per_person: "",
    vehicle_bodily_injury_per_accident: "",
    vehicle_property_damage_per_accident: "",
    vehicle_policy_startdate: "",
    vehicle_policy_enddate: "",

    /* EXISTING */
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

  /* ===========================
     Load Data
  =========================== */
  useEffect(() => {
    if (data?.insurance_requirements?.length > 0) {
      const insurance = data.insurance_requirements[0];

      setFormData((prev) => ({
        ...prev,
             company_vehicles: insurance.company_vehicles || "",
        emp_use_personal_vehicles:
          insurance.emp_use_personal_vehicles || false,

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

        // ensure new fields exist
        vehicle_policy_number: insurance.vehicle_policy_number || "",
        vehicle_bodily_injury_per_person:
          insurance.vehicle_bodily_injury_per_person || "",
        vehicle_bodily_injury_per_accident:
          insurance.vehicle_bodily_injury_per_accident || "",
        vehicle_property_damage_per_accident:
          insurance.vehicle_property_damage_per_accident || "",
        vehicle_policy_startdate:
          insurance.vehicle_policy_startdate || "",
        vehicle_policy_enddate:
          insurance.vehicle_policy_enddate || "",
      }));
    }
  }, [data]);

  /* ===========================
     Handlers
  =========================== */
  const handleChange = (e) => {
    if (!isEditable) return;

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;

    dispatch(
      updateInsuranceInfo({
        subcontractor_id: id,
        ...formData,
      })
    );
  };

  /* ===========================
     Policy Section
  =========================== */
  const renderPolicySection = (title, prefix) => (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-3 gap-4">
        <input
          name={`${prefix}_coverage_amount_perocurance`}
          value={formData[`${prefix}_coverage_amount_perocurance`] || ""}
          onChange={handleChange}
          disabled={!isEditable}
          className={`border p-2 rounded ${disabledClass}`}
          placeholder="Coverage Per Occurrence"
        />

        <input
          name={`${prefix}_aggregate_coverage_amount`}
          value={formData[`${prefix}_aggregate_coverage_amount`] || ""}
          onChange={handleChange}
          disabled={!isEditable}
          className={`border p-2 rounded ${disabledClass}`}
          placeholder="Aggregate Coverage"
        />

        <input
          name={`${prefix}_insurer`}
          value={formData[`${prefix}_insurer`] || ""}
          onChange={handleChange}
          disabled={!isEditable}
          className={`border p-2 rounded ${disabledClass}`}
          placeholder="Insurer"
        />

        <input
          name={`${prefix}_policy`}
          value={formData[`${prefix}_policy`] || ""}
          onChange={handleChange}
          disabled={!isEditable}
          className={`border p-2 rounded ${disabledClass}`}
          placeholder="Policy #"
        />

        {/* Start */}
        <input
          type="date"
          value={formatToInput(formData[`${prefix}_policy_startdate`])}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [`${prefix}_policy_startdate`]: formatToDisplay(
                e.target.value
              ),
            }))
          }
          className={`border p-2 rounded ${disabledClass}`}
        />

        {/* End */}
        <input
          type="date"
          value={formatToInput(formData[`${prefix}_policy_enddate`])}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              [`${prefix}_policy_enddate`]: formatToDisplay(
                e.target.value
              ),
            }))
          }
          className={`border p-2 rounded ${disabledClass}`}
        />
      </div>
    </div>
  );

  /* ===========================
     UI
  =========================== */
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Insurance Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ================= VEHICLE ================= */}
        <div>
          <h3 className="font-semibold mb-4">
            Vehicle Information
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <input
              name="company_vehicles"
              value={formData.company_vehicles}
              onChange={handleChange}
              disabled={!isEditable}
              className={`border p-2 rounded ${disabledClass}`}
              placeholder="# of company owned vehicles"
            />

            <input
              name="vehicle_policy_number"
              value={formData.vehicle_policy_number}
              onChange={handleChange}
              disabled={!isEditable}
              className={`border p-2 rounded ${disabledClass}`}
              placeholder="Policy #"
            />

            <input
              name="vehicle_bodily_injury_per_person"
              value={formData.vehicle_bodily_injury_per_person}
              onChange={handleChange}
              disabled={!isEditable}
              className={`border p-2 rounded ${disabledClass}`}
              placeholder="Bodily Injury per person"
            />

            <input
              name="vehicle_bodily_injury_per_accident"
              value={formData.vehicle_bodily_injury_per_accident}
              onChange={handleChange}
              disabled={!isEditable}
              className={`border p-2 rounded ${disabledClass}`}
              placeholder="Bodily Injury per accident"
            />

            <input
              name="vehicle_property_damage_per_accident"
              value={formData.vehicle_property_damage_per_accident}
              onChange={handleChange}
              disabled={!isEditable}
              className={`border p-2 rounded ${disabledClass}`}
              placeholder="Property Damage per accident"
            />

            <input
              type="date"
              value={formatToInput(formData.vehicle_policy_startdate)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicle_policy_startdate: formatToDisplay(
                    e.target.value
                  ),
                }))
              }
              className={`border p-2 rounded ${disabledClass}`}
            />

            <input
              type="date"
              value={formatToInput(formData.vehicle_policy_enddate)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  vehicle_policy_enddate: formatToDisplay(
                    e.target.value
                  ),
                }))
              }
              className={`border p-2 rounded ${disabledClass}`}
            />
          </div>
          <label className="flex items-center">
              <input
                type="checkbox"
                name="emp_use_personal_vehicles"
                checked={formData.emp_use_personal_vehicles}
                onChange={handleChange}
                disabled={!isEditable}
                className="mr-2"
              />
              Employees Use Personal Vehicles
            </label>
        </div>

        {/* ================= POLICIES ================= */}
        {renderPolicySection("General Liability (GL)", "gl")}
        {renderPolicySection("Umbrella Insurance (UI)", "ui")}
        {renderPolicySection("Workers Compensation (WC)", "wc")}

        {/* ================= AUTO ================= */}
        <div>
          <h3 className="font-semibold mb-4">Auto Policies</h3>

          <div className="flex space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="commercial_auto_insurance_policy"
                checked={formData.commercial_auto_insurance_policy}
                onChange={handleChange}
                disabled={!isEditable}
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
                disabled={!isEditable}
                className="mr-2"
              />
              Hired/Non-Owned Auto Insurance
            </label>
          </div>
        </div>

        {/* ================= COI ================= */}
        <div className="bg-gray-50 p-4 rounded text-sm">
          Please submit a certificate of insurance (COI) including required details mentioned above.
        </div>

        {isEditable && (
          <div className="text-right">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded">
              Update Insurance Info
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default InsuranceInfoForm;