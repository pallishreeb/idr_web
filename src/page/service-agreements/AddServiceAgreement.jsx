/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  generateServiceAgreement,
} from "../../actions/serviceAgreement";

import {
  getClients,
} from "../../actions/clientActions";

import {
  getLocationByClient,
} from "../../actions/locationActions";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  MdBusiness,
  MdLocationOn,
  MdCalendarToday,
  MdAttachMoney,
  MdDescription,
  MdBuild,
  MdArrowBack,
  MdAdd,
  MdAssignment,
} from "react-icons/md";

const AddServiceAgreement =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const {
      clientId,
      locationId,
    } = useParams();

    const [
      searchParams,
    ] =
      useSearchParams();

    // REDUX
    const clients =
      useSelector(
        (state) =>
          state.client.clients,
      );

    const clientLocations =
      useSelector(
        (state) =>
          state.location.locations,
      );

    const loadingClients =
      useSelector(
        (state) =>
          state.client.loading,
      );

    const loadingLocations =
      useSelector(
        (state) =>
          state.location.loading,
      );

    // STATE
    const [
      serviceAgreement,
      setServiceAgreement,
    ] = useState({
      client_id:
        clientId &&
        clientId !==
          "null"
          ? clientId
          : "",

      client_name:
        "",

      location_id:
        locationId &&
        locationId !==
          "null"
          ? locationId
          : "",

      start_date:
        "",

      expiration_date:
        "",

      parts_covered:
        "",

      price: "",

      service_details:
        "",
    });

    const [
      selectedClientLocation,
      setSelectedClientLocation,
    ] = useState(
      "",
    );

    // FETCH CLIENTS
    useEffect(() => {
      dispatch(
        getClients(),
      );
    }, [
      dispatch,
    ]);

    // FETCH LOCATIONS
    useEffect(() => {
      if (
        serviceAgreement?.client_id
      ) {
        dispatch(
          getLocationByClient(
            serviceAgreement?.client_id,
          ),
        );
      }
    }, [
      dispatch,
      serviceAgreement?.client_id,
    ]);

    // PRESELECT CLIENT
    useEffect(() => {
      if (
        clientId &&
        clients?.data
          ?.length
      ) {
        const selectedClient =
          clients.data.find(
            (
              client,
            ) =>
              client.client_id ===
              clientId,
          );

        if (
          selectedClient
        ) {
          setServiceAgreement(
            (
              prev,
            ) => ({
              ...prev,
              client_name:
                selectedClient.company_name,
            }),
          );

          dispatch(
            getLocationByClient(
              clientId,
            ),
          );
        }
      }
    }, [
      clientId,
      clients,
      dispatch,
    ]);

    // PRESELECT LOCATION
    useEffect(() => {
      if (
        locationId &&
        clientLocations?.length
      ) {
        const selectedLocation =
          clientLocations.find(
            (
              location,
            ) =>
              location.location_id ===
              locationId,
          );

        if (
          selectedLocation
        ) {
          setServiceAgreement(
            (
              prev,
            ) => ({
              ...prev,
              location_id:
                selectedLocation.location_id,
            }),
          );
        }
      }
    }, [
      locationId,
      clientLocations,
    ]);

    // CHANGE HANDLER
    const handleChange =
      (e) => {
        const {
          name,
          value,
        } = e.target;

        setServiceAgreement(
          (
            prev,
          ) => ({
            ...prev,
            [name]:
              value,
          }),
        );

        if (
          name ===
          "client_id"
        ) {
          const selectedClient =
            clients?.data?.find(
              (
                client,
              ) =>
                client.client_id ===
                value,
            );

          if (
            selectedClient
          ) {
            setServiceAgreement(
              (
                prev,
              ) => ({
                ...prev,
                client_name:
                  selectedClient.company_name,

                location_id:
                  "",
              }),
            );
          }

          dispatch(
            getLocationByClient(
              value,
            ),
          );
        }

        if (
          name ===
          "selected_client_location"
        ) {
          setSelectedClientLocation(
            value,
          );

          setServiceAgreement(
            (
              prev,
            ) => ({
              ...prev,
              location_id:
                value,
            }),
          );
        }
      };

    // SAVE
    const handleSave =
      (e) => {
        e.preventDefault();

        delete serviceAgreement?.selected_client_location;

        const formatDateToDDMMYYYY =
          (
            date,
          ) => {
            if (
              !date
            )
              return "";

            const [
              year,
              month,
              day,
            ] =
              date.split(
                "-",
              );

            return `${day}/${month}/${year}`;
          };

        const formattedServiceAgreement =
          {
            ...serviceAgreement,

            start_date:
              formatDateToDDMMYYYY(
                serviceAgreement.start_date,
              ),

            expiration_date:
              formatDateToDDMMYYYY(
                serviceAgreement.expiration_date,
              ),
          };

        dispatch(
          generateServiceAgreement(
            formattedServiceAgreement,
            navigate,
          ),
        );
      };

    // BACK
    const handleBack =
      () => {
        const params =
          new URLSearchParams(
            searchParams,
          );

        if (
          clientId &&
          clientId !==
            "null"
        ) {
          params.set(
            "client_id",
            clientId,
          );
        }

        if (
          locationId &&
          locationId !==
            "null"
        ) {
          params.set(
            "location_id",
            locationId,
          );
        }

        navigate(
          `/service-agreements?${params.toString()}`,
        );
      };

    // COMMON CLASSES
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    return (
      <>
        <Header />

        <div className="flex">
          <AdminSideNavbar />

          <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-8">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                  Add Service
                  Agreement
                </h1>

                <p className="text-gray-500 mt-1">
                  Create and
                  manage new
                  client service
                  agreements
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  form="addServiceAgreementForm"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <MdAdd size={20} />
                  Add Agreement
                </button>

                <button
                  type="button"
                  onClick={
                    handleBack
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  <MdArrowBack size={20} />
                  Back
                </button>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <form
                id="addServiceAgreementForm"
                onSubmit={
                  handleSave
                }
                className="p-8"
              >
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <MdAssignment size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Agreement
                      Details
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Enter service
                      agreement
                      information
                    </p>
                  </div>
                </div>

                {/* CLIENT INFO */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Client
                      Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CLIENT */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Select
                        Client
                      </label>

                      <div className="relative">
                        <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          id="client_id"
                          name="client_id"
                          value={
                            serviceAgreement.client_id
                          }
                          onChange={
                            handleChange
                          }
                          required
                          className={`${inputClass} pl-12`}
                        >
                          <option value="">
                            Select a
                            client
                          </option>

                          {loadingClients ? (
                            <option disabled>
                              Loading...
                            </option>
                          ) : (
                            clients?.data?.map(
                              (
                                client,
                              ) => (
                                <option
                                  key={
                                    client.client_id
                                  }
                                  value={
                                    client.client_id
                                  }
                                >
                                  {
                                    client.company_name
                                  }
                                </option>
                              ),
                            )
                          )}
                        </select>
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Client
                        Location
                      </label>

                      <div className="relative">
                        <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          id="selected_client_location"
                          name="selected_client_location"
                          value={
                            serviceAgreement?.location_id
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12`}
                        >
                          <option value="">
                            Select a
                            location
                          </option>

                          {loadingLocations ? (
                            <option disabled>
                              Loading...
                            </option>
                          ) : (
                            clientLocations?.map(
                              (
                                location,
                              ) => (
                                <option
                                  key={
                                    location.location_id
                                  }
                                  value={
                                    location.location_id
                                  }
                                >
                                  {
                                    location.address_line_one
                                  }{" "}
                                  {
                                    location.address_line_two
                                  }
                                </option>
                              ),
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AGREEMENT DETAILS */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Agreement
                      Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {/* START DATE */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Start
                        Date
                      </label>

                      <div className="relative">
                        <MdCalendarToday className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="date"
                          name="start_date"
                          value={
                            serviceAgreement.start_date
                          }
                          onChange={
                            handleChange
                          }
                          required
                          className={`${inputClass} pl-12`}
                        />
                      </div>
                    </div>

                    {/* EXPIRATION DATE */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Expiration
                        Date
                      </label>

                      <div className="relative">
                        <MdCalendarToday className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="date"
                          name="expiration_date"
                          value={
                            serviceAgreement.expiration_date
                          }
                          onChange={
                            handleChange
                          }
                          required
                          className={`${inputClass} pl-12`}
                        />
                      </div>
                    </div>

                    {/* PARTS COVERED */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Parts
                        Covered
                      </label>

                      <div className="relative">
                        <MdBuild className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          name="parts_covered"
                          value={
                            serviceAgreement.parts_covered
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12`}
                        >
                          <option value="">
                            Select
                          </option>

                          <option value="true">
                            Yes
                          </option>

                          <option value="false">
                            No
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* PRICE */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Annual Sale
                        Price
                      </label>

                      <div className="relative">
                        <MdAttachMoney className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="number"
                          name="price"
                          value={
                            serviceAgreement.price
                          }
                          onChange={
                            handleChange
                          }
                          required
                          className={`${inputClass} pl-12`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* SERVICE DETAILS */}
                  <div className="mt-8">
                    <label
                      className={
                        labelClass
                      }
                    >
                      Service
                      Agreement
                      Details
                    </label>

                    <div className="relative">
                      <MdDescription className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <textarea
                        name="service_details"
                        rows={
                          6
                        }
                        value={
                          serviceAgreement.service_details
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} pl-12 pt-4 resize-none`}
                        placeholder="Enter agreement details..."
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    );
  };

export default AddServiceAgreement;