/** @format */

import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  MdAssignment,
  MdLocationOn,
  MdPeople,
  MdBuild,
  MdChecklist,
  MdArrowForward,
  MdArrowBack,
  MdCheckCircle,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getClients } from "../../actions/clientActions";

import { getLocationByClient } from "../../actions/locationActions";

import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";

import { fetchIDREmployees } from "../../actions/employeeActions";

import {
  generateTicket,
  addTechnicianToTicket,
  assignPeopleToWorkOrder,
  getWorkOrderDetails,
} from "../../actions/workOrderActions";

import { toast } from "react-toastify";

function AddWorkOrder() {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const dispatch = useDispatch();
const [searchParams] = useSearchParams();
  // const location = useLocation();
  const { id } = useParams();

  const isDuplicate =
  searchParams.get("duplicate") === "true";

  const clients = useSelector((state) => state.client.clients);
  const { workOrderDetails } = useSelector((state) => state.workOrder);
  const locations = useSelector((state) => state.location.locations);

  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees,
  );

  const idrEmployees = useSelector((state) => state.employee.idrEmployees);

  const { loading } = useSelector((state) => state.workOrder);

  const [ticketData, setTicketData] = useState({
    client_id: "",
    location_id: "",
    client_name: "",
    work_order_type: "abv",
    generated_date: new Date().toLocaleDateString("en-US"),
    generated_time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    po_number: "",
    client_site: "abv",
    job_location: "",
    service_date: "",
    contact_person: "",
    contact_phone_number: "",
    contact_mail_id: "",
    issue: "",
    status: "Open",
    local_onsite_person: "",
    local_onsite_person_contact: "",
    client_emp_user_id: "",
  });

  const [technicianData, setTechnicianData] = useState({
    work_order_id: "",
    other_details: "",
    procedures: "",
    parts: "",
    labeling_methodology: "",
    required_deliverables: "",
    deliverable_instructions: "",
  });

  const [assigns, setAssigns] = useState({
    work_order_id: "",
    technicians: [],
    managers: [],
  });
  useEffect(() => {
    if (isDuplicate && id) {
      dispatch(getWorkOrderDetails(id));
    }
  }, [dispatch, isDuplicate, id]);
  useEffect(() => {
    dispatch(getClients());

    dispatch(fetchIDREmployees());
  }, [dispatch]);
