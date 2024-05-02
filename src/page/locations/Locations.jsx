import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { Link ,useNavigate} from 'react-router-dom';
import { getClients } from "../../actions/clientActions"; // Import the action to fetch clients
import { getLocationByClient ,deleteLocation} from "../../actions/locationActions"; // Import the action to fetch locations


const Locations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Local state to store selected client ID
  const [selectedClient, setSelectedClient] = useState(null);

  // Fetch clients from Redux store
  const clients = useSelector((state) => state.client.clients);

  // Fetch locations from Redux store
  const locations = useSelector((state) => state.location.locations);
  const loadinglocations = useSelector((state) => state.location.loading);
// console.log(locations)
  // Fetch clients when component mounts
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  // Function to handle client selection
  const handleClientChange = (clientId) => {
    setSelectedClient(clientId);
    dispatch(getLocationByClient(clientId)); // Fetch locations for the selected client
  };

  const handleEdit = (locationId) => {
    // Navigate to the update client page
    navigate(`/edit-location/${locationId}`);
  };
  const handleDeleteLocation = (locationId) => {
    if (window.confirm("Are you sure you want to delete this Location?")) {
      dispatch(deleteLocation(locationId)); // Dispatch deleteClientEmployee action if confirmed
    
    }
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="flex flex-col mb-4">
            <label htmlFor="client" className="mr-2 text-xl font-semibold">Select Client To View Locations:</label>
            <select
              id="client"
              className="border border-gray-300 rounded px-3 py-1 w-full"
              onChange={(e) => handleClientChange(e.target.value)}
            >
              <option value="">Select a client</option>
              {clients?.data?.map((client) => (
                <option key={client.client_id} value={client.client_id}>{client.company_name}</option>
              ))}
            </select>
          </div>

          {selectedClient !== null && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Locations for {clients?.data?.find(client => client.client_id === selectedClient)?.company_name}</h2>
              <div className="flex justify-end mb-2">
                <button className="bg-indigo-700 text-white px-4 py-2 rounded"><Link to={'/add-location'}>Add New Location</Link></button>
              </div>
              {loadinglocations ? (
                <p>Loading Locations...</p>
              ) : (
              <table className="table-auto w-full">
                <thead>
                  <tr>
                  <th className="border px-4 py-2">Client</th>
                    <th className="border px-4 py-2">Contact Person</th>
                    <th className="border px-4 py-2">Email ID</th>
                    <th className="border px-4 py-2">Phone Number</th>
                    <th className="border px-4 py-2">City</th>
                    <th className="border px-4 py-2">State</th>
                    <th className="border px-4 py-2">Zipcode</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {locations?.length === 0 ? (
                   <tr>
                   <td colSpan="7" className="text-center">
                     <img src="not-found.png" alt="Data Not Found" className="mx-auto w-64 h-64 mt-4" />
                   </td>
                 </tr>
                  ) : (
                    locations?.map((location) => (
                      <tr key={location.location_id}>
                         <td className="text-center border px-4 py-2">{clients?.data?.find(client => client.client_id === location.client_id)?.company_name}</td>
                        <td className="border px-4 py-2 text-center">{location.contact_person_firstname} {""} {location.contact_person_lastname}</td>           
                        <td className="border px-4 py-2 text-center">{location.contact_person_mail_id}</td>
                        <td className="border px-4 py-2 text-center">{location.phone_number ? location.phone_number : 'NA' }</td>
                        <td className="border px-4 py-2 text-center">{location.city}</td>
                        <td className="border px-4 py-2 text-center">{location.state}</td>
                        <td className="border px-4 py-2 text-center">{location.zipcode}</td>
                        <td className="border px-4 py-2 text-center">
                          <button onClick={() => handleEdit(location.location_id)} className="bg-indigo-700 text-white px-2 py-1 rounded mr-2">Edit</button>
                          <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDeleteLocation(location.location_id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

              </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Locations;
