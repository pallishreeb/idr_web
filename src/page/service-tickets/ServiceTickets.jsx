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
import { getLocationByClient } from "../../actions/locationActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import { toast } from "react-toastify";

const ServiceTickets = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const [filters, setFilters] = useState({
    client_id: "",
    status: "",
    technician: "",
    project_manager: "",
    location_id: "",
    is_billed: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { user_type, client_type, locations } = useSelector(
    (state) => state.user.user
  );
  const { access, clientAccess } = useSelector((state) => state.user);
  // const { serviceTickets, loading } = useSelector((state) => state.workOrder);
  const { serviceTickets, loading } = useSelector(
    (state) => state.serviceTicket
  );
  const { clients } = useSelector((state) => state.client);
  const { idrEmployees } = useSelector((state) => state.employee);
  const loadingLocations = useSelector((state) => state.location.loading);
  const clientLocations = useSelector((state) => state.location.locations);
  useEffect(() => {
    dispatch(getServiceTicketLists({}));
    dispatch(getClients());
    dispatch(fetchIDREmployees());
  }, [dispatch]);
  useEffect(() => {
    if (filters?.client_id) {
      dispatch(getLocationByClient(filters.client_id));
    }
  }, [dispatch, filters?.client_id]);
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
  const handleSearch = () => {
    dispatch(getServiceTicketLists(filters));
  };
  const handleReset = () => {
    const clearedFilters = {
      status: "",
      client_id: "",
      location_id: "",
      technician: "",
      project_manager: "",
      is_billed: "",
    };
    setFilters(clearedFilters);
    dispatch(getServiceTicketLists(clearedFilters));
  };
  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  const sortedServiceTickets = React.useMemo(() => {
    if (!sortConfig.key) return serviceTickets;

    return [...serviceTickets].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle undefined or null values
      if (aValue === undefined || aValue === null) aValue = "";
      if (bValue === undefined || bValue === null) bValue = "";

      // For nested fields (like client_name inside client object), handle accordingly
      // Example if sorting by 'client_name':
      if (sortConfig.key === "client_name") {
        aValue = a.client_name || "";
        bValue = b.client_name || "";
      }
      if (sortConfig.key === "client_location") {
        aValue = `${a.location_details?.address_line_one ?? ""} ${
          a.location_details?.address_line_two ?? ""
        }`.toLowerCase();
        bValue = `${b.location_details?.address_line_one ?? ""} ${
          b.location_details?.address_line_two ?? ""
        }`.toLowerCase();
      }

      if (sortConfig.key === "service_date") {
        aValue = new Date(a.service_date);
        bValue = new Date(b.service_date);
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [serviceTickets, sortConfig]);

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Service Tickets</h1>
            {access.includes(user_type) && (
              <Link to={"/add-service-ticket"}>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                  New Service Ticket
                </button>
              </Link>
            )}
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            {/* Filter section */}
            <div className="flex flex-col gap-4 mt-4 border py-7 px-5 bg-white w-full">
              {/* Row 1: Ticket Status, (Location if applicable), Client Name */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <label className="font-normal text-sm">
                    Filter By Ticket Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    className="px-3 border border-gray-200 h-10 rounded"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {clientAccess.includes(client_type) &&
                  locations?.length > 0 && (
                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-normal text-sm">
                        Filter By Location
                      </label>
                      <select
                        name="location_id"
                        value={filters.location_id}
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {[...locations]
                          .sort((a, b) =>
                            `${a.address_line_one} ${a.address_line_two}`.localeCompare(
                              `${b.address_line_one} ${b.address_line_two}`
                            )
                          )
                          .map((location) => (
                            <option
                              key={location.location_id}
                              value={location.location_id}
                            >
                              {location.address_line_one}{" "}
                              {location.address_line_two}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                {access.includes(user_type) && (
                  <>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-normal text-sm">
                        Filter By Client Name
                      </label>
                      <select
                        name="client_id"
                        value={filters.client_id}
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {clients?.data?.map((client) => (
                          <option
                            key={client.client_id}
                            value={client.client_id}
                          >
                            {client.company_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-normal text-sm">
                        Filter By Location
                      </label>
                      <select
                        name="location_id"
                        value={filters.location_id}
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {clientLocations.map((location) => (
                          <option
                            key={location.location_id}
                            value={location.location_id}
                          >
                            {location.address_line_one}{" "}
                            {location.address_line_two}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* Row 2: Technician, Project Manager, Search & Reset buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full items-end">
                {access.includes(user_type) && (
                  <>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-normal text-sm">
                        Filter By Technician
                      </label>
                      <select
                        name="technician"
                        value={filters.technician}
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {idrEmployees.map((emp) => {
                          const fullName = `${emp.first_name} ${emp.last_name}`;
                          return (
                            <option key={emp.idr_emp_id} value={fullName}>
                              {fullName}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-normal text-sm">
                        Filter By Project Manager
                      </label>
                      <select
                        name="project_manager"
                        value={filters.project_manager}
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        {idrEmployees.map((emp) => {
                          const fullName = `${emp.first_name} ${emp.last_name}`;
                          return (
                            <option key={emp.idr_emp_id} value={fullName}>
                              {fullName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <label className="font-normal text-sm">
                        Filter By Billed
                      </label>
                      <select
                        name="is_billed"
                        value={filters.is_billed}
                        className="px-3 border border-gray-200 h-10 rounded"
                        onChange={handleFilterChange}
                      >
                        <option value="">All</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </>
                )}
                <div className="flex gap-2 w-full">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded w-full"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {!loading ? (
              <table className="mt-2 w-full overflow-x-scroll">
                <thead>
                  <tr className="bg-gray-50">
                    <th
                      className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border"
                      onClick={() => handleSort("service_ticket_number")}
                    >
                      Service Ticket Number{" "}
                      {sortConfig.key === "service_ticket_number"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}{" "}
                      {/* default icon */}
                    </th>
                    <th
                      className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border"
                      onClick={() => handleSort("client_name")}
                    >
                      Client Name{" "}
                      {sortConfig.key === "client_name"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    <th
                      className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border"
                      onClick={() => handleSort("client_location")}
                    >
                      Client Location{" "}
                      {sortConfig.key === "client_location"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
                    </th>
                    <th
                      className="px-1 py-1 text-left text-sm font-semibold  tracking-wider border"
                      onClick={() => handleSort("service_date")}
                    >
                      Service Date{" "}
                      {sortConfig.key === "service_date"
                        ? sortConfig.direction === "asc"
                          ? "▲"
                          : "▼"
                        : "↕"}
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
                      Billed
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
                    sortedServiceTickets?.map((order) => (
                      <tr key={order.service_ticket_id} className="text-left ">
                        <td className="border text-sm px-1 py-3">
                          {order?.service_ticket_number
                            ? order?.service_ticket_number
                            : "NA"}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {order?.client_name || "NA"}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {order?.location_details?.address_line_one || "NA"}
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
                        <td className="border text-sm px-1 py-3">
                          {order.is_billed ? order.is_billed : "NA"}
                        </td>
                        <td className="border text-sm  px-1 py-3">
                          {order.service_request}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          <div className="flex gap-2">
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <a
                                href={`/edit-service-ticket/${order?.service_ticket_id}`}
                                className="inline-block"
                              >
                                <BiSolidEditAlt />
                              </a>
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
