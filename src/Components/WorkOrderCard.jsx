/**
 * eslint-disable react/prop-types
 *
 * @format
 */

import React, {
  useEffect,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  MdEdit,
  MdSave,
  MdClose,
  MdAssignment,
} from "react-icons/md";

const WorkOrderCard = ({
  workOrder,
  clients,
  locations,
  clientEmployees,
  handleWorkOrderChange,
  handleSaveTicket,
  isEditing,
  setIsEditing,
}) => {
  const {
    user_type,
  } =
    useSelector(
      (
        state,
      ) =>
        state.user.user,
    );

  const {
    access,
  } =
    useSelector(
      (
        state,
      ) =>
        state.user,
      );

  const handleEditToggle =
    () => {
      setIsEditing(
        !isEditing,
      );
    };

  useEffect(() => {
    if (
      workOrder.location_id
    ) {
      const selectedLocation =
        locations.find(
          (
            location,
          ) =>
            location.location_id ===
            workOrder.location_id,
        );

      if (
        selectedLocation
      ) {
        handleWorkOrderChange(
          {
            target:
              {
                name: "address_line_one",
                value:
                  selectedLocation.address_line_one,
              },
          },
        );

        handleWorkOrderChange(
          {
            target:
              {
                name: "city",
                value:
                  selectedLocation.city,
              },
          },
        );

        handleWorkOrderChange(
          {
            target:
              {
                name: "state",
                value:
                  selectedLocation.state,
              },
          },
        );

        handleWorkOrderChange(
          {
            target:
              {
                name: "zipcode",
                value:
                  selectedLocation.zipcode,
              },
          },
        );

        handleWorkOrderChange(
          {
            target:
              {
                name: "address_line_two",
                value:
                  selectedLocation.address_line_two,
              },
          },
        );

        handleWorkOrderChange(
          {
            target:
              {
                name: "address_line_three",
                value:
                  selectedLocation.address_line_three,
              },
          },
        );
      }
    }
  }, [
    workOrder.location_id,
    locations,
  ]);

  const newAccess =
    [
      "Subcontractor_User",
      "Subcontractor",
    ];

  const inputClass = `
    w-full
    rounded-2xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-700
    focus:outline-none
    focus:ring-2
    focus:ring-indigo-500
    focus:border-transparent
    transition-all
    duration-200
    disabled:bg-gray-50
    disabled:text-gray-500
  `;

  const labelClass =
    "text-sm font-medium text-[#1E1B4B]";

  return (
    <div className="mt-4 bg-white border border-gray-100 rounded-[30px] shadow-sm overflow-hidden">
      {/* TOP BAR */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      <div className="p-5 md:p-7">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
              <MdAssignment className="text-2xl" />
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                Work Order
                Ticket
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Ticket #
                {workOrder?.ticket_number ||
                  "NA"}
              </p>
            </div>
          </div>

          {/* ACTIONS */}
          {access.includes(
            user_type,
          ) && (
            <div className="flex flex-wrap gap-3">
              {isEditing ? (
                <>
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
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
                      duration-300
                    "
                    onClick={
                      handleSaveTicket
                    }
                  >
                    <MdSave className="text-lg" />
                    Save
                    Ticket
                  </button>

                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      px-5
                      py-2.5
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-100
                      text-gray-700
                      text-sm
                      font-semibold
                      hover:bg-gray-200
                      transition-all
                      duration-300
                    "
                    onClick={
                      handleEditToggle
                    }
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
                    px-5
                    py-2.5
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
                    duration-300
                  "
                  onClick={
                    handleEditToggle
                  }
                >
                  <MdEdit className="text-lg" />
                  Edit
                </button>
              )}
            </div>
          )}
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* CLIENT */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Choose Client
            </label>

            <select
              name="client_id"
              className={
                inputClass
              }
              required
              value={
                workOrder.client_id ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            >
              <option value="">
                Choose
                Option
              </option>

              {clients?.data?.map(
                (
                  client,
                ) => (
                  <option
                    key={
                      client.client_id
                    }
                    value={
                      client.client_id
                    }
                  >
                    {
                      client.company_name
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          {/* LOCATION */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Choose
              Location
            </label>

            <select
              name="location_id"
              className={
                inputClass
              }
              required
              value={
                workOrder.location_id ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            >
              <option value="">
                Choose
                Option
              </option>

              {locations.map(
                (
                  location,
                ) => (
                  <option
                    key={
                      location.location_id
                    }
                    value={
                      location.location_id
                    }
                  >
                    {
                      location.address_line_one
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          {/* ADDRESS 1 */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Address
              Line 1
            </label>

            <input
              type="text"
              name="address_line_two"
              className={
                inputClass
              }
              value={
                workOrder.address_line_two ||
                "NA"
              }
              readOnly
            />
          </div>

          {/* ADDRESS 2 */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Address
              Line 2
            </label>

            <input
              type="text"
              name="address_line_three"
              className={
                inputClass
              }
              value={
                workOrder.address_line_three ||
                "NA"
              }
              readOnly
            />
          </div>

          {/* CITY */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              City
            </label>

            <input
              type="text"
              name="city"
              className={
                inputClass
              }
              value={
                workOrder.city ||
                ""
              }
              readOnly
            />
          </div>

          {/* STATE */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              State
            </label>

            <input
              type="text"
              name="state"
              className={
                inputClass
              }
              value={
                workOrder.state ||
                ""
              }
              readOnly
            />
          </div>

          {/* ZIP */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Zip Code
            </label>

            <input
              type="text"
              name="zipcode"
              className={
                inputClass
              }
              value={
                workOrder.zipcode ||
                ""
              }
              readOnly
            />
          </div>

          {/* CLIENT NAME */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Client Name
            </label>

            <input
              type="text"
              name="client_name"
              className={
                inputClass
              }
              value={
                workOrder.client_name ||
                ""
              }
              readOnly
            />
          </div>

          {/* CONTACTS */}
          {!newAccess.includes(
            user_type,
          ) && (
            <>
              {/* CONTACT PERSON */}
              <div className="flex flex-col gap-2">
                <label
                  className={
                    labelClass
                  }
                >
                  Contact
                  Person
                </label>

                <select
                  name="contact_person"
                  className={
                    inputClass
                  }
                  required
                  value={
                    workOrder.contact_person ||
                    ""
                  }
                  onChange={(
                    e,
                  ) =>
                    handleWorkOrderChange(
                      e,
                    )
                  }
                  disabled={
                    !isEditing
                  }
                >
                  <option value="">
                    Choose
                    Contact
                    Person
                  </option>

                  {clientEmployees.map(
                    (
                      employee,
                    ) => (
                      <option
                        key={
                          employee.client_emp_id
                        }
                        value={`${employee.first_name} ${employee.last_name}`}
                      >
                        {
                          employee.first_name
                        }{" "}
                        {
                          employee.last_name
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* PHONE */}
              <div className="flex flex-col gap-2">
                <label
                  className={
                    labelClass
                  }
                >
                  Contact
                  Phone
                </label>

                <input
                  type="text"
                  name="contact_phone_number"
                  className={
                    inputClass
                  }
                  value={
                    workOrder.contact_phone_number ||
                    ""
                  }
                  readOnly
                />
              </div>

              {/* EMAIL */}
              <div className="flex flex-col gap-2">
                <label
                  className={
                    labelClass
                  }
                >
                  Contact
                  Email
                </label>

                <input
                  type="email"
                  name="contact_mail_id"
                  className={
                    inputClass
                  }
                  value={
                    workOrder.contact_mail_id ||
                    ""
                  }
                  readOnly
                />
              </div>
            </>
          )}

          {/* PO */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Customer PO
              Number
            </label>

            <input
              type="text"
              name="po_number"
              className={
                inputClass
              }
              value={
                workOrder.po_number ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            />
          </div>

          {/* SERVICE DATE */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Service Date
            </label>

            <input
              type="date"
              name="service_date"
              className={
                inputClass
              }
              value={
                workOrder.service_date ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            />
          </div>

          {/* SERVICE LOCATION */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Service
              Location
            </label>

            <input
              type="text"
              name="job_location"
              className={
                inputClass
              }
              value={
                workOrder.job_location ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            />
          </div>

          {/* ISSUE */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Service
              Request
            </label>

            <input
              type="text"
              name="issue"
              className={
                inputClass
              }
              value={
                workOrder.issue ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            />
          </div>

          {/* STATUS */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Status
            </label>

            <select
              name="status"
              className={
                inputClass
              }
              value={
                workOrder.status ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            >
              <option value="Open">
                Open
              </option>

              <option value="Design">
                Design
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Reviewing">
                Reviewing
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>
          </div>

          {/* LOCAL CONTACT */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Local Onsite
              Contact
            </label>

            <input
              type="text"
              name="local_onsite_person"
              className={
                inputClass
              }
              value={
                workOrder.local_onsite_person ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            />
          </div>

          {/* LOCAL CONTACT NUMBER */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Local
              Contact
              Number
            </label>

            <input
              type="text"
              name="local_onsite_person_contact"
              className={
                inputClass
              }
              value={
                workOrder.local_onsite_person_contact ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            />
          </div>

          {/* BILLED */}
          <div className="flex flex-col gap-2">
            <label className={labelClass}>
              Billed
            </label>

            <select
              name="is_billed"
              className={
                inputClass
              }
              value={
                workOrder.is_billed ||
                ""
              }
              onChange={(
                e,
              ) =>
                handleWorkOrderChange(
                  e,
                )
              }
              disabled={
                !isEditing
              }
            >
              <option value="">
                Choose
                Option
              </option>

              <option value="Unbilled">
                Unbilled
              </option>

              <option value="Deposit Billed">
                Deposit
                Billed
              </option>

              <option value="Progress Payment 1 Billed">
                Progress
                Payment 1
                Billed
              </option>

              <option value="Progress Payment 2 Billed">
                Progress
                Payment 2
                Billed
              </option>

              <option value="Progress Payment 3 Billed">
                Progress
                Payment 3
                Billed
              </option>

              <option value="Progress Payment 4 Billed">
                Progress
                Payment 4
                Billed
              </option>

              <option value="Progress Payment 5 Billed">
                Progress
                Payment 5
                Billed
              </option>

              <option value="Progress Payment 6 Billed">
                Progress
                Payment 6
                Billed
              </option>

              <option value="Final Billed">
                Final
                Billed
              </option>

              <option value="Retainage Billed">
                Retainage
                Billed
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderCard;