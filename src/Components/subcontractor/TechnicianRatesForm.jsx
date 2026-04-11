import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTechnicianRates } from "../../actions/subContractorAction";

const TechnicianRatesForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();

  const disabledClass = !isEditable
    ? "bg-gray-100 cursor-not-allowed"
    : "";

  const [formData, setFormData] = useState({
    cable_technicians: "",
    av_technicians: "",
    security_technicians: "",
    it_engineers: "",
    after_hours_rates: "",
    weekend_rates: "",
    holiday_rates: "",
    cabling_work_hourly_rate: "",
    av_work_hourly_rate: "",
    security_work_hourly_rate: "",
    it_work_hourly_rate: "",
    trip_charge: "",

    aerial_lift_certification_technicians: "",
    level_2_testers:false,
    certify_mm_fibre: false,
    certify_sm_fibre: false,
    camera_test_monitors: false,

    bicsi_certified_technicians: "",

    osha_10_technicians: "",
    osha_30_technicians: "",
    osha_62_technicians: "",
    sst_technicians: "",
  });

  /* ===========================
     Load Data
  =========================== */
  useEffect(() => {
    const technician = data?.contractor_technician_rates?.[0] || {};

    setFormData({
      cable_technicians: technician.cable_technicians || "",
      av_technicians: technician.av_technicians || "",
      security_technicians: technician.security_technicians || "",
      it_engineers: technician.it_engineers || "",

      after_hours_rates: technician.after_hours_rates || "",
      weekend_rates: technician.weekend_rates || "",
      holiday_rates: technician.holiday_rates || "",
      cabling_work_hourly_rate: technician.cabling_work_hourly_rate || "",
      av_work_hourly_rate: technician.av_work_hourly_rate || "",
      security_work_hourly_rate: technician.security_work_hourly_rate || "",
      it_work_hourly_rate: technician.it_work_hourly_rate || "",
      trip_charge: technician.trip_charge || "",
      level_2_testers: technician.level_2_testers || false,
      aerial_lift_certification_technicians:
        technician.aerial_lift_certification_technicians || "",

      certify_mm_fibre: technician.certify_mm_fibre || false,
      certify_sm_fibre: technician.certify_sm_fibre || false,
      camera_test_monitors: technician.camera_test_monitors || false,

      bicsi_certified_technicians:
        technician.bicsi_certified_technicians || "",

      osha_10_technicians: technician.osha_10_technicians || "",
      osha_30_technicians: technician.osha_30_technicians || "",
      osha_62_technicians: technician.osha_62_technicians || "",
      sst_technicians: technician.sst_technicians || "",
    });
  }, [data]);

  /* ===========================
     Handlers
  =========================== */
  const handleChange = (e) => {
    if (!isEditable) return;

    const { name, value, type, checked } = e.target;

    // 🔥 Allow only numbers for rates
    if (name.includes("rate") || name.includes("charge")) {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;

    dispatch(
      updateTechnicianRates({
        subcontractor_id: id,
        ...formData,
      })
    );
  };

  /* ===========================
     UI
  =========================== */
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      {/* ✅ Updated Heading */}
      <h2 className="text-xl font-semibold mb-6">
        Technician & Rate Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================= TECHNICIANS ================= */}
        <div>
          <h3 className="font-semibold mb-4">
            Technician Counts
          </h3>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Cable Technicians", name: "cable_technicians" },
              { label: "AV Technicians", name: "av_technicians" },
              { label: "Security Technicians", name: "security_technicians" },
              { label: "IT Engineers", name: "it_engineers" },
              {
                label: "Aerial Lift Certified Technicians",
                name: "aerial_lift_certification_technicians",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`border p-2 rounded w-full ${disabledClass}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================= RATES ================= */}
        <div>
          <h3 className="font-semibold mb-4">Rates ($)</h3>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "After Hours Rate", name: "after_hours_rates" },
              { label: "Weekend Rate", name: "weekend_rates" },
              { label: "Holiday Rate", name: "holiday_rates" },
              { label: "Cabling Work Hourly Rate", name: "cabling_work_hourly_rate" },
              { label: "AV Work Hourly Rate", name: "av_work_hourly_rate" },
              { label: "Security Work Hourly Rate", name: "security_work_hourly_rate" },
              { label: "IT Work Hourly Rate", name: "it_work_hourly_rate" },
              { label: "Trip Charge", name: "trip_charge" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`border p-2 rounded w-full ${disabledClass}`}
                  placeholder="$"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================= TOOLS ================= */}
        <div>
          <h3 className="font-semibold mb-4">Tools</h3>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Level 2 Tester / Certifier", name: "level_2_testers" },
              { label: "MM Fiber Certifier", name: "certify_mm_fibre" },
              { label: "SM Fiber Certifier", name: "certify_sm_fibre" },
              { label: "Camera Test Monitors", name: "camera_test_monitors" },
            ].map((field) => (
              <label key={field.name} className="flex items-center">
                <input
                  type="checkbox"
                  name={field.name}
                  checked={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className="mr-2"
                />
                {field.label}
              </label>
            ))}
          </div>
        </div>

        {/* ================= COMPLIANCE ================= */}
        <div>
          <h3 className="font-semibold mb-4">Compliance</h3>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "# of BICSI Certified Technicians", name: "bicsi_certified_technicians" },
              { label: "# of OSHA 10 Certified Technicians", name: "osha_10_technicians" },
              { label: "# of OSHA 30 Certified Technicians", name: "osha_30_technicians" },
              { label: "# of OSHA 62 Certified Technicians", name: "osha_62_technicians" },
              { label: "# of SST Certified Technicians", name: "sst_technicians" },
              { label: "# of Aerial Lift Certified Technicians", name: "aerial_lift_certification_technicians" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-sm font-medium">
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`border p-2 rounded w-full ${disabledClass}`}
                />
              </div>
            ))}
          </div>
        </div>

        {isEditable && (
          <div className="text-right">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Update Technician & Rate Details
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TechnicianRatesForm;