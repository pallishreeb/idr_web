/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  MdBuild,
  MdSecurity,
  MdSettingsInputComponent,
  MdVerified,
  MdSave,
  MdCheckCircle,
} from "react-icons/md";

import {
  updateAreaOfWork,
} from "../../actions/subContractorAction";

/* ===========================
   LABEL MAPPING
=========================== */

const LABELS = {
  fibre_splicing:
    "Fiber Splicing",

  cable_tray:
    "Cable Tray / Runway",

  fibre_cabling:
    "Fiber Cabling",

  rack_stack:
    "Rack & Stack",

  waste_recycle:
    "e-waste Recycle",

  it_relocation:
    "Computer Room Construction",

  data_center:
    "Data Center",

  // AV
  dsp: "DSP",

  ohm8_speaker_system:
    "8 ohm Speaker Systems",

  ohm70v_speaker_system:
    "70v Speaker Systems",

  // SECURITY
  control_programming:
    "Access Control Programming",

  ip_camera_system:
    "IP Camera Systems",

  nvr_configuration:
    "NVR Configuration",

  intercom_diagnostic_3_4wire:
    "Intercom Diagnostics of 3/4 wire systems",

  ip_intercom_install:
    "IP Intercom Install",

  control_door_lock:
    "Access Control Lock install",

  control_diagnostic:
    "Access Control Diagnostics",

  vms_configuration:
    "VMS Configuration",

  ip_intercom_repair:
    "IP Intercom Repair",

  alarm_programming:
    "Alarm Panel Programming",

  control_panel_install:
    "Access Control Panel Install",

  nvr_installation:
    "NVR Installation",

  intercom_install_3_4wire:
    "Intercom Install 3/4 Wire",
};

/* ===========================
   FIELDS
=========================== */

const STRUCTURED_FIELDS =
  [
    "analog_cabling",
    "cable_tray",
    "data_cabling",
    "data_center",
    "electrical",
    "fibre_cabling",
    "fibre_splicing",
    "it_relocation",
    "office_computer_setup",
    "rack_stack",
    "waste_recycle",
  ];

