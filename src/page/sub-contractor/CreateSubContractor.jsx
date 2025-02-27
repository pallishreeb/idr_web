import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSubcontractorTyes, getSubcontractorServices, addSubcontractor } from "../../actions/subContractorAction";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";

const CreateSubContractor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.subcontractor);
  // const { user_type } = useSelector((state) => state.user.user);
  // Add to component
const { subcontractorTypes, subcontractorServices } = useSelector((state) => state.subcontractor);

useEffect(() => {
  dispatch(getSubcontractorTyes());
  dispatch(getSubcontractorServices());
}, [dispatch]);

  // State for form data
  const [formData, setFormData] = useState({
    subcontractorName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    coverageArea: "",
    hourlyRate: "",
    tripCharge: "",
    numberOfTechnicians: "",
    projectContact: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      mobileNumber: "",
      email: "",
    },
    serviceContactSameAsProject: false,
    serviceContact: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      mobileNumber: "",
      email: "",
    },
    accountsReceivableContactSameAsProject: false,
    accountsReceivableContact: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      mobileNumber: "",
      email: "",
    },
    contractorTypes: [],
    servicesProvided: [],
    ownsCertifier: "",
    // additionalNotes: "",
  });

  useEffect(() => {
    const syncContacts = () => {
      const updates = {};
      
      if (formData.serviceContactSameAsProject) {
        updates.serviceContact = formData.projectContact;
      }
      
      if (formData.accountsReceivableContactSameAsProject) {
        updates.accountsReceivableContact = formData.projectContact;
      }
      
      if (Object.keys(updates).length > 0) {
        setFormData(prev => ({ ...prev, ...updates }));
      }
    };
  
    syncContacts();
  }, [formData.projectContact]); // Sync when project contact changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    // Handle nested contact fields first
    if (name.startsWith("projectContact.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        projectContact: {
          ...prev.projectContact,
          [field]: value
        }
      }));
    } 
    else if (name.startsWith("serviceContact.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        serviceContact: {
          ...prev.serviceContact,
          [field]: value
        }
      }));
    }
    else if (name.startsWith("accountsReceivableContact.")) {
      const field = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        accountsReceivableContact: {
          ...prev.accountsReceivableContact,
          [field]: value
        }
      }));
    }
    // Then handle checkboxes
    else if (type === "checkbox") {
      if (name === "serviceContactSameAsProject") {
        setFormData(prev => ({
          ...prev,
          serviceContactSameAsProject: checked,
          serviceContact: checked ? prev.projectContact : prev.serviceContact
        }));
      } 
      else if (name === "accountsReceivableContactSameAsProject") {
        setFormData(prev => ({
          ...prev,
          accountsReceivableContactSameAsProject: checked,
          accountsReceivableContact: checked ? prev.projectContact : prev.accountsReceivableContact
        }));
      }
      else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    }
    // Handle all other fields
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleContractorTypeChange = (type, checked) => {
    setFormData(prev => ({
      ...prev,
      contractorTypes: checked
        ? [...prev.contractorTypes, { type_id: type.contractor_type_id, type_name: type.type_name }]
        : prev.contractorTypes.filter(t => t.type_id !== type.contractor_type_id)
    }));
  };
  
  const handleServicesProvidedChange = (service, checked) => {
    setFormData(prev => ({
      ...prev,
      servicesProvided: checked
        ? [...prev.servicesProvided, { service_id: service.contractor_service_id, service_name: service.type_name }]
        : prev.servicesProvided.filter(s => s.service_id !== service.contractor_service_id)
    }));
  };
  

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = {
      subcontractor_name: formData.subcontractorName,
      street_address: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      zipcode: formData.zipCode,
      coverage_area: formData.coverageArea,
      hourly_rate: formData.hourlyRate,
      trip_charge: formData.tripCharge,
      no_of_technicians: formData.numberOfTechnicians,
      is_certifier: formData.ownsCertifier === "Yes",
      types: formData.contractorTypes,
      services: formData.servicesProvided,
      // Contacts
      p_firstname: formData.projectContact.firstName,
      p_lastname: formData.projectContact.lastName,
      p_phonenumber: formData.projectContact.phoneNumber,
      p_mobilenumber: formData.projectContact.mobileNumber,
      p_email: formData.projectContact.email,
      s_firstname: formData.serviceContact.firstName,
      s_lastname: formData.serviceContact.lastName,
      s_phonenumber: formData.serviceContact.phoneNumber,
      s_mobilenumber: formData.serviceContact.mobileNumber,
      s_email: formData.serviceContact.email,
      a_firstname: formData.accountsReceivableContact.firstName,
      a_lastname: formData.accountsReceivableContact.lastName,
      a_phonenumber: formData.accountsReceivableContact.phoneNumber,
      a_mobilenumber: formData.accountsReceivableContact.mobileNumber,
      a_email: formData.accountsReceivableContact.email,
      additional_notes: formData.additionalNotes
    };
  
    dispatch(addSubcontractor(payload,navigate));
  };

  return (
    <>
    <Header />
    <div className="flex">
      <AdminSideNavbar />
    <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
      <h1 className="text-2xl font-bold mb-4">Create SubContractor</h1>
      <form onSubmit={handleSubmit}>
        {/* Subcontractor Information */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Subcontractor Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>Subcontractor Name</label>
              <input
                type="text"
                name="subcontractorName"
                value={formData.subcontractorName}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Street Address</label>
              <input
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Coverage Area</label>
              <input
                type="text"
                name="coverageArea"
                value={formData.coverageArea}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Hourly Rate</label>
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Trip Charge</label>
              <input
                type="number"
                name="tripCharge"
                value={formData.tripCharge}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>No of Technicians</label>
              <input
                type="number"
                name="numberOfTechnicians"
                value={formData.numberOfTechnicians}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Project Contact */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Project Contact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label>First Name</label>
              <input
                type="text"
                name="projectContact.firstName"
                value={formData.projectContact.firstName}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Last Name</label>
              <input
                type="text"
                name="projectContact.lastName"
                value={formData.projectContact.lastName}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Phone Number</label>
              <input
                type="text"
                name="projectContact.phoneNumber"
                value={formData.projectContact.phoneNumber}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Mobile Number</label>
              <input
                type="text"
                name="projectContact.mobileNumber"
                value={formData.projectContact.mobileNumber}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
            <div className="flex flex-col">
              <label>Email Address</label>
              <input
                type="email"
                name="projectContact.email"
                value={formData.projectContact.email}
                onChange={handleInputChange}
                className="border p-2 rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Service Contact */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Service Contact</h2>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="serviceContactSameAsProject"
              checked={formData.serviceContactSameAsProject}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label>Same as Project Contact</label>
          </div>
          {!formData.serviceContactSameAsProject && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label>First Name</label>
                <input
                  type="text"
                  name="serviceContact.firstName"
                  value={formData.serviceContact.firstName}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.serviceContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Last Name</label>
                <input
                  type="text"
                  name="serviceContact.lastName"
                  value={formData.serviceContact.lastName}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.serviceContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="serviceContact.phoneNumber"
                  value={formData.serviceContact.phoneNumber}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.serviceContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="serviceContact.mobileNumber"
                  value={formData.serviceContact.mobileNumber}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.serviceContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Email Address</label>
                <input
                  type="email"
                  name="serviceContact.email"
                  value={formData.serviceContact.email}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.serviceContactSameAsProject}
                />
              </div>
            </div>
          )}
        </div>

        {/* Accounts Receivable Contact */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Accounts Receivable Contact</h2>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="accountsReceivableContactSameAsProject"
              checked={formData.accountsReceivableContactSameAsProject}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label>Same as Project Contact</label>
          </div>
          {!formData.accountsReceivableContactSameAsProject && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label>First Name</label>
                <input
                  type="text"
                  name="accountsReceivableContact.firstName"
                  value={formData.accountsReceivableContact.firstName}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.accountsReceivableContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Last Name</label>
                <input
                  type="text"
                  name="accountsReceivableContact.lastName"
                  value={formData.accountsReceivableContact.lastName}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.accountsReceivableContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="accountsReceivableContact.phoneNumber"
                  value={formData.accountsReceivableContact.phoneNumber}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.accountsReceivableContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="accountsReceivableContact.mobileNumber"
                  value={formData.accountsReceivableContact.mobileNumber}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.accountsReceivableContactSameAsProject}
                />
              </div>
              <div className="flex flex-col">
                <label>Email Address</label>
                <input
                  type="email"
                  name="accountsReceivableContact.email"
                  value={formData.accountsReceivableContact.email}
                  onChange={handleInputChange}
                  className="border p-2 rounded"
                  disabled={formData.accountsReceivableContactSameAsProject}
                />
              </div>
            </div>
          )}
        </div>

        {/* Contractor Type */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Contractor Type</h2>
          <div className="grid grid-cols-2 gap-4">
          {subcontractorTypes?.map((type) => (
            <div key={type.contractor_type_id} className="flex items-center">
              <input
                type="checkbox"
                id={type.contractor_type_id}
                checked={formData.contractorTypes.some(t => t.type_id === type.contractor_type_id)}
                onChange={(e) => handleContractorTypeChange(type, e.target.checked)}
              />
              <label htmlFor={type.contractor_type_id} className="ml-2">{type.type_name}</label>
            </div>
          ))}
          </div>
        </div>

        {/* Services Provided */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Detailed List of Services Provided</h2>
          <div className="grid grid-cols-2 gap-4">
          {subcontractorServices?.map((service) => (
            <div key={service.contractor_service_id} className="flex items-center">
              <input
                type="checkbox"
                id={service.contractor_service_id}
                checked={formData.servicesProvided.some(s => s.service_id === service.contractor_service_id)}
                onChange={(e) => handleServicesProvidedChange(service, e.target.checked)}
              />
              <label htmlFor={service.contractor_service_id} className="ml-2">{service.type_name}</label>
            </div>
          ))}
          </div>
        </div>

        {/* Owns a Certifier */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Owns a Certifier</h2>
          <div className="flex items-center">
            <input
              type="radio"
              name="ownsCertifier"
              value="Yes"
              checked={formData.ownsCertifier === "Yes"}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label>Yes</label>
            <input
              type="radio"
              name="ownsCertifier"
              value="No"
              checked={formData.ownsCertifier === "No"}
              onChange={handleInputChange}
              className="ml-4 mr-2"
            />
            <label>No</label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
         {loading ? "Saving Data" : "Create Subcontractor" }
        </button>
      </form>
    </div>
    </div>
    </>
  );
};

export default CreateSubContractor;