import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { addLocation } from "../../actions/locationActions";
import { getClientEmployeeByClientId} from '../../actions/clientEmployeeActions'; 
import { getClients} from "../../actions/clientActions"; // Import action to fetch client employees
import { Link, useNavigate, useParams,useLocation } from 'react-router-dom';

const AddLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const locationState = useLocation();
  const { clientId } = useParams();

  // Fetch clients and clientEmployees from Redux store
  const clients = useSelector((state) => state.client.clients);
  const loadingClients = useSelector((state) => state.client.loading);
  const loadinglocations = useSelector((state) => state.location.loading);
  const clientEmployees = useSelector((state) => state.clientEmployee.clientEmployees);
  const loadingClientEmployees = useSelector((state) => state.clientEmployee.loading);

  // Component state
  const [locations, setLocations] = useState({
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

  const [selectedClientEmployee, setSelectedClientEmployee] = useState("");

  // Fetch clients and clientEmployees when component mounts
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  // Function to fetch client employees when a client is selected
  useEffect(() => {
    if (locations.client_id) {
      dispatch(getClientEmployeeByClientId(locations.client_id));
    }
  }, [dispatch, locations.client_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocations({ ...locations, [name]: value });

    if (name === 'client_id') {
      setLocations({ ...locations, client_id: value });
      setSelectedClientEmployee(""); // Clear selected client employee when client changes
    } 
    if (name === 'selected_client_employee') {
      setSelectedClientEmployee(value);
      // Populate fields based on selected client employee
      const selectedEmployee = clientEmployees.find(emp => emp.client_emp_id === value);
      // console.log(selectedEmployee,value)
      if (selectedEmployee) {
        setLocations({
          ...locations,
          contact_person_firstname: selectedEmployee.first_name,
          contact_person_lastname: selectedEmployee.last_name,
          contact_person_mail_id: selectedEmployee.email_id,
          cell_number: selectedEmployee.contact_number
        });
      }
    }
  };

const handleSave = (e) => {
  e.preventDefault();
  delete locations?.selected_client_employee;

  dispatch(addLocation(locations));

  setLocations({
    client_id: locations.client_id, // keep same client selected
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
    active: true,
  });

  setSelectedClientEmployee("");
};


  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Add Location
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
                  value={locations.client_id}
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
                      Location Name
                    </label>
                    <input
                      type="text"
                      name={`address_line_one`}
                      value={locations.address_line_one}
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
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      name={`address_line_two`}
                      value={locations.address_line_two}
                      onChange={handleChange}
                      className=" w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor={`address_line_three`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address line 2
                    </label>
                    <input
                      type="text"
                      name={`address_line_three`}
                      value={locations.address_line_three}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
              </div>
              {/* End fax, phone, cell fields */}
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
                      value={locations.city}
                      onChange={handleChange}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      required
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
                      value={locations.state}
                      onChange={(e) => handleChange( e)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      required
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
                      value={locations.zipcode}
                      onChange={(e) => handleChange( e)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      required
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
                      value={locations.fax_number}
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
                      value={locations.phone_number}
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
                      value={locations.cell_number}
                      onChange={handleChange}
                      readOnly={!!selectedClientEmployee}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              {/* Contact person fields */}
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
                    value={locations.contact_person_firstname}
                    readOnly={!!selectedClientEmployee}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
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
                    value={locations.contact_person_lastname}
                    readOnly={!!selectedClientEmployee}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
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
                    value={locations.contact_person_mail_id}
                    readOnly={!!selectedClientEmployee}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                >
                  {loadinglocations ? 'Saving' : 'Save'}
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                >
                  <Link to={'/locations'} state={locationState.state}>Cancel</Link>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddLocation;
