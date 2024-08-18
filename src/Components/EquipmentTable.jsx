import React from 'react';



const EquipmentTable = ({ equipments }) => {

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
