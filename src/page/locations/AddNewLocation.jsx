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
  addLocation,
} from "../../actions/locationActions";

import {
  getClients,
} from "../../actions/clientActions";

import {
  toast,
} from "react-toastify";

import {
  MdBusiness,
  MdLocationOn,
  MdPhone,
  MdAdd,
  MdDelete,
  MdSave,
  MdHomeWork,
} from "react-icons/md";

const AddLocationPage =
  () => {
    const dispatch =
      useDispatch();

    // REDUX
    const clients =
      useSelector(
        (state) =>
          state.client.clients,
      );

    const [
      selectedClient,
      setSelectedClient,
    ] = useState(
      "",
    );

    const [
      locations,
      setLocations,
    ] = useState([
      {
        address1:
          "",
        address2:
          "",
        address3:
          "",
        city: "",
        state:
          "",
        zipcode:
          "",
        faxNumber:
          "",
        phoneNumber:
          "",
        cellNumber:
          "",
      },
    ]);

    // FETCH CLIENTS
    useEffect(() => {
      dispatch(
        getClients(),
      );
    }, [
      dispatch,
    ]);

    // CLIENT CHANGE
    const handleClientChange =
      (
        clientId,
      ) => {
        setSelectedClient(
          clientId,
        );
      };

    // INPUT CHANGE
    const handleChange =
      (
        index,
        e,
      ) => {
        const {
          name,
          value,
        } = e.target;

        const updatedLocations =
          [
            ...locations,
          ];

        updatedLocations[
          index
        ] = {
          ...updatedLocations[
            index
          ],
          [name]:
            value,
        };

        setLocations(
          updatedLocations,
        );
      };

    // ADD MORE
    const handleAddMore =
      () => {
        setLocations([
          ...locations,
          {
            address1:
              "",
            address2:
              "",
            address3:
              "",
            city: "",
            state:
              "",
            zipcode:
              "",
            faxNumber:
              "",
            phoneNumber:
              "",
            cellNumber:
              "",
          },
        ]);
      };

    // SAVE
    const handleSave =
      () => {
        if (
          selectedClient ===
          ""
        ) {
          toast.error(
            "Please select a client",
          );

          return;
        }

        dispatch(
          addLocation(
            selectedClient,
            locations,
          ),
        );

        // RESET
        setSelectedClient(
          "",
        );

        setLocations([
          {
            address1:
              "",
            address2:
              "",
            address3:
              "",
            city: "",
            state:
              "",
            zipcode:
              "",
            faxNumber:
              "",
            phoneNumber:
              "",
            cellNumber:
              "",
          },
        ]);
      };

    // REMOVE LOCATION
    const handleCancel =
      (
        index,
      ) => {
        if (
          locations.length ===
          1
        ) {
          return;
        }

        const updatedLocations =
          [
            ...locations,
          ];

        updatedLocations.splice(
          index,
          1,
        );

        setLocations(
          updatedLocations,
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

          <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-4 md:p-8">
            {/* PAGE HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                  Add Client
                  Locations
                </h1>

                <p className="text-gray-500 mt-1">
                  Create and
                  manage
                  multiple
                  client
                  locations
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={
                    handleAddMore
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                >
                  <MdAdd size={20} />
                  Add More
                </button>

                <button
                  onClick={
                    handleSave
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <MdSave size={20} />
                  Save
                  Locations
                </button>
              </div>
            </div>

            {/* CLIENT SELECT CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-6 mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                  Client
                  Selection
                </h2>
              </div>

              <div className="max-w-2xl">
                <label
                  htmlFor="client"
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
                    id="client"
                    className={`${inputClass} pl-12`}
                    value={
                      selectedClient
                    }
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
            </div>

            {/* LOCATION FORMS */}
            <div className="space-y-8">
              {locations.map(
                (
                  location,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden"
                  >
                    {/* TOP BAR */}
                    <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

                    <div className="p-6 md:p-8">
                      {/* CARD HEADER */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] flex items-center justify-center text-white shadow-lg">
                            <MdHomeWork size={24} />
                          </div>

                          <div>
                            <h2 className="text-2xl font-bold text-[#1E1B4B]">
                              Location{" "}
                              {index +
                                1}
                            </h2>

                            <p className="text-gray-500 text-sm">
                              Enter
                              location
                              details
                            </p>
                          </div>
                        </div>

                        {index !==
                          0 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCancel(
                                index,
                              )
                            }
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold transition-all duration-300"
                          >
                            <MdDelete size={18} />
                            Remove
                          </button>
                        )}
                      </div>

                      {/* ADDRESS SECTION */}
                      <div className="mb-10">
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                          <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                            Address
                            Information
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {/* ADDRESS 1 */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Address
                              Line 1
                            </label>

                            <div className="relative">
                              <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                              <input
                                type="text"
                                name="address1"
                                value={
                                  location.address1
                                }
                                onChange={(
                                  e,
                                ) =>
                                  handleChange(
                                    index,
                                    e,
                                  )
                                }
                                className={`${inputClass} pl-12`}
                              />
                            </div>
                          </div>

                          {/* ADDRESS 2 */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Address
                              Line 2
                            </label>

                            <input
                              type="text"
                              name="address2"
                              value={
                                location.address2
                              }
                              onChange={(
                                e,
                              ) =>
                                handleChange(
                                  index,
                                  e,
                                )
                              }
                              className={
                                inputClass
                              }
                            />
                          </div>

                          {/* ADDRESS 3 */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Address
                              Line 3
                            </label>

                            <input
                              type="text"
                              name="address3"
                              value={
                                location.address3
                              }
                              onChange={(
                                e,
                              ) =>
                                handleChange(
                                  index,
                                  e,
                                )
                              }
                              className={
                                inputClass
                              }
                            />
                          </div>

                          {/* CITY */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              City
                            </label>

                            <input
                              type="text"
                              name="city"
                              value={
                                location.city
                              }
                              onChange={(
                                e,
                              ) =>
                                handleChange(
                                  index,
                                  e,
                                )
                              }
                              className={
                                inputClass
                              }
                            />
                          </div>

                          {/* STATE */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              State
                            </label>

                            <input
                              type="text"
                              name="state"
                              value={
                                location.state
                              }
                              onChange={(
                                e,
                              ) =>
                                handleChange(
                                  index,
                                  e,
                                )
                              }
                              className={
                                inputClass
                              }
                            />
                          </div>

                          {/* ZIPCODE */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Zipcode
                            </label>

                            <input
                              type="text"
                              name="zipcode"
                              value={
                                location.zipcode
                              }
                              onChange={(
                                e,
                              ) =>
                                handleChange(
                                  index,
                                  e,
                                )
                              }
                              className={
                                inputClass
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* CONTACT SECTION */}
                      <div>
                        <div className="flex items-center gap-2 mb-5">
                          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                          <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                            Contact
                            Information
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {/* FAX */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Fax
                              Number
                            </label>

                            <input
                              type="text"
                              name="faxNumber"
                              value={
                                location.faxNumber
                              }
                              onChange={(
                                e,
                              ) =>
                                handleChange(
                                  index,
                                  e,
                                )
                              }
                              className={
                                inputClass
                              }
                            />
                          </div>

                          {/* PHONE */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Phone
                              Number
                            </label>

                            <div className="relative">
                              <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                              <input
                                type="text"
                                name="phoneNumber"
                                value={
                                  location.phoneNumber
                                }
                                onChange={(
                                  e,
                                ) =>
                                  handleChange(
                                    index,
                                    e,
                                  )
                                }
                                className={`${inputClass} pl-12`}
                              />
                            </div>
                          </div>

                          {/* CELL */}
                          <div>
                            <label
                              className={
                                labelClass
                              }
                            >
                              Cell
                              Number
                            </label>

                            <div className="relative">
                              <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                              <input
                                type="text"
                                name="cellNumber"
                                value={
                                  location.cellNumber
                                }
                                onChange={(
                                  e,
                                ) =>
                                  handleChange(
                                    index,
                                    e,
                                  )
                                }
                                className={`${inputClass} pl-12`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

export default AddLocationPage;