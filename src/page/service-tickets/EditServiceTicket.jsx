/** @format */

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "../../axios-config";
import { Link, useParams,useSearchParams } from "react-router-dom";
import { S3_BASE_URL } from "../../config";
import { FaDownload } from "react-icons/fa";
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import ServiceTicketCard from "../../Components/ServiceTicketCard";
import ShowTechnicians from "../../Components/ServiceTicketAssigneePeopleCard";
import ClientEquipmentTable from "../../Components/ClientEquipmentTable";
import ServiceTicketNotes from "../../Components/ServiceTicketNotes";
import InventoryTable from "../../Components/InventoryTable";
import {
  getServiceTicketDetails,
  updateServiceTicket,
  linkDeviceToServiceTicket,
  addNoteToDevice,
  updateNotes,
  assignSubcontractorUsersToServiceTicket,
  deleteSubcontractorUserFromServiceTicket,
} from "../../actions/serviceTicket";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import { getClientEquipments } from "../../actions/clientEquipment";
import Loader from "../../Images/ZZ5H.gif";
import ServiceTicketImages from "../../Components/ServiceTicketImages";
import SignatureModal from "../../Components/SignatureModal";
import ShowSubcontractorUsers from "../../Components/subcontractor/ShowSubcontractorUsers";
import { toast } from "react-toastify";
import { MdDraw, MdDevices, MdClose, MdAdd } from "react-icons/md";