const AV_FIELDS =
  [
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

const SECURITY_FIELDS =
  [
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

const AreaOfWorkForm =
  ({
    id,
    data,
    isEditable,
  }) => {
    const dispatch =
      useDispatch();

    const [
      formData,
      setFormData,
    ] = useState({
      manufacturer_certifications:
        "",

      technical_certifications:
        "",

      structured_cabling:
        {},

      av_work: {},

      security_work:
        {},
    });

    /* ===========================
       LOAD DATA
    =========================== */
    useEffect(() => {
      const structuredRaw =
        data
          ?.structured_cablings?.[0] ||
        {};

      const avRaw =
        data
          ?.av_works?.[0] ||
        {};

      const securityRaw =
        data
          ?.security_works?.[0] ||
        {};

      const areaRaw =
        data
          ?.contractor_areaof_works?.[0] ||
        {};

      const buildSection =
        (
          fields,
          source,
        ) => {
          const result =
            {};

          fields.forEach(
            (
              field,
            ) => {
              result[
                field
              ] =
                source?.[
                  field
                ] ??
                false;
            },
          );

          return result;
        };

      setFormData({
        manufacturer_certifications:
          areaRaw?.manufacturer_certifications ||
          "",

        technical_certifications:
          areaRaw?.technical_certifications ||
          "",

        structured_cabling:
          buildSection(
            STRUCTURED_FIELDS,
            structuredRaw,
          ),

        av_work:
          buildSection(
            AV_FIELDS,
            avRaw,
          ),

        security_work:
          buildSection(
            SECURITY_FIELDS,
            securityRaw,
          ),
      });
    }, [data]);

    /* ===========================
       HANDLERS
    =========================== */

    const handleCheckboxChange =
      (
        section,
        field,
      ) => {
        if (
          !isEditable
        )
          return;

        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            [section]:
              {
                ...prev[
                  section
                ],

                [field]:
                  !prev[
                    section
                  ][
                    field
                  ],
              },
          }),
        );
      };

    const handleTextChange =
      (e) => {
        if (
          !isEditable
        )
          return;

        const {
          name,
          value,
        } = e.target;

        setFormData(
          (
            prev,
          ) => ({
            ...prev,
            [name]:
              value,
          }),
        );
      };

    const getLabel =
      (key) => {
        return (
          LABELS[
            key
          ] ||
          key
            .replace(
              /_/g,
              " ",
            )
            .replace(
              /\b\w/g,
              (
                c,
              ) =>
                c.toUpperCase(),
            )
        );
      };

    const sortFields =
      (fields) =>
        [
          ...fields,
        ].sort(
          (
            a,
            b,
          ) =>
            getLabel(
              a,
            ).localeCompare(
              getLabel(
                b,
              ),
            ),
        );

    // COMMON STYLE
    const inputClass =
      `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${
        !isEditable
          ? "bg-gray-100 cursor-not-allowed opacity-70"
          : ""
      }`;

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    /* ===========================
       CHECKBOX GRID
    =========================== */

    const renderCheckboxGrid =
      (
        sectionName,
        fields,
      ) => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {sortFields(
            fields,
          ).map(
            (
              key,
            ) => (
              <label
                key={
                  key
                }
                className={`flex items-start gap-4 p-5 rounded-2xl border border-gray-200 transition-all duration-300 ${
                  formData[
                    sectionName
                  ]?.[
                    key
                  ]
                    ? "bg-indigo-50 border-indigo-200"
                    : "bg-white"
                } ${
                  !isEditable
                    ? "cursor-not-allowed"
                    : "hover:border-indigo-300 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    formData[
                      sectionName
                    ]?.[
                      key
                    ] ||
                    false
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      sectionName,
                      key,
                    )
                  }
                  disabled={
                    !isEditable
                  }
                  className="mt-1 w-5 h-5 accent-indigo-600"
                />

                <div>
                  <p className="font-semibold text-[#1E1B4B] flex items-center gap-2">
                    <MdCheckCircle className="text-indigo-500" />
                    {getLabel(
                      key,
                    )}
                  </p>
                </div>
              </label>
            ),
          )}
        </div>
      );

    /* ===========================
       SUBMIT
    =========================== */

    const handleSubmit =
      (e) => {
        e.preventDefault();

        if (
          !isEditable
        )
          return;

        dispatch(
          updateAreaOfWork(
            {
              subcontractor_id:
                id,
              ...formData,
            },
          ),
        );
      };

    // SECTION CARD
    const renderSection =
      (
        title,
        icon,
        content,
      ) => (
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
            <div className="flex items-center gap-2">
              <div className="w-1 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                {icon}
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#1E1B4B]">
                  {title}
                </h3>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {content}
          </div>
        </div>
      );

    return (
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8">
          {/* HEADER */}
          {/* <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <MdBuild className="text-3xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                Services
                Provided
              </h2>

              <p className="text-gray-500 mt-1">
                Manage
                structured
                cabling, AV
                work and
                security
                services
              </p>
            </div>
          </div> */}

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-8"
          >
            {/* STRUCTURED */}
            {renderSection(
              "Structured Cabling",
              <MdSettingsInputComponent className="text-2xl" />,
              renderCheckboxGrid(
                "structured_cabling",
                STRUCTURED_FIELDS,
              ),
            )}

            {/* AV */}
            {renderSection(
              "AV Work",
              <MdBuild className="text-2xl" />,
              renderCheckboxGrid(
                "av_work",
                AV_FIELDS,
              ),
            )}

            {/* SECURITY */}
            {renderSection(
              "Security Work",
              <MdSecurity className="text-2xl" />,
              renderCheckboxGrid(
                "security_work",
                SECURITY_FIELDS,
              ),
            )}

            {/* CERTIFICATIONS */}
            {renderSection(
              "Certifications",
              <MdVerified className="text-2xl" />,
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Manufacturer
                    Certifications
                  </label>

                  <textarea
                    name="manufacturer_certifications"
                    value={
                      formData.manufacturer_certifications
                    }
                    onChange={
                      handleTextChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Enter manufacturer certifications"
                  />
                </div>

                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Technical
                    Certifications
                  </label>

                  <textarea
                    name="technical_certifications"
                    value={
                      formData.technical_certifications
                    }
                    onChange={
                      handleTextChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Enter technical certifications"
                  />
                </div>
              </div>,
            )}

            {/* SUBMIT */}
            {isEditable && (
              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <MdSave size={20} />
                  Update
                  Services
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

export default AreaOfWorkForm;