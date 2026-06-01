/** @format */

import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import {
  MdEdit,
  MdSave,
  MdClose,
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdEmail,
  MdCalendarToday,
  MdDescription,
  MdConfirmationNumber,
  MdInfo,
} from "react-icons/md";

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
  const { user_type } = useSelector((state) => state.user.user);

  const { access } = useSelector((state) => state.user);

  const newAccess = ["Subcontractor_User", "Subcontractor"];

  // =========================
  // EDIT TOGGLE
  // =========================

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  // =========================
  // AUTO FILL LOCATION
  // =========================

  useEffect(() => {
    if (serviceTicket.location_id) {
      const selectedLocation = locations.find(
        (location) => location.location_id === serviceTicket.location_id,
      );

      if (selectedLocation) {
        [
          "address_line_one",
          "address_line_two",
          "address_line_three",
          "city",
          "state",
          "zipcode",
        ].forEach((field) => {
          handleServiceTicketChange({
            target: {
              name: field,
              value: selectedLocation[field],
            },
          });
        });
      }
    }
  }, [serviceTicket?.location_id, locations]);

  // =========================
  // FIELD ACCESS
  // =========================

  const isFieldDisabled = (fieldName) => {
    if (user_type === "IDR Employee") {
      return fieldName !== "status";
    }

    return !isEditing || !access.includes(user_type);
  };

  return (
    <div
      className="
        mt-5
        bg-white
        border
        border-gray-100
        rounded-[30px]
        shadow-sm
        overflow-hidden
      "
    >
      {/* TOP BORDER */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      <div className="p-5 md:p-7">
        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-gradient-to-r
       from-[#312E81]
via-[#4338CA]
to-[#6366F1]
                text-white
                flex
                items-center
                justify-center
                shadow-md
              "
            >
              <MdConfirmationNumber className="text-3xl" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#1E1B4B]">
                Service Ticket
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Ticket # {serviceTicket?.service_ticket_number}
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          {(access.includes(user_type) || user_type === "IDR Employee") && (
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  {/* SAVE */}
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      px-6
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                    "
                    onClick={handleSaveTicket}
                  >
                    <MdSave className="text-lg" />
                    Save Ticket
                  </button>

                  {/* CANCEL */}
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      px-6
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-100
                      text-gray-700
                      text-sm
                      font-semibold
                      hover:bg-gray-200
                      transition-all
                    "
                    onClick={handleEditToggle}
                  >
                    <MdClose className="text-lg" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    text-sm
                    font-semibold
                    shadow-md
                    hover:shadow-lg
                    hover:scale-[1.02]
                    transition-all
                  "
                  onClick={() => setIsEditing(true)}
                >
                  <MdEdit className="text-lg" />
                  Edit Ticket
                </button>
              )}
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* CLIENT */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
              <MdBusiness className="text-indigo-600" />
              Choose Client
            </label>

            <select
              name="client_id"
              value={serviceTicket.client_id || ""}
              onChange={handleServiceTicketChange}
              disabled={isFieldDisabled("client_id")}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                px-4
                text-sm
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            >
              <option value="">Choose Option</option>

              {clients?.data?.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* LOCATION */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
              <MdLocationOn className="text-indigo-600" />
              Choose Location
            </label>

            <select
              name="location_id"
              value={serviceTicket.location_id || ""}
              onChange={handleServiceTicketChange}
              disabled={isFieldDisabled("location_id")}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                px-4
                text-sm
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            >
              <option value="">Choose Option</option>

              {locations.map((location) => (
                <option key={location.location_id} value={location.location_id}>
                  {location.address_line_one}
                </option>
              ))}
            </select>
          </div>

          {/* CLIENT NAME */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              Client Name
            </label>

            <input
              type="text"
              value={serviceTicket.client_name || ""}
              readOnly
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
              "
            />
          </div>

          {/* ADDRESS 1 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              Address Line 1
            </label>

            <input
              type="text"
              value={serviceTicket.address_line_two || "NA"}
              readOnly
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
              "
            />
          </div>

          {/* ADDRESS 2 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              Address Line 2
            </label>

            <input
              type="text"
              value={serviceTicket.address_line_three || "NA"}
              readOnly
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
              "
            />
          </div>

          {/* CITY */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">City</label>

            <input
              type="text"
              value={serviceTicket.city || ""}
              readOnly
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
              "
            />
          </div>

          {/* STATE */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              State
            </label>

            <input
              type="text"
              value={serviceTicket.state || ""}
              readOnly
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
              "
            />
          </div>

          {/* ZIPCODE */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              Zip Code
            </label>

            <input
              type="text"
              value={serviceTicket.zipcode || ""}
              readOnly
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                px-4
                text-sm
              "
            />
          </div>

          {/* CONTACT PERSON */}
          {!newAccess.includes(user_type) && (
            <>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
                  <MdPerson className="text-indigo-600" />
                  Contact Person
                </label>

                <select
                  name="contact_person"
                  value={serviceTicket.contact_person || ""}
                  onChange={handleServiceTicketChange}
                  disabled={isFieldDisabled("contact_person")}
                  className="
                    w-full
                    h-12
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    text-sm
                    bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                >
                  <option value="">Choose Contact Person</option>

                  {clientEmployees.map((employee) => (
                    <option
                      key={employee.client_emp_id}
                      value={`${employee.first_name} ${employee.last_name}`}
                    >
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PHONE */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
                  <MdPhone className="text-indigo-600" />
                  Contact Phone
                </label>

                <input
                  type="text"
                  name="contact_phone_number"
                  value={serviceTicket.contact_phone_number || ""}
                  readOnly
                  className="
                    w-full
                    h-12
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    text-sm
                  "
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
                  <MdEmail className="text-indigo-600" />
                  Contact Email
                </label>

                <input
                  type="email"
                  name="contact_email"
                  value={serviceTicket.contact_email || ""}
                  readOnly
                  className="
                    w-full
                    h-12
                    rounded-2xl
                    border
                    border-gray-200
                    bg-gray-50
                    px-4
                    text-sm
                  "
                />
              </div>
            </>
          )}

          {/* CUSTOMER PO */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              Customer PO Number
            </label>

            <input
              type="text"
              name="customer_po"
              value={serviceTicket.customer_po || ""}
              onChange={handleServiceTicketChange}
              disabled={isFieldDisabled("customer_po")}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                px-4
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>

          {/* SERVICE DATE */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
              <MdCalendarToday className="text-indigo-600" />
              Service Date
            </label>

            <input
              type="date"
              name="service_date"
              value={serviceTicket.service_date || ""}
              onChange={handleServiceTicketChange}
              disabled={isFieldDisabled("service_date")}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                px-4
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            />
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B]">
              <MdInfo className="text-indigo-600" />
              Status
            </label>

            <select
              name="status"
              value={serviceTicket.status || ""}
              onChange={handleServiceTicketChange}
              disabled={!isEditing}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                px-4
                text-sm
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            >
              <option value="Open">Open</option>

              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* BILLED */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E1B4B]">
              Billed
            </label>

            <select
              name="is_billed"
              value={serviceTicket.is_billed || ""}
              onChange={handleServiceTicketChange}
              disabled={!isEditing}
              className="
                w-full
                h-12
                rounded-2xl
                border
                border-gray-200
                px-4
                text-sm
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500
              "
            >
              <option value="">Choose Option</option>

              <option value="Yes">Yes</option>

              <option value="No">No</option>

              <option value="Service Agreement">Service Agreement</option>

              <option value="Warranty">Warranty</option>

              <option value="Courtesy">Courtesy</option>
            </select>
          </div>
        </div>

        {/* FULL WIDTH SECTION */}
        <div className="mt-8">
          <label className="flex items-center gap-2 text-sm font-semibold text-[#1E1B4B] mb-3">
            <MdDescription className="text-indigo-600 text-lg" />
            Service Ticket Details
          </label>

          <textarea
            rows={10}
            name="service_ticket_details"
            value={serviceTicket.service_ticket_details || ""}
            onChange={handleServiceTicketChange}
            disabled={isFieldDisabled("service_ticket_details")}
            className="
              w-full
              min-h-[220px]
              rounded-[24px]
              border
              border-gray-200
              bg-gray-50
              px-5
              py-4
              text-sm
              text-gray-700
              resize-y
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              transition-all
            "
            placeholder="Enter detailed service ticket information..."
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceTicketCard;
