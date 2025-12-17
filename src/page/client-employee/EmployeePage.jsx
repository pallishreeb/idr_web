import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { BiLockAlt, BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { Link,useNavigate } from 'react-router-dom';
import { getClientEmployeeByClientId,deleteClientEmployee } from '../../actions/clientEmployeeActions'; // Import your client employee actions
import { getClients } from "../../actions/clientActions";
const EmployeePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clients = useSelector((state) => state.client.clients); // Get clients from the client slice
  const loadingClients = useSelector((state) => state.client.loading);
  const employees = useSelector((state) => state.clientEmployee.clientEmployees); // Get client employees from the client employees slice
  const loadingEmployees = useSelector((state) => state.clientEmployee.loading);
  const user = useSelector((state) => state.user.user); // use user.client_type and user.client_id

  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(getClientEmployeeByClientId(selectedClient)); // Fetch client employees when a client is selected
    }
  }, [dispatch, selectedClient,]);
useEffect(() => {
  // If logged-in user is Admin, auto-select their client_id
  if (user?.client_type === "Admin" && user.client_id) {
    setSelectedClient(String(user.client_id)); // keep as string if your select values are strings
  }
}, [user]);

  const handleClientChange = (clientId) => {
    // console.log(clientId)
    setSelectedClient(clientId);
  };



const handleDeleteEmployee = (employeeId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this employee?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(deleteClientEmployee(employeeId));
    }
  });
};
  const handleEdit = (employeeId) => {
    // Navigate to the update client page
    navigate(`/edit-employee/${employeeId}`);
  };

  const handleSetPassword = (userId) => {
    navigate(`/set-user-password/${userId}`);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 bg-gray-50">
          <div className="flex flex-col mb-4">
            <label htmlFor="client" className="mr-2 text-xl font-semibold">Select Client To View Employees:</label>
          <select
            id="client"
            className="border border-gray-300 rounded px-3 py-1 w-full"
            value={selectedClient ?? ""}
            onChange={(e) => handleClientChange(e.target.value)}
            disabled={user?.client_type === "Admin"} // admin can't change
          >
            <option value="">Select a client</option>
            {loadingClients ? (
              <option value="" disabled>Loading...</option>
            ) : (
              // if user is Admin, only show their client; otherwise show all
              (user?.client_type === "Admin"
                ? clients?.data?.filter(c => String(c.client_id) === String(user.client_id))
                : clients?.data
              )?.map((client) => (
                <option key={client.client_id} value={client.client_id}>{client.company_name}</option>
              ))
            )}
          </select>

          </div>

          {selectedClient !== null && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Employees for {clients?.data?.find(client => client.client_id === selectedClient)?.company_name}</h2>
              <div className="flex justify-end mb-2">
                <button className="bg-indigo-700 text-white px-4 py-2 rounded"><Link to={`/add-employee/${selectedClient}`}>Add Employee</Link></button>
              </div>
              {loadingEmployees ? (
                <p>Loading employees...</p>
              ) : (
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2 text-left">Client</th>
                      <th className="border px-4 py-2 text-left">Name</th>
                      <th className="border px-4 py-2 text-left">Email</th>
                      <th className="border px-4 py-2 text-left">Contact number</th>
                      <th className="border px-4 py-2 text-left">Employee Type</th>
                      <th className="border px-4 py-2 text-left">Access to Website</th>
                      
                      <th className="border px-4 py-2">Actions</th>
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
                    employees
                      && [...employees] // Create a shallow copy of the industries array
                          .sort((a, b) => a.first_name.localeCompare(b.first_name))
                    .map((employee) => (
                      <tr key={employee?.client_emp_id}>
                        <td className="text-left border px-4 py-2">{clients?.data?.find(client => client.client_id === employee.client_id)?.company_name}</td>
                        <td className="text-left border px-4 py-2">{employee.first_name}{" "}{employee.last_name}</td>   
                        <td className="text-left border px-4 py-2">{employee.email_id}</td>
                        <td className="text-left border px-4 py-2">{employee?.contact_number ? employee?.contact_number : "NA"}</td>
                        <td className="text-left border px-4 py-2">{employee?.employee_type ? employee?.employee_type : "NA"}</td>
                        <td className="text-left border px-4 py-2">{employee.access_to_website == true ? 'Yes' : 'No'}</td>
                        <td className="text-left border px-4 py-2">
                        
                          <button onClick={() => handleEdit(employee?.client_emp_id)} className="p-[4px] bg-gray-100 cursor-pointer">
                            <BiSolidEditAlt/>
                          </button>
                          {user?.user_type === "Admin" && 
                          <>
                          <button
                            className="p-[4px] bg-gray-100 cursor-pointer"
                            onClick={() => handleSetPassword(employee.user_id)}
                          >
                            <BiLockAlt/>
                          </button>
                          </>
                          }
                          {(user?.user_type === "Admin" || (user?.client_type === "Admin" && user.user_id !== employee.user_id)) && 
                          <>
                          <button className="p-[4px] bg-gray-100 cursor-pointer" onClick={() => handleDeleteEmployee(employee.client_emp_id)}>
                            <AiFillDelete/>
                            </button>
                          </>
                          }
                        </td>
                      </tr>
                     ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeePage;
