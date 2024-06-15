import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import NotesTable from "../../Components/NotesTable"
import TechniciansCard from "../../Components/TechniciansCard"
import WorkOrderCard from "../../Components/WorkOrderCard"
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

const EditWorkOrder = () => {
  const { workOrderId } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    dispatch(getWorkOrderDetails(workOrderId));
    dispatch(getClients())
    dispatch(fetchIDREmployees())
  }, [dispatch, workOrderId]);

  useEffect(() => {
    // console.log("workOrderDetails:", workOrderDetails); // Debugging line
    if (workOrderDetails) {
      setWorkOrder(workOrderDetails);
      setTechnicians(workOrderDetails.technicians || []);
      setNotes(workOrderDetails.notes || []);
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
    setWorkOrder({ ...workOrder, [name]: value });
    dispatch(getLocationByClient(value));
    // Autofill client name
    const selectedClient = clients?.data?.find(
      (client) => client.client_id === value
    );
    if (selectedClient) {
      setWorkOrder((prev) => ({
        ...prev,
        client_name: selectedClient.company_name,
      }));
    }

    // Fetch client employees by client_id
    dispatch(getClientEmployeeByClientId(value));
  };

  const handleTechnicianChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTechnicians = [...technicians];
    updatedTechnicians[index] = { ...updatedTechnicians[index], [name]: value };
    setTechnicians(updatedTechnicians);
  };

  const handleNoteChange = (index, e) => {
    const { name, value } = e.target;
    const updatedNotes = [...notes];
    updatedNotes[index] = { ...updatedNotes[index], [name]: value };
    setNotes(updatedNotes);
  };

  const handleSaveTicket = () => {
    dispatch(updateTicket(workOrderId, workOrder));
  };

  const handleSaveTechnician = (index) => {
    dispatch(updateTechnician(workOrderId, technicians[index]));
  };

  const handleSaveNote = (index) => {
    dispatch(updateNotes(workOrderId, notes[index]));
  };
  
  const handleEditTechnician = (index) =>{
    console.log("edit technician",index)
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workOrder) {
    return <div>No work order details found</div>;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Edit Work Orders</h1>
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
         />
          {/* update Technicians */}
          <TechniciansCard 
          technicians={technicians} 
          idrEmployees={idrEmployees} 
          handleTechnicianChange={handleTechnicianChange}
           handleEditTechnician={handleEditTechnician}
           handleSaveTechnicians={handleSaveTechnician} 
           />
          {/* update Notes */}
          <NotesTable notes={notes} handleSaveNote={handleSaveNote} handleNoteChange={handleNoteChange} />
          
        </div>
      </div>
    </>
  );
};

export default EditWorkOrder;
