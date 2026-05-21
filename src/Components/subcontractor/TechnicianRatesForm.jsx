/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  MdEngineering,
  MdAttachMoney,
  MdVerified,
  MdBuild,
  MdSave,
  MdCheckCircle,
} from "react-icons/md";

import {
  updateTechnicianRates,
} from "../../actions/subContractorAction";

const TechnicianRatesForm =
  ({
    id,
    data,
    isEditable,
  }) => {
    const dispatch =
      useDispatch();

    const disabledClass =
      !isEditable
        ? "bg-gray-100 cursor-not-allowed opacity-70"
        : "";

    const [
      formData,
      setFormData,
    ] = useState({
      cable_technicians:
        "",
      av_technicians:
        "",
      security_technicians:
        "",
      it_engineers:
        "",
      after_hours_rates:
        "",
      weekend_rates:
        "",
      holiday_rates:
        "",
      cabling_work_hourly_rate:
        "",
      av_work_hourly_rate:
        "",
      security_work_hourly_rate:
        "",
      it_work_hourly_rate:
        "",
      trip_charge:
        "",

      aerial_lift_certification_technicians:
        "",

      level_2_testers:
        false,

      certify_mm_fibre:
        false,

      certify_sm_fibre:
        false,

      camera_test_monitors:
        false,

      bicsi_certified_technicians:
        "",

      osha_10_technicians:
        "",

      osha_30_technicians:
        "",

      osha_62_technicians:
        "",

      sst_technicians:
        "",
    });

    /* ===========================
       LOAD DATA
    =========================== */
    useEffect(() => {
      const technician =
        data
          ?.contractor_technician_rates?.[0] ||
        {};

      setFormData({
        cable_technicians:
          technician.cable_technicians ||
          "",

        av_technicians:
          technician.av_technicians ||
          "",

        security_technicians:
          technician.security_technicians ||
          "",

        it_engineers:
          technician.it_engineers ||
          "",

        after_hours_rates:
          technician.after_hours_rates ||
          "",

        weekend_rates:
          technician.weekend_rates ||
          "",

        holiday_rates:
          technician.holiday_rates ||
          "",

        cabling_work_hourly_rate:
          technician.cabling_work_hourly_rate ||
          "",

        av_work_hourly_rate:
          technician.av_work_hourly_rate ||
          "",

        security_work_hourly_rate:
          technician.security_work_hourly_rate ||
          "",

        it_work_hourly_rate:
          technician.it_work_hourly_rate ||
          "",

        trip_charge:
          technician.trip_charge ||
          "",

        level_2_testers:
          technician.level_2_testers ||
          false,

        aerial_lift_certification_technicians:
          technician.aerial_lift_certification_technicians ||
          "",

        certify_mm_fibre:
          technician.certify_mm_fibre ||
          false,

        certify_sm_fibre:
          technician.certify_sm_fibre ||
          false,

        camera_test_monitors:
          technician.camera_test_monitors ||
          false,

        bicsi_certified_technicians:
          technician.bicsi_certified_technicians ||
          "",

        osha_10_technicians:
          technician.osha_10_technicians ||
          "",

        osha_30_technicians:
          technician.osha_30_technicians ||
          "",

        osha_62_technicians:
          technician.osha_62_technicians ||
          "",

        sst_technicians:
          technician.sst_technicians ||
          "",
      });
    }, [data]);

    /* ===========================
       HANDLERS
    =========================== */
    const handleChange =
      (e) => {
        if (
          !isEditable
        )
          return;

        const {
          name,
          value,
          type,
          checked,
        } = e.target;

        // ONLY NUMBERS FOR RATES
        if (
          name.includes(
            "rate",
          ) ||
          name.includes(
            "charge",
          )
        ) {
          if (
            !/^\d*\.?\d*$/.test(
              value,
            )
          )
            return;
        }

        setFormData(
          (
            prev,
          ) => ({
            ...prev,
            [name]:
              type ===
              "checkbox"
                ? checked
                : value,
          }),
        );
      };

    // SUBMIT
    const handleSubmit =
      (e) => {
        e.preventDefault();

        if (
          !isEditable
        )
          return;

        dispatch(
          updateTechnicianRates(
            {
              subcontractor_id:
                id,
              ...formData,
            },
          ),
        );
      };

    // COMMON STYLES
    const inputClass =
      `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${disabledClass}`;

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    // SECTION COMPONENT
    const renderSection =
      (
        title,
        icon,
        children,
      ) => (
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md">
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
            {children}
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
              <MdEngineering className="text-3xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                Technician &
                Rate Details
              </h2>

              <p className="text-gray-500 mt-1">
                Manage
                technicians,
                hourly rates,
                certifications
                and compliance
                information
              </p>
            </div>
          </div> */}

          <form
            onSubmit={
              handleSubmit
            }
            className={`space-y-8 ${
              !isEditable
                ? "opacity-80"
                : ""
            }`}
          >
            {/* TECHNICIANS */}
            {renderSection(
              "Technician Counts",
              <MdEngineering className="text-2xl" />,
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  {
                    label:
                      "Cable Technicians",
                    name:
                      "cable_technicians",
                  },

                  {
                    label:
                      "AV Technicians",
                    name:
                      "av_technicians",
                  },

                  {
                    label:
                      "Security Technicians",
                    name:
                      "security_technicians",
                  },

                  {
                    label:
                      "IT Engineers",
                    name:
                      "it_engineers",
                  },

                  {
                    label:
                      "Aerial Lift Certified Technicians",
                    name:
                      "aerial_lift_certification_technicians",
                  },
                ].map(
                  (
                    field,
                  ) => (
                    <div
                      key={
                        field.name
                      }
                    >
                      <label
                        className={
                          labelClass
                        }
                      >
                        {
                          field.label
                        }
                      </label>

                      <div className="relative">
                        <MdEngineering className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="number"
                          name={
                            field.name
                          }
                          value={
                            formData[
                              field
                                .name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !isEditable
                          }
                          className={`${inputClass} pl-12`}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>,
            )}

            {/* RATES */}
            {renderSection(
              "Rates & Charges",
              <MdAttachMoney className="text-2xl" />,
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  {
                    label:
                      "After Hours Rate",
                    name:
                      "after_hours_rates",
                  },

                  {
                    label:
                      "Weekend Rate",
                    name:
                      "weekend_rates",
                  },

                  {
                    label:
                      "Holiday Rate",
                    name:
                      "holiday_rates",
                  },

                  {
                    label:
                      "Cabling Work Hourly Rate",
                    name:
                      "cabling_work_hourly_rate",
                  },

                  {
                    label:
                      "AV Work Hourly Rate",
                    name:
                      "av_work_hourly_rate",
                  },

                  {
                    label:
                      "Security Work Hourly Rate",
                    name:
                      "security_work_hourly_rate",
                  },

                  {
                    label:
                      "IT Work Hourly Rate",
                    name:
                      "it_work_hourly_rate",
                  },

                  {
                    label:
                      "Trip Charge",
                    name:
                      "trip_charge",
                  },
                ].map(
                  (
                    field,
                  ) => (
                    <div
                      key={
                        field.name
                      }
                    >
                      <label
                        className={
                          labelClass
                        }
                      >
                        {
                          field.label
                        }
                      </label>

                      <div className="relative">
                        <MdAttachMoney className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          name={
                            field.name
                          }
                          value={
                            formData[
                              field
                                .name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !isEditable
                          }
                          className={`${inputClass} pl-12`}
                          placeholder="$"
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>,
            )}

            {/* TOOLS */}
            {renderSection(
              "Tools & Certifications",
              <MdBuild className="text-2xl" />,
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    label:
                      "Level 2 Tester / Certifier",
                    name:
                      "level_2_testers",
                  },

                  {
                    label:
                      "MM Fiber Certifier",
                    name:
                      "certify_mm_fibre",
                  },

                  {
                    label:
                      "SM Fiber Certifier",
                    name:
                      "certify_sm_fibre",
                  },

                  {
                    label:
                      "Camera Test Monitors",
                    name:
                      "camera_test_monitors",
                  },
                ].map(
                  (
                    field,
                  ) => (
                    <label
                      key={
                        field.name
                      }
                      className={`flex items-start gap-4 p-5 rounded-2xl border border-gray-200 transition-all duration-300 ${
                        formData[
                          field
                            .name
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
                        name={
                          field.name
                        }
                        checked={
                          formData[
                            field
                              .name
                          ]
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !isEditable
                        }
                        className="mt-1 w-5 h-5 accent-indigo-600"
                      />

                      <div>
                        <p className="font-semibold text-[#1E1B4B] flex items-center gap-2">
                          <MdCheckCircle className="text-indigo-500" />
                          {
                            field.label
                          }
                        </p>
                      </div>
                    </label>
                  ),
                )}
              </div>,
            )}

            {/* COMPLIANCE */}
            {renderSection(
              "Compliance & Certifications",
              <MdVerified className="text-2xl" />,
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[
                  {
                    label:
                      "BICSI Certified Technicians",
                    name:
                      "bicsi_certified_technicians",
                  },

                  {
                    label:
                      "OSHA 10 Certified Technicians",
                    name:
                      "osha_10_technicians",
                  },

                  {
                    label:
                      "OSHA 30 Certified Technicians",
                    name:
                      "osha_30_technicians",
                  },

                  {
                    label:
                      "OSHA 62 Certified Technicians",
                    name:
                      "osha_62_technicians",
                  },

                  {
                    label:
                      "SST Certified Technicians",
                    name:
                      "sst_technicians",
                  },

                  {
                    label:
                      "Aerial Lift Certified Technicians",
                    name:
                      "aerial_lift_certification_technicians",
                  },
                ].map(
                  (
                    field,
                  ) => (
                    <div
                      key={
                        field.name
                      }
                    >
                      <label
                        className={
                          labelClass
                        }
                      >
                        {
                          field.label
                        }
                      </label>

                      <div className="relative">
                        <MdVerified className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="number"
                          name={
                            field.name
                          }
                          value={
                            formData[
                              field
                                .name
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !isEditable
                          }
                          className={`${inputClass} pl-12`}
                        />
                      </div>
                    </div>
                  ),
                )}
              </div>,
            )}

            {/* SUBMIT */}
            {isEditable && (
              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <MdSave size={20} />
                  Update
                  Technician &
                  Rate Details
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

export default TechnicianRatesForm;