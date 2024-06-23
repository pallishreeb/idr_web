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
import { fetchUsers } from "../../actions/userActions"; // Import getUsers action

const EditEmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employeeId } = useParams(); // Get the employee ID from the URL params

  const clients = useSelector((state) => state.client.clients); // Get clients from the client slice
  const loadingClients = useSelector((state) => state.client.loading);
  const employee = useSelector((state) => state.clientEmployee.employee);
  const loadingEmployees = useSelector((state) => state.clientEmployee.loading);
  const usersData = useSelector((state) => state.user.users); // Get users from the user slice
  const loadingUsers = useSelector((state) => state.user.loading);

  const [formData, setFormData] = useState({
    client_id: "",
    user_id: "",
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number:"",
    access_to_website: true,
  });

  useEffect(() => {
    dispatch(getEmployeeById(employeeId));
    dispatch(getClients());
    dispatch(fetchUsers());
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (employee) {
      const { client_id, user_id, first_name, last_name, email_id,contact_number, access_to_website } = employee;
      setFormData({
        client_id,
        user_id: user_id || '',
        first_name: first_name || '',
        last_name: last_name || '',
        email_id: email_id || '',
        contact_number:contact_number || '',
        access_to_website,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserChange = (e) => {
    const selectedUserId = e.target.value;
    const selectedUser = usersData.data.find(user => user.user_id === selectedUserId);
    if (selectedUser) {
      setFormData({
        ...formData,
        user_id: selectedUser.user_id,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email_id: selectedUser.email_id,
        contact_number:selectedUser.contact_number
      });
    } else {
      setFormData({
        ...formData,
        user_id: '',
        first_name: '',
        last_name: '',
        email_id: '',
        contact_number:'',
      });
    }
  };

  const handleChangeRadio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'access_to_website' ? value === 'true' : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateClientEmployee(employeeId, formData, navigate));
  };

  // Filter users with user_type as 'Client Employee'
  const filteredUsers = Array.isArray(usersData?.data) ? usersData.data.filter(user => user.user_type === 'Client Employee') : [];

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
                  <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">Client</label>
                  <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select a client</option>
                    {loadingClients ? (
                      <option value="" disabled>Loading...</option>
                    ) : (
                      clients?.data?.map((client) => (
                        <option key={client.client_id} value={client.client_id}>{client.company_name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">User</label>
                  <select
                    id="user_id"
                    name="user_id"
                    value={formData.user_id}
                    onChange={handleUserChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="">Select a user</option>
                    {loadingUsers ? (
                      <option value="" disabled>Loading...</option>
                    ) : (
                      filteredUsers.map((user) => (
                        <option key={user.user_id} value={user.user_id}>{user.first_name} {user.last_name}</option>
                      ))
                    )}
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email_id" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email_id"
                    id="email_id"
                    value={formData.email_id}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    readOnly
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="text"
                    name="contact_number"
                    id="contact_number"
                    value={formData.contact_number}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    readOnly
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
                  {loadingEmployees ? 'Saving' : 'Save'}
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
