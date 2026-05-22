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
  MdGroups,
  MdSave,
  MdArrowBack,
} from "react-icons/md";

import {
  createIDREmployee,
} from "../../actions/employeeActions";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

const AddIDREmployeePage = () => {
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
        state.employee,
    );

  const [
    formData,
    setFormData,
  ] =
    useState({
      first_name:
        "",
      last_name:
        "",
      email_id:
        "",
      job_desc:
        "",
      contact_number:
        "",
      user_type:
        "",
      is_active: true,
    });

  const handleChange =
    (e) => {
      const {
        name,
        value,
      } =
        e.target;

      setFormData({
        ...formData,
        [name]:
          value,
      });
    };

  const handleSubmit =
    (e) => {
      e.preventDefault();

      dispatch(
        createIDREmployee(
          formData,
        ),
      );

      setFormData({
        first_name:
          "",
        last_name:
          "",
        email_id:
          "",
        job_desc:
          "",
        contact_number:
          "",
        user_type:
          "",
        is_active: true,
      });
    };

  const inputClass =
    `
      w-full
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-4
      py-3
      text-sm
      text-gray-700
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      transition-all
    `;

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div
          className="
            flex-1
            p-4
            md:p-6
            overflow-x-hidden
          "
        >
          {/* PAGE HEADER */}
          <div
            className="
              bg-white
              rounded-[28px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-6
            "
          >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-5 md:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <div
                  className="
                    w-14
                    h-14
                    rounded-3xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-lg
                  "
                >
                  <MdGroups className="text-3xl" />
                </div>

                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
                    Add IDR Employee
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Create and manage new employee accounts
                  </p>
                </div>
              </div>

              {/* BACK BUTTON */}
              <button
                onClick={() =>
                  navigate(
                    "/idr-employees",
                  )
                }
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  font-medium
                  hover:bg-gray-50
                  transition-all
                "
              >
                <MdArrowBack className="text-xl" />
                Back
              </button>
            </div>
          </div>

          {/* FORM CARD */}
          <div
            className="
              bg-white
              rounded-[28px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* LOADING */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">

                <div
                  className="
                    w-14
                    h-14
                    border-4
                    border-indigo-200
                    border-t-indigo-600
                    rounded-full
                    animate-spin
                    mb-5
                  "
                />

                <p className="text-gray-500 font-medium">
                  Creating employee...
                </p>
              </div>
            ) : (
              <form
                onSubmit={
                  handleSubmit
                }
                className="p-5 md:p-7"
              >
                {/* SECTION TITLE */}
                <div className="mb-7">
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Employee Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enter employee profile, role and contact details
                  </p>
                </div>

                {/* FORM GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* FIRST NAME */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      First Name
                    </label>

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

                  {/* LAST NAME */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Last Name
                    </label>

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

                  {/* EMAIL */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Email Address
                    </label>

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

                  {/* CONTACT */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Contact Number
                    </label>

                    <input
                      type="text"
                      name="contact_number"
                      value={
                        formData.contact_number
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

                  {/* USER TYPE */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      User Type
                    </label>

                    <select
                      name="user_type"
                      value={
                        formData.user_type
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
                        Select User Type
                      </option>

                      <option value="Admin">
                        Admin
                      </option>

                      <option value="Subadmin">
                        Subadmin
                      </option>

                      <option value="IDR Employee">
                        IDR Employee
                      </option>

                      <option value="Laborer">
                        Laborer
                      </option>
                    </select>
                  </div>

                  {/* ACTIVE */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Employee Status
                    </label>

                    <select
                      name="is_active"
                      value={
                        formData.is_active
                      }
                      onChange={
                        handleChange
                      }
                      className={
                        inputClass
                      }
                    >
                      <option value={true}>
                        Active
                      </option>

                      <option value={false}>
                        Inactive
                      </option>
                    </select>
                  </div>

                  {/* JOB DESCRIPTION */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Job Description
                    </label>

                    <textarea
                      rows={5}
                      name="job_desc"
                      value={
                        formData.job_desc
                      }
                      onChange={
                        handleChange
                      }
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-4
                        text-sm
                        text-gray-700
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                        transition-all
                      "
                      placeholder="Enter employee role, responsibilities or additional information..."
                    />
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">

                  {/* CANCEL */}
                  <button
                    type="button"
                    className="
                      px-5
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      text-gray-700
                      font-medium
                      hover:bg-gray-50
                      transition-all
                    "
                    onClick={() =>
                      navigate(
                        "/idr-employees",
                      )
                    }
                  >
                    Cancel
                  </button>

                  {/* SAVE */}
                  <button
                    type="submit"
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      px-6
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-pink-500
                      text-white
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                    "
                  >
                    <MdSave className="text-xl" />

                    {loading
                      ? "Saving..."
                      : "Save Employee"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddIDREmployeePage;