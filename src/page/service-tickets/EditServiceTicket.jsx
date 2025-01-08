import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
// import { FaDownload } from "react-icons/fa";
// import axios from '../../axios-config';
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import ServiceTicketCard from "../../Components/ServiceTicketCard";
import ShowTechnicians from "../../Components/ServiceTicketAssigneePeopleCard";
import ClientEquipmentTable from "../../Components/ClientEquipmentTable";
import {
  getServiceTicketDetails,
  updateServiceTicket,
  linkDeviceToServiceTicket,
  addNoteToDevice,
} from "../../actions/serviceTicket";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import { getClientEquipments } from "../../actions/clientEquipment";
import Loader from "../../Images/ZZ5H.gif";
import ServiceTicketImages from "../../Components/ServiceTicketImages";

const EditServiceTicket = () => {
  const { serviceTicketId } = useParams();
  const dispatch = useDispatch();
  const { serviceTicketDetails, loading, error, loadingDetails } = useSelector(
    (state) => state.serviceTicket
  );
  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees
  );
  const equipments = useSelector((state) => state.clientEquipment.equipments);
  const idrEmployees = useSelector((state) => state.employee.idrEmployees);
  const [serviceTicket, setServiceTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [serviceTicketImages, setServiceTicketImages] = useState([]);
  const [serviceTicketEquipments, setServiceTicketEquipments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // Modal state
  const [showDeviceModal, setShowDeviceModal] = useState(false);
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
      setServiceTicketImages(
        serviceTicketDetails?.service_ticket_attachments || []
      );
      setServiceTicketEquipments(serviceTicketDetails?.linkedDevices || []);
      dispatch(
        getClientEquipments({
          client_id: serviceTicketDetails.client_id,
          location_id: serviceTicketDetails.location_id,
        })
      );
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
    setServiceTicket((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "client_id") {
      // Dispatch actions when client_id changes
      dispatch(getLocationByClient(value));

      // Autofill client name
      const selectedClient = clients?.data?.find(
        (client) => client.client_id === value
      );
      if (selectedClient) {
        setServiceTicket((prev) => ({
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
        (employee) => employee.first_name + " " + employee.last_name === value
      );
      if (selectedEmployee) {
        setServiceTicket((prev) => ({
          ...prev,
          contact_person:
            selectedEmployee.first_name + " " + selectedEmployee.last_name,
          contact_phone_number: selectedEmployee.contact_number,
          contact_mail_id: selectedEmployee.email_id,
          client_emp_user_id: selectedEmployee.user_id,
        }));
      }
    }
  };

  const handleAssigneeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAssignees = [...assignees];
    updatedAssignees[index] = { ...updatedAssignees[index], [name]: value };
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name + "" + employee.last_name === value
      );

      if (selectedTechnician) {
        updatedAssignees[index].technician_user_id = selectedTechnician.user_id;
      } else {
        updatedAssignees[index].technician_user_id =
          technicians[index].technician_user_id || "";
      }
    }
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name + "" + employee.last_name === value
      );

      if (selectedTechnician) {
        updatedAssignees[index].pm_user_id = selectedTechnician.user_id;
      } else {
        updatedAssignees[index].pm_user_id =
          technicians[index].pm_user_id || "";
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
      "ticket_notes",
    ];
    const filteredWorkOrder = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(serviceTicket, field)) {
        filteredWorkOrder[field] = serviceTicket[field];
      }
    });
    return filteredWorkOrder;
  };

  const handleSaveTicket = () => {
    const filteredWorkOrder = getFilteredServiceTicket(serviceTicket);
    dispatch(updateServiceTicket(filteredWorkOrder, serviceTicketId));
    setIsEditing(!isEditing);
  };

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-20 h-20" src={Loader} alt="Loading..." />
      </div>
    );
  }

  const openDeviceModal = () => {
    setShowDeviceModal(true);
  };

  const closeDeviceModal = () => {
    setShowDeviceModal(false);
  };

  const handleAddDeviceToTicket = (equipmentId) => {
    const payload = {
      service_ticket_id: serviceTicketId,
      client_equipment_id: equipmentId,
    };

    // Replace this with the action to link the device
    dispatch(linkDeviceToServiceTicket(payload));

    closeDeviceModal();
  };

  const handleAddNote = (payload) => {
    dispatch(addNoteToDevice(payload));
  };

  if (!serviceTicket) {
    return (
      <div className="text-center mt-5">No service ticket details found</div>
    );
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
              {/* Add Device to Ticket Button */}
              <button
                onClick={openDeviceModal}
                className="border border-blue-500 bg-blue-500 text-white px-6 py-2 rounded flex items-center"
              >
                Add Device To Ticket
              </button>
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

          {/* show ClientEquipmentTable */}
          <ClientEquipmentTable
            equipments={serviceTicketEquipments}
            onAddNote={handleAddNote}
          />

          {/* Show Images  */}
          <ServiceTicketImages
            images={serviceTicketImages}
            serviceTicketId={serviceTicketId}
          />
          {showDeviceModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded p-6 w-3/4 h-3/4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Select Device</h3>
                <table className="table-auto w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Device Type</th>
                      <th className="border px-4 py-2">Device ID</th>
                      <th className="border px-4 py-2">Make</th>
                      <th className="border px-4 py-2">Model</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipments?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No Equipments Found
                        </td>
                      </tr>
                    ) : (
                      equipments?.map((equipment) => (
                        <tr key={equipment.client_equipment_id}>
                          <td className="border px-4 py-2">
                            {equipment.device_type}
                          </td>
                          <td className="border px-4 py-2">
                            {equipment.device_id}
                          </td>
                          <td className="border px-4 py-2">
                            {equipment.manufacturer}
                          </td>
                          <td className="border px-4 py-2">
                            {equipment.model}
                          </td>
                          <td className="border px-4 py-2">
                            <button
                              onClick={() =>
                                handleAddDeviceToTicket(
                                  equipment.client_equipment_id
                                )
                              }
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={closeDeviceModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditServiceTicket;
