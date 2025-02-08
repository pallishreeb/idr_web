import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import {
  getServiceAgreementDetails,
  updateServiceAgreement,
} from "../../actions/serviceAgreement";
import {  useNavigate, useParams } from "react-router-dom";
import Loader from "../../Images/ZZ5H.gif";
const EditServiceAgreement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { agreementId } = useParams();

  const clients = useSelector((state) => state.client.clients);
  const clientLocations = useSelector((state) => state.location.locations);
  const loadingClients = useSelector((state) => state.client.loading);
  const loadingLocations = useSelector((state) => state.location.loading);
  const { loadingDetails, loading } = useSelector(
    (state) => state.serviceAgreement
  );
  const { user_type ,client_type} = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const [serviceAgreement, setServiceAgreement] = useState({
    client_id: "",
    client_name: "",
    location_id: "",
    start_date: "",
    expiration_date: "",
    parts_covered: "",
    price: "",
    service_details: "",
  });

  const [selectedClientLocation, setSelectedClientLocation] = useState("");

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    if (agreementId) {
      dispatch(getServiceAgreementDetails(agreementId)).then((data) => {
        if (data) {
          setServiceAgreement({
            client_id: data.client_id || "",
            client_name: data.client_name || "",
            location_id: data.location_id || "",
            start_date: formatDateToYYYYMMDD(data.start_date) || "",
            expiration_date: formatDateToYYYYMMDD(data.expiration_date) || "",
            parts_covered: data.parts_covered === true ? "true" : "false",
            price: data.price || "",
            service_details: data.service_details || "",
          });
          setSelectedClientLocation(data.location_id || "");
          if (data.client_id) {
            dispatch(getLocationByClient(data.client_id));
          }
        }
      });
    }
  }, [dispatch, agreementId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceAgreement((prev) => ({ ...prev, [name]: value }));

    if (name === "client_id") {
      const selectedClient = clients?.data?.find(
        (client) => client.client_id === value
      );
      if (selectedClient) {
        setServiceAgreement((prev) => ({
          ...prev,
          client_name: selectedClient.company_name,
        }));
      }
      dispatch(getLocationByClient(value));
    }

    if (name === "selected_client_location") {
      setSelectedClientLocation(value);
      setServiceAgreement((prev) => ({ ...prev, location_id: value }));
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

    delete serviceAgreement?.selected_client_location;
    const formattedServiceAgreement = {
      ...serviceAgreement,
      start_date: formatDateToDDMMYYYY(serviceAgreement.start_date),
      expiration_date: formatDateToDDMMYYYY(serviceAgreement.expiration_date),
      agreement_id: agreementId,
    };

    dispatch(updateServiceAgreement(formattedServiceAgreement, navigate));
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleCancel = () => {
    navigate(-1); // Go to the previous page
    console.log("inside handle cancel")
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          {loadingDetails ? (
            <div className="flex justify-center items-center h-screen">
              <img className="w-20 h-20" src={Loader} alt="Loading..." />
            </div>
          ) : (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Edit Client Service Agreement
              </h2>
              <form onSubmit={handleSave}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col mb-4">
                    <label htmlFor="client_id" className="mr-2">
                      Select Client:
                    </label>
                    <select
                      id="client_id"
                      name="client_id"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={serviceAgreement.client_id}
                      onChange={handleChange}
                      required
                      disabled={loadingClients || user_type !== "Admin"}
                    >
                      <option value="">Select a client</option>
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
                    <label htmlFor="selected_client_location" className="mr-2">
                      Select Client Location:
                    </label>
                    <select
                      id="selected_client_location"
                      name="selected_client_location"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={selectedClientLocation}
                      onChange={handleChange}
                      disabled={loadingLocations || user_type !== "Admin"}
                    >
                      <option value="">Select a client location</option>
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
                      htmlFor="start_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date*
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={serviceAgreement.start_date}
                      onChange={handleChange}
                      // min={getTodayDate()}
                      required
                      disabled={user_type !== "Admin"}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="expiration_date"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiration Date*
                    </label>
                    <input
                      type="date"
                      name="expiration_date"
                      className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 w-full"
                      value={serviceAgreement.expiration_date}
                      onChange={handleChange}
                      // min={getTodayDate()}
                      required
                      disabled={user_type !== "Admin"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="parts_covered"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Parts Covered
                    </label>
                    <select
                      name="parts_covered"
                      className="border border-gray-300 rounded px-3 py-1 w-full"
                      value={serviceAgreement.parts_covered}
                      onChange={handleChange}
                      required
                      disabled={user_type !== "Admin"} 
                    >
                      <option value="">Select</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  {(access.includes(user_type) || client_type !== "User" ) &&  (
                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Annual Sale Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        value={serviceAgreement.price}
                        onChange={handleChange}
                        required
                        disabled={user_type !== "Admin"}
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label
                      htmlFor="service_details"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Service Agreement Details
                    </label>
                    <textarea
                      name="service_details"
                      rows={5}
                      className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                      value={serviceAgreement.service_details}
                      onChange={handleChange}
                      readOnly={user_type !== "Admin"}
                    />
                  </div>
                </div>
                {user_type === "Admin" && (
                <div className="flex justify-end mb-4">
                  
                    <button
                      type="submit"
                      className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                      disabled={loading}
                    >
                      {loading ? "Saving" : "Update Service Agreement"}
                    </button>
                  
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditServiceAgreement;
