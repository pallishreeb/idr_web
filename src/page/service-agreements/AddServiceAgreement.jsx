import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { addLocation } from "../../actions/locationActions";
// import { getClientEmployeeByClientId} from '../../actions/clientEmployeeActions'; 
import { getClients} from "../../actions/clientActions"; // Import action to fetch client employees
import { getLocationByClient } from "../../actions/locationActions"; 
import { Link, useNavigate, useParams } from 'react-router-dom';


const AddServiceAgreement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientId } = useParams();

  // Fetch clients and clientEmployees from Redux store
  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations); 
  const loadingClients = useSelector((state) => state.client.loading);
  const loadinglocations = useSelector((state) => state.location.loading);
//   const clientEmployees = useSelector((state) => state.clientEmployee.clientEmployees);
//   const loadingClientEmployees = useSelector((state) => state.clientEmployee.loading);

  // Component state
  const [clientEquipment, setClientEquipment] = useState({
    client_id: clientId ? clientId : "",
    contact_person_firstname: "",
    contact_person_lastname: "",
    contact_person_mail_id: "",
    address_line_one: "",
    address_line_two: "",
    address_line_three: "",
    city: "",
    state: "",
    zipcode: "",
    fax_number: "",
    phone_number: "",
    cell_number: "",
    active: true
  });

  const [selectedClientLocation, setSelectedClientLocation] = useState("");

  // Fetch clients and clientEmployees when component mounts
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  // Function to fetch client locations when a client is selected
  useEffect(() => {
    if (clientEquipment.client_id) {
      dispatch(getLocationByClient(clientEquipment.client_id));
    }
  }, [dispatch, clientEquipment?.client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientEquipment({ ...clientEquipment, [name]: value });

    if (name === 'client_id') {
      setClientEquipment({ ...clientEquipment, client_id: value });
    //   setFormData({ ...formData, client_id: value, client_location_id: [] }); // Reset locations if client changes
      dispatch(getLocationByClient(value));
    } 
    if (name === 'selected_client_location') {
        setSelectedClientLocation(value);
    }

  };

  const handleSave = (e) => {
    e.preventDefault();
    delete clientEquipment?.selected_client_employee;
    dispatch(addLocation(clientEquipment, navigate));
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Add Client Service Agreement
            </h2>
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
                <label htmlFor="selected_client_location" className="mr-2">
                  Select Client Employee:
                </label>
                <select
                  id="selected_client_location"
                  name="selected_client_location"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={selectedClientLocation}
                  onChange={handleChange}
                >
                  <option value="">Select a client location</option>
                  {loadinglocations ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    clientLocations?.map((location) => (
                      <option key={location.location_id} value={location.client_id}>
                        {location.address_line_one} {location.address_line_two}
                      </option>
                    ))
                  )}
                </select>
              </div>
              </div>
              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                    <label
                      htmlFor={`address_line_one`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date*
                    </label>
                    <input
                      type="text"
                      name={`address_line_one`}
                      value={clientEquipment.address_line_one}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      required
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`address_line_two`}
                      className="block text-sm font-medium text-gray-700"
                    >
                     Expiration Date*
                    </label>
                    <input
                      type="text"
                      name={`address_line_two`}
                      value={clientEquipment.address_line_two}
                      onChange={handleChange}
                      className=" w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>

              </div>
              {/* annual price */}
              <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                    <label
                      htmlFor={`address_line_three`}
                      className="block text-sm font-medium text-gray-700"
                    >
                     Parts Covered 
                    </label>
                    <select
                    name="status"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                  >
                    <option value="">All</option>
                    <option value="Design">Y</option>
                    <option value="Open">N</option>
                  </select>
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`city`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Annual Sale Price
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={clientEquipment.city}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>
               
              {/* Service Agreement Details */}
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1">
                  <label
                    htmlFor={`contact_person_firstname`}
                    className="block text-sm font-medium text-gray-700"
                  >
                   Service Agreement Details
                  </label>
                  <textarea
                    name="contact_person_firstname"
                    rows={5}
                    value={clientEquipment.contact_person_firstname}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                >
                  {loadinglocations ? 'Saving' : 'Add Client Device'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                >
                  <Link to={'/client-equipments'}>Cancel</Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServiceAgreement;
