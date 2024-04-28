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

const EditEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams(); // Get the employee ID from the URL params

  const clients = useSelector((state) => state.client.clients); // Get clients from the client slice
  const loadingClients = useSelector((state) => state.client.loading);
  const employee = useSelector((state) => state.clientEmployee.employee);

  const [formData, setFormData] = useState({
    client_id: "", // Change from clientId to client_id
    first_name: "",
    last_name: "",
    email_id: "",
    access_to_website: true,
  });

  useEffect(() => {
    dispatch(getEmployeeById(employeeId));
    dispatch(getClients());
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (employee) {
      // Extract only the fields you want to update from the employee data
      const { client_id, first_name, last_name, email_id, access_to_website } =
        employee;

      // Set the form data with only the extracted fields
      setFormData({
        client_id,
        first_name,
        last_name,
        email_id,
        access_to_website,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeRadio = (e) => {
    const { name, value } = e.target;
    // For radio buttons, directly set the boolean value based on the name
    // If 'name' is 'access_to_website', set the value to true if 'Yes' is selected, and false if 'No' is selected
    setFormData({ ...formData, [name]: name === 'access_to_website' ? value === 'true' : value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateClientEmployee(employeeId, formData, navigate));
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
                <div className="mb-4">
                  <label
                    htmlFor="client_id"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                <div className="mb-4">
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="email_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email_id"
                    id="email_id"
                    value={formData.email_id}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Allow Access to Website
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="access_to_website"
                        value="true"
                        checked={formData.access_to_website === true}
                        onChange={handleChangeRadio}
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
                        onChange={handleChangeRadio}
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
