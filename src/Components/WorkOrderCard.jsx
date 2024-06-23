/* eslint-disable react/prop-types */
import React from "react";

const WorkOrderCard = ({
  workOrder,
  clients,
  locations,
  clientEmployees,
  handleWorkOrderChange,
  handleSaveTicket,
}) => {
  return (
    <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="text-xl font-normal mb-2">Work Order Ticket</h1>
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded"
          onClick={handleSaveTicket}
        >
          Save Ticket
        </button>
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
          <label className="font-normal text-base">Client Name</label>
          <input
            type="text"
            name="client_name"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.client_name || ""}
            readOnly
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
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Job Location</label>
          <input
            type="text"
            placeholder="Type job location"
            name="job_location"
            className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.job_location || ""}
            onChange={(e) => handleWorkOrderChange(e)}
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
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-normal text-base">Status</label>
          <select
            name="status"
            className="px-3 border border-gray-200 h-10 text-sm rounded"
            value={workOrder.status || ""}
            onChange={(e) => handleWorkOrderChange(e)}
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
          />
        </div>
      </div>
    </div>
  );
};

export default WorkOrderCard;
