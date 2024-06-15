// src/pages/EditIDREmployeePage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchIDREmployeeDetails, updateIDREmployee } from '../../actions/employeeActions';
import Header from '../../Components/Header';
import AdminSideNavbar from '../../Components/AdminSideNavbar';

const EditIDREmployeePage = () => {
  const { employeeId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { idrEmployeeDetails, loading } = useSelector((state) => state.employee);

  const [formData, setFormData] = useState({
    idr_emp_id: '',
    first_name: '',
    last_name: '',
    email_id: '',
    job_desc: '',
    user_id: '',
    user_type: '',
    is_active: true,
    user_role_id:'',
  });

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchIDREmployeeDetails(employeeId));
    }
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (idrEmployeeDetails) {
      const { idr_emp_id, first_name, last_name, email_id, job_desc, is_active, user_type, user_id,user_role_id } = idrEmployeeDetails;
      setFormData({
        idr_emp_id,
        first_name,
        last_name,
        email_id,
        job_desc,
        is_active,
        user_type,
        user_id,
        user_role_id
      });
    }
  }, [idrEmployeeDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateIDREmployee(formData)).then(() => {
      navigate('/idr-employees');
    });
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
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="job_desc" className="block text-sm font-medium text-gray-700">
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
                  <label htmlFor="is_active" className="block text-sm font-medium text-gray-700">
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
                <div className="mb-4">
                  <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                    User Type
                  </label>
                  <select
                    id="user_type"
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Select User Type</option>
                    <option value="Admin">Admin</option>
                    <option value="Subadmin">Subadmin</option>
                    <option value="IDR Employee">IDR Employee</option>
                    <option value="Client Employee">Client Employee</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded mr-2">
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
