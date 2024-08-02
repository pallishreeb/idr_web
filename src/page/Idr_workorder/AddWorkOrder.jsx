import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
} from "../../actions/workOrderActions";
import { toast } from "react-toastify";

function AddWorkOrder() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees
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
    technician_user_id: "",
    technician_name: "",
    pm_user_id: "",
    project_manager: "",
  });

  useEffect(() => {
    // Fetch clients and IDR employees when component mounts
    dispatch(getClients());
    dispatch(fetchIDREmployees());
  }, [dispatch]);

  const handleChange = (e, setData) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));

    // Fetch locations when client_id changes
    if (name === "client_id") {
      dispatch(getLocationByClient(value));
      // Autofill client name
      const selectedClient = clients?.data?.find(
        (client) => client.client_id === value
      );
      if (selectedClient) {
        setTicketData((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }

      // Fetch client employees by client_id
      dispatch(getClientEmployeeByClientId(value));
    }

    // Autofill contact phone number and email when contact_person changes
    if (name === "contact_person") {
      const selectedEmployee = clientEmployees?.find(
        (employee) => employee.client_emp_id === value
      );

      if (selectedEmployee) {
        setTicketData((prev) => ({
          ...prev,
          contact_person:
            selectedEmployee.first_name + " " + selectedEmployee.last_name,
          contact_phone_number: selectedEmployee.contact_number,
          contact_mail_id: selectedEmployee.email_id,
          client_emp_user_id: selectedEmployee.user_id,
        }));
      }
    }

    // Set technician user id
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees?.find(
        (employee) => employee.first_name + ' ' + employee.last_name === value
      );
      if (selectedTechnician) {
        setAssigns((prev) => ({
          ...prev,
          technician_user_id: selectedTechnician.user_id,
        }));
      }
    }
    // Set project manager user id
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees?.find(
        (employee) => employee.first_name + ' ' + employee.last_name === value
      );
      if (selectedTechnician) {
        setAssigns((prev) => ({
          ...prev,
          pm_user_id: selectedTechnician.user_id,
        }));
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1 fields
      if (!validateStep1()) {
        toast.error("Fill up all required fields.");
        return;
      }

      generateWorkOrderTicket();
    } else if (step === 2) {
      // Validate step 2 fields
      if (!validateStep2()) {
        toast.error("Fill up all required fields.");
        return;
      }

      addTechnician();
    } else if (step === 3) {
      // Validate step 3 fields
      if (!validateStep3()) {
        toast.error("Please add Technicians.");
        return;
      }

      addAssigns();
    }
  };

  const validateStep1 = () => {
    // Example validation, adjust as per your field requirements
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
    // Example validation, adjust as per your field requirements
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
    // Example validation, adjust as per your field requirements
    return assigns.technician_name !== "" && assigns.project_manager !== "";
  };

  const generateWorkOrderTicket = () => {
    dispatch(generateTicket(ticketData))
      .then((response) => {
        if (response?.work_order_id) {
          setTechnicianData((prev) => ({
            ...prev,
            work_order_id: response?.work_order_id,
          }));
          setStep(2); // Proceed to next step
        } else {
          console.error("Error generating ticket:", response.error);
        }
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
  };

  const addTechnician = () => {
    dispatch(addTechnicianToTicket(technicianData))
      .then((response) => {
        if (response.code == "WO201") {
          setAssigns((prev) => ({
            ...prev,
            work_order_id: technicianData.work_order_id,
          }));
          setStep(3); // Proceed to next step
          // navigate("/workorder");
        } else {
          console.error("Error adding technician:", response.error);
        }
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
  };

  const addAssigns = () => {
    dispatch(assignPeopleToWorkOrder(assigns))
      .then((response) => {
        if (response.code == "WO201") {
          toast.success("Work Order Created.")
          navigate("/workorder");
        } else {
          console.error("Error adding assigns:", response.error);
        }
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
  };

  // Helper function to get today's date in 'YYYY-MM-DD' format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">New Work Orders</h1>
          </div>

          {step === 1 && (
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <h1 className="text-xl font-normal mb-2">Generate Ticket</h1>
                <div className="border border-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-base">Choose Client*</label>
                  <select
                    name="client_id"
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
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

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-base">
                    Choose Location*
                  </label>
                  <select
                    name="location_id"
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                    required
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

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-base">Client Name*</label>
                  <input
                    type="text"
                    name="client_name"
                    value={ticketData.client_name}
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    readOnly
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact person*
                  </label>
                  <select
                    name="contact_person"
                    className="px-3 py-3 border border-gray-200  text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                    required
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

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact Phone Number*
                  </label>
                  <input
                    type="text"
                    placeholder="Type Contact Phone Number"
                    name="contact_phone_number"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded w-full"
                    value={ticketData.contact_phone_number}
                    onChange={(e) => handleChange(e, setTicketData)}
                    required
                    readOnly
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Contact Email id*
                  </label>
                  <input
                    type="email"
                    placeholder="Type Contact Mail Id"
                    name="contact_mail_id"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    value={ticketData.contact_mail_id}
                    onChange={(e) => handleChange(e, setTicketData)}
                    readOnly
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Customer PO Number*
                  </label>
                  <input
                    type="text"
                    placeholder="Type Customer PO Number"
                    name="po_number"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Service Date*</label>
                  <input
                    type="date"
                    placeholder="type"
                    name="service_date"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                    min={getTodayDate()}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Service Location*</label>
                  <input
                    type="text"
                    placeholder="Type Service Location"
                    name="job_location"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Service Request*
                  </label>
                  <input
                    type="text"
                    placeholder="Type Service Request"
                    name="issue"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Status</label>
                  <select
                    name="status"
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                  >
                    <option value="Open">Open</option>
                    <option value="Design">Design</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Local Onsite Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Type Local Onsite Contact"
                    name="local_onsite_person"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                  />
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Local Onsite Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Type  Local Person Contact Number"
                    name="local_onsite_person_contact"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                  />
                </div>
                {/* Other input fields */}
              </div>

              <div className="flex flex-col gap-2 justify-center mt-7 items-center">
                <button
                  className="border bg-indigo-600 w-1/3 py-2 text-white rounded"
                  onClick={handleNext}
                >
                  {loading ? "Saving" : "Next"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <h1 className="text-xl font-normal mb-2">Work Order Details</h1>
                <div className="border border-gray-200"></div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Parts and Tools*
                  </label>
                  <textarea
                    name="parts"
                    className="px-3 py-2 border text-sm h-32 border-gray-200 rounded resize-y"
                    onChange={(e) => handleChange(e, setTechnicianData)}
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Labeling Methodology*
                  </label>
                  <input
                    type="text"
                    name="labeling_methodology"
                    className="px-3 py-2 border text-sm border-gray-200 rounded"
                    onChange={(e) => handleChange(e, setTechnicianData)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-base">
                    Service Details*
                  </label>
                  <textarea
                    name="other_details"
                    className="px-3 py-3 border border-gray-200 h-32 text-sm rounded resize-y"
                    rows={3}
                    onChange={(e) => handleChange(e, setTechnicianData)}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">Procedures*</label>
                  <textarea
                    name="procedures"
                    className="px-3 py-3 border border-gray-200 h-32 text-sm rounded resize-y"
                    rows={3}
                    onChange={(e) => handleChange(e, setTechnicianData)}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Require Deliverables*
                  </label>
                  <textarea
                    name="required_deliverables"
                    className="px-3 py-2 border text-sm border-gray-200 h-32 rounded resize-y"
                    onChange={(e) => handleChange(e, setTechnicianData)}
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-base">
                    Deliverable Instructions*
                  </label>
                  <textarea
                    name="deliverable_instructions"
                    className="px-3 py-2 border text-sm border-gray-200 h-32 rounded resize-y"
                    onChange={(e) => handleChange(e, setTechnicianData)}
                    rows={3}
                  ></textarea>
                </div>

                <div className="flex flex-col gap-2 justify-center mt-7 items-center">
                  <button
                    className="border bg-indigo-600 w-1/3 py-2 text-white rounded"
                    onClick={handleNext}
                  >
                    {loading ? "Saving" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <h1 className="text-xl font-normal mb-2">Assign Technicians</h1>
                <div className="border border-gray-200"></div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="font-normal text-base">
                      Technician name
                    </label>
                    <select
                      name="technician_name"
                      value={assigns.technician_name}
                      className="px-3 border border-gray-200 h-10 text-sm rounded"
                      onChange={(e) => handleChange(e, setAssigns)}
                    >
                      <option value="">Choose technician</option>
                      {idrEmployees.map((employee) => (
                        <option
                          key={employee.idr_emp_id}
                          value={employee.first_name + ' ' + employee.last_name}
                        >
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-normal text-base">
                      Project manager
                    </label>
                    <select
                      name="project_manager"
                      value={assigns.project_manager}
                      className="px-3 border border-gray-200 h-10 text-sm rounded"
                      onChange={(e) => handleChange(e, setAssigns)}
                    >
                      <option value="">Choose project manager</option>
                      {idrEmployees.map((employee) => (
                        <option
                          key={employee.idr_emp_id}
                          value={employee.first_name + ' ' + employee.last_name}
                        >
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>     
                </div>
                <div className="flex flex-col gap-2  justify-center mt-7 items-center">
                    <button
                      className="border bg-indigo-600 w-1/3 py-2 text-white rounded"
                      onClick={handleNext}
                    >
                      {loading ? "Saving" : "Submit"}
                    </button>
                  </div>
              </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AddWorkOrder;
