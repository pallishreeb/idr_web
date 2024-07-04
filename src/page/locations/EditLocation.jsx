import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClientEmployeeByClientId } from '../../actions/clientEmployeeActions';
import { updateLocation, getLocationById } from "../../actions/locationActions";
import { Link, useParams, useNavigate } from 'react-router-dom';

const EditLocationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locationId } = useParams(); // Get the location ID from the URL params

  // Fetch location from Redux store
  const location = useSelector((state) => state.location.location);
  const clients = useSelector((state) => state.client.clients); // Get clients from the client slice
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const clientEmployees = useSelector((state) => state.clientEmployee.clientEmployees);
  const loadingClientEmployees = useSelector((state) => state.clientEmployee.loading);

  // Local state for form data and selected client employee
  const [formData, setFormData] = useState({
    client_id: "",
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
  const [selectedClientEmployee, setSelectedClientEmployee] = useState("");

  // Fetch location data when component mounts
  useEffect(() => {
    dispatch(getLocationById(locationId));
  }, [dispatch, locationId]);

  // Update local form data when location data changes
  useEffect(() => {
    if (location) {
      // Extract location data and update form data
      const {
        client_id,
        address_line_one,
        address_line_two,
        address_line_three,
        city,
        state,
        zipcode,
        fax_number,
        phone_number,
        contact_person_firstname,
        contact_person_lastname,
        contact_person_mail_id,
        cell_number
      } = location;

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

      // Set selected client employee based on location data
      // This logic assumes you are fetching and displaying based on the details, not client_employee_id
      const selectedEmployee = clientEmployees.find(emp => (
        emp.first_name === contact_person_firstname &&
        emp.last_name === contact_person_lastname &&
        emp.email_id === contact_person_mail_id &&
        emp.contact_number === cell_number
      ));

      if (selectedEmployee) {
        setSelectedClientEmployee(selectedEmployee.client_emp_id);
      }
    }
  }, [location, clientEmployees]);

  // Function to fetch client employees when a client is selected
  useEffect(() => {
    if (formData.client_id) {
      dispatch(getClientEmployeeByClientId(formData.client_id));
    }
  }, [dispatch, formData.client_id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'client_id') {
      // Clear selected client employee when client changes
      setSelectedClientEmployee("");
    }

    if (name === 'selected_client_employee') {
      setSelectedClientEmployee(value);

      // Populate fields based on selected client employee
      const selectedEmployee = clientEmployees.find(emp => emp.client_emp_id === value);
      if (selectedEmployee) {
        setFormData({
          ...formData,
          contact_person_firstname: selectedEmployee.first_name,
          contact_person_lastname: selectedEmployee.last_name,
          contact_person_mail_id: selectedEmployee.email_id,
          cell_number: selectedEmployee.contact_number
        });
      }
    }
  };

  // Handle form submission
  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Remove unnecessary fields before saving (if any)
    delete formData.location_id;
    delete formData.is_deleted;
    delete formData.created_by;
    delete formData.updated_by;
    delete formData.deleted_by;
    delete formData.created_at;

    // Dispatch update location action
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
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col mb-4">
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
                <div className="flex flex-col mb-4">
                  <label htmlFor="selected_client_employee" className="mr-2">
                    Select Client Employee:
                  </label>
                  <select
                    id="selected_client_employee"
                    name="selected_client_employee"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={selectedClientEmployee}
                    onChange={handleChange}
                  >
                    <option value="">Select a client employee</option>
                    {loadingClientEmployees ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : (
                      clientEmployees?.map((employee) => (
                        <option key={employee.client_emp_id} value={employee.client_emp_id}>
                          {employee.first_name} {employee.last_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    readOnly // Assuming this is auto-populated
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
                    onChange={handleChange}
                    readOnly // Assuming this is auto-populated
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
                    readOnly // Assuming this is auto-populated
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
                    readOnly // Assuming this is auto-populated
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Save and Cancel buttons */}
              <div className="flex justify-end mb-4 mt-2">
                <button
                  type="submit"
                  className="bg-indigo-700 text-white px-4 py-2 rounded mr-2"
                >
                  {loadingLocations ? 'Saving...' : 'Save'}
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
