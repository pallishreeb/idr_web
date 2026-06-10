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
  MdGroups,
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
  const newAccess = [
    ...access,
    "Subcontractor_User",
    "Subcontractor",
  ];
    return (
      <div className="bg-white rounded-[28px] shadow-sm border border-gray-100 overflow-hidden mt-6">
        {/* TOP BAR */}
        <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5 md:p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                <MdGroups className="text-2xl" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#1E1B4B]">
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

            {/* ADD BUTTON */}
            {newAccess.includes(
              user_type,
            ) && (
              <button
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-2xl
                  bg-gradient-to-r
                 from-[#312E81]
via-[#4338CA]
to-[#6366F1]
                  text-white
                  text-sm
                  font-semibold
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
                onClick={() =>
                  setIsModalOpen(
                    true,
                  )
                }
              >
                <MdAdd className="text-lg" />
                Add
                User
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {subcontractorAssignees?.length ===
            0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-10 text-center">
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

          {/* TABLE */}
          {subcontractorAssignees?.length >
            0 && (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-pink-50">
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      Subcontractor
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      User Name
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      Contact
                    </th>

                    {user_type ===
                      "Admin" && (
                      <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B] w-[100px]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {subcontractorAssignees?.map(
                    (
                      user,
                      index,
                    ) => {
                      const assignmentId =
                        user[
                          idKey
                        ];

                      return (
                        <tr
                          key={
                            assignmentId
                          }
                          className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                          {/* COMPANY */}
                          <td className="px-5 py-4">
                            <span className="inline-flex px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-100 text-indigo-700">
                              {user.subcontractor_company ||
                                "NA"}
                            </span>
                          </td>

                          {/* USER */}
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-[#1E1B4B]">
                              {
                                user.subcontractor_user_name
                              }
                            </p>
                          </td>

                          {/* CONTACT */}
                          <td className="px-5 py-4">
                            <p className="text-sm text-gray-700">
                              {
                                user.subcontractor_user_contact
                              }
                            </p>
                          </td>

                          {/* ACTION */}
                          {user_type ===
                            "Admin" && (
                            <td className="px-5 py-4">
                              <div className="flex justify-center">
                                <button
                                  className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-red-50
                                    border
                                    border-red-100
                                    text-red-500
                                    hover:bg-red-100
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    duration-300
                                  "
                                  onClick={() =>
                                    handleDelete(
                                      assignmentId,
                                    )
                                  }
                                >
                                  <MdDelete className="text-lg" />
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}

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