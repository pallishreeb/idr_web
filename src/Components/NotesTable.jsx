/** @format */

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

import { AiFillDelete } from "react-icons/ai";

import { BiSolidEditAlt } from "react-icons/bi";

import { FaCheck, FaTimes } from "react-icons/fa";

import { MdNotes, MdAdd, MdSave, MdClose, MdVerified } from "react-icons/md";

import AddNoteModal from "./AddNoteModal";

import NoteTextarea from "./NoteTextarea";

import {
  addNotesToTicket,
  getWorkOrderDetails,
  deleteNote,
} from "../actions/workOrderActions";

import { updateWOSubcontractorNoteStatus } from "../actions/serviceTicket";

import { getClients } from "../actions/clientActions";

import { fetchIDREmployees } from "../actions/employeeActions";

const NotesTable = ({
  notes,
  handleSaveNote,
  handleNoteChange,
  workOrderId,
}) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const { user_type, user_id } = useSelector((state) => state.user.user);

  const { access, technicianAccess } = useSelector((state) => state.user);

  const handleEditToggle = (index) => {
    setEditingIndex(index === editingIndex ? null : index);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNote = (newNote) => {
    dispatch(addNotesToTicket(newNote))
      .then((response) => {
        if (response.code === "WO201") {
          handleCloseModal();

          dispatch(getWorkOrderDetails(workOrderId));

          dispatch(getClients());

          dispatch(fetchIDREmployees());
        } else {
          console.error("Error adding notes:", response.error);
        }
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
  };

  const handleDelete = (noteId) => {
    Swal.fire({
      title: "Are you sure?",

      text: "Do you really want to delete this comment?",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, delete it!",

      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteNote(noteId));

        dispatch(getWorkOrderDetails(workOrderId));

        dispatch(getClients());

        dispatch(fetchIDREmployees());
      }
    });
  };

  const handleApproveReject = (noteId, status) => {
    dispatch(updateWOSubcontractorNoteStatus(noteId, status))
      .then(() => {
        dispatch(getWorkOrderDetails(workOrderId));
      })
      .catch(() => {
        console.error("Failed to update note status");
      });
  };

  const newAccess = [
    ...technicianAccess,
    "Subcontractor_User",
    "Subcontractor",
  ];

  return (
    <div className="mt-4 bg-white border border-gray-100 rounded-[30px] shadow-sm overflow-hidden">
      {/* TOP BAR */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      <div className="p-5 md:p-7">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
              <MdNotes className="text-2xl" />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                Work Order Notes
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage notes, comments & subcontractor approvals
              </p>
            </div>
          </div>

          {/* ADD BUTTON */}
          {newAccess.includes(user_type) && (
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
              onClick={handleOpenModal}
            >
              <MdAdd className="text-lg" />
              Add Note
            </button>
          )}
        </div>

        {/* NOTES LIST */}
        {notes?.length > 0 && (
          <div className="space-y-5">
            {notes?.map((note, index) => (
              <div
                key={note.note_id}
                className="
          border
          border-gray-100
          rounded-[24px]
          overflow-hidden
          bg-white
          shadow-sm
          hover:shadow-md
          transition-all
        "
              >
                {/* TOP */}
                <div
                  className="
            px-5
            py-4
            border-b
            border-gray-100
            bg-gradient-to-r
            from-gray-50
            to-white
            flex
            flex-col
            xl:flex-row
            xl:items-start
            xl:justify-between
            gap-4
          "
                >
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div
                      className="
                w-12
                h-12
                rounded-2xl
                bg-indigo-100
                text-indigo-600
                flex
                items-center
                justify-center
              "
                    >
                      <MdNotes className="text-2xl" />
                    </div>

                    <div>
                      {/* USER */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-[#1E1B4B]">
                          {note?.profile?.first_name} {note?.profile?.last_name}
                        </h3>
                         {access.includes(user_type) && (<>

                        {/* ACCEPTED BADGE */}
                        {note.is_added_by_subcontractor &&
                          note.is_accepted_subcontractor_note && (
                            <span
                              className="
                                  inline-flex
                                  items-center
                                  px-3
                                  py-1
                                  rounded-full
                                  bg-green-100
                                  text-green-700
                                  text-xs
                                  font-semibold
                                "
                            >
                              Accepted
                            </span>
                          )}

                        {/* REJECTED BADGE */}
                        {note.is_added_by_subcontractor &&
                          note.is_accepted_subcontractor_note === false && (
                            <span
                              className="
                                  inline-flex
                                  items-center
                                  px-3
                                  py-1
                                  rounded-full
                                  bg-red-100
                                  text-red-700
                                  text-xs
                                  font-semibold
                                "
                            >
                              Rejected
                            </span>
                          )}
                          </>)}
                      </div>

                      {/* DATE */}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(note.created_at).toLocaleString("en-US", {
                          timeZone: "America/New_York",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* ACTIONS */}
                  {(access.includes(user_type) ||
                    note.profile?.user_id === user_id) && (
                    <div className="flex flex-wrap gap-2">
                      {/* SAVE/CANCEL */}
                      {editingIndex === index ? (
                        <>
                          <button
                            className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                    "
                            onClick={() => {
                              handleSaveNote(index);
                              handleEditToggle(index);
                            }}
                          >
                            <MdSave className="text-lg" />
                            Save
                          </button>

                          <button
                            className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-100
                      text-gray-700
                      text-sm
                      font-semibold
                    "
                            onClick={() => handleEditToggle(index)}
                          >
                            <MdClose className="text-lg" />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {/* EDIT */}
                          <button
                            className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      hover:bg-blue-100
                      transition-all
                    "
                            onClick={() => handleEditToggle(index)}
                          >
                            <BiSolidEditAlt className="text-xl" />
                          </button>

                          {/* DELETE */}
                          {user_type === "Admin" && (
                            <button
                              className="
                        w-11
                        h-11
                        rounded-2xl
                        bg-red-50
                        text-red-600
                        flex
                        items-center
                        justify-center
                        hover:bg-red-100
                        transition-all
                      "
                              onClick={() => handleDelete(note.note_id)}
                            >
                              <AiFillDelete className="text-xl" />
                            </button>
                          )}

                          {/* APPROVE */}
                          {note.is_added_by_subcontractor &&
                            !note.is_accepted_subcontractor_note &&
                            access.includes(user_type) && (
                              <>
                                <button
                                  className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-2xl
                            bg-green-100
                            text-green-700
                            text-sm
                            font-semibold
                          "
                                  onClick={() =>
                                    handleApproveReject(note.note_id, true)
                                  }
                                >
                                  <FaCheck />
                                  Accept
                                </button>

                                <button
                                  className="
                            flex
                            items-center
                            gap-2
                            px-4
                            py-2.5
                            rounded-2xl
                            bg-red-100
                            text-red-700
                            text-sm
                            font-semibold
                          "
                                  onClick={() =>
                                    handleApproveReject(note.note_id, false)
                                  }
                                >
                                  <FaTimes />
                                  Reject
                                </button>
                              </>
                            )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* NOTE CONTENT */}
                <div className="p-5">
                  <NoteTextarea
                    note={note}
                    index={index}
                    handleNoteChange={handleNoteChange}
                    editingIndex={editingIndex}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        {/* MODAL */}
        <AddNoteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleAddNote}
          workOrderId={workOrderId}
        />
      </div>
    </div>
  );
};

export default NotesTable;
