import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { returnInventory } from '../actions/workOrderActions'; // Import the API action

const InventoryTable = ({ inventories, work_order_id }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [quantity, setQuantity] = useState(''); // State to store input value
  const [selectedInventoryId, setSelectedInventoryId] = useState(null); // Track the selected inventory
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { technicianAccess,access } = useSelector((state) => state.user);
  const handleReturnInventory = () => {
    if (!quantity) {
      alert('Please enter a quantity');
      return;
    }

     // Dispatch the API action
     dispatch(returnInventory({
      work_order_id,
      assigned_inventory_id: selectedInventoryId,
      quantity,
    }))
      .then(() => {
        setShowModal(false); // Close modal on success
        setQuantity(''); // Reset quantity
      })
      .catch((error) => {
        console.error('Error returning inventory:', error);
      });
  };

  return (
    <>
      {inventories.length > 0 && (
        <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
          <div className="mb-2 flex justify-between">
            <h1 className="font-normal text-xl mb-2">
              Inventory Parts Used To Complete Service
            </h1>
          </div>

          {/* Table for inventories */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-200 border rounded">
              <thead>
                <tr className="bg-gray-300 text-left">
                  <th className="border px-4 py-2">Model</th>
                  <th className="border px-4 py-2">Make</th>
                  <th className="border px-4 py-2">Device Type</th>
                  <th className="border px-4 py-2">Quantity</th>
                  {access.includes(user_type) &&   <th className="border px-4 py-2">Action</th>}
                </tr>
              </thead>
              <tbody>
                {inventories?.map((inventory) => (
                  <tr key={inventory.inventory_id} className="bg-white text-sm">
                    <td className="border px-4 py-2">{inventory.model}</td>
                    <td className="border px-4 py-2">{inventory.make}</td>
                    <td className="border px-4 py-2">{inventory.device_type}</td>
                    <td className="border px-4 py-2">{inventory.quantity}</td>
                    {access.includes(user_type) &&   <td className="border px-4 py-2">
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setSelectedInventoryId(inventory.assigned_inventory_id);
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-600"
                      >
                        Return Inventory
                      </button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-5 rounded shadow-md w-96">
                <h2 className="text-lg font-medium mb-4">Return Inventory</h2>
                <label className="block mb-2 font-medium">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border px-3 py-2 rounded mb-4"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-3 py-1 rounded mr-2 hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturnInventory}
                    className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InventoryTable;
