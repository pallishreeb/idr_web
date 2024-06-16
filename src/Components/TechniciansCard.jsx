import React from 'react';

const TechniciansCards = ({ technicians, idrEmployees, handleTechnicianChange, handleEditTechnician ,handleSaveTechnicians}) => {
  return (
    <div className="flex flex-col mt-2 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2">Technicians</h1>
      </div>

      {/* Technician Cards */}
      <div className="grid grid-cols-1 gap-6">
        {technicians.map((technician, index) => (
          <div key={index} className="border border-indigo-500 p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Technician {index + 1}</h2>
              <button
                className="bg-blue-500 text-white px-4 py-1 rounded"
                onClick={() => handleSaveTechnicians(index)}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Field 1 */}
              <div className="mb-4">
                <label className="font-normal text-base">Technician Name</label>
                <select
                  className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
                  name="technician_name"
                  value={technician.technician_name || ''}
                  onChange={(e) => handleTechnicianChange(index, e)}
                >
                  <option value="">Choose technician</option>
                  {idrEmployees.map(employee => (
                    <option key={employee.idr_emp_id} value={employee.first_name + '' + employee.last_name}>
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 2 */}
              <div className="mb-4">
                <label className="font-normal text-base">Project Manager</label>
                <select
                  className="px-2 border border-gray-200 h-10 rounded text-sm w-full"
                  name="project_manager"
                  value={technician.project_manager || ''}
                  onChange={(e) => handleTechnicianChange(index, e)}
                >
                  <option value="">Choose project manager</option>
                  {idrEmployees.map(employee => (
                    <option key={employee.idr_emp_id} value={employee.first_name +''+ employee.last_name}>
                      {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Remaining Fields */}
            <div className="mb-4">
              <label className="font-normal text-base">Service Request</label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-none"
                name="service_request"
                value={technician.service_request || ''}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
              />
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">Other Details</label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-none"
                name="other_details"
                value={technician.other_details || ''}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
              />
            </div>
            <div className="mb-4">
              <label className="font-normal text-base">Procedures</label>
              <textarea
                className="px-2 border border-gray-200 rounded text-sm w-full resize-none"
                name="procedures"
                value={technician.procedures || ''}
                onChange={(e) => handleTechnicianChange(index, e)}
                rows={4} // Adjust the number of rows as needed
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechniciansCards;
