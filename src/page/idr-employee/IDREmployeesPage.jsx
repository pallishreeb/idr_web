import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import { fetchIDREmployees, deleteEmployee } from '../../actions/employeeActions'; // Import your actions
import Header from '../../Components/Header';
import AdminSideNavbar from '../../Components/AdminSideNavbar';

const IDREmployeesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector(state => state.employee.idrEmployees); // Assuming you store IDR employees in state.employee.idrEmployees
  const loading = useSelector(state => state.employee.loading);

  useEffect(() => {
    dispatch(fetchIDREmployees());
  }, [dispatch]);

  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch(deleteEmployee(employeeId));
    }
  };
  const handleEdit = (employeeId) => {
  //  console.log(employeeId)
  navigate(`/idr-employees/${employeeId}`)
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <h2 className="text-xl font-semibold mb-4">IDR Employees</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border border-gray-200">Name</th>
                  <th className="py-2 px-4 border border-gray-200">Job Description</th>
                  <th className="py-2 px-4 border border-gray-200">Email</th>
                  <th className="py-2 px-4 border border-gray-200">User Type</th>
                  <th className="py-2 px-4 border border-gray-200">Active</th>
                  <th className="py-2 px-4 border border-gray-200">Actions</th>
                </tr>
              </thead>
              
              <tbody>
              {employees?.length === 0 ? (
                   <tr>
                   <td colSpan="5" className="text-center">
                     <img src="not-found.png" alt="Data Not Found" className="mx-auto w-64 h-64 mt-4" />
                   </td>
                 </tr>
                  ) : (
                   
                employees?.map(employee => (
                  <tr key={employee.user_id}>
                    <td className="py-2 px-4 border border-gray-200 text-center">{employee.first_name}{" "}{employee.last_name}</td>
                    <td className="py-2 px-4 border border-gray-200 text-center">{employee?.job_desc ? employee?.job_desc : "NA"}</td>
                    <td className="py-2 px-4 border border-gray-200 text-center">{employee.email_id}</td>
                    <td className="py-2 px-4 border border-gray-200 text-center">{employee.user_type}</td>
                    <td className="py-2 px-4 border border-gray-200 text-center">{employee.is_active ? 'Yes' : 'No'}</td>
                    <td className="py-2 px-4 border border-gray-200 text-center flex gap-1 justify-center">
                    <button
                        onClick={() => handleEdit(employee.idr_emp_id)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded "
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee.idr_emp_id)}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default IDREmployeesPage;
