import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import NotesTable from "../../Components/NotesTable";
import TechniciansCard from "../../Components/TechniciansCard";
import WorkOrderCard from "../../Components/WorkOrderCard";
// import AssigneePeopleCard from "../../Components/AssigneePeopleCard"
import ShowTechnicians from "../../Components/ShowTechnicians"
import InventoryTable from "../../Components/InventoryTable"
import {
  getWorkOrderDetails,
  updateNotes,
  updateTechnician,
  updateTicket,
} from "../../actions/workOrderActions";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEmployeeByClientId } from "../../actions/clientEmployeeActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import Loader from "../../Images/ZZ5H.gif"

const EditWorkOrder = () => {
  const { workOrderId } = useParams();
  const dispatch = useDispatch();
  const { workOrderDetails, loading, error } = useSelector(
    (state) => state.workOrder
  );
  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const clientEmployees = useSelector(
    (state) => state.clientEmployee.clientEmployees
  );
  const idrEmployees = useSelector((state) => state.employee.idrEmployees);
  const [workOrder, setWorkOrder] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [notes, setNotes] = useState([]);
  const [assignees, setAssignees] = useState([]);
  const [inventories, setInventories] = useState([]);

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
    setWorkOrder(prev => ({
      ...prev,
      [name]: value,
    }));
  
    if (name === 'client_id') {
      // Dispatch actions when client_id changes
      dispatch(getLocationByClient(value));
      
      // Autofill client name
      const selectedClient = clients?.data?.find(client => client.client_id === value);
      if (selectedClient) {
        setWorkOrder(prev => ({
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
            setWorkOrder(prev => ({
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

  const handleNoteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], [name]: value };
    setNotes(updatedNotes);
  };
  
  const handleAssigneeChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAssignees = [...assigns];
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

  const getFilteredWorkOrder = (workOrder) => {
    const allowedFields = [
      "work_order_id", "client_id", "location_id", "client_name", "work_order_type",
      "generated_date", "generated_time", "po_number", "client_site",
      "job_location", "service_date", "contact_person", "contact_phone_number",
      "contact_mail_id", "issue", "status","local_onsite_person","local_onsite_person_contact",
      "client_emp_user_id"
    ];
    const filteredWorkOrder = {};
    allowedFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(workOrder, field)) {
        filteredWorkOrder[field] = workOrder[field];
      }
    });
    return filteredWorkOrder;
  };
  
  const handleSaveTicket = () => {
    const filteredWorkOrder = getFilteredWorkOrder(workOrder);
    dispatch(updateTicket(filteredWorkOrder));
  };
  

  const getFilteredTechnician = (technician) => {
    const allowedFields = [
      "technician_id", "work_order_id", "technician_name", "project_manager",
       "other_details", "procedures","parts", "labeling_methodology",
       "required_deliverables", "deliverable_instructions","technician_user_id","pm_user_id"
    ];
    const filteredTechnician = {};
    allowedFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(technician, field)) {
        filteredTechnician[field] = technician[field];
      }
    });
    return filteredTechnician;
  };
  
  const handleSaveTechnician = (index) => {
    const filteredTechnician = getFilteredTechnician(technicians[index]);
    dispatch(updateTechnician(filteredTechnician));
  };
  
  const getFilteredNote = (note) => {
    const allowedFields = [
      "note_id", "work_order_id", "comments",
    ];

    const filteredNote = {};
    allowedFields.forEach(field => {
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
  
  const getFilteredAssignees = (technician) => {
    const allowedFields = [
      "technician_id", "work_order_id", "technician_name", "project_manager","technician_user_id","pm_user_id"
    ];
    const filteredAssignees = {};
    allowedFields.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(technician, field)) {
        filteredAssignees[field] = technician[field];
      }
    });
    return filteredAssignees;
  };
  
  
  const handleSaveAssignee = (index) => {
    const filteredAssignees = getFilteredAssignees(technicians[index]);
    // dispatch(updateAssignees(filteredAssignees));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-20 h-20" src={Loader} alt="Loading..." />
      </div>
    );
  }

  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  if (!workOrder) {
    return <div className="text-center mt-5">No work order details found</div>;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Edit Work Order</h1>
            <div className="flex gap-3">
              <Link to={"/workorder"}>
                <button className="border border-gray-400 text-gray-400 px-6 py-2 rounded">
                  Cancel
                </button>
              </Link>
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
          />
          {/* update Technicians */}
          <TechniciansCard
            technicians={technicians}
            handleTechnicianChange={handleTechnicianChange}
            handleSaveTechnicians={handleSaveTechnician}
            loading={loading}
          />
            {/* update Assignee */}
            <ShowTechnicians
            assignees={assignees}
            idrEmployees={idrEmployees}
            handleAssigneeChange={handleAssigneeChange}
            handleSaveAssignee={handleSaveAssignee}
            loading={loading}
            workOrderId={workOrderId}
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
          />
        </div>
      </div>
    </>
  );
};

export default EditWorkOrder;
