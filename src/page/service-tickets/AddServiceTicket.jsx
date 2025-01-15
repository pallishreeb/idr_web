import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import { generateServiceTicket, assignPeopleToServiceTicket } from "../../actions/serviceTicket";

// import { toast } from "react-toastify";

function AddServiceTicket() {
//   const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees
  );
  const idrEmployees = useSelector((state) => state.employee.idrEmployees);
  const loadingTicket = useSelector(
    (state) => state.serviceTicket.loading
  );

  const [ticketData, setTicketData] = useState({
    client_id: "",
    location_id: "",
    customer_po: "", // Renamed from "po_number" to "customer_po"
    service_date: "",
    service_location: "",
    service_request: "",
    status: "Open",
    contact_person: "",
    contact_phone_number: "",
    contact_email: "", // Renamed from "contact_mail_id" to "contact_email"
    local_onsite_contact: "", // Optional
    local_onsite_contact_number: "", // Optional
    service_ticket_details: "", // Optional, added as per request
    ticket_notes: "",// Optional
    client_name:"",
    client_emp_user_id:""
  });
  

  const [assigns, setAssigns] = useState({
    service_ticket_id: "",
    technician_user_id: "",
    technician_name: "",
    pm_user_id: "",
    project_manager: "",
    technician_contact:"",
    project_manager_contact:""
  });
  // State for generated ticket ID
  const [serviceTicketId, setServiceTicketId] = useState(null);
  const [clientName, setClientName] = useState("");
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
        setClientName(selectedClient?.company_name)
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
          contact_email: selectedEmployee.email_id,
          client_emp_user_id:selectedEmployee?.client_emp_id
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
          technician_contact: selectedTechnician?.contact_number,
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
          project_manager_contact: selectedTechnician?.contact_number,
        }));
      }
    }
  };

  const handleGenerateTicket = async () => {
    try {
      const response = await dispatch(generateServiceTicket(ticketData));
      console.log("Ticket generate response:", response);
  
      if (response) {
        setServiceTicketId(response?.service_ticket_id); // Save the generated ticket ID
        setAssigns((prev) => ({
          ...prev,
          service_ticket_id: response?.service_ticket_id,
        }));
        setStep(2); // Move to the next step
      } else {
        console.error("No response received from ticket generation.");
      }
    } catch (error) {
      console.error("Failed to generate ticket:", error);
    }
  };
  

  const handleAssignTechnicians = async () => {
    console.log("technician data---154",assigns)
    if (!serviceTicketId) {
      alert("Please generate a ticket first.");
      return;
    }

    try {
      console.log("technician data---154",assigns)
      dispatch(assignPeopleToServiceTicket(assigns,navigate,false));
    } catch (error) {
      console.error("Failed to assign technicians:", error);
    }
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
            <h1 className="font-bold text-lg">New Service Ticket</h1>
          </div>
          {step === 1 && (
             <form 
             className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6"
             onSubmit={(e) => {
               e.preventDefault(); // Prevent the default form submission
               handleGenerateTicket(); // Call the ticket generation function
             }}
           >         
              <div className="mb-2">
                <h1 className="text-xl font-normal mb-2">Service Ticket</h1>
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
                    name="clientName"
                    value={clientName}
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
                    name="contact_email"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    value={ticketData.contact_email}
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
                    name="customer_po"
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
                    name="service_location"
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
                    name="service_request"
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
                    {/* <option value="Design">Design</option> */}
                    <option value="In Progress">In Progress</option>
                    {/* <option value="Reviewing">Reviewing</option> */}
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
                    name="local_onsite_contact"
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
                    name="local_onsite_contact_number"
                    className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={(e) => handleChange(e, setTicketData)}
                  />
                </div>
                {/* Other input fields */}
                
              </div>
              <div className="grid grid-cols-1 gap-8">
              <div className="flex flex-col gap-2">
                  <label className="font-normal text-base">
                  Service Ticket Details
                  </label>
                  <textarea
                    name="service_ticket_details"
                    className="px-3 py-3 border border-gray-200 h-32 text-sm rounded resize-y"
                    rows={3}
                    onChange={(e) => handleChange(e, setTicketData)}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-base">
                  Ticket Note
                  </label>
                  <textarea
                    name="ticket_notes"
                    className="px-3 py-3 border border-gray-200 h-32 text-sm rounded resize-y"
                    rows={3}
                    onChange={(e) => handleChange(e, setTicketData)}
                  ></textarea>
                </div>
              </div>
              <div className="flex flex-col gap-2  justify-center mt-7 items-center">
                    <button
                      className="border bg-indigo-600 w-1/3 py-2 text-white rounded"
                    >
                      {loadingTicket ? "Saving" : "Generate Ticket"}
                    </button>
                  </div>
            </form>
          )}

          {step === 2 && (
            <form
            className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6"
             onSubmit={(e) => {
              e.preventDefault(); // Prevent the default form submission
              handleAssignTechnicians();
            }}
            >
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
                    >
                      {loadingTicket ? "Saving" : "Assign To Ticket"}
                    </button>
                </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default AddServiceTicket;
