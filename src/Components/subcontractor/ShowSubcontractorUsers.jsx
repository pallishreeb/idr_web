/** @format */

import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Swal from "sweetalert2";

import {
  toast,
} from "react-toastify";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdGroups,
  MdPerson,
  MdPhone,
  MdBusiness,
  MdAdd,
  MdDelete,
  MdAssignmentInd,
} from "react-icons/md";

import AddSubcontractorUserModal from "./AddSubcontractorUserModal";

const ShowSubcontractorUsers =
  ({
    subcontractorAssignees,
    parentId,
    assignAction,
    deleteAction,
    refreshAction,
    parentKey,
    idKey,
    title = "Subcontractor Users",
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

    const {
      access,
      technicianAccess,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user,
      );

    const [
      isModalOpen,
      setIsModalOpen,
    ] =
      useState(false);

    /* ===========================
       ADD
    =========================== */

    const handleAdd =
      (
        payload,
      ) => {
        dispatch(
          assignAction(
            payload,
          ),
        ).then(
          (
            res,
          ) => {
            if (
              res?.code ===
                "WO201" ||
              res?.code ===
                "ST201"
            ) {
              toast.success(
                "Subcontractor users assigned",
              );

              dispatch(
                refreshAction(
                  parentId,
                ),
              );

              setIsModalOpen(
                false,
              );
            }
          },
        );
      };

    /* ===========================
       DELETE
    =========================== */

    const handleDelete =
      (
        assignmentId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",

          text: "Delete this subcontractor user?",

          icon: "warning",

          showCancelButton:
            true,
        }).then(
          (
            result,
          ) => {
            if (
              result.isConfirmed
            ) {
              dispatch(
                deleteAction(
                  assignmentId,
                ),
              ).then(
                () => {
                  dispatch(
                    refreshAction(
                      parentId,
                    ),
                  );
                },
              );
            }
          },
        );
      };

    return (
      <div className="bg-white rounded-[30px] shadow-lg border border-gray-100 overflow-hidden mt-6">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-7">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            {user_type !==
              "Client Employee" && (
              <div className="flex items-center gap-3">
                {/* ICON */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                  <MdGroups className="text-2xl" />
                </div>

                <div>
                  {/* SMALL TITLE */}
                  <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                    {title}
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Manage
                    assigned
                    subcontractor
                    users
                  </p>
                </div>
              </div>
            )}

            {/* ADD BUTTON */}
            {access.includes(
              user_type,
            ) && (
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                onClick={() =>
                  setIsModalOpen(
                    true,
                  )
                }
              >
                <MdAdd className="text-lg" />
                Add
                Subcontractor
                User
              </button>
            )}
          </div>

          {/* EMPTY */}
          {subcontractorAssignees?.length ===
            0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-[28px] p-10 text-center">
              <MdAssignmentInd className="mx-auto text-5xl text-gray-300 mb-4" />

              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                No Users
                Assigned
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Assigned
                subcontractor
                users will
                appear here.
              </p>
            </div>
          )}

          {/* CARDS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {subcontractorAssignees?.map(
              (
                user,
              ) => {
                const assignmentId =
                  user[
                    idKey
                  ];

                return (
                  <div
                    key={
                      assignmentId
                    }
                    className="bg-white border border-gray-100 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                  >
                    {/* TOP */}
                    <div className="px-5 py-4 bg-gradient-to-r from-indigo-50 to-pink-50 border-b border-gray-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                          <MdPerson className="text-indigo-500 text-xl" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[#1E1B4B]">
                            {
                              user.subcontractor_user_name
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            Assigned
                            User
                          </p>
                        </div>
                      </div>

                      {/* DELETE */}
                      {user_type ===
                        "Admin" && (
                        <button
                          className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 flex items-center justify-center transition-all duration-300"
                          onClick={() =>
                            handleDelete(
                              assignmentId,
                            )
                          }
                        >
                          <MdDelete className="text-lg" />
                        </button>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 space-y-4">
                      {/* COMPANY */}
                      {technicianAccess.includes(
                        user_type,
                      ) && (
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                            <MdBusiness className="text-indigo-500 text-lg" />
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Subcontractor
                            </p>

                            <p className="text-sm font-medium text-[#1E1B4B]">
                              {user.subcontractor_company ||
                                "NA"}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* NAME */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <MdPerson className="text-indigo-500 text-lg" />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            Name
                          </p>

                          <p className="text-sm font-medium text-[#1E1B4B]">
                            {
                              user.subcontractor_user_name
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
                            {
                              user.subcontractor_user_contact
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>

          {/* MODAL */}
          <AddSubcontractorUserModal
            isOpen={
              isModalOpen
            }
            onClose={() =>
              setIsModalOpen(
                false,
              )
            }
            onSave={
              handleAdd
            }
            parentId={
              parentId
            }
            parentKey={
              parentKey
            }
          />
        </div>
      </div>
    );
  };

export default ShowSubcontractorUsers;