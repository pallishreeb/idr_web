import React, { useState, useEffect, useRef } from "react"; // Add useRef
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { addClientEquipment, addEquipmentThroughCsv } from "../../actions/clientEquipment";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";

const AddClientEquipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientId, locationId } = useParams();
  const [searchParams] = useSearchParams();

  // Redux state selectors
  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const loading = useSelector((state) => state.clientEquipment.loading);

  // State for form data
  const [clientEquipment, setClientEquipment] = useState({
    client_id: clientId && clientId !== "null" ? clientId : "",
    client_name: "",
    location_id: locationId && locationId !== "null" ? locationId : "",
    device_type: "",
    device_id: "",
    manufacturer: "",
    model: "",
    serial_number: "",
    mac_address: "", // Optional
    lan_ip_address: "", // Optional
    wan_ip_address: "", // Optional
    general_info: "", // Optional
    device_location:"",// Optional
    username:"",// Optional
    password:"",// Optional
  });

  const [file, setFile] = useState(null);
  const [showCsvUpload, setShowCsvUpload] = useState(false); // State to toggle CSV upload view

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // Fetch clients when the component mounts
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  // Fetch locations based on client_id
  useEffect(() => {
    if (clientEquipment?.client_id) {
      dispatch(getLocationByClient(clientEquipment?.client_id));
    }
  }, [dispatch, clientEquipment?.client_id]);

  // Set `client_name` when `client_id` and clients data are available
  useEffect(() => {
    if (clientId && clients?.data?.length) {
      const selectedClient = clients.data.find((client) => client.client_id === clientId);
      if (selectedClient) {
        setClientEquipment((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }
    }
  }, [clientId, clients]);

  // Pre-select location if locationId is provided
  useEffect(() => {
    if (locationId && clientLocations?.length) {
      const selectedLocation = clientLocations.find(
        (location) => location.location_id === locationId
      );
      if (selectedLocation) {
        setClientEquipment((prev) => ({
          ...prev,
          location_id: selectedLocation.location_id,
        }));
      }
    }
  }, [locationId, clientLocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientEquipment((prev) => ({ ...prev, [name]: value }));

    if (name === "client_id") {
      const selectedClient = clients?.data?.find((client) => client.client_id === value);
      if (selectedClient) {
        setClientEquipment((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
          location_id: "", // Reset location when client changes
        }));
      }
      dispatch(getLocationByClient(value));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      setFile(file);
      console.log("Selected File:", file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (file) {
      // If a file is present, use the CSV action
      const formData = new FormData();
      formData.append("client_id", clientEquipment.client_id);
      formData.append("client_name", clientEquipment.client_name);
      formData.append("location_id", clientEquipment.location_id);
      formData.append("csv", file); // Append the CSV file

      dispatch(addEquipmentThroughCsv(formData)).then((success) => {
        if (success) {
          // Only clear form fields on successful submission
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input
          }
          setFile(null); // Clear the file state
          // Reset the form fields after successful submission
          setClientEquipment((prev) => ({
            ...prev,
            device_type: "",
            device_id: "",
            manufacturer: "",
            model: "",
            serial_number: "",
            mac_address: "",
            lan_ip_address: "",
            wan_ip_address: "",
            general_info: "",
            device_location:"",
            username:"",
            password:"",
          }));
        }
      });
    } else {
      // If no file is present, use the regular equipment action
      dispatch(addClientEquipment(clientEquipment)).then((success) => {
        if (success) {
          // Only clear form fields on successful submission
          setClientEquipment((prev) => ({
            ...prev,
            device_type: "",
            device_id: "",
            manufacturer: "",
            model: "",
            serial_number: "",
            mac_address: "",
            lan_ip_address: "",
            wan_ip_address: "",
            general_info: "",
            device_location:"",
            username:"",
            password:"",
          }));
        }
      });
    }
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
            <h2 className="text-xl font-semibold mb-2">Add Client Device</h2>
            <div className="flex justify-end mb-4">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => setShowCsvUpload(!showCsvUpload)}
              >
                {showCsvUpload ? "Back to Manual Entry" : "Upload CSV"}
              </button>
            </div>
            <form onSubmit={handleSave}>
              {/* Client and Location Fields (Always Visible) */}
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
                  >
                    <option value="">Select a location</option>
                    {loadingLocations ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : (
                      clientLocations?.map((location) => (
                        <option key={location.location_id} value={location.location_id}>
                          {location.address_line_one} {location.address_line_two}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* CSV Upload Section (Conditionally Rendered) */}
              {showCsvUpload && (
                <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                  <div className="flex flex-col">
                    <label htmlFor="file">Upload Excel File:</label>
                    <input
                      type="file"
                      id="file"
                      accept=".csv"
                      className="border border-gray-300 rounded px-3 py-1"
                      onChange={handleFileChange}
                      ref={fileInputRef} // Attach the ref
                      required={showCsvUpload}
                    />
                  </div>
                </div>
              )}

              {/* Manual Entry Section (Conditionally Rendered) */}
              {!showCsvUpload && (
                <>
                  {/* Device Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="device_type" className="block text-sm font-medium text-gray-700">
                        Device Type*
                      </label>
                      <input
                        type="text"
                        name="device_type"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.device_type}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="device_id" className="block text-sm font-medium text-gray-700">
                        Device ID (Hostname)*
                      </label>
                      <input
                        type="text"
                        name="device_id"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.device_id}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Manufacturer, Model, Serial Number */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                        Manufacturer*
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.manufacturer}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                        Model*
                      </label>
                      <input
                        type="text"
                        name="model"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.model}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
                        Serial Number*
                      </label>
                      <input
                        type="text"
                        name="serial_number"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.serial_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Optional Details */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="mac_address" className="block text-sm font-medium text-gray-700">
                        MAC Address
                      </label>
                      <input
                        type="text"
                        name="mac_address"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.mac_address}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="lan_ip_address" className="block text-sm font-medium text-gray-700">
                        LAN IP Address
                      </label>
                      <input
                        type="text"
                        name="lan_ip_address"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.lan_ip_address}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="wan_ip_address" className="block text-sm font-medium text-gray-700">
                        WAN IP Address
                      </label>
                      <input
                        type="text"
                        name="wan_ip_address"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.wan_ip_address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {/*more Optional Details */}
                 <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="device_location" className="block text-sm font-medium text-gray-700">
                      Device Location
                      </label>
                      <input
                        type="text"
                        name="device_location"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.device_location}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                       Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                       Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* General Notes */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="general_info" className="block text-sm font-medium text-gray-700">
                        General Device Information
                      </label>
                      <textarea
                        name="general_info"
                        rows={5}
                        className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                        value={clientEquipment.general_info}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex justify-end mt-4">
                <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">
                  {loading ? "Saving..." : "Add Client Device"}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddClientEquipment;