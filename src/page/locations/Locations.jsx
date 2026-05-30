/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Swal from "sweetalert2";

import {
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdEmail,
  MdPhone,
  MdAdd,
  MdSearch,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  getClients,
} from "../../actions/clientActions";

import {
  getLocationByClient,
  deleteLocation,
} from "../../actions/locationActions";

import Loader from "../../Images/ZZ5H.gif";

const Locations =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const locationState =
      useLocation();

    // STATES
    const [
      selectedClient,
      setSelectedClient,
    ] = useState(
      null,
    );

    const [
      sortConfig,
      setSortConfig,
    ] = useState({
      key: "",
      direction:
        "ASC",
    });

    // REDUX
    const clients =
      useSelector(
        (state) =>
          state.client.clients,
      );

    const locations =
      useSelector(
        (state) =>
          state.location.locations,
      );

    const loadinglocations =
      useSelector(
        (state) =>
          state.location.loading,
      );

    const {
      user_type,
    } =
      useSelector(
        (state) =>
          state.user.user,
      );

    // FETCH CLIENTS
    useEffect(() => {
      dispatch(
        getClients(),
      );
    }, [
      dispatch,
    ]);

    // PREFILL CLIENT
    useEffect(() => {
      if (
        locationState.state
          ?.selectedClient
      ) {
        setSelectedClient(
          locationState
            .state
            .selectedClient,
        );

        dispatch(
          getLocationByClient(
            locationState
              .state
              .selectedClient,
          ),
        );
      }
    }, []);

    // CLIENT CHANGE
    const handleClientChange =
      (
        clientId,
      ) => {
        setSelectedClient(
          clientId,
        );

        dispatch(
          getLocationByClient(
            clientId,
          ),
        );
      };

    // SORT
    const handleSort =
      (key) => {
        let direction =
          "ASC";

        if (
          sortConfig.key ===
            key &&
          sortConfig.direction ===
            "ASC"
        ) {
          direction =
            "DESC";
        }

        setSortConfig({
          key,
          direction,
        });

        dispatch(
          getLocationByClient(
            selectedClient,
            {
              sortBy:
                key,
              orderBy:
                direction,
            },
          ),
        );
      };

    // EDIT
    const handleEdit =
      (
        locationId,
      ) => {
        navigate(
          `/edit-location/${locationId}`,
          {
            state: {
              selectedClient,
            },
          },
        );
      };

    // DELETE
    const handleDeleteLocation =
      (
        locationId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",
          text: "Do you really want to delete this location?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText:
            "Yes, delete it!",
          cancelButtonText:
            "No, keep it",
          confirmButtonColor:
            "#EF4444",
        }).then(
          (
            result,
          ) => {
            if (
              result.isConfirmed
            ) {
              dispatch(
                deleteLocation(
                  locationId,
                ),
              ).then(
                () => {
                  dispatch(
                    getLocationByClient(
                      selectedClient,
                    ),
                  );
                },
              );
            }
          },
        );
      };

    // SORT SYMBOL
    const getSortSymbol =
      (key) => {
        if (
          sortConfig.key ===
          key
        ) {
          return sortConfig.direction ===
            "ASC"
            ? "▲"
            : "▼";
        }

        return "↕";
      };

    return (
      <>
        <Header />

        <div className="flex">
          <AdminSideNavbar />

          <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-8">
            {/* PAGE HEADER */}
            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                  Client
                  Locations
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage client
                  locations,
                  contact
                  details and
                  addresses
                </p>
              </div>

              {/* SUMMARY */}
              <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 px-6 py-4 min-w-[220px]">
                <p className="text-sm text-gray-500 mb-1">
                  Total
                  Locations
                </p>

                <h2 className="text-3xl font-bold text-[#1E1B4B]">
                  {locations?.length ||
                    0}
                </h2>
              </div>
            </div>

            {/* FILTER CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-6 mb-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Client
                  Selection
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5 items-end">
                {/* CLIENT DROPDOWN */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select
                    Client To
                    View
                    Locations
                  </label>

                  <div className="relative">
                    <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <select
                      id="client"
                      value={
                        selectedClient ||
                        ""
                      }
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                      onChange={(
                        e,
                      ) =>
                        handleClientChange(
                          e
                            .target
                            .value,
                        )
                      }
                    >
                      <option value="">
                        Select a
                        client
                      </option>

                      {clients?.data?.map(
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
                      )}
                    </select>
                  </div>
                </div>

                {/* ADD BUTTON */}
                {selectedClient && (
                  <div>
                    <Link
                      to={`/add-location/${selectedClient}`}
                      state={{
                        selectedClient,
                      }}
                    >
                      <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        <MdAdd size={20} />
                        Add New
                        Location
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* TABLE SECTION */}
            {selectedClient !==
              null && (
              <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
                {/* TOP BAR */}
                <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Locations
                      for{" "}
                      {
                        clients?.data?.find(
                          (
                            client,
                          ) =>
                            client.client_id ===
                            selectedClient,
                        )
                          ?.company_name
                      }
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      View and
                      manage
                      client
                      locations
                    </p>
                  </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  {loadinglocations ? (
                    <div className="flex justify-center items-center py-20">
                      <img
                        src={
                          Loader
                        }
                        alt="Loading..."
                        className="h-16 w-16"
                      />
                    </div>
                  ) : (
                    <table className="w-full min-w-[1200px]">
                      <thead className="bg-indigo-50">
                        <tr>
                          <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                            Client
                          </th>

                          <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                            Contact
                            Person
                          </th>

                          <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                            Email
                            ID
                          </th>

                          <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                            Phone
                            Number
                          </th>

                          <th
                            onClick={() =>
                              handleSort(
                                "address_line_one",
                              )
                            }
                            className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              Address{" "}
                              {
                                getSortSymbol(
                                  "address_line_one",
                                )
                              }
                            </div>
                          </th>

                          <th
                            onClick={() =>
                              handleSort(
                                "state",
                              )
                            }
                            className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                          >
                            <div className="flex items-center gap-1">
                              State{" "}
                              {
                                getSortSymbol(
                                  "state",
                                )
                              }
                            </div>
                          </th>

                          <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                            Zipcode
                          </th>

                          <th className="px-4 py-4 text-center text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {locations?.length ===
                        0 ? (
                          <tr>
                            <td
                              colSpan={
                                8
                              }
                              className="py-16"
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                                  <MdSearch className="text-4xl text-indigo-400" />
                                </div>

                                <h3 className="text-lg font-semibold text-[#1E1B4B]">
                                  No
                                  Locations
                                  Found
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                  No
                                  locations
                                  available
                                  for this
                                  client.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          locations &&
                          [
                            ...locations,
                          ]
                            .sort(
                              (
                                a,
                                b,
                              ) => {
                                if (
                                  sortConfig.key ===
                                    "address_line_one" ||
                                  sortConfig.key ===
                                    "state"
                                ) {
                                  return sortConfig.direction ===
                                    "ASC"
                                    ? a[
                                        sortConfig.key
                                      ].localeCompare(
                                        b[
                                          sortConfig.key
                                        ],
                                      )
                                    : b[
                                        sortConfig.key
                                      ].localeCompare(
                                        a[
                                          sortConfig.key
                                        ],
                                      );
                                }

                                return 0;
                              },
                            )
                            .map(
                              (
                                location,
                              ) => (
                                <tr
                                  key={
                                    location.location_id
                                  }
                                  className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                                >
                                  {/* CLIENT */}
                                  <td className="px-4 py-5">
                                    <div className="font-semibold text-[#1E1B4B]">
                                      {
                                        clients?.data?.find(
                                          (
                                            client,
                                          ) =>
                                            client.client_id ===
                                            location.client_id,
                                        )
                                          ?.company_name
                                      }
                                    </div>
                                  </td>

                                  {/* CONTACT */}
                                  <td className="px-4 py-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                      <MdPerson className="text-indigo-500" />

                                      {
                                        location.contact_person_firstname
                                      }{" "}
                                      {
                                        location.contact_person_lastname
                                      }
                                    </div>
                                  </td>

                                  {/* EMAIL */}
                                  <td className="px-4 py-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <MdEmail className="text-indigo-500" />

                                      {
                                        location.contact_person_mail_id
                                      }
                                    </div>
                                  </td>

                                  {/* PHONE */}
                                  <td className="px-4 py-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <MdPhone className="text-indigo-500" />

                                      {location.phone_number ||
                                        "NA"}
                                    </div>
                                  </td>

                                  {/* ADDRESS */}
                                  <td className="px-4 py-5">
                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                      <MdLocationOn className="text-indigo-500 mt-1" />

                                      <div>
                                        <div>
                                          {
                                            location?.address_line_one
                                          }
                                        </div>

                                        <div>
                                          {
                                            location?.address_line_two
                                          }
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* STATE */}
                                  <td className="px-4 py-5 text-sm text-gray-600">
                                    {
                                      location.state
                                    }
                                  </td>

                                  {/* ZIPCODE */}
                                  <td className="px-4 py-5 text-sm text-gray-600">
                                    {
                                      location.zipcode
                                    }
                                  </td>

                                  {/* ACTIONS */}
                                  <td className="px-4 py-5">
                                    <div className="flex items-center justify-center gap-3">
                                      {/* EDIT */}
                                      <button
                                        onClick={() =>
                                          handleEdit(
                                            location.location_id,
                                          )
                                        }
                                        className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                                      >
                                        <BiSolidEditAlt size={18} />
                                      </button>

                                      {/* DELETE */}
                                      {user_type ===
                                        "Admin" && (
                                        <button
                                          onClick={() =>
                                            handleDeleteLocation(
                                              location.location_id,
                                            )
                                          }
                                          className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all duration-300"
                                        >
                                          <AiFillDelete size={18} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ),
                            )
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

export default Locations;