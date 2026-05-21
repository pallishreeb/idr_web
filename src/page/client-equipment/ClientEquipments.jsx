import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import * as XLSX from 'xlsx';
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import {
  getClientEquipments,
  retireClientEquipment,
} from "../../actions/clientEquipment";
import { clearClientEquipments } from "../../reducers/clientEquipmentSlice";


const ClientEquipments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const equipments = useSelector((state) => state.clientEquipment.equipments);
  const loadingEquipments = useSelector(
    (state) => state.clientEquipment.loading
  );
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const { user_type , client_type, locations: userLocations} = useSelector((state) => state.user.user);
  const { access ,technicianAccess, clientAccess} = useSelector((state) => state.user);
  // Component state
  const [selectedClient, setSelectedClient] = useState(searchParams.get('client') || null);
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || null);
  const [filters, setFilters] = useState({
    model: searchParams.get('model') || "",
    device_type: searchParams.get('device_type') || "",
    status: searchParams.get('status') || "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: searchParams.get('sort_key') || "device_type",
    direction: searchParams.get('sort_direction') || "ASC"
  });

  const [decommissionModal, setDecommissionModal] = useState({
    show: false,
    equipmentId: null,
    reason: "",
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedClient) params.set('client', selectedClient);
    if (selectedLocation) params.set('location', selectedLocation);
    if (filters.model) params.set('model', filters.model);
    if (filters.device_type) params.set('device_type', filters.device_type);
    if (filters.status) params.set('status', filters.status);
    if (sortConfig.key) params.set('sort_key', sortConfig.key);
    if (sortConfig.direction) params.set('sort_direction', sortConfig.direction);
    
    setSearchParams(params);
  }, [selectedClient, selectedLocation, filters, sortConfig, setSearchParams]);

  // Reset client and location when unmounting or navigating back
  useEffect(() => {
    if (selectedClient == null) {
      dispatch(clearClientEquipments(selectedClient));
    }
  }, [selectedClient, dispatch]);
  // Fetch clients on component mount
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

useEffect(() => {
  if (user_type !== "Client Employee" && selectedClient) {
    dispatch(getLocationByClient(selectedClient));
  }
}, [dispatch, selectedClient, user_type]);

// Fetch equipments only for Client Employee on mount
useEffect(() => {
  if (user_type === "Client Employee") {
    fetchEquipments();
  }
}, [user_type]);


useEffect(() => {
  if (user_type === "Client Employee") {
    fetchEquipments();
  }
}, [
  filters,
  selectedLocation,
  sortConfig,
  user_type,
]);

  const fetchEquipments = (sorting = {}) => {
    const { model, device_type, status } = filters;

    if (user_type !== "Client Employee" && (!selectedClient || !selectedLocation)) {
      Swal.fire("Client and Location are required to fetch equipments");
      return;
    }

    const params = {
      client_id: selectedClient,
      location_id: selectedLocation,
      model: model || undefined,
      device_type: device_type || undefined,
      status: status || undefined,
      user_type,
      sort_by: sorting.sort_by || sortConfig.key, // Ensure sort_by is passed
      order_by: sorting.order_by || sortConfig.direction, // Ensure order_by is passed
    };

    dispatch(getClientEquipments(params));
  };
  

const handleClientChange = (
  clientId,
) => {
  setSelectedClient(clientId);
  setSelectedLocation(null);

  dispatch(
    clearClientEquipments(),
  );
};
const handleLocationChange = (
  locationId,
) => {
  setSelectedLocation(locationId);

  dispatch(
    clearClientEquipments(),
  );
};
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

const handleSearch = () => {
  fetchEquipments({
    sort_by: sortConfig.key || "device_type",
    order_by:
      sortConfig.direction || "ASC",
  });
};

