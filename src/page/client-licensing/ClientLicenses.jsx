import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getLicenseLists } from "../../actions/licenseActions";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";
import Loader from "../../Images/ZZ5H.gif";
const ClientLicenseList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { locations } = useSelector((state) => state.location);
  const { licenses } = useSelector((state) => state.license);
  const { loading } = useSelector((state) => state.license);
  const { user_type } = useSelector((state) => state.user.user); 
  const [selectedClient, setSelectedClient] = useState(null);
  const [filters, setFilters] = useState({
    client_id: "",
    location_id: "",
    manufacturer: "",
  });

  useEffect(() => {
    if (user_type === "Client Employee") {
      dispatch(getLicenseLists({ manufacturer: filters.manufacturer }));
    } else {
      dispatch(getClients());
      dispatch(getLicenseLists(filters)); // Fetch licenses with applied filters
    }
  }, [dispatch, filters, user_type]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

  const handleClientChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      client_id: value,
      location_id: "", // Reset location filter when client changes
    }));
    setSelectedClient(value)
    dispatch(getLocationByClient(value)); // Fetch locations for the selected client
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      location_id: value,
    }));
  };

  const handleManufacturerChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      manufacturer: value,
    }));
  };


  const handleEdit = (licenseId) => {
    navigate(`/edit-client-license/${licenseId}`);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Client License List</h2>
          <div className="mb-4">
            {user_type !== "Client Employee" && (
              <form className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="client_id" className="text-sm mb-2">
                    Filter by Client:
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    className="border border-gray-300 rounded px-3 py-1"
                    value={filters.client_id}
                    onChange={handleClientChange}
                  >
                    <option value="">Select Client</option>
                    {clients?.data?.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="location_id" className="text-sm mb-2">
                    Filter by Location:
                  </label>
                  <select
                    id="location_id"
                    name="location_id"
                    className="border border-gray-300 rounded px-3 py-1"
                    value={filters.location_id}
                    onChange={handleLocationChange}
                    disabled={!filters.client_id}
                  >
                    <option value="">Select Location</option>
                    {locations?.map((location) => (
                      <option key={location.location_id} value={location.location_id}>
                        {location.address_line_one} {location.address_line_two}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            )}

            <div className="flex flex-col">
              <label htmlFor="manufacturer" className="text-sm mb-2">
                Filter by Manufacturer:
              </label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                className="border border-gray-300 rounded px-3 py-1"
                value={filters.manufacturer}
                onChange={handleManufacturerChange}
              />
            </div>
          </div>
          <div className="mb-4 flex justify-end">
            {user_type === "Admin" && (
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded"
                disabled={!selectedClient}
              >
                <Link  to={`/add-client-license/${selectedClient}`}>
                  Add New Service Agreement
                </Link>
              </button>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Client</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2">Manufacturer</th>
                  <th className="px-4 py-2">License Type</th>
                  <th className="px-4 py-2">Start Date</th>
                  <th className="px-4 py-2">Expiration Date</th>
                  {user_type === "Admin" && (
                  <th className="px-4 py-2">IDR Cost</th>)}
                  <th className="px-4 py-2">Sale Price</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <img src={Loader} alt="Loading..." />
                    </td>
                  </tr>
                ) : licenses?.data?.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No licenses found
                    </td>
                  </tr>
                ) : (
                  licenses?.data?.map((license) => (
                    <tr key={license.license_id}>
                      <td className="px-4 py-2">{license.client_name}</td>
                      <td className="px-4 py-2">{license.location_name}</td>
                      <td className="px-4 py-2">{license.qty}</td>
                      <td className="px-4 py-2">{license.manufacturer}</td>
                      <td className="px-4 py-2">{license.license_type}</td>
                      <td className="px-4 py-2">{license.start_date}</td>
                      <td className="px-4 py-2">{license.expiration_date}</td>
                      {user_type === "Admin" && (
                      <td className="px-4 py-2">{license.idr_cost}</td>)}
                      
                      <td className="px-4 py-2">{license.sale_price}</td>
                      <td className="px-4 py-2">
                      <button
                          onClick={() =>
                            handleEdit(license.license_id)
                          }
                          className="p-2 bg-gray-100"
                        >
                          <BiSolidEditAlt />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLicenseList;