const EditServiceTicket = () => {
  const { serviceTicketId } = useParams();
  const dispatch = useDispatch();
  // const location = useLocation();
  const [searchParams] = useSearchParams();
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
    (state) => state.clientEmployee.clientEmployees,
  );
  const equipments = useSelector((state) => state.clientEquipment.equipments);
  const idrEmployees = useSelector((state) => state.employee.idrEmployees);
  const [serviceTicket, setServiceTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [notes, setNotes] = useState([]);
  const [serviceTicketImages, setServiceTicketImages] = useState([]);
  const [serviceTicketEquipments, setServiceTicketEquipments] = useState([]);
  const [serviceTicketAgreement, setServiceTicketAgreement] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { technicianAccess, access } = useSelector((state) => state.user);
  const [isDownloading, setIsDownloading] = useState(false); // Loading state
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
    if (!serviceTicketDetails) return;
    // console.log("workOrderDetails:", workOrderDetails); // Debugging line
    if (serviceTicketDetails) {
      setServiceTicket(serviceTicketDetails);
      setSignatureImage(serviceTicketDetails?.signature_url);
      setTechnicians(serviceTicketDetails?.technicians || []);
      setNotes(serviceTicketDetails.serviceTicketNotes || []);
      setAssignees(serviceTicketDetails?.service_ticket_assignees || []);
      setServiceTicketImages(
        serviceTicketDetails?.service_ticket_attachments || [],
      );
      setServiceTicketEquipments(serviceTicketDetails?.linkedDevices || []);
      setInventories(serviceTicketDetails?.inventories || []);
      setServiceTicketAgreement(serviceTicketDetails?.agreement || {});
      // API call should be done only if technicianAccess includes user_type
      const addRmaAccess = [...technicianAccess, "Subcontractor_User"];
      if (addRmaAccess.includes(user_type)) {
        dispatch(
          getClientEquipments({
            client_id: serviceTicketDetails.client_id,
            location_id: serviceTicketDetails.location_id,
          }),
        );
      }
    }
  }, [serviceTicketDetails, user_type, technicianAccess, dispatch]);
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
        (client) => client.client_id === value,
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
        (employee) => employee.first_name + " " + employee.last_name === value,
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
        (employee) => employee.first_name + "" + employee.last_name === value,
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
        (employee) => employee.first_name + "" + employee.last_name === value,
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
      "is_billed",
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

    dispatch(linkDeviceToServiceTicket(payload))
      .then((response) => {
        if (response) {
          // Refresh the service ticket details to get updated data
          dispatch(getServiceTicketDetails(serviceTicketId)).then(() => {
            closeDeviceModal();
            setProcessingId(null);
          });
        }
      })
      .catch((error) => {
        console.error("Error adding device:", error);
        setProcessingId(null);
      });
  };

  const handleAddNote = (payload) => {
    dispatch(addNoteToDevice(payload));
    dispatch(getServiceTicketDetails(serviceTicketId));
  };
  const getFilteredNote = (note) => {
    const allowedFields = [
      "service_ticket_id",
      "comments", // "note_id",
    ];

    const filteredNote = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(note, field)) {
        filteredNote[field] = note[field];
      }
    });
    return filteredNote;
  };
  const handleSaveNote = (index) => {
    const note = notes[index];
    const filteredNote = getFilteredNote(notes[index]);
    dispatch(updateNotes(filteredNote, note?.["note_id"]));
  };
  const handleNoteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], [name]: value };
    setNotes(updatedNotes);
  };
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true); // Start loading

      // Make sure the request is sending the correct headers
      const response = await axios.get(
        `/service_ticket/pdf/${serviceTicketId}`,
        {
          headers: {
            "Content-Type": "application/json", // If backend expects this
          },
          responseType: "blob", // For PDF download
        },
      );

      // Debugging response
      // console.log(response, "pdf response");

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${serviceTicket?.service_ticket_number}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      setIsDownloading(false); // Stop loading
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setIsDownloading(false); // Stop loading in case of error
    }
  };

  if (!serviceTicket) {
    return (
      <div className="text-center mt-5">No service ticket details found</div>
    );
  }
  const formatDateToMDY = (dateString) => {
    if (!dateString) return ""; // Handle empty values

    const [day, month, year] = dateString.split("/"); // Extract parts
    return `${month}/${day}/${year}`; // Rearrange to MM/DD/YYYY
  };
  const newAccess = ["Subcontractor_User", "Subcontractor"];
  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          {/* PAGE HEADER */}
          <div
            className="
    bg-white
    rounded-[28px]
    border
    border-gray-100
    shadow-sm
    overflow-hidden
    mb-5
  "
          >
            {/* TOP BORDER */}
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="px-6 py-5">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                {/* LEFT SECTION */}
                <div className="flex items-center gap-4">
                  <div
                    className="
            w-16
            h-16
            rounded-2xl
            bg-gradient-to-r
          from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
            text-white
            flex
            items-center
            justify-center
            shadow-md
          "
                  >
                    <MdDevices className="text-3xl" />
                  </div>

                  <div>
                    <h1 className="text-2xl font-bold text-[#1E1B4B]">
                      Edit Service Ticket
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span
                        className="
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                bg-indigo-50
                text-indigo-700
                text-xs
                font-semibold
              "
                      >
                        Ticket # {serviceTicket?.service_ticket_number}
                      </span>

                      <span
                        className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
                ${
                  serviceTicket?.status?.toLowerCase() === "closed"
                    ? "bg-red-100 text-red-700"
                    : "bg-green-100 text-green-700"
                }
              `}
                      >
                        {serviceTicket?.status || "Open"}
                      </span>

                      {serviceTicket?.service_date && (
                        <span className="text-sm text-gray-500">
                          Service Date: {serviceTicket?.service_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT ACTIONS */}
                <div className="flex flex-wrap gap-3">
                  {/* BACK */}
                  <Link to={`/service-tickets?${searchParams.toString()}`}>
                    <button
                      className="
              flex
              items-center
              justify-center
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
              transition-all
            "
                    >
                      <MdClose className="text-lg" />
                      Back
                    </button>
                  </Link>

                  {/* SERVICE AGREEMENT */}
                  {client_type !== "User" &&
                    !newAccess.includes(user_type) &&
                    serviceTicketAgreement?.agreement_id && (
                      <Link
                        to={`/edit-service-agreement/${serviceTicketAgreement?.agreement_id}`}
                      >
                        <button
                          className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-blue-500
                  text-white
                  text-sm
                  font-semibold
                  shadow-sm
                  hover:bg-blue-600
                  hover:shadow-md
                  transition-all
                "
                        >
                          Service Agreement
                        </button>
                      </Link>
                    )}

                  {/* ADD DEVICE */}
                  {((newAccess.includes(user_type) &&
                    serviceTicket?.status?.toLowerCase() !== "closed") ||
                    technicianAccess.includes(user_type)) && (
                    <button
                      onClick={openDeviceModal}
                      className="
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-2xl
              bg-gradient-to-r
             from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
              text-white
              text-sm
              font-semibold
              shadow-sm
              hover:shadow-md
              transition-all
            "
                    >
                      <MdAdd className="text-lg" />
                      Add Device
                    </button>
                  )}

                  {/* DOWNLOAD PDF */}
                  {technicianAccess.includes(user_type) && (
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloading}
                      className={`
              flex
              items-center
              justify-center
              gap-2
              px-5
              py-3
              rounded-2xl
              text-sm
              font-semibold
              shadow-sm
              transition-all
              ${
                isDownloading
                  ? "bg-gray-300 text-white cursor-not-allowed"
                  : "bg-green-500 text-white hover:bg-green-600 hover:shadow-md"
              }
            `}
                    >
                      {isDownloading ? (
                        <>
                          <div
                            className="
                    w-4
                    h-4
                    border-2
                    border-white
                    border-t-transparent
                    rounded-full
                    animate-spin
                  "
                          />
                          Downloading...
                        </>
                      ) : (
                        <>
                          Download PDF
                          <FaDownload className="text-sm" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
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
            subcontractorAssignees={
              serviceTicketDetails?.subcontractor_in_service_tickets
            }
          />
          {user_type !== "Client Employee" && (
            <ShowSubcontractorUsers
              subcontractorAssignees={
                serviceTicketDetails?.subcontractor_in_service_tickets
              }
              parentId={serviceTicketId}
              assignAction={assignSubcontractorUsersToServiceTicket}
              deleteAction={deleteSubcontractorUserFromServiceTicket}
              refreshAction={getServiceTicketDetails}
              parentKey="service_ticket_id"
              idKey="subcontractor_in_st_id" // 🔥 unique id key for ST
              title="Subcontractor Users"
            />
          )}
          {/* show ClientEquipmentTable */}
          <ClientEquipmentTable
            equipments={serviceTicketEquipments}
            serviceTicketId={serviceTicketId}
            onAddNote={handleAddNote}
            serviceTicket={serviceTicket}
          />

          {/* Show Images  */}
          <ServiceTicketImages
            images={serviceTicketImages}
            serviceTicketId={serviceTicketId}
          />
          {/* InventoryTable */}
          <InventoryTable
            inventories={inventories}
            service_ticket_id={serviceTicketId}
          />
          {/* Ticket Notes */}
          <ServiceTicketNotes
            notes={notes}
            loading={loading}
            serviceTicketId={serviceTicketId}
            handleSaveNote={handleSaveNote}
            handleNoteChange={handleNoteChange}
          />
          {showDeviceModal && (
            <div
              className="
      fixed
      inset-0
      bg-black/50
      flex
      items-center
      justify-center
      z-50
      p-4
    "
            >
              <div
                className="
        bg-white
        rounded-[28px]
        shadow-2xl
        w-full
        max-w-7xl
        max-h-[92vh]
        overflow-hidden
        flex
        flex-col
      "
              >
                {/* TOP BORDER */}
                <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

                {/* HEADER */}
                <div
                  className="
          px-6
          py-5
          border-b
          border-gray-100
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="
              w-14
              h-14
              rounded-2xl
              bg-indigo-100
              text-indigo-600
              flex
              items-center
              justify-center
            "
                    >
                      <MdDevices className="text-3xl" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-[#1E1B4B]">
                        Select Device
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Choose a device to add to the service ticket
                      </p>
                    </div>
                  </div>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={closeDeviceModal}
                    className="
            flex
            items-center
            justify-center
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
            transition-all
          "
                  >
                    <MdClose className="text-lg" />
                    Close
                  </button>
                </div>

                {/* TABLE */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr>
                        <th
                          className="
                  px-4
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  border-b
                  whitespace-nowrap
                "
                        >
                          Serial Number
                        </th>

                        <th
                          className="
                  px-4
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  border-b
                  whitespace-nowrap
                "
                        >
                          Device ID
                        </th>

                        <th
                          className="
                  px-4
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  border-b
                  whitespace-nowrap
                "
                        >
                          MAC Address
                        </th>

                        <th
                          className="
                  px-4
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  border-b
                  whitespace-nowrap
                "
                        >
                          Model
                        </th>

                        <th
                          className="
                  px-4
                  py-4
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  border-b
                  text-center
                  whitespace-nowrap
                "
                        >
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {equipments?.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-20">
                            <div className="flex flex-col items-center justify-center text-center">
                              <div
                                className="
                        w-20
                        h-20
                        rounded-full
                        bg-gray-100
                        flex
                        items-center
                        justify-center
                        mb-4
                      "
                              >
                                <MdDevices className="text-4xl text-gray-400" />
                              </div>

                              <h3 className="text-base font-semibold text-[#1E1B4B]">
                                No Devices Found
                              </h3>

                              <p className="text-sm text-gray-500 mt-2">
                                No available equipment found for this location.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        equipments?.map((equipment, index) => (
                          <tr
                            key={equipment.client_equipment_id}
                            className="
                      border-b
                      border-gray-100
                      hover:bg-indigo-50/40
                      transition-all
                    "
                          >
                            {/* SERIAL */}
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-semibold text-[#1E1B4B]">
                                  {equipment.serial_number || "NA"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Device Serial
                                </p>
                              </div>
                            </td>

                            {/* DEVICE ID */}
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {equipment.device_id || "NA"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Device Identifier
                                </p>
                              </div>
                            </td>

                            {/* MAC */}
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700 break-all">
                                  {equipment.mac_address || "NA"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  MAC Address
                                </p>
                              </div>
                            </td>

                            {/* MODEL */}
                            <td className="px-4 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {equipment.model || "NA"}
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  Device Model
                                </p>
                              </div>
                            </td>

                            {/* ACTION */}
                            <td className="px-4 py-4">
                              <div className="flex justify-center">
                                <button
                                  onClick={() =>
                                    handleAddDeviceToTicket(
                                      equipment.client_equipment_id,
                                    )
                                  }
                                  disabled={
                                    processingId &&
                                    processingId !==
                                      equipment.client_equipment_id
                                  }
                                  className={`
                            flex
                            items-center
                            justify-center
                            gap-2
                            px-5
                            py-2.5
                            rounded-xl
                            text-sm
                            font-semibold
                            transition-all
                            ${
                              processingId === equipment.client_equipment_id &&
                              loadingAssign
                                ? "bg-gray-300 text-white cursor-not-allowed"
                                : "bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white shadow-sm hover:shadow-md"
                            }
                          `}
                                >
                                  {processingId ===
                                    equipment.client_equipment_id &&
                                  loadingAssign ? (
                                    <>
                                      <div
                                        className="
                                  w-4
                                  h-4
                                  border-2
                                  border-white
                                  border-t-transparent
                                  rounded-full
                                  animate-spin
                                "
                                      />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <MdAdd className="text-lg" />
                                      Add Device
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Signature Section */}
          <div
            className="
    bg-white
    rounded-[24px]
    border
    border-gray-100
    shadow-sm
    overflow-hidden
    mt-5
  "
          >
            {/* TOP BORDER */}
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-6">
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="
          w-12
          h-12
          rounded-2xl
          bg-indigo-100
          text-indigo-600
          flex
          items-center
          justify-center
        "
                >
                  <MdDraw className="text-2xl" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Client Signature
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Signature confirmation for completed work
                  </p>
                </div>
              </div>

              {/* AGREEMENT TEXT */}
              {user_type === "Client Employee" && (
                <div
                  className="
          bg-indigo-50
          border
          border-indigo-100
          rounded-2xl
          p-4
          mb-5
        "
                >
                  <p className="text-sm text-gray-700 leading-relaxed">
                    By signing below, the client confirms that the services
                    outlined in this ticket have been completed satisfactorily
                    in accordance with the notes, updates, and supporting photos
                    provided.
                  </p>
                </div>
              )}

              {/* SIGNATURE EXISTS */}
              {signatureImage ? (
                <div
                  className="
          max-w-2xl
          border
          border-gray-100
          rounded-2xl
          overflow-hidden
          bg-gray-50
        "
                >
                  {/* SIGNATURE HEADER */}
                  <div
                    className="
            px-5
            py-4
            border-b
            border-gray-100
            bg-white
            flex
            items-center
            justify-between
          "
                  >
                    <div>
                      <h3 className="text-base font-semibold text-[#1E1B4B]">
                        Signed Confirmation
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        Client acknowledgment signature
                      </p>
                    </div>

                    <div
                      className="
              px-3
              py-1
              rounded-full
              bg-green-100
              text-green-700
              text-xs
              font-semibold
            "
                    >
                      Signed
                    </div>
                  </div>

                  {/* SIGNATURE BODY */}
                  <div className="p-5">
                    {/* IMAGE */}
                    <div
                      className="
              bg-white
              border
              border-gray-200
              rounded-2xl
              p-4
              flex
              items-center
              justify-center
            "
                    >
                      <img
                        src={`${S3_BASE_URL}/${signatureImage}`}
                        alt="Signature"
                        className="
                max-h-52
                object-contain
              "
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      <div
                        className="
                bg-white
                border
                border-gray-100
                rounded-2xl
                px-4
                py-3
              "
                      >
                        <p className="text-xs text-gray-500 mb-1">Signed By</p>

                        <p className="text-sm font-semibold text-[#1E1B4B]">
                          {serviceTicket ? serviceTicket.signature_name : ""}
                        </p>
                      </div>

                      <div
                        className="
                bg-white
                border
                border-gray-100
                rounded-2xl
                px-4
                py-3
              "
                      >
                        <p className="text-xs text-gray-500 mb-1">
                          Signature Date
                        </p>

                        <p className="text-sm font-semibold text-[#1E1B4B]">
                          {serviceTicket
                            ? formatDateToMDY(serviceTicket.signature_date)
                            : ""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* EMPTY STATE */}
                  <div
                    className="
            border-2
            border-dashed
            border-gray-200
            rounded-2xl
            bg-gray-50
            py-12
            px-6
            flex
            flex-col
            items-center
            justify-center
            text-center
          "
                  >
                    <div
                      className="
              w-20
              h-20
              rounded-full
              bg-white
              shadow-sm
              flex
              items-center
              justify-center
              mb-4
            "
                    >
                      <MdDraw className="text-4xl text-gray-400" />
                    </div>

                    <h3 className="text-base font-semibold text-[#1E1B4B]">
                      No Signature Added
                    </h3>

                    <p className="text-sm text-gray-500 mt-2 max-w-md">
                      Client signature has not been added yet for this service
                      ticket.
                    </p>

                    {/* ADD BUTTON */}
                    {user_type === "Client Employee" && (
                      <button
                        onClick={openModal}
                        className="
                mt-6
                flex
                items-center
                justify-center
                gap-2
                px-6
                py-3
                rounded-2xl
                bg-gradient-to-r
                from-indigo-500
                via-purple-500
                to-pink-500
                text-white
                text-sm
                font-semibold
                shadow-sm
                hover:shadow-md
                transition-all
              "
                      >
                        <MdDraw className="text-lg" />
                        Add Signature
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* MODAL */}
              <SignatureModal
                isOpen={isModalOpen}
                onClose={closeModal}
                serviceTicketId={serviceTicketId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditServiceTicket;
