/** @format */

import React, { useState, useEffect } from "react";

import { useDispatch } from "react-redux";

import {
  MdSecurity,
  MdDirectionsCar,
  MdVerified,
  MdShield,
  MdSave,
  MdCheckCircle,
} from "react-icons/md";

import { updateInsuranceInfo } from "../../actions/subContractorAction";

/* ===========================
   DATE HELPERS
=========================== */

const formatToDisplay = (dateString) => {
  if (!dateString) return "";

  if (dateString.includes("/")) return dateString;

  const [year, month, day] = dateString.split("-");

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

const CurrencyInput = ({
  name,
  value,
  onChange,
  disabled,
  inputClass,
}) => (
  <div className="relative">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
      $
    </span>

    <input
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${inputClass} pl-8`}
    />
  </div>
);
const InsuranceInfoForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();

  const disabledClass = !isEditable
    ? "bg-gray-100 cursor-not-allowed opacity-70"
    : "";

  const [formData, setFormData] = useState({
    company_vehicles: "",

    emp_use_personal_vehicles: false,

    vehicle_policy_number: "",

    vehicle_bodily_injury_per_person: "",

    vehicle_bodily_injury_per_accident: "",

    vehicle_property_damage_per_accident: "",

    vehicle_policy_startdate: "",

    vehicle_policy_enddate: "",
    combined_single_limit: "",
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

    auto_insurer_name: "",
  });

  /* ===========================
       LOAD DATA
    =========================== */

  useEffect(() => {
    if (data?.insurance_requirements?.length > 0) {
      const insurance = data.insurance_requirements[0];

      setFormData((prev) => ({
        ...prev,

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

        auto_insurer_name: insurance.auto_insurer_name || "",

        vehicle_policy_number: insurance.vehicle_policy_number || "",

        vehicle_bodily_injury_per_person:
          insurance.vehicle_bodily_injury_per_person || "",

        vehicle_bodily_injury_per_accident:
          insurance.vehicle_bodily_injury_per_accident || "",

        vehicle_property_damage_per_accident:
          insurance.vehicle_property_damage_per_accident || "",

        vehicle_policy_startdate: insurance.vehicle_policy_startdate || "",

        vehicle_policy_enddate: insurance.vehicle_policy_enddate || "",
        combined_single_limit: insurance.combined_single_limit || "",
      }));
    }
  }, [data]);

  /* ===========================
       HANDLERS
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
      }),
    );
  };

  // COMMON STYLES
  const inputClass = `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${disabledClass}`;

  const labelClass = "block text-sm font-semibold text-[#1E1B4B] mb-2";

  /* ===========================
       POLICY SECTION
    =========================== */

  const renderPolicySection = (title, prefix) => (
    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
        {/* SMALLER TITLE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
            <MdShield className="text-xl" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#1E1B4B]">{title}</h3>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Coverage Per Occurrence</label>

            <CurrencyInput
              name={`${prefix}_coverage_amount_perocurance`}
              value={formData[`${prefix}_coverage_amount_perocurance`] || ""}
              onChange={handleChange}
              disabled={!isEditable}
              inputClass={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Aggregate Coverage</label>

            <CurrencyInput
              name={`${prefix}_aggregate_coverage_amount`}
              value={formData[`${prefix}_aggregate_coverage_amount`] || ""}
              onChange={handleChange}
              disabled={!isEditable}
              inputClass={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Insurer</label>

            <input
              name={`${prefix}_insurer`}
              value={formData[`${prefix}_insurer`] || ""}
              onChange={handleChange}
              disabled={!isEditable}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Policy Number</label>

            <input
              name={`${prefix}_policy`}
              value={formData[`${prefix}_policy`] || ""}
              onChange={handleChange}
              disabled={!isEditable}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Start Date</label>

            <input
              type="date"
              value={formatToInput(formData[`${prefix}_policy_startdate`])}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,

                  [`${prefix}_policy_startdate`]: formatToDisplay(
                    e.target.value,
                  ),
                }))
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Expiration Date</label>

            <input
              type="date"
              value={formatToInput(formData[`${prefix}_policy_enddate`])}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,

                  [`${prefix}_policy_enddate`]: formatToDisplay(e.target.value),
                }))
              }
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
      {/* TOP BAR */}
      <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      <div className="p-6 md:p-8">
        {/* HEADER */}
        {/* <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-3xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
              <MdSecurity className="text-3xl" />
            </div>

            <div>
            
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
                Insurance
                Information
              </h2>

              <p className="text-gray-500 mt-1 text-sm">
                Manage vehicle,
                liability and
                insurance
                coverage details
              </p>
            </div>
          </div> */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* VEHICLE */}
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                  <MdDirectionsCar className="text-xl" />
                </div>

                <div>
                  {/* SMALLER TITLE */}
                  <h3 className="text-lg font-semibold text-[#1E1B4B]">
                    Vehicle Information & Auto Policies
                  </h3>

                  <p className="text-xs text-gray-500">
                    Vehicle details and auto insurance coverage information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}># of company vehicles</label>

                  <input
                    name="company_vehicles"
                    value={formData.company_vehicles}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Policy Number</label>

                  <input
                    name="vehicle_policy_number"
                    value={formData.vehicle_policy_number}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Bodily Injury (Per Person)
                  </label>

                  <CurrencyInput
                    name="vehicle_bodily_injury_per_person"
                    value={formData.vehicle_bodily_injury_per_person}
                    onChange={handleChange}
                    disabled={!isEditable}
                    inputClass={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Bodily Injury (Per Accident)
                  </label>

                  <CurrencyInput
                    name="vehicle_bodily_injury_per_accident"
                    value={formData.vehicle_bodily_injury_per_accident}
                    onChange={handleChange}
                    disabled={!isEditable}
                    inputClass={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Property Damage</label>

                  <CurrencyInput
                    name="vehicle_property_damage_per_accident"
                    value={formData.vehicle_property_damage_per_accident}
                    onChange={handleChange}
                    disabled={!isEditable}
                    inputClass={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Combined Single Limit</label>

                  <CurrencyInput
                    name="combined_single_limit"
                    value={formData.combined_single_limit}
                    onChange={handleChange}
                    disabled={!isEditable}
                    inputClass={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Start Date</label>

                  <input
                    type="date"
                    value={formatToInput(formData.vehicle_policy_startdate)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,

                        vehicle_policy_startdate: formatToDisplay(
                          e.target.value,
                        ),
                      }))
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Expiration Date</label>

                  <input
                    type="date"
                    value={formatToInput(formData.vehicle_policy_enddate)}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,

                        vehicle_policy_enddate: formatToDisplay(e.target.value),
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* CHECKBOX */}
              <label
                className={`flex items-start gap-4 p-5 rounded-2xl border border-gray-200 mt-6 transition-all duration-300 ${
                  formData.emp_use_personal_vehicles
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  name="emp_use_personal_vehicles"
                  checked={formData.emp_use_personal_vehicles}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className="mt-1 w-5 h-5 accent-indigo-600"
                />

                <div>
                  <p className="font-semibold text-[#1E1B4B] flex items-center gap-2 text-sm">
                    <MdCheckCircle className="text-indigo-500" />
                    Employees Use Personal Vehicles
                  </p>
                </div>
              </label>
              {/* AUTO POLICY INFORMATION */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-base font-semibold text-[#1E1B4B] mb-4">
                  Auto Policy Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>Auto Insurer Name</label>

                    <input
                      name="auto_insurer_name"
                      value={formData.auto_insurer_name}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className={inputClass}
                    />
                  </div>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-200 ${
                      formData.commercial_auto_insurance_policy
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="commercial_auto_insurance_policy"
                      checked={formData.commercial_auto_insurance_policy}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="w-5 h-5 accent-indigo-600"
                    />

                    <span className="font-medium text-sm text-[#1E1B4B]">
                      Commercial Auto Insurance
                    </span>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-200 ${
                      formData.hired_nonowned_auto_insurance_policy
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name="hired_nonowned_auto_insurance_policy"
                      checked={formData.hired_nonowned_auto_insurance_policy}
                      onChange={handleChange}
                      disabled={!isEditable}
                      className="w-5 h-5 accent-indigo-600"
                    />

                    <span className="font-medium text-sm text-[#1E1B4B]">
                      Hired / Non-Owned Auto Insurance
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* POLICIES */}
          {renderPolicySection("General Liability (GL)", "gl")}

          {renderPolicySection("Umbrella Insurance (UI)", "ui")}

          {renderPolicySection("Workers Compensation (WC)", "wc")}

          {/* AUTO */}
          {/* <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                Auto Policies
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div>
                  <label className={labelClass}>Auto Insurer Name</label>

                  <input
                    name="auto_insurer_name"
                    value={formData.auto_insurer_name}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className={inputClass}
                  />
                </div>


                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-200 ${
                    formData.commercial_auto_insurance_policy
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="commercial_auto_insurance_policy"
                    checked={formData.commercial_auto_insurance_policy}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="w-5 h-5 accent-indigo-600"
                  />

                  <span className="font-medium text-sm text-[#1E1B4B]">
                    Commercial Auto Insurance
                  </span>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-2xl border border-gray-200 ${
                    formData.hired_nonowned_auto_insurance_policy
                      ? "bg-indigo-50 border-indigo-200"
                      : "bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="hired_nonowned_auto_insurance_policy"
                    checked={formData.hired_nonowned_auto_insurance_policy}
                    onChange={handleChange}
                    disabled={!isEditable}
                    className="w-5 h-5 accent-indigo-600"
                  />

                  <span className="font-medium text-sm text-[#1E1B4B]">
                    Hired / Non-Owned Auto Insurance
                  </span>
                </label>
              </div>
            </div>
          </div> */}

          {/* NOTE */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5">
            <p className="text-sm text-gray-700 leading-relaxed">
              Please complete and submit a certificate of insurance as per the
              sample COI available under the Upload Documents section.
            </p>
          </div>

          {/* SUBMIT */}
          {isEditable && (
            <div className="flex justify-end">
              <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <MdSave size={20} />
                Update Insurance Info
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default InsuranceInfoForm;
