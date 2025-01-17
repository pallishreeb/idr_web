import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillCheckCircle, AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link, useNavigate } from "react-router-dom";
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

  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const equipments = useSelector((state) => state.clientEquipment.equipments);
  const loadingEquipments = useSelector(
    (state) => state.clientEquipment.loading
  );
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const { user_type } = useSelector((state) => state.user.user);
  const { technicianAccess, access } = useSelector((state) => state.user);
  // Component state
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filters, setFilters] = useState({
    model: "",
    device_type: "",
    status: "",
  });
  const [decommissionModal, setDecommissionModal] = useState({
    show: false,
    equipmentId: null,
    reason: "",
  });

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

  // Fetch locations and equipments when client or location changes
  // useEffect(() => {
  //   if (selectedClient) {
  //     dispatch(getLocationByClient(selectedClient));
  //     if (selectedLocation) {
  //       fetchEquipments();
  //     }
  //   }
  // }, [dispatch, selectedClient, selectedLocation]);
  // Fetch locations and equipments when client or location changes
  useEffect(() => {
    if (user_type === "Client Employee") {
      // console.log("user_type",user_type === "Client Employee")
      // Call fetchEquipments without any parameters if user_type is Client Employee
      fetchEquipments();
    } else if (selectedClient) {
      dispatch(getLocationByClient(selectedClient));
      if (selectedLocation) {
        fetchEquipments(selectedLocation); // Call fetchEquipments with parameters
      }
    }
  }, [dispatch, selectedClient, selectedLocation, user_type]);

  const fetchEquipments = () => {
    const { model, device_type, status } = filters;
    if (
      user_type !== "Client Employee" &&
      (!selectedClient || !selectedLocation)
    ) {
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
    };
    dispatch(getClientEquipments(params));
  };

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
    setSelectedLocation(null); // Reset location when client changes
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
    // setSelectedLocation(null);
    // setSelectedClient(null)
    if (selectedClient) fetchEquipments(); // Fetch default list
  };

  const handleEdit = (equipmentId) => {
    navigate(`/edit-client-equipment/${equipmentId}`);
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
      ? "Activate"
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

  const newLocal = (
    <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 w-[70%]">
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
              <option value="">All</option>
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
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">Client Equipments</h1>
            {technicianAccess.includes(user_type) && (
              <div className="flex gap-2">
                <Link
                  to={`/add-client-equipment/${selectedClient}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded flex-end"
                  disabled={!selectedClient}
                >
                  Add New Equipment
                </Link>
              </div>
            )}
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
                  value={selectedClient}
                  onChange={(e) => handleClientChange(e.target.value)}
                >
                  <option value="">Select a client</option>
                  {loadingClients ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    clients?.data?.map((client) => (
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
                  value={selectedLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  disabled={!selectedClient}
                >
                  <option value="">Select a location</option>
                  {loadingLocations ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    locations?.map((location) => (
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
                  <th className="border px-4 py-2">Device Type</th>
                  <th className="border px-4 py-2">Device ID</th>
                  <th className="border px-4 py-2">Make</th>
                  <th className="border px-4 py-2">Model</th>
                  <th className="border px-4 py-2">Serial</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {equipments?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
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

                        {access.includes(user_type) && (
                          <>
                            {equipment?.is_deleted === true ? (
                              <button
                                onClick={() =>
                                  openDecommissionModal(
                                    equipment.client_equipment_id
                                  )
                                }
                                className="p-2 bg-gray-100"
                              >
                                <AiFillCheckCircle />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  openDecommissionModal(
                                    equipment.client_equipment_id
                                  )
                                }
                                className="p-2 bg-gray-100"
                              >
                                <AiFillDelete />
                              </button>
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
                  Decommission Equipment
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
