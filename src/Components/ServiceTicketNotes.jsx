import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import AddServiceNoteModal from "./AddServiceNoteModal";
import {
  addNotesToServiceTicket,
  getServiceTicketDetails,
  deleteServiceNote,
} from "../actions/serviceTicket";
import { getClients } from "../actions/clientActions";
import { fetchIDREmployees } from "../actions/employeeActions";
import { BiSolidEditAlt } from "react-icons/bi";
import NoteTextarea from "./NoteTextarea";


const NotesTable = ({ notes, serviceTicketId,handleSaveNote ,handleNoteChange}) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const { user_type, user_id } = useSelector((state) => state.user.user);
  const { access, technicianAccess } = useSelector((state) => state.user);
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
    dispatch(addNotesToServiceTicket(newNote))
      .then((response) => {
        if (response.code === "ST201") {
          handleCloseModal();
          dispatch(getServiceTicketDetails(serviceTicketId));
          dispatch(getClients());
          dispatch(fetchIDREmployees());
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
      text: "Do you really want to delete this Comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServiceNote(noteId));
        dispatch(getServiceTicketDetails(serviceTicketId));
        dispatch(getClients());
        dispatch(fetchIDREmployees());
      }
    });
  };

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
              <th className="border px-4 py-2" style={{ width: "65%" }}>
                Comments
              </th>
              <th className="border px-4 py-2" style={{ width: "15%" }}>
                User Name
              </th>
              <th className="border px-4 py-2" style={{ width: "15%" }}>
                Date and Time
              </th>
              {technicianAccess.includes(user_type) && (
                <th className="border px-4 py-2" style={{ width: "5%" }}>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {notes?.map((note, index) => (
              <tr key={note.note_id} className="bg-white text-sm">
                <td className="border px-4 py-2" style={{ width: "60%" }}>
                  {/* <textarea
                    className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
                    name="comments"
                    value={note.comments || ""}
                    onChange={(e) => handleNoteChange(index, e)}
                    rows={8}
                    disabled={editingIndex !== index}
                  ></textarea> */}
                  <NoteTextarea note={note} index={index} handleNoteChange={handleNoteChange} editingIndex={editingIndex}/>
                </td>
                <td className="border px-4 py-2" style={{ width: "15%" }}>
                  {note?.profile?.first_name} {note?.profile?.last_name}
                </td>
                <td className="border px-4 py-2" style={{ width: "15%" }}>
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
                </td>
                {(technicianAccess.includes(user_type) ||
                  note.profile?.user_id === user_id) && (
                  <td className="border px-4 py-2" style={{ width: "5%" }}>
                    <div>
                    {editingIndex === index ? (
                      <>
                        <button
                          className="bg-indigo-600 text-white px-8 py-2 rounded"
                          onClick={() => {
                            handleSaveNote(index);
                            handleEditToggle(index);
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="bg-gray-500 text-white px-6 py-2 rounded mt-2"
                          onClick={() => handleEditToggle(index)}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                    <button
                      className="p-[4px] bg-gray-100 cursor-pointer"
                      onClick={() => handleEditToggle(index)}
                    >
                      <BiSolidEditAlt />
                    </button>
                    <button
                      className="p-[4px] bg-gray-100 cursor-pointer"
                      onClick={() => handleDelete(note.note_id)}
                    >
                      <AiFillDelete />
                    </button>
                    </>
                    )}
                  </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Note Modal */}
      <AddServiceNoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddNote}
        serviceTicketId={serviceTicketId}
      />
    </div>
  );
};

export default NotesTable;
