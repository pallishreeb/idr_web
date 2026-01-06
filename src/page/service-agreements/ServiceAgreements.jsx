import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
import { BiSolidEditAlt } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getServiceAgreementLists } from "../../actions/serviceAgreement";
import { clearServiceAgreements } from "../../reducers/serviceAgreementSlice";
import Loader from "../../Images/ZZ5H.gif";

const ServiceAgreements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const serviceAgreements = useSelector(
    (state) => state.serviceAgreement.serviceAgreements
  );
  const loading = useSelector((state) => state.serviceAgreement.loading);
  const {
    user_type,
    client_type,
    locations: userLocations,
  } = useSelector((state) => state.user.user);
  const { access, clientAccess } = useSelector((state) => state.user);

  // Initialize filtersApplied based on URL parameters
  const [filtersApplied, setFiltersApplied] = useState(
    searchParams.has("client_id") && searchParams.has("location_id")
  );

  // Initialize state from URL parameters
  const [filters, setFilters] = useState({
    client_id: searchParams.get("client_id") || "",
    location_id: searchParams.get("location_id") || "",
  });
  const [selectedClient, setSelectedClient] = useState(
    searchParams.get("client_id") || null
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location_id") || null
  );
  const [sortConfig, setSortConfig] = useState({
    key: searchParams.get("sort_by") || "",
    direction: searchParams.get("order") || "ASC",
  });

  // Update URL when filters change
useEffect(() => {
  const params = new URLSearchParams();
  if (filters.client_id) params.set("client_id", filters.client_id);
  if (filters.location_id) params.set("location_id", filters.location_id);
  if (sortConfig.key) params.set("sort_by", sortConfig.key);
  if (sortConfig.direction) params.set("order", sortConfig.direction);

  setSearchParams(params);
}, [filters, sortConfig, setSearchParams]);


  // Initial data fetch and handle URL filters when returning from add/edit
useEffect(() => {
  if (user_type !== "Client Employee") {
    dispatch(getClients());
  }

  const client_id = searchParams.get("client_id");
  const location_id = searchParams.get("location_id");

  const query = {
    ...(client_id && { client_id }),
    ...(location_id && { location_id }),
  };

  dispatch(
    getServiceAgreementLists(
      query,
      sortConfig.key,
      sortConfig.direction
    )
  );
}, [dispatch, user_type, searchParams, sortConfig]);


  // Fetch locations when client changes
  useEffect(() => {
    if (filters.client_id) {
      dispatch(getLocationByClient(filters.client_id));
    }
  }, [dispatch, filters.client_id]);

  const handleClientChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      client_id: value,
      location_id: "",
    }));
    setSelectedClient(value);
    dispatch(getLocationByClient(value));
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      location_id: value,
    }));
    setSelectedLocation(value);
  };

  const handleSearch = () => {
    setFiltersApplied(true); // Mark filters as explicitly applied
    const { client_id, location_id } = filters;
    const query = {
      ...(client_id && { client_id }),
      ...(location_id && { location_id }),
    };
    dispatch(
      getServiceAgreementLists(query, sortConfig.key, sortConfig.direction)
    );
  };

  const handleReset = () => {
    setFiltersApplied(false); // Reset filters applied state
    setFilters({
      client_id: "",
      location_id: "",
    });
    setSelectedClient(null);
    setSelectedLocation(null);
    setSortConfig({ key: "", direction: "ASC" });
    setSearchParams(new URLSearchParams()); // Clear URL params
    if (user_type === "Client Employee") {
      dispatch(getServiceAgreementLists({}));
    } else {
      dispatch(getServiceAgreementLists({}));
      dispatch(getClients());
    }
  };

  const handleEdit = (agreementId) => {
    navigate(
      `/edit-service-agreement/${agreementId}?${searchParams.toString()}`
    );
  };

  const formatDateToMDY = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${month}/${day}/${year}`;
  };

  const formatCurrency = (value) => {
    if (typeof value === "string") {
      value = value.replace(/[^0-9.]/g, "");
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    const { client_id, location_id } = filters;
    const query = {
      ...(client_id && { client_id }),
      ...(location_id && { location_id }),
    };
    dispatch(getServiceAgreementLists(query, key, direction));
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }
    return "↕";
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">Service Agreements</h2>
          <div className="mb-4">
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
                        key={location?.location_id}
                        value={location?.location_id}
                      >
                        {location?.address_line_one} {location?.address_line_two}
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
            {clientAccess?.includes(client_type) &&
              userLocations?.length > 0 && (
                <form className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <label htmlFor="location_id" className="text-sm mb-2">
                      Filter by Location:
                    </label>
                    <select
                      id="location_id"
                      name="location_id"
                      className={`border border-gray-300 rounded px-3 py-1`}
                      value={filters.location_id}
                      onChange={handleLocationChange}
                    >
                      <option value="">Select Location</option>
                      {[...userLocations]
                        .sort((a, b) => {
                          const addressA =
                            `${a.address_line_one} ${a.address_line_two}`.toLowerCase();
                          const addressB =
                            `${b.address_line_one} ${b.address_line_two}`.toLowerCase();
                          return addressA.localeCompare(addressB);
                        })
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
          </div>

          <div className="mb-4 flex justify-end">
            {access?.includes(user_type) && (
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded"
                disabled={!selectedClient}
              >
                <Link
  to={`/add-service-agreement/${selectedClient || "null"}/${selectedLocation || "null"}?${searchParams.toString()}`}
>

                  Add New Service Agreement
                </Link>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("client_name")}
                  >
                    Client Name
                    <span className="ml-1">{getSortSymbol("client_name")}</span>
                  </th>
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("start_date")}
                  >
                    Start Date
                    <span className="ml-1">{getSortSymbol("start_date")}</span>
                  </th>
                  <th
                    className="border px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("expiration_date")}
                  >
                    Expiration Date
                    <span className="ml-1">
                      {getSortSymbol("expiration_date")}
                    </span>
                  </th>
                  <th className="border px-4 py-2">Parts Covered</th>
                  {(access.includes(user_type) || client_type !== "User") && (
                    <th
                      className="border px-4 py-2 cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      Annual Sale Price
                      <span className="ml-1">{getSortSymbol("price")}</span>
                    </th>
                  )}
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-4">
                      <div className="flex justify-center items-center">
                        <img
                          src={Loader}
                          alt="Loading..."
                          className="h-16 w-16"
                        />
                      </div>
                    </td>
                  </tr>
                ) : serviceAgreements?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No service agreements found.
                    </td>
                  </tr>
                ) : (
                  serviceAgreements?.map((agreement) => (
                    <tr key={agreement?.agreement_id}>
                      <td className="border px-4 py-2">
                        {agreement.client_name}
                      </td>
                      <td className="border px-4 py-2">
                        {formatDateToMDY(agreement.start_date) || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {formatDateToMDY(agreement.expiration_date) || ""}
                      </td>
                      <td className="border px-4 py-2">
                        {agreement.parts_covered ? "Yes" : "No"}
                      </td>
                      {user_type !== "IDR Employee" &&
                        client_type !== "User" && (
                          <td className="border px-4 py-2">
                            {formatCurrency(agreement.price)}
                          </td>
                        )}
                      <td className="border px-4 py-2 flex">
                        <button
                          className="p-[4px] bg-gray-100 cursor-pointer mr-2"
                          onClick={() => handleEdit(agreement.agreement_id)}
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

export default ServiceAgreements;
