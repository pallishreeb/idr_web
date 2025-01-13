/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import {
  getServiceTicketLists,
  deleteServiceTicket,
} from "../../actions/serviceTicket";
import { getClients } from "../../actions/clientActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import { toast } from "react-toastify";

const ServiceTickets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    client_name: "",
    status: "",
    technician: "",
    project_manager: "",
  });
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  // const { serviceTickets, loading } = useSelector((state) => state.workOrder);
  const { serviceTickets, loading } = useSelector((state) => state.serviceTicket);
  const { clients } = useSelector((state) => state.client);
  const { idrEmployees } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getServiceTicketLists(filters));
    dispatch(getClients());
    dispatch(fetchIDREmployees());
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // console.log("serviceTickets",serviceTickets)

  const handleDelete = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Service Ticket?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServiceTicket(orderId))
          .then(() => {
            dispatch(getServiceTicketLists(filters)); // Refresh the list after deletion
          })
          .catch((error) => {
            console.log(error);
            toast.error("Failed to delete the Service Ticket");
          });
      }
    });
  };

  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Service Tickets</h1>
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 w-[80%]">
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter By Ticket Status
                  </label>
                  <select
                    name="status"
                    className="px-3 border border-gray-200 h-10 rounded"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                {access.includes(user_type) && (
                  <>
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm">
                        Filter By Client Name
                      </label>
                      <select
                        name="client_name"
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {clients?.data?.map((client) => (
                          <option key={client.id} value={client.company_name}>
                            {client.company_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm">
                        Filter By Technician Name
                      </label>
                      <select
                        name="technician"
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {idrEmployees?.map((employee) => (
                          <option
                            key={employee.idr_emp_id}
                            value={employee.first_name}
                          >
                            {employee.first_name} {employee.last_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm">
                        Filter By Technician Manager
                      </label>
                      <select
                        name="project_manager"
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {idrEmployees?.map((employee) => (
                          <option
                            key={employee.idr_emp_id}
                            value={employee.first_name}
                          >
                            {employee.first_name} {employee.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
              {access.includes(user_type) && (
                <Link to={"/add-service-ticket"}>
                  <button className="bg-indigo-600 text-white px-6 py-2 rounded mt-7">
                    New Service Ticket
                  </button>
                </Link>
              )}
            </div>
            {!loading ? (
              <table className="mt-2 w-full overflow-x-scroll">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border">
                    Service  Ticket Number
                    </th>
                    <th className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border">
                      Client Name
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold  tracking-wider border">
                      Service Date
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                      Contact Person
                    </th>
                    <th className="px-1 py-1 text-left text-sm  font-semibold  tracking-wider border">
                      Mobile Number
                    </th>
                    <th className="px-1 py-1 text-left text-sm  font-semibold  tracking-wider border">
                      Status
                    </th>
                    <th className="px-1 py-1 text-left text-sm  font-semibold  tracking-wider border">
                      Service Request
                    </th>
                    <th className="px-1 py-1 text-left text-sm  font-semibold tracking-wider border">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {serviceTickets && serviceTickets?.length > 0 ? (
                    serviceTickets?.map((order) => (
                      <tr key={order.service_ticket_id} className="text-left ">
                        <td className="border text-sm px-1 py-3">
                          {order?.service_ticket_number ? order?.service_ticket_number : "NA"}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {order?.client_name || 'NA'}
                        </td>
                        
                        <td className="border text-sm px-1 py-3">
                          <input
                            type="date"
                            value={order.service_date || ""}
                            readOnly
                            className="outline-none border-none"
                          />
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {order.contact_person}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {order.contact_phone_number}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {order.status}
                        </td>
                        <td className="border text-sm  px-1 py-3">
                          {order.service_request}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          <div className="flex gap-2">
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <BiSolidEditAlt
                                onClick={() =>
                                  navigate(
                                    `/edit-service-ticket/${order?.service_ticket_id}`
                                  )
                                }
                              />
                            </div>
                            {user_type === "Admin" && (
                              <div className="p-[4px] bg-gray-100 cursor-pointer">
                                <AiFillDelete
                                  onClick={() =>
                                    handleDelete(order?.service_ticket_id)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-xs py-3">
                        No Service Ticket found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              "Loading Service Tickets..."
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceTickets;
