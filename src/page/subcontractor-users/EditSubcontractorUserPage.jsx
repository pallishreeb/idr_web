/** @format */

import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MdEdit,
  MdBusiness,
  MdPerson,
  MdEmail,
  MdPhone,
  MdNotes,
  MdCheckCircle,
  MdArrowBack,
  MdSave,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getSubcontractorUserById,
  updateSubcontractorUser,
  getSubcontractorLists,
} from "../../actions/subContractorAction";

const EditSubcontractorUserPage =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const {
      userId,
    } = useParams();

    const subcontractors =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .subcontractors,
      );

    const userDetails =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .subcontractorUser,
      );

    const loading =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .loadingUsers,
      );

    const [
      formData,
      setFormData,
    ] =
      useState({
        subcontractor_user_id:
          "",

        subcontractor_id:
          "",

        subcontractor_company:
          "",

        email_id:
          "",

        mobile: "",

        first_name:
          "",

        last_name:
          "",

        is_active:
          true,

        internal_note:
          "",
      });

    /* ===========================
       LOAD DATA
    =========================== */

    useEffect(() => {
      dispatch(
        getSubcontractorLists(),
      );

      dispatch(
        getSubcontractorUserById(
          userId,
        ),
      );
    }, [
      dispatch,
      userId,
    ]);

    /* ===========================
       PREFILL
    =========================== */

    useEffect(() => {
      if (
        !userDetails
      )
        return;

      const selectedSub =
        subcontractors?.find(
          (
            sub,
          ) =>
            String(
              sub.subcontractor_id,
            ) ===
            String(
              userDetails.subcontractor_id,
            ),
        );

      setFormData({
        subcontractor_user_id:
          userDetails.subcontractor_user_id,

        subcontractor_id:
          userDetails.subcontractor_id,

        subcontractor_company:
          selectedSub?.subcontractor_name ||
          "",

        email_id:
          userDetails.email_id ||
          "",

        mobile:
          userDetails.mobile ||
          "",

        first_name:
          userDetails.first_name ||
          "",

        last_name:
          userDetails.last_name ||
          "",

        is_active:
          userDetails.is_active ??
          true,

        internal_note:
          userDetails.internal_note ||
          "",
      });
    }, [
      userDetails,
      subcontractors,
    ]);

    /* ===========================
       HANDLE CHANGE
    =========================== */

    const handleChange =
      (e) => {
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

    /* ===========================
       HANDLE SUB CHANGE
    =========================== */

    const handleSubcontractorChange =
      (
        e,
      ) => {
        const selectedId =
          e.target.value;

        const selectedSub =
          subcontractors.find(
            (
              sub,
            ) =>
              String(
                sub.subcontractor_id,
              ) ===
              String(
                selectedId,
              ),
          );

        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            subcontractor_id:
              selectedId,

            subcontractor_company:
              selectedSub?.subcontractor_name ||
              "",
          }),
        );
      };

    /* ===========================
       SUBMIT
    =========================== */

    const handleSubmit =
      async (
        e,
      ) => {
        e.preventDefault();

        const payload =
          {
            subcontractor_user_id:
              formData.subcontractor_user_id,

            mobile:
              formData.mobile.trim(),

            first_name:
              formData.first_name.trim(),

            last_name:
              formData.last_name.trim(),

            is_active:
              formData.is_active,

            internal_note:
              formData.internal_note.trim(),
          };

        await dispatch(
          updateSubcontractorUser(
            payload,
          ),
        );

        navigate(
          -1,
        );
      };

    // COMMON INPUT STYLE
    const inputClass =
      "w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    return (
      <>
        <Header />

        <div className="flex bg-gray-50 min-h-screen">
          <AdminSideNavbar />

          <div className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">
              {/* CARD */}
              <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
                {/* TOP BAR */}
                <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

                <div className="p-6 md:p-8">
                  {/* HEADER */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-3xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
                      <MdEdit className="text-3xl" />
                    </div>

                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-[#1E1B4B]">
                        Edit
                        Subcontractor
                        User
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Update user
                        information
                        and account
                        details
                      </p>
                    </div>
                  </div>

                  {/* FORM */}
                  <form
                    onSubmit={
                      handleSubmit
                    }
                    className="space-y-6"
                  >
                    {/* SUBCONTRACTOR */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Subcontractor
                      </label>

                      <div className="relative">
                        <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          value={
                            formData.subcontractor_id
                          }
                          onChange={
                            handleSubcontractorChange
                          }
                          className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                          required
                          disabled
                        >
                          <option value="">
                            Select
                            Subcontractor
                          </option>

                          {subcontractors?.map(
                            (
                              sub,
                            ) => (
                              <option
                                key={
                                  sub.subcontractor_id
                                }
                                value={
                                  sub.subcontractor_id
                                }
                              >
                                {
                                  sub.subcontractor_name
                                }
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>

                    {/* NAME ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* FIRST NAME */}
                      <div>
                        <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                          First
                          Name
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="first_name"
                            value={
                              formData.first_name
                            }
                            onChange={
                              handleChange
                            }
                            className={
                              inputClass
                            }
                            required
                          />
                        </div>
                      </div>

                      {/* LAST NAME */}
                      <div>
                        <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                          Last
                          Name
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="last_name"
                            value={
                              formData.last_name
                            }
                            onChange={
                              handleChange
                            }
                            className={
                              inputClass
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Email
                      </label>

                      <div className="relative">
                        <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="email"
                          value={
                            formData.email_id
                          }
                          disabled
                          className={`${inputClass} bg-gray-100 cursor-not-allowed`}
                        />
                      </div>
                    </div>

                    {/* MOBILE */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Mobile
                      </label>

                      <div className="relative">
                        <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          name="mobile"
                          value={
                            formData.mobile
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* NOTE */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Internal
                        Note
                      </label>

                      <div className="relative">
                        <MdNotes className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <textarea
                          name="internal_note"
                          value={
                            formData.internal_note
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} min-h-[120px] pt-3`}
                          rows="4"
                          placeholder="Add internal notes..."
                        />
                      </div>
                    </div>

                    {/* ACTIVE */}
                    <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-2xl p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={
                            formData.is_active
                          }
                          onChange={
                            handleChange
                          }
                          className="w-5 h-5 accent-indigo-600"
                        />

                        <div className="flex items-center gap-2">
                          <MdCheckCircle className="text-green-500 text-lg" />

                          <span className="text-sm font-medium text-[#1E1B4B]">
                            Active
                            User
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/sub-contractors-users",
                            {
                              state:
                                {
                                  selectedSubcontractor:
                                    formData.subcontractor_id,
                                },
                            },
                          )
                        }
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-300"
                      >
                        <MdArrowBack className="text-lg" />
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={
                          loading
                        }
                        className={`flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] hover:shadow-xl hover:scale-[1.02]"
                        }`}
                      >
                        <MdSave className="text-lg" />

                        {loading
                          ? "Updating..."
                          : "Update User"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default EditSubcontractorUserPage;