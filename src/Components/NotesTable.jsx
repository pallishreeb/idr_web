import React, {useState} from 'react';
import { useDispatch } from "react-redux";
import AddNoteModal from './AddNoteModal'; 
import {  addNotesToTicket,getWorkOrderDetails } from '../actions/workOrderActions';
import { getClients } from "../actions/clientActions";
import { fetchIDREmployees } from "../actions/employeeActions";


const NotesTable = ({ notes, handleSaveNote, handleNoteChange ,workOrderId}) => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

  
    const handleOpenModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };
    
      const handleAddNote = (newNote) => {
        // dispatch(addNotesToTicket(newNote)); 
        dispatch(addNotesToTicket(newNote))
        .then(response => {
          if (response.code == "WO201") {
            // navigate("/workorder");
            handleCloseModal();
            dispatch(getWorkOrderDetails(workOrderId));
            dispatch(getClients());
            dispatch(fetchIDREmployees());
          } else {
            console.error("Error adding notes:", response.error);
          }
        })
        .catch(error => {
          console.error("API call error:", error);
        });

      };
  return (
    <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2">Notes</h1>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded"
          onClick={handleOpenModal}
        >
          Add Note
        </button>
      </div>

      {/* Table for notes */}
      <div className="overflow-x-auto">
  <table className="min-w-full bg-gray-200 border rounded">
    <thead>
      <tr className="bg-gray-300">
        <th className="border px-4 py-2" style={{ width: '90%' }}>Comments</th>
        <th className="border px-4 py-2" style={{ width: '10%' }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {notes?.map((note, index) => (
        <tr key={note.note_id} className="bg-white">
          <td className="border px-4 py-2" style={{ width: '90%' }}>
            <textarea
              className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
              name="comments"
              value={note.comments || ""}
              onChange={(e) => handleNoteChange(index, e)}
              rows={3}
            ></textarea>
          </td>
          <td className="border px-4 py-2" style={{ width: '10%' }}>
            <button
              className="bg-indigo-600 text-white px-4 py-1 rounded"
              onClick={() => handleSaveNote(index)}
            >
              Save
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      {/* Add Note Modal */}
      <AddNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNote}
        workOrderId={workOrderId}
      />
    </div>
  );
};

export default NotesTable;
