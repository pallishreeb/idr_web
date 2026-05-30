/** @format */

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link, useNavigate, useSearchParams, } from "react-router-dom";
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
import { MdAssignmentInd, MdAdd, MdContentCopy } from "react-icons/md";
const ServiceTickets = () => {
  const dispatch = useDispatch();
  // const location = useLocation();
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
const [filters, setFilters] = useState({
  client_id: searchParams.get("client_id") || "",
  status: searchParams.get("status") || "",
  technician: searchParams.get("technician") || "",
  project_manager: searchParams.get("project_manager") || "",
  location_id: searchParams.get("location_id") || "",
  is_billed: searchParams.get("is_billed") || "",
});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { user_type, client_type, locations } = useSelector(
    (state) => state.user.user,
  );
  const { access, clientAccess, technicianAccess } = useSelector(
    (state) => state.user,
  );
  // const { serviceTickets, loading } = useSelector((state) => state.workOrder);
  const { serviceTickets, loading } = useSelector(
    (state) => state.serviceTicket,
  );
  const { clients } = useSelector((state) => state.client);
  const { idrEmployees } = useSelector((state) => state.employee);
  const loadingLocations = useSelector((state) => state.location.loading);
  const clientLocations = useSelector((state) => state.location.locations);
  useEffect(() => {
  const params = new URLSearchParams();

  if (filters.client_id) params.set("client_id", filters.client_id);
  if (filters.status) params.set("status", filters.status);
  if (filters.technician)
    params.set("technician", filters.technician);
  if (filters.project_manager)
    params.set("project_manager", filters.project_manager);
  if (filters.location_id)
    params.set("location_id", filters.location_id);
  if (filters.is_billed)
    params.set("is_billed", filters.is_billed);

  setSearchParams(params);
}, [filters, setSearchParams]);
useEffect(() => {
  dispatch(getServiceTicketLists(filters));
  if (technicianAccess.includes(user_type)) {
  dispatch(getClients());
  dispatch(fetchIDREmployees());
  }
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
  setSearchParams({});
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
  const locationAccess = [
    ...technicianAccess,
    "Client Employee"
  ];
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex flex-col gap-4 mt-4">
            {/* HEADER */}
            <div
              className="
      bg-white
      rounded-[22px]
      border
      border-gray-100
      shadow-sm
      overflow-hidden
    "
            >
              <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="px-4 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="
            w-12
            h-12
            rounded-2xl
            bg-gradient-to-r
          from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
            text-white
            flex
            items-center
            justify-center
          "
                  >
                    <MdAssignmentInd className="text-2xl" />
                  </div>

                  <div>
                    <h1 className="text-xl font-bold text-[#1E1B4B]">
                      Service Tickets
                    </h1>

                    <p className="text-xs text-gray-500 mt-1">
                      Manage and track service tickets
                    </p>
                  </div>
                </div>

                {access.includes(user_type) && (
                  <Link to={`/add-service-ticket?${searchParams.toString()}`}>
                    <button
                      className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-2xl
              bg-gradient-to-r
             from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
              text-white
              text-sm
              font-semibold
              hover:shadow-md
            "
                    >
                      <MdAdd className="text-lg" />
                      New Ticket
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* FILTERS */}
            <div
              className="
      bg-white
      rounded-[22px]
      border
      border-gray-100
      shadow-sm
      p-4
    "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {/* STATUS */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Ticket Status
                  </label>

                  <select
                    name="status"
                    value={filters.status}
                    className="h-10 px-3 rounded-xl border border-gray-200 text-sm"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* CLIENT */}
                {technicianAccess.includes(user_type) && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Client
                    </label>

                    <select
                      name="client_id"
                      value={filters.client_id}
                      className="h-10 px-3 rounded-xl border border-gray-200 text-sm"
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>

                      {[...(clients?.data || [])]
                        .sort((a, b) =>
                          (a.company_name || "").localeCompare(
                            b.company_name || "",
                          ),
                        )
                        .map((client) => (
                          <option
                            key={client.client_id}
                            value={client.client_id}
                          >
                            {client.company_name}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {/* LOCATION */}
                {locationAccess.includes(user_type) && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Location
                  </label>

                  <select
                    name="location_id"
                    value={filters.location_id}
                    className="h-10 px-3 rounded-xl border border-gray-200 text-sm"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>

                    {[...(clientLocations || [])]
                      .sort((a, b) =>
                        `${a.address_line_one || ""} ${a.address_line_two || ""}`.localeCompare(
                          `${b.address_line_one || ""} ${b.address_line_two || ""}`,
                        ),
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
                {/* BILLED */}
                {access.includes(user_type) && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Billed
                    </label>

                    <select
                      name="is_billed"
                      value={filters.is_billed}
                      className="h-10 px-3 rounded-xl border border-gray-200 text-sm"
                      onChange={handleFilterChange}
                    >
                      <option value="">All</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Service Agreement">
                        Service Agreement
                      </option>
                      <option value="Warranty">Warranty</option>
                      <option value="Courtesy">Courtesy</option>
                    </select>
                  </div>
                )}

                {/* TECH */}
                {access.includes(user_type) && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Technician
                    </label>

                    <select
                      name="technician"
                      value={filters.technician}
                      className="h-10 px-3 rounded-xl border border-gray-200 text-sm"
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
                )}

                {/* PM */}
                {access.includes(user_type) && (
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Project Manager
                    </label>

                    <select
                      name="project_manager"
                      value={filters.project_manager}
                      className="h-10 px-3 rounded-xl border border-gray-200 text-sm"
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
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="
          px-4
          py-2
          rounded-xl
          bg-indigo-600
          text-white
          text-sm
          font-medium
        "
                  onClick={handleSearch}
                >
                  Search
                </button>

                <button
                  className="
          px-4
          py-2
          rounded-xl
          bg-gray-100
          text-gray-700
          text-sm
          font-medium
        "
                  onClick={handleReset}
                >
                  Reset
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div
              className="
      bg-white
      rounded-[22px]
      border
      border-gray-100
      shadow-sm
      overflow-hidden
    "
            >
              {!loading ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1200px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th
                          className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap cursor-pointer"
                          onClick={() => handleSort("service_ticket_number")}
                        >
                          Ticket #
                        </th>

                        <th
                          className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap cursor-pointer"
                          onClick={() => handleSort("client_name")}
                        >
                          Client
                        </th>

                        <th
                          className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap cursor-pointer"
                          onClick={() => handleSort("client_location")}
                        >
                          Location
                        </th>

                        <th
                          className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap cursor-pointer"
                          onClick={() => handleSort("service_date")}
                        >
                          Service Date
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap">
                          Contact
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap">
                          Status
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap">
                          Billed
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap">
                          Request
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-bold text-gray-600 whitespace-nowrap">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {serviceTickets?.length > 0 ? (
                        sortedServiceTickets?.map((order) => (
                          <tr
                            key={order.service_ticket_id}
                            className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                  "
                          >
                            <td className="px-3 py-3 text-sm font-semibold whitespace-nowrap">
                              {order?.service_ticket_number || "NA"}
                            </td>

                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                              {order?.client_name || "NA"}
                            </td>

                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                              {order?.location_details?.address_line_one ||
                                "NA"}
                            </td>

                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                              {order?.service_date || "NA"}
                            </td>

                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                              <div>
                                <p className="font-medium">
                                  {order.contact_person}
                                </p>

                                <p className="text-xs text-gray-500">
                                  {order.contact_phone_number}
                                </p>
                              </div>
                            </td>

                            <td className="px-3 py-3 whitespace-nowrap">
                              <span
                                className={`
                        inline-flex
                        items-center
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          order.status === "Closed"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }
                      `}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td className="px-3 py-3 text-sm whitespace-nowrap">
                              {order.is_billed || "NA"}
                            </td>

                            <td className="px-3 py-3 text-sm max-w-[220px] truncate">
                              {order.service_request}
                            </td>

                            <td className="px-3 py-3 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                {/* EDIT */}
                               <Link
                                  to={`/edit-service-ticket/${order?.service_ticket_id}?${searchParams.toString()}`}
                                >
                                  <button
                                    className="
                            w-9
                            h-9
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                            flex
                            items-center
                            justify-center
                          "
                                  >
                                    <BiSolidEditAlt className="text-lg" />
                                  </button>
                                </Link>

                                {/* DUPLICATE */}
                                {access.includes(user_type) && (
                                <Link
                                  to={`/add-service-ticket?${searchParams.toString()}`}
                                  state={{
                                    duplicateData: order,
                                    isDuplicate: true,
                                  }}
                                >
                                  <button
                                    className="
                            w-9
                            h-9
                            rounded-xl
                            bg-indigo-50
                            text-indigo-600
                            flex
                            items-center
                            justify-center
                          "
                                  >
                                    <MdContentCopy className="text-lg" />
                                  </button>
                                </Link>
                                )}
                                {/* DELETE */}
                                {user_type === "Admin" && (
                                  <button
                                    onClick={() =>
                                      handleDelete(order?.service_ticket_id)
                                    }
                                    className="
                            w-9
                            h-9
                            rounded-xl
                            bg-red-50
                            text-red-600
                            flex
                            items-center
                            justify-center
                          "
                                  >
                                    <AiFillDelete className="text-lg" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-8 text-sm text-gray-500"
                          >
                            No Service Tickets Found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-gray-500">
                  Loading Service Tickets...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceTickets;
