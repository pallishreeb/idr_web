import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Swal from "sweetalert2";

import {
  useNavigate,
} from "react-router-dom";

import {
  BiLockAlt,
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdGroups,
  MdSearch,
} from "react-icons/md";

import {
  fetchIDREmployees,
  deleteEmployee,
} from "../../actions/employeeActions";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

const IDREmployeesPage = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const employees =
    useSelector(
      (state) =>
        state.employee
          .idrEmployees,
    );

  const loading =
    useSelector(
      (state) =>
        state.employee
          .loading,
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

  const [
    searchTerm,
    setSearchTerm,
  ] =
    useState("");

  useEffect(() => {
    dispatch(
      fetchIDREmployees(),
    );
  }, [dispatch]);

  const handleDelete =
    (
      employeeId,
    ) => {
      Swal.fire({
        title:
          "Are you sure?",
        text:
          "The user will be deleted permanently from DB. Do you really want to delete this employee?",
        icon:
          "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, delete it!",
        cancelButtonText:
          "No, keep it",
      }).then(
        (
          result,
        ) => {
          if (
            result.isConfirmed
          ) {
            dispatch(
              deleteEmployee(
                employeeId,
              ),
            );
          }
        },
      );
    };

  const handleEdit =
    (
      employeeId,
    ) => {
      navigate(
        `/idr-employees/${employeeId}`,
      );
    };

  const handleAdd =
    () => {
      navigate(
        "/add-idr-employees",
      );
    };

  const handleSetPassword =
    (
      userId,
    ) => {
      navigate(
        `/set-user-password/${userId}`,
      );
    };

  const filteredEmployees =
    employees?.filter(
      (
        employee,
      ) =>
        `${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase(),
          ) ||
        employee.email_id
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase(),
          ) ||
        employee.user_type
          ?.toLowerCase()
          .includes(
            searchTerm.toLowerCase(),
          ),
    );

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
                    IDR Employees
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage employee accounts, roles and access
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col sm:flex-row gap-3">

                {/* SEARCH */}
                <div className="relative">
                  <MdSearch
                    className="
                      absolute
                      left-4
                      top-1/2
                      -translate-y-1/2
                      text-gray-400
                      text-xl
                    "
                  />

                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={
                      searchTerm
                    }
                    onChange={(
                      e,
                    ) =>
                      setSearchTerm(
                        e.target
                          .value,
                      )
                    }
                    className="
                      w-full
                      sm:w-72
                      pl-11
                      pr-4
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* ADD BUTTON */}
                <button
                  onClick={
                    handleAdd
                  }
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-pink-500
                    text-white
                    font-semibold
                    text-sm
                    shadow-md
                    hover:shadow-lg
                    hover:scale-[1.02]
                    transition-all
                  "
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
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
              <div className="flex flex-col items-center justify-center py-20">

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
                  Loading employees...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50">

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        Employee
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        Job Description
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        Email
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        Contact
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        User Type
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-left
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        Status
                      </th>

                      <th
                        className="
                          px-6
                          py-4
                          text-center
                          text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees?.length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="py-20 text-center"
                        >
                          <div className="flex flex-col items-center">

                            <img
                              src="not-found.png"
                              alt="No Data"
                              className="w-44 h-44 object-contain opacity-80"
                            />

                            <h3 className="text-lg font-semibold text-[#1E1B4B] mt-4">
                              No Employees Found
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                              Try changing your search keywords
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredEmployees?.map(
                        (
                          employee,
                        ) => (
                          <tr
                            key={
                              employee.user_id
                            }
                            className="
                              hover:bg-indigo-50/40
                              transition-all
                            "
                          >
                            {/* NAME */}
                            <td className="px-6 py-4 border-b">
                              <div>
                                <p className="text-sm font-semibold text-[#1E1B4B]">
                                  {
                                    employee.first_name
                                  }{" "}
                                  {
                                    employee.last_name
                                  }
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  IDR Employee
                                </p>
                              </div>
                            </td>

                            {/* JOB */}
                            <td className="px-6 py-4 border-b text-sm text-gray-700">
                              {employee?.job_desc ||
                                "NA"}
                            </td>

                            {/* EMAIL */}
                            <td className="px-6 py-4 border-b text-sm text-gray-700">
                              {
                                employee.email_id
                              }
                            </td>

                            {/* CONTACT */}
                            <td className="px-6 py-4 border-b text-sm text-gray-700">
                              {
                                employee.contact_number
                              }
                            </td>

                            {/* TYPE */}
                            <td className="px-6 py-4 border-b">
                              <span
                                className="
                                  inline-flex
                                  items-center
                                  px-3
                                  py-1
                                  rounded-full
                                  bg-indigo-50
                                  text-indigo-700
                                  text-xs
                                  font-semibold
                                "
                              >
                                {
                                  employee.user_type
                                }
                              </span>
                            </td>

                            {/* ACTIVE */}
                            <td className="px-6 py-4 border-b">
                              <span
                                className={`
                                  inline-flex
                                  items-center
                                  px-3
                                  py-1
                                  rounded-full
                                  text-xs
                                  font-semibold
                                  ${
                                    employee.is_active
                                      ? "bg-green-50 text-green-700"
                                      : "bg-red-50 text-red-700"
                                  }
                                `}
                              >
                                {employee.is_active
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            {/* ACTIONS */}
                            <td className="px-6 py-4 border-b">
                              <div className="flex justify-center gap-2">

                                {/* EDIT */}
                                <button
                                  onClick={() =>
                                    handleEdit(
                                      employee.idr_emp_id,
                                    )
                                  }
                                  className="
                                    w-10
                                    h-10
                                    rounded-2xl
                                    bg-blue-50
                                    text-blue-600
                                    flex
                                    items-center
                                    justify-center
                                    hover:bg-blue-100
                                    transition-all
                                  "
                                >
                                  <BiSolidEditAlt className="text-lg" />
                                </button>

                                {/* PASSWORD */}
                                {user_type ===
                                  "Admin" && (
                                  <button
                                    className="
                                      w-10
                                      h-10
                                      rounded-2xl
                                      bg-yellow-50
                                      text-yellow-700
                                      flex
                                      items-center
                                      justify-center
                                      hover:bg-yellow-100
                                      transition-all
                                    "
                                    onClick={() =>
                                      handleSetPassword(
                                        employee.user_id,
                                      )
                                    }
                                  >
                                    <BiLockAlt className="text-lg" />
                                  </button>
                                )}

                                {/* DELETE */}
                                {user_type ===
                                  "Admin" && (
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        employee.idr_emp_id,
                                      )
                                    }
                                    className="
                                      w-10
                                      h-10
                                      rounded-2xl
                                      bg-red-50
                                      text-red-600
                                      flex
                                      items-center
                                      justify-center
                                      hover:bg-red-100
                                      transition-all
                                    "
                                  >
                                    <AiFillDelete className="text-lg" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ),
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default IDREmployeesPage;