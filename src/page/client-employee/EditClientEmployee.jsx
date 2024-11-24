import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  updateClientEmployee,
  getEmployeeById,
} from "../../actions/clientEmployeeActions"; // Import your client employee actions
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions"; // Import location actions

const EditEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams(); // Get the employee ID from the URL params

  const clients = useSelector((state) => state.client.clients); // Get clients from the client slice
  const locations = useSelector((state) => state.location.locations); // Fetch locations based on client
  const loadingClients = useSelector((state) => state.client.loading);
  const employee = useSelector((state) => state.clientEmployee.employee);
  const loadingEmployees = useSelector((state) => state.clientEmployee.loading);

  const [formData, setFormData] = useState({
    client_id: "",
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number: "",
    employee_type: "",
    client_location_id: "",
    access_to_website: true,
  });

  useEffect(() => {
    dispatch(getEmployeeById(employeeId));
    dispatch(getClients());
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (employee) {
      const {
        client_id,
        first_name,
        last_name,
        email_id,
        contact_number,
        employee_type,
        client_location_id,
        access_to_website,
      } = employee;
      setFormData({
        client_id,
        first_name: first_name || "",
        last_name: last_name || "",
        email_id: email_id || "",
        contact_number: contact_number || "",
        employee_type: employee_type || "",
        client_location_id: client_location_id || "",
        access_to_website,
      });

      if (client_id) {
        dispatch(getLocationByClient(client_id)); // Fetch locations if client is pre-selected
      }
    }
  }, [employee, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "client_id") {
      setFormData({ ...formData, client_id: value, client_location_id: "" }); // Reset location if client changes
      dispatch(getLocationByClient(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create a copy of formData
    const updatedFormData = { ...formData };
  
    // Remove client_location_id if employee_type is not "Location Admin"
    if (formData.employee_type !== "Location Admin") {
      delete updatedFormData.client_location_id;
    }
  
    // Dispatch the updated formData
    dispatch(updateClientEmployee(employeeId, updatedFormData, navigate));
  };
  
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Edit Employee</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                {/* Client Dropdown */}
                <div className="mb-4">
                  <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                    Client
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select a client</option>
                    {loadingClients ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : (
                      clients?.data?.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Employee Type Dropdown */}
                <div className="mb-4">
                  <label htmlFor="employee_type" className="block text-sm font-medium text-gray-700">
                    Employee Type
                  </label>
                  <select
                    id="employee_type"
                    name="employee_type"
                    value={formData.employee_type}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="">Select employee type</option>
                    <option value="Admin">Admin</option>
                    <option value="Location Admin">Location Admin</option>
                    <option value="User">User</option>
                  </select>
                </div>

                {/* Conditional Location Dropdown */}
                {formData.employee_type === "Location Admin" && (
                  <div className="mb-4">
                    <label htmlFor="client_location_id" className="block text-sm font-medium text-gray-700">
                      Client Location
                    </label>
                    <select
                      id="client_location_id"
                      name="client_location_id"
                      value={formData.client_location_id}
                      onChange={handleChange}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a location</option>
                      {locations?.map((location) => (
                        <option key={location.location_id} value={location.location_id}>
                          {location.address_line_one}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Other Fields */}
                <div className="mb-4">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email_id" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email_id"
                    id="email_id"
                    value={formData.email_id}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact_number"
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Allow Access to Website</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="access_to_website"
                        value="true"
                        checked={formData.access_to_website === true}
                        onChange={(e) => setFormData({ ...formData, access_to_website: e.target.value === "true" })}
                        className="form-radio h-4 w-4 text-indigo-600"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input
                        type="radio"
                        name="access_to_website"
                        value="false"
                        checked={formData.access_to_website === false}
                        onChange={(e) => setFormData({ ...formData, access_to_website: e.target.value === "true" })}
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
                  {loadingEmployees ? "Saving" : "Save"}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  <Link to={"/client-employees"}>Cancel</Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEmployeePage;
