/** @format */

import React, {
  useState,
  useEffect,
  useRef,
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
  addClientEquipment,
  addEquipmentThroughCsv,
} from "../../actions/clientEquipment";

import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import {
  MdBusiness,
  MdLocationOn,
  MdDevices,
  MdUploadFile,
  MdInventory,
  MdNotes,
  MdWifi,
  MdSettingsEthernet,
  MdPerson,
  MdLock,
  MdAdd,
  MdArrowBack,
} from "react-icons/md";

const AddClientEquipment = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { clientId, locationId } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const returnTo =
    location.state?.returnTo;

  const serviceTicketId =
    location.state?.serviceTicketId;

  const clients = useSelector(
    (state) => state.client.clients,
  );

  const clientLocations =
    useSelector(
      (state) =>
        state.location.locations,
    );

  const loadingClients =
    useSelector(
      (state) => state.client.loading,
    );

  const loadingLocations =
    useSelector(
      (state) =>
        state.location.loading,
    );

  const loading = useSelector(
    (state) =>
      state.clientEquipment.loading,
  );

  const { user_type } =
    useSelector(
      (state) => state.user.user,
    );

  const [clientEquipment,
    setClientEquipment] =
    useState({
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

      device_type: "",
      device_id: "",
      manufacturer: "",
      model: "",
      serial_number: "",
      mac_address: "",
      lan_ip_address: "",
      wan_ip_address: "",
      general_info: "",
      device_location: "",
      username: "",
      password: "",
    });

  const [file, setFile] =
    useState(null);

  const [showCsvUpload,
    setShowCsvUpload] =
    useState(false);

  const fileInputRef =
    useRef(null);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    if (
      clientEquipment?.client_id
    ) {
      dispatch(
        getLocationByClient(
          clientEquipment?.client_id,
        ),
      );
    }
  }, [
    dispatch,
    clientEquipment?.client_id,
  ]);

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

      if (selectedClient) {
        setClientEquipment(
          (prev) => ({
            ...prev,
            client_name:
              selectedClient.company_name,
          }),
        );
      }
    }
  }, [clientId, clients]);

  useEffect(() => {
    if (
      locationId &&
      clientLocations?.length
    ) {
      const selectedLocation =
        clientLocations.find(
          (location) =>
            location.location_id ===
            locationId,
        );

      if (selectedLocation) {
        setClientEquipment(
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

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setClientEquipment((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "client_id") {
      const selectedClient =
        clients?.data?.find(
          (client) =>
            client.client_id ===
            value,
        );

      if (selectedClient) {
        setClientEquipment(
          (prev) => ({
            ...prev,
            client_name:
              selectedClient.company_name,
            location_id: "",
          }),
        );
      }

      dispatch(
        getLocationByClient(value),
      );
    }
  };

  const handleFileChange = (
    event,
  ) => {
    const file =
      event.target.files[0];

    if (file) {
      setFile(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (file) {
      const formData =
        new FormData();

      formData.append(
        "client_id",
        clientEquipment.client_id,
      );

      formData.append(
        "client_name",
        clientEquipment.client_name,
      );

      formData.append(
        "location_id",
        clientEquipment.location_id,
      );

      formData.append(
        "csv",
        file,
      );

      dispatch(
        addEquipmentThroughCsv(
          formData,
        ),
      ).then((success) => {
        if (success) {
          if (
            fileInputRef.current
          ) {
            fileInputRef.current.value =
              "";
          }

          setFile(null);

          setClientEquipment(
            (prev) => ({
              ...prev,
              device_type: "",
              device_id: "",
              manufacturer: "",
              model: "",
              serial_number: "",
              mac_address: "",
              lan_ip_address: "",
              wan_ip_address: "",
              general_info: "",
              device_location: "",
              username: "",
              password: "",
            }),
          );
        }
      });
    } else {
      dispatch(
        addClientEquipment(
          clientEquipment,
        ),
      ).then((success) => {
        if (success) {
          setClientEquipment(
            (prev) => ({
              ...prev,
              device_type: "",
              device_id: "",
              manufacturer: "",
              model: "",
              serial_number: "",
              mac_address: "",
              lan_ip_address: "",
              wan_ip_address: "",
              general_info: "",
              device_location: "",
              username: "",
              password: "",
            }),
          );
        }
      });
    }
  };

  const handleBack = () => {
    if (
      returnTo ===
      "edit-service-ticket"
    ) {
      navigate(
        `/edit-service-ticket/${serviceTicketId}`,
      );
    } else if (
      returnTo ===
      "edit-work-order"
    ) {
      navigate(
        `/edit-work-order/${serviceTicketId}`,
      );
    } else {
      navigate(
        `/client-equipments?${searchParams.toString()}`,
      );
    }
  };

  const newAccess = [
    "Subcontractor_User",
    "Subcontractor",
  ];

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
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                Add Client Device
              </h1>

              <p className="text-gray-500 mt-1">
                Add device manually
                or upload via CSV
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() =>
                  setShowCsvUpload(
                    !showCsvUpload,
                  )
                }
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                <MdUploadFile size={20} />

                {showCsvUpload
                  ? "Manual Entry"
                  : "Upload CSV"}
              </button>

              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
              >
                <MdArrowBack size={20} />
                Back
              </button>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <form
              onSubmit={handleSave}
              className="p-8"
            >
              {/* TITLE */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <MdDevices size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1E1B4B]">
                    Device Details
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Fill equipment
                    details below
                  </p>
                </div>
              </div>

              {/* CLIENT + LOCATION */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    Client Information
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
                      Select Client
                    </label>

                    <div className="relative">
                      <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <select
                        id="client_id"
                        name="client_id"
                        className={`${inputClass} pl-12`}
                        value={
                          clientEquipment.client_id
                        }
                        onChange={
                          handleChange
                        }
                        required
                        disabled={newAccess.includes(
                          user_type,
                        )}
                      >
                        <option value="">
                          Select Client
                        </option>

                        {loadingClients ? (
                          <option
                            disabled
                          >
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
                      Select Location
                    </label>

                    <div className="relative">
                      <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <select
                        id="location_id"
                        name="location_id"
                        className={`${inputClass} pl-12`}
                        value={
                          clientEquipment.location_id
                        }
                        onChange={
                          handleChange
                        }
                        required
                        disabled={
                          newAccess.includes(
                            user_type,
                          ) ||
                          !clientEquipment.client_id
                        }
                      >
                        <option value="">
                          Select Location
                        </option>

                        {loadingLocations ? (
                          <option
                            disabled
                          >
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

              {/* CSV UPLOAD */}
              {showCsvUpload && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <MdUploadFile className="text-indigo-600 text-2xl" />

                    <h3 className="text-lg font-bold text-[#1E1B4B]">
                      Upload CSV
                    </h3>
                  </div>

                  <input
                    type="file"
                    id="file"
                    accept=".csv"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white"
                    onChange={
                      handleFileChange
                    }
                    ref={fileInputRef}
                    required={
                      showCsvUpload
                    }
                  />

                  {file && (
                    <p className="mt-3 text-sm text-indigo-600 font-medium">
                      Selected:{" "}
                      {file.name}
                    </p>
                  )}
                </div>
              )}

              {/* MANUAL ENTRY */}
              {!showCsvUpload && (
                <>
                  {/* DEVICE DETAILS */}
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Device Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {[
                        {
                          label:
                            "Device Type",
                          name: "device_type",
                          icon: (
                            <MdDevices />
                          ),
                          required: true,
                        },

                        {
                          label:
                            "Device ID (Hostname)",
                          name: "device_id",
                          icon: (
                            <MdInventory />
                          ),
                          required: true,
                        },

                        {
                          label:
                            "Manufacturer",
                          name: "manufacturer",
                          icon: (
                            <MdBusiness />
                          ),
                          required: true,
                        },

                        {
                          label:
                            "Model",
                          name: "model",
                          icon: (
                            <MdDevices />
                          ),
                          required: true,
                        },

                        {
                          label:
                            "Serial Number",
                          name: "serial_number",
                          icon: (
                            <MdInventory />
                          ),
                          required: true,
                        },

                        {
                          label:
                            "Device Location",
                          name: "device_location",
                          icon: (
                            <MdLocationOn />
                          ),
                        },

                        {
                          label:
                            "MAC Address",
                          name: "mac_address",
                          icon: (
                            <MdSettingsEthernet />
                          ),
                        },

                        {
                          label:
                            "LAN IP Address",
                          name: "lan_ip_address",
                          icon: (
                            <MdWifi />
                          ),
                        },

                        {
                          label:
                            "WAN IP Address",
                          name: "wan_ip_address",
                          icon: (
                            <MdWifi />
                          ),
                        },

                        {
                          label:
                            "Username",
                          name: "username",
                          icon: (
                            <MdPerson />
                          ),
                        },

                        {
                          label:
                            "Password",
                          name: "password",
                          icon: (
                            <MdLock />
                          ),
                        },
                      ].map(
                        (
                          field,
                        ) => (
                          <div
                            key={
                              field.name
                            }
                          >
                            <label
                              className={
                                labelClass
                              }
                            >
                              {
                                field.label
                              }
                            </label>

                            <div className="relative">
                              <div className="absolute top-4 left-4 text-indigo-400 text-xl">
                                {
                                  field.icon
                                }
                              </div>

                              <input
                                type="text"
                                name={
                                  field.name
                                }
                                value={
                                  clientEquipment[
                                    field
                                      .name
                                  ]
                                }
                                onChange={
                                  handleChange
                                }
                                required={
                                  field.required
                                }
                                className={`${inputClass} pl-12`}
                              />
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* NOTES */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Additional Notes
                      </h3>
                    </div>

                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        General Device
                        Information
                      </label>

                      <div className="relative">
                        <MdNotes className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <textarea
                          name="general_info"
                          rows={5}
                          value={
                            clientEquipment.general_info
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12 pt-4`}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap justify-end gap-3 mt-10">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  <MdAdd size={20} />

                  {loading
                    ? "Saving..."
                    : "Add Client Device"}
                </button>

                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
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

export default AddClientEquipment;