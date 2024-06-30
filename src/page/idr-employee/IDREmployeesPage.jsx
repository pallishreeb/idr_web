import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {BiLockAlt, BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { fetchIDREmployees, deleteEmployee } from '../../actions/employeeActions'; // Import your actions
import Header from '../../Components/Header';
import AdminSideNavbar from '../../Components/AdminSideNavbar';


const IDREmployeesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employees = useSelector(state => state.employee.idrEmployees); // Assuming you store IDR employees in state.employee.idrEmployees
  const loading = useSelector(state => state.employee.loading);
  const { user_type } = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(fetchIDREmployees());
  }, [dispatch]);

  const handleDelete = (employeeId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'The user will be deleted permanently from DB. Do you really want to delete this employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEmployee(employeeId));
      }
    });
  };

  const handleEdit = (employeeId) => {
    navigate(`/idr-employees/${employeeId}`);
  };

  const handleAdd = () => {
    navigate('/add-idr-employees');
  };

  const handleSetPassword = (userId) => {
    navigate(`/set-user-password/${userId}`);
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container bg-gray-50 mx-auto p-4 h-screen overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">IDR Employees</h2>
            <button
              onClick={handleAdd}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Employee
            </button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-6 border border-gray-200 text-left text-sm">Name</th>
                  <th className="py-2 px-6 border border-gray-200 text-left text-sm">Job Description</th>
                  <th className="py-2 px-6 border border-gray-200 text-left text-sm">Email</th>
                  <th className="py-2 px-6 border border-gray-200 text-left text-sm">Contact Number</th>
                  <th className="py-2 px-6 border border-gray-200 text-left text-sm">User Type</th>
                  <th className="py-2 px-6 border border-gray-200 text-left text-sm">Active</th>
                  <th className="py-2 px-4 border border-gray-200 text-center text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <img src="not-found.png" alt="Data Not Found" className="mx-auto w-64 h-64 mt-4" />
                    </td>
                  </tr>
                ) : (
                  employees?.map(employee => (
                    <tr key={employee.user_id} className='text-left text-sm'>
                      <td className="py-2 px-6 border border-gray-200">{employee.first_name} {employee.last_name}</td>
                      <td className="py-2 px-6 border border-gray-200">{employee?.job_desc ? employee?.job_desc : "NA"}</td>
                      <td className="py-2 px-6 border border-gray-200">{employee.email_id}</td>
                      <td className="py-2 px-6 border border-gray-200">{employee.contact_number}</td>
                      <td className="py-2 px-6 border border-gray-200">{employee.user_type}</td>
                      <td className="py-2 px-6 border border-gray-200">{employee.is_active ? 'Yes' : 'No'}</td>
                      <td className="py-2 px-4 border border-gray-200 flex gap-2 justify-center">
                      
                        <button
                          onClick={() => handleEdit(employee.idr_emp_id)}
                         className="p-[4px] bg-gray-100 cursor-pointer"
                        >
                          <BiSolidEditAlt />
                        </button>
                        {user_type === "Admin" && (
                          <>
                           <button
                            className="p-[4px] bg-gray-100 cursor-pointer"
                            onClick={() => handleSetPassword(employee.user_id)}
                          >
                            <BiLockAlt/>
                          </button>
                          <button
                            onClick={() => handleDelete(employee.idr_emp_id)}
                           className="p-[4px] bg-gray-100 cursor-pointer"
                          >
                            <AiFillDelete />
                          </button>
                          </>
                         
                        )}
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
