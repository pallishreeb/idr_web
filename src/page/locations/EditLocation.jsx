import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { updateLocation, getLocationById } from "../../actions/locationActions"; // Import the action to update location
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditLocationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locationId } = useParams(); // Get the location ID from the URL params

  // Fetch location from Redux store
  const location = useSelector((state) => state.location.location);
  const clients = useSelector((state) => state.client.clients); // Get clients from the client slice
  const loadingClients = useSelector((state) => state.client.loading);
  const loadinglocations = useSelector((state) => state.location.loading);
  // Local state for form data
  const [formData, setFormData] = useState({
    client_id:"",
    address_line_one: "",
    address_line_two: "",
    address_line_three: "",
    city: "",
    state: "",
    zipcode: "",
    fax_number: "",
    phone_number: "",
    cell_number: "",
    contact_person_firstname: "",
    contact_person_lastname: "",
    contact_person_mail_id: "",
  });

  // Fetch location data when component mounts
  useEffect(() => {
    dispatch(getLocationById(locationId));
  }, [dispatch, locationId]);

  // Update local form data when location data changes
  useEffect(() => {
    if (location) {
      // Extract only the fields you want to update from the location data
      const {client_id, address_line_one, address_line_two, address_line_three, city, state, zipcode, fax_number, phone_number, cell_number, contact_person_firstname, contact_person_lastname, contact_person_mail_id } = location;
      
      // Set the form data with only the extracted fields
      setFormData({
        client_id,
        address_line_one,
        address_line_two,
        address_line_three,
        city,
        state,
        zipcode,
        fax_number,
        phone_number,
        cell_number,
        contact_person_firstname,
        contact_person_lastname,
        contact_person_mail_id,
      });
    }
  }, [location]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


// Handle form submission
const handleSave = (e) => {
  e.preventDefault(); // Prevent default form submission behavior
  delete formData.location_id
  delete formData.is_deleted
  delete formData.created_by
  delete formData.updated_by
  delete formData.deleted_by
  delete formData.created_at
  dispatch(updateLocation(locationId, formData, navigate));
};

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Edit Location</h2>
            <form>
            <div className="grid grid-cols-1 gap-4 mb-4">
                  <label
                    htmlFor="client_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Select Client
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    value={formData.client_id}
                    onChange={handleChange}
                    className="p-2 block w-full border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label
                      htmlFor={`address_line_one`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name={`address_line_one`}
                      value={formData.address_line_one}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`address_line_two`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name={`address_line_two`}
                      value={formData.address_line_two}
                      onChange={handleChange}
                      className=" w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`address_line_three`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address Line 3
                    </label>
                    <input
                      type="text"
                      name={`address_line_three`}
                      value={formData.address_line_three}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label
                      htmlFor={`city`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`state`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={(e) => handleChange( e)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`zipcode`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Zipcode
                    </label>
                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={(e) => handleChange( e)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label
                      htmlFor={`fax_number`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Fax Number
                    </label>
                    <input
                      type="text"
                      name="fax_number"
                      value={formData.fax_number}
                      onChange={(e) => handleChange( e)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`phone_number`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`cell_number`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cell Number
                    </label>
                    <input
                      type="text"
                      name="cell_number"
                      value={formData.cell_number}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label
                      htmlFor={`contact_person_firstname`}
                      className="block text-sm font-medium text-gray-700"
                    >
                     Contact Person First Name
                    </label>
                    <input
                      type="text"
                      name="contact_person_firstname"
                      value={formData.contact_person_firstname}
                      onChange={(e) => handleChange( e)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`contact_person_lastname`}
                      className="block text-sm font-medium text-gray-700"
                    >
                     Contact Person Last Name
                    </label>
                    <input
                      type="text"
                      name="contact_person_lastname"
                      value={formData.contact_person_lastname}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`contact_person_mail_id`}
                      className="block text-sm font-medium text-gray-700"
                    >
                    Contact Person Email ID
                    </label>
                    <input
                      type="text"
                      name="contact_person_mail_id"
                      value={formData.contact_person_mail_id}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

              {/* Save and Cancel buttons */}
              <div className="flex justify-end mb-4 mt-2">
                <button
                   onClick={(e) => handleSave(e)}
                  className="bg-indigo-700 text-white px-4 py-2 rounded mr-2"
                >
                 {loadinglocations ? 'Saving' :'Save'} 
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  <Link to="/locations">Cancel</Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditLocationPage;
