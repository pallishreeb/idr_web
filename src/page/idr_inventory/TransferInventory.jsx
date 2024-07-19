import { useNavigate,useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions"; // Action to fetch clients
import { getWorkOrderListsByClientId } from "../../actions/workOrderActions"; // Action to fetch work orders for a client
import { getLocationInventory } from "../../actions/locationsInventoryAction"; // Action to fetch inventory locations
import { inventoryTransfer, inventoryWorkOrderAssign } from "../../actions/inventoryAction"; // Action to transfer inventory
import {
  getInventoryById
} from "../../actions/inventoryAction";
const TransferInventory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { inventory_id } = useParams();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWorkorder, setSelectedWorkorder] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [quantityAssigned, setQuantityAssigned] = useState("");
  const [quantityTransferred, setQuantityTransferred] = useState("");
  const [assignedLocation, setAssignedLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const { clients, loading: clientsLoading } = useSelector((state) => state.client);
  const { workOrders, loading: workOrdersLoading } = useSelector((state) => state.workOrder);
  const locationsInventory = useSelector((state) => state.locationInventory.locations);
  const loadingTransfer = useSelector((state) => state.inventory.loadingTransfer);
  const loadingAssign = useSelector((state) => state.inventory.loadingAssign);
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  useEffect(() => {
    dispatch(getClients());
    dispatch(getLocationInventory()); 
    if (inventory_id) {
      setLoading(true);
      dispatch(getInventoryById(inventory_id))
        .then((data) => {
          setLoading(false);
          setAssignedLocation(data.location);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching inventory item:", error);
          // Handle error, e.g., show an error message
        });
    }
  }, [dispatch,inventory_id]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(getWorkOrderListsByClientId(selectedClient)); // Fetch work orders when a client is selected
    }
  }, [selectedClient, dispatch]);

  const handleAssignWorkorder = (e) => {
    e.preventDefault();
    // API call to assign inventory to work order
    dispatch(inventoryWorkOrderAssign({ inventory_id: inventory_id, work_order_id: selectedWorkorder, quantity: quantityAssigned },navigate));
  };

  const handleTransferInventory = (e) => {
    e.preventDefault();
    // console.log(selectedLocation)
    // API call to transfer inventory to another location
    dispatch(inventoryTransfer({ inventory_id: inventory_id, location_id: selectedLocation, quantity: quantityTransferred },navigate));
  };
  const availableLocations = locationsInventory?.filter(
    (location) => location.location !== assignedLocation
  );
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between items-end">
            <h1 className="font-bold text-lg">Inventory Item</h1>

            <div className="flex gap-3">
              <button
                className="border border-gray-400 text-gray-400 px-6 py-2 rounded"
                onClick={() => navigate("/inventory")}
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
                  Assign inventory to work order
                </h1>
                <button 
                    className="bg-indigo-600 text-white px-6 py-2 rounded"
                    type="submit"
                    disabled={loadingAssign}
                  >
                  {loadingAssign ? 'Saving' : 'Assign inventory'}
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
                      ?.filter(wo => wo.status === 'Open')
                      .map(wo => (
                        <option key={wo.work_order_id} value={wo.work_order_id}>
                          {wo.ticket_number}
                        </option>
                      ))}

                  </select>
                )}
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Quantity Assigned</label>
                <input
                  type="text"
                  className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                  value={quantityAssigned}
                  onChange={(e) => setQuantityAssigned(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
         </form>

         {access.includes(user_type) &&
         <form onSubmit={handleTransferInventory}>
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <div className="flex justify-between items-end mb-2">
                <h1 className="font-normal text-xl">
                  Transfer inventory to alternate location
                </h1>
                <button 
                    className="bg-indigo-600 text-white px-6 py-2 rounded"
                    type="submit"
                    disabled={loadingTransfer}
                  >
                   {loadingTransfer ? 'Saving' : 'Transfer inventory'}
                  </button>
              </div>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">
                  Select location to transfer inventory to
                </label>
                {loading ? (
                    <div>Loading locations...</div>
                  ) : (
                <select 
                  className="px-2 border border-gray-200 h-10 rounded text-sm"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  required
                >
                  <option value="">Select location</option>
                  {availableLocations?.map((location) => (
                    <option key={location.inventory_location_id} value={location.inventory_location_id}>{location.location}</option>
                  ))}
                </select>
                )}
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Quantity Transferred</label>
                <input
                  type="text"
                  className="px-3 py-3 border  border-gray-200 h-10 text-sm rounded"
                  value={quantityTransferred}
                  onChange={(e) => setQuantityTransferred(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          </form>
        }
        </div>
      </div>
    </>
  );
};

export default TransferInventory;
