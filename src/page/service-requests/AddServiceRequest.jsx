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
  createServiceRequest,
  getServiceRequestInfo,
} from "../../actions/serviceTicket";

import {
  getClients,
} from "../../actions/clientActions";

import {
  getLocationByClient,
} from "../../actions/locationActions";

import {
  useNavigate,
} from "react-router-dom";

import {
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdEmail,
  MdAssignment,
  MdAdd,
  MdDescription,
} from "react-icons/md";

const AddServiceRequest =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    // REDUX
    const clientLocations =
      useSelector(
        (state) =>
          state.location.locations,
      );

    const user =
      useSelector(
        (state) =>
          state.user.user,
      );

    const {
      serviceReqInfo,
      loading,
      serviceRequestLoading,
    } =
      useSelector(
        (state) =>
          state.serviceTicket,
      );

    const {
      access,
    } =
      useSelector(
        (state) =>
          state.user,
      );

    // STATE
    const [
      serviceRequest,
      setServiceRequest,
    ] = useState({
      client_id: "",

      client_name:
        "",

      location_id:
        "",

      client_emp_user_id:
        user?.client_emp_id ||
        "",

      contact_person:
        `${user?.first_name} ${user?.first_name}` ||
        "",

      contact_phone_number:
        user?.contact_number ||
        "",

      contact_email:
        user?.email_id ||
        "",

      service_location:
        "",

      local_onsite_contact:
        "",

      local_onsite_contact_number:
        "",

      service_ticket_details:
        "",
    });

    const [
      selectedClientLocation,
      setSelectedClientLocation,
    ] = useState(
      "",
    );

    // FETCH DATA
    useEffect(() => {
      if (
        !access.includes(
          user?.user_type,
        )
      ) {
        dispatch(
          getServiceRequestInfo(),
        );
      } else {
        dispatch(
          getClients(),
        );
      }
    }, [
      user,
      dispatch,
      access,
    ]);

    // FETCH LOCATIONS
    useEffect(() => {
      if (
        serviceRequest?.client_id
      ) {
        dispatch(
          getLocationByClient(
            serviceRequest?.client_id,
          ),
        );
      }
    }, [
      dispatch,
      serviceRequest?.client_id,
    ]);

    // PREFILL DATA
    useEffect(() => {
      if (
        serviceReqInfo &&
        serviceReqInfo.client_info
      ) {
        const fullName = `${serviceReqInfo.first_name?.trim()} ${serviceReqInfo.last_name?.trim()}`;

        setServiceRequest(
          (
            prev,
          ) => ({
            ...prev,

            client_id:
              serviceReqInfo
                .client_info
                .client_id,

            client_name:
              serviceReqInfo
                .client_info
                .company_name,

            location_id:
              serviceReqInfo
                ?.locations?.[0]
                ?.location_id ||
              "",

            client_emp_user_id:
              serviceReqInfo.client_emp_id,

            contact_person:
              fullName,

            contact_phone_number:
              serviceReqInfo.contact_number,

            contact_email:
              serviceReqInfo.email_id,
          }),
        );

        if (
          serviceReqInfo
            .client_info
            .client_id
        ) {
          dispatch(
            getLocationByClient(
              serviceReqInfo
                .client_info
                .client_id,
            ),
          );
        }
      }
    }, [
      serviceReqInfo,
      dispatch,
    ]);

    // CHANGE HANDLER
    const handleChange =
      (e) => {
        const {
          name,
          value,
        } = e.target;

        if (
          name ===
          "selected_client_location"
        ) {
          setSelectedClientLocation(
            value,
          );

          setServiceRequest(
            (
              prev,
            ) => ({
              ...prev,
              location_id:
                value,
            }),
          );
        } else {
          setServiceRequest(
            (
              prev,
            ) => ({
              ...prev,
              [name]:
                value,
            }),
          );
        }
      };

    // SAVE
    const handleSave =
      (e) => {
        e.preventDefault();

        delete serviceRequest?.selected_client_location;

        dispatch(
          createServiceRequest(
            serviceRequest,
            navigate,
          ),
        ).then(
          (
            data,
          ) => {
            if (
              data?.code ===
              "SR201"
            ) {
              setServiceRequest(
                (
                  prev,
                ) => ({
                  ...prev,
                  service_location:
                    "",

                  local_onsite_contact:
                    "",

                  local_onsite_contact_number:
                    "",

                  service_ticket_details:
                    "",
                }),
              );
            }
          },
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
                  Create
                  Customer
                  Service
                  Request
                </h1>

                <p className="text-gray-500 mt-1">
                  Submit and
                  manage
                  customer
                  service
                  requests
                </p>
              </div>

              {/* ACTION BUTTON */}
              <div>
                <button
                  type="submit"
                  form="addServiceRequestForm"
                  disabled={
                    serviceRequestLoading
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                >
                  <MdAdd size={20} />

                  {serviceRequestLoading
                    ? "Saving..."
                    : "Create Request"}
                </button>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <form
                id="addServiceRequestForm"
                onSubmit={
                  handleSave
                }
                className="p-8"
              >
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] flex items-center justify-center text-white shadow-lg">
                    <MdAssignment size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Service
                      Request
                      Details
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Fill in the
                      details below
                    </p>
                  </div>
                </div>

                {/* CLIENT SECTION */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Client
                      Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CLIENT */}
                    <div>
                      <label
                        htmlFor="client_name"
                        className={
                          labelClass
                        }
                      >
                        Client
                      </label>

                      <div className="relative">
                        <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          id="client_name"
                          name="client_name"
                          className={`${inputClass} pl-12 bg-gray-100 text-gray-500 cursor-not-allowed`}
                          value={
                            serviceReqInfo
                              ?.client_info
                              ?.company_name ||
                            ""
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                      <label
                        htmlFor="selected_client_location"
                        className={
                          labelClass
                        }
                      >
                        Select
                        Client
                        Location
                        *
                      </label>

                      <div className="relative">
                        <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          name="selected_client_location"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.location_id
                          }
                          onChange={
                            handleChange
                          }
                          required
                        >
                          <option value="">
                            Select
                            location
                          </option>

                          {(serviceReqInfo
                            ?.locations
                            ?.length
                            ? serviceReqInfo.locations
                            : clientLocations
                          ).map(
                            (
                              loc,
                            ) => (
                              <option
                                key={
                                  loc.location_id
                                }
                                value={
                                  loc.location_id
                                }
                              >
                                {`${loc.address_line_one}, ${loc.city}`}
                              </option>
                            ),
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONTACT SECTION */}
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Contact
                      Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* CONTACT PERSON */}
                    <div>
                      <label
                        htmlFor="contact_person"
                        className={
                          labelClass
                        }
                      >
                        Contact
                        Person
                        *
                      </label>

                      <div className="relative">
                        <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          id="contact_person"
                          name="contact_person"
                          className={`${inputClass} pl-12 bg-gray-100 text-gray-500`}
                          value={
                            serviceRequest.contact_person
                          }
                          onChange={
                            handleChange
                          }
                          required
                          readOnly
                        />
                      </div>
                    </div>

                    {/* CONTACT PHONE */}
                    <div>
                      <label
                        htmlFor="contact_phone_number"
                        className={
                          labelClass
                        }
                      >
                        Contact
                        Phone
                        *
                      </label>

                      <div className="relative">
                        <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="tel"
                          id="contact_phone_number"
                          name="contact_phone_number"
                          className={`${inputClass} pl-12 bg-gray-100 text-gray-500`}
                          value={
                            serviceRequest.contact_phone_number
                          }
                          onChange={
                            handleChange
                          }
                          required
                          readOnly
                        />
                      </div>
                    </div>

                    {/* CONTACT EMAIL */}
                    <div>
                      <label
                        htmlFor="contact_email"
                        className={
                          labelClass
                        }
                      >
                        Contact
                        Email
                      </label>

                      <div className="relative">
                        <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="email"
                          id="contact_email"
                          name="contact_email"
                          className={`${inputClass} pl-12 bg-gray-100 text-gray-500`}
                          value={
                            serviceRequest.contact_email
                          }
                          onChange={
                            handleChange
                          }
                          required
                          readOnly
                        />
                      </div>
                    </div>

                    {/* SERVICE LOCATION */}
                    <div>
                      <label
                        htmlFor="service_location"
                        className={
                          labelClass
                        }
                      >
                        Service
                        Location
                        *
                      </label>

                      <div className="relative">
                        <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          id="service_location"
                          name="service_location"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.service_location
                          }
                          onChange={
                            handleChange
                          }
                          required
                        />
                      </div>
                    </div>

                    {/* ONSITE CONTACT */}
                    <div>
                      <label
                        htmlFor="local_onsite_contact"
                        className={
                          labelClass
                        }
                      >
                        Onsite
                        Contact
                        (Optional)
                      </label>

                      <div className="relative">
                        <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          id="local_onsite_contact"
                          name="local_onsite_contact"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.local_onsite_contact
                          }
                          onChange={
                            handleChange
                          }
                        />
                      </div>
                    </div>

                    {/* ONSITE CONTACT NUMBER */}
                    <div>
                      <label
                        htmlFor="local_onsite_contact_number"
                        className={
                          labelClass
                        }
                      >
                        Onsite
                        Contact
                        Number
                        (Optional)
                      </label>

                      <div className="relative">
                        <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="tel"
                          id="local_onsite_contact_number"
                          name="local_onsite_contact_number"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.local_onsite_contact_number
                          }
                          onChange={
                            handleChange
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SERVICE DETAILS */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Service
                      Details
                    </h3>
                  </div>

                  <div>
                    <label
                      htmlFor="service_ticket_details"
                      className={
                        labelClass
                      }
                    >
                      Service
                      Needed
                      *
                    </label>

                    <div className="relative">
                      <MdDescription className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <textarea
                        name="service_ticket_details"
                        rows={
                          6
                        }
                        className={`${inputClass} pl-12 pt-4 resize-none`}
                        value={
                          serviceRequest.service_ticket_details
                        }
                        onChange={
                          handleChange
                        }
                        required
                        placeholder="Describe the service request in detail..."
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

export default AddServiceRequest;