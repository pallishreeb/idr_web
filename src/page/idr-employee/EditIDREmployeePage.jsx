// src/pages/EditIDREmployeePage.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchIDREmployeesRequest,
  fetchIDREmployeesSuccess,
  fetchIDREmployeesFailure,
} from '../../reducers/idrEmployeeSlice';
import { fetchIDREmployees } from '../../actions/employeeActions';
import Header from '../../Components/Header';
import AdminSideNavbar from '../../Components/AdminSideNavbar';

const EditIDREmployeePage = () => {
  const { employeeId } = useParams(); // Get employeeId from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const idrEmployees = useSelector((state) => state.employee.idrEmployees); // Assuming you store IDR employees in state.idrEmployees.idrEmployees
  const loading = useSelector((state) => state.employee.loading);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email_id: '',
    job_desc:'',
    user_id:'',
    is_active: true, // Assuming is_active is a boolean field  
  });

  useEffect(() => {
    // Simulate fetching employee details (replace with actual fetch action)
    dispatch(fetchIDREmployeesRequest());
    dispatch(fetchIDREmployees());
    // Replace with actual fetch action to fetch employee details
    const fetchedEmployee = idrEmployees.find((employee) => employee.user_id === employeeId);

    if (fetchedEmployee) {
      const { first_name, last_name, email_id,job_desc, is_active } = fetchedEmployee;
      setFormData({
        first_name,
        last_name,
        email_id,
        job_desc,
        is_active,
        // Initialize other form fields here
      });
    } else {
      dispatch(fetchIDREmployeesFailure('Employee not found')); // Handle error if employee not found
    }
  }, [dispatch, employeeId, idrEmployees]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate update action (replace with actual update action)
    const updatedEmployees = idrEmployees.map((employee) =>
      employee.user_id === employeeId ? { ...employee, ...formData } : employee
    );
    dispatch(fetchIDREmployeesSuccess(updatedEmployees));
    navigate('/idr-employees'); // Navigate to IDR employees list after successful update
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Edit IDR Employee</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
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
                  <label
                    htmlFor="job_desc"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Job Description
                  </label>
                  <input
                    type="text"
                    name="job_desc"
                    id="job_desc"
                    value={formData.job_desc}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="is_active"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Active
                  </label>
                  <select
                    id="is_active"
                    name="is_active"
                    value={formData.is_active}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-indigo-700 text-white px-4 py-2 rounded mr-2"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  onClick={() => navigate('/idr-employees')}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default EditIDREmployeePage;
