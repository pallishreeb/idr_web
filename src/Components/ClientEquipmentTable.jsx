import React, { useState } from "react";
import { useSelector } from "react-redux";

const ClientEquipmentTable = ({ equipments, onAddNote }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [note, setNote] = useState("");
  const [expandedEquipments, setExpandedEquipments] = useState([]);

  const { user_type } = useSelector((state) => state.user.user);
  const { technicianAccess } = useSelector((state) => state.user);

  const openModal = (equipmentId) => {
    setSelectedEquipmentId(equipmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEquipmentId(null);
    setNote("");
  };

  // Function to toggle notes for individual equipment
  const toggleNotes = (equipmentId) => {
    setExpandedEquipments(
      (prev) =>
        prev.includes(equipmentId)
          ? prev.filter((id) => id !== equipmentId) // Remove the ID if it exists
          : [...prev, equipmentId] // Add the ID if it doesn't exist
    );
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

    onAddNote(payload);
    closeModal();
    
  };

  return (
    <>
      {equipments.length > 0 && (
        <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
          <div className="mb-2 flex justify-between">
            <h1 className="font-normal text-xl mb-2">
              Devices Added To Ticket
            </h1>
          </div>

          {/* Equipment Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-200 border rounded">
              <thead>
                <tr className="bg-gray-300 text-left">
                  <th className="border px-4 py-2">Hostname</th>
                  <th className="border px-4 py-2">Serial Number</th>
                  {technicianAccess.includes(user_type) && (
                    <th className="border px-4 py-2">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {equipments.map((equipment) => (
                  <React.Fragment key={equipment.client_equipment_id}>
                    <tr className="bg-white text-sm">
                      <td className="border px-4 py-2">
                        {equipment?.client_equipments?.mac_address}
                      </td>
                      <td className="border px-4 py-2">
                        {equipment?.client_equipments?.serial_number}
                      </td>
                      {technicianAccess.includes(user_type) ? (
                        <td className="border px-4 py-2">
                          <button
                            onClick={() =>
                              openModal(equipment.client_equipment_id)
                            }
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Add Note
                          </button>
                          <button
                            onClick={() =>
                              toggleNotes(equipment.device_linked_id)
                            }
                            className="ml-4 bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            {expandedEquipments.includes(
                              equipment.device_linked_id
                            )
                              ? "Hide Notes"
                              : "Show Notes"}
                          </button>
                        </td>
                      ) : (
                        <td className="border px-4 py-2">
                          <button
                            onClick={() =>
                              toggleNotes(equipment.device_linked_id)
                            }
                            className="ml-4 bg-gray-500 text-white px-3 py-1 rounded"
                          >
                            {expandedEquipments.includes(
                              equipment.device_linked_id
                            )
                              ? "Hide Notes"
                              : "Show Notes"}
                          </button>
                        </td>
                      )}
                    </tr>

                    {/* Collapsible Notes Section */}
                    {expandedEquipments.includes(
                      equipment.device_linked_id
                    ) && (
                      <tr>
                        <td colSpan={3} className="p-4">
                          {equipment?.client_equipments?.client_equip_histories
                            ?.length > 0 ? (
                            <div className="overflow-x-auto">
                              <table className="min-w-full bg-gray-200 border rounded">
                                <thead>
                                  <tr className="bg-gray-300 text-left">
                                    <th
                                      className="border px-4 py-2"
                                      style={{ width: "65%" }}
                                    >
                                      Notes
                                    </th>
                                    <th
                                      className="border px-4 py-2"
                                      style={{ width: "15%" }}
                                    >
                                      User Name
                                    </th>
                                    <th
                                      className="border px-4 py-2"
                                      style={{ width: "15%" }}
                                    >
                                      Date and Time
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {equipment?.client_equipments?.client_equip_histories.map(
                                    (note, index) => (
                                      <tr
                                        key={note.note_id}
                                        className="bg-white text-sm"
                                      >
                                        <td
                                          className="border px-4 py-2"
                                          style={{ width: "65%" }}
                                        >
                                          <textarea
                                            className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
                                            name="comments"
                                            value={note.comments || ""}
                                            rows={3}
                                            readOnly
                                          ></textarea>
                                        </td>
                                        <td
                                          className="border px-4 py-2"
                                          style={{ width: "15%" }}
                                        >
                                          {note.user_name || "NA"}
                                        </td>
                                        <td
                                          className="border px-4 py-2"
                                          style={{ width: "15%" }}
                                        >
                                          {new Date(
                                            note.created_at
                                          ).toLocaleString("en-US", {
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
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p>No notes available for this device.</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