const handleReset = () => {
  // RESET FILTERS
  const resetFilters = {
    model: "",
    device_type: "",
    status: "",
  };

  setFilters(resetFilters);

  // RESET SORTING
  const resetSort = {
    key: "device_type",
    direction: "ASC",
  };

  setSortConfig(resetSort);

  // RESET CLIENT/LOCATION
  if (user_type === "Client Employee") {
    setSelectedLocation(null);
  } else {
    setSelectedClient(null);
    setSelectedLocation(null);
  }

  // CLEAR URL PARAMS
  setSearchParams({});

  // CLEAR EXISTING EQUIPMENTS
  dispatch(clearClientEquipments());

  // REFETCH FOR CLIENT EMPLOYEE
  if (user_type === "Client Employee") {
    dispatch(
      getClientEquipments({
        client_id: undefined,
        location_id: undefined,
        model: undefined,
        device_type: undefined,
        status: undefined,
        user_type,
        sort_by: "device_type",
        order_by: "ASC",
      }),
    );
  }
};

  const handleEdit = (equipmentId) => {
    navigate(`/edit-client-equipment/${equipmentId}?${searchParams.toString()}`);
  };

  const openDecommissionModal = (equipmentId) => {
    setDecommissionModal({
      show: true,
      equipmentId,
      reason: "",
    });
  };

  const closeDecommissionModal = () => {
    setDecommissionModal({
      show: false,
      equipmentId: null,
      reason: "",
    });
  };
  const equipment = equipments?.find(
    (item) => item?.client_equipment_id === decommissionModal?.equipmentId
  );

  const buttonText = equipment
    ? equipment.is_deleted
      ? "Reactivate"
      : "Decommission"
    : "Not Found";
  const handleDecommission = async () => {
    const specificEquipment = equipments?.find(
      (item) => item.client_equipment_id === decommissionModal.equipmentId
    );
    const payload = {
      id: decommissionModal.equipmentId,
      isDecomission: !specificEquipment.is_deleted, // true or false
      decomission_reason: decommissionModal.reason,
    };

    try {
      // Dispatch the action to decommission equipment
      await dispatch(retireClientEquipment(payload));
      // Close the modal
      closeDecommissionModal();
      // Re-fetch the updated equipment list
      fetchEquipments();
    } catch (error) {
      console.error("Failed to update equipment:", error);
      Swal.fire(
        "Error",
        "Failed to update equipment. Please try again.",
        "error"
      );
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevSortConfig) => {
      const direction = prevSortConfig.key === key && prevSortConfig.direction === "ASC" ? "DESC" : "ASC";
      const updatedSort = { key, direction };
      fetchEquipments({ sort_by: key, order_by: direction }); // Call with updated sort values
      return updatedSort;
    });
  };
  

