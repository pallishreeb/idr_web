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
  getClientEquipmentById,
  updateClientEquipment,
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
  MdInventory,
  MdWifi,
  MdSettingsEthernet,
  MdPerson,
  MdLock,
  MdNotes,
  MdArrowBack,
  MdEdit,
} from "react-icons/md";

const EditClientEquipment = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { clientEquipmentId } =
    useParams();

  const [searchParams] =
    useSearchParams();

  const returnTo =
    location.state?.returnTo;

  const serviceTicketId =
    location.state?.serviceTicketId;

  // REDUX
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

  const loadingEquipmentDetails =
    useSelector(
      (state) =>
        state.clientEquipment
          .loadingDetails,
    );

  const loading = useSelector(
    (state) =>
      state.clientEquipment.loading,
  );

  const {
    user_type,
  } = useSelector(
    (state) => state.user.user,
  );

  const {
    technicianAccess,
  } = useSelector(
    (state) => state.user,
  );

  // NOTES
  const [
    clientEquipmentNotes,
    setClientEquipmentNotes,
  ] = useState([]);

  // FORM STATE
  const [
    clientEquipment,
    setClientEquipment,
  ] = useState({
    client_equipment_id:
      clientEquipmentId,
    client_id: "",
    client_name: "",
    location_id: "",
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
    decomission_reason: "",
    is_deleted: false,
  });

  // FETCH CLIENTS
  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  // FETCH EQUIPMENT DETAILS
  useEffect(() => {
    if (clientEquipmentId) {
      dispatch(
        getClientEquipmentById(
          clientEquipmentId,
        ),
      ).then((data) => {
        if (data) {
          setClientEquipment({
            client_equipment_id:
              clientEquipmentId,
            client_id:
              data.client_id || "",
            client_name:
              data.client_name ||
              "",
            location_id:
              data.location_id ||
              "",
            device_type:
              data.device_type ||
              "",
            device_id:
              data.device_id ||
              "",
            manufacturer:
              data.manufacturer ||
              "",
            model:
              data.model || "",
            serial_number:
              data.serial_number ||
              "",
            mac_address:
              data.mac_address ||
              "",
            lan_ip_address:
              data.lan_ip_address ||
              "",
            wan_ip_address:
              data.wan_ip_address ||
              "",
            device_location:
              data.device_location ||
              "",
            username:
              data.username ||
              "",
            password:
              data.password ||
              "",
            general_info:
              data.general_info ||
              "",
            decomission_reason:
              data?.decomission_reason ||
              "",
            is_deleted:
              data?.is_deleted,
          });

          setClientEquipmentNotes(
            data?.client_equip_histories ||
              [],
          );

          if (data.client_id) {
            dispatch(
              getLocationByClient(
                data.client_id,
              ),
            );
          }
        }
      });
    }
  }, [
    dispatch,
    clientEquipmentId,
  ]);

  // FETCH LOCATIONS
  useEffect(() => {
    if (
      clientEquipment.client_id
    ) {
      dispatch(
        getLocationByClient(
          clientEquipment.client_id,
        ),
      );
    }
  }, [
    dispatch,
    clientEquipment.client_id,
  ]);

  // HANDLE CHANGE
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
          }),
        );
      }

      dispatch(
        getLocationByClient(value),
      );
    }
  };

  // SAVE
  const handleSave = (e) => {
    e.preventDefault();

    const {
      decomission_reason,
      is_deleted,
      ...updatePayload
    } = clientEquipment;

    dispatch(
      updateClientEquipment(
        updatePayload,
        navigate,
      ),
    );
  };

  // BACK
  const handleBack = () => {
    if (
      returnTo ===
      "edit-service-ticket"
    ) {
      navigate(
        `/edit-service-ticket/${serviceTicketId}`,
      );
    } else {
      navigate(
        `/client-equipments?${searchParams.toString()}`,
      );
    }
  };

  // READ ONLY USERS
  const readOnlyAccess = [
    "Subcontractor_User",
    "Subcontractor",
    "Client Employee",
  ];

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
                Edit Client Device
              </h1>

              <p className="text-gray-500 mt-1">
                Update equipment
                details and device
                information
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {technicianAccess.includes(
                user_type,
              ) && (
                <button
                  type="submit"
                  form="editDeviceForm"
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  {loading
                    ? "Updating..."
                    : "Update Device"}
                </button>
              )}

              <button
                onClick={handleBack}
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
            <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            {loadingEquipmentDetails ? (
              <div className="p-10 text-center text-gray-500">
                Loading equipment
                details...
              </div>
            ) : (
              <form
                id="editDeviceForm"
                onSubmit={handleSave}
                className="p-8"
              >
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] flex items-center justify-center text-white shadow-lg">
                    <MdEdit size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Device Details
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Edit client
                      equipment
                      information
                    </p>
                  </div>
                </div>

                {/* CLIENT INFO */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

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
                        Client
                      </label>

                      <div className="relative">
                        <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          name="client_id"
                          className={`${inputClass} pl-12`}
                          value={
                            clientEquipment.client_id
                          }
                          onChange={
                            handleChange
                          }
                          disabled
                        >
                          <option value="">
                            Select Client
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
                        Location
                      </label>

                      <div className="relative">
                        <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          name="location_id"
                          className={`${inputClass} pl-12`}
                          value={
                            clientEquipment.location_id
                          }
                          onChange={
                            handleChange
                          }
                          disabled
                        >
                          <option value="">
                            Select Location
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

                {/* DEVICE DETAILS */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Device Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                      {
                        label:
                          "Device Type",
                        name:
                          "device_type",
                        icon: (
                          <MdDevices />
                        ),
                        required: true,
                      },

                      {
                        label:
                          "Device ID (Hostname)",
                        name:
                          "device_id",
                        icon: (
                          <MdInventory />
                        ),
                        required: true,
                      },

                      {
                        label:
                          "Manufacturer",
                        name:
                          "manufacturer",
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
                        name:
                          "serial_number",
                        icon: (
                          <MdInventory />
                        ),
                        required: true,
                      },

                      {
                        label:
                          "Device Location",
                        name:
                          "device_location",
                        icon: (
                          <MdLocationOn />
                        ),
                      },

                      {
                        label:
                          "MAC Address",
                        name:
                          "mac_address",
                        icon: (
                          <MdSettingsEthernet />
                        ),
                      },

                      {
                        label:
                          "LAN IP Address",
                        name:
                          "lan_ip_address",
                        icon: (
                          <MdWifi />
                        ),
                      },

                      {
                        label:
                          "WAN IP Address",
                        name:
                          "wan_ip_address",
                        icon: (
                          <MdWifi />
                        ),
                      },

                      {
                        label:
                          "Username",
                        name:
                          "username",
                        icon: (
                          <MdPerson />
                        ),
                      },

                      {
                        label:
                          "Password",
                        name:
                          "password",
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
                              readOnly={readOnlyAccess.includes(
                                user_type,
                              )}
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
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

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
                        readOnly={readOnlyAccess.includes(
                          user_type,
                        )}
                        className={`${inputClass} pl-12 pt-4`}
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* DECOMMISSION REASON */}
          {clientEquipment?.decomission_reason !==
            "" && (
            <div className="mt-8 bg-white rounded-[28px] shadow-md border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500" />

              <div className="p-6">
                <h2 className="text-xl font-bold text-[#1E1B4B] mb-3">
                  {clientEquipment?.is_deleted ===
                  true
                    ? "Decommission Reason"
                    : "Re-activation Reason"}
                </h2>

                <p className="text-gray-600 leading-relaxed">
                  {
                    clientEquipment?.decomission_reason
                  }
                </p>
              </div>
            </div>
          )}

          {/* HISTORY TABLE */}
          {clientEquipmentNotes?.length >
            0 && (
            <div className="mt-8 bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-[#1E1B4B]">
                  Equipment Notes
                </h2>

                <p className="text-sm text-gray-500">
                  History and notes for
                  this equipment
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Notes
                      </th>

                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        User Name
                      </th>

                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Date & Time
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clientEquipmentNotes?.map(
                      (
                        note,
                      ) => (
                        <tr
                          key={
                            note.note_id
                          }
                          className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                          <td className="px-4 py-4 min-w-[350px]">
                            <textarea
                              className="w-full rounded-2xl border border-gray-200 p-4 text-sm resize-y bg-gray-50"
                              value={
                                note.comments ||
                                ""
                              }
                              rows={5}
                              readOnly
                            />
                          </td>

                          <td className="px-4 py-4 text-gray-700 font-medium whitespace-nowrap">
                            {note?.user_name ||
                              "NA"}
                          </td>

                          <td className="px-4 py-4 text-gray-600 whitespace-nowrap">
                            {new Date(
                              note.created_at,
                            ).toLocaleString(
                              "en-US",
                              {
                                timeZone:
                                  "America/New_York",
                                year:
                                  "numeric",
                                month:
                                  "2-digit",
                                day:
                                  "2-digit",
                                hour:
                                  "2-digit",
                                minute:
                                  "2-digit",
                                second:
                                  "2-digit",
                                hour12: true,
                              },
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EditClientEquipment;