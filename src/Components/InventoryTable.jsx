import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { returnInventory } from '../actions/workOrderActions';
import { returnInventoryFromServiceTicket } from '../actions/serviceTicket'; 

const InventoryTable = ({ inventories, work_order_id, service_ticket_id }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [selectedInventoryId, setSelectedInventoryId] = useState(null);

  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);

  const handleReturnInventory = () => {
    if (!quantity || quantity === 0) {
      alert("Please enter a quantity");
      return;
    }
  
    const payload = {
      assigned_inventory_id: selectedInventoryId,
      quantity,
    };
  
    let action;
  
    if (work_order_id) {
      payload.work_order_id = work_order_id;
      action = returnInventory;
    } else if (service_ticket_id) {
      payload.service_ticket_id = service_ticket_id;
      action = returnInventoryFromServiceTicket;
    } else {
      alert('No valid ID provided.');
      return;
    }
  
    dispatch(action(payload))
      .then(() => {
        setShowModal(false);
        setQuantity('');
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

          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-200 border rounded">
              <thead>
                <tr className="bg-gray-300 text-left">
                  <th className="border px-4 py-2">Model</th>
                  <th className="border px-4 py-2">Make</th>
                  <th className="border px-4 py-2">Device Type</th>
                  <th className="border px-4 py-2">Quantity</th>
                  {access.includes(user_type) && (
                    <th className="border px-4 py-2">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {inventories?.map((inventory) => (
                  <tr key={inventory.inventory_id} className="bg-white text-sm">
                    <td className="border px-4 py-2">{inventory.model}</td>
                    <td className="border px-4 py-2">{inventory.make}</td>
                    <td className="border px-4 py-2">{inventory.device_type}</td>
                    <td className="border px-4 py-2">{inventory.quantity}</td>
                    {access.includes(user_type) && (
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => {
                            setShowModal(true);
                            setSelectedInventoryId(inventory.assigned_inventory_id);
                          }}
                          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                        >
                          Return Inventory
                        </button>
                      </td>
                    )}
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
