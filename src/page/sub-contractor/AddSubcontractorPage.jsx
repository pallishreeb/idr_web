/** @format */

import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useNavigate,
} from "react-router-dom";

import {
  MdBusiness,
  MdPerson,
  MdEmail,
  MdSave,
  MdArrowBack,
  MdHandshake,
} from "react-icons/md";

import {
  registerSubcontractor,
} from "../../actions/subContractorAction";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const AddSubcontractorPage =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const {
      loading,
    } =
      useSelector(
        (
          state,
        ) =>
          state.subcontractor,
      );

    // FORM STATE
    const [
      formData,
      setFormData,
    ] = useState({
      b_firstname:
        "",
      b_lastname:
        "",
      b_email:
        "",
    });

    // HANDLE CHANGE
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

    // SUBMIT
    const handleSubmit =
      async (
        e,
      ) => {
        e.preventDefault();

        const cleanedData =
          {
            b_firstname:
              formData.b_firstname.trim(),

            b_lastname:
              formData.b_lastname.trim(),

            b_email:
              formData.b_email.trim(),
          };

        try {
          await dispatch(
            registerSubcontractor(
              cleanedData,
            ),
          );

          // RESET
          setFormData({
            b_firstname:
              "",

            b_lastname:
              "",

            b_email:
              "",
          });

          navigate(
            "/sub-contractors",
          );
        } catch (
          error
        ) {
          console.error(
            "Registration failed:",
            error.message,
          );
        }
      };

    // COMMON STYLES
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    return (
      <>
        <Header />

        <div className="flex">
          <AdminSideNavbar />

          <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-4 md:p-8">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                  Register
                  Subcontractor
                </h1>

                <p className="text-gray-500 mt-1">
                  Create a new
                  subcontractor
                  account and
                  onboarding
                  profile
                </p>
              </div>

              {/* SUMMARY CARD */}
              <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 px-6 py-4 min-w-[220px]">
                <p className="text-sm text-gray-500 mb-1">
                  Registration
                </p>

                <h2 className="text-2xl font-bold text-[#1E1B4B]">
                  New Vendor
                </h2>
              </div>
            </div>

            {/* MAIN FORM CARD */}
            <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-6 md:p-10">
                {/* FORM HEADER */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-16 h-16 rounded-3xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
                    <MdHandshake className="text-3xl" />
                  </div>

                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#1E1B4B]">
                      Subcontractor
                      Information
                    </h2>

                    <p className="text-gray-500 mt-1">
                      Enter basic
                      details to
                      register a
                      new
                      subcontractor
                    </p>
                  </div>
                </div>

                {/* FORM */}
                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-8"
                >
                  {/* PERSONAL DETAILS */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Personal
                        Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* FIRST NAME */}
                      <div>
                        <label
                          htmlFor="b_firstname"
                          className={
                            labelClass
                          }
                        >
                          First
                          Name
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="b_firstname"
                            id="b_firstname"
                            value={
                              formData.b_firstname
                            }
                            onChange={
                              handleChange
                            }
                            className={`${inputClass} pl-12`}
                            placeholder="Enter first name"
                            required
                          />
                        </div>
                      </div>

                      {/* LAST NAME */}
                      <div>
                        <label
                          htmlFor="b_lastname"
                          className={
                            labelClass
                          }
                        >
                          Last
                          Name
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="b_lastname"
                            id="b_lastname"
                            value={
                              formData.b_lastname
                            }
                            onChange={
                              handleChange
                            }
                            className={`${inputClass} pl-12`}
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EMAIL SECTION */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Account
                        Information
                      </h3>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
                        htmlFor="b_email"
                        className={
                          labelClass
                        }
                      >
                        Email
                        Address
                      </label>

                      <div className="relative">
                        <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="email"
                          name="b_email"
                          id="b_email"
                          value={
                            formData.b_email
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12`}
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <p className="text-sm text-gray-500 mt-2">
                        This email
                        will be
                        used for
                        subcontractor
                        login and
                        communication.
                      </p>
                    </div>
                  </div>

                  {/* INFO CARD */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                        <MdBusiness className="text-2xl" />
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#1E1B4B] mb-1">
                          Next Step
                        </h4>

                        <p className="text-sm text-gray-600 leading-relaxed">
                          After
                          registration,
                          the
                          subcontractor
                          can complete
                          their
                          business
                          profile,
                          upload
                          documents,
                          add
                          technicians,
                          and update
                          service
                          coverage
                          areas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                    {/* CANCEL */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/sub-contractors",
                        )
                      }
                      className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      <MdArrowBack size={20} />
                      Cancel
                    </button>

                    {/* SUBMIT */}
                    <button
                      type="submit"
                      disabled={
                        loading
                      }
                      className={`flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] hover:shadow-xl hover:scale-[1.02]"
                      }`}
                    >
                      <MdSave size={20} />

                      {loading
                        ? "Registering..."
                        : "Register Subcontractor"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default AddSubcontractorPage;