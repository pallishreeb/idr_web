import React, { useState } from 'react';

const AddNoteModal = ({ isOpen, onClose, onSave }) => {
  const [note, setNote] = useState({
    parts: '',
    labeling_methodology: '',
    equipment_installation: '',
    required_deliverables: '',
    deliverable_instructions: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value,
    }));
  };

  const handleSaveNote = () => {
    onSave(note); // Pass the note object to the onSave function in the parent component
    setNote({
      parts: '',
      labeling_methodology: '',
      equipment_installation: '',
      required_deliverables: '',
      deliverable_instructions: '',
    });
    onClose(); // Close the modal after saving
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Note</h2>
        <div className="mb-4">
          <label className="font-normal text-base">Parts</label>
          <textarea
            className="px-2 py-2 border text-sm border-gray-200 resize-none rounded w-full"
            name="parts"
            value={note.parts}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Labeling Methodology</label>
          <input
            type="text"
            className="px-2 py-2 border text-sm border-gray-200 rounded w-full"
            name="labeling_methodology"
            value={note.labeling_methodology}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Equipment Installation</label>
          <input
            type="text"
            className="px-2 py-2 border text-sm border-gray-200 rounded w-full"
            name="equipment_installation"
            value={note.equipment_installation}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Required Deliverables</label>
          <textarea
            className="px-2 py-2 border text-sm border-gray-200 resize-none rounded w-full"
            name="required_deliverables"
            value={note.required_deliverables}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-4">
          <label className="font-normal text-base">Deliverable Instructions</label>
          <textarea
            className="px-2 py-2 border text-sm border-gray-200 resize-none rounded w-full"
            name="deliverable_instructions"
            value={note.deliverable_instructions}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
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

export default AddNoteModal;
