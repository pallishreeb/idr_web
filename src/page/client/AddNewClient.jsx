import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addClient,getIndustries } from "../../actions/clientActions";
import { toast } from "react-toastify";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import {Link, useNavigate} from "react-router-dom"
const AddNewClient = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();
  // const [cellCountryCode, setCellCountryCode] = useState("+1");
  // const [phoneCountryCode, setPhoneCountryCode] = useState("+1");
  // State to store form data
  const [formData, setFormData] = useState({
    industry_id: "",
    staff: "",
    company_name: "",
    contact_person_firstname: "",
    contact_person_lastname: "",
    contact_email: "",
    address_line_one: "",
    address_line_two: "",
    address_line_three: "",
    city: "",
    state: "",
    zipcode: "",
    fax_number: "",
    phone_number: "",
    cell_phone: "",
  });
  // Fetch industries when component mounts
  useEffect(() => {
    dispatch(getIndustries());
  }, [dispatch]);

  // Get industries from Redux store
  const {industries} = useSelector((state) => state.client.industries);
  const { loading } = useSelector((state) => state.client);
  // const handleCellCountryCodeChange = (e) => {
  //   setCellCountryCode(e.target.value);
  // };
  // const handlePhoneCountryCodeChange = (e) => {
  //   setPhoneCountryCode(e.target.value);
  // };
  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // const countryCode = cellCountryCode; // Get the selected country code
    // const cellPhone = formData.cell_phone; // Get the inputted cell phone number
    // const fullCellPhone = `${countryCode}${cellPhone}`; 
    // formData.cell_phone = fullCellPhone
    // formData.phone_number = `${phoneCountryCode}${formData.phone_number}`; 
    dispatch(addClient(formData,navigate))
  };

  return (
    <>
      <Header />
      <div className="flex">
        {/* <SideNavbar /> */}
        <AdminSideNavbar />
        <div className="container mx-auto p-6 shadow-lg mt-5">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Add New Client</h1>
              <div>
                <button className="bg-indigo-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
                 {loading ? 'Saving' : 'Save' }
                </button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                <Link to={'/clients'}>Cancel</Link>
                </button>
              </div>
            </div>

            <h6>Client Details</h6>
            <hr />
            {/* First Row */}
            <div className="flex flex-wrap -mx-2 mb-4 mt-5">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="industryCode" className="block">
                  Industry Code
                </label>
                <select
                id="industry_id"
                name="industry_id"
                value={formData.industry_id}
                onChange={handleChange}
                className="block w-full border-gray-300 rounded-md shadow-sm border p-2"
                required
                >
                  <option value="">Select Industry Code</option>
                  {industries
                    ? [...industries] // Create a shallow copy of the industries array
                        .sort((a, b) => a.industry_name.localeCompare(b.industry_name)) // Sort the copied array alphabetically by industry name
                        .map((industry) => (
                          <option key={industry.industry_id} value={industry.industry_id}>
                            {industry.industry_name}
                          </option>
                        ))
                    : null}
                </select>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="staffId" className="block">
                  Staff 
                </label>
                <input
                  type="text"
                  id="staff"
                  name="staff"
                  value={formData.staff}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="companyName" className="block">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="contactFirstName" className="block">
                  Contact Person First Name
                </label>
                <input
                  type="text"
                  id="contact_person_firstname"
                  name="contact_person_firstname"
                  value={formData.contact_person_firstname}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="contactLastName" className="block">
                  Contact Person Last Name
                </label>
                <input
                  type="text"
                  id="contact_person_lastname"
                  name="contact_person_lastname"
                  value={formData.contact_person_lastname}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="contactEmail" className="block">
                  Contact Person Email
                </label>
                <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                required
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="addressLine1" className="block">
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="address_line_one"
                  name="address_line_one"
                  value={formData.address_line_one}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="addressLine2" className="block">
                  Address Line 2
                </label>
                <input
                 type="text"
                 id="address_line_two"
                 name="address_line_two"
                 value={formData.address_line_two}
                 onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="addressLine3" className="block">
                  Address Line 3
                </label>
                <input
                  type="text"
                  id="address_line_three"
                  name="address_line_three"
                  value={formData.address_line_three}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                />
              </div>
            </div>

            {/* Fourth Row */}
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="city" className="block">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="state" className="block">
                  State
                </label>
                <input
                   type="text"
                   id="state"
                   name="state"
                   value={formData.state}
                   onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="zipcode" className="block">
                  Zipcode
                </label>
                <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                  required
                />
              </div>
            </div>

            {/* Fifth Row */}
            <div className="flex flex-wrap -mx-2 mb-4">
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="faxNumber" className="block">
                  Fax Number
                </label>
                <input
               type="text"
               id="fax_number"
               name="fax_number"
               value={formData.fax_number}
               onChange={handleChange}
               className="block w-full p-2 border-gray-300 rounded-md shadow-sm border"
                />
              </div>

              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="phoneNumber" className="block">
                  Phone Number
                </label>

                <div className="flex flex-row gap-1">
                {/* <select
                  id="phoneCountryCode"
                  name="phoneCountryCode"
                  onChange={handlePhoneCountryCodeChange}
                  value={phoneCountryCode}
                  className="block w-full md:w-1/4 border-gray-300 rounded-md shadow-sm border"
                >
                  <option value="">Select country code</option>
                  <option value="+1">+1</option>
                  <option value="+12">+12</option>
                  <option value="+91">+91</option>
                </select> */}
                  <input
                     type="text"
                     id="phone_number"
                     name="phone_number"
                     value={formData.phone_number}
                     onChange={handleChange}
                    className="block p-2 w-full border-gray-300 rounded-md shadow-sm border"
                    required
                  />
                </div>
              </div>
              <div className="w-full md:w-1/3 px-2 mb-4">
                <label htmlFor="cellNumber" className="block">
                  Cell Number
                </label>
                <div className="flex flex-row gap-1">
                {/* <select
                  id="cellCountryCode"
                  name="cellCountryCode"
                  onChange={handleCellCountryCodeChange}
                  value={cellCountryCode}
                  className="block w-full md:w-1/4 border-gray-300 rounded-md shadow-sm border"
                >
                  <option value="">Select country code</option>
                  <option value="+1">+1</option>
                  <option value="+12">+12</option>
                  <option value="+91">+91</option>
               
                </select> */}

                  <input
                    type="text"
                    id="cell_phone"
                    name="cell_phone"
                    value={formData.cell_phone}
                    onChange={handleChange}
                    className="block p-2 w-full border-gray-300 rounded-md shadow-sm border"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewClient;
