import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { S3_BASE_URL } from "../../config";
// import { FaDownload } from "react-icons/fa";
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import ServiceTicketCard from "../../Components/ServiceTicketCard";
import ShowTechnicians from "../../Components/ServiceTicketAssigneePeopleCard";
import ClientEquipmentTable from "../../Components/ClientEquipmentTable";
import ServiceTicketNotes from "../../Components/ServiceTicketNotes";
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
import SignatureModal from "../../Components/SignatureModal";

import { toast } from "react-toastify";

const EditServiceTicket = () => {
  const { serviceTicketId } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const {
    serviceTicketDetails,
    loading,
    error,
    loadingDetails,
    loadingAssign,
  } = useSelector((state) => state.serviceTicket);
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
  const [notes, setNotes] = useState([]);
  const [serviceTicketImages, setServiceTicketImages] = useState([]);
  const [serviceTicketEquipments, setServiceTicketEquipments] = useState([]);
  const [serviceTicketAgreement, setServiceTicketAgreement] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { technicianAccess } = useSelector((state) => state.user);
  // Track which row is being processed
  const [processingId, setProcessingId] = useState(null);
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
      setSignatureImage(serviceTicketDetails?.signature_url);
      setTechnicians(serviceTicketDetails?.technicians || []);
      setNotes(serviceTicketDetails.serviceTicketNotes || []);
      setAssignees(serviceTicketDetails?.service_ticket_assignees || []);
      setServiceTicketImages(
        serviceTicketDetails?.service_ticket_attachments || []
      );
      setServiceTicketEquipments(serviceTicketDetails?.linkedDevices || []);
      setServiceTicketAgreement(serviceTicketDetails?.agreement || {});
      dispatch(
        getClientEquipments({
          client_id: serviceTicketDetails.client_id,
          location_id: serviceTicketDetails.location_id,
        })
      );
    }
  }, [serviceTicketDetails, dispatch]);
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
      "client_name",
      "client_emp_user_id",
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
    dispatch(getServiceTicketDetails(serviceTicketId));
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
    setProcessingId(equipmentId);
    const payload = {
      service_ticket_id: serviceTicketId,
      client_equipment_id: equipmentId,
    };

    // Replace this with the action to link the device
    // dispatch(linkDeviceToServiceTicket(payload));
    dispatch(linkDeviceToServiceTicket(payload))
      .then(() => {
        toast.success("Adding device successfully.");
        window.location.reload();
        closeDeviceModal();
      })
      .catch((error) => {
        console.error("Error adding device :", error);
        // toast.error("Failed to add device.");
      });
  };

  const handleAddNote = (payload) => {
    dispatch(addNoteToDevice(payload));
    dispatch(getServiceTicketDetails(serviceTicketId));
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
              <Link to={"/service-tickets"}>
                <button className="border border-gray-400 text-gray-400 px-6 py-2 rounded">
                  Cancel
                </button>
              </Link>
              {client_type !== "User" && (
                <>
                  {serviceTicketAgreement?.agreement_id && (
                    <Link
                      to={`/edit-service-agreement/${serviceTicketAgreement?.agreement_id}`}
                    >
                      <button className="border border-blue-500 bg-blue-500 text-white px-6 py-2 rounded flex items-center">
                        Service Agreement
                      </button>
                    </Link>
                  )}
                </>
              )}

              {/* Add Device to Ticket Button */}
              {technicianAccess.includes(user_type) && (
                <button
                  onClick={openDeviceModal}
                  className="border border-blue-500 bg-blue-500 text-white px-6 py-2 rounded flex items-center"
                >
                  Add Device To Ticket
                </button>
              )}
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

          {/* Ticket Notes */}
          <ServiceTicketNotes
            notes={notes}
            loading={loading}
            serviceTicketId={serviceTicketId}
          />
          {showDeviceModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded p-6 w-3/4 h-3/4 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">Select Device</h3>
                <table className="table-auto w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="border px-4 py-2">Serial Number</th>
                      <th className="border px-4 py-2">Device ID</th>
                      <th className="border px-4 py-2">Hostname</th>
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
                            {equipment.serial_number}
                          </td>
                          <td className="border px-4 py-2">
                            {equipment.device_id}
                          </td>
                          <td className="border px-4 py-2">
                            {equipment.mac_address}
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
                              disabled={
                                processingId &&
                                processingId !== equipment.client_equipment_id
                              } //disable other rows
                            >
                              {processingId === equipment.client_equipment_id &&
                              loadingAssign
                                ? "Saving"
                                : "Add"}
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

          {/* Segnature modal */}
          <div className="p-6">
            <button
              onClick={openModal}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Signature
            </button>

            {signatureImage && (
            <div className="flex flex-col items-center gap-2 p-4 border-2 border-gray-300 rounded-lg bg-gray-100 max-w-sm text-center mt-5">
              <h2 className="text-lg font-semibold text-gray-700">Signature:</h2>
              <img
                src={`${S3_BASE_URL}/${signatureImage}`}
                alt="Signature"
                className="w-full max-w-xs h-auto border border-gray-400 rounded-md p-2 bg-white"
              />
            </div>
          )}


            <SignatureModal
              isOpen={isModalOpen}
              onClose={closeModal}
              serviceTicketId={serviceTicketId}
              
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditServiceTicket;
