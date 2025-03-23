import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getClientEquipmentById, updateClientEquipment } from "../../actions/clientEquipment"; // Actions to fetch and update client equipment
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

const EditClientEquipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientEquipmentId } = useParams(); // Get client equipment ID from route params
  const [searchParams] = useSearchParams();

  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const loadingEquipmentDetails = useSelector((state) => state.clientEquipment.loadingDetails);
  const loading = useSelector((state) => state.clientEquipment.loading);
  const [clientEquipmentNotes, setClientEquipmentNotes] = useState([]);
  const { user_type } = useSelector((state) => state.user.user);
  const { technicianAccess } = useSelector((state) => state.user);
  // State for form data
  const [clientEquipment, setClientEquipment] = useState({
    client_equipment_id:clientEquipmentId,
    client_id: "",
    client_name: "",
    location_id: "",
    device_type: "",
    device_id: "",
    manufacturer: "",
    model: "",
    serial_number: "",
    mac_address: "", // Optional
    lan_ip_address: "", // Optional
    wan_ip_address: "", // Optional
    general_info: "", // Optional
    decomission_reason:"",
    is_deleted:false
  });

  // Fetch clients when the component mounts
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  // Fetch client equipment details using clientEquipmentId
  useEffect(() => {
    if (clientEquipmentId) {
      dispatch(getClientEquipmentById(clientEquipmentId)).then((data) => {
        if (data) {
          setClientEquipment({
            client_equipment_id:clientEquipmentId,
            client_id: data.client_id || "",
            client_name: data.client_name || "",
            location_id: data.location_id || "",
            device_type: data.device_type || "",
            device_id: data.device_id || "",
            manufacturer: data.manufacturer || "",
            model: data.model || "",
            serial_number: data.serial_number || "",
            mac_address: data.mac_address || "",
            lan_ip_address: data.lan_ip_address || "",
            wan_ip_address: data.wan_ip_address || "",
            general_info: data.general_info || "",
            decomission_reason:data?.decomission_reason || "",
            is_deleted:data?.is_deleted
          });
            setClientEquipmentNotes(data?.client_equip_histories || [])
          if (data.client_id) {
            dispatch(getLocationByClient(data.client_id));
          }
        }
      });
    }
  }, [dispatch, clientEquipmentId]);

  // Fetch locations based on client_id
  useEffect(() => {
    if (clientEquipment.client_id) {
      dispatch(getLocationByClient(clientEquipment.client_id));
    }
  }, [dispatch, clientEquipment.client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientEquipment((prev) => ({ ...prev, [name]: value }));

    if (name === "client_id") {
      const selectedClient = clients?.data?.find((client) => client.client_id === value);
      if (selectedClient) {
        setClientEquipment((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }
      dispatch(getLocationByClient(value));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Create a copy of clientEquipment without decomission_reason
    const { decomission_reason, is_deleted, ...updatePayload } = clientEquipment;
    dispatch(updateClientEquipment(updatePayload, navigate));
  };

  const handleBack = () => {
    navigate(`/client-equipments?${searchParams.toString()}`);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Edit Client Device</h2>
            {loadingEquipmentDetails ? (
              <p>Loading equipment details...</p>
            ) : (
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col mb-4">
                    <label htmlFor="client_id" className="mr-2">
                      Select Client:
                    </label>
                    <select
                      id="client_id"
                      name="client_id"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={clientEquipment.client_id}
                      onChange={handleChange}
                      required
                      disabled
                    >
                      <option value="">Select a client</option>
                      {loadingClients ? (
                        <option value="" disabled>
                          Loading...
                        </option>
                      ) : (
                        clients?.data?.map((client) => (
                          <option
                            key={client.client_id}
                            value={client.client_id}
                          >
                            {client.company_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label htmlFor="location_id" className="mr-2">
                      Select Location:
                    </label>
                    <select
                      id="location_id"
                      name="location_id"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={clientEquipment.location_id}
                      onChange={handleChange}
                      // disabled={!clientEquipment.client_id}
                      disabled
                    >
                      <option value="">Select a location</option>
                      {loadingLocations ? (
                        <option value="" disabled>
                          Loading...
                        </option>
                      ) : (
                        clientLocations?.map((location) => (
                          <option
                            key={location.location_id}
                            value={location.location_id}
                          >
                            {location.address_line_one}{" "}
                            {location.address_line_two}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* Device Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="device_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Device Type*
                    </label>
                    <input
                      type="text"
                      name="device_type"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.device_type}
                      onChange={handleChange}
                      required
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="device_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Device ID(Hostname)*
                    </label>
                    <input
                      type="text"
                      name="device_id"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.device_id}
                      onChange={handleChange}
                      required
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="manufacturer"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Manufacturer*
                    </label>
                    <input
                      type="text"
                      name="manufacturer"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.manufacturer}
                      onChange={handleChange}
                      required
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="model"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Model
                    </label>
                    <input
                      type="text"
                      name="model"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.model}
                      onChange={handleChange}
                      required
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="serial_number"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Serial Number*
                    </label>
                    <input
                      type="text"
                      name="serial_number"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.serial_number}
                      onChange={handleChange}
                      required
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                </div>

                {/* Optional Details */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="mac_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      MAC Address
                    </label>
                    <input
                      type="text"
                      name="mac_address"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.mac_address}
                      onChange={handleChange}
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lan_ip_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      LAN IP Address
                    </label>
                    <input
                      type="text"
                      name="lan_ip_address"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.lan_ip_address}
                      onChange={handleChange}
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="wan_ip_address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      WAN IP Address
                    </label>
                    <input
                      type="text"
                      name="wan_ip_address"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.wan_ip_address}
                      onChange={handleChange}
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                </div>

                {/* General Notes */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="general_info"
                      className="block text-sm font-medium text-gray-700"
                    >
                      General Device Information
                    </label>
                    <textarea
                      name="general_info"
                      rows={5}
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={clientEquipment.general_info}
                      onChange={handleChange}
                      readOnly={user_type === "Client Employee"}
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  {technicianAccess.includes(user_type) && (
                    <button
                      type="submit"
                      className="bg-indigo-700 text-white px-4 py-2 rounded"
                    >
                      {loading ? "Updating..." : "Update Client Device"}
                    </button>
                  )}
                  <button
                    onClick={handleBack}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* {decomission_reason} */}

          {clientEquipment?.decomission_reason !== "" && (
            <>
              <h2 className="text-xl font-semibold mb-2">
                {clientEquipment?.is_deleted === true
                  ? "Decommission Reason"
                  : "Re-activation Reason"}
              </h2>
              <p className="text-gray-600 mb-4">
                {clientEquipment?.decomission_reason}
              </p>
            </>
          )}

          {/* Table for notes */}
          {clientEquipmentNotes?.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-200 border rounded">
                <thead>
                  <tr className="bg-gray-300 text-left">
                    <th className="border px-4 py-2" style={{ width: "65%" }}>
                      Notes
                    </th>
                    <th className="border px-4 py-2" style={{ width: "15%" }}>
                      User Name
                    </th>
                    <th className="border px-4 py-2" style={{ width: "15%" }}>
                      Date and Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientEquipmentNotes?.map((note, index) => (
                    <tr key={note.note_id} className="bg-white text-sm">
                      <td className="border px-4 py-2" style={{ width: "60%" }}>
                        <textarea
                          className="px-2 py-2 border text-sm border-gray-200 resize-y rounded w-full"
                          name="comments"
                          value={note.comments || ""}
                          rows={3}
                        ></textarea>
                      </td>
                      <td className="border px-4 py-2" style={{ width: "15%" }}>
                        {note?.user_name || "NA"}
                      </td>
                      <td className="border px-4 py-2" style={{ width: "15%" }}>
                        {new Date(note.created_at).toLocaleString("en-US", {
                          timeZone: "America/New_York",
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: true,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditClientEquipment;
