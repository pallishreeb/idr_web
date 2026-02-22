import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAreaOfWork } from "../../actions/subContractorAction";

/* ===========================
   Allowed Fields (Whitelist)
   =========================== */

const STRUCTURED_FIELDS = [
  "data_cabling",
  "analog_cabling",
  "fibre_cabling",
  "fibre_splicing",
  "rack_stack",
  "electrical",
  "cable_tray",
  "waste_recycle",
  "office_computer_setup",
  "it_relocation",
];

const AV_FIELDS = [
  "automation",
  "dsp",
  "video_display_installation",
  "video_wall",
  "ohm8_speaker_system",
  "ohm70v_speaker_system",
  "sound_masking",
  "poe_lighting",
  "lighting_control",
  "video_confrencing",
  "smartboard",
];

const SECURITY_FIELDS = [
  "alarm_device_install",
  "alarm_panel_install",
  "alarm_programming",
  "alarm_diagnostic",
  "control_door_lock",
  "control_panel_install",
  "control_programming",
  "control_diagnostic",
  "analog_camera_system",
  "ip_camera_system",
  "camera_diagnostic",
  "nvr_installation",
  "nvr_configuration",
  "vms_configuration",
  "intercom_install_3_4wire",
  "intercom_diagnostic_3_4wire",
  "intercom_install_2_wire",
  "intercom_diagnostic_2_wire",
  "ip_intercom_install",
  "ip_intercom_repair",
];

const AreaOfWorkForm = ({ id, data }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    manufacturer_certifications: "",
    technical_certifications: "",
    structured_cabling: {},
    av_work: {},
    security_work: {},
  });

  /* ===========================
     Normalize Incoming Data
     =========================== */

useEffect(() => {
  const structuredRaw = data?.structured_cablings?.[0] || {};
  const avRaw = data?.av_works?.[0] || {};
  const securityRaw = data?.security_works?.[0] || {};
  const areaRaw = data?.contractor_areaof_works?.[0] || {};

  const buildSection = (fields, source) => {
    const result = {};
    fields.forEach((field) => {
      result[field] = source?.[field] ?? false;
    });
    return result;
  };

  setFormData({
    manufacturer_certifications:
      areaRaw?.manufacturer_certifications || "",
    technical_certifications:
      areaRaw?.technical_certifications || "",

    structured_cabling: buildSection(
      STRUCTURED_FIELDS,
      structuredRaw
    ),
    av_work: buildSection(AV_FIELDS, avRaw),
    security_work: buildSection(SECURITY_FIELDS, securityRaw),
  });
}, [data]);

  /* ===========================
     Handlers
     =========================== */

  const handleCheckboxChange = (section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderCheckboxGrid = (sectionName, fields) => {
    return (
      <div className="grid grid-cols-3 gap-3">
        {fields.map((key) => (
          <label key={key} className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={formData[sectionName]?.[key] || false}
              onChange={() =>
                handleCheckboxChange(sectionName, key)
              }
              className="mr-2"
            />
            {key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())}
          </label>
        ))}
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateAreaOfWork({
        subcontractor_id: id,
        manufacturer_certifications:
          formData.manufacturer_certifications,
        technical_certifications:
          formData.technical_certifications,
        structured_cabling: formData.structured_cabling,
        av_work: formData.av_work,
        security_work: formData.security_work,
      })
    );
  };

  /* ===========================
     UI
     =========================== */

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Area of Work
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Manufacturer Certifications */}
        <div>
          <h3 className="font-semibold mb-3">
            Manufacturer Certifications
          </h3>
          <textarea
            name="manufacturer_certifications"
            value={formData.manufacturer_certifications}
            onChange={handleTextChange}
            className="border p-2 rounded w-full"
            rows="3"
          />
        </div>

        {/* Technical Certifications */}
        <div>
          <h3 className="font-semibold mb-3">
            Technical Certifications
          </h3>
          <textarea
            name="technical_certifications"
            value={formData.technical_certifications}
            onChange={handleTextChange}
            className="border p-2 rounded w-full"
            rows="3"
          />
        </div>

        {/* Structured Cabling */}
        <div>
          <h3 className="font-semibold mb-4">
            Structured Cabling
          </h3>
          {renderCheckboxGrid(
            "structured_cabling",
            STRUCTURED_FIELDS
          )}
        </div>

        {/* AV Work */}
        <div>
          <h3 className="font-semibold mb-4">
            AV Work
          </h3>
          {renderCheckboxGrid("av_work", AV_FIELDS)}
        </div>

        {/* Security Work */}
        <div>
          <h3 className="font-semibold mb-4">
            Security Work
          </h3>
          {renderCheckboxGrid(
            "security_work",
            SECURITY_FIELDS
          )}
        </div>

        <div className="text-right">
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Update Area of Work
          </button>
        </div>

      </form>
    </div>
  );
};

export default AreaOfWorkForm;