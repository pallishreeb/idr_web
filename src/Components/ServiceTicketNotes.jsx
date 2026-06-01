/** @format */

import React, { useState, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";

import Swal from "sweetalert2";

import {
  MdNotes,
  MdAdd,
  MdDelete,
  MdEdit,
  MdSave,
  MdClose,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdCalendarToday,
} from "react-icons/md";

import AddServiceNoteModal from "./AddServiceNoteModal";

import {
  addNotesToServiceTicket,
  getServiceTicketDetails,
  deleteServiceNote,
  updateSubcontractorNoteStatus,
} from "../actions/serviceTicket";

import { getClients } from "../actions/clientActions";

import { fetchIDREmployees } from "../actions/employeeActions";

import NoteTextarea from "./NoteTextarea";

const NotesTable = ({
  notes,
  serviceTicketId,
  handleSaveNote,
  handleNoteChange,
}) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const { user_type, user_id } = useSelector((state) => state.user.user);

  const { access, technicianAccess } = useSelector((state) => state.user);

  // =========================
  // ACCESS
  // =========================

  const newAccess = [
    ...technicianAccess,
    "Subcontractor_User",
    "Subcontractor",
  ];

  // =========================
  // MODAL
  // =========================

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // =========================
  // EDIT TOGGLE
  // =========================

  const handleEditToggle = (index) => {
    setEditingIndex(index === editingIndex ? null : index);
  };

  // =========================
  // ADD NOTE
  // =========================

  const handleAddNote = (newNote) => {
    dispatch(addNotesToServiceTicket(newNote))
      .then((response) => {
        if (response.code === "ST201") {
          handleCloseModal();

          dispatch(getServiceTicketDetails(serviceTicketId));

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

  // =========================
  // DELETE
  // =========================

  const handleDelete = (noteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServiceNote(noteId));

        dispatch(getServiceTicketDetails(serviceTicketId));

        dispatch(getClients());

        dispatch(fetchIDREmployees());
      }
    });
  };

  // =========================
  // APPROVE / REJECT
  // =========================

  const handleApproveReject = (noteId, status) => {
    dispatch(updateSubcontractorNoteStatus(noteId, status))
      .then(() => {
        dispatch(getServiceTicketDetails(serviceTicketId));
      })
      .catch(() => {
        console.error("Failed to update note status");
      });
  };

  // =========================
  // EMPTY STATE
  // =========================

  if (!notes || notes.length === 0) {
    return (
      <>
        <div
          className="
            mt-5
            bg-white
            border
            border-gray-100
            rounded-[28px]
            shadow-sm
            overflow-hidden
          "
        >
          {/* TOP BORDER */}
          <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

          <div className="p-7">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-gradient-to-r
                   from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                >
                  <MdNotes className="text-3xl" />
                </div>

                <div>
                  <h1 className="text-xl font-semibold text-[#1E1B4B]">
                    Notes
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Service ticket notes and comments
                  </p>
                </div>
              </div>

              {newAccess.includes(user_type) && (
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                  onClick={handleOpenModal}
                >
                  <MdAdd className="text-lg" />
                  Add Note
                </button>
              )}
            </div>

            {/* EMPTY */}
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >
                <MdNotes className="text-4xl text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                No Notes Added Yet
              </h3>

              <p className="text-sm text-gray-500 mt-2 max-w-md">
                Service ticket notes and technician comments will appear here.
              </p>
            </div>
          </div>
        </div>

        {/* MODAL */}
        <AddServiceNoteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleAddNote}
          serviceTicketId={serviceTicketId}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="
          mt-5
          bg-white
          border
          border-gray-100
          rounded-[28px]
          shadow-sm
          overflow-hidden
        "
      >
        {/* TOP BORDER */}
        <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5 md:p-7">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-7">
            <div className="flex items-center gap-4">
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  to-pink-500
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                "
              >
                <MdNotes className="text-3xl" />
              </div>

              <div>
                <h1 className="text-xl font-semibold text-[#1E1B4B]">Notes</h1>

                <p className="text-sm text-gray-500 mt-1">
                  Service ticket notes and comments
                </p>
              </div>
            </div>

            {/* ADD BUTTON */}
            {newAccess.includes(user_type) && (
              <button
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-gradient-to-r
                 from-[#312E81]
via-[#4338CA]
to-[#6366F1]
                  text-white
                  text-sm
                  font-semibold
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
                onClick={handleOpenModal}
              >
                <MdAdd className="text-lg" />
                Add Note
              </button>
            )}
          </div>

          {/* NOTES LIST */}
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
                      <MdPerson className="text-2xl" />
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
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <MdCalendarToday className="text-sm" />

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
                      </div>
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
                                from-indigo-500
                                via-purple-500
                                to-pink-500
                                text-white
                                text-sm
                                font-semibold
                                shadow-sm
                                hover:shadow-md
                                transition-all
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
                                hover:bg-gray-200
                                transition-all
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
                            <MdEdit className="text-xl" />
                          </button>

                          {/* DELETE */}
                          {access.includes(user_type) && (
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
                              <MdDelete className="text-xl" />
                            </button>
                          )}

                          {/* APPROVE / REJECT */}
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
                                      hover:bg-green-200
                                      transition-all
                                    "
                                  onClick={() =>
                                    handleApproveReject(note.note_id, true)
                                  }
                                >
                                  <MdCheckCircle className="text-lg" />
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
                                      hover:bg-red-200
                                      transition-all
                                    "
                                  onClick={() =>
                                    handleApproveReject(note.note_id, false)
                                  }
                                >
                                  <MdCancel className="text-lg" />
                                  Reject
                                </button>
                              </>
                            )}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* NOTE */}
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
        </div>
      </div>

      {/* ADD NOTE MODAL */}
      <AddServiceNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNote}
        serviceTicketId={serviceTicketId}
      />
    </>
  );
};

export default NotesTable;
