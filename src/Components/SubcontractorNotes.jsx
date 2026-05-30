/** @format */

import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdNotes,
  MdAdd,
  MdAccessTime,
  MdPerson,
  MdDelete,
} from "react-icons/md";

import Swal from "sweetalert2";

import {
  addNotesToSubcontractor,
  getSubcontractorDetails,
  deleteSubcontractorNote,
} from "../actions/subContractorAction";

import AddSubcontractorModal from "./AddSubcontractorModal";

const SubcontractorNotes =
  ({
    notes,
    subcontractorId,
  }) => {
    const dispatch =
      useDispatch();

    const [
      isModalOpen,
      setIsModalOpen,
    ] =
      useState(false);

    const [
      editingIndex,
      setEditingIndex,
    ] =
      useState(null);

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
    } =
      useSelector(
        (
          state,
        ) =>
          state.user,
      );

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
          addNotesToSubcontractor(
            newNote,
          ),
        )
          .then(
            () => {
              handleCloseModal();

              dispatch(
                getSubcontractorDetails(
                  subcontractorId,
                ),
              );
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
            "Cancel",
        }).then(
          (
            result,
          ) => {
            if (
              result.isConfirmed
            ) {
              dispatch(
                deleteSubcontractorNote(
                  noteId,
                ),
              ).then(
                () => {
                  dispatch(
                    getSubcontractorDetails(
                      subcontractorId,
                    ),
                  );
                },
              );
            }
          },
        );
      };

    const addAccess =
      [
        "Admin",
        "Subadmin",
        "IDR Employee",
      ];

    return (
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden mt-6">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-6 md:p-8">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            {/* <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-3xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-lg">
                <MdNotes className="text-3xl" />
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
                  Notes &
                  Comments
                </h2>

                <p className="text-gray-500 mt-1 text-sm">
                  Manage
                  subcontractor
                  notes and
                  communication
                </p>
              </div>
            </div> */}

            {addAccess.includes(
              user_type,
            ) && (
              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                onClick={
                  handleOpenModal
                }
              >
                <MdAdd className="text-xl" />
                Add Note
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {(!notes ||
            notes.length ===
              0) && (
            <div className="bg-gray-50 border border-gray-100 rounded-[28px] p-10 text-center">
              <MdNotes className="mx-auto text-5xl text-gray-300 mb-4" />

              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                No Notes
                Available
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Notes added
                by users will
                appear here.
              </p>
            </div>
          )}

          {/* NOTES LIST */}
          <div className="space-y-5">
            {notes?.map(
              (
                note,
                index,
              ) => (
                <div
                  key={
                    note.note_id
                  }
                  className="bg-white border border-gray-100 rounded-[28px] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* TOP */}
                  <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-pink-50 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* USER */}
                      <div className="flex flex-wrap items-center gap-5">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-sm">
                            <MdPerson className="text-xl" />
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Added
                              By
                            </p>

                            <p className="font-semibold text-[#1E1B4B] text-sm">
                              {
                                note?.created_by
                              }
                            </p>
                          </div>
                        </div>

                        {/* DATE */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                            <MdAccessTime className="text-indigo-500 text-lg" />
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Date &
                              Time
                            </p>

                            <p className="font-medium text-gray-700 text-sm">
                              {new Date(
                                note.created_at,
                              ).toLocaleString(
                                "en-US",
                                {
                                  timeZone:
                                    "America/New_York",

                                  year:
                                    "numeric",

                                  month:
                                    "2-digit",

                                  day: "2-digit",

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
                        </div>
                      </div>

                      {/* DELETE */}
                      {(access.includes(
                        user_type,
                      ) ||
                        note
                          ?.profile
                          ?.user_id ===
                          user_id) && (
                        <button
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-all duration-300"
                          onClick={() =>
                            handleDelete(
                              note.note_id,
                            )
                          }
                        >
                          <MdDelete className="text-lg" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* COMMENT */}
                  <div className="p-6">
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-3">
                      Comment
                    </label>

                    <textarea
                      className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                      name="comments"
                      value={
                        note.comments ||
                        ""
                      }
                      rows={
                        4
                      }
                      disabled={
                        editingIndex !==
                        index
                      }
                      readOnly
                    />
                  </div>
                </div>
              ),
            )}
          </div>

          {/* MODAL */}
          <AddSubcontractorModal
            isOpen={
              isModalOpen
            }
            onClose={
              handleCloseModal
            }
            onSave={
              handleAddNote
            }
            subcontractorId={
              subcontractorId
            }
          />
        </div>
      </div>
    );
  };

export default SubcontractorNotes;