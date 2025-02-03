import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddRmaNoteModal = ({ isOpen, onClose, onSave, rmaId }) => {

  const user = useSelector((state) => state.user.user);

  const [note, setNote] = useState({
    rma_id: rmaId,
    comments: "",
    created_by: user?.first_name + " " + user?.last_name
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote((prevNote) => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSaveNote = () => {
    if (!validateStep()) {
      toast.error("Comment can't be empty.");
      return;
    }
    onSave(note); // Pass the note object to the onSave function in the parent component
    setNote({
      comments: "",
    });
    onClose(); // Close the modal after saving
  };
  const validateStep = () => {
    // Example validation, adjust as per your field requirements
    return (
      note.comments !== ""
    );
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Note</h2>
        <div className="mb-4">
          <label className="font-normal text-base">Comments</label>
          <textarea
            className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
            name="comments"
            value={note.comments}
            onChange={handleInputChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={handleSaveNote}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRmaNoteModal;
