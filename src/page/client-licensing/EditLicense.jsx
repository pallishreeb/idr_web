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
  updateLicense,
  getLicenseDetails,
} from "../../actions/licenseActions";

import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import Loader from "../../Images/ZZ5H.gif";

import {
  MdBusiness,
  MdLocationOn,
  MdNumbers,
  MdCalendarToday,
  MdAttachMoney,
  MdArrowBack,
  MdSave,
  MdVpnKey,
  MdEdit,
} from "react-icons/md";

const EditLicense = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const [searchParams] =
    useSearchParams();

  const { licenseId } =
    useParams();

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
    client_type,
  } = useSelector(
    (state) =>
      state.user.user,
  );

  const { access } =
    useSelector(
      (state) =>
        state.user,
    );

  const {
    licenseDetails,
    loading,
    loadingDetails,
  } = useSelector(
    (state) =>
      state.license,
  );

  // FORM DATA
  const [
    licenseData,
    setLicenseData,
  ] = useState({
    license_id:
      licenseId,
    client_id: "",
    client_name: "",
    location_id: "",
    quantity: "",
    manufacturer: "",
    license_type: "",
    start_date: "",
    expiration_date:
      "",
    idr_cost: "",
    sale_cost: "",
  });

  // FETCH DETAILS
  useEffect(() => {
    dispatch(
      getLicenseDetails(
        licenseId,
      ),
    );

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
    licenseId,
    user_type,
  ]);

  // SET DETAILS
  useEffect(() => {
    if (
      licenseDetails
    ) {
      setLicenseData({
        license_id:
          licenseDetails.license_id ||
          "",

        client_id:
          licenseDetails.client_id ||
          "",

        client_name:
          licenseDetails.client_name ||
          "",

        location_id:
          licenseDetails.location_id ||
          "",

        quantity:
          licenseDetails.quantity ||
          "",

        manufacturer:
          licenseDetails.manufacturer ||
          "",

        license_type:
          licenseDetails.license_type ||
          "",

        idr_cost:
          licenseDetails.idr_cost ||
          "",

        sale_cost:
          licenseDetails.sale_cost ||
          "",

        start_date:
          formatDateToYYYYMMDD(
            licenseDetails.start_date,
          ) || "",

        expiration_date:
          formatDateToYYYYMMDD(
            licenseDetails.expiration_date,
          ) || "",
      });

      if (
        licenseDetails?.client_id
      ) {
        dispatch(
          getLocationByClient(
            licenseDetails?.client_id,
          ),
        );
      }
    }
  }, [
    licenseDetails,
    dispatch,
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
          }),
        );
      }

      dispatch(
        getLocationByClient(
          value,
        ),
      );
    }
  };

  // DATE FORMATTERS
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

  const formatDateToYYYYMMDD =
    (
      date,
    ) => {
      if (!date)
        return "";

      const [
        day,
        month,
        year,
      ] =
        date.split(
          "/",
        );

      return `${year}-${month}-${day}`;
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

    dispatch(
      updateLicense(
        formattedLicenseData,
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

      const hasExplicitFilters =
        params.has(
          "client_id",
        ) &&
        params.has(
          "location_id",
        );

      if (
        hasExplicitFilters
      ) {
        navigate(
          `/client-licensing?${params.toString()}`,
        );
      } else {
        navigate(
          "/client-licensing",
        );
      }
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
                Edit License
              </h1>

              <p className="text-gray-500 mt-1">
                Update license
                information and
                pricing details
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              {access?.includes(
                user_type,
              ) && (
                <button
                  type="submit"
                  form="editLicenseForm"
                  disabled={
                    loading
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                >
                  <MdSave size={20} />

                  {loading
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              )}

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

            {loadingDetails ? (
              <div className="flex justify-center items-center py-24">
                <img
                  className="w-20 h-20"
                  src={Loader}
                  alt="Loading..."
                />
              </div>
            ) : (
              <form
                id="editLicenseForm"
                onSubmit={
                  handleSave
                }
                className="p-8"
              >
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <MdEdit size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      License
                      Details
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Edit licensing
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
                          name="client_id"
                          value={
                            licenseData.client_id
                          }
                          onChange={
                            handleChange
                          }
                          disabled={
                            !access?.includes(
                              user_type,
                            ) ||
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
                            !access?.includes(
                              user_type,
                            ) ||
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

                {/* LICENSE DETAILS */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      License
                      Details
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
                          disabled={
                            !access?.includes(
                              user_type,
                            )
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
                          disabled={
                            !access?.includes(
                              user_type,
                            )
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
                        License
                        Type
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
                          disabled={
                            !access?.includes(
                              user_type,
                            )
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
                        Start
                        Date
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
                          disabled={
                            !access?.includes(
                              user_type,
                            )
                          }
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
                            licenseData.expiration_date
                          }
                          onChange={
                            handleChange
                          }
                          required
                          disabled={
                            !access?.includes(
                              user_type,
                            )
                          }
                          className={`${inputClass} pl-12`}
                        />
                      </div>
                    </div>

                    {/* IDR COST */}
                    {access.includes(
                      user_type,
                    ) && (
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
                            disabled={
                              !access?.includes(
                                user_type,
                              )
                            }
                            required
                            className={`${inputClass} pl-12`}
                          />
                        </div>
                      </div>
                    )}

                    {/* SALE PRICE */}
                    {user_type !==
                      "IDR Employee" && (
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
                            disabled={
                              !access?.includes(
                                user_type,
                              )
                            }
                            required
                            className={`${inputClass} pl-12`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditLicense;