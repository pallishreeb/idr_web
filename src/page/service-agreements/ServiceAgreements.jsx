import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import Swal from "sweetalert2";
import { BiSolidEditAlt } from "react-icons/bi";
// import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link, useNavigate } from "react-router-dom";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getServiceAgreementLists } from "../../actions/serviceAgreement";
import { clearServiceAgreements } from "../../reducers/serviceAgreementSlice";

const ServiceAgreements = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const clients = useSelector((state) => state.client.clients);
  const locations = useSelector((state) => state.location.locations);
  const serviceAgreements = useSelector(
    (state) => state.serviceAgreement.serviceAgreements
  );
  const loading = useSelector((state) => state.serviceAgreement.loading);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { user_type } = useSelector((state) => state.user.user);

  // Reset client and location when unmounting or navigating back
  useEffect(() => {
    if (selectedClient == null) {
      dispatch(clearServiceAgreements(selectedClient));
    }
  }, [selectedClient, dispatch]);

  useEffect(() => {
    if (user_type === "Client Employee") {
      dispatch(getServiceAgreementLists()); // Fetch without client_id and location_id
    } else {
      dispatch(getServiceAgreementLists());
      dispatch(getClients()); // Load clients for other user types
    }
  }, [dispatch, user_type]);

  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
    setSelectedLocation(null);
    dispatch(clearServiceAgreements());
    if (clientId) {
      dispatch(getLocationByClient(clientId));
      dispatch(getServiceAgreementLists({ client_id: clientId }));
    }
  };

  const handleLocationChange = (locationId) => {
    setSelectedLocation(locationId);
    if (selectedClient && locationId) {
      dispatch(
        getServiceAgreementLists({
          client_id: selectedClient,
          location_id: locationId,
        })
      );
    } else {
      dispatch(getServiceAgreementLists({ client_id: selectedClient }));
    }
  };

  const handleEdit = (agreementId) => {
    navigate(`/edit-service-agreement/${agreementId}`);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            Client Service Agreements
          </h2>

          {user_type !== "Client Employee" && (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col">
                <label htmlFor="client" className="text-sm font-medium mb-1">
                  Select Client:
                </label>
                <select
                  id="client"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  onChange={(e) => handleClientChange(e.target.value)}
                  value={selectedClient}
                >
                  <option value="">Select a client</option>
                  {clients?.data?.map((client) => (
                    <option key={client.client_id} value={client.client_id}>
                      {client.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="location" className="text-sm font-medium mb-1">
                  Select Location:
                </label>
                <select
                  id="location"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  onChange={(e) => handleLocationChange(e.target.value)}
                  value={selectedLocation}
                  disabled={!selectedClient}
                >
                  <option value="">Select a location</option>
                  {locations?.map((location) => (
                    <option
                      key={location.location_id}
                      value={location.location_id}
                    >
                      {location.address_line_one} {location.address_line_two}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <div className="mb-4 flex justify-end">
            {user_type === "Admin" && (
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded"
                disabled={!selectedClient}
              >
                <Link to={`/add-service-agreement/${selectedClient}/${selectedLocation}`}>
                  Add New Service Agreement
                </Link>
              </button>
            )}
          </div>
          {loading ? (
            <p>Loading Service Agreements...</p>
          ) : (
            <table className="table-auto w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border px-4 py-2">Client Name</th>
                  <th className="border px-4 py-2">Start Date</th>
                  <th className="border px-4 py-2">Expiration Date</th>
                  <th className="border px-4 py-2">Parts Covered</th>
                  {user_type === "Admin" && (
                    <th className="border px-4 py-2">Annual Sale Price</th>
                  )}
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {serviceAgreements?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No service agreements found.
                    </td>
                  </tr>
                ) : (
                  serviceAgreements?.map((agreement) => (
                    <tr key={agreement?.agreement_id}>
                      <td className="border px-4 py-2">
                        {agreement.client_name}
                      </td>
                      <td className="border px-4 py-2">
                      <input
                            type="date"
                            value={agreement.start_date || ""}
                            readOnly
                            className="outline-none border-none"
                          />
                       
                      </td>
                      <td className="border px-4 py-2">
                      <input
                            type="date"
                            value={agreement.expiration_date || ""}
                            readOnly
                            className="outline-none border-none"
                          />
                      </td>
                      <td className="border px-4 py-2">
                        {agreement.parts_covered ? "Yes" : "No"}
                      </td>
                      {(user_type === "Admin" || user_type === "Client Employee") && (
                        <td className="border px-4 py-2">${agreement.price}</td>
                      )}
                      <td className="border px-4 py-2 flex">
                        <button
                          className="p-[4px] bg-gray-100 cursor-pointer mr-2"
                          onClick={() => handleEdit(agreement.agreement_id)}
                        >
                          <BiSolidEditAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceAgreements;
