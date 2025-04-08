import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidEditAlt } from "react-icons/bi";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { getClients } from "../../actions/clientActions";
// import { getLocationByClient } from "../../actions/locationActions";
import { getServiceRequestLists } from "../../actions/serviceTicket";
import Loader from "../../Images/ZZ5H.gif";

const ListServiceRequests = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
//   const [searchParams, setSearchParams] = useSearchParams();
//   const clients = useSelector((state) => state.client.clients);
//   const locations = useSelector((state) => state.location.locations);
  const { serviceRequests, loading } = useSelector((state) => state.serviceTicket);
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);

  useEffect(() => {
      dispatch(getServiceRequestLists({}));
    },[dispatch])
  // Initialize filtersApplied based on URL parameters
//   const [filtersApplied, setFiltersApplied] = useState(
//     searchParams.has("client_id") && searchParams.has("location_id")
//   );

  // Initialize state from URL parameters
//   const [filters, setFilters] = useState({
//     client_id: searchParams.get("client_id") || "",
//     location_id: searchParams.get("location_id") || "",
//   });
//   const [selectedClient, setSelectedClient] = useState(searchParams.get("client_id") || null);
//   const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location_id") || null);
//   const [sortConfig, setSortConfig] = useState({
//     key: searchParams.get("sort_by") || "",
//     direction: searchParams.get("order") || "ASC"
//   });

  // Update URL when filters change
//   useEffect(() => {
//     if (filtersApplied) {
//       const params = new URLSearchParams();
//       if (filters.client_id) params.set("client_id", filters.client_id);
//       if (filters.location_id) params.set("location_id", filters.location_id);
//       if (sortConfig.key) params.set("sort_by", sortConfig.key);
//       if (sortConfig.direction) params.set("order", sortConfig.direction);
//       setSearchParams(params);
//     }
//   }, [filters, sortConfig, setSearchParams, filtersApplied]);

  // Initial data fetch and handle URL filters when returning from add/edit
//   useEffect(() => {
//     if (user_type === "Client Employee") {
//       dispatch(getServiceRequestLists({}));
//     } else {
//       dispatch(getClients());
//       // If returning from add/edit (URL has both filters), apply them
//       const urlClientId = searchParams.get("client_id");
//       const urlLocationId = searchParams.get("location_id");
//       if (urlClientId && urlLocationId) {
//         // Set the filters in state
//         setFilters({
//           client_id: urlClientId,
//           location_id: urlLocationId
//         });
//         // Fetch locations for the client
//         dispatch(getLocationByClient(urlClientId));
//         // Apply the filters
//         const query = {
//           client_id: urlClientId,
//           location_id: urlLocationId
//         };
//         dispatch(getServiceRequestLists(query, sortConfig.key, sortConfig.direction));
//       } else {
//         dispatch(getServiceRequestLists({}));
//       }
//     }
//   }, [dispatch, user_type]);

  // Fetch locations when client changes
//   useEffect(() => {
//     if (filters.client_id) {
//       dispatch(getLocationByClient(filters.client_id));
//     }
//   }, [dispatch, filters.client_id]);

//   const handleClientChange = (e) => {
//     const { value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       client_id: value,
//       location_id: "",
//     }));
//     setSelectedClient(value);
//     dispatch(getLocationByClient(value));
//   };

//   const handleLocationChange = (e) => {
//     const { value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       location_id: value,
//     }));
//     setSelectedLocation(value);
//   };

//   const handleSearch = () => {
//     setFiltersApplied(true); // Mark filters as explicitly applied
//     const { client_id, location_id } = filters;
//     const query = {
//       ...(client_id && { client_id }),
//       ...(location_id && { location_id }),
//     };
//     dispatch(getServiceRequestLists(query, sortConfig.key, sortConfig.direction));
//   };

