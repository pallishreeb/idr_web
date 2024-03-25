import React, { useState } from 'react';
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link } from 'react-router-dom';

const AddEmployeePage = () => {
  // Sample client data
  const clients = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
    { id: 3, name: 'Client C' },
  ];

  const [selectedClient, setSelectedClient] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    allowAccessToWebsite: 'no',
  });

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform submission logic here
    console.log(formData);
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
          value={selectedClient}
          onChange={(e) => handleClientChange(e.target.value)}
        >
          <option value="">Select a client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      {selectedClient && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add Employee for {clients.find(client => client.id === parseInt(selectedClient)).name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Allow Access to Website</label>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="allowAccessToWebsite"
                      value="yes"
                      checked={formData.allowAccessToWebsite === 'yes'}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="allowAccessToWebsite"
                      value="no"
                      checked={formData.allowAccessToWebsite === 'no'}
                      onChange={handleChange}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-700 text-white px-4 py-2 rounded mr-2"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
              >
              <Link to={'/client-employees'}>Cancel</Link> 
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default AddEmployeePage;
