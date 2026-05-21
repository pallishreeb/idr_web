/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  toast,
} from "react-toastify";

import {
  MdNotes,
  MdClose,
  MdSave,
  MdPerson,
} from "react-icons/md";

const AddSubcontractorModal =
  ({
    isOpen,
    onClose,
    onSave,
    subcontractorId,
  }) => {
    const user =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
      );

    const [
      note,
      setNote,
    ] =
      useState({
        subcontractor_id:
          subcontractorId,

        comments:
          "",

        created_by:
          `${user?.first_name || ""} ${
            user?.last_name || ""
          }`,
      });

    /* ===========================
       UPDATE SUBCONTRACTOR ID
    =========================== */

    useEffect(() => {
      setNote(
        (
          prev,
        ) => ({
          ...prev,

          subcontractor_id:
            subcontractorId,
        }),
      );
    }, [
      subcontractorId,
    ]);

    /* ===========================
       HANDLE CHANGE
    =========================== */

    const handleInputChange =
      (e) => {
        const {
          name,
          value,
        } = e.target;

        setNote(
          (
            prevNote,
          ) => ({
            ...prevNote,

            [name]:
              value,
          }),
        );
      };

    /* ===========================
       VALIDATION
    =========================== */

    const validateStep =
      () => {
        return (
          note.comments.trim() !==
          ""
        );
      };

    /* ===========================
       SAVE
    =========================== */

    const handleSaveNote =
      () => {
        if (
          !validateStep()
        ) {
          toast.error(
            "Comment can't be empty.",
          );

          return;
        }

        onSave(
          note,
        );

        setNote(
          (
            prev,
          ) => ({
            ...prev,

            comments:
              "",
          }),
        );

        onClose();
      };

    if (
      !isOpen
    )
      return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        {/* MODAL */}
        <div className="w-full max-w-lg bg-white rounded-[30px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* TOP BAR */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-6 md:p-7">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* ICON */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                  <MdNotes className="text-2xl" />
                </div>

                <div>
                  {/* SMALL TITLE */}
                  <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                    Add Note
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Add comments
                    for this
                    subcontractor
                  </p>
                </div>
              </div>

              {/* CLOSE */}
              <button
                onClick={
                  onClose
                }
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all duration-300"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* USER */}
            <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
                  <MdPerson className="text-indigo-500 text-xl" />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Created By
                  </p>

                  <p className="text-sm font-semibold text-[#1E1B4B]">
                    {
                      note.created_by
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* COMMENT */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                Comments
              </label>

              <textarea
                className="w-full px-4 py-4 border border-gray-200 rounded-2xl bg-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                name="comments"
                value={
                  note.comments
                }
                onChange={
                  handleInputChange
                }
                rows={
                  5
                }
                placeholder="Write your comments here..."
              />
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-300"
                onClick={
                  onClose
                }
              >
                Cancel
              </button>

              <button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                onClick={
                  handleSaveNote
                }
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

export default AddSubcontractorModal;