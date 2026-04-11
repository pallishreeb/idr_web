import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateAreaOfWork } from "../../actions/subContractorAction";

/* ===========================
   Label Mapping (UI ONLY)
=========================== */

const LABELS = {
  // Structured
  fibre_splicing: "Fiber Splicing",
  cable_tray: "Cable Tray / Runway",
  fibre_cabling: "Fiber Cabling",
  rack_stack: "Rack & Stack",
  waste_recycle: "e-waste Recycle",
  it_relocation: "Computer Room Construction",
  data_center: "Data Center",

  // AV
  dsp: "DSP",
  ohm8_speaker_system: "8 ohm Speaker Systems",
  ohm70v_speaker_system: "70v Speaker Systems",

  // Security
  control_programming: "Access Control Programming",
  ip_camera_system: "IP Camera Systems",
  nvr_configuration: "NVR Configuration",
  intercom_diagnostic_3_4wire:
    "Intercom Diagnostics of 3/4 wire systems",
  ip_intercom_install: "IP Intercom Install",
  control_door_lock: "Access Control Lock install",
  control_diagnostic: "Access Control Diagnostics",
  vms_configuration: "VMS Configuration",
  ip_intercom_repair: "IP Intercom Repair",
  alarm_programming: "Alarm Panel Programming",
  control_panel_install: "Access Control Panel Install",
  nvr_installation: "NVR Installation",
  intercom_install_3_4wire:
    "Intercom Install 3/4 Wire",
};

/* ===========================
   Fields
=========================== */

const STRUCTURED_FIELDS = [
  "analog_cabling",
  "cable_tray",
  "data_cabling",
  "data_center", // ✅ new
  "electrical",
  "fibre_cabling",
  "fibre_splicing",
  "it_relocation",
  "office_computer_setup",
  "rack_stack",
  "waste_recycle",
];

const AV_FIELDS = [
  "automation",
  "dsp",
  "lighting_control",
  "ohm70v_speaker_system",
  "ohm8_speaker_system",
  "poe_lighting",
  "smartboard",
  "sound_masking",
  "video_confrencing",
  "video_display_installation",
  "video_wall",
];

const SECURITY_FIELDS = [
  "alarm_device_install",
  "alarm_diagnostic",
  "alarm_panel_install",
  "alarm_programming",
  "analog_camera_system",
  "camera_diagnostic",
  "control_diagnostic",
  "control_door_lock",
  "control_panel_install",
  "control_programming",
  "intercom_diagnostic_2_wire",
  "intercom_diagnostic_3_4wire",
  "intercom_install_2_wire",
  "intercom_install_3_4wire",
  "ip_camera_system",
  "ip_intercom_install",
  "ip_intercom_repair",
  "nvr_configuration",
  "nvr_installation",
  "vms_configuration",
];

const AreaOfWorkForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    manufacturer_certifications: "",
    technical_certifications: "",
    structured_cabling: {},
    av_work: {},
    security_work: {},
  });

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
      security_work: buildSection(
        SECURITY_FIELDS,
        securityRaw
      ),
    });
  }, [data]);

  const handleCheckboxChange = (section, field) => {
    if (!isEditable) return;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const getLabel = (key) => {
    return (
      LABELS[key] ||
      key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  const sortFields = (fields) =>
    [...fields].sort((a, b) =>
      getLabel(a).localeCompare(getLabel(b))
    );

  const renderCheckboxGrid = (sectionName, fields) => (
    <div className="grid grid-cols-3 gap-3">
      {sortFields(fields).map((key) => (
        <label key={key} className="flex items-center text-sm">
          <input
            type="checkbox"
            checked={formData[sectionName]?.[key] || false}
            onChange={() =>
              handleCheckboxChange(sectionName, key)
            }
            disabled={!isEditable}
            className="mr-2"
          />
          {getLabel(key)}
        </label>
      ))}
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;

    dispatch(
      updateAreaOfWork({
        subcontractor_id: id,
        ...formData,
      })
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      {/* ✅ TITLE CHANGE */}
      <h2 className="text-xl font-semibold mb-6">
        Services Provided
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h3 className="font-semibold mb-4">
            Structured Cabling
          </h3>
          {renderCheckboxGrid(
            "structured_cabling",
            STRUCTURED_FIELDS
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-4">AV Work</h3>
          {renderCheckboxGrid("av_work", AV_FIELDS)}
        </div>

        <div>
          <h3 className="font-semibold mb-4">
            Security Work
          </h3>
          {renderCheckboxGrid(
            "security_work",
            SECURITY_FIELDS
          )}
        </div>

        {isEditable && (
          <div className="text-right">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Update
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AreaOfWorkForm;