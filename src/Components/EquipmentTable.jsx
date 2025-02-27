import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { returnEquipment} from '../actions/workOrderActions'; // Import the API action



const EquipmentTable = ({ equipments,work_order_id }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(null); 
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const handleReturnEquipment = (assigned_inventory_id) => {
    setLoading(assigned_inventory_id); // Set loading state for clicked equipment

    dispatch(returnEquipment(assigned_inventory_id))
      .then(() => {
        setLoading(null); // Reset loading state
      })
      .catch((error) => {
        console.error('Error returning Equipment:', error);
        setLoading(null); // Reset loading state even on error
      });
  };
  return (
    <>
    {equipments.length > 0 && (
    <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2">Assigned Equipments</h1>

      </div>

      {/* Table for notes */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-200 border rounded">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="border px-4 py-2">Model</th>
              <th className="border px-4 py-2">Make</th>
              <th className="border px-4 py-2">Device Type</th>
              <th className="border px-4 py-2">Location</th>
              {access.includes(user_type) &&    <th className="border px-4 py-2">Action</th>}
            </tr>
          </thead>
          <tbody>
            {equipments?.map((equipment, index) => (
              <tr key={equipment.equipment_id} className="bg-white text-sm">
                <td className="border px-4 py-2">
                  {equipment.model}
                </td>
                <td className="border px-4 py-2">
                  {equipment.make}
                </td>
                <td className="border px-4 py-2">
                {equipment.device_type}
                </td>
                
                <td className="border px-4 py-2">
                {equipment.location_name}
                </td>
                {access.includes(user_type) && 
                <td className="border px-4 py-2">
                      <button
                        onClick={() => handleReturnEquipment(equipment.assign_equip_id)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-600"
                      >
                 {loading === equipment.assign_equip_id ? 'Returning...' : 'Return Equipment'}
                      </button>
                    </td>
            }
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
    )}
    </>
  );
};

export default EquipmentTable;
