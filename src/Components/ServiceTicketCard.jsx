/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const ServiceTicketCard = ({
  serviceTicket,
  clients,
  locations,
  clientEmployees,
  handleServiceTicketChange,
  handleSaveTicket,
  isEditing,
  setIsEditing,
}) => {
  // const [isEditing, setIsEditing] = useState(false);
  const { user_type } = useSelector((state) => state.user.user);
  const { access, technicianAccess } = useSelector((state) => state.user);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (serviceTicket.location_id) {
      const selectedLocation = locations.find(
        (location) => location.location_id === serviceTicket.location_id
      );
      if (selectedLocation) {
        handleServiceTicketChange({
          target: {
            name: "address_line_one",
            value: selectedLocation.address_line_one,
          },
        });
        handleServiceTicketChange({
          target: { name: "city", value: selectedLocation.city },
        });
        handleServiceTicketChange({
          target: { name: "state", value: selectedLocation.state },
        });
        handleServiceTicketChange({
          target: { name: "zipcode", value: selectedLocation.zipcode },
        });
        handleServiceTicketChange({
          target: {
            name: "address_line_two",
            value: selectedLocation.address_line_two,
          },
        });
        handleServiceTicketChange({
          target: {
            name: "address_line_three",
            value: selectedLocation.address_line_three,
          },
        });
      }
    }
  }, [serviceTicket?.location_id, locations]);

  // Helper to disable fields for IDR Employees (except status)
  const isFieldDisabled = (fieldName) => {
    if (user_type === "IDR Employee") {
      return fieldName !== "status"; // Disable all fields except status
    } else {
      return !isEditing || !access.includes(user_type); // Admins/subadmins follow edit mode
    }
  };

  return (
    <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="text-xl font-normal mb-2">
          Service Ticket - {serviceTicket?.service_ticket_number}
        </h1>
        {access.includes(user_type) && (
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
          </div>
        )}
        {user_type === "IDR Employee" && (
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
                onClick={() => {
                  setIsEditing(true); // Allow editing when closing ticket
                  // handleServiceTicketChange({ target: { name: "status", value: "Closed" } });
                }}
              >
                Edit Ticket
              </button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Choose Client</label>
          <select
            name="client_id"
            className="px-3 border border-gray-200 h-10 text-sm rounded"
            required
            value={serviceTicket.client_id || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("client_id")}
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
            value={serviceTicket.location_id || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("location_id")}
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
            value={serviceTicket.address_line_two || "NA"}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Address Line 2</label>
          <input
            type="text"
            name="address_line_three"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.address_line_three || "NA"}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">City</label>
          <input
            type="text"
            name="city"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.city || ""}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">State</label>
          <input
            type="text"
            name="state"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.state || ""}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Zip Code</label>
          <input
            type="text"
            name="zipcode"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.zipcode || ""}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Client Name</label>
          <input
            type="text"
            name="client_name"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.client_name || ""}
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
            value={serviceTicket.contact_person || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("contact_person")}
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
            value={serviceTicket.contact_phone_number || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            required
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Contact Email id</label>
          <input
            type="email"
            placeholder="Type contact mail id"
            name="contact_email"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.contact_email || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Customer PO Number</label>
          <input
            type="text"
            placeholder="Type po number"
            name="customer_po"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.customer_po || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("customer_po")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Service date</label>
          <input
            type="date"
            placeholder="type"
            name="service_date"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.service_date || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            required
            disabled={isFieldDisabled("service_date")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Service Location</label>
          <input
            type="text"
            placeholder="Type job location"
            name="service_location"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.service_location || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("service_location")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Service Request</label>
          <input
            type="text"
            placeholder="Type Service Request"
            name="service_request"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.service_request || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            required
            disabled={isFieldDisabled("service_request")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Status</label>
          <select
            name="status"
            className="px-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.status || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={!isEditing}
          >
            <option value="Open">Open</option>
            {/* <option value="Design">Design</option> */}
            {/* <option value="In Progress">In Progress</option> */}
            {/* <option value="Reviewing">Reviewing</option> */}
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Local Onsite Contact</label>
          <input
            type="text"
            placeholder="Type Local Onsite Contact"
            name="local_onsite_contact"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.local_onsite_contact || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("local_onsite_contact")}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">
            Local Onsite Contact Phone Number
          </label>
          <input
            type="text"
            placeholder="Type Local Contact Number"
            name="local_onsite_contact_number"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.local_onsite_contact_number || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("local_onsite_contact_number")}
          />
        </div>
        <div className="flex flex-col gap-2">
        <label className="font-normal text-base">Billed</label>
        <select
          name="is_billed"
          className="px-3 border border-gray-200 h-10 text-sm rounded"
          value={serviceTicket.is_billed || ""}
          onChange={handleServiceTicketChange}
          disabled={!isEditing}
        >
          <option value="">Choose Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">
            Service Ticket Details
          </label>
          <textarea
            rows={8}
            name="service_ticket_details"
            className="px-3 py-3 border border-gray-200 min-h-[150px] text-sm rounded"
            value={serviceTicket.service_ticket_details || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={isFieldDisabled("service_ticket_details")}
          ></textarea>
        </div>
        {/* <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Ticket Notes</label>
          <textarea
            rows={3}
            name="ticket_notes"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={serviceTicket.ticket_notes || ""}
            onChange={(e) => handleServiceTicketChange(e)}
            disabled={!isEditing}
          ></textarea>
        </div> */}
      </div>

    </div>
  );
};

export default ServiceTicketCard;
