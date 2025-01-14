import React, { useState } from "react";
import { useSelector } from "react-redux";
const ClientEquipmentTable = ({ equipments, onAddNote }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [note, setNote] = useState("");
  const { user_type } = useSelector((state) => state.user.user);
  const {  technicianAccess} = useSelector((state) => state.user);
  const openModal = (equipmentId) => {
    setSelectedEquipmentId(equipmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEquipmentId(null);
    setNote("");
  };

  const handleAddNote = () => {
    if (note.trim() === "") {
      alert("Note cannot be empty.");
      return;
    }

    const payload = {
      client_equipment_id: selectedEquipmentId,
      comments: note,
    };

    onAddNote(payload); // Pass the payload to the parent component's function
    closeModal();
  };

  return (
    <>
      {equipments.length > 0 && (
        <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
          <div className="mb-2 flex justify-between">
            <h1 className="font-normal text-xl mb-2">Devices Added To Ticket</h1>
          </div>

          {/* Table for notes */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-200 border rounded">
              <thead>
                <tr className="bg-gray-300 text-left">
                  <th className="border px-4 py-2">Hostname</th>
                  <th className="border px-4 py-2">Serial Number</th>
                  {technicianAccess.includes(user_type) && 
                  <th className="border px-4 py-2">Action</th>}
                </tr>
              </thead>
              <tbody>
                {equipments?.map((equipment) => (
                  <tr
                    key={equipment.client_equipment_id}
                    className="bg-white text-sm"
                  >
                    <td className="border px-4 py-2">
                      {equipment?.client_equipments?.mac_address}
                    </td>
                    <td className="border px-4 py-2">
                      {equipment?.client_equipments?.serial_number}
                    </td>
                    {technicianAccess.includes(user_type) && 
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => openModal(equipment.client_equipment_id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Add Note
                      </button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-1/3">
            <h3 className="text-lg font-semibold mb-4">Add Note</h3>
            <textarea
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
              rows={5}
              placeholder="Enter your note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 gap-3">
              <button
                onClick={handleAddNote}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Note
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientEquipmentTable;
