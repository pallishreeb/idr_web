import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
// import { FaDownload } from "react-icons/fa";
// import axios from '../../axios-config';
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import ServiceTicketCard from "../../Components/ServiceTicketCard";
import ShowTechnicians from "../../Components/ServiceTicketAssigneePeopleCard"

import {
  getServiceTicketDetails,
  updateServiceTicket,
} from "../../actions/serviceTicket";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import Loader from "../../Images/ZZ5H.gif"

const EditServiceTicket = () => {
  const { serviceTicketId } = useParams();
  const dispatch = useDispatch();
  const { serviceTicketDetails, loading, error,loadingDetails } = useSelector(
    (state) => state.serviceTicket
  );
  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees
  );
  const idrEmployees = useSelector((state) => state.employee.idrEmployees);
  const [serviceTicket, setServiceTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  // const [isDownloading, setIsDownloading] = useState(false); // Loading state
  useEffect(() => {
    dispatch(getServiceTicketDetails(serviceTicketId));
    dispatch(getClients());
    dispatch(fetchIDREmployees());
  }, [dispatch, serviceTicketId]);

  useEffect(() => {
    // console.log("workOrderDetails:", workOrderDetails); // Debugging line
    if (serviceTicketDetails) {
      setServiceTicket(serviceTicketDetails);
      setTechnicians(serviceTicketDetails?.technicians || []);
      setAssignees(serviceTicketDetails?.service_ticket_assignees || []);
    }
  }, [serviceTicketDetails]);
  useEffect(() => {
    if (serviceTicket?.client_id) {
      dispatch(getLocationByClient(serviceTicket?.client_id));
      dispatch(getClientEmployeeByClientId(serviceTicket?.client_id));
    }
  }, [dispatch, serviceTicket?.client_id]);

  const handleServiceTicketChange = (e) => {
    const { name, value } = e.target;    
    setServiceTicket(prev => ({
      ...prev,
      [name]: value,
    }));
  
    if (name === 'client_id') {
      // Dispatch actions when client_id changes
      dispatch(getLocationByClient(value));
      
      // Autofill client name
      const selectedClient = clients?.data?.find(client => client.client_id === value);
      if (selectedClient) {
        setServiceTicket(prev => ({
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
            (employee) => (employee.first_name + ' ' + employee.last_name) === value
          );
          if (selectedEmployee) {
            setServiceTicket(prev => ({
              ...prev,
              contact_person: selectedEmployee.first_name + " " + selectedEmployee.last_name,
              contact_phone_number: selectedEmployee.contact_number,
              contact_mail_id: selectedEmployee.email_id,
              client_emp_user_id:selectedEmployee.user_id
            }));
          }
        }
  };
  
  const handleTechnicianChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTechnicians = [...technicians];
    updatedTechnicians[index] = { ...updatedTechnicians[index], [name]: value };
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name +''+ employee.last_name === value
      );
      
      if (selectedTechnician) {
        updatedTechnicians[index].technician_user_id = selectedTechnician.user_id;
      } else {
        updatedTechnicians[index].technician_user_id = technicians[index].technician_user_id || '';
      }
    }
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name +''+ employee.last_name === value
      );

      if (selectedTechnician) {
        updatedTechnicians[index].pm_user_id = selectedTechnician.user_id;
      } else {
        updatedTechnicians[index].pm_user_id = technicians[index].pm_user_id || '';
      }
    }
    setTechnicians(updatedTechnicians);
  };

  const handleAssigneeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAssignees = [...assignees];
    updatedAssignees[index] = { ...updatedAssignees[index], [name]: value };
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name +''+ employee.last_name === value
      );
      
      if (selectedTechnician) {
        updatedAssignees[index].technician_user_id = selectedTechnician.user_id;
      } else {
        updatedAssignees[index].technician_user_id = technicians[index].technician_user_id || '';
      }
    }
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name +''+ employee.last_name === value
      );

      if (selectedTechnician) {
        updatedAssignees[index].pm_user_id = selectedTechnician.user_id;
      } else {
        updatedAssignees[index].pm_user_id = technicians[index].pm_user_id || '';
      }
    }
    setTechnicians(updatedAssignees);
  };

  const getFilteredServiceTicket = (serviceTicket) => {
    const allowedFields = [
      "client_id",
      "location_id",
      "customer_po",
      "service_date",
      "service_location",
      "service_request",
      "status",
      "contact_person",
      "contact_phone_number",
      "contact_email",
      "local_onsite_contact",
      "local_onsite_contact_number",
      "service_ticket_details", 
      "ticket_notes"
    ];
    const filteredWorkOrder = {};
    allowedFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(serviceTicket, field)) {
        filteredWorkOrder[field] = serviceTicket[field];
      }
    });
    return filteredWorkOrder;
  };
  
  const handleSaveTicket = () => {
    const filteredWorkOrder = getFilteredServiceTicket(serviceTicket);
    dispatch(updateServiceTicket(filteredWorkOrder,serviceTicketId));
    setIsEditing(!isEditing)
  };
  
  // const handleDownloadPdf = async () => {
  //   try {
  //     setIsDownloading(true); // Start loading
  
  //     // Make sure the request is sending the correct headers
  //     const response = await axios.post(
  //       `/work_order/wo_pdf/${workOrderId}`, 
  //       {},  // Sending an empty body, replace if needed
  //       {
  //         headers: {
  //           'Content-Type': 'application/json', // If backend expects this
  //         },
  //         responseType: 'blob', // For PDF download
  //       }
  //     );
  
  //     // Debugging response
  //     // console.log(response, "pdf response");
  
  //     const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  //     const downloadUrl = window.URL.createObjectURL(pdfBlob);
      
  //     const link = document.createElement("a");
  //     link.href = downloadUrl;
  //     link.download = `${workOrder?.ticket_number}.pdf`;
  //     document.body.appendChild(link);
  //     link.click();
      
  //     document.body.removeChild(link);
  //     setIsDownloading(false); // Stop loading
  //   } catch (error) {
  //     console.error("Error downloading PDF:", error);
  //     setIsDownloading(false); // Stop loading in case of error
  //   }
  // };
  
  
  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-20 h-20" src={Loader} alt="Loading..." />
      </div>
    );
  }


  if (!serviceTicket) {
    return <div className="text-center mt-5">No service ticket details found</div>;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Edit Service Ticket</h1>
            <div className="flex gap-3">
              <Link to={"/workorder"}>
                <button className="border border-gray-400 text-gray-400 px-6 py-2 rounded">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
          {/* update Work order ticket details */}
          <ServiceTicketCard
            serviceTicket={serviceTicket}
            clients={clients}
            locations={locations}
            clientEmployees={clientEmployees}
            handleServiceTicketChange={handleServiceTicketChange}
            handleSaveTicket={handleSaveTicket}
            loading={loading}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />

            {/* update Assignee */}
            <ShowTechnicians
            assignees={assignees}
            idrEmployees={idrEmployees}
            handleAssigneeChange={handleAssigneeChange}
            loading={loading}
            serviceTicketId={serviceTicketId}
          />
        </div>
      </div>
    </>
  );
};

export default EditServiceTicket;
