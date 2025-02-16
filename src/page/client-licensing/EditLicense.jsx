import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { updateLicense, getLicenseDetails } from "../../actions/licenseActions";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Images/ZZ5H.gif";
const EditLicense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { licenseId } = useParams();

  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const { user_type ,client_type} = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const { licenseDetails, loading, loadingDetails } = useSelector((state) => state.license);

  const [licenseData, setLicenseData] = useState({
    license_id: licenseId,
    client_id: "",
    client_name: "",
    location_id: "",
    quantity: "",
    manufacturer: "",
    license_type: "",
    start_date: "",
    expiration_date: "",
    idr_cost: "",
    sale_cost: "",
  });

  useEffect(() => {
    dispatch(getLicenseDetails(licenseId));
    if (user_type !== "Client Employee") {
      dispatch(getClients());
    }
  }, [dispatch, licenseId, user_type]);

  useEffect(() => {
    if (licenseDetails) {
      setLicenseData({
        license_id:licenseDetails.license_id || "",
        client_id: licenseDetails.client_id || "",
        client_name: licenseDetails.client_name || "",
        location_id: licenseDetails.location_id || "",
        quantity: licenseDetails.quantity || "",
        manufacturer:licenseDetails.manufacturer || "",
        license_type: licenseDetails.license_type || "",
        idr_cost: licenseDetails.idr_cost || "",
        sale_cost: licenseDetails.sale_cost || "",
        start_date: formatDateToYYYYMMDD(licenseDetails.start_date) || "",
        expiration_date: formatDateToYYYYMMDD(licenseDetails.expiration_date) || "",
      });
  
      if (licenseDetails?.client_id) {
        dispatch(getLocationByClient(licenseDetails?.client_id));
      }
    }
  }, [licenseDetails, dispatch]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLicenseData((prev) => ({ ...prev, [name]: value }));
  
    if (name === "client_id") {
      const selectedClient = clients?.data?.find(
        (client) => client.client_id === value
      );
      if (selectedClient) {
        setLicenseData((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }
      dispatch(getLocationByClient(value));
    }
  };
  

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };
  
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const handleSave = (e) => {
    e.preventDefault();

    const formattedLicenseData = {
      ...licenseData,
      start_date: formatDateToDDMMYYYY(licenseData.start_date),
      expiration_date: formatDateToDDMMYYYY(licenseData.expiration_date),
    };

    dispatch(updateLicense(formattedLicenseData, navigate));
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Edit License Information</h2>
            {loadingDetails ? (
                    <div className="flex justify-center items-center h-screen">
                     <img className="w-20 h-20" src={Loader} alt="Loading..." />
                   </div>
                ) : (
            <form onSubmit={handleSave}>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col mb-4">
                    <label htmlFor="client_id" className="mr-2">
                      Choose Customer:
                    </label>
                    <select
                      id="client_id"
                      name="client_id"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={licenseData.client_id}
                      onChange={handleChange}
                      disabled={!access?.includes(user_type) || loadingClients}
                    >
                      <option value="">Select a customer</option>
                      {loadingClients ? (
                        <option value="" disabled>
                          Loading...
                        </option>
                      ) : (
                        clients?.data?.map((client) => (
                          <option
                            key={client.client_id}
                            value={client.client_id}
                          >
                            {client.company_name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col mb-4">
                    <label htmlFor="location_id" className="mr-2">
                      Choose Location:
                    </label>
                    <select
                      id="location_id"
                      name="location_id"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={licenseData.location_id}
                      onChange={handleChange}
                      disabled={!access?.includes(user_type) || loadingLocations}
                    >
                      <option value="">Select a location</option>
                      {loadingLocations ? (
                        <option value="" disabled>
                          Loading...
                        </option>
                      ) : (
                        clientLocations?.map((location) => (
                          <option
                            key={location.location_id}
                            value={location.location_id}
                          >
                            {location.address_line_one} {location.address_line_two}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col mb-4">
                  <label htmlFor="quantity" className="mr-2">
                    Quantity of Licenses:
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.quantity}
                    onChange={handleChange}
                    disabled={!access?.includes(user_type)}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="manufacturer" className="mr-2">
                    Manufacturer:
                  </label>
                  <input
                    type="text"
                    id="manufacturer"
                    name="manufacturer"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.manufacturer}
                    onChange={handleChange}
                    disabled={!access?.includes(user_type)}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="license_type" className="mr-2">
                    License Type:
                  </label>
                  <input
                    type="text"
                    id="license_type"
                    name="license_type"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.license_type}
                    onChange={handleChange}
                    disabled={!access?.includes(user_type)}
                    required
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="start_date" className="mr-2">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.start_date}
                    onChange={handleChange}
                    // min={getTodayDate()}
                    required
                    disabled={!access?.includes(user_type)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="expiration_date" className="mr-2">
                    Expiration Date:
                  </label>
                  <input
                    type="date"
                    id="expiration_date"
                    name="expiration_date"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.expiration_date}
                    onChange={handleChange}
                    // min={getTodayDate()}
                    required
                    disabled={!access?.includes(user_type)}
                  />
                </div>
                {access.includes(user_type) && (
                  <div className="flex flex-col mb-4">
                    <label htmlFor="idr_cost" className="mr-2">
                      IDR Cost:
                    </label>
                    <input
                      type="number"
                      id="idr_cost"
                      name="idr_cost"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={licenseData.idr_cost}
                      onChange={handleChange}
                      disabled={!access?.includes(user_type)}
                      required
                    />
                  </div>
                )}
               {(user_type!== "IDR Employee") &&
                <div className="flex flex-col mb-4">
                  <label htmlFor="sale_cost" className="mr-2">
                    Sale Price:
                  </label>
                  <input
                    type="number"
                    id="sale_cost"
                    name="sale_cost"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.sale_cost}
                    onChange={handleChange}
                    disabled={!access?.includes(user_type)}
                    required
                  />
                </div>}
              </div>
              <div className="flex justify-end mb-4">
                {access?.includes(user_type) &&
                  <button
                  type="submit"
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                  disabled={loading}
                >
                  {loading ? "Saving" : "Update License"}
                </button>}
                <button
                  onClick={() => navigate('/client-licensing')}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                >
                  Cancel
                </button>
              </div>
            </form> )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditLicense;