useEffect(() => {
  if (
    !isDuplicate ||
    !workOrderDetails
  ) {
    return;
  }

  dispatch(
    getLocationByClient(
      workOrderDetails.client_id,
    ),
  );

  dispatch(
    getClientEmployeeByClientId(
      workOrderDetails.client_id,
    ),
  );
  const selectedEmployee = clientEmployees.find(
    (emp) =>
      String(emp.user_id) ===
      String(workOrderDetails.client_emp_user_id)
  );
  // STEP 1 PREFILL
  setTicketData((prev) => ({
    ...prev,

    client_id:
      workOrderDetails.client_id || "",

    location_id:
      workOrderDetails.location_id || "",

    client_name:
      workOrderDetails.client_name || "",

    po_number:
      workOrderDetails.po_number || "",

    job_location:
      workOrderDetails.job_location || "",

    service_date:
      workOrderDetails.service_date || "",

    contact_person:
      workOrderDetails.contact_person || "",

    contact_phone_number:
      workOrderDetails.contact_phone_number || "",

    contact_mail_id:
      workOrderDetails.contact_mail_id || "",

    issue:
      workOrderDetails.issue || "",

    local_onsite_person:
      workOrderDetails.local_onsite_person || "",

    local_onsite_person_contact:
      workOrderDetails.local_onsite_person_contact || "",

    client_emp_user_id:
      selectedEmployee?.client_emp_id || "",
  }));

  // STEP 2 PREFILL
  if (
    workOrderDetails?.technicians?.length > 0
  ) {
    const tech =
      workOrderDetails.technicians[0];

    setTechnicianData({
      work_order_id: "",

      other_details:
        tech.other_details || "",

      procedures:
        tech.procedures || "",

      parts:
        tech.parts || "",

      labeling_methodology:
        tech.labeling_methodology || "",

      required_deliverables:
        tech.required_deliverables || "",

      deliverable_instructions:
        tech.deliverable_instructions || "",
    });
  }

  // STEP 3 PREFILL
  setAssigns({
    work_order_id: "",

    technicians:
      workOrderDetails?.assignees
        ?.filter(
          (a) =>
            a.technician_name,
        )
        ?.map((a) => ({
          technician_user_id:
            a.technician_user_id,

          technician_name:
            a.technician_name,

          technician_contact:
            a.technician_contact,
        })) || [],

    managers:
      workOrderDetails?.assignees
        ?.filter(
          (a) =>
            a.project_manager,
        )
        ?.map((a) => ({
          pm_user_id:
            a.pm_user_id,

          project_manager:
            a.project_manager,

          project_manager_contact:
            a.project_manager_contact,
        })) || [],
  });
}, [
  isDuplicate,
  workOrderDetails,
  dispatch,
]);

  const handleChange = (e, setData) => {
    const { name, value } = e.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "client_id") {
      dispatch(getLocationByClient(value));

      const selectedClient = clients?.data?.find(
        (client) => client.client_id === value,
      );

      if (selectedClient) {
        setTicketData((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }

      dispatch(getClientEmployeeByClientId(value));
    }

    if (name === "contact_person") {
      const selectedEmployee = clientEmployees?.find(
        (employee) => employee.client_emp_id === value,
      );

      if (selectedEmployee) {
        setTicketData((prev) => ({
          ...prev,
          contact_person: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`,
          contact_phone_number: selectedEmployee.contact_number,
          contact_mail_id: selectedEmployee.email_id,
          client_emp_user_id: selectedEmployee.client_emp_id,
        }));
      }
    }
  };

  const validateStep1 = () => {
    return (
      ticketData.client_id !== "" &&
      ticketData.location_id !== "" &&
      ticketData.service_date !== "" &&
      ticketData.issue !== "" &&
      ticketData.contact_person !== "" &&
      ticketData.job_location !== ""
    );
  };

  const validateStep2 = () => {
    return (
      technicianData.other_details !== "" &&
      technicianData.procedures !== "" &&
      technicianData.parts !== "" &&
      technicianData.labeling_methodology !== "" &&
      technicianData.required_deliverables !== "" &&
      technicianData.deliverable_instructions !== ""
    );
  };

  const validateStep3 = () => {
    return assigns.technicians.length > 0 || assigns.managers.length > 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) {
        toast.error("Fill all required fields.");

        return;
      }

      generateWorkOrderTicket();
    } else if (step === 2) {
      if (!validateStep2()) {
        toast.error("Fill all required fields.");

        return;
      }

      addTechnician();
    } else if (step === 3) {
      if (!validateStep3()) {
        toast.error("Please assign at least one technician or manager.");

        return;
      }

      addAssigns();
    }
  };

  const generateWorkOrderTicket = () => {
    dispatch(generateTicket(ticketData))
      .then((response) => {
        if (response?.work_order_id) {
          setTechnicianData((prev) => ({
            ...prev,
            work_order_id: response.work_order_id,
          }));

          setStep(2);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addTechnician = () => {
    dispatch(addTechnicianToTicket(technicianData))
      .then((response) => {
        if (response.code === "WO201") {
          setAssigns((prev) => ({
            ...prev,
            work_order_id: technicianData.work_order_id,
          }));

          setStep(3);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const addAssigns = () => {
    dispatch(assignPeopleToWorkOrder(assigns))
      .then((response) => {
        if (response.code === "WO201") {
          toast.success("Work Order Created.");
          navigate(`/workorder?${searchParams.toString()}`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
      transition-all
    `;

const textareaClass = `
  w-full
  rounded-2xl
  border
  border-gray-200
  bg-white
  px-4
  py-3
  text-sm
  text-gray-700
  resize-y
  min-h-[120px]
  focus:outline-none
  focus:ring-2
  focus:ring-indigo-500
  transition-all
`;

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div className="flex-1 p-5 md:p-8 overflow-x-hidden">
          {/* TOP */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1E1B4B]">
                {isDuplicate ? "Duplicate Work Order" : "Create Work Order"}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                {isDuplicate
                  ? "  Existing work order data loaded. Update details and create a new work order."
                  : "Create and assign work orders with technician details"}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/workorder?${searchParams.toString()}`)
              }
              className="
              flex
              flex-center
              gap-2
                px-5
                py-3
                rounded-2xl
                bg-white
                border
                border-gray-200
                text-gray-700
                font-medium
                hover:bg-gray-50
                transition-all
              "
            >
              <MdArrowBack size={20} />
              Back
            </button>
          </div>

          {/* STEPPER */}
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  id: 1,
                  title: "Ticket",
                  icon: <MdAssignment />,
                },
                {
                  id: 2,
                  title: "Details",
                  icon: <MdChecklist />,
                },
                {
                  id: 3,
                  title: "Assign",
                  icon: <MdPeople />,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className={`
                      rounded-2xl
                      border
                      p-4
                      flex
                      items-center
                      gap-4
                      transition-all
                      
                      ${
                        step >= item.id
                          ? "bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white border-transparent shadow-md"
                          : "bg-gray-50 border-gray-200 text-gray-500"
                      }
                    `}
                >
                  <div className="text-2xl">{item.icon}</div>

                  <div>
                    <p className="text-xs opacity-80">Step {item.id}</p>

                    <h3 className="font-semibold text-sm">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-5 md:p-7">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                    <MdAssignment className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                      Generate Ticket
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Enter customer and work order details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Choose Client *
                    </label>

                    <select
                      name="client_id"
                      className={inputClass}
                      value={ticketData.client_id}
                      onChange={(e) => handleChange(e, setTicketData)}
                    >
                      <option value="">Choose Client</option>

                      {clients?.data?.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Choose Location *
                    </label>

                    <select
                      name="location_id"
                      className={inputClass}
                      value={ticketData.location_id}
                      onChange={(e) => handleChange(e, setTicketData)}
                    >
                      <option value="">Choose Location</option>

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

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Client Name
                    </label>

                    <input
                      type="text"
                      readOnly
                      value={ticketData.client_name}
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Contact Person *
                    </label>

                    <select
                      name="contact_person"
                      className={inputClass}
                      value={ticketData.client_emp_user_id}
                      onChange={(e) => handleChange(e, setTicketData)}
                    >
                      <option value="">Choose Contact</option>

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

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Phone Number
                    </label>

                    <input
                      readOnly
                      value={ticketData.contact_phone_number}
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Email
                    </label>

                    <input
                      readOnly
                      value={ticketData.contact_mail_id}
                      className={`${inputClass} bg-gray-100`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      PO Number
                    </label>

                    <input
                      type="text"
                      name="po_number"
                      value={ticketData.po_number}
                      className={inputClass}
                      onChange={(e) => handleChange(e, setTicketData)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Service Date *
                    </label>

                    <input
                      type="date"
                      min={getTodayDate()}
                      name="service_date"
                      className={inputClass}
                      onChange={(e) => handleChange(e, setTicketData)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Service Location *
                    </label>

                    <input
                      type="text"
                      name="job_location"
                      value={ticketData.job_location}
                      className={inputClass}
                      onChange={(e) => handleChange(e, setTicketData)}
                    />
                  </div>

                  <div className="md:col-span-2 xl:col-span-3">
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Service Request *
                    </label>

                    <textarea
                      rows={4}
                      name="issue"
                      className={textareaClass}
                      value={ticketData.issue}
                      onChange={(e) => handleChange(e, setTicketData)}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-10">
                  <button
                    onClick={handleNext}
                    className="
                      flex
                      items-center
                      gap-2
                      px-8
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                    "
                  >
                    {loading ? "Saving..." : "Next"}

                    <MdArrowForward />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-5 md:p-7">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                    <MdBuild className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                      Work Order Details
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Add technician instructions and procedures
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      label: "Parts & Tools *",
                      name: "parts",
                    },
                    {
                      label: "Labeling Methodology *",
                      name: "labeling_methodology",
                      input: true,
                    },
                    {
                      label: "Service Details *",
                      name: "other_details",
                    },
                    {
                      label: "Procedures *",
                      name: "procedures",
                    },
                    {
                      label: "Required Deliverables *",
                      name: "required_deliverables",
                    },
                    {
                      label: "Deliverable Instructions *",
                      name: "deliverable_instructions",
                    },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                        {field.label}
                      </label>

                      {field.input ? (
                        <input
                          type="text"
                          name={field.name}
                          className={inputClass}
                          value={technicianData[field.name]}
                          onChange={(e) => handleChange(e, setTechnicianData)}
                        />
                      ) : (
                        <textarea
                          rows={4}
                          name={field.name}
                          className={textareaClass}
                          value={technicianData[field.name]}
                          onChange={(e) => handleChange(e, setTechnicianData)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end mt-10">
                  {/* <button
                    onClick={() =>
                      setStep(
                        1,
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-6
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      text-gray-700
                      font-medium
                      hover:bg-gray-50
                      transition-all
                    "
                  >
                    <MdArrowBack />
                    Back
                  </button> */}

                  <button
                    onClick={handleNext}
                    className="
                      flex
                      items-center
                      gap-2
                      px-8
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                    "
                  >
                    {loading ? "Saving..." : "Next"}

                    <MdArrowForward />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-5 md:p-7">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                    <MdPeople className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                      Assign Team
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Select technicians and project managers
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* TECHS */}
                  <div className="border border-gray-100 rounded-3xl overflow-hidden">
                    <div className="px-5 py-4 bg-indigo-50 border-b border-gray-100">
                      <h3 className="font-semibold text-[#1E1B4B]">
                        Technicians
                      </h3>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                      {idrEmployees.map((employee) => {
                        const fullName = `${employee.first_name} ${employee.last_name}`;

                        const isSelected = assigns.technicians.some(
  (t) =>
    String(t.technician_user_id) ===
    String(employee.user_id),
);

                        return (
                          <label
                            key={employee.user_id}
                            className="flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAssigns((prev) => ({
                                      ...prev,
                                      technicians: [
                                        ...prev.technicians,
                                        {
                                          technician_user_id: employee.user_id,
                                          technician_name: fullName,
                                          technician_contact:
                                            employee.contact_number,
                                        },
                                      ],
                                    }));
                                  } else {
                                    setAssigns((prev) => ({
                                      ...prev,
                                      technicians: prev.technicians.filter(
                                        (t) =>
                                          t.technician_user_id !==
                                          employee.user_id,
                                      ),
                                    }));
                                  }
                                }}
                                className="w-5 h-5 accent-indigo-600"
                              />

                              <div>
                                <p className="text-sm font-semibold text-[#1E1B4B]">
                                  {fullName}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {employee.contact_number}
                                </p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* MANAGERS */}
                  <div className="border border-gray-100 rounded-3xl overflow-hidden">
                    <div className="px-5 py-4 bg-pink-50 border-b border-gray-100">
                      <h3 className="font-semibold text-[#1E1B4B]">
                        Project Managers
                      </h3>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto">
                      {idrEmployees.map((employee) => {
                        const fullName = `${employee.first_name} ${employee.last_name}`;

                        const isSelected = assigns.managers.some(
  (m) =>
    String(m.pm_user_id) ===
    String(employee.user_id),
);

                        return (
                          <label
                            key={employee.user_id}
                            className="flex items-center justify-between px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setAssigns((prev) => ({
                                      ...prev,
                                      managers: [
                                        ...prev.managers,
                                        {
                                          pm_user_id: employee.user_id,
                                          project_manager: fullName,
                                          project_manager_contact:
                                            employee.contact_number,
                                        },
                                      ],
                                    }));
                                  } else {
                                    setAssigns((prev) => ({
                                      ...prev,
                                      managers: prev.managers.filter(
                                        (m) =>
                                          m.pm_user_id !== employee.user_id,
                                      ),
                                    }));
                                  }
                                }}
                                className="w-5 h-5 accent-pink-600"
                              />

                              <div>
                                <p className="text-sm font-semibold text-[#1E1B4B]">
                                  {fullName}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {employee.contact_number}
                                </p>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-10">
                  {/* <button
                    onClick={() =>
                      setStep(
                        2,
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      px-6
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      text-gray-700
                      font-medium
                      hover:bg-gray-50
                      transition-all
                    "
                  >
                    <MdArrowBack />
                    Back
                  </button> */}

                  <button
                    onClick={handleNext}
                    className="
                      flex
                      items-center
                      gap-2
                      px-8
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                    "
                  >
                    {loading ? "Saving..." : "Submit Work Order"}

                    <MdCheckCircle />
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
export default AddWorkOrder;
