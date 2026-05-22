/** @format */

import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";

import { MdNotes, MdClose, MdSave, MdDescription } from "react-icons/md";

const AddServiceNoteModal = ({ isOpen, onClose, onSave, serviceTicketId }) => {
  const [note, setNote] = useState({
    service_ticket_id: serviceTicketId,
    comments: "",
  });

  // =========================
  // RESET NOTE ON OPEN
  // =========================

  useEffect(() => {
    setNote({
      service_ticket_id: serviceTicketId,
      comments: "",
    });
  }, [serviceTicketId, isOpen]);

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
  // SAVE NOTE
  // =========================

  const handleSaveNote = () => {
    if (!validateStep()) {
      toast.error("Comment can't be empty.");

      return;
    }

    onSave(note);

    setNote({
      service_ticket_id: serviceTicketId,
      comments: "",
    });

    onClose();
  };

  // =========================
  // CLOSE MODAL
  // =========================

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        bg-black/50
        backdrop-blur-sm
        flex
        items-center
        justify-center
        p-4
      "
    >
      <div
        className="
          w-full
          max-w-3xl
          bg-white
          rounded-[30px]
          shadow-2xl
          overflow-hidden
          animate-fadeIn
        "
      >
        {/* TOP BORDER */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-7">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 mb-7">
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
                <h2 className="text-2xl font-semibold text-[#1E1B4B]">
                  Add Service Note
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add  notes and updates for this service ticket
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
                border
                border-gray-200
                bg-gray-50
                flex
                items-center
                justify-center
                text-gray-500
                hover:bg-red-50
                hover:text-red-500
                hover:border-red-100
                transition-all
                duration-300
              "
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* TEXTAREA SECTION */}
          <div className="mb-7">
            <label
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#1E1B4B]
                mb-3
              "
            >
              <MdDescription className="text-lg text-indigo-600" />
              Comments
            </label>

            <textarea
              className="
                w-full
                min-h-[240px]
                rounded-[24px]
                border
                border-gray-200
                bg-gray-50
                px-5
                py-4
                text-sm
                text-gray-700
                resize-y
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                focus:border-transparent
                transition-all
                duration-300
              "
              placeholder="Write detailed service notes..."
              name="comments"
              value={note.comments}
              onChange={handleInputChange}
              rows={10}
            />

            <div className="flex justify-between items-center mt-3">
              <p className="text-xs text-gray-500">
                Provide clear and detailed updates for better tracking.
              </p>

              <span
                className={`
                  text-xs
                  font-medium
                  ${
                    note.comments.length > 0
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }
                `}
              >
                {note.comments.length} characters
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            {/* CANCEL */}
            <button
              className="
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
                duration-300
              "
              onClick={onClose}
            >
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
                hover:scale-[1.02]
                transition-all
                duration-300
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

export default AddServiceNoteModal;