const getSortSymbol = (key) => {
  if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
  }
  return "↕";
};


  const newLocal = (
    <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 w-[80%]">
        {clientAccess?.includes(client_type) && userLocations?.length > 0 && (
  <div className="flex flex-col gap-2">
    <label htmlFor="location" className="text-sm font-medium">
      Select Location
    </label>
    <select
      id="location"
      className="border border-gray-300 rounded px-3 py-1 w-full"
      value={selectedLocation || ""}
      onChange={(e) => {
        handleLocationChange(e.target.value);
      }}
    >
      <option value="">Select a location</option>
      {loadingLocations ? (
        <option value="" disabled>
          Loading...
        </option>
      ) : (
        // Sort locations alphabetically by address
        [...userLocations]
          .sort((a, b) => {
            const addressA = `${a.address_line_one} ${a.address_line_two}`.toLowerCase();
            const addressB = `${b.address_line_one} ${b.address_line_two}`.toLowerCase();
            return addressA.localeCompare(addressB);
          })
          .map((location) => (
            <option key={location.location_id} value={location.location_id}>
              {location.address_line_one} {location.address_line_two}
            </option>
          ))
      )}
    </select>
  </div>
)}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Device Type</label>
            <input
              type="text"
              name="device_type"
              value={filters.device_type}
              onChange={handleFilterChange}
              className="px-3 border border-gray-200 h-10 rounded"
              placeholder="Enter device type"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Model</label>
            <input
              type="text"
              name="model"
              value={filters.model}
              onChange={handleFilterChange}
              className="px-3 border border-gray-200 h-10 rounded"
              placeholder="Enter model"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="px-3 border border-gray-200 h-10 rounded"
            >
              {/* <option value="">All</option> */}
              <option value="">
                  All
                </option>

                <option value="false">
                  Active
                </option>

                <option value="true">
                  Retired
                </option>
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">&nbsp;</label>
            <button
              className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">&nbsp;</label>
            <button
              className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const handleExportToExcel = () => {
    if (!equipments || equipments.length === 0) {
      Swal.fire("No Data", "There is no data to export", "info");
      return;
    }

    // Prepare the data for export with all requested fields
    const exportData = equipments.map(equipment => ({
      'Device Type': equipment.device_type || '',
      'Device ID': equipment.device_id || '',
      'Manufacturer': equipment.manufacturer || '',
      'Model': equipment.model || '',
      'Serial Number': equipment.serial_number || '',
      'MAC Address': equipment.mac_address || '',
      'LAN IP Address': equipment.lan_ip_address || '',
      'WAN IP Address': equipment.wan_ip_address || '',
      'Device Location': equipment.device_location || '',
      'Username': equipment.username || '',
      'Password': equipment.password || '',
      'General Info': equipment.general_info || '',
      'Status': equipment.is_deleted ? 'Retired' : 'Active'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Client Equipments');

    // Generate file name with current date
    const fileName = `client_equipments_${new Date().toISOString().split('T')[0]}.csv`;

    // Save the file as CSV
    XLSX.writeFile(wb, fileName, { bookType: 'csv' });
  };

  const handleDownloadCSVTemplate = () => {
    const link = document.createElement("a");
    link.href = "/sample_devices.csv";
    link.setAttribute("download", "sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        {/* MAIN CONTAINER */}
<div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-8">
  {/* PAGE HEADER */}
  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
    <div>
      <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
        Client Equipments
      </h1>

      <p className="text-gray-500 mt-1">
        Manage, filter and monitor client devices
      </p>
    </div>

    {/* ACTION BUTTONS */}
    <div className="flex flex-wrap gap-3">
      {technicianAccess.includes(user_type) && (
        <button
          className="px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm"
          onClick={handleDownloadCSVTemplate}
        >
          CSV Template
        </button>
      )}

      {technicianAccess.includes(user_type) && (
        <button
          onClick={handleExportToExcel}
          className="px-5 py-3 rounded-2xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-all duration-300 shadow-md"
        >
          Export CSV
        </button>
      )}

      {technicianAccess.includes(user_type) && (
        <Link
          to={`/add-client-equipment/${selectedClient}/${selectedLocation}?${searchParams.toString()}`}
        >
          <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
            Add Equipment
          </button>
        </Link>
      )}
    </div>
  </div>

  {/* CLIENT FILTERS */}
  {technicianAccess.includes(user_type) && (
    <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

        <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
          Client & Location
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CLIENT */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
            Select Client
          </label>

          <select
            id="client"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            value={selectedClient || ""}
            onChange={(e) =>
              handleClientChange(
                e.target.value,
              )
            }
          >
            <option value="">
              Select a client
            </option>

            {loadingClients ? (
              <option disabled>
                Loading...
              </option>
            ) : (
              [...(clients?.data || [])]
                .sort((a, b) =>
                  (
                    a.company_name || ""
                  ).localeCompare(
                    b.company_name || "",
                  ),
                )
                .map((client) => (
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
                ))
            )}
          </select>
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
            Select Location
          </label>

          <select
            id="location"
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            value={
              selectedLocation || ""
            }
            onChange={(e) =>
              handleLocationChange(
                e.target.value,
              )
            }
            disabled={!selectedClient}
          >
            <option value="">
              Select a location
            </option>

            {loadingLocations ? (
              <option disabled>
                Loading...
              </option>
            ) : (
              [...(locations || [])]
                .sort((a, b) => {
                  const addressA =
                    `${a.address_line_one || ""} ${a.address_line_two || ""}`.toLowerCase();

                  const addressB =
                    `${b.address_line_one || ""} ${b.address_line_two || ""}`.toLowerCase();

                  return addressA.localeCompare(
                    addressB,
                  );
                })
                .map((location) => (
                  <option
                    key={
                      location.location_id
                    }
                    value={
                      location.location_id
                    }
                  >
                    {
                      location.address_line_one
                    }{" "}
                    {
                      location.address_line_two
                    }
                  </option>
                ))
            )}
          </select>
        </div>
      </div>
    </div>
  )}

  {/* SEARCH FILTER CARD */}
  <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 mb-6">
    <div className="flex items-center gap-2 mb-5">
      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

      <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
        Equipment Filters
      </h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
      {/* LOCATION FOR CLIENT EMPLOYEE */}
      {clientAccess?.includes(
        client_type,
      ) &&
        userLocations?.length >
          0 && (
          <div>
            <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
              Location
            </label>

            <select
              id="location"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
              value={
                selectedLocation ||
                ""
              }
              onChange={(e) =>
                handleLocationChange(
                  e.target.value,
                )
              }
            >
              <option value="">
                Select location
              </option>

              {loadingLocations ? (
                <option disabled>
                  Loading...
                </option>
              ) : (
                [...userLocations]
                  .sort((a, b) => {
                    const addressA =
                      `${a.address_line_one} ${a.address_line_two}`.toLowerCase();

                    const addressB =
                      `${b.address_line_one} ${b.address_line_two}`.toLowerCase();

                    return addressA.localeCompare(
                      addressB,
                    );
                  })
                  .map((location) => (
                    <option
                      key={
                        location.location_id
                      }
                      value={
                        location.location_id
                      }
                    >
                      {
                        location.address_line_one
                      }{" "}
                      {
                        location.address_line_two
                      }
                    </option>
                  ))
              )}
            </select>
          </div>
        )}

      {/* DEVICE TYPE */}
      <div>
        <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
          Device Type
        </label>

        <input
          type="text"
          name="device_type"
          value={
            filters.device_type
          }
          onChange={
            handleFilterChange
          }
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
          placeholder="Enter device type"
        />
      </div>

      {/* MODEL */}
      <div>
        <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
          Model
        </label>

        <input
          type="text"
          name="model"
          value={filters.model}
          onChange={
            handleFilterChange
          }
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
          placeholder="Enter model"
        />
      </div>

      {/* STATUS */}
      <div>
        <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
          Status
        </label>

        <select
          name="status"
          value={filters.status}
          onChange={
            handleFilterChange
          }
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
        >
          <option value="false">
            Active
          </option>

          <option value="true">
            Retired
          </option>
        </select>
      </div>

      {/* SEARCH */}
      <div className="flex items-end">
        <button
          className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* RESET */}
      <div className="flex items-end">
        <button
          className="w-full px-4 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  </div>

  {/* TABLE CARD */}
  {loadingEquipments ? (
    <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-10 text-center text-gray-500">
      Loading equipments...
    </div>
  ) : (
    <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
      {/* TOP BAR */}
      <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[#1E1B4B]">
            Equipment List
          </h2>

          <p className="text-sm text-gray-500">
            Total Equipments:{" "}
            {equipments?.length || 0}
          </p>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto xl:overflow-x-hidden">
        <table className="w-full table-auto">
          <thead className="bg-indigo-50">
            <tr>
              {[
                {
                  key: "device_type",
                  label:
                    "Device Type",
                },

                {
                  key: "device_id",
                  label: "Device ID",
                },

                {
                  key: "manufacturer",
                  label: "Make",
                },

                {
                  key: "model",
                  label: "Model",
                },

                {
                  key: "serial_number",
                  label: "Serial",
                },
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() =>
                    handleSort(
                      column.key,
                    )
                  }
                  className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-1">
                    {column.label}

                    <span>
                      {getSortSymbol(
                        column.key,
                      )}
                    </span>
                  </div>
                </th>
              ))}

              <th className="w-[220px] px-4 py-4 text-center text-xs uppercase tracking-wider font-bold text-indigo-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {equipments?.length ===
            0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-14"
                >
                  <img
                    src="not-found.png"
                    alt="No Equipments"
                    className="mx-auto w-40 h-40 opacity-70"
                  />

                  <p className="text-gray-500 mt-4">
                    No Equipments Found
                  </p>
                </td>
              </tr>
            ) : (
              equipments?.map(
                (equipment) => (
                  <tr
                    key={
                      equipment.client_equipment_id
                    }
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                  >
                    <td className="px-4 py-4 font-semibold text-[#1E1B4B]">
                      {
                        equipment.device_type
                      }
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {
                        equipment.device_id
                      }
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {
                        equipment.manufacturer
                      }
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {
                        equipment.model
                      }
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {
                        equipment.serial_number
                      }
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4 w-[220px]">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {/* EDIT */}
                        <button
                          onClick={() =>
                            handleEdit(
                              equipment.client_equipment_id,
                            )
                          }
                          className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                        >
                          <BiSolidEditAlt size={18} />
                        </button>

                        {/* DECOMMISSION / REACTIVATE */}
                        {technicianAccess.includes(
                          user_type,
                        ) && (
                          <>
                            {equipment?.is_deleted ===
                            true ? (
                              <button
                                onClick={() =>
                                  openDecommissionModal(
                                    equipment.client_equipment_id,
                                  )
                                }
                                className="w-10 h-10 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 flex items-center justify-center transition-all duration-300"
                                title="Reactivate Equipment"
                              >
                                <AiFillCheckCircle size={18} />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  openDecommissionModal(
                                    equipment.client_equipment_id,
                                  )
                                }
                                className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all duration-300"
                                title="Decommission Equipment"
                              >
                                <AiFillDelete size={18} />
                              </button>
                            )}
                          </>
                        )}

                        {/* RMA */}
                        <button
                          onClick={() =>
                            navigate(
                              `/add-device-rma/${equipment.client_equipment_id}`,
                              {
                                state:
                                  {
                                    clientId:
                                      selectedClient,
                                    locationId:
                                      selectedLocation,
                                    type: "decommission",
                                  },
                              },
                            )
                          }
                          className="px-3 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all duration-300"
                        >
                          RMA
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )}

  {/* MODAL */}
  {decommissionModal.show && (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-lg overflow-hidden">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-8">
          <h3 className="text-2xl font-bold text-[#1E1B4B] mb-2">
            {buttonText} Equipment
          </h3>

          <p className="text-gray-500 mb-6">
            Add a reason for this
            action (optional)
          </p>

          <textarea
            name="reason"
            value={
              decommissionModal.reason
            }
            onChange={(e) =>
              setDecommissionModal(
                (prev) => ({
                  ...prev,
                  reason:
                    e.target.value,
                }),
              )
            }
            className="w-full rounded-2xl border border-gray-200 p-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            placeholder="Enter reason..."
            rows={5}
          />

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={
                closeDecommissionModal
              }
              className="px-5 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
            >
              Cancel
            </button>

            <button
              onClick={
                handleDecommission
              }
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
      </div>
    </>
  );
};

export default ClientEquipments;
