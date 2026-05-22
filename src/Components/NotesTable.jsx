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
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  FaCheck,
  FaTimes,
} from "react-icons/fa";

import {
  MdNotes,
  MdAdd,
  MdSave,
  MdClose,
  MdVerified,
} from "react-icons/md";

import AddNoteModal from "./AddNoteModal";

import NoteTextarea from "./NoteTextarea";

import {
  addNotesToTicket,
  getWorkOrderDetails,
  deleteNote,
} from "../actions/workOrderActions";

import {
  updateWOSubcontractorNoteStatus,
} from "../actions/serviceTicket";

import {
  getClients,
} from "../actions/clientActions";

import {
  fetchIDREmployees,
} from "../actions/employeeActions";

const NotesTable =
  ({
    notes,
    handleSaveNote,
    handleNoteChange,
    workOrderId,
  }) => {
    const dispatch =
      useDispatch();

    const [
      isModalOpen,
      setIsModalOpen,
    ] =
      useState(
        false,
      );

    const [
      editingIndex,
      setEditingIndex,
    ] =
      useState(
        null,
      );

    const {
      user_type,
      user_id,
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

    const handleEditToggle =
      (
        index,
      ) => {
        setEditingIndex(
          index ===
            editingIndex
            ? null
            : index,
        );
      };

    const handleOpenModal =
      () => {
        setIsModalOpen(
          true,
        );
      };

    const handleCloseModal =
      () => {
        setIsModalOpen(
          false,
        );
      };

    const handleAddNote =
      (
        newNote,
      ) => {
        dispatch(
          addNotesToTicket(
            newNote,
          ),
        )
          .then(
            (
              response,
            ) => {
              if (
                response.code ===
                "WO201"
              ) {
                handleCloseModal();

                dispatch(
                  getWorkOrderDetails(
                    workOrderId,
                  ),
                );

                dispatch(
                  getClients(),
                );

                dispatch(
                  fetchIDREmployees(),
                );
              } else {
                console.error(
                  "Error adding notes:",
                  response.error,
                );
              }
            },
          )
          .catch(
            (
              error,
            ) => {
              console.error(
                "API call error:",
                error,
              );
            },
          );
      };

    const handleDelete =
      (
        noteId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",

          text: "Do you really want to delete this comment?",

          icon: "warning",

          showCancelButton:
            true,

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
                deleteNote(
                  noteId,
                ),
              );

              dispatch(
                getWorkOrderDetails(
                  workOrderId,
                ),
              );

              dispatch(
                getClients(),
              );

              dispatch(
                fetchIDREmployees(),
              );
            }
          },
        );
      };

    const handleApproveReject =
      (
        noteId,
        status,
      ) => {
        dispatch(
          updateWOSubcontractorNoteStatus(
            noteId,
            status,
          ),
        )
          .then(
            () => {
              dispatch(
                getWorkOrderDetails(
                  workOrderId,
                ),
              );
            },
          )
          .catch(
            () => {
              console.error(
                "Failed to update note status",
              );
            },
          );
      };

    const newAccess =
      [
        ...technicianAccess,
        "Subcontractor_User",
        "Subcontractor",
      ];

    return (
      <div className="mt-4 bg-white border border-gray-100 rounded-[30px] shadow-sm overflow-hidden">
        {/* TOP BAR */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-5 md:p-7">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div className="flex items-center gap-4">
              {/* ICON */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                <MdNotes className="text-2xl" />
              </div>

              {/* TITLE */}
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                  Work Order
                  Notes
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage notes,
                  comments &
                  subcontractor
                  approvals
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
                  gap-2
                  px-5
                  py-2.5
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-pink-500
                  text-white
                  text-sm
                  font-semibold
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
                onClick={
                  handleOpenModal
                }
              >
                <MdAdd className="text-lg" />
                Add Note
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {notes?.length ===
            0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-10 text-center">
              <MdNotes className="mx-auto text-5xl text-gray-300 mb-4" />

              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                No Notes
                Added
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Work order
                notes and
                comments will
                appear here.
              </p>
            </div>
          )}

          {/* TABLE */}
          {notes?.length >
            0 && (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-pink-50">
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B] min-w-[420px]">
                      Comments
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      User
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      Date & Time
                    </th>

                    {(access.includes(
                      user_type,
                    ) ||
                      newAccess.includes(
                        user_type,
                      )) && (
                      <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B] w-[180px]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {notes?.map(
                    (
                      note,
                      index,
                    ) => (
                      <tr
                        key={
                          note.note_id
                        }
                        className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200 align-top"
                      >
                        {/* COMMENTS */}
                        <td className="px-5 py-4">
                          <div className="space-y-3">
                            {/* NOTE BOX */}
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
                              <NoteTextarea
                                note={
                                  note
                                }
                                index={
                                  index
                                }
                                handleNoteChange={
                                  handleNoteChange
                                }
                                editingIndex={
                                  editingIndex
                                }
                              />
                            </div>

                            {/* BADGES */}
                            <div className="flex flex-wrap gap-2">
                              {note.is_added_by_subcontractor && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-orange-100 text-orange-700">
                                  Subcontractor
                                  Note
                                </span>
                              )}

                              {note.is_added_by_subcontractor &&
                                note.is_accepted_subcontractor_note && (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-green-100 text-green-700">
                                    <MdVerified className="text-sm" />
                                    Approved
                                  </span>
                                )}
                            </div>
                          </div>
                        </td>

                        {/* USER */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-[#1E1B4B]">
                              {
                                note
                                  ?.profile
                                  ?.first_name
                              }{" "}
                              {
                                note
                                  ?.profile
                                  ?.last_name
                              }
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Note
                              author
                            </p>
                          </div>
                        </td>

                        {/* DATE */}
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <p className="text-sm font-medium text-[#1E1B4B]">
                              {new Date(
                                note.created_at,
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  timeZone:
                                    "America/New_York",
                                },
                              )}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                note.created_at,
                              ).toLocaleTimeString(
                                "en-US",
                                {
                                  timeZone:
                                    "America/New_York",

                                  hour:
                                    "2-digit",

                                  minute:
                                    "2-digit",

                                  second:
                                    "2-digit",

                                  hour12:
                                    true,
                                },
                              )}
                            </p>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        {(access.includes(
                          user_type,
                        ) ||
                          note
                            .profile
                            ?.user_id ===
                            user_id) && (
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-2">
                              {/* SAVE/CANCEL */}
                              {editingIndex ===
                              index ? (
                                <>
                                  <button
                                    className="
                                      flex
                                      items-center
                                      gap-1
                                      px-4
                                      py-2
                                      rounded-xl
                                      bg-indigo-600
                                      text-white
                                      text-xs
                                      font-semibold
                                      hover:bg-indigo-700
                                      transition-all
                                      duration-300
                                    "
                                    onClick={() => {
                                      handleSaveNote(
                                        index,
                                      );

                                      handleEditToggle(
                                        index,
                                      );
                                    }}
                                  >
                                    <MdSave />
                                    Save
                                  </button>

                                  <button
                                    className="
                                      flex
                                      items-center
                                      gap-1
                                      px-4
                                      py-2
                                      rounded-xl
                                      bg-gray-200
                                      text-gray-700
                                      text-xs
                                      font-semibold
                                      hover:bg-gray-300
                                      transition-all
                                      duration-300
                                    "
                                    onClick={() =>
                                      handleEditToggle(
                                        index,
                                      )
                                    }
                                  >
                                    <MdClose />
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  {/* EDIT */}
                                  <button
                                    className="
                                      w-10
                                      h-10
                                      rounded-xl
                                      bg-indigo-50
                                      border
                                      border-indigo-100
                                      text-indigo-600
                                      hover:bg-indigo-100
                                      flex
                                      items-center
                                      justify-center
                                      transition-all
                                      duration-300
                                    "
                                    onClick={() =>
                                      handleEditToggle(
                                        index,
                                      )
                                    }
                                  >
                                    <BiSolidEditAlt />
                                  </button>

                                  {/* DELETE */}
                                  {user_type ===
                                    "Admin" && (
                                    <button
                                      className="
                                        w-10
                                        h-10
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
                                          note.note_id,
                                        )
                                      }
                                    >
                                      <AiFillDelete />
                                    </button>
                                  )}

                                  {/* APPROVE */}
                                  {note.is_added_by_subcontractor &&
                                    !note.is_accepted_subcontractor_note &&
                                    access.includes(
                                      user_type,
                                    ) && (
                                      <>
                                        <button
                                          className="
                                            w-10
                                            h-10
                                            rounded-xl
                                            bg-green-50
                                            border
                                            border-green-100
                                            text-green-600
                                            hover:bg-green-100
                                            flex
                                            items-center
                                            justify-center
                                            transition-all
                                            duration-300
                                          "
                                          onClick={() =>
                                            handleApproveReject(
                                              note.note_id,
                                              true,
                                            )
                                          }
                                        >
                                          <FaCheck />
                                        </button>

                                        <button
                                          className="
                                            w-10
                                            h-10
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
                                            handleApproveReject(
                                              note.note_id,
                                              false,
                                            )
                                          }
                                        >
                                          <FaTimes />
                                        </button>
                                      </>
                                    )}
                                </>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* MODAL */}
          <AddNoteModal
            isOpen={
              isModalOpen
            }
            onClose={
              handleCloseModal
            }
            onSave={
              handleAddNote
            }
            workOrderId={
              workOrderId
            }
          />
        </div>
      </div>
    );
  };

export default NotesTable;