/** @format */

import React, { useState } from "react";

import { toast } from "react-toastify";

import { MdNotes, MdClose, MdSave } from "react-icons/md";

const AddNoteModal = ({ isOpen, onClose, onSave, workOrderId }) => {
  const [note, setNote] = useState({
    work_order_id: workOrderId,
    comments: "",
  });

  // =========================
  // INPUT CHANGE
  // =========================

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  // =========================
  // VALIDATION
  // =========================

  const validateStep = () => {
    return note.comments.trim() !== "";
  };

  // =========================
  // SAVE
  // =========================

  const handleSaveNote = () => {
    if (!validateStep()) {
      toast.error("Comment can't be empty.");

      return;
    }

    onSave(note);

    setNote({
      comments: "",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        px-4
      "
    >
      {/* MODAL */}
      <div
        className="
          w-full
          max-w-2xl
          bg-white
          rounded-[30px]
          shadow-2xl
          overflow-hidden
          animate-fadeIn
        "
      >
        {/* TOP BAR */}
        <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-6 md:p-7">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* ICON */}
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

              {/* TITLE */}
              <div>
                <h2 className="text-2xl font-bold text-[#1E1B4B]">Add Note</h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add comments or updates for this work order.
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
                w-11
                h-11
                rounded-2xl
                bg-gray-100
                text-gray-600
                flex
                items-center
                justify-center
                hover:bg-gray-200
                transition-all
              "
            >
              <MdClose className="text-2xl" />
            </button>
          </div>

          {/* TEXTAREA */}
          <div className="mb-6">
            <label
              className="
                block
                text-sm
                font-semibold
                text-[#1E1B4B]
                mb-2
              "
            >
              Comments
            </label>

            <textarea
              className="
                w-full
                min-h-[220px]
                rounded-[24px]
                border
                border-gray-200
                bg-gray-50
                px-5
                py-4
                text-sm
                text-gray-700
                resize-none
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all
              "
              name="comments"
              value={note.comments}
              onChange={handleInputChange}
              placeholder="Write your note or update here..."
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {/* CANCEL */}
            <button
              className="
                flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
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
              onClick={onClose}
            >
              <MdClose className="text-lg" />
              Cancel
            </button>

            {/* SAVE */}
            <button
              className="
                flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
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
                hover:scale-[1.01]
                transition-all
              "
              onClick={handleSaveNote}
            >
              <MdSave className="text-lg" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal;
