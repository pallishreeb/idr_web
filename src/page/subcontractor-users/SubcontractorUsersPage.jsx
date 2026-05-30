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
  MdPerson,
  MdEmail,
  MdPhone,
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

    const [
      selectedSubcontractor,
      setSelectedSubcontractor,
    ] =
      useState(
        location
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

  <div className="flex bg-gray-50 min-h-screen pt-[80px]">
    <AdminSideNavbar />

    <div className="flex-1 p-4 md:p-5 lg:p-6 overflow-hidden">
            {/* MAIN CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-6 md:p-8">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
                      <MdGroups className="text-3xl" />
                    </div>

                    <div>
                      <h2 className="text-xl md:text-2xl font-semibold text-[#1E1B4B]">
                        Subcontractor
                        Users
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
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
                      <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <MdPersonAdd className="text-lg" />
                        Add User
                      </button>
                    </Link>
                  )}
                </div>

                {/* FILTER */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select
                    Subcontractor
                  </label>

                  <div className="relative">
                    <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <select
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
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

                {/* USERS */}
                {selectedSubcontractor && (
                  <>
                    {loadingUsers ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />

                        <p className="text-sm text-gray-500">
                          Loading
                          users...
                        </p>
                      </div>
                    ) : users?.length ===
                      0 ? (
                      <div className="bg-gray-50 border border-gray-100 rounded-[28px] p-12 text-center">
                        <MdGroups className="mx-auto text-5xl text-gray-300 mb-4" />

                        <h3 className="text-lg font-semibold text-[#1E1B4B]">
                          No Users
                          Found
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          No
                          subcontractor
                          users are
                          available
                          for this
                          company.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                        {users
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
                              <div
                                key={
                                  userItem.subcontractor_user_id
                                }
                                className="bg-white border border-gray-100 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                              >
                                {/* TOP */}
                                <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-pink-50 border-b border-gray-100 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                                      <MdPerson className="text-indigo-500 text-xl" />
                                    </div>

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
                                        Subcontractor
                                        User
                                      </p>
                                    </div>
                                  </div>

                                  {/* ACTIONS */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() =>
                                        handleEdit(
                                          userItem.subcontractor_user_id,
                                        )
                                      }
                                      className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-all duration-300"
                                    >
                                      <BiSolidEditAlt className="text-lg" />
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDeleteUser(
                                          userItem.subcontractor_user_id,
                                        )
                                      }
                                      className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all duration-300"
                                    >
                                      <AiFillDelete className="text-lg" />
                                    </button>
                                  </div>
                                </div>

                                {/* BODY */}
                                <div className="p-5 space-y-4">
                                  {/* EMAIL */}
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                      <MdEmail className="text-indigo-500 text-lg" />
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Email
                                      </p>

                                      <p className="text-sm font-medium text-[#1E1B4B] break-all">
                                        {
                                          userItem.email_id
                                        }
                                      </p>
                                    </div>
                                  </div>

                                  {/* CONTACT */}
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                      <MdPhone className="text-indigo-500 text-lg" />
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Contact
                                      </p>

                                      <p className="text-sm font-medium text-[#1E1B4B]">
                                        {userItem.mobile ||
                                          "NA"}
                                      </p>
                                    </div>
                                  </div>

                                  {/* STATUS */}
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                                      {userItem.is_active ? (
                                        <MdCheckCircle className="text-green-500 text-lg" />
                                      ) : (
                                        <MdCancel className="text-red-500 text-lg" />
                                      )}
                                    </div>

                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">
                                        Status
                                      </p>

                                      <span
                                        className={`inline-flex px-3 py-1 rounded-xl text-xs font-semibold ${
                                          userItem.is_active
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                      >
                                        {userItem.is_active
                                          ? "Active"
                                          : "Inactive"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ),
                          )}
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