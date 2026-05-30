/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
} from "react-redux";

import {
  MdPerson,
  MdPhone,
  MdEmail,
  MdGroups,
  MdSave,
  MdCheckCircle,
} from "react-icons/md";

import {
  updateContactDetails,
} from "../../actions/subContractorAction";

const ContactDetailsForm =
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
      p_firstname:
        "",
      p_lastname:
        "",
      p_phonenumber:
        "",
      p_mobilenumber:
        "",
      p_email: "",

      s_firstname:
        "",
      s_lastname:
        "",
      s_phonenumber:
        "",
      s_mobilenumber:
        "",
      s_email: "",

      a_firstname:
        "",
      a_lastname:
        "",
      a_phonenumber:
        "",
      a_mobilenumber:
        "",
      a_email: "",
    });

    const [
      serviceSameAsProject,
      setServiceSameAsProject,
    ] =
      useState(false);

    const [
      accountsSameAsProject,
      setAccountsSameAsProject,
    ] =
      useState(false);

    /* ===========================
       Populate From Backend
    =========================== */
    useEffect(() => {
      if (data) {
        setFormData({
          p_firstname:
            data.p_firstname ||
            "",

          p_lastname:
            data.p_lastname ||
            "",

          p_phonenumber:
            data.p_phonenumber ||
            "",

          p_mobilenumber:
            data.p_mobilenumber ||
            "",

          p_email:
            data.p_email ||
            "",

          s_firstname:
            data.s_firstname ||
            "",

          s_lastname:
            data.s_lastname ||
            "",

          s_phonenumber:
            data.s_phonenumber ||
            "",

          s_mobilenumber:
            data.s_mobilenumber ||
            "",

          s_email:
            data.s_email ||
            "",

          a_firstname:
            data.a_firstname ||
            "",

          a_lastname:
            data.a_lastname ||
            "",

          a_phonenumber:
            data.a_phonenumber ||
            "",

          a_mobilenumber:
            data.a_mobilenumber ||
            "",

          a_email:
            data.a_email ||
            "",
        });

        setServiceSameAsProject(
          data.s_firstname ===
            data.p_firstname &&
            data.s_lastname ===
              data.p_lastname &&
            data.s_phonenumber ===
              data.p_phonenumber &&
            data.s_mobilenumber ===
              data.p_mobilenumber &&
            data.s_email ===
              data.p_email,
        );

        setAccountsSameAsProject(
          data.a_firstname ===
            data.p_firstname &&
            data.a_lastname ===
              data.p_lastname &&
            data.a_phonenumber ===
              data.p_phonenumber &&
            data.a_mobilenumber ===
              data.p_mobilenumber &&
            data.a_email ===
              data.p_email,
        );
      }
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

    /* ===========================
       SAME AS PROJECT
    =========================== */
    useEffect(() => {
      if (
        !isEditable
      )
        return;

      if (
        serviceSameAsProject
      ) {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            s_firstname:
              prev.p_firstname,

            s_lastname:
              prev.p_lastname,

            s_phonenumber:
              prev.p_phonenumber,

            s_mobilenumber:
              prev.p_mobilenumber,

            s_email:
              prev.p_email,
          }),
        );
      }
    }, [
      serviceSameAsProject,
      formData.p_firstname,
      formData.p_lastname,
      formData.p_phonenumber,
      formData.p_mobilenumber,
      formData.p_email,
      isEditable,
    ]);

    useEffect(() => {
      if (
        !isEditable
      )
        return;

      if (
        accountsSameAsProject
      ) {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            a_firstname:
              prev.p_firstname,

            a_lastname:
              prev.p_lastname,

            a_phonenumber:
              prev.p_phonenumber,

            a_mobilenumber:
              prev.p_mobilenumber,

            a_email:
              prev.p_email,
          }),
        );
      }
    }, [
      accountsSameAsProject,
      formData.p_firstname,
      formData.p_lastname,
      formData.p_phonenumber,
      formData.p_mobilenumber,
      formData.p_email,
      isEditable,
    ]);

    // SUBMIT
    const handleSubmit =
      (e) => {
        e.preventDefault();

        if (
          !isEditable
        )
          return;

        dispatch(
          updateContactDetails(
            {
              subcontractor_id:
                id,
              ...formData,
            },
          ),
        );
      };

    /* ===========================
       HELPERS
    =========================== */
    const getLabel =
      (field) => {
        const map =
          {
            firstname:
              "First Name",

            lastname:
              "Last Name",

            phonenumber:
              "Phone Number",

            mobilenumber:
              "Mobile Number",

            email:
              "Email",
          };

        const key =
          field.split(
            "_",
          )[1];

        return (
          map[key] ||
          field
        );
      };

    const getIcon =
      (field) => {
        if (
          field.includes(
            "email",
          )
        ) {
          return (
            <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />
          );
        }

        if (
          field.includes(
            "phone",
          ) ||
          field.includes(
            "mobile",
          )
        ) {
          return (
            <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />
          );
        }

        return (
          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />
        );
      };

    const inputClass =
      `w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300 ${disabledClass}`;

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    // SECTION COMPONENT
    const renderSection =
      (
        title,
        prefix,
        sameAsState,
        setSameAsState,
      ) => (
        <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
          {/* SECTION HEADER */}
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
             <div className="flex items-center gap-2">
  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-sm">
    <MdGroups className="text-xl" />
  </div>

  <div>
    <h3 className="text-lg font-semibold text-[#1E1B4B] leading-tight">
      {title}
    </h3>
  </div>
</div>

              {/* SAME AS */}
              {prefix !==
                "p" && (
                <label
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                    sameAsState
                      ? "bg-indigo-100 border-indigo-200"
                      : "bg-white border-gray-200"
                  } ${
                    !isEditable
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={
                      sameAsState
                    }
                    disabled={
                      !isEditable
                    }
                    onChange={(
                      e,
                    ) =>
                      isEditable &&
                      setSameAsState(
                        e
                          .target
                          .checked,
                      )
                    }
                    className="w-5 h-5 accent-indigo-600"
                  />

                  <span className="text-sm font-medium text-[#1E1B4B] flex items-center gap-2">
                    <MdCheckCircle className="text-indigo-500" />
                    Same as
                    Project
                    Contact
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* FIELDS */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                `${prefix}_firstname`,
                `${prefix}_lastname`,
                `${prefix}_phonenumber`,
                `${prefix}_mobilenumber`,
                `${prefix}_email`,
              ].map(
                (
                  field,
                ) => (
                  <div
                    key={
                      field
                    }
                    className={
                      field.includes(
                        "email",
                      )
                        ? "xl:col-span-2"
                        : ""
                    }
                  >
                    <label
                      className={
                        labelClass
                      }
                    >
                      {getLabel(
                        field,
                      )}
                    </label>

                    <div className="relative">
                      {getIcon(
                        field,
                      )}

                      <input
                        name={
                          field
                        }
                        value={
                          formData[
                            field
                          ]
                        }
                        onChange={
                          handleChange
                        }
                        disabled={
                          !isEditable ||
                          ((prefix ===
                            "s" &&
                            serviceSameAsProject) ||
                            (prefix ===
                              "a" &&
                              accountsSameAsProject))
                        }
                        className={`${inputClass} pl-12 ${
                          ((prefix ===
                            "s" &&
                            serviceSameAsProject) ||
                            (prefix ===
                              "a" &&
                              accountsSameAsProject))
                            ? "bg-gray-100 cursor-not-allowed"
                            : ""
                        }`}
                        placeholder={`Enter ${getLabel(
                          field,
                        ).toLowerCase()}`}
                      />
                    </div>
                  </div>
                ),
              )}
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
          {/* <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-3xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
              <MdPerson className="text-3xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                Contact
                Details
              </h2>

              <p className="text-gray-500 mt-1">
                Manage project,
                service and
                accounts
                contact
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
            {/* PROJECT */}
            {renderSection(
              "Project Contact",
              "p",
            )}

            {/* SERVICE */}
            {renderSection(
              "Service Contact",
              "s",
              serviceSameAsProject,
              setServiceSameAsProject,
            )}

            {/* ACCOUNTS */}
            {renderSection(
              "Accounts Receivable Contact",
              "a",
              accountsSameAsProject,
              setAccountsSameAsProject,
            )}

            {/* SUBMIT */}
            {isEditable && (
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <MdSave size={20} />
                  Update
                  Contact
                  Details
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  };

export default ContactDetailsForm;