//   const handleReset = () => {
//     setFiltersApplied(false); // Reset filters applied state
//     setFilters({
//       client_id: "",
//       location_id: "",
//     });
//     setSelectedClient(null);
//     setSelectedLocation(null);
//     setSortConfig({ key: "", direction: "ASC" });
//     setSearchParams(new URLSearchParams()); // Clear URL params
//     if (user_type === "Client Employee") {
//       dispatch(getServiceRequestLists({}));
//     } else {
//       dispatch(getServiceRequestLists({}));
//       dispatch(getClients());
//     }
//   };

  const handleEdit = (requestId) => {
    // navigate(`/edit-service-request/${requestId}?${searchParams.toString()}`);
    navigate(`/edit-service-request/${requestId}`);
  };

//   const handleSort = (key) => {
//     let direction = "ASC";
//     if (sortConfig.key === key && sortConfig.direction === "ASC") {
//       direction = "DESC";
//     }
//     setSortConfig({ key, direction });
//     const { client_id, location_id } = filters;
//     const query = {
//       ...(client_id && { client_id }),
//       ...(location_id && { location_id }),
//     };
//     dispatch(getServiceRequestLists(query, key, direction));
//   };

//   const getSortSymbol = (key) => {
//     if (sortConfig.key === key) {
//       return sortConfig.direction === "ASC" ? "▲" : "▼";
//     }
//     return "↕";
//   };

  // Truncate service ticket details to 200 characters
  const truncateDetails = (text) => {
    if (!text) return "";
    return text.length > 200 ? `${text.substring(0, 200)}...` : text;
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">Customer Service Requests</h2>
          {/* <div className="mb-4">
            {user_type !== "Client Employee" && (
              <form className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="client_id" className="text-sm mb-2">
                    Filter by Client:
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    className="border border-gray-300 rounded px-3 py-1"
                    value={filters.client_id}
                    onChange={handleClientChange}
                  >
                    <option value="">Select Client</option>
                    {clients?.data?.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="location_id" className="text-sm mb-2">
                    Filter by Location:
                  </label>
                  <select
                    id="location_id"
                    name="location_id"
                    className={`border border-gray-300 rounded px-3 py-1 ${
                      !filters.client_id ? "bg-gray-100 text-gray-500" : ""
                    }`}
                    value={filters.location_id}
                    onChange={handleLocationChange}
                    disabled={!filters.client_id}
                  >
                    <option value="">Select Location</option>
                    {locations?.map((location) => (
                      <option
                        key={location.location_id}
                        value={location.location_id}
                      >
                        {location.address_line_one} {location.address_line_two}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                </div>
              </form>
            )}
          </div> */}

          <div className="mb-4 flex justify-end">
            {/* {access?.includes(user_type) && ( */}
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded"
              >
                <Link
                  to={`/add-service-request`}
                >
                  Create Customer Service Request
                </Link>
              </button>
            {/* )} */}
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2 cursor-pointer">
                    Client
                  </th>
                  <th className="border px-4 py-2 cursor-pointer" >
                    Location

                  </th>
                  <th className="border px-4 py-2 cursor-pointer" >
                    Requester

                  </th>
                  <th className="border px-4 py-2">
                   Service Request
                  </th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-4">
                      <div className="flex justify-center items-center">
                        <img src={Loader} alt="Loading..." className="h-16 w-16" />
                      </div>
                    </td>
                  </tr>
                ) : serviceRequests?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No service requests found.
                    </td>
                  </tr>
                ) : (
                  serviceRequests?.map((request) => (
                    <tr key={request?.request_id}>
                      <td className="border px-4 py-2">
                        {request.client_name}
                      </td>
                      <td className="border px-4 py-2">
                        {request.service_location}
                      </td>
                      <td className="border px-4 py-2">
                        {request.contact_person}
                      </td>
                      <td className="border px-4 py-2">
                        {truncateDetails(request.service_ticket_details)}
                      </td>
                      <td className="border px-4 py-2 flex">
                        <button
                          className="p-[4px] bg-gray-100 cursor-pointer mr-2"
                          onClick={() => handleEdit(request.request_id)}
                        >
                          <BiSolidEditAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListServiceRequests;