/** @format */

import React, {
  useEffect,
  useState,
} from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  useNavigate,
  Link,
  useLocation,
} from "react-router-dom";

import Swal from "sweetalert2";

import {
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdGroups,
  MdBusiness,
  MdPersonAdd,
  MdCheckCircle,
  MdCancel,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getSubcontractorLists,
  getSubcontractorUsersById,
  deleteSubcontractorUser,
} from "../../actions/subContractorAction";

const SubcontractorUsersPage =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const location =
      useLocation();

    const subcontractors =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .subcontractors,
      );

    const loadingSubs =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .loading,
      );

    const users =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .subcontractorUsers,
      );

    const loadingUsers =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .loadingUsers,
      );

    const {
      user_type,
      subcontractor_id,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
      );

    const [
      selectedSubcontractor,
      setSelectedSubcontractor,
    ] =
      useState(
        user_type ===
          "Subcontractor"
          ? subcontractor_id
          : location
              .state
              ?.selectedSubcontractor ||
              "",
      );

    /* ===========================
       LOAD SUBCONTRACTORS
    =========================== */

    useEffect(() => {
      dispatch(
        getSubcontractorLists(),
      );
    }, [
      dispatch,
    ]);

    useEffect(() => {
      if (
        location
          .state
          ?.selectedSubcontractor
      ) {
        setSelectedSubcontractor(
          location
            .state
            .selectedSubcontractor,
        );
      }
    }, [
      location.state,
    ]);

    useEffect(() => {
      if (
        user_type ===
          "Subcontractor" &&
        subcontractor_id
      ) {
        setSelectedSubcontractor(
          subcontractor_id,
        );
      }
    }, [
      user_type,
      subcontractor_id,
    ]);

    /* ===========================
       FETCH USERS
    =========================== */

    useEffect(() => {
      if (
        selectedSubcontractor
      ) {
        dispatch(
          getSubcontractorUsersById(
            selectedSubcontractor,
          ),
        );
      }
    }, [
      dispatch,
      selectedSubcontractor,
    ]);

    /* ===========================
       HANDLERS
    =========================== */

    const handleSubChange =
      (
        id,
      ) => {
        setSelectedSubcontractor(
          id,
        );
      };

    const handleDeleteUser =
      (
        userId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",

          text: "Do you really want to delete this user?",

          icon: "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, delete it!",

          cancelButtonText:
            "Cancel",
        }).then(
          (
            result,
          ) => {
            if (
              result.isConfirmed
            ) {
              dispatch(
                deleteSubcontractorUser(
                  userId,
                ),
              );
            }
          },
        );
      };

    const handleEdit =
      (
        userId,
      ) => {
        navigate(
          `/edit-subcontractor-user/${userId}`,
          {
            state:
              {
                selectedSubcontractor,
              },
          },
        );
      };

    return (
      <>
        <Header />

        <div className="flex bg-gray-50 min-h-screen">
          <AdminSideNavbar />

          <div className="flex-1 p-4 md:p-6 lg:p-8">
            {/* MAIN CARD */}
            <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-5 md:p-7">
                {/* HEADER */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                      <MdGroups className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                        Subcontractor
                        Users
                      </h2>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Manage
                        subcontractor
                        user accounts
                      </p>
                    </div>
                  </div>

                  {/* ADD BUTTON */}
                  {selectedSubcontractor && (
                    <Link
                      to={`/create-sub-contractor-user/${selectedSubcontractor}`}
                      state={{
                        selectedSubcontractor,
                      }}
                    >
                      <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                        <MdPersonAdd className="text-lg" />
                        Add User
                      </button>
                    </Link>
                  )}
                </div>

                {/* FILTER */}
                <div className="mb-7">
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select
                    Subcontractor
                  </label>

                  <div className="relative">
                    <MdBusiness className="absolute top-3.5 left-4 text-indigo-400 text-lg" />

                    <select
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                      value={
                        selectedSubcontractor
                      }
                      onChange={(
                        e,
                      ) =>
                        handleSubChange(
                          e
                            .target
                            .value,
                        )
                      }
                      disabled={
                        user_type ===
                        "Subcontractor"
                      }
                    >
                      <option value="">
                        Select a
                        subcontractor
                      </option>

                      {loadingSubs ? (
                        <option disabled>
                          Loading...
                        </option>
                      ) : (
                        subcontractors?.map(
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
                        )
                      )}
                    </select>
                  </div>
                </div>

                {/* TABLE */}
                {selectedSubcontractor && (
                  <>
                    {loadingUsers ? (
                      <div className="flex flex-col items-center justify-center py-14">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />

                        <p className="text-sm text-gray-500">
                          Loading
                          users...
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-gray-100">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-indigo-50 to-pink-50">
                              <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                                Name
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                                Email
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                                Contact
                              </th>

                              <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                                Status
                              </th>

                              <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B] w-[140px]">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {users?.length ===
                            0 ? (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="py-14 text-center"
                                >
                                  <div className="flex flex-col items-center justify-center">
                                    <MdGroups className="text-5xl text-gray-300 mb-4" />

                                    <h3 className="text-lg font-semibold text-[#1E1B4B]">
                                      No Users
                                      Found
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                      No
                                      subcontractor
                                      users are
                                      available
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              users
                                ?.slice()
                                .sort(
                                  (
                                    a,
                                    b,
                                  ) =>
                                    (
                                      a?.first_name ||
                                      ""
                                    )
                                      .toLowerCase()
                                      .localeCompare(
                                        (
                                          b?.first_name ||
                                          ""
                                        ).toLowerCase(),
                                      ),
                                )
                                .map(
                                  (
                                    userItem,
                                  ) => (
                                    <tr
                                      key={
                                        userItem.subcontractor_user_id
                                      }
                                      className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                                    >
                                      {/* NAME */}
                                      <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                          {/* <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                            <MdGroups className="text-indigo-500 text-lg" />
                                          </div> */}

                                          <div>
                                            <p className="text-sm font-semibold text-[#1E1B4B]">
                                              {
                                                userItem.first_name
                                              }{" "}
                                              {
                                                userItem.last_name
                                              }
                                            </p>

                                            <p className="text-xs text-gray-500">
                                              {userItem.user_type}
                                            </p>
                                          </div>
                                        </div>
                                      </td>

                                      {/* EMAIL */}
                                      <td className="px-5 py-4 text-sm text-gray-700">
                                        <div className="max-w-[240px] break-all">
                                          {
                                            userItem.email_id
                                          }
                                        </div>
                                      </td>

                                      {/* CONTACT */}
                                      <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                                        {userItem.mobile ||
                                          "NA"}
                                      </td>

                                      {/* STATUS */}
                                      <td className="px-5 py-4">
                                        <span
                                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold ${
                                            userItem.is_active
                                              ? "bg-green-100 text-green-700"
                                              : "bg-red-100 text-red-700"
                                          }`}
                                        >
                                          {userItem.is_active ? (
                                            <MdCheckCircle className="text-sm" />
                                          ) : (
                                            <MdCancel className="text-sm" />
                                          )}

                                          {userItem.is_active
                                            ? "Active"
                                            : "Inactive"}
                                        </span>
                                      </td>

                                      {/* ACTIONS */}
                                      <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                          <button
                                            onClick={() =>
                                              handleEdit(
                                                userItem.subcontractor_user_id,
                                              )
                                            }
                                            className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-all duration-300"
                                          >
                                            <BiSolidEditAlt className="text-lg" />
                                          </button>

                                          {user_type ===
                                            "Admin" && (
                                            <button
                                              onClick={() =>
                                                handleDeleteUser(
                                                  userItem.subcontractor_user_id,
                                                )
                                              }
                                              className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all duration-300"
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
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default SubcontractorUsersPage;