import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getWorkOrderListsByClientId } from "../../actions/workOrderActions";
// import { getLocationInventory } from "../../actions/locationsInventoryAction";
import { idrWorkOrderAssign } from "../../actions/idrEquipmentAction";
import { getIdrEquipmentById } from "../../actions/idrEquipmentAction";
import { fetchIDREmployees } from "../../actions/employeeActions";

const TransferIdrEquipment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { idr_equipment_id } = useParams();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWorkorder, setSelectedWorkorder] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [signedInDate, setSignedInDate] = useState("");
  const [assignDesc, setAssignDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const { clients, loading: clientsLoading } = useSelector((state) => state.client);
  const { workOrders, loading: workOrdersLoading } = useSelector((state) => state.workOrder);
  const loadingAssign = useSelector((state) => state.idrequipment.loadingAssign);
  const { idrEmployees } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getClients());
    dispatch(fetchIDREmployees());
    if (idr_equipment_id) {
      setLoading(true);
      dispatch(getIdrEquipmentById(idr_equipment_id))
        .then(() => setLoading(false))
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

  const handleAssignWorkorder = (e) => {
    e.preventDefault();
    const assignData = {
      equipment_id: idr_equipment_id,
      work_order_id: selectedWorkorder,
      user_id: selectedEmployee,
      user_name: idrEmployees.find(emp => emp.user_id === selectedEmployee)?.user_name,
      signed_in: new Date(signedInDate).toLocaleDateString('en-US'),
    };
    dispatch(idrWorkOrderAssign(assignData, navigate));
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between items-end">
            <h1 className="font-bold text-lg">Transfer IDR Equipment</h1>
            <div className="flex gap-3">
              <button
                className="border border-gray-400 text-gray-400 px-6 py-2 rounded"
                onClick={() => navigate("/idr-equipment")}
              >
                Cancel
              </button>
            </div>
          </div>

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
                    {loadingAssign ? 'Saving' : 'Assign equipment'}
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
                        <option key={client.client_id} value={client.client_id}>{client.company_name}</option>
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
                        ?.filter(wo => wo.status !== 'Closed')
                        .map(wo => (
                          <option key={wo.work_order_id} value={wo.work_order_id}>
                            {wo.ticket_number}
                          </option>
                        ))}
                    </select>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Assign to Technician</label>
                  <select 
                    className="px-2 border border-gray-200 h-10 rounded text-sm"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select employee</option>
                    {idrEmployees?.map((employee) => (
                      <option key={employee.user_id} value={employee.user_id}>
                          {employee.first_name + employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Signed Out Date</label>
                  <input
                    type="date"
                    className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                    value={signedInDate}
                    onChange={(e) => setSignedInDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </form>
          <form onSubmit={handleAssignWorkorder}>
            <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
              <div className="mb-2">
                <div className="flex justify-between items-end mb-2">
                  <h1 className="text-xl font-normal mb-2">
                    Assign  Equipment to IDR Employee
                  </h1>
                  <button 
                      className="bg-indigo-600 text-white px-6 py-2 rounded"
                      type="submit"
                      disabled={loadingAssign}
                    >
                    {loadingAssign ? 'Saving' : 'Assign equipment'}
                  </button>
                </div>
                <div className="border border-gray-200"></div>
              </div>

              <div className="grid grid-cols-3 gap-8">

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Assign to IDR Employee</label>
                  <select 
                    className="px-2 border border-gray-200 h-10 rounded text-sm"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select employee</option>
                    {idrEmployees?.map((employee) => (
                      <option key={employee.user_id} value={employee.user_id}>
                        {employee.first_name + employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Signed Out Date</label>
                  <input
                    type="date"
                    className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                    value={signedInDate}
                    onChange={(e) => setSignedInDate(e.target.value)}
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
          </form>
        </div>
      </div>
    </>
  );
};

export default TransferIdrEquipment;
