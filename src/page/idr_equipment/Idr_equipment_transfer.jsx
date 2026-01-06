import { useNavigate, useParams,useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import {
  getWorkOrderListsByClientId,
  getWorkOrderDetails,
} from "../../actions/workOrderActions";
// import { getLocationInventory } from "../../actions/locationsInventoryAction";
import {
  idrWorkOrderAssign,
  idrEmployeeAssign,
  getIdrEquipmentById,
} from "../../actions/idrEquipmentAction";
import { fetchIDREmployees } from "../../actions/employeeActions";
import Loader from "../../Images/ZZ5H.gif";

const TransferIdrEquipment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { idr_equipment_id } = useParams();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWorkorder, setSelectedWorkorder] = useState("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [signedInDate, setSignedInDate] = useState("");
  const [idrSignedInDate, setIdrSignedInDate] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(false);
  const [equipment, setEquipment] = useState(null);
  const { clients, loading: clientsLoading } = useSelector(
    (state) => state.client
  );
  const {
    workOrders,
    loading: workOrdersLoading,
    workOrderDetails,
    loadingDetails,
  } = useSelector((state) => state.workOrder);
  const loadingAssign = useSelector(
    (state) => state.idrequipment.loadingAssign
  );
  const loadingTransfer = useSelector(
    (state) => state.idrequipment.loadingTransfer
  );
  const { idrEmployees } = useSelector((state) => state.employee);
  const { access,technicianAccess } = useSelector((state) => state.user);
  const { user_type } = useSelector((state) => state.user.user);
  useEffect(() => {
    dispatch(getClients());
    dispatch(fetchIDREmployees());
    if (idr_equipment_id) {
      setLoading(true);
      dispatch(getIdrEquipmentById(idr_equipment_id))
        .then((data) => {
          setEquipment(data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching IDR equipment item:", error);
        });
    }
  }, [dispatch, idr_equipment_id]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(getWorkOrderListsByClientId(selectedClient));
    }
  }, [selectedClient, dispatch]);

  useEffect(() => {
    if (selectedWorkorder) {
      dispatch(getWorkOrderDetails(selectedWorkorder));
    }
  }, [selectedWorkorder, dispatch]);

  useEffect(() => {
    // console.log("workOrderDetails:", workOrderDetails); // Debugging line
    if (workOrderDetails) {
      setTechnicians(workOrderDetails.assignees || []);
    }
  }, [workOrderDetails]);

  const handleAssignWorkorder = (e) => {
    e.preventDefault();
    const formattedDateTime = new Date(signedInDate).toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    const assignData = {
      equipment_id: idr_equipment_id,
      work_order_id: selectedWorkorder,
      user_id: selectedTechnician,
      user_name: technicians.find(
        (emp) => emp.technician_user_id === selectedTechnician
      )?.technician_name,
      signed_out: formattedDateTime,
    };
    dispatch(idrWorkOrderAssign(assignData, navigate,location.state));
  };

  const handleAssignIDREmployee = (e) => {
    e.preventDefault();
    const selectedEmployeeData = idrEmployees.find(
      (emp) => emp.user_id === selectedEmployee
    );
    const userName = selectedEmployeeData
      ? `${selectedEmployeeData.first_name} ${selectedEmployeeData.last_name}`
      : "";
    const formattedDateTime = new Date(idrSignedInDate).toLocaleString(
      "en-US",
      {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );
    const assignData = {
      equipment_id: idr_equipment_id,
      user_id: selectedEmployee,
      user_name: userName,
      signed_out: formattedDateTime,
      assign_desc: assignDesc,
    };
    dispatch(idrEmployeeAssign(assignData, navigate,location.state));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-20 h-20" src={Loader} alt="Loading..." />
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex flex-col gap-4 bg-white p-5 rounded-lg shadow-md border">
            {/* Section Title & Buttons */}
            <div className="flex justify-between items-end">
              <h1 className="font-bold text-lg">Transfer IDR Equipment</h1>
              <div className="flex gap-3">
                <button
                  className="border border-gray-400 text-gray-400 px-6 py-2 rounded hover:bg-gray-100"
                  onClick={() =>
                    navigate("/idr-equipment", {
                      state: location.state, // 👈 preserves filters
                    })
                  }

                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Equipment Details Card */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="font-semibold text-gray-700 mb-2">
                Equipment Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Make:</span>{" "}
                  {equipment?.make}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Model:</span>{" "}
                  {equipment?.model}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">
                    Device Type:
                  </span>{" "}
                  {equipment?.device_type}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">
                    Serial Number:
                  </span>{" "}
                  {equipment?.serial_number || "N/A"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Location:</span>{" "}
                  {equipment?.location_name}
                </div>
              </div>
            </div>
          </div>
          {technicianAccess.includes(user_type) && 
          <form onSubmit={handleAssignWorkorder}>
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <div className="flex justify-between items-end mb-2">
                  <h1 className="text-xl font-normal mb-2">
                    Assign IDR Equipment to Work Order
                  </h1>
                  <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded"
                    type="submit"
                    disabled={loadingAssign}
                  >
                    {loadingAssign ? "Saving" : "Assign equipment"}
                  </button>
                </div>
                <div className="border border-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-sm">
                    Select client for WO choices and site locations
                  </label>
                  {clientsLoading ? (
                    <div>Loading clients...</div>
                  ) : (
                    <select
                      className="px-2 border border-gray-200 h-10 rounded text-sm"
                      value={selectedClient}
                      onChange={(e) => setSelectedClient(e.target.value)}
                      required
                    >
                      <option value="">Select client</option>
                      {clients?.data?.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2 ">
                  <label className="font-normal text-sm">Select WO</label>
                  {workOrdersLoading ? (
                    <div>Loading work orders...</div>
                  ) : (
                    <select
                      className="px-2 border border-gray-200 h-10 rounded text-sm"
                      value={selectedWorkorder}
                      onChange={(e) => setSelectedWorkorder(e.target.value)}
                      required
                    >
                      <option value="">Select code</option>
                      {workOrders?.workorders
                        ?.filter((wo) => wo.status !== "Closed")
                        .map((wo) => (
                          <option
                            key={wo.work_order_id}
                            value={wo.work_order_id}
                          >
                            {wo.issue}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Assign to Technician
                  </label>
                  {loadingDetails ? (
                    <div>Loading technicians...</div>
                  ) : (
                    <select
                      className="px-2 border border-gray-200 h-10 rounded text-sm"
                      value={selectedTechnician}
                      onChange={(e) => setSelectedTechnician(e.target.value)}
                      required
                    >
                      <option value="">Select Technician</option>
                      {technicians?.map((employee) => (
                        <option
                          key={employee.technician_user_id}
                          value={employee.technician_user_id}
                        >
                          {employee.technician_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Signed Out Date</label>
                  <input
                    type="datetime-local"
                    className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                    value={signedInDate}
                    onChange={(e) => setSignedInDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </form>}
          {access.includes(user_type) && 
          <form onSubmit={handleAssignIDREmployee}>
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <div className="flex justify-between items-end mb-2">
                  <h1 className="text-xl font-normal mb-2">
                    Assign Equipment to IDR Employee
                  </h1>
                  <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded"
                    type="submit"
                    disabled={loadingTransfer}
                  >
                    {loadingTransfer ? "Saving" : "Assign equipment"}
                  </button>
                </div>
                <div className="border border-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Assign to IDR Employee
                  </label>
                  <select
                    className="px-2 border border-gray-200 h-10 rounded text-sm"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select employee</option>
                    {idrEmployees?.map((employee) => (
                      <option key={employee.user_id} value={employee.user_id}>
                        {employee.first_name + " " + employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Signed Out Date</label>
                  <input
                    type="datetime-local" //date
                    className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                    value={idrSignedInDate}
                    onChange={(e) => setIdrSignedInDate(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Description</label>
                  <textarea
                    className="px-3 py-3 border  border-gray-200 h-20 text-sm rounded"
                    value={assignDesc}
                    onChange={(e) => setAssignDesc(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </form> }
        </div>
      </div>
    </>
  );
};

export default TransferIdrEquipment;
