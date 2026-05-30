/** @format */

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";

import { AiFillDelete } from "react-icons/ai";

import { BiSolidEditAlt } from "react-icons/bi";

import {
  MdNoteAlt,
  MdAdd,
  MdSave,
  MdClose,
  MdPerson,
  MdAccessTime,
} from "react-icons/md";

import AddRmaNoteModal from "./AddRmaNoteModal";

import {
  addNotesToRma,
  getRMADetails,
  deleteRmaNote,
} from "../actions/rmaActions";

const RmaNotes = ({ notes, rmaId, handleSaveNote, handleNoteChange }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingIndex, setEditingIndex] = useState(null);

  const { user_type, first_name, last_name } = useSelector(
    (state) => state.user.user,
  );

  const { access, technicianAccess } = useSelector((state) => state.user);

  const fullName = `${first_name} ${last_name}`;

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
    dispatch(addNotesToRma(newNote))
      .then((response) => {
        if (response.code === "RMA201") {
          dispatch(getRMADetails(rmaId));

          window.location.reload();

          handleCloseModal();
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
        dispatch(deleteRmaNote(noteId)).then(() => {
          dispatch(getRMADetails(rmaId));
        });
      }
    });
  };

  const newAccess = [
    ...technicianAccess,
    "Subcontractor_User",
    "Subcontractor",
  ];

  return (
    <>
      <div
        className="
          bg-white
          rounded-[24px]
          border
          border-gray-100
          shadow-sm
          overflow-hidden
        "
      >
        {/* TOP BORDER */}
        <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
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
                <MdNoteAlt className="text-2xl" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#1E1B4B]">
                  RMA Notes
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  View and manage all RMA comments and updates
                </p>
              </div>
            </div>

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
                onClick={handleOpenModal}
              >
                <MdAdd className="text-lg" />
                Add Note
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {notes?.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center">
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
                <MdNoteAlt className="text-4xl text-gray-400" />
              </div>

              <h3 className="text-base font-semibold text-[#1E1B4B]">
                No Notes Added
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                RMA comments and updates will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {notes?.map((note, index) => (
                <div
                  key={note.note_id}
                  className="
                      border
                      border-gray-100
                      rounded-2xl
                      bg-white
                      shadow-sm
                      overflow-hidden
                    "
                >
                  {/* NOTE HEADER */}
                  <div
                    className="
                        px-5
                        py-4
                        border-b
                        border-gray-100
                        bg-gray-50
                        flex
                        flex-col
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                        gap-4
                      "
                  >
                    <div className="flex flex-wrap items-center gap-5">
                      {/* USER */}
                      <div className="flex items-center gap-2">
                        <div
                          className="
                              w-10
                              h-10
                              rounded-xl
                              bg-indigo-100
                              text-indigo-600
                              flex
                              items-center
                              justify-center
                            "
                        >
                          <MdPerson className="text-xl" />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Created By</p>

                          <p className="text-sm font-semibold text-[#1E1B4B]">
                            {note?.created_by}
                          </p>
                        </div>
                      </div>

                      {/* DATE */}
                      <div className="flex items-center gap-2">
                        <div
                          className="
                              w-10
                              h-10
                              rounded-xl
                              bg-purple-100
                              text-purple-600
                              flex
                              items-center
                              justify-center
                            "
                        >
                          <MdAccessTime className="text-xl" />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">Date & Time</p>

                          <p className="text-sm font-medium text-[#1E1B4B]">
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
                    </div>

                    {/* ACTIONS */}
                    {(access.includes(user_type) ||
                      note?.created_by === fullName) && (
                      <div className="flex items-center gap-2">
                        {editingIndex === index ? (
                          <>
                            <button
                              className="
                                  flex
                                  items-center
                                  gap-2
                                  px-4
                                  py-2.5
                                  rounded-xl
                                  bg-green-600
                                  text-white
                                  text-sm
                                  font-semibold
                                  hover:bg-green-700
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
                                  rounded-xl
                                  border
                                  border-gray-200
                                  bg-white
                                  text-gray-700
                                  text-sm
                                  font-semibold
                                  hover:bg-gray-50
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
                            <button
                              className="
                                  w-10
                                  h-10
                                  rounded-xl
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
                              <BiSolidEditAlt className="text-lg" />
                            </button>

                            {access.includes(user_type) && (
                              <button
                                className="
                                    w-10
                                    h-10
                                    rounded-xl
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
                                <AiFillDelete className="text-lg" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* NOTE CONTENT */}
                  <div className="p-5">
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-3">
                      Comment
                    </label>

                    <textarea
                      className={`
                          w-full
                          rounded-2xl
                          border
                          px-4
                          py-4
                          text-sm
                          resize-y
                          min-h-[140px]
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          ${
                            editingIndex === index
                              ? "border-indigo-300 bg-white"
                              : "border-gray-200 bg-gray-50 text-gray-700"
                          }
                        `}
                      name="comments"
                      value={note?.comments || ""}
                      onChange={(e) => handleNoteChange(index, e)}
                      disabled={editingIndex !== index}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADD NOTE MODAL */}
      <AddRmaNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNote}
        rmaId={rmaId}
      />
    </>
  );
};

export default RmaNotes;
