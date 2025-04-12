import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import {
  createServiceRequest,
  getServiceRequestInfo,
} from "../../actions/serviceTicket";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { useNavigate } from "react-router-dom";

const AddServiceRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   const { clientId, locationId } = useParams();
  //   const [searchParams] = useSearchParams();

  // Fetch clients and client locations from Redux store
  // const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const user = useSelector((state) => state.user.user);
  const { serviceReqInfo, loading } = useSelector(
    (state) => state.serviceTicket
  );

  const { access } = useSelector((state) => state.user);
  //   const [user, setUser] = useState(null);
  const [serviceRequest, setServiceRequest] = useState({
    client_id: "", //clientId && clientId !== "null" ? clientId : "",
    client_name: "",
    location_id: "", //locationId && locationId !== "null" ? locationId : "",
    client_emp_user_id: user?.client_emp_id || "",
    contact_person: `${user?.first_name} ${user?.first_name}` || "",
    contact_phone_number: user?.contact_number || "",
    contact_email: user?.email_id || "",
    service_location: "",
    local_onsite_contact: "",
    local_onsite_contact_number: "",
    service_ticket_details: "",
  });

  const [selectedClientLocation, setSelectedClientLocation] = useState("");

  // useEffect(() => {
  //     let loggedInUsers = JSON.parse(localStorage.getItem("user"));
  //     setUser(loggedInUsers);
  //   }, [users]);
  // Fetch clients when component mounts
  useEffect(() => {
    if (user?.client_type !== "User" && !access.includes(user?.user_type)) {
      dispatch(getServiceRequestInfo());
    } else {
      dispatch(getClients());
    }
  }, [user, dispatch, access]);

  // Fetch locations based on client_id
  useEffect(() => {
    if (serviceRequest?.client_id) {
      dispatch(getLocationByClient(serviceRequest?.client_id));
    }
  }, [dispatch, serviceRequest?.client_id]);
  useEffect(() => {
    if (serviceReqInfo && serviceReqInfo.client_info) {
      const fullName = `${serviceReqInfo.first_name?.trim()} ${serviceReqInfo.last_name?.trim()}`;

      setServiceRequest((prev) => ({
        ...prev,
        client_id: serviceReqInfo.client_info.client_id,
        client_name: serviceReqInfo.client_info.company_name,
        location_id: serviceReqInfo.locations?.[0]?.location_id || "",
        client_emp_user_id: serviceReqInfo.client_emp_id,
        contact_person: fullName,
        contact_phone_number: serviceReqInfo.contact_number,
        contact_email: serviceReqInfo.email_id,
      }));

      if (serviceReqInfo.client_info.client_id) {
        dispatch(getLocationByClient(serviceReqInfo.client_info.client_id));
      }
    }
  }, [serviceReqInfo, dispatch]);

  // Set client_name if clientId is provided via URL params
  //   useEffect(() => {
  //     if (clientId && clients?.data?.length) {
  //       const selectedClient = clients.data.find((client) => client.client_id === clientId);
  //       if (selectedClient) {
  //         setServiceRequest((prev) => ({
  //           ...prev,
  //           client_name: selectedClient.company_name,
  //         }));
  //         dispatch(getLocationByClient(clientId));
  //       }
  //     }
  //   }, [clientId, clients, dispatch]);

  // Pre-select location if locationId is provided
  //   useEffect(() => {
  //     if (locationId && clientLocations?.length) {
  //       const selectedLocation = clientLocations.find(
  //         (location) => location.location_id === locationId
  //       );
  //       if (selectedLocation) {
  //         setServiceRequest((prev) => ({
  //           ...prev,
  //           location_id: selectedLocation.location_id,
  //           service_location: `${selectedLocation.address_line_one} ${selectedLocation.address_line_two}`
  //         }));
  //       }
  //     }
  //   }, [locationId, clientLocations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "selected_client_location") {
      setSelectedClientLocation(value);
      setServiceRequest((prev) => ({
        ...prev,
        location_id: value,
      }));
    } else {
      setServiceRequest((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    delete serviceRequest?.selected_client_location;
    dispatch(createServiceRequest(serviceRequest, navigate));
  };

  // const handleBack = () => {
  // const params = new URLSearchParams(searchParams);

  // if (clientId && clientId !== "null") {
  //   params.set("client_id", clientId);
  // }
  // if (locationId && locationId !== "null") {
  //   params.set("location_id", locationId);
  // }

  //   navigate(`/service-requests`);
  // };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Create Customer Service Requests
            </h2>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="client_name" className="mr-2">
                    Client:
                  </label>
                  <input
                    type="text"
                    id="client_name"
                    name="client_name"
                    className="border border-gray-300 rounded px-3 py-1 w-full bg-gray-100 cursor-not-allowed"
                    value={serviceReqInfo?.client_info?.company_name || ""}
                    readOnly
                  />
                </div>

                <div className="flex flex-col mb-4">
                  <label htmlFor="selected_client_location" className="mr-2">
                    Select Client Location*:
                  </label>
                  <select
                    name="selected_client_location"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.location_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select location</option>
                    {(serviceReqInfo?.locations?.length
                      ? serviceReqInfo.locations
                      : clientLocations
                    ).map((loc) => (
                      <option key={loc.location_id} value={loc.location_id}>
                        {`${loc.address_line_one}, ${loc.city}`}
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
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.contact_person}
                    onChange={handleChange}
                    required
                    readOnly
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
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.contact_phone_number}
                    onChange={handleChange}
                    required
                    readOnly
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
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.contact_email}
                    onChange={handleChange}
                    required
                    readOnly
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="service_location" className="mr-2">
                    Service Location*:
                  </label>
                  <input
                    type="text"
                    id="service_location"
                    name="service_location"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.service_location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="local_onsite_contact" className="mr-2">
                    Onsite Contact (Optional):
                  </label>
                  <input
                    type="text"
                    id="local_onsite_contact"
                    name="local_onsite_contact"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.local_onsite_contact}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="local_onsite_contact_number" className="mr-2">
                    Onsite Contact Number (Optional):
                  </label>
                  <input
                    type="tel"
                    id="local_onsite_contact_number"
                    name="local_onsite_contact_number"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={serviceRequest.local_onsite_contact_number}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="service_ticket_details"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Service Ticket Details*
                  </label>
                  <textarea
                    name="service_ticket_details"
                    rows={5}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    value={serviceRequest.service_ticket_details}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <button
                  type="submit"
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                >
                  Create Service Request
                </button>
                {/* <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                >
                  Back
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddServiceRequest;
