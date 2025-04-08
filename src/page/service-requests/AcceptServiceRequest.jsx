import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getServiceRequestDetails, acceptRejectServiceRequest } from "../../actions/serviceTicket";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";

const AcceptServiceRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requestId } = useParams();

  // Fetch data from Redux store
  const [currentRequest, setCurrentRequest] = useState(null)
  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const loading = useSelector((state) => state.serviceTicket.loading);
  const user = useSelector((state) => state.user.user);

  const [serviceRequest, setServiceRequest] = useState({
    client_id: "",
    client_name: "",
    location_id: "",
    client_emp_user_id: "",
    contact_person: "",
    contact_phone_number: "",
    contact_email: "",
    service_location: "",
    local_onsite_contact: "",
    local_onsite_contact_number: "",
    service_ticket_details: "",
    status: "" // Added status field
  });

  // Fetch request details when component mounts
  useEffect(() => {
    dispatch(getServiceRequestDetails(requestId));
    dispatch(getClients());
  }, [dispatch, requestId]);

  // Update form when currentRequest changes
  useEffect(() => {
    if (currentRequest) {
      setServiceRequest({
        client_id: currentRequest.client_id || "",
        client_name: currentRequest.client_name || "",
        location_id: currentRequest.location_id || "",
        client_emp_user_id: currentRequest.client_emp_user_id || "",
        contact_person: currentRequest.contact_person || "",
        contact_phone_number: currentRequest.contact_phone_number || "",
        contact_email: currentRequest.contact_email || "",
        service_location: currentRequest.service_location || "",
        local_onsite_contact: currentRequest.local_onsite_contact || "",
        local_onsite_contact_number: currentRequest.local_onsite_contact_number || "",
        service_ticket_details: currentRequest.service_ticket_details || "",
        status: currentRequest.status || ""
      });

      // Fetch locations for this client
      if (currentRequest.client_id) {
        dispatch(getLocationByClient(currentRequest.client_id));
      }
    }
  }, [currentRequest, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceRequest((prev) => ({ ...prev, [name]: value }));

    if (name === "client_id") {
      const selectedClient = clients?.data?.find((client) => client.client_id === value);
      if (selectedClient) {
        setServiceRequest((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
          location_id: "",
        }));
      }
      dispatch(getLocationByClient(value));
    }
  };

  const handleStatusUpdate = (status) => {
    if (window.confirm(`Are you sure you want to ${status} this service request?`)) {
      dispatch(getServiceRequestDetails(requestId, status, navigate));
    }
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Customer Service Request Details</h2>
            
            {/* Current Status Display */}
            {/* <div className="mb-4 p-3 bg-gray-100 rounded">
              <strong>Current Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${
                serviceRequest.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                serviceRequest.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {serviceRequest.status || 'Pending'}
              </span>
            </div> */}

            <form>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="client_id" className="mr-2">
                    Client:
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.client_id}
                    onChange={handleChange}
                    disabled
                  >
                    <option value="">Select a client</option>
                    {clients?.data?.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="location_id" className="mr-2">
                    Client Location:
                  </label>
                  <select
                    id="location_id"
                    name="location_id"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.location_id}
                    onChange={handleChange}
                    disabled
                  >
                    <option value="">Select a client location</option>
                    {clientLocations?.map((location) => (
                      <option key={location.location_id} value={location.location_id}>
                        {location.address_line_one} {location.address_line_two}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="contact_person" className="mr-2">
                    Contact Person:
                  </label>
                  <input
                    type="text"
                    id="contact_person"
                    name="contact_person"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.contact_person}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="contact_phone_number" className="mr-2">
                    Contact Phone:
                  </label>
                  <input
                    type="tel"
                    id="contact_phone_number"
                    name="contact_phone_number"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.contact_phone_number}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="contact_email" className="mr-2">
                    Contact Email:
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.contact_email}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="service_location" className="mr-2">
                    Service Location:
                  </label>
                  <input
                    type="text"
                    id="service_location"
                    name="service_location"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.service_location}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="local_onsite_contact" className="mr-2">
                    Onsite Contact:
                  </label>
                  <input
                    type="text"
                    id="local_onsite_contact"
                    name="local_onsite_contact"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.local_onsite_contact}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="local_onsite_contact_number" className="mr-2">
                    Onsite Contact Number:
                  </label>
                  <input
                    type="tel"
                    id="local_onsite_contact_number"
                    name="local_onsite_contact_number"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100"
                    value={serviceRequest.local_onsite_contact_number}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="service_ticket_details"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service Ticket Details
                  </label>
                  <textarea
                    name="service_ticket_details"
                    rows={5}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-gray-100"
                    value={serviceRequest.service_ticket_details}
                    onChange={handleChange}
                    disabled
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mb-4 space-x-4">
                {serviceRequest.status !== 'Accepted' && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('Accepted')}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Accept Request'}
                  </button>
                )}
                
                {serviceRequest.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate('Rejected')}
                    className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Reject Request'}
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
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

export default AcceptServiceRequest;