/** @format */

import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import { toast } from "react-toastify";

import { MdNoteAdd, MdClose, MdSave, MdPerson } from "react-icons/md";

const AddRmaNoteModal = ({ isOpen, onClose, onSave, rmaId }) => {
  const user = useSelector((state) => state.user.user);

  const [note, setNote] = useState({
    rma_id: rmaId,
    comments: "",
    created_by: user?.first_name + " " + user?.last_name,
  });

  useEffect(() => {
    setNote({
      rma_id: rmaId,
      comments: "",
      created_by: user?.first_name + " " + user?.last_name,
    });
  }, [rmaId, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const validateStep = () => {
    return note.comments.trim() !== "";
  };

  const handleSaveNote = () => {
    if (!validateStep()) {
      toast.error("Comment can't be empty.");

      return;
    }

    onSave(note);

    setNote({
      rma_id: rmaId,
      comments: "",
      created_by: user?.first_name + " " + user?.last_name,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        p-4
      "
    >
      <div
        className="
          bg-white
          rounded-[24px]
          shadow-2xl
          w-full
          max-w-2xl
          overflow-hidden
          animate-fadeIn
        "
      >
        {/* TOP BORDER */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6">
          {/* HEADER */}
          <div className="flex items-start justify-between mb-6">
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
                <MdNoteAdd className="text-2xl" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#1E1B4B]">
                  Add RMA Note
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Add comments or updates related to this RMA
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={onClose}
              className="
                w-10
                h-10
                rounded-xl
                bg-gray-100
                text-gray-500
                flex
                items-center
                justify-center
                hover:bg-gray-200
                transition-all
              "
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* CREATED BY */}
          <div
            className="
              flex
              items-center
              gap-3
              bg-gray-50
              border
              border-gray-100
              rounded-2xl
              px-4
              py-3
              mb-5
            "
          >
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
                {note.created_by}
              </p>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#1E1B4B] mb-3">
              Comments
            </label>

            <textarea
              className="
                w-full
                rounded-2xl
                border
                border-gray-200
                px-4
                py-4
                text-sm
                resize-y
                min-h-[180px]
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
                transition-all
              "
              name="comments"
              placeholder="Write your RMA comments or updates here..."
              value={note.comments}
              onChange={handleInputChange}
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
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
                bg-white
                text-gray-700
                text-sm
                font-semibold
                hover:bg-gray-50
                transition-all
              "
              onClick={onClose}
            >
              <MdClose className="text-lg" />
              Cancel
            </button>

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

export default AddRmaNoteModal;
