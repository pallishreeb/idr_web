import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { createLicense } from "../../actions/licenseActions"; // Assuming you have this action
import { useNavigate } from "react-router-dom";


const CreateLicense = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const { user_type } = useSelector((state) => state.user.user);
  const { loading } = useSelector((state) => state.license);

  const [licenseData, setLicenseData] = useState({
    client_id: "",
    client_name: "",
    location_id: "",
    qty_licenses: "",
    manufacturer: "",
    license_type: "",
    start_date: "",
    expiration_date: "",
    idr_cost: "",
    sale_price: "",
  });

  const [selectedClientLocation, setSelectedClientLocation] = useState("");

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

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

    if (name === "selected_client_location") {
      setSelectedClientLocation(value);
      setLicenseData((prev) => ({ ...prev, location_id: value }));
    }
  };

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSave = (e) => {
    e.preventDefault();

    delete licenseData?.selected_client_location;
    const formattedLicenseData = {
      ...licenseData,
      start_date: formatDateToDDMMYYYY(licenseData.start_date),
      expiration_date: formatDateToDDMMYYYY(licenseData.expiration_date),
    };

    dispatch(createLicense(formattedLicenseData, navigate));
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Create License Information
            </h2>
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
                    required
                    disabled={loadingClients}
                  >
                    <option value="">Select a customer</option>
                    {loadingClients ? (
                      <option value="" disabled>
                        Loading...
                      </option>
                    ) : (
                      clients?.data?.map((client) => (
                        <option key={client.client_id} value={client.client_id}>
                          {client.company_name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="flex flex-col mb-4">
                  <label htmlFor="selected_client_location" className="mr-2">
                    Choose Location:
                  </label>
                  <select
                    id="selected_client_location"
                    name="selected_client_location"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={selectedClientLocation}
                    onChange={handleChange}
                    disabled={loadingLocations}
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
                          {location.address_line_one}{" "}
                          {location.address_line_two}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="qty_licenses"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Qty of Licenses
                  </label>
                  <input
                    type="number"
                    name="qty_licenses"
                    className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                    value={licenseData.qty_licenses}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="manufacturer"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    name="manufacturer"
                    className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                    value={licenseData.manufacturer}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="license_type"
                    className="block text-sm font-medium text-gray-700"
                  >
                    License Type
                  </label>
                  <select
                    name="license_type"
                    className="border border-gray-300 rounded px-3 py-1 w-full"
                    value={licenseData.license_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select License Type</option>
                    <option value="Standard">Standard</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                    value={licenseData.start_date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="expiration_date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    name="expiration_date"
                    className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                    value={licenseData.expiration_date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                  />
                </div>
                {user_type === "Admin" && (
                  <div>
                    <label
                      htmlFor="idr_cost"
                      className="block text-sm font-medium text-gray-700"
                    >
                      IDR Cost
                    </label>
                    <input
                      type="text"
                      name="idr_cost"
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      value={licenseData.idr_cost}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label
                    htmlFor="sale_price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sale Price
                  </label>
                  <input
                    type="text"
                    name="sale_price"
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    value={licenseData.sale_price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <button
                  type="submit"
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                  disabled={loading}
                >
                  {loading ? "Saving" : "Create License"}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLicense;
