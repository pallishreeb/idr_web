import React, {
  useState,
  useEffect,
} from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import { useLocation } from "react-router-dom";

import Swal from "sweetalert2";

import {
  BiLockAlt,
  BiSolidEditAlt,
} from "react-icons/bi";

import { AiFillDelete } from "react-icons/ai";

import {
  MdPeople,
  MdSearch,
  MdBusiness,
  MdAdd,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  getClientEmployeeByClientId,
  deleteClientEmployee,
} from "../../actions/clientEmployeeActions";

import { getClients } from "../../actions/clientActions";

const EmployeePage = () => {
  const location = useLocation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const clients = useSelector(
    (state) => state.client.clients,
  );

  const loadingClients = useSelector(
    (state) => state.client.loading,
  );

  const employees = useSelector(
    (state) =>
      state.clientEmployee
        .clientEmployees,
  );

  const loadingEmployees =
    useSelector(
      (state) =>
        state.clientEmployee.loading,
    );

  const user = useSelector(
    (state) => state.user.user,
  );

  const [selectedClient, setSelectedClient] =
    useState(null);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    if (
      location.state?.selectedClient
    ) {
      setSelectedClient(
        String(
          location.state.selectedClient,
        ),
      );
    }
  }, []);

  useEffect(() => {
    if (selectedClient) {
      dispatch(
        getClientEmployeeByClientId(
          selectedClient,
        ),
      );
    }
  }, [
    dispatch,
    selectedClient,
  ]);

  useEffect(() => {
    if (
      user?.client_type ===
        "Admin" &&
      user.client_id
    ) {
      setSelectedClient(
        String(user.client_id),
      );
    }
  }, [user]);

  const handleClientChange = (
    clientId,
  ) => {
    setSelectedClient(clientId);
  };

  const handleDeleteEmployee = (
    employeeId,
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText:
        "Yes, delete it!",
      cancelButtonText:
        "No, keep it",
      confirmButtonColor:
        "#6366F1",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          deleteClientEmployee(
            employeeId,
          ),
        );
      }
    });
  };

  const handleEdit = (
    employeeId,
  ) => {
    navigate(
      `/edit-employee/${employeeId}`,
      {
        state: {
          selectedClient,
        },
      },
    );
  };

  const handleSetPassword = (
    userId,
  ) => {
    navigate(
      `/set-user-password/${userId}`,
      {
        state: {
          selectedClient,
        },
      },
    );
  };

  return (
    <>
      <Header />

      <div className="flex">
        <AdminSideNavbar />

        <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-8">
          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                Employee Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage employee access,
                roles and permissions
              </p>
            </div>

            {selectedClient && (
              <Link
                to={`/add-employee/${selectedClient}`}
                state={{
                  selectedClient,
                }}
              >
                <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                  <MdAdd size={22} />
                  Add Employee
                </button>
              </Link>
            )}
          </div>

          {/* FILTER CARD */}
          {[
            "Admin",
            "Subadmin",
          ].includes(
            user?.user_type,
          ) && (
            <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Client Filter
                </h2>
              </div>

              <div className="max-w-xl">
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Select Client To View
                  Employees
                </label>

                <div className="relative">
                  <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                  <select
                    id="client"
                    value={
                      selectedClient ??
                      ""
                    }
                    onChange={(e) =>
                      handleClientChange(
                        e.target.value,
                      )
                    }
                    disabled={
                      user?.client_type ===
                      "Admin"
                    }
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                  >
                    <option value="">
                      Select Client
                    </option>

                    {loadingClients ? (
                      <option
                        value=""
                        disabled
                      >
                        Loading...
                      </option>
                    ) : (
                      (user?.client_type ===
                      "Admin"
                        ? clients?.data?.filter(
                            (
                              client,
                            ) =>
                              String(
                                client.client_id,
                              ) ===
                              String(
                                user.client_id,
                              ),
                          )
                        : clients?.data
                      )?.map(
                        (
                          client,
                        ) => (
                          <option
                            key={
                              client.client_id
                            }
                            value={
                              client.client_id
                            }
                          >
                            {
                              client.company_name
                            }
                          </option>
                        ),
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYEE TABLE */}
          {selectedClient !==
            null && (
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP GRADIENT */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* TABLE HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <MdPeople size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Employees
                    </h2>

                    <p className="text-sm text-gray-500">
                      {
                        clients?.data?.find(
                          (
                            client,
                          ) =>
                            String(
                              client.client_id,
                            ) ===
                            String(
                              selectedClient,
                            ),
                        )
                          ?.company_name
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-600 font-semibold text-sm">
                  <MdSearch />

                  Total Employees:{" "}
                  {
                    employees?.length
                  }
                </div>
              </div>

              {/* TABLE */}
              {loadingEmployees ? (
                <div className="p-10 text-center text-gray-500">
                  Loading employees...
                </div>
              ) : (
                <div className="overflow-x-auto xl:overflow-x-hidden">
                  <table className="w-full table-auto">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Client
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Employee
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Email
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Contact
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Type
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Website Access
                        </th>

                        <th className="w-[160px] px-4 py-4 text-center text-xs uppercase tracking-wider font-bold text-indigo-600">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {employees?.length ===
                      0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="text-center py-12"
                          >
                            <img
                              src="not-found.png"
                              alt="Data Not Found"
                              className="mx-auto w-48 h-48 opacity-70"
                            />

                            <p className="text-gray-500 mt-4">
                              No Employees
                              Found
                            </p>
                          </td>
                        </tr>
                      ) : (
                        [...employees]
                          .sort(
                            (
                              a,
                              b,
                            ) =>
                              a.first_name.localeCompare(
                                b.first_name,
                              ),
                          )
                          .map(
                            (
                              employee,
                            ) => (
                              <tr
                                key={
                                  employee?.client_emp_id
                                }
                                className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
                              >
                                {/* CLIENT */}
                                <td className="px-4 py-4 text-gray-700 max-w-[220px] truncate">
                                  {
                                    clients?.data?.find(
                                      (
                                        client,
                                      ) =>
                                        client.client_id ===
                                        employee.client_id,
                                    )
                                      ?.company_name
                                  }
                                </td>

                                {/* NAME */}
                                <td className="px-4 py-4 font-semibold text-[#1E1B4B]">
                                  {
                                    employee.first_name
                                  }{" "}
                                  {
                                    employee.last_name
                                  }
                                </td>

                                {/* EMAIL */}
                                <td className="px-4 py-4 text-gray-600 max-w-[220px] truncate">
                                  {
                                    employee.email_id
                                  }
                                </td>

                                {/* CONTACT */}
                                <td className="px-4 py-4 text-gray-600">
                                  {employee?.contact_number
                                    ? employee?.contact_number
                                    : "NA"}
                                </td>

                                {/* TYPE */}
                                <td className="px-4 py-4">
                                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                                    {employee?.employee_type
                                      ? employee?.employee_type
                                      : "NA"}
                                  </span>
                                </td>

                                {/* ACCESS */}
                                <td className="px-4 py-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      employee.access_to_website
                                        ? "bg-green-100 text-green-600"
                                        : "bg-red-100 text-red-500"
                                    }`}
                                  >
                                    {employee.access_to_website
                                      ? "Yes"
                                      : "No"}
                                  </span>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-4 w-[160px]">
                                  <div className="flex items-center justify-center gap-2">
                                    {/* EDIT */}
                                    <button
                                      onClick={() =>
                                        handleEdit(
                                          employee?.client_emp_id,
                                        )
                                      }
                                      className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                                    >
                                      <BiSolidEditAlt size={18} />
                                    </button>

                                    {/* PASSWORD */}
                                    {user?.user_type ===
                                      "Admin" && (
                                      <button
                                        onClick={() =>
                                          handleSetPassword(
                                            employee.user_id,
                                          )
                                        }
                                        className="w-10 h-10 rounded-xl bg-yellow-50 hover:bg-yellow-100 text-yellow-600 flex items-center justify-center transition-all duration-300"
                                      >
                                        <BiLockAlt size={18} />
                                      </button>
                                    )}

                                    {/* DELETE */}
                                    {(user?.user_type ===
                                      "Admin" ||
                                      (user?.client_type ===
                                        "Admin" &&
                                        user.user_id !==
                                          employee.user_id)) && (
                                      <button
                                        onClick={() =>
                                          handleDeleteEmployee(
                                            employee.client_emp_id,
                                          )
                                        }
                                        className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all duration-300"
                                      >
                                        <AiFillDelete size={18} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EmployeePage;