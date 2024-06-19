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
                    <th className="border px-4 py-2">Parts</th>
                    <th className="border px-4 py-2">Labeling Methodology</th>
                    <th className="border px-4 py-2">Equipment Installation</th>
                    <th className="border px-4 py-2">Required Deliverables</th>
                    <th className="border px-4 py-2">
                      Deliverable Instructions
                    </th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((note, index) => (
                    <tr key={note.note_id} className="bg-white">
                      <td className="border px-4 py-2">
                        <textarea
                          className="px-2 py-2 border text-sm border-gray-200 resize-none rounded w-full"
                          name="parts"
                          value={note.parts || ""}
                          onChange={(e) => handleNoteChange(index, e)}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          className="px-2 py-2 border text-sm border-gray-200 rounded w-full"
                          name="labeling_methodology"
                          value={note.labeling_methodology || ""}
                          onChange={(e) => handleNoteChange(index, e)}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          className="px-2 py-2 border text-sm border-gray-200 rounded w-full"
                          name="equipment_installation"
                          value={note.equipment_installation || ""}
                          onChange={(e) => handleNoteChange(index, e)}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <textarea
                          className="px-2 py-2 border text-sm border-gray-200 resize-none rounded w-full"
                          name="required_deliverables"
                          value={note.required_deliverables || ""}
                          onChange={(e) => handleNoteChange(index, e)}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <textarea
                          className="px-2 py-2 border text-sm border-gray-200 resize-none rounded w-full"
                          name="deliverable_instructions"
                          value={note.deliverable_instructions || ""}
                          onChange={(e) => handleNoteChange(index, e)}
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          className="bg-blue-500 text-white px-4 py-1 rounded"
                          onClick={() => handleSaveNote(index)}
                        >
                          Edit
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
