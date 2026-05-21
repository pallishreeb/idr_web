/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  MdBusiness,
  MdLocationOn,
  MdAttachMoney,
  MdGroups,
  MdVerified,
  MdSave,
  MdStar,
  MdBadge,
} from "react-icons/md";

import {
  updateBusinessDetails,
} from "../../actions/subContractorAction";

const BusinessDetailsForm =
  ({
    id,
    data,
    isEditable,
  }) => {
    const dispatch =
      useDispatch();

    const {
      user_type,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
      );

    const disabledClass =
      !isEditable
        ? "bg-gray-100 cursor-not-allowed opacity-70"
        : "";

    const [
      formData,
      setFormData,
    ] = useState({
      subcontractor_name:
        "",
      street_address:
        "",
      suite: "",
      city: "",
      state: "",
      zipcode:
        "",
      coverage_area:
        "",
      hourly_rate:
        "",
      trip_charge:
        "",
      no_of_technicians:
        "",
      is_certifier:
        false,
      rating: "",
      b_firstname:
        "",
      b_lastname:
        "",
      authorized_to_submit:
        false,
      referer_name:
        "",
      business_dba:
        "",
      company_type:
        "",
      llc_classification:
        "",
      licenses_held:
        "",
      shop_union:
        false,
      company_provide_service:
        false,
    });

    useEffect(() => {
      if (data) {
        setFormData({
          subcontractor_name:
            data.subcontractor_name ||
            "",

          street_address:
            data.street_address ||
            "",

          suite:
            data.suite ||
            "",

          city:
            data.city ||
            "",

          state:
            data.state ||
            "",

          zipcode:
            data.zipcode ||
            "",

          coverage_area:
            data.coverage_area ||
            "",

          hourly_rate:
            data.hourly_rate ||
            "",

          trip_charge:
            data.trip_charge ||
            "",

          no_of_technicians:
            data.no_of_technicians ||
            "",

          is_certifier:
            data.is_certifier ||
            false,

          rating:
            data.rating ||
            "",

          b_firstname:
            data.b_firstname ||
            "",

          b_lastname:
            data.b_lastname ||
            "",

          authorized_to_submit:
            data.authorized_to_submit ||
            false,

          referer_name:
            data.referer_name ||
            "",

          business_dba:
            data.business_dba ||
            "",

          company_type:
            data.company_type ||
            "",

          llc_classification:
            data.llc_classification ||
            "",

          licenses_held:
            data.licenses_held ||
            "",

          shop_union:
            data.shop_union ||
            false,

          company_provide_service:
            data.company_provide_service ||
            false,
        });
      }
    }, [data]);

    // CHANGE
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
          updateBusinessDetails(
            {
              subcontractor_id:
                id,
              ...formData,
            },
          ),
        );
      };

    const states =
      [
        "AL",
        "AK",
        "AZ",
        "AR",
        "CA",
        "CO",
        "CT",
        "DE",
        "FL",
        "GA",
        "HI",
        "ID",
        "IL",
        "IN",
        "IA",
        "KS",
        "KY",
        "LA",
        "ME",
        "MD",
        "MA",
        "MI",
        "MN",
        "MS",
        "MO",
        "MT",
        "NE",
        "NV",
        "NH",
        "NJ",
        "NM",
        "NY",
        "NC",
        "ND",
        "OH",
        "OK",
        "OR",
        "PA",
        "RI",
        "SC",
        "SD",
        "TN",
        "TX",
        "UT",
        "VT",
        "VA",
        "WA",
        "WV",
        "WI",
        "WY",
      ];

    // COMMON STYLES
    const inputClass =
      `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${disabledClass}`;

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    return (
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8">
          {/* HEADER */}
          {/* <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <MdBusiness className="text-3xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                Business
                Details
              </h2>

              <p className="text-gray-500 mt-1">
                Update
                subcontractor
                business and
                operational
                information
              </p>
            </div>
          </div> */}

          <form
            onSubmit={
              handleSubmit
            }
            className={`space-y-10 ${
              !isEditable
                ? "opacity-80"
                : ""
            }`}
          >
            {/* BUSINESS INFO */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Business
                  Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* SUBCONTRACTOR */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Subcontractor
                    Name
                  </label>

                  <div className="relative">
                    <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <input
                      name="subcontractor_name"
                      value={
                        formData.subcontractor_name
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !isEditable
                      }
                      className={`${inputClass} pl-12`}
                      placeholder="Enter subcontractor name"
                    />
                  </div>
                </div>

                {/* DBA */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Business
                    DBA
                  </label>

                  <input
                    name="business_dba"
                    value={
                      formData.business_dba
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                    placeholder="Enter DBA name"
                  />
                </div>

                {/* COMPANY TYPE */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Company
                    Type
                  </label>

                  <select
                    name="company_type"
                    value={
                      formData.company_type
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select
                      Company
                      Type
                    </option>

                    <option value="Sole Proprietorship">
                      Sole
                      Proprietorship
                    </option>

                    <option value="LLC">
                      LLC
                    </option>

                    <option value="Corporation">
                      Corporation
                    </option>

                    <option value="Partnership">
                      Partnership
                    </option>
                  </select>
                </div>

                {/* LLC */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    LLC
                    Classification
                  </label>

                  <input
                    name="llc_classification"
                    value={
                      formData.llc_classification
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                    placeholder="LLC Classification"
                  />
                </div>

                {/* TECHNICIANS */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    No. of
                    Technicians
                  </label>

                  <div className="relative">
                    <MdGroups className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <input
                      name="no_of_technicians"
                      value={
                        formData.no_of_technicians
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !isEditable
                      }
                      className={`${inputClass} pl-12`}
                      placeholder="Enter number"
                    />
                  </div>
                </div>

                {/* RATING */}
                {user_type !==
                  "Subcontractor" && (
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Rating
                    </label>

                    <div className="relative">
                      <MdStar className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <select
                        name="rating"
                        value={
                          formData.rating
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !isEditable
                        }
                        className={`${inputClass} pl-12`}
                      >
                        <option value="">
                          Select
                          Rating
                        </option>

                        <option value="A">
                          A
                        </option>

                        <option value="B">
                          B
                        </option>

                        <option value="C">
                          C
                        </option>

                        <option value="D">
                          D
                        </option>

                        <option value="F">
                          F
                        </option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ADDRESS INFO */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Address
                  Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* STREET */}
                <div className="xl:col-span-2">
                  <label
                    className={
                      labelClass
                    }
                  >
                    Street
                    Address
                  </label>

                  <div className="relative">
                    <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <input
                      name="street_address"
                      value={
                        formData.street_address
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !isEditable
                      }
                      className={`${inputClass} pl-12`}
                      placeholder="Enter street address"
                    />
                  </div>
                </div>

                {/* SUITE */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Suite
                  </label>

                  <input
                    name="suite"
                    value={
                      formData.suite
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                    placeholder="Suite"
                  />
                </div>

                {/* CITY */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    City
                  </label>

                  <input
                    name="city"
                    value={
                      formData.city
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                    placeholder="City"
                  />
                </div>

                {/* STATE */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    State
                  </label>

                  <select
                    name="state"
                    value={
                      formData.state
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                  >
                    <option value="">
                      Select
                      State
                    </option>

                    {states.map(
                      (
                        s,
                      ) => (
                        <option
                          key={
                            s
                          }
                          value={
                            s
                          }
                        >
                          {s}
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* ZIP */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Zip Code
                  </label>

                  <input
                    name="zipcode"
                    value={
                      formData.zipcode
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={
                      inputClass
                    }
                    placeholder="Zip Code"
                  />
                </div>
              </div>
            </div>

            {/* FINANCIAL */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Pricing &
                  Coverage
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HOURLY */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Hourly
                    Rate
                  </label>

                  <div className="relative">
                    <MdAttachMoney className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <input
                      name="hourly_rate"
                      value={
                        formData.hourly_rate
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !isEditable
                      }
                      className={`${inputClass} pl-12`}
                      placeholder="Hourly Rate"
                    />
                  </div>
                </div>

                {/* TRIP */}
                <div>
                  <label
                    className={
                      labelClass
                    }
                  >
                    Trip Charge
                  </label>

                  <div className="relative">
                    <MdAttachMoney className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <input
                      name="trip_charge"
                      value={
                        formData.trip_charge
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        !isEditable
                      }
                      className={`${inputClass} pl-12`}
                      placeholder="Trip Charge"
                    />
                  </div>
                </div>

                {/* COVERAGE */}
                <div className="md:col-span-2">
                  <label
                    className={
                      labelClass
                    }
                  >
                    Coverage
                    Area
                  </label>

                  <textarea
                    name="coverage_area"
                    value={
                      formData.coverage_area
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Enter coverage areas"
                  />
                </div>

                {/* LICENSE */}
                <div className="md:col-span-2">
                  <label
                    className={
                      labelClass
                    }
                  >
                    Licenses
                    Held
                  </label>

                  <textarea
                    name="licenses_held"
                    value={
                      formData.licenses_held
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !isEditable
                    }
                    className={`${inputClass} min-h-[120px]`}
                    placeholder="Enter license details"
                  />
                </div>
              </div>
            </div>

            {/* CHECKBOX SECTION */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Certifications
                  & Services
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  {
                    name: "is_certifier",
                    label:
                      "Company owns a certifier",
                  },

                  {
                    name: "shop_union",
                    label:
                      "Company is a Union Shop",
                  },

                  {
                    name: "company_provide_service",
                    label:
                      "Company provides service",
                  },

                  {
                    name: "authorized_to_submit",
                    label:
                      "Authorized to submit this form",
                  },
                ].map(
                  (
                    item,
                  ) => (
                    <label
                      key={
                        item.name
                      }
                      className={`flex items-start gap-4 p-5 rounded-2xl border border-gray-200 transition-all duration-300 ${
                        formData[
                          item.name
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
                          item.name
                        }
                        checked={
                          formData[
                            item.name
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
                        <p className="font-semibold text-[#1E1B4B]">
                          {
                            item.label
                          }
                        </p>
                      </div>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* ACTION BUTTON */}
            {isEditable && (
              <div className="flex justify-end pt-2">
                <button className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <MdSave size={20} />
                  Update
                  Business
                  Details
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

export default BusinessDetailsForm;