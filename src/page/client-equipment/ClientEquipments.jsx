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
  if (user_type === "Client Employee" &&
      !filters.model &&
      !filters.device_type &&
      !filters.status &&
      !selectedClient &&
      !selectedLocation &&
      !sortConfig.key
  ) {
    fetchEquipments();
  }
}, [filters, selectedClient, selectedLocation, sortConfig, user_type]);

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
  

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
    setSelectedLocation(null);
  };

  const handleLocationChange = (locationId) => {
    setSelectedLocation(locationId);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    fetchEquipments();
  };

  const handleReset = () => {
    
    setFilters({
      model: "",
      device_type: "",
      status: "",
    });
    setSelectedClient(null);
    setSelectedLocation(null);
    setSortConfig({ key: "", direction: "ASC" });
    setSearchParams({});
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
              <option value="false">Active</option>
              <option value="true">Retired</option>
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
        <div className="container mx-auto p-4 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">Client Equipment</h1>
            <div className="flex gap-2">
            {technicianAccess.includes(user_type) && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleDownloadCSVTemplate}
              >
              CSV Template
              </button>
              )}
            {technicianAccess.includes(user_type) && (
              <button
                onClick={handleExportToExcel}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Export to CSV
              </button>
              )}
              {technicianAccess.includes(user_type) && (
                <Link
                  to={`/add-client-equipment/${selectedClient}/${selectedLocation}?${searchParams.toString()}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded flex-end"
                  disabled={!selectedClient}
                >
                  Add New Equipment
                </Link>
              )}
            </div>
          </div>

          {/* Client and Location Filters */}
          {technicianAccess.includes(user_type) && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label htmlFor="client" className="text-sm font-medium">
                  Select Client
                </label>
                <select
                  id="client"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={selectedClient || ""}
                  onChange={(e) => handleClientChange(e.target.value)}
                >
                  <option value="">Select a client</option>
                  {loadingClients ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    // Sort clients alphabetically by company name
                    [...(clients?.data || [])]
                      .sort((a, b) => {
                        const nameA = (a.company_name || '').toLowerCase();
                        const nameB = (b.company_name || '').toLowerCase();
                        return nameA.localeCompare(nameB);
                      })
                      .map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </option>
                      ))
                  )}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="location" className="text-sm font-medium">
                  Select Location
                </label>
                <select
                  id="location"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={selectedLocation || ""}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  disabled={!selectedClient}
                >
                  <option value="">Select a location</option>
                  {loadingLocations ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    // Sort locations alphabetically by address
                    [...(locations || [])]
                      .sort((a, b) => {
                        const addressA = `${a.address_line_one || ''} ${a.address_line_two || ''}`.toLowerCase();
                        const addressB = `${b.address_line_one || ''} ${b.address_line_two || ''}`.toLowerCase();
                        return addressA.localeCompare(addressB);
                      })
                      .map((location) => (
                        <option
                          key={location.location_id}
                          value={location.location_id}
                        >
                          {location.address_line_one} {location.address_line_two}
                        </option>
                      ))
                  )}
                </select>
              </div>
            </div>
          )}

          {/* Filters */}
          {newLocal}

          {/* Equipment Table */}
          {loadingEquipments ? (
            <p>Loading equipments...</p>
          ) : (
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2" onClick={() => handleSort("device_type")}>Device Type
                  <span className="ml-1">{getSortSymbol("device_type")}</span>
                  </th>
                  <th className="border px-4 py-2" onClick={() => handleSort("device_id")}>Device ID
                  <span className="ml-1">{getSortSymbol("device_id")}</span>
                  </th>
                  <th className="border px-4 py-2" onClick={() => handleSort("manufacturer")}>Make
                  <span className="ml-1">{getSortSymbol("manufacturer")}</span>
                  </th>
                  <th className="border px-4 py-2" onClick={() => handleSort("model")}>Model
                  <span className="ml-1">{getSortSymbol("model")}</span>
                  </th>
                  <th className="border px-4 py-2" onClick={() => handleSort("serial_number")}>Serial
                  <span className="ml-1">{getSortSymbol("serial_number")}</span>
                  </th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipments?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No Equipments Found
                    </td>
                  </tr>
                ) : (
                  equipments?.map((equipment) => (
                    <tr key={equipment.client_equipment_id}>
                      <td className="border px-4 py-2">
                        {equipment.device_type}
                      </td>
                      <td className="border px-4 py-2">
                        {equipment.device_id}
                      </td>
                      <td className="border px-4 py-2">
                        {equipment.manufacturer}
                      </td>
                      <td className="border px-4 py-2">{equipment.model}</td>
                      <td className="border px-4 py-2">
                        {equipment.serial_number}
                      </td>
                      <td className="border px-4 py-2 flex gap-2">
                        <button
                          onClick={() =>
                            handleEdit(equipment.client_equipment_id)
                          }
                          className="p-2 bg-gray-100"
                        >
                          <BiSolidEditAlt />
                        </button>

                        {technicianAccess.includes(user_type) && (
                     <>
                     {equipment?.is_deleted === true ? (
                       <div className="relative group">
                         <button
                           onClick={() => openDecommissionModal(equipment.client_equipment_id)}
                           className="p-2 bg-gray-100"
                         >
                           <AiFillCheckCircle />
                         </button>
                         <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
                           Reactivate Equipment
                         </span>
                       </div>
                     ) : (
                       <div className="relative group">
                         <button
                           onClick={() => openDecommissionModal(equipment.client_equipment_id)}
                           className="p-2 bg-gray-100"
                         >
                           <AiFillDelete />
                         </button>
                         <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
                           Decommission Equipment
                         </span>
                       </div>
                     )}
                   </>
                   
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* Decommission Modal */}
          {decommissionModal.show && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white rounded p-6 w-1/3">
                <h3 className="text-lg font-semibold mb-4">
                {buttonText} Equipment
                </h3>
                <textarea
                  name="reason"
                  value={decommissionModal.reason}
                  onChange={(e) =>
                    setDecommissionModal((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="border border-gray-300 rounded w-full p-2 mb-4"
                  placeholder="Enter reason (optional)"
                  rows={4}
                ></textarea>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={closeDecommissionModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDecommission}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    {buttonText}
                  </button>
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
