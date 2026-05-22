/** @format */

import React, { useState, useEffect, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useLocation } from "react-router-dom";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getClients } from "../../actions/clientActions";

import { getLocationByClient } from "../../actions/locationActions";

import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";

import { fetchIDREmployees } from "../../actions/employeeActions";

import {
  generateServiceTicket,
  assignPeopleToServiceTicket,
} from "../../actions/serviceTicket";

import {
  MdArrowBack,
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdEmail,
  MdCalendarToday,
  MdDescription,
  MdAssignmentInd,
  MdGroups,
  MdContentCopy,
} from "react-icons/md";

function AddServiceTicket() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const duplicateData = location.state?.duplicateData;

  const isDuplicate = location.state?.isDuplicate;

  // =========================
  // STEP
  // =========================

  const [step, setStep] = useState(1);

  // =========================
  // REDUX
  // =========================

  const clients = useSelector((state) => state.client.clients);

  const locations = useSelector((state) => state.location.locations);

  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees,
  );

  const idrEmployees = useSelector((state) => state.employee.idrEmployees);

  const loadingTicket = useSelector((state) => state.serviceTicket.loading);

  // =========================
  // TICKET DATA
  // =========================

  const [ticketData, setTicketData] = useState({
    client_id: "",
    location_id: "",
    customer_po: "",
    service_date: "",
    service_location: "",
    service_request: "",
    status: "Open",
    contact_person: "",
    contact_phone_number: "",
    contact_email: "",
    local_onsite_contact: "",
    local_onsite_contact_number: "",
    service_ticket_details: "",
    client_name: "",
    client_emp_user_id: "",
  });

  // =========================
  // ASSIGNS
  // =========================

  const [assigns, setAssigns] = useState({
    service_ticket_id: "",
    technicians: [],
    managers: [],
  });

  // =========================
  // GENERATED ID
  // =========================

  const [serviceTicketId, setServiceTicketId] = useState(null);

  // =========================
  // FETCH INITIAL DATA
  // =========================

  useEffect(() => {
    dispatch(getClients());

    dispatch(fetchIDREmployees());
  }, [dispatch]);

  // =========================
  // DUPLICATE PREFILL
  // =========================

  useEffect(() => {
    if (duplicateData) {
      setTicketData({
        client_id: duplicateData.client_id || "",

        location_id: duplicateData.location_id || "",

        customer_po: duplicateData.customer_po || "",

        service_date: "",

        service_location: duplicateData.service_location || "",

        service_request: duplicateData.service_request || "",

        status: "Open",

        contact_person: duplicateData.contact_person || "",

        contact_phone_number: duplicateData.contact_phone_number || "",

        contact_email: duplicateData.contact_email || "",

        local_onsite_contact: duplicateData.local_onsite_contact || "",

        local_onsite_contact_number:
          duplicateData.local_onsite_contact_number || "",

        service_ticket_details: duplicateData.service_ticket_details || "",

        client_name: duplicateData.client_name || "",

        client_emp_user_id: duplicateData.client_emp_user_id || "",
      });

      if (duplicateData.client_id) {
        dispatch(getLocationByClient(duplicateData.client_id));

        dispatch(getClientEmployeeByClientId(duplicateData.client_id));
      }
    }
  }, [duplicateData, dispatch]);

  // =========================
  // CHANGE HANDLER
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTicketData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // CLIENT
    if (name === "client_id") {
      dispatch(getLocationByClient(value));

      dispatch(getClientEmployeeByClientId(value));

      const selectedClient = clients?.data?.find(
        (client) => client.client_id === value,
      );

      if (selectedClient) {
        setTicketData((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }
    }

    // CONTACT PERSON
    if (name === "contact_person") {
      const selectedEmployee = clientEmployees?.find(
        (employee) => employee.client_emp_id === value,
      );

      if (selectedEmployee) {
        setTicketData((prev) => ({
          ...prev,

          contact_person: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,

          contact_phone_number: selectedEmployee.contact_number,

          contact_email: selectedEmployee.email_id,

          client_emp_user_id: selectedEmployee.client_emp_id,
        }));
      }
    }
  };

  // =========================
  // TECHNICIAN SELECT
  // =========================

  const toggleTechnician = (employee) => {
    const exists = assigns.technicians.some(
      (tech) => tech.technician_user_id === employee.user_id,
    );

    if (exists) {
      setAssigns((prev) => ({
        ...prev,
        technicians: prev.technicians.filter(
          (tech) => tech.technician_user_id !== employee.user_id,
        ),
      }));
    } else {
      setAssigns((prev) => ({
        ...prev,

        technicians: [
          ...prev.technicians,

          {
            technician_user_id: employee.user_id,

            technician_name: `${employee.first_name} ${employee.last_name}`,

            technician_contact: employee.contact_number,
          },
        ],
      }));
    }
  };

  // =========================
  // MANAGER SELECT
  // =========================

  const toggleManager = (employee) => {
    const exists = assigns.managers.some(
      (pm) => pm.pm_user_id === employee.user_id,
    );

    if (exists) {
      setAssigns((prev) => ({
        ...prev,
        managers: prev.managers.filter(
          (pm) => pm.pm_user_id !== employee.user_id,
        ),
      }));
    } else {
      setAssigns((prev) => ({
        ...prev,

        managers: [
          ...prev.managers,

          {
            pm_user_id: employee.user_id,

            project_manager: `${employee.first_name} ${employee.last_name}`,

            project_manager_contact: employee.contact_number,
          },
        ],
      }));
    }
  };

  // =========================
  // GENERATE TICKET
  // =========================

  const handleGenerateTicket = async () => {
    try {
      const response = await dispatch(generateServiceTicket(ticketData));

      if (response) {
        setServiceTicketId(response.service_ticket_id);

        setAssigns((prev) => ({
          ...prev,
          service_ticket_id: response.service_ticket_id,
        }));

        setStep(2);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // ASSIGN TEAM
  // =========================

  const handleAssign = async () => {
    try {
      dispatch(
        assignPeopleToServiceTicket(assigns, navigate, false, location.state),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // TODAY
  // =========================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div className="flex-1 p-5 md:p-8 overflow-y-auto">
          {/* HEADER */}
          <div
            className="
              bg-white
              rounded-[30px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-6
            "
          >
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
              <div className="flex items-center gap-4">
                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                >
                  <MdAssignmentInd className="text-3xl" />
                </div>

                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl font-bold text-[#1E1B4B]">
                      {isDuplicate
                        ? "Duplicate Service Ticket"
                        : "Create Service Ticket"}
                    </h1>

                    {isDuplicate && (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          px-3
                          py-1
                          rounded-full
                          bg-orange-100
                          text-orange-700
                          text-xs
                          font-semibold
                        "
                      >
                        <MdContentCopy />
                        Duplicated
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Create and assign service tickets with modern workflow
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("/service-tickets", {
                    state: location.state,
                  })
                }
                className="
                  flex
                  items-center
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
                "
              >
                <MdArrowBack />
                Back
              </button>
            </div>
          </div>

          {/* STEPPER */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-5 flex-wrap justify-center">
              {["Ticket Details", "Assign Team"].map(
                (item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`
                          w-12
                          h-12
                          rounded-full
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-bold
                          ${
                            step >= index + 1
                              ? "bg-gradient-to-r from-indigo-500 to-pink-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }
                        `}
                      >
                        {index + 1}
                      </div>

                      <span
                        className={`
                          text-sm
                          font-semibold
                          ${
                            step >= index + 1
                              ? "text-[#1E1B4B]"
                              : "text-gray-400"
                          }
                        `}
                      >
                        {item}
                      </span>
                    </div>

                    {index !== 2 && (
                      <div className="w-10 h-[2px] bg-gray-300" />
                    )}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div
              className="
                bg-white
                rounded-[30px]
                border
                border-gray-100
                shadow-sm
                overflow-hidden
              "
            >
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* CLIENT */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Choose Client *
                    </label>

                    <select
                      name="client_id"
                      value={ticketData.client_id}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                      required
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
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Choose Location *
                    </label>

                    <select
                      name="location_id"
                      value={ticketData.location_id}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    >
                      <option value="">Choose Option</option>

                      {locations.map((location) => (
                        <option
                          key={location.location_id}
                          value={location.location_id}
                        >
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
                      value={ticketData.client_name}
                      readOnly
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm"
                    />
                  </div>

                  {/* CONTACT */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Contact Person *
                    </label>

                    <select
                      name="contact_person"
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    >
                      <option value="">Choose Contact Person</option>

                      {clientEmployees.map((employee) => (
                        <option
                          key={employee.client_emp_id}
                          value={employee.client_emp_id}
                        >
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* PHONE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Contact Phone
                    </label>

                    <input
                      type="text"
                      value={ticketData.contact_phone_number}
                      readOnly
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm"
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Contact Email
                    </label>

                    <input
                      type="email"
                      value={ticketData.contact_email}
                      readOnly
                      className="w-full h-12 rounded-2xl border border-gray-200 bg-gray-50 px-4 text-sm"
                    />
                  </div>

                  {/* CUSTOMER PO */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Customer PO
                    </label>

                    <input
                      type="text"
                      name="customer_po"
                      value={ticketData.customer_po}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    />
                  </div>

                  {/* DATE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Service Date *
                    </label>

                    <input
                      type="date"
                      name="service_date"
                      min={getTodayDate()}
                      value={ticketData.service_date}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    />
                  </div>

                  {/* LOCATION */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Service Location
                    </label>

                    <input
                      type="text"
                      name="service_location"
                      value={ticketData.service_location}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    />
                  </div>

                  {/* REQUEST */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Service Request *
                    </label>

                    <input
                      type="text"
                      name="service_request"
                      value={ticketData.service_request}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    />
                  </div>

                  {/* ONSITE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Local Onsite Contact
                    </label>

                    <input
                      type="text"
                      name="local_onsite_contact"
                      value={ticketData.local_onsite_contact}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    />
                  </div>

                  {/* ONSITE PHONE */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#1E1B4B]">
                      Local Contact Number
                    </label>

                    <input
                      type="text"
                      name="local_onsite_contact_number"
                      value={ticketData.local_onsite_contact_number}
                      onChange={handleChange}
                      className="w-full h-12 rounded-2xl border border-gray-200 px-4 text-sm"
                    />
                  </div>
                </div>

                {/* DETAILS */}
                <div className="mt-8">
                  <label className="text-sm font-semibold text-[#1E1B4B] mb-3 block">
                    Service Ticket Details
                  </label>

                  <textarea
                    rows={10}
                    name="service_ticket_details"
                    value={ticketData.service_ticket_details}
                    onChange={handleChange}
                    className="
                      w-full
                      min-h-[240px]
                      rounded-[24px]
                      border
                      border-gray-200
                      bg-gray-50
                      px-5
                      py-4
                      text-sm
                      resize-y
                    "
                  />
                </div>

                {/* ACTION */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleGenerateTicket}
                    className="
                      flex
                      items-center
                      gap-2
                      px-7
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-pink-500
                      text-white
                      text-sm
                      font-semibold
                      shadow-md
                    "
                  >
                    {loadingTicket
                      ? "Generating..."
                      : "Generate Ticket & Continue"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div
              className="
                bg-white
                rounded-[30px]
                border
                border-gray-100
                shadow-sm
                overflow-hidden
              "
            >
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {/* TECHNICIANS */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#1E1B4B] mb-4">
                      Select Technicians
                    </h2>

                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                      {idrEmployees.map((employee) => {
                        const checked = assigns.technicians.some(
                          (tech) =>
                            tech.technician_user_id === employee.user_id,
                        );

                        return (
                          <label
                            key={employee.user_id}
                            className="
                                flex
                                items-center
                                justify-between
                                px-5
                                py-4
                                border-b
                                border-gray-100
                                hover:bg-gray-50
                                cursor-pointer
                              "
                          >
                            <div>
                              <p className="text-sm font-semibold text-[#1E1B4B]">
                                {employee.first_name} {employee.last_name}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {employee.contact_number}
                              </p>
                            </div>

                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleTechnician(employee)}
                              className="w-5 h-5"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* MANAGERS */}
                  <div>
                    <h2 className="text-lg font-semibold text-[#1E1B4B] mb-4">
                      Select Managers
                    </h2>

                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                      {idrEmployees.map((employee) => {
                        const checked = assigns.managers.some(
                          (pm) => pm.pm_user_id === employee.user_id,
                        );

                        return (
                          <label
                            key={employee.user_id}
                            className="
                                flex
                                items-center
                                justify-between
                                px-5
                                py-4
                                border-b
                                border-gray-100
                                hover:bg-gray-50
                                cursor-pointer
                              "
                          >
                            <div>
                              <p className="text-sm font-semibold text-[#1E1B4B]">
                                {employee.first_name} {employee.last_name}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {employee.contact_number}
                              </p>
                            </div>

                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleManager(employee)}
                              className="w-5 h-5"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleAssign}
                    className="
                      px-7
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-500
                      via-purple-500
                      to-pink-500
                      text-white
                      text-sm
                      font-semibold
                    "
                  >
                    Create Service Ticket
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default AddServiceTicket;
