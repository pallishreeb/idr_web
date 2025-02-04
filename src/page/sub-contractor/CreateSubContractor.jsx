import React, { useState } from "react";

const CreateSubContractor = () => {
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
    additionalNotes: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("projectContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        projectContact: {
          ...prev.projectContact,
          [field]: value,
        },
      }));
    } else if (name.startsWith("serviceContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        serviceContact: {
          ...prev.serviceContact,
          [field]: value,
        },
      }));
    } else if (name.startsWith("accountsReceivableContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        accountsReceivableContact: {
          ...prev.accountsReceivableContact,
          [field]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle contractor type selection
  const handleContractorTypeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedTypes = checked
        ? [...prev.contractorTypes, value]
        : prev.contractorTypes.filter((type) => type !== value);
      return {
        ...prev,
        contractorTypes: updatedTypes,
      };
    });
  };

  // Handle services provided selection
  const handleServicesProvidedChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedServices = checked
        ? [...prev.servicesProvided, value]
        : prev.servicesProvided.filter((service) => service !== value);
      return {
        ...prev,
        servicesProvided: updatedServices,
      };
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add API call or further processing here
  };

  return (
    <div className="container mx-auto p-4">
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
              <label># of Technicians</label>
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Contractor Type */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Contractor Type</h2>
          <div className="grid grid-cols-2 gap-4">
            {["Data / Voice / Fiber", "Security", "A/V", "Electrical"].map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  name="contractorTypes"
                  value={type}
                  checked={formData.contractorTypes.includes(type)}
                  onChange={handleContractorTypeChange}
                  className="mr-2"
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Services Provided */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Detailed List of Services Provided</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              "Data",
              "Fiber",
              "Analog Voice",
              "Data Center",
              "Security Alarm",
              "Access Control",
              "IP Cameras",
              "Analog Cameras",
              "Intercoms",
              "Conduit",
              "Electrical",
              "A/V – Speakers",
              "A/V – Sound Masking",
              "A/V – Video",
              "A/V – Automation / DSP",
            ].map((service) => (
              <div key={service} className="flex items-center">
                <input
                  type="checkbox"
                  name="servicesProvided"
                  value={service}
                  checked={formData.servicesProvided.includes(service)}
                  onChange={handleServicesProvidedChange}
                  className="mr-2"
                />
                <label>{service}</label>
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

        {/* Additional Notes */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Additional Notes</h2>
          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleInputChange}
            className="border p-2 rounded w-full"
            rows="4"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create SubContractor
        </button>
      </form>
    </div>
  );
};

export default CreateSubContractor;