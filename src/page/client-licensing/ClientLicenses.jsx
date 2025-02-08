import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { AiFillDelete } from "react-icons/ai";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getLicenseLists, deleteLicense } from "../../actions/licenseActions";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";
import Loader from "../../Images/ZZ5H.gif";
import { clearLicense } from "../../reducers/licenseSlice";
const ClientLicenseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { locations } = useSelector((state) => state.location);
  const { licenses, loading } = useSelector((state) => state.license);
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const [filters, setFilters] = useState({
    client_id: "",
    location_id: "",
    manufacturer: "",
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });
  // Reset client and location when unmounting or navigating back
  useEffect(() => {
    if (selectedClient == null) {
      dispatch(clearLicense(selectedClient));
    }
  }, [selectedClient, dispatch]);
  useEffect(() => {
    if (user_type === "Client Employee") {
      dispatch(getLicenseLists({}));
    } else {
      dispatch(getLicenseLists({}));
      dispatch(getClients());
    }
  }, [dispatch, user_type]);

  const handleClientChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      client_id: value,
      location_id: "",
      manufacturer: "",
    }));
    setSelectedClient(value);
    dispatch(getLocationByClient(value)); // Fetch locations for the selected client
    if (value) {
      dispatch(getLicenseLists({ client_id: value })); // Fetch licenses for the client
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      location_id: value,
    }));
    if (filters.client_id && value) {
      dispatch(
        getLicenseLists({ client_id: filters.client_id, location_id: value })
      ); // Fetch licenses for the client and location
    }
    setSelectedLocation(value);
  };

  const handleManufacturerChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      manufacturer: value,
    }));
  };

  const handleSearch = () => {
    const { client_id, location_id, manufacturer } = filters;
    const query = {
      ...(client_id && { client_id }),
      ...(location_id && { location_id }),
      ...(manufacturer && { manufacturer }),
    };
    dispatch(getLicenseLists(query)); // Fetch licenses based on all applied filters
  };

  const handleReset = () => {
    setFilters({
      client_id: "",
      location_id: "",
      manufacturer: "",
    });
    if (user_type === "Client Employee") {
      dispatch(getLicenseLists({}));
    } else {
      dispatch(clearLicense(selectedClient));
    }
  };
  const handleDeleteLicense = (licenseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this license?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLicense(licenseId));
      }
    });
  };
  const handleEdit = (licenseId) => {
    navigate(`/edit-client-licensing/${licenseId}`);
  };

  const formatDateToMDY = (dateString) => {
    if (!dateString) return ""; // Handle empty values

    const [day, month, year] = dateString.split("/"); // Extract parts
    return `${month}/${day}/${year}`; // Rearrange to MM/DD/YYYY
  };

  const formatCurrency = (value) => {
    if (typeof value === "string") {
      // value = value.replace(/,/g, ""); // Remove all commas
      value = value.replace(/[^0-9.]/g, ""); 
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Change to appropriate currency if needed
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    
    dispatch(getLicenseLists(filters, key,direction)); // Pass correctly
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
          <h2 className="text-xl font-semibold mb-4">Client License List</h2>
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
                        key={location.location_id}
                        value={location.location_id}
                      >
                        {location.address_line_one} {location.address_line_two}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            )}
            <div className="flex flex-row items-end gap-2 mt-2">
              <div className="flex flex-col">
                <label htmlFor="manufacturer" className="text-sm mb-2">
                  Filter by Manufacturer:
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  className="border border-gray-300 rounded px-3 py-1"
                  value={filters.manufacturer}
                  onChange={handleManufacturerChange}
                />
              </div>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            {user_type === "Admin" && (
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded"
                disabled={!selectedClient}
              >
                <Link
                  to={`/add-client-licensing/${selectedClient}/${selectedLocation}`}
                >
                  Add New Client License
                </Link>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th
                    className="px-2 py-2 text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("client_name")}
                  >
                    Client{" "}
                    <span className="ml-1">{getSortSymbol("client_name")}</span>
                  </th>
                  <th
                    className="px-2 py-2 text-sm tracking-wider border"
                    onClick={() => handleSort("address_line_one")}
                  >
                    Location{" "}
                    <span className="ml-1">{getSortSymbol("location")}</span>
                  </th>
                  <th
                    className="px-2 py-2 text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("quantity")}
                  >
                    Qty <span className="ml-1">{getSortSymbol("quantity")}</span>
                  </th>
                  <th
                    className="px-2 py-2 text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("manufacturer")}
                  >
                    Manufacturer{" "}
                    <span className="ml-1">
                      {getSortSymbol("manufacturer")}
                    </span>
                  </th>
                  <th
                    className="px-2 py-2 text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("license_type")}
                  >
                    License Type{" "}
                    <span className="ml-1">
                      {getSortSymbol("license_type")}
                    </span>
                  </th>
                  <th
                    className="px-2 py-2 text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("start_date")}
                  >
                    Start Date{" "}
                    <span className="ml-1">{getSortSymbol("start_date")}</span>
                  </th>
                  <th
                    className="px-2 py-2 text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("expiration_date")}
                  >
                    Expiration Date{" "}
                    <span className="ml-1">
                      {getSortSymbol("expiration_date")}
                    </span>
                  </th>
                  {access.includes(user_type) && (
                    <th
                      className="px-2 py-2 text-sm font-semibold tracking-wider border"
                      onClick={() => handleSort("idr_cost")}
                    >
                      IDR Cost{" "}
                      <span className="ml-1">{getSortSymbol("idr_cost")}</span>
                    </th>
                  )}
                  {(access.includes(user_type) || client_type !== "User") && (
                    <th
                      className="px-2 py-2 text-sm font-semibold tracking-wider border"
                      onClick={() => handleSort("sale_cost")}
                    >
                      Sale Price{" "}
                      <span className="ml-1">
                        {getSortSymbol("sale_price")}
                      </span>
                    </th>
                  )}

                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={"9"} className="py-4">
                      <div className="flex justify-center items-center">
                        <img
                          src={Loader}
                          alt="Loading..."
                          className="h-16 w-16"
                        />
                      </div>
                    </td>
                  </tr>
                ) : licenses?.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No licenses found
                    </td>
                  </tr>
                ) : (
                  licenses?.map((license) => (
                    <tr key={license.license_id}>
                      <td className="border text-sm px-1 py-3">
                        {license.client_name}
                      </td>
                      <td className="border text-sm px-1 py-3">
                        {`${license?.location_details?.address_line_one}` ||
                          "NA"}
                      </td>
                      <td className="border text-sm px-1 py-3">
                        {license.quantity}
                      </td>
                      <td className="border text-sm px-1 py-3">
                        {license.manufacturer}
                      </td>
                      <td className="border text-sm px-1 py-3">
                        {license.license_type}
                      </td>
                      <td className="border text-sm px-1 py-3">
                        {formatDateToMDY(license.start_date) || ""}
                      </td>
                      <td className="border text-sm px-1 py-3">
                        {formatDateToMDY(license.expiration_date) || ""}
                      </td>
                      {access.includes(user_type) && (
                        <td className="border text-sm px-1 py-3">
                          {formatCurrency(license.idr_cost)}
                        </td>
                      )}
                      {(access.includes(user_type) ||
                        client_type !== "User") && (
                        <td className="border text-sm px-1 py-3">
                          {formatCurrency(license.sale_cost)}
                        </td>
                      )}
                      <td className="border text-sm px-1 py-3">
                        <button
                          onClick={() => handleEdit(license.license_id)}
                          className="p-2 bg-gray-100"
                        >
                          <BiSolidEditAlt />
                        </button>
                        {user_type === "Admin" && (
                          <button
                            onClick={() =>
                              handleDeleteLicense(license.license_id)
                            }
                            className="p-2 bg-gray-100"
                          >
                            <AiFillDelete />
                          </button>
                        )}
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

export default ClientLicenseList;
