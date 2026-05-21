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
  getClients,
} from "../../actions/clientActions";

import {
  getLocationByClient,
} from "../../actions/locationActions";

import {
  createLicense,
} from "../../actions/licenseActions";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  MdBusiness,
  MdLocationOn,
  MdNumbers,
  MdCalendarToday,
  MdAttachMoney,
  MdArrowBack,
  MdAdd,
  MdVpnKey,
} from "react-icons/md";

const CreateLicense = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const {
    clientId,
    locationId,
  } = useParams();

  const [searchParams] =
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

  const {
    user_type,
  } = useSelector(
    (state) =>
      state.user.user,
  );

  const { loading } =
    useSelector(
      (state) =>
        state.license,
    );

  // FORM DATA
  const [
    licenseData,
    setLicenseData,
  ] = useState({
    client_id:
      clientId &&
      clientId !== "null"
        ? clientId
        : "",

    client_name: "",

    location_id:
      locationId &&
      locationId !== "null"
        ? locationId
        : "",

    quantity: "",
    manufacturer: "",
    license_type: "",
    start_date: "",
    expiration_date:
      "",
    idr_cost: "",
    sale_cost: "",
  });

  // FETCH CLIENTS
  useEffect(() => {
    if (
      user_type !==
      "Client Employee"
    ) {
      dispatch(
        getClients(),
      );
    }
  }, [
    dispatch,
    user_type,
  ]);

  // FETCH LOCATIONS
  useEffect(() => {
    if (
      licenseData?.client_id
    ) {
      dispatch(
        getLocationByClient(
          licenseData?.client_id,
        ),
      );
    }
  }, [
    dispatch,
    licenseData?.client_id,
  ]);

  // SET CLIENT NAME
  useEffect(() => {
    if (
      clientId &&
      clients?.data?.length
    ) {
      const selectedClient =
        clients.data.find(
          (client) =>
            client.client_id ===
            clientId,
        );

      if (
        selectedClient
      ) {
        setLicenseData(
          (prev) => ({
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
        setLicenseData(
          (prev) => ({
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
  const handleChange = (
    e,
  ) => {
    const {
      name,
      value,
    } = e.target;

    setLicenseData(
      (prev) => ({
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
        setLicenseData(
          (prev) => ({
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
      "location_id"
    ) {
      setLicenseData(
        (prev) => ({
          ...prev,
          location_id:
            value,
        }),
      );
    }
  };

  // DATE FORMAT
  const formatDateToDDMMYYYY =
    (
      date,
    ) => {
      if (!date)
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

  // SAVE
  const handleSave = (
    e,
  ) => {
    e.preventDefault();

    const formattedLicenseData =
      {
        ...licenseData,

        start_date:
          formatDateToDDMMYYYY(
            licenseData.start_date,
          ),

        expiration_date:
          formatDateToDDMMYYYY(
            licenseData.expiration_date,
          ),
      };

    if (
      user_type ===
      "Client Employee"
    ) {
      delete formattedLicenseData.client_id;

      delete formattedLicenseData.location_id;

      delete formattedLicenseData.client_name;
    }

    dispatch(
      createLicense(
        formattedLicenseData,
        navigate,
      ),
    );

    // RESET
    setLicenseData(
      (prev) => ({
        ...prev,
        quantity: "",
        manufacturer:
          "",
        license_type:
          "",
        start_date:
          "",
        expiration_date:
          "",
        idr_cost: "",
        sale_cost: "",
      }),
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
        licenseData.client_id &&
        !params.has(
          "client_id",
        )
      ) {
        params.set(
          "client_id",
          licenseData.client_id,
        );
      }

      if (
        licenseData.location_id &&
        !params.has(
          "location_id",
        )
      ) {
        params.set(
          "location_id",
          licenseData.location_id,
        );
      }

      const queryString =
        params.toString();

      navigate(
        `/client-licensing${
          queryString
            ? `?${queryString}`
            : ""
        }`,
      );
    };

  // COMMON STYLES
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
                Create License
              </h1>

              <p className="text-gray-500 mt-1">
                Add and manage
                client licensing
                information
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                form="createLicenseForm"
                disabled={
                  loading
                }
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
              >
                <MdAdd size={20} />

                {loading
                  ? "Saving..."
                  : "Create License"}
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
              id="createLicenseForm"
              onSubmit={
                handleSave
              }
              className="p-8"
            >
              {/* SECTION TITLE */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <MdVpnKey size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1E1B4B]">
                    License
                    Information
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Enter licensing
                    details below
                  </p>
                </div>
              </div>

              {/* CLIENT INFO */}
              {user_type !==
                "Client Employee" && (
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
                          name="client_id"
                          value={
                            licenseData.client_id
                          }
                          onChange={
                            handleChange
                          }
                          required
                          disabled={
                            loadingClients
                          }
                          className={`${inputClass} pl-12`}
                        >
                          <option value="">
                            Select a
                            customer
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
                        Select
                        Location
                      </label>

                      <div className="relative">
                        <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          name="location_id"
                          value={
                            licenseData.location_id
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            loadingLocations
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
              )}

              {/* LICENSE DETAILS */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    License Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* QUANTITY */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Quantity
                    </label>

                    <div className="relative">
                      <MdNumbers className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="number"
                        name="quantity"
                        value={
                          licenseData.quantity
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </div>

                  {/* MANUFACTURER */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Manufacturer
                    </label>

                    <div className="relative">
                      <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="manufacturer"
                        value={
                          licenseData.manufacturer
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </div>

                  {/* LICENSE TYPE */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      License Type
                    </label>

                    <div className="relative">
                      <MdVpnKey className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="license_type"
                        value={
                          licenseData.license_type
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </div>

                  {/* START DATE */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Start Date
                    </label>

                    <div className="relative">
                      <MdCalendarToday className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="date"
                        name="start_date"
                        value={
                          licenseData.start_date
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </div>

                  {/* EXPIRATION */}
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
                          licenseData.expiration_date
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </div>

                  {/* IDR COST */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      IDR Cost
                    </label>

                    <div className="relative">
                      <MdAttachMoney className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="number"
                        name="idr_cost"
                        value={
                          licenseData.idr_cost
                        }
                        onChange={
                          handleChange
                        }
                        required
                        className={`${inputClass} pl-12`}
                      />
                    </div>
                  </div>

                  {/* SALE PRICE */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Sale Price
                    </label>

                    <div className="relative">
                      <MdAttachMoney className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="number"
                        name="sale_cost"
                        value={
                          licenseData.sale_cost
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateLicense;