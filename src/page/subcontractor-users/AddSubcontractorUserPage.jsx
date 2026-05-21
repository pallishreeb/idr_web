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
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  MdPersonAdd,
  MdBusiness,
  MdPerson,
  MdEmail,
  MdPhone,
  MdCheckCircle,
  MdArrowBack,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  addSubcontractorUser,
} from "../../actions/subContractorAction";

const AddSubcontractorUserPage =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const {
      subcontractorId,
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

    const {
      user_type,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
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
        subcontractor_id:
          subcontractorId,

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
      });

    /* ===========================
       AUTO FILL COMPANY
    =========================== */

    useEffect(() => {
      const selectedSub =
        subcontractors?.find(
          (
            sub,
          ) =>
            String(
              sub.subcontractor_id,
            ) ===
            String(
              subcontractorId,
            ),
        );

      if (
        selectedSub
      ) {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            subcontractor_company:
              selectedSub.subcontractor_name,
          }),
        );
      }
    }, [
      subcontractorId,
      subcontractors,
    ]);

    /* ===========================
       AUTO SET DEFAULT
    =========================== */

    useEffect(() => {
      if (
        !subcontractors?.length
      )
        return;

      const selectedSub =
        subcontractors.find(
          (
            sub,
          ) =>
            String(
              sub.subcontractor_id,
            ) ===
            String(
              subcontractorId,
            ),
        );

      if (
        selectedSub
      ) {
        setFormData(
          (
            prev,
          ) => ({
            ...prev,

            subcontractor_id:
              selectedSub.subcontractor_id,

            subcontractor_company:
              selectedSub.subcontractor_name,
          }),
        );
      }
    }, [
      subcontractorId,
      subcontractors,
    ]);

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
       SUBMIT
    =========================== */

    const handleSubmit =
      async (
        e,
      ) => {
        e.preventDefault();

        const payload =
          {
            ...formData,

            email_id:
              formData.email_id.trim(),

            mobile:
              formData.mobile.trim(),

            first_name:
              formData.first_name.trim(),

            last_name:
              formData.last_name.trim(),
          };

        await dispatch(
          addSubcontractorUser(
            payload,
            navigate,
          ),
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
                <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

                <div className="p-6 md:p-8">
                  {/* HEADER */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
                      <MdPersonAdd className="text-3xl" />
                    </div>

                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-[#1E1B4B]">
                        Add
                        Subcontractor
                        User
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Create and
                        assign a
                        new
                        subcontractor
                        user
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
                            formData.subcontractor_id ||
                            ""
                          }
                          onChange={
                            handleSubcontractorChange
                          }
                          className={
                            inputClass
                          }
                          required
                          disabled={
                            user_type ===
                            "Subcontractor"
                          }
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
                      {/* FIRST */}
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

                      {/* LAST */}
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
                          name="email_id"
                          value={
                            formData.email_id
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
                            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-xl hover:scale-[1.02]"
                        }`}
                      >
                        <MdPersonAdd className="text-lg" />

                        {loading
                          ? "Creating..."
                          : "Create User"}
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

export default AddSubcontractorUserPage;