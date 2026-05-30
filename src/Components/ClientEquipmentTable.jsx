/** @format */

import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  MdDevices,
  MdAdd,
  MdEdit,
  MdNotes,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdClose,
  MdSave,
  MdAssignment,
  MdBuild,
} from "react-icons/md";

const ClientEquipmentTable = ({
  equipments,
  serviceTicketId,
  onAddNote,
  serviceTicket,
}) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

  const [note, setNote] = useState("");

  const [expandedEquipments, setExpandedEquipments] = useState([]);

  const { user_type } = useSelector((state) => state.user.user);

  const { technicianAccess } = useSelector((state) => state.user);

  // ========================
  // ACCESS CONTROLS
  // ========================

  const subcontractorAccess = ["Subcontractor_User", "Subcontractor"];

  const addRmaAccess = [...technicianAccess, ...subcontractorAccess];

  const canAddNote = addRmaAccess.includes(user_type);

  const canViewEquipment = technicianAccess.includes(user_type);

  const canAddClientEquip = subcontractorAccess.includes(user_type);

  const canViewRMA = addRmaAccess.includes(user_type);

  const canToggleNotes = true;

  const isTicketClosed = serviceTicket?.status?.toLowerCase() === "closed";

  // ========================
  // MODAL
  // ========================

  const openModal = (equipmentId) => {
    setSelectedEquipmentId(equipmentId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEquipmentId(null);
    setNote("");
  };

  // ========================
  // TOGGLE NOTES
  // ========================

  const toggleNotes = (equipmentId) => {
    setExpandedEquipments((prev) =>
      prev.includes(equipmentId)
        ? prev.filter((id) => id !== equipmentId)
        : [...prev, equipmentId],
    );
  };

  // ========================
  // ADD NOTE
  // ========================

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

  // ========================
  // EMPTY STATE
  // ========================

  if (!equipments?.length) {
    return null;
  }

  return (
    <>
      <div
        className="
          bg-white
          rounded-[24px]
          border
          border-gray-100
          shadow-sm
          overflow-hidden
          mt-5
        "
      >
        {/* TOP BORDER */}
        <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
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
                <MdDevices className="text-2xl" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#1E1B4B]">
                  Devices Added To Ticket
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage devices, notes, and RMA requests
                </p>
              </div>
            </div>

            {/* ADD EQUIPMENT */}
            {canAddClientEquip && !isTicketClosed && (
              <button
                onClick={() =>
                  navigate(
                    `/add-client-equipment/${serviceTicket?.client_id}/${serviceTicket?.location_id}/?&sort_key=device_type&sort_direction=ASC`,
                    {
                      state: {
                        serviceTicketId,
                        returnTo: "edit-service-ticket",
                      },
                    },
                  )
                }
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
              >
                <MdAdd className="text-lg" />
                Add Client Equipment
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="
                      px-4
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                      whitespace-nowrap
                    "
                  >
                    Hostname
                  </th>

                  <th
                    className="
                      px-4
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                      whitespace-nowrap
                    "
                  >
                    Serial Number
                  </th>

                  <th
                    className="
                      px-4
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                      whitespace-nowrap
                    "
                  >
                    Notes
                  </th>

                  <th
                    className="
                      px-4
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-500
                      whitespace-nowrap
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {equipments.map((equipment) => {
                  const histories =
                    equipment?.client_equipments?.client_equip_histories || [];

                  const isExpanded = expandedEquipments.includes(
                    equipment.device_linked_id,
                  );

                  return (
                    <React.Fragment key={equipment.client_equipment_id}>
                      <tr
                        className="
                          border-t
                          border-gray-100
                          hover:bg-indigo-50/30
                          transition-all
                        "
                      >
                        {/* HOSTNAME */}
                        <td className="px-4 py-5 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-semibold text-[#1E1B4B]">
                              {equipment?.client_equipments?.device_id || "NA"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Device Hostname
                            </p>
                          </div>
                        </td>

                        {/* SERIAL */}
                        <td className="px-4 py-5 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {equipment?.client_equipments?.serial_number ||
                                "NA"}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Serial Number
                            </p>
                          </div>
                        </td>

                        {/* NOTES */}
                        <td className="px-4 py-5 whitespace-nowrap">
                          <button
                            onClick={() =>
                              toggleNotes(equipment.device_linked_id)
                            }
                            className="
                              flex
                              items-center
                              gap-2
                              px-4
                              py-2.5
                              rounded-xl
                              bg-gray-100
                              text-gray-700
                              text-sm
                              font-medium
                              hover:bg-gray-200
                              transition-all
                            "
                          >
                            <MdNotes className="text-lg" />

                            {isExpanded ? "Hide Notes" : "Show Notes"}

                            <span
                              className="
                                bg-white
                                px-2
                                py-0.5
                                rounded-full
                                text-xs
                                font-semibold
                              "
                            >
                              {histories.length}
                            </span>

                            {isExpanded ? (
                              <MdKeyboardArrowUp className="text-lg" />
                            ) : (
                              <MdKeyboardArrowDown className="text-lg" />
                            )}
                          </button>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-5">
                          <div className="flex flex-wrap gap-3">
                            {/* ADD NOTE */}
                            {canAddNote && (
                              <button
                                onClick={() =>
                                  openModal(equipment.client_equipment_id)
                                }
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  px-4
                                  py-2.5
                                  rounded-xl
                                  bg-indigo-600
                                  text-white
                                  text-sm
                                  font-semibold
                                  hover:bg-indigo-700
                                  transition-all
                                "
                              >
                                <MdNotes className="text-lg" />
                                Add Note
                              </button>
                            )}

                            {/* VIEW EQUIPMENT */}
                            {(canViewEquipment || canAddClientEquip) && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/edit-client-equipment/${equipment.client_equipment_id}`,
                                    canAddClientEquip
                                      ? {
                                          state: {
                                            serviceTicketId,
                                            returnTo: "edit-service-ticket",
                                          },
                                        }
                                      : undefined,
                                  )
                                }
                                className="
                                  flex
                                  items-center
                                  gap-2
                                  px-4
                                  py-2.5
                                  rounded-xl
                                  bg-blue-600
                                  text-white
                                  text-sm
                                  font-semibold
                                  hover:bg-blue-700
                                  transition-all
                                "
                              >
                                <MdEdit className="text-lg" />
                                View Equipment
                              </button>
                            )}

                            {/* ADD RMA */}
                            {canViewRMA && !isTicketClosed && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/add-device-rma/${equipment.client_equipment_id}`,
                                    {
                                      state: {
                                        serviceTicketId,
                                      },
                                    },
                                  )
                                }
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-xl
                                    bg-emerald-600
                                    text-white
                                    text-sm
                                    font-semibold
                                    hover:bg-emerald-700
                                    transition-all
                                  "
                              >
                                <MdBuild className="text-lg" />
                                Add RMA
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* NOTES SECTION */}
                      {isExpanded && (
                        <tr>
                          <td
                            colSpan={4}
                            className="bg-gray-50 px-5 py-5 border-t border-gray-100"
                          >
                            {histories.length > 0 ? (
                              <div className="space-y-4">
                                {histories.map((note) => (
                                  <div
                                    key={note.note_id}
                                    className="
                                      bg-white
                                      border
                                      border-gray-100
                                      rounded-2xl
                                      p-5
                                      shadow-sm
                                    "
                                  >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">
                                          Added By
                                        </p>

                                        <p className="text-sm font-semibold text-[#1E1B4B]">
                                          {note.user_name || "NA"}
                                        </p>
                                      </div>

                                      <div>
                                        <p className="text-xs text-gray-500 mb-1">
                                          Date & Time
                                        </p>

                                        <p className="text-sm text-gray-700">
                                          {new Date(
                                            note.created_at,
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
                                        </p>
                                      </div>
                                    </div>

                                    <textarea
                                      className="
                                        w-full
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-gray-50
                                        px-4
                                        py-4
                                        text-sm
                                        resize-none
                                        focus:outline-none
                                      "
                                      rows={6}
                                      value={note.comments || ""}
                                      readOnly
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div
                                className="
                                  py-10
                                  flex
                                  flex-col
                                  items-center
                                  justify-center
                                  text-center
                                "
                              >
                                <div
                                  className="
                                    w-16
                                    h-16
                                    rounded-full
                                    bg-gray-100
                                    flex
                                    items-center
                                    justify-center
                                    mb-4
                                  "
                                >
                                  <MdNotes className="text-3xl text-gray-400" />
                                </div>

                                <h3 className="text-base font-semibold text-[#1E1B4B]">
                                  No Notes Available
                                </h3>

                                <p className="text-sm text-gray-500 mt-2">
                                  No notes have been added for this device yet.
                                </p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD NOTE MODAL */}
      {showModal && (
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
              rounded-[28px]
              shadow-2xl
              w-full
              max-w-2xl
              overflow-hidden
            "
          >
            {/* TOP BORDER */}
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

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
                    <MdAssignment className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#1E1B4B]">
                      Add Device Note
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Add notes or updates for this equipment
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeModal}
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

              {/* TEXTAREA */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-3">
                  Note
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
                    min-h-[200px]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                  placeholder="Enter your note here..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={closeModal}
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
                >
                  <MdClose className="text-lg" />
                  Cancel
                </button>

                <button
                  onClick={handleAddNote}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-5
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                >
                  <MdSave className="text-lg" />
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientEquipmentTable;
