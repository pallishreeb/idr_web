import React from 'react';

const AddNewClient = () => {
  return (
    <div className="container mx-auto p-4 shadow-lg mt-8">
     

      <form action="#" method="POST">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Add New Client</h1>
        <div>
          <button className="bg-indigo-700 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">
            Save
          </button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cancel
          </button>
        </div>
      </div>

      <h6>Client Details</h6>
      <hr/>
      {/* First Row */}
      <div className="flex flex-wrap -mx-2 mb-4 mt-5">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="industryCode" className="block">Industry Code</label>
          <select id="industryCode" className="block w-full border-gray-300 rounded-md shadow-sm border p-2">
            <option value="">Select Industry Code</option>
            {/* Add options here */}
          </select>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="staffId" className="block">Staff ID</label>
          <select id="staffId" className="block w-full border-gray-300 rounded-md shadow-sm border p-2">
            <option value="">Select Staff ID</option>
            {/* Add options here */}
          </select>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="companyName" className="block">Company Name</label>
          <input type="text" id="companyName" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
      </div>

      {/* Second Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="contactFirstName" className="block">Contact Person First Name</label>
          <input type="text" id="contactFirstName" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="contactLastName" className="block">Contact Person Last Name</label>
          <input type="text" id="contactLastName" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="contactEmail" className="block">Contact Person Email</label>
          <input type="email" id="contactEmail" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
      </div>

      {/* Third Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="addressLine1" className="block">Address Line 1</label>
          <input type="text" id="addressLine1" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="addressLine2" className="block">Address Line 2</label>
          <input type="text" id="addressLine2" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="addressLine3" className="block">Address Line 3</label>
          <input type="text" id="addressLine3" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
      </div>

      {/* Fourth Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="city" className="block">City</label>
          <input type="text" id="city" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="state" className="block">State</label>
          <input type="text" id="state" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="zipcode" className="block">Zipcode</label>
          <input type="text" id="zipcode" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
      </div>

      {/* Fifth Row */}
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="faxNumber" className="block">Fax Number</label>
          <input type="text" id="faxNumber" className="block w-full p-2 border-gray-300 rounded-md shadow-sm border" />
        </div>
      
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="phoneNumber" className="block">Phone Number</label>
        
          <div className='flex flex-row gap-1'>
          <select id="cellCountryCode" className="block w-full md:w-1/4 border-gray-300 rounded-md shadow-sm border">
            <option value="">+1</option>
            <option value="">+12</option>
            <option value="">+91</option>
            {/* Add options here */}
          </select>
          <input type="text" id="phoneNumber" className="block p-2 w-full border-gray-300 rounded-md shadow-sm border" />
          </div>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <label htmlFor="cellNumber" className="block">Cell Number</label>
          <div className='flex flex-row gap-1'>
          <select id="cellCountryCode" className="block w-full md:w-1/4 border-gray-300 rounded-md shadow-sm border">
            <option value="">+1</option>
            <option value="">+12</option>
            <option value="">+91</option>
            {/* Add options here */}
          </select>
          <input type="text" id="cellNumber" className="block p-2 w-full border-gray-300 rounded-md shadow-sm border" />
          </div>
          
        </div>
      </div>
      </form>
    </div>
    
  );
};

export default AddNewClient;
