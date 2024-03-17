import React from 'react';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { Link} from "react-router-dom";
const Client = () => {
  // Sample data for the table
  const clients = [
    {
      id: 1,
      companyName: 'ABC Company',
      industryCode: 'IC001',
      staffId: 'S001',
      phoneNumber: '1234567890',
      contactPersonName: 'John Doe'
    },
    {
      id: 2,
      companyName: 'XYZ Corporation',
      industryCode: 'IC002',
      staffId: 'S002',
      phoneNumber: '9876543210',
      contactPersonName: 'Jane Smith'
    }
  ];

  return (
    <div className="container mx-auto p-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Client Management</h1>
        <button className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
        <Link to={'/add-client'}>  Add New Client</Link>
        </button>
      </div>
      <table className="w-full table-auto shadow-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Company Name</th>
            <th className="px-4 py-2">Industry Code</th>
            <th className="px-4 py-2">Staff ID</th>
            <th className="px-4 py-2">Phone Number</th>
            <th className="px-4 py-2">Contact Person Name</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td className="border px-4 py-2">{client.companyName}</td>
              <td className="border px-4 py-2">{client.industryCode}</td>
              <td className="border px-4 py-2">{client.staffId}</td>
              <td className="border px-4 py-2">{client.phoneNumber}</td>
              <td className="border px-4 py-2">{client.contactPersonName}</td>
              <td className="border px-4 py-2">
              <button className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded mr-2">
                  <BsPencil /> 
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                  <BsTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Client;
