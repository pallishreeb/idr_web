import React, { useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import Swal from 'sweetalert2';
import AddRmaNoteModal from './AddRmaNoteModal'; 
import { addNotesToRma, getRMADetails, deleteRmaNote } from "../actions/rmaActions";
import { getClients } from "../actions/clientActions";
import { fetchIDREmployees } from "../actions/employeeActions";

const RmaNotes = ({ notes, rmaId }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { user_type,user_id } = useSelector((state) => state.user.user);
  const { access , technicianAccess} = useSelector((state) => state.user);

//   const handleEditToggle = (index) => {
//     setEditingIndex(index === editingIndex ? null : index);
//   };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddNote = (newNote) => {
    dispatch(addNotesToRma(newNote))
      .then(response => {
        if (response.code === "RMA201") {
          dispatch(getRMADetails(rmaId));
          window.location.reload();
          handleCloseModal();


        } else {
          console.error("Error adding notes:", response.error);
        }
      })
      .catch(error => {
        console.error("API call error:", error);
      });
  };

  const handleDelete = (noteId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this Comment?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteRmaNote(noteId)).then(() =>{
            dispatch(getRMADetails(rmaId));
        });

      }
  
    });
  };
  const addAccess = ["Admin", "Subadmin", "IDR Employee"];
  return (
    <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2">Notes</h1>
        {technicianAccess.includes(user_type) && (
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded"
          onClick={handleOpenModal}
        >
          Add Note
        </button>
        )}
      </div>

      {/* Table for notes */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-200 border rounded">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="border px-4 py-2" style={{ width: '65%' }}>Comments</th>
              <th className="border px-4 py-2" style={{ width: '15%' }}>User Name</th>
              <th className="border px-4 py-2" style={{ width: '15%' }}>Date and Time</th>
              {user_type === "Admin"  && 
              <th className="border px-4 py-2" style={{ width: '5%' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {notes?.map((note, index) => (
              <tr key={note.note_id} className="bg-white text-sm">
                <td className="border px-4 py-2" style={{ width: '60%' }}>
                  <textarea
                    className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
                    name="comments"
                    value={note.comments || ""}
                    rows={3}
                    disabled={editingIndex !== index}
                  ></textarea>
                </td>
                <td className="border px-4 py-2" style={{ width: '15%' }}>
                  {note?.created_by}
                </td>
                <td className="border px-4 py-2" style={{ width: '15%' }}>
                {new Date(note.created_at).toLocaleString('en-US', {
                    timeZone: 'America/New_York',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </td>
                {user_type === "Admin" && (
                <td className="border px-4 py-2" style={{ width: '5%' }}>
                      <button
                      className="p-[4px] bg-gray-100 cursor-pointer"
                      onClick={() => handleDelete(note.note_id)}
                    >
                      <AiFillDelete/>
                    </button>
                </td>
                )}
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Note Modal */}
      <AddRmaNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNote}
        rmaId={rmaId}
      />
    </div>
  );
};

export default RmaNotes;
