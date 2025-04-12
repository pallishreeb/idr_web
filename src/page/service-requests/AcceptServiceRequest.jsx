import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getServiceRequestDetails, acceptRejectServiceRequest } from "../../actions/serviceTicket";
import Loader from "../../Images/ZZ5H.gif";
const AcceptServiceRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { requestId } = useParams();

  const loading = useSelector((state) => state.serviceTicket.loading);
  const serviceRequestDetails = useSelector((state) => state.serviceTicket.serviceRequestDetails);
  const [isLoading, setIsLoading] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [serviceDate, setServiceDate] = useState("");

  const [serviceRequest, setServiceRequest] = useState({
    client_name: "",
    client_location:"",
    contact_person: "",
    contact_phone_number: "",
    contact_email: "",
    service_location: "",
    local_onsite_contact: "",
    local_onsite_contact_number: "",
    service_ticket_details: "",
    status: "",
    service_date: ""
  });

  // Fetch request details when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await dispatch(getServiceRequestDetails(requestId));
      setIsLoading(false);
    };
    fetchData();
  }, [dispatch, requestId]);

  // Update form when serviceRequestDetails changes
  useEffect(() => {
    if (serviceRequestDetails) {
      setServiceRequest({
        client_name: serviceRequestDetails.client_name || "",
        client_location: `${serviceRequestDetails.locInfo?.address_line_one}, ${serviceRequestDetails.locInfo?.city}` || "",
        contact_person: serviceRequestDetails.contact_person || "",
        contact_phone_number: serviceRequestDetails.contact_phone_number || "",
        contact_email: serviceRequestDetails.contact_email || "",
        service_location: serviceRequestDetails.service_location || "",
        local_onsite_contact: serviceRequestDetails.local_onsite_contact || "",
        local_onsite_contact_number: serviceRequestDetails.local_onsite_contact_number || "",
        service_ticket_details: serviceRequestDetails.service_ticket_details || "",
        status: serviceRequestDetails.status || "",
        service_date: serviceRequestDetails.service_date || ""
      });
      
      // Set initial service date if it exists
      if (serviceRequestDetails.service_date) {
        const date = new Date(serviceRequestDetails.service_date);
        const formattedDate = date.toISOString().split('T')[0];
        setServiceDate(formattedDate);
      } else {
        // Default to today's date
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setServiceDate(formattedDate);
      }
    }
  }, [serviceRequestDetails]);

  const handleAcceptRequest = () => {
    setShowAcceptModal(true);
  };

  const confirmAcceptRequest = () => {
    const payload = {
      id: requestId,
      accepted: true,
      service_request: serviceRequest.service_ticket_details,
      service_date: serviceDate // Format date as MM/DD/YYYY
    };
    
    dispatch(acceptRejectServiceRequest(payload));
    setShowAcceptModal(false);
  };


  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex">
          <AdminSideNavbar />
          <div className="container mx-auto p-4 flex justify-center items-center h-64">
             <img src={Loader} alt="Loading..." className="h-16 w-16" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Customer Service Request Details</h2>
            
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded ${
                serviceRequest.status === 'Accepted' ? 'bg-green-200 text-green-800' :
                serviceRequest.status === 'Rejected' ? 'bg-red-200 text-red-800' :
                'bg-yellow-200 text-yellow-800'
              }`}>
                {serviceRequest.status || 'Pending'}
              </span>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Client:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.client_name}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Client Location:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.client_location}</div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contact Person:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.contact_person}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contact Phone:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.contact_phone_number}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contact Email:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.contact_email}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Service Location:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.service_location}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Onsite Contact:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.local_onsite_contact}</div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Onsite Contact Number:</label>
                  <div className="p-2 bg-gray-50 rounded">{serviceRequest.local_onsite_contact_number}</div>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-500 mb-1">Service Ticket Details:</label>
                <div className="p-3 bg-gray-50 rounded whitespace-pre-line">
                  {serviceRequest.service_ticket_details}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end mt-6 space-x-4">
                {serviceRequest.status !== 'Accepted' && (
                  <button
                    type="button"
                    onClick={handleAcceptRequest}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Accept Request'}
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
            </div>
          </div>
        </div>
      </div>

      {/* Accept Confirmation Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Service Request Acceptance</h3>
            
            <div className="mb-4">
              <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-2">
                Select Service Date:
              </label>
              <input
                type="date"
                id="serviceDate"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]} // Prevent past dates
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmAcceptRequest}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Confirm Acceptance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AcceptServiceRequest;