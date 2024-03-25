import React, { useState } from 'react';
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link } from 'react-router-dom';
const EmployeePage = () => {
  // Sample client data
  const clients = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
    { id: 3, name: 'Client C' },
  ];

  // Sample employee data
  const employees = [
    { id: 1, name: 'John Doe', position: 'Developer', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', position: 'Designer', email: 'jane@example.com' },
    { id: 3, name: 'Mike Johnson', position: 'Manager', email: 'mike@example.com' },
  ];

  const [selectedClient, setSelectedClient] = useState(null);

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
  };

  return (
    <>
    <Header />
    <div className="flex">
      {/* <SideNavbar /> */}
      <AdminSideNavbar />
    <div className="container mx-auto p-4">
      <div className="flex flex-col mb-4">
        <label htmlFor="client" className="mr-2">Select Client:</label>
        <select
          id="client"
          className="border border-gray-300 rounded px-3 py-1 w-full"
          onChange={(e) => handleClientChange(e.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      {selectedClient !== null && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Employees for {clients.find(client => client.id === parseInt(selectedClient)).name}</h2>
          <div className="flex justify-end mb-2">
            <button className="bg-indigo-700 text-white px-4 py-2 rounded"><Link to={'/add-employee'}>Add Employee</Link></button>
          </div>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="border px-4 py-2">{employee.id}</td>
                  <td className="border px-4 py-2">{employee.name}</td>
                  <td className="border px-4 py-2">{employee.position}</td>
                  <td className="border px-4 py-2">{employee.email}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-indigo-700 text-white px-2 py-1 rounded mr-2">Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default EmployeePage;
