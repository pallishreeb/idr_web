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
  MdVerified,
  MdAssignmentTurnedIn,
  MdWarningAmber,
  MdSave,
  MdPerson,
} from "react-icons/md";

import {
  changeSubcontractorStatus,
} from "../../actions/subContractorAction";

const statusOptions =
  [
    "Active",
    "In Progress",
    "Re-Opened",
    "In Review",
  ];

const ChangeStatusForm =
  ({
    id,
    data,
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

    const [
      formData,
      setFormData,
    ] = useState({
      contract_status:
        "",

      reject_reason:
        "",

      created_by:
        "",
    });

    const [
      loading,
      setLoading,
    ] =
      useState(false);

    useEffect(() => {
      if (
        data?.contract_status
      ) {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            contract_status:
              data.contract_status,
          }),
        );
      }
    }, [data]);

    /* ===============================
       HANDLE CHANGE
    =============================== */

    const handleChange =
      (e) => {
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

    /* ===============================
       ADMIN SUBMIT
    =============================== */

    const handleSubmit =
      async (
        e,
      ) => {
        e.preventDefault();

        if (
          formData.contract_status ===
          "Re-Opened"
        ) {
          if (
            !formData.reject_reason.trim()
          ) {
            alert(
              "Reject reason is required when Re-Opened",
            );

            return;
          }

          if (
            !formData.created_by.trim()
          ) {
            alert(
              "Created by is required when Re-Opened",
            );

            return;
          }
        }

        try {
          setLoading(
            true,
          );

          await dispatch(
            changeSubcontractorStatus(
              {
                subcontractor_id:
                  id,

                contract_status:
                  formData.contract_status,

                reject_reason:
                  formData.contract_status ===
                  "Re-Opened"
                    ? formData.reject_reason.trim()
                    : "",

                created_by:
                  formData.contract_status ===
                  "Re-Opened"
                    ? formData.created_by.trim()
                    : "",
              },
            ),
          );

          if (
            formData.contract_status !==
            "Re-Opened"
          ) {
            setFormData(
              (
                prev,
              ) => ({
                ...prev,

                reject_reason:
                  "",

                created_by:
                  "",
              }),
            );
          }
        } finally {
          setLoading(
            false,
          );
        }
      };

    /* ===============================
       SUBCONTRACTOR REVIEW
    =============================== */

    const handleSubmitForReview =
      async () => {
        try {
          setLoading(
            true,
          );

          await dispatch(
            changeSubcontractorStatus(
              {
                subcontractor_id:
                  id,

                contract_status:
                  "In Review",

                reject_reason:
                  "",

                created_by:
                  "",
              },
            ),
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    // COMMON STYLES
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    // STATUS BADGE
    const getStatusStyle =
      (
        status,
      ) => {
        switch (
          status
        ) {
          case "Active":
            return "bg-green-100 text-green-700 border border-green-200";

          case "In Progress":
            return "bg-yellow-100 text-yellow-700 border border-yellow-200";

          case "Re-Opened":
            return "bg-red-100 text-red-700 border border-red-200";

          case "In Review":
            return "bg-blue-100 text-blue-700 border border-blue-200";

          default:
            return "bg-gray-100 text-gray-700 border border-gray-200";
        }
      };

    return (
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8">
          {/* HEADER */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <MdVerified className="text-3xl" />
            </div>

            <div>
              {/* SMALL TITLE */}
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
                Contract Status
              </h2>

              <p className="text-gray-500 mt-1 text-sm">
                Update and
                manage
                subcontractor
                approval status
              </p>
            </div>
          </div>

          {/* ===============================
             SUBCONTRACTOR VIEW
          =============================== */}

          {user_type ===
          "Subcontractor" ? (
            <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-[28px] p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm font-semibold ${getStatusStyle(
                        data?.contract_status,
                      )}`}
                    >
                      {
                        data?.contract_status
                      }
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-[#1E1B4B]">
                    Submit For
                    Review
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    Submit your
                    subcontractor
                    profile for
                    admin review
                    and approval.
                  </p>
                </div>

                <button
                  onClick={
                    handleSubmitForReview
                  }
                  disabled={
                    loading ||
                    data?.contract_status?.toLowerCase() ===
                      "in review"
                  }
                  className={`flex items-center justify-center gap-3 px-8 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
                    loading ||
                    data?.contract_status?.toLowerCase() ===
                      "in review"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-xl hover:scale-[1.02]"
                  }`}
                >
                  <MdAssignmentTurnedIn className="text-xl" />

                  {loading
                    ? "Submitting..."
                    : "Submit For Review"}
                </button>
              </div>
            </div>
          ) : (
            /* ===============================
               ADMIN FORM
            =============================== */

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-8"
            >
              {/* STATUS CARD */}
              <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-pink-50">
                  {/* SMALL TITLE */}
                  <h3 className="text-lg font-semibold text-[#1E1B4B]">
                    Status
                    Information
                  </h3>
                </div>

                <div className="p-6">
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Contract
                      Status
                    </label>

                    <select
                      name="contract_status"
                      value={
                        formData.contract_status
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                      required
                    >
                      <option value="">
                        Select
                        Status
                      </option>

                      {statusOptions.map(
                        (
                          status,
                        ) => (
                          <option
                            key={
                              status
                            }
                            value={
                              status
                            }
                          >
                            {
                              status
                            }
                          </option>
                        ),
                      )}
                    </select>

                    {/* BADGE */}
                    {formData.contract_status && (
                      <div className="mt-4">
                        <span
                          className={`inline-flex px-4 py-2 rounded-2xl text-sm font-semibold ${getStatusStyle(
                            formData.contract_status,
                          )}`}
                        >
                          {
                            formData.contract_status
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* REOPENED SECTION */}
              {formData.contract_status ===
                "Re-Opened" && (
                <div className="bg-white rounded-[28px] border border-red-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                    <div className="flex items-center gap-3">
                      <MdWarningAmber className="text-red-500 text-2xl" />

                      {/* SMALL TITLE */}
                      <h3 className="text-lg font-semibold text-[#1E1B4B]">
                        Re-Open
                        Details
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* REASON */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Reject
                        Reason
                      </label>

                      <textarea
                        name="reject_reason"
                        value={
                          formData.reject_reason
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} min-h-[120px]`}
                        placeholder="Enter reason for reopening..."
                      />
                    </div>

                    {/* CREATED BY */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Created
                        By
                      </label>

                      <div className="relative">
                        <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          name="created_by"
                          value={
                            formData.created_by
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12`}
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-xl hover:scale-[1.02]"
                  }`}
                >
                  <MdSave className="text-xl" />

                  {loading
                    ? "Updating..."
                    : "Update Status"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

export default ChangeStatusForm;