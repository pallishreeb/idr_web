import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateTechnicianRates } from "../../actions/subContractorAction";

const TechnicianRatesForm = ({ id, data }) => {
  const dispatch = useDispatch();

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
    coverage_area: "",
    level_2_testers: "",
    aerial_lift_certification_technicians: "",

    certify_mm_fibre: false,
    certify_sm_fibre: false,
    camera_test_monitors: false,
    company_provide_service: false,
    bicsi_certified_technicians: false,

    osha_10_technicians: "",
    osha_30_technicians: "",
    sst_technicians: "",
    osha_62_technicians: "",
  });

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
      coverage_area: technician.coverage_area || "",
      level_2_testers: technician.level_2_testers || "",
      aerial_lift_certification_technicians:
        technician.aerial_lift_certification_technicians || "",

      certify_mm_fibre: technician.certify_mm_fibre || false,
      certify_sm_fibre: technician.certify_sm_fibre || false,
      camera_test_monitors: technician.camera_test_monitors || false,
      company_provide_service: technician.company_provide_service || false,
      bicsi_certified_technicians:
        technician.bicsi_certified_technicians || false,

      osha_10_technicians: technician.osha_10_technicians || "",
      osha_30_technicians: technician.osha_30_technicians || "",
      sst_technicians: technician.sst_technicians || "",
      osha_62_technicians: technician.osha_62_technicians || "",
    });
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
      updateTechnicianRates({
        subcontractor_id: id,
        ...formData,
      }),
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Technician & Rates Information
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Technician Counts */}
        <div>
          <h3 className="font-semibold mb-4">Technician Counts</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Cable Technicians
              </label>
              <input
                name="cable_technicians"
                value={formData.cable_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">AV Technicians</label>
              <input
                name="av_technicians"
                value={formData.av_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Security Technicians
              </label>
              <input
                name="security_technicians"
                value={formData.security_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">IT Engineers</label>
              <input
                name="it_engineers"
                value={formData.it_engineers}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Level 2 Testers
              </label>
              <input
                name="level_2_testers"
                value={formData.level_2_testers}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Aerial Lift Certified Technicians
              </label>
              <input
                name="aerial_lift_certification_technicians"
                value={formData.aerial_lift_certification_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Rates */}
        <div>
          <h3 className="font-semibold mb-4">Rates</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                After Hours Rate
              </label>
              <input
                name="after_hours_rates"
                value={formData.after_hours_rates}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Weekend Rate</label>
              <input
                name="weekend_rates"
                value={formData.weekend_rates}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Holiday Rate</label>
              <input
                name="holiday_rates"
                value={formData.holiday_rates}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Cabling Work Hourly Rate
              </label>
              <input
                name="cabling_work_hourly_rate"
                value={formData.cabling_work_hourly_rate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                AV Work Hourly Rate
              </label>
              <input
                name="av_work_hourly_rate"
                value={formData.av_work_hourly_rate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                Security Work Hourly Rate
              </label>
              <input
                name="security_work_hourly_rate"
                value={formData.security_work_hourly_rate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                IT Work Hourly Rate
              </label>
              <input
                name="it_work_hourly_rate"
                value={formData.it_work_hourly_rate}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Trip Charge</label>
              <input
                name="trip_charge"
                value={formData.trip_charge}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Coverage Area</label>
              <input
                name="coverage_area"
                value={formData.coverage_area}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="font-semibold mb-4">Certifications</h3>
          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="certify_mm_fibre"
                checked={formData.certify_mm_fibre}
                onChange={handleChange}
                className="mr-2"
              />
              Certify MM Fibre
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="certify_sm_fibre"
                checked={formData.certify_sm_fibre}
                onChange={handleChange}
                className="mr-2"
              />
              Certify SM Fibre
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="camera_test_monitors"
                checked={formData.camera_test_monitors}
                onChange={handleChange}
                className="mr-2"
              />
              Camera Test Monitors
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="company_provide_service"
                checked={formData.company_provide_service}
                onChange={handleChange}
                className="mr-2"
              />
              Company Provide Service
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                name="bicsi_certified_technicians"
                checked={formData.bicsi_certified_technicians}
                onChange={handleChange}
                className="mr-2"
              />
              BICSI Certified
            </label>
          </div>
        </div>

        {/* OSHA / Compliance */}
        <div>
          <h3 className="font-semibold mb-4">Compliance</h3>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                OSHA 10 Certified Technicians
              </label>
              <input
                type="number"
                name="osha_10_technicians"
                value={formData.osha_10_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                OSHA 30 Certified Technicians
              </label>
              <input
                type="number"
                name="osha_30_technicians"
                value={formData.osha_30_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                SST Certified Technicians
              </label>
              <input
                type="number"
                name="sst_technicians"
                value={formData.sst_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">
                OSHA 62 Certified Technicians
              </label>
              <input
                type="number"
                name="osha_62_technicians"
                value={formData.osha_62_technicians}
                onChange={handleChange}
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Update Technician & Rates
          </button>
        </div>
      </form>
    </div>
  );
};

export default TechnicianRatesForm;
