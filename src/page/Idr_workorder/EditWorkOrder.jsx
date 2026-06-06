import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate, useSearchParams } from "react-router-dom";
import { FaDownload } from "react-icons/fa";
import axios from "../../axios-config";
import { S3_BASE_URL } from "../../config";
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import NotesTable from "../../Components/NotesTable";
import TechniciansCard from "../../Components/TechniciansCard";
import WorkOrderCard from "../../Components/WorkOrderCard";
// import AssigneePeopleCard from "../../Components/AssigneePeopleCard"
import ShowTechnicians from "../../Components/ShowTechnicians";
import InventoryTable from "../../Components/InventoryTable";
import EquipmentTable from "../../Components/EquipmentTable";
import {
  getWorkOrderDetails,
  updateNotes,
  updateTechnician,
  updateTicket,
  assignSubcontractorUsersToWorkOrder,
  deleteSubcontractorUserFromWorkOrder,
} from "../../actions/workOrderActions";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import Loader from "../../Images/ZZ5H.gif";
import WorkOrderImages from "../../Components/WorkOrderImages";
import WOSignatureModal from "../../Components/WOSignatureModal";
import ShowSubcontractorUsers from "../../Components/subcontractor/ShowSubcontractorUsers";

const EditWorkOrder = () => {
  const { workOrderId } = useParams();
  const dispatch = useDispatch();
  // const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const { workOrderDetails, loading, error, loadingDetails } = useSelector(
    (state) => state.workOrder,
  );
  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees,
  );
  const { access } = useSelector((state) => state.user);
  const { user_type } = useSelector((state) => state.user.user);
  const idrEmployees = useSelector((state) => state.employee.idrEmployees);
  const [workOrder, setWorkOrder] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [subcontractorUsers, setSubcontractorUsers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [serviceTicketImages, setServiceTicketImages] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isWorkOrderEditing, setIsWorkOrderEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // Loading state
  useEffect(() => {
    dispatch(getWorkOrderDetails(workOrderId));
    dispatch(getClients());
    dispatch(fetchIDREmployees());
  }, [dispatch, workOrderId]);

  useEffect(() => {
    // console.log("workOrderDetails:", workOrderDetails); // Debugging line
    if (workOrderDetails) {
      setWorkOrder(workOrderDetails);
      setTechnicians(workOrderDetails.technicians || []);
      setNotes(workOrderDetails.notes || []);
      setAssignees(workOrderDetails.assignees || []);
      setInventories(workOrderDetails.inventories || []);
      setEquipments(workOrderDetails.equipment || []);
      setServiceTicketImages(workOrderDetails?.workorder_attachments || []);
      setSignatureImage(workOrderDetails?.signature_url);
      setSubcontractorUsers(
        workOrderDetails?.subcontractor_in_work_orders || [],
      );
    }
  }, [workOrderDetails]);
  useEffect(() => {
    if (workOrder?.client_id) {
      dispatch(getLocationByClient(workOrder?.client_id));
      dispatch(getClientEmployeeByClientId(workOrder?.client_id));
    }
  }, [dispatch, workOrder?.client_id]);

  const handleWorkOrderChange = (e) => {
    const { name, value } = e.target;
    setWorkOrder((prev) => ({
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
        setWorkOrder((prev) => ({
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
        setWorkOrder((prev) => ({
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

  const handleTechnicianChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTechnicians = [...technicians];
    updatedTechnicians[index] = { ...updatedTechnicians[index], [name]: value };
    if (name === "technician_name") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name + "" + employee.last_name === value,
      );

      if (selectedTechnician) {
        updatedTechnicians[index].technician_user_id =
          selectedTechnician.user_id;
      } else {
        updatedTechnicians[index].technician_user_id =
          technicians[index].technician_user_id || "";
      }
    }
    if (name === "project_manager") {
      const selectedTechnician = idrEmployees.find(
        (employee) => employee.first_name + "" + employee.last_name === value,
      );

      if (selectedTechnician) {
        updatedTechnicians[index].pm_user_id = selectedTechnician.user_id;
      } else {
        updatedTechnicians[index].pm_user_id =
          technicians[index].pm_user_id || "";
      }
    }
    setTechnicians(updatedTechnicians);
  };

  const handleNoteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], [name]: value };
    setNotes(updatedNotes);
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

  const getFilteredWorkOrder = (workOrder) => {
    const allowedFields = [
      "work_order_id",
      "client_id",
      "location_id",
      "client_name",
      "work_order_type",
      "generated_date",
      "generated_time",
      "po_number",
      "client_site",
      "job_location",
      "service_date",
      "contact_person",
      "contact_phone_number",
      "contact_mail_id",
      "issue",
      "status",
      "local_onsite_person",
      "local_onsite_person_contact",
      "client_emp_user_id",
      "is_billed",
    ];
    const filteredWorkOrder = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(workOrder, field)) {
        filteredWorkOrder[field] = workOrder[field];
      }
    });
    return filteredWorkOrder;
  };

  const handleSaveTicket = () => {
    const filteredWorkOrder = getFilteredWorkOrder(workOrder);
    dispatch(updateTicket(filteredWorkOrder));
    setIsEditing(!isEditing);
  };

  const getFilteredTechnician = (technician) => {
    const allowedFields = [
      "technician_id",
      "work_order_id",
      "technician_name",
      "project_manager",
      "other_details",
      "procedures",
      "parts",
      "labeling_methodology",
      "required_deliverables",
      "deliverable_instructions",
      "technician_user_id",
      "pm_user_id",
    ];
    const filteredTechnician = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(technician, field)) {
        filteredTechnician[field] = technician[field];
      }
    });
    return filteredTechnician;
  };

  const handleSaveTechnician = (index) => {
    const filteredTechnician = getFilteredTechnician(technicians[index]);
    dispatch(updateTechnician(filteredTechnician));
    setIsWorkOrderEditing(!isWorkOrderEditing);
  };

  const getFilteredNote = (note) => {
    const allowedFields = ["note_id", "work_order_id", "comments"];

    const filteredNote = {};
    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(note, field)) {
        filteredNote[field] = note[field];
      }
    });
    return filteredNote;
  };

  const handleSaveNote = (index) => {
    const filteredNote = getFilteredNote(notes[index]);
    dispatch(updateNotes(filteredNote));
  };

  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true); // Start loading

      // Make sure the request is sending the correct headers
      const response = await axios.post(
        `/work_order/wo_pdf/${workOrderId}`,
        {}, // Sending an empty body, replace if needed
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
      link.download = `${workOrder?.ticket_number}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      setIsDownloading(false); // Stop loading
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setIsDownloading(false); // Stop loading in case of error
    }
  };
  const formatDateToMDY = (dateString) => {
    if (!dateString) return ""; // Handle empty values

    const [day, month, year] = dateString.split("/"); // Extract parts
    return `${month}/${day}/${year}`; // Rearrange to MM/DD/YYYY
  };

  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-20 h-20" src={Loader} alt="Loading..." />
      </div>
    );
  }

  if (!workOrder) {
    return <div className="text-center mt-5">No work order details found</div>;
  }
  const canAddClientEquip =
    user_type == "Subcontractor_User" || user_type == "Subcontractor";
  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Edit Work Order</h1>
            <div className="flex gap-3">
              <Link to={`/workorder?${searchParams.toString()}`}>
                <button className="border border-gray-400 text-gray-400 px-6 py-2 rounded">
                  Back
                </button>
              </Link>
              {canAddClientEquip &&
                workOrder.status?.toLowerCase() !== "Closed" && (
                  <button
                    onClick={() =>
                      navigate(
                        `/add-client-equipment/${workOrder?.client_id}/${workOrder?.location_id}/?&sort_key=device_type&sort_direction=ASC`,
                        {
                          state: {
                            serviceTicketId: workOrderId,
                            returnTo: "edit-work-order",
                          },
                        },
                      )
                    }
                    className="border border-blue-500 bg-blue-500 text-white px-6 py-2 rounded"
                  >
                    Add Client Equipment
                  </button>
                )}
              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPdf}
                className="rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
                      via-[#312E81]
                      to-[#4338CA]
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all text-white px-6 py-2  flex items-center"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  // Display loading spinner while downloading
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Download WO PDF <FaDownload className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
          {/* update Work order ticket details */}
          <WorkOrderCard
            workOrder={workOrder}
            clients={clients}
            locations={locations}
            clientEmployees={clientEmployees}
            handleWorkOrderChange={handleWorkOrderChange}
            handleSaveTicket={handleSaveTicket}
            loading={loading}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
          {/* update Technicians */}
          <TechniciansCard
            technicians={technicians}
            handleTechnicianChange={handleTechnicianChange}
            handleSaveTechnicians={handleSaveTechnician}
            loading={loading}
            isWorkOrderEditing={isWorkOrderEditing}
            setIsWorkOrderEditing={setIsWorkOrderEditing}
          />
          {/* update Assignee */}
          <ShowTechnicians
            assignees={assignees}
            idrEmployees={idrEmployees}
            handleAssigneeChange={handleAssigneeChange}
            loading={loading}
            workOrderId={workOrderId}
            subcontractorAssignees={subcontractorUsers}
          />
          {user_type === "Client Employee" && (
            <ShowSubcontractorUsers
              subcontractorAssignees={subcontractorUsers}
              parentId={workOrderId}
              assignAction={assignSubcontractorUsersToWorkOrder}
              deleteAction={deleteSubcontractorUserFromWorkOrder}
              refreshAction={getWorkOrderDetails}
              parentKey="work_order_id"
              idKey="subcontractor_in_wo_id" // 🔥 unique id key for WO
              title="Subcontractor Users"
            />
          )}
          {/* Show Images  */}
          <WorkOrderImages
            images={serviceTicketImages}
            serviceTicketId={workOrderId}
          />
          {/* update Notes */}
          <NotesTable
            notes={notes}
            handleSaveNote={handleSaveNote}
            handleNoteChange={handleNoteChange}
            loading={loading}
            workOrderId={workOrderId}
          />
          {/* InventoryTable */}
          <InventoryTable
            inventories={inventories}
            work_order_id={workOrderId}
          />
          {/* Equipments Table */}
          <EquipmentTable equipments={equipments} work_order_id={workOrderId} />

          {/* SIGNATURE SECTION */}

          <div className="mt-6">
            {signatureImage ? (
              <div
                className="
        bg-white
        rounded-[28px]
        border
        border-gray-100
        shadow-sm
        overflow-hidden
        max-w-2xl
      "
              >
                {/* TOP GRADIENT */}
                <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

                <div className="p-5 md:p-6">
                  {/* HEADER */}
                  <div className="flex items-center gap-4 mb-5">
                    <div
                      className="
              w-12
              h-12
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
                      ✍️
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-[#1E1B4B]">
                        Customer Signature
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Signed work order acknowledgment
                      </p>
                    </div>
                  </div>

                  {/* AGREEMENT TEXT */}
                  <div
                    className="
            rounded-2xl
            border
            border-indigo-100
            bg-indigo-50
            px-4
            py-4
            text-sm
            text-indigo-800
            leading-relaxed
            mb-5
          "
                  >
                    By signing below, the client acknowledges that the work has
                    been completed to their satisfaction based on the notes,
                    services, and supporting photos provided in this work order.
                  </div>

                  {/* SIGNATURE IMAGE */}
                  <div
                    className="
            rounded-3xl
            border
            border-gray-200
            bg-gray-50
            p-5
            flex
            justify-center
            items-center
          "
                  >
                    <img
                      src={`${S3_BASE_URL}/${signatureImage}`}
                      alt="Signature"
                      className="
              w-full
              max-w-md
              object-contain
            "
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div
                      className="
              rounded-2xl
              border
              border-gray-100
              bg-gray-50
              px-4
              py-3
            "
                    >
                      <p className="text-xs text-gray-500 mb-1">Signed By</p>

                      <p className="text-sm font-semibold text-[#1E1B4B]">
                        {workOrder ? workOrder.signature_name : "NA"}
                      </p>
                    </div>

                    <div
                      className="
              rounded-2xl
              border
              border-gray-100
              bg-gray-50
              px-4
              py-3
            "
                    >
                      <p className="text-xs text-gray-500 mb-1">Signed Date</p>

                      <p className="text-sm font-semibold text-[#1E1B4B]">
                        {workOrder && workOrder.signature_date
                          ? formatDateToMDY(workOrder.signature_date)
                          : "NA"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {user_type !== "Client Employee" &&
                  user_type !== "Subcontractor_User" && (
                    <div
                      className="
              bg-white
              rounded-[28px]
              border
              border-dashed
              border-gray-300
              shadow-sm
              p-8
              flex
              flex-col
              items-center
              justify-center
              text-center
              max-w-2xl
            "
                    >
                      <div
                        className="
                w-16
                h-16
                rounded-3xl
                bg-gradient-to-r
              from-[#312E81]
              via-[#4338CA]
              to-[#6366F1]
                text-white
                flex
                items-center
                justify-center
                text-3xl
                shadow-lg
                mb-5
              "
                      >
                        ✍️
                      </div>

                      <h2 className="text-lg font-semibold text-[#1E1B4B]">
                        Add Customer Signature
                      </h2>

                      <p className="text-sm text-gray-500 mt-2 max-w-md leading-relaxed">
                        Capture the customer acknowledgment signature after work
                        completion and verification.
                      </p>

                      <button
                        onClick={openModal}
                        className="
                mt-6
                px-6
                py-3
                rounded-2xl
                bg-gradient-to-r
             from-[#312E81]
            via-[#4338CA]
            to-[#6366F1]
                text-white
                font-semibold
                shadow-md
                hover:shadow-lg
                hover:scale-[1.02]
                transition-all
              "
                      >
                        Add Signature
                      </button>
                    </div>
                  )}
              </>
            )}

            <WOSignatureModal
              isOpen={isModalOpen}
              onClose={closeModal}
              serviceTicketId={workOrderId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EditWorkOrder;
