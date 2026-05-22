/** @format */

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { BiSolidEditAlt } from "react-icons/bi";

import { AiFillDelete } from "react-icons/ai";

import {
  MdBusiness,
  MdLocationOn,
  MdSearch,
  MdRefresh,
  MdAdd,
  MdKey,
} from "react-icons/md";

import Swal from "sweetalert2";

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

  const [searchParams, setSearchParams] = useSearchParams();

  // REDUX
  const { clients } = useSelector((state) => state.client);

  const { locations } = useSelector((state) => state.location);

  const { licenses, loading } = useSelector((state) => state.license);

  const {
    user_type,
    client_type,
    locations: userLocations,
  } = useSelector((state) => state.user.user);

  const { access, clientAccess } = useSelector((state) => state.user);

  // FILTERS APPLIED
  const [filtersApplied, setFiltersApplied] = useState(
    searchParams.has("client_id") && searchParams.has("location_id"),
  );

  // FILTERS
  const [filters, setFilters] = useState({
    client_id: searchParams.get("client_id") || "",
    location_id: searchParams.get("location_id") || "",
    manufacturer: searchParams.get("manufacturer") || "",
  });

  const [selectedClient, setSelectedClient] = useState(
    searchParams.get("client_id") || null,
  );

  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location_id") || null,
  );

  // SORT
  const [sortConfig, setSortConfig] = useState({
    key: searchParams.get("sort_by") || "",
    direction: searchParams.get("order") || "ASC",
  });

  // URL UPDATE
  useEffect(() => {
    if (filtersApplied) {
      const params = new URLSearchParams();

      if (filters.client_id) params.set("client_id", filters.client_id);

      if (filters.location_id) params.set("location_id", filters.location_id);

      if (filters.manufacturer)
        params.set("manufacturer", filters.manufacturer);

      if (sortConfig.key) params.set("sort_by", sortConfig.key);

      if (sortConfig.direction) params.set("order", sortConfig.direction);

      setSearchParams(params);
    }
  }, [filters, sortConfig, setSearchParams, filtersApplied]);

  // CLEAR ON RESET
  useEffect(() => {
    if (selectedClient == null) {
      dispatch(clearLicense(selectedClient));
    }
  }, [selectedClient, dispatch]);

  // INITIAL FETCH
  useEffect(() => {
    const client_id = searchParams.get("client_id");

    const location_id = searchParams.get("location_id");

    const manufacturer = searchParams.get("manufacturer");

    if (user_type !== "Client Employee") {
      dispatch(getClients());
    }

    const query = {
      ...(client_id && {
        client_id,
      }),

      ...(location_id && {
        location_id,
      }),

      ...(manufacturer && {
        manufacturer,
      }),
    };

    dispatch(getLicenseLists(query, sortConfig.key, sortConfig.direction));
  }, [dispatch, user_type, searchParams, sortConfig]);

  // FETCH LOCATIONS
  useEffect(() => {
    if (filters.client_id) {
      dispatch(getLocationByClient(filters.client_id));
    }
  }, [dispatch, filters.client_id]);

  // CLIENT CHANGE
  const handleClientChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      client_id: value,
      location_id: "",
      manufacturer: "",
    }));

    setSelectedClient(value);

    dispatch(getLocationByClient(value));
  };

  // LOCATION CHANGE
  const handleLocationChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      location_id: value,
    }));

    setSelectedLocation(value);
  };

  // MANUFACTURER
  const handleManufacturerChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      manufacturer: value,
    }));
  };

  // SEARCH
  const handleSearch = () => {
    setFiltersApplied(true);

    const { client_id, location_id, manufacturer } = filters;

    const params = new URLSearchParams();

    if (client_id) params.set("client_id", client_id);

    if (location_id) params.set("location_id", location_id);

    if (manufacturer) params.set("manufacturer", manufacturer);

    if (sortConfig.key) params.set("sort_by", sortConfig.key);

    if (sortConfig.direction) params.set("order", sortConfig.direction);

    setSearchParams(params);

    const query = {
      ...(client_id && {
        client_id,
      }),

      ...(location_id && {
        location_id,
      }),

      ...(manufacturer && {
        manufacturer,
      }),
    };

    dispatch(getLicenseLists(query, sortConfig.key, sortConfig.direction));
  };

  // RESET
  const handleReset = () => {
    setFiltersApplied(false);

    setFilters({
      client_id: "",
      location_id: "",
      manufacturer: "",
    });

    setSelectedClient(null);

    setSelectedLocation(null);

    setSortConfig({
      key: "",
      direction: "ASC",
    });

    setSearchParams(new URLSearchParams());

    dispatch(getLicenseLists({}));

    if (user_type !== "Client Employee") {
      dispatch(getClients());
    }
  };

  // DELETE
  const handleDeleteLicense = (licenseId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this license?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
      confirmButtonColor: "#6366F1",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLicense(licenseId)).then(() => {
          const { client_id, location_id, manufacturer } = filters;

          dispatch(
            getLicenseLists(
              {
                ...(client_id && {
                  client_id,
                }),

                ...(location_id && {
                  location_id,
                }),

                ...(manufacturer && {
                  manufacturer,
                }),
              },
              sortConfig.key,
              sortConfig.direction,
            ),
          );
        });
      }
    });
  };

  // EDIT
  const handleEdit = (licenseId) => {
    navigate(`/edit-client-licensing/${licenseId}?${searchParams.toString()}`);
  };

  // FORMAT DATE
  const formatDateToMDY = (dateString) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");

    return `${month}/${day}/${year}`;
  };

  // FORMAT CURRENCY
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

  // SORT
  const handleSort = (key) => {
    let direction = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    setSortConfig({
      key,
      direction,
    });

    const { client_id, location_id, manufacturer } = filters;

    const query = {
      ...(client_id && {
        client_id,
      }),

      ...(location_id && {
        location_id,
      }),

      ...(manufacturer && {
        manufacturer,
      }),
    };

    dispatch(getLicenseLists(query, key, direction));
  };

  // SORT SYMBOL
  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }

    return "↕";
  };

  // TOTALS
  const totalIdrCost = licenses?.reduce((sum, license) => {
    const cost = parseFloat(
      String(license.idr_cost || "0").replace(/[^0-9.-]/g, ""),
    );

    return sum + cost;
  }, 0);

  const totalSalePrice = licenses?.reduce((sum, license) => {
    const cost = parseFloat(
      String(license.sale_cost || "0").replace(/[^0-9.-]/g, ""),
    );

    return sum + cost;
  }, 0);

  return (
    <>
      <Header />

      <div className="flex">
        <AdminSideNavbar />

        <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-8">
          {/* PAGE HEADER */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                Client Licenses
              </h1>

              <p className="text-gray-500 mt-1">
                Manage client licensing, subscriptions and renewal tracking
              </p>
            </div>

            {/* ADD BUTTON */}
            <div>
              {access?.includes(user_type) && (
                <Link
                  to={`/add-client-licensing/${selectedClient}/${selectedLocation}?${searchParams.toString()}`}
                >
                  <button
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-300
                      
                       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-xl hover:scale-[1.02]
                      
                    `}
                  >
                    <MdAdd size={20} />
                    Add License
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* FILTER CARD */}
          <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

              <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                Filters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
              {/* CLIENT */}
              {user_type !== "Client Employee" && (
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Client
                  </label>

                  <div className="relative">
                    <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <select
                      value={filters.client_id}
                      onChange={handleClientChange}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                    >
                      <option value="">Select Client</option>

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
                </div>
              )}

              {/* LOCATION */}
              {(user_type !== "Client Employee" ||
                (clientAccess?.includes(client_type) &&
                  userLocations?.length > 0)) && (
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <div className="relative">
                    <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <select
                      value={filters.location_id}
                      onChange={handleLocationChange}
                      disabled={
                        user_type !== "Client Employee" && !filters.client_id
                      }
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border transition-all duration-300
                        
                        ${
                          user_type !== "Client Employee" && !filters.client_id
                            ? "bg-gray-100 text-gray-500 border-gray-200"
                            : "bg-white border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        }
                      `}
                    >
                      <option value="">Select Location</option>

                      {(clientAccess?.includes(client_type)
                        ? [...userLocations]
                        : [...locations]
                      )
                        ?.sort((a, b) => {
                          const addressA =
                            `${a.address_line_one || ""} ${a.address_line_two || ""}`.toLowerCase();

                          const addressB =
                            `${b.address_line_one || ""} ${b.address_line_two || ""}`.toLowerCase();

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
                </div>
              )}

              {/* MANUFACTURER */}
              <div>
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Manufacturer
                </label>

                <div className="relative">
                  <MdKey className="absolute top-4 left-4 text-indigo-400 text-xl" />

                  <input
                    type="text"
                    value={filters.manufacturer}
                    onChange={handleManufacturerChange}
                    placeholder="Enter manufacturer"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                  />
                </div>
              </div>

              {/* SEARCH */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <MdSearch size={20} />
                  Search
                </button>
              </div>

              {/* RESET */}
              <div className="flex items-end">
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
                >
                  <MdRefresh size={20} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* TOTAL CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {access.includes(user_type) && (
              <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-2">Total Sales Cost</p>

                <h3 className="text-3xl font-bold text-[#1E1B4B]">
                  {formatCurrency(totalIdrCost)}
                </h3>
              </div>
            )}

            {user_type !== "IDR Employee" && (
              <div className="bg-white rounded-[28px] shadow-lg border border-gray-100 p-6">
                <p className="text-sm text-gray-500 mb-2">Total Sale Price</p>

                <h3 className="text-3xl font-bold text-[#1E1B4B]">
                  {formatCurrency(totalSalePrice)}
                </h3>
              </div>
            )}
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
            {/* TOP BAR */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            {/* HEADER */}
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                License List
              </h2>

              <p className="text-sm text-gray-500">
                Total Licenses: {licenses?.length || 0}
              </p>
            </div>

            {/* TABLE CONTENT */}
            <div className="overflow-x-auto xl:overflow-x-hidden">
              <table className="w-full table-auto">
                <thead className="bg-indigo-50">
                  <tr>
                    {[
                      {
                        key: "client_name",
                        label: "Client",
                      },

                      {
                        key: "address_line_one",
                        label: "Location",
                      },

                      {
                        key: "quantity",
                        label: "Qty",
                      },

                      {
                        key: "manufacturer",
                        label: "Manufacturer",
                      },

                      {
                        key: "license_type",
                        label: "License Type",
                      },

                      {
                        key: "start_date",
                        label: "Start Date",
                      },

                      {
                        key: "expiration_date",
                        label: "Expiration Date",
                      },
                    ].map((column) => (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.key)}
                        className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 cursor-pointer select-none whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1">
                          {column.label}

                          <span>{getSortSymbol(column.key)}</span>
                        </div>
                      </th>
                    ))}

                    {/* IDR COST */}
                    {access.includes(user_type) && (
                      <th
                        onClick={() => handleSort("idr_cost")}
                        className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                      >
                        IDR Cost {getSortSymbol("idr_cost")}
                      </th>
                    )}

                    {/* SALE PRICE */}
                    {user_type !== "IDR Employee" && (
                      <th
                        onClick={() => handleSort("sale_cost")}
                        className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                      >
                        Sale Price {getSortSymbol("sale_cost")}
                      </th>
                    )}

                    {/* ACTIONS */}
                    <th className="w-[150px] px-4 py-4 text-center text-xs uppercase tracking-wider font-bold text-indigo-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={12} className="py-12">
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
                      <td colSpan={12} className="text-center py-14">
                        <p className="text-gray-500">No licenses found</p>
                      </td>
                    </tr>
                  ) : (
                    licenses?.map((license) => (
                      <tr
                        key={license.license_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      >
                        <td className="px-4 py-4 text-sm font-semibold text-[#1E1B4B]">
                          {license.client_name}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {`${license?.location_details?.address_line_one || "NA"}`}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {license.quantity}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {license.manufacturer}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600">
                          {license.license_type}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatDateToMDY(license.start_date) || ""}
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                          {formatDateToMDY(license.expiration_date) || ""}
                        </td>

                        {access.includes(user_type) && (
                          <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {formatCurrency(license.idr_cost)}
                          </td>
                        )}

                        {user_type !== "IDR Employee" && (
                          <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                            {formatCurrency(license.sale_cost)}
                          </td>
                        )}

                        {/* ACTIONS */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* EDIT */}
                            <button
                              onClick={() => handleEdit(license.license_id)}
                              className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                            >
                              <BiSolidEditAlt size={18} />
                            </button>

                            {/* DELETE */}
                            {user_type === "Admin" && (
                              <button
                                onClick={() =>
                                  handleDeleteLicense(license.license_id)
                                }
                                className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all duration-300"
                              >
                                <AiFillDelete size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLicenseList;
