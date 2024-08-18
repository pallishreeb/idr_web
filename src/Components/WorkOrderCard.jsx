/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const WorkOrderCard = ({
  workOrder,
  clients,
  locations,
  clientEmployees,
  handleWorkOrderChange,
  handleSaveTicket,
  isEditing,
  setIsEditing
}) => {
  // const [isEditing, setIsEditing] = useState(false);
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (workOrder.location_id) {
      const selectedLocation = locations.find(location => location.location_id === workOrder.location_id);
      if (selectedLocation) {
        handleWorkOrderChange({ target: { name: "address_line_one", value: selectedLocation.address_line_one } });
        handleWorkOrderChange({ target: { name: "city", value: selectedLocation.city } });
        handleWorkOrderChange({ target: { name: "state", value: selectedLocation.state } });
        handleWorkOrderChange({ target: { name: "zipcode", value: selectedLocation.zipcode } });
        handleWorkOrderChange({ target: { name: "address_line_two", value: selectedLocation.address_line_two } });
        handleWorkOrderChange({ target: { name: "address_line_three", value: selectedLocation.address_line_three } });
      }
    }
  }, [workOrder.location_id, locations]);

  return (
    <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="text-xl font-normal mb-2">Work Order Ticket - {workOrder?.ticket_number}</h1>
        {access.includes(user_type) && 
        <div>
          {isEditing ? (
            <>
              <button
              className="bg-indigo-600 text-white px-6 py-2 rounded"
              onClick={handleSaveTicket}
            >
              Save Ticket
            </button>
               <button
               className="bg-gray-500 text-white px-6 py-2 rounded ml-2"
               onClick={handleEditToggle}
             >
               Cancel
             </button>
            </>
          ) : (
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
        </div>}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Choose Client</label>
          <select
            name="client_id"
            className="px-3 border border-gray-200 h-10 text-sm rounded"
            required
            value={workOrder.client_id || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          >
            <option value="">Choose Option</option>
            {clients?.data?.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.company_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Choose Location</label>
          <select
            name="location_id"
            className="px-3 border border-gray-200 h-10 text-sm rounded"
            required
            value={workOrder.location_id || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          >
            <option value="">Choose Option</option>
            {locations.map((location) => (
              <option key={location.location_id} value={location.location_id}>
                {location.address_line_one}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Address Line 1</label>
          <input
            type="text"
            name="address_line_two"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.address_line_two || "NA"}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Address Line 2</label>
          <input
            type="text"
            name="address_line_three"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.address_line_three || "NA"}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">City</label>
          <input
            type="text"
            name="city"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.city || ""}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">State</label>
          <input
            type="text"
            name="state"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.state || ""}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Zip Code</label>
          <input
            type="text"
            name="zipcode"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.zipcode || ""}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Client Name</label>
          <input
            type="text"
            name="client_name"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.client_name || ""}
            readOnly
            disabled={!isEditing}
          />
        </div>

        {/* Add other fields similarly */}
        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Contact Person</label>
          <select
            name="contact_person"
            className="px-3 py-3 border border-gray-200 text-sm rounded"
            required
            value={workOrder.contact_person || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          >
            <option value="">Choose Contact Person</option>
            {clientEmployees.map((employee) => (
              <option
                key={employee.client_emp_id}
                value={employee.first_name + " " + employee.last_name}
              >
                {employee.first_name} {employee.last_name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Contact Phone Number</label>
          <input
            type="text"
            placeholder="Type contact phone number"
            name="contact_phone_number"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded w-full"
            value={workOrder.contact_phone_number || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            required
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Contact Email id</label>
          <input
            type="email"
            placeholder="Type contact mail id"
            name="contact_mail_id"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.contact_mail_id || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Customer PO Number</label>
          <input
            type="text"
            placeholder="Type po number"
            name="po_number"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.po_number || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Service date</label>
          <input
            type="date"
            placeholder="type"
            name="service_date"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.service_date || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            required
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Service Location</label>
          <input
            type="text"
            placeholder="Type job location"
            name="job_location"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.job_location || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Service Request</label>
          <input
            type="text"
            placeholder="Type Service Request"
            name="issue"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.issue || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            required
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Status</label>
          <select
            name="status"
            className="px-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.status || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          >
            <option value="Open">Open</option>
            <option value="Design">Design</option>
            <option value="In Progress">In Progress</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Local Onsite Contact</label>
          <input
            type="text"
            placeholder="Type Local Onsite Contact"
            name="local_onsite_person"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.local_onsite_person || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">
            Local Onsite Contact Phone Number
          </label>
          <input
            type="text"
            placeholder="Type Local Contact Number"
            name="local_onsite_person_contact"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.local_onsite_person_contact || ""}
            onChange={(e) => handleWorkOrderChange(e)}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkOrderCard;
