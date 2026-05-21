/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getServiceRequestDetails,
  acceptRejectServiceRequest,
} from "../../actions/serviceTicket";

import Loader from "../../Images/ZZ5H.gif";

import { toast } from "react-toastify";

import {
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdEmail,
  MdDescription,
  MdAssignment,
  MdCheckCircle,
  MdCalendarToday,
  MdArrowBack,
  MdInventory,
} from "react-icons/md";

const AcceptServiceRequest =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const {
      requestId,
    } = useParams();

    // REDUX
    const loading =
      useSelector(
        (state) =>
          state
            .serviceTicket
            .loading,
      );

    const serviceRequestDetails =
      useSelector(
        (state) =>
          state
            .serviceTicket
            .serviceRequestDetails,
      );

    // STATES
    const [
      isLoading,
      setIsLoading,
    ] = useState(
      true,
    );

    const [
      showAcceptModal,
      setShowAcceptModal,
    ] = useState(
      false,
    );

    const [
      serviceDate,
      setServiceDate,
    ] = useState(
      "",
    );

    const [
      serviceRequest,
      setServiceRequest,
    ] = useState({
      client_name:
        "",

      client_location:
        "",

      contact_person:
        "",

      contact_phone_number:
        "",

      contact_email:
        "",

      service_location:
        "",

      local_onsite_contact:
        "",

      local_onsite_contact_number:
        "",

      service_ticket_details:
        "",

      status: "",

      service_date:
        "",

      service_request:
        "",

      po_number:
        "",
    });

    // FETCH DETAILS
    useEffect(() => {
      const fetchData =
        async () => {
          setIsLoading(
            true,
          );

          await dispatch(
            getServiceRequestDetails(
              requestId,
            ),
          );

          setIsLoading(
            false,
          );
        };

      fetchData();
    }, [
      dispatch,
      requestId,
    ]);

    // UPDATE FORM
    useEffect(() => {
      if (
        serviceRequestDetails
      ) {
        setServiceRequest(
          {
            client_name:
              serviceRequestDetails.client_name ||
              "",

            client_location:
              `${serviceRequestDetails.locInfo?.address_line_one}, ${serviceRequestDetails.locInfo?.city}` ||
              "",

            contact_person:
              serviceRequestDetails.contact_person ||
              "",

            contact_phone_number:
              serviceRequestDetails.contact_phone_number ||
              "",

            contact_email:
              serviceRequestDetails.contact_email ||
              "",

            service_location:
              serviceRequestDetails.service_location ||
              "",

            local_onsite_contact:
              serviceRequestDetails.local_onsite_contact ||
              "",

            local_onsite_contact_number:
              serviceRequestDetails.local_onsite_contact_number ||
              "",

            service_ticket_details:
              serviceRequestDetails.service_ticket_details ||
              "",

            status:
              serviceRequestDetails.status ||
              "",

            service_date:
              serviceRequestDetails.service_date ||
              "",

            service_request:
              serviceRequestDetails.service_request ||
              "",

            po_number:
              "",
          },
        );

        // SET DEFAULT DATE
        if (
          serviceRequestDetails.service_date
        ) {
          const date =
            new Date(
              serviceRequestDetails.service_date,
            );

          const formattedDate =
            date
              .toISOString()
              .split(
                "T",
              )[0];

          setServiceDate(
            formattedDate,
          );
        } else {
          const today =
            new Date();

          const formattedDate =
            today
              .toISOString()
              .split(
                "T",
              )[0];

          setServiceDate(
            formattedDate,
          );
        }
      }
    }, [
      serviceRequestDetails,
    ]);

    // ACCEPT
    const handleAcceptRequest =
      () => {
        setShowAcceptModal(
          true,
        );
      };

    // CONFIRM ACCEPT
    const confirmAcceptRequest =
      () => {
        const payload =
          {
            id: requestId,

            accepted:
              true,

            service_request:
              serviceRequest.service_request,

            service_date:
              serviceDate,

            po_number:
              serviceRequest.po_number.trim(),
          };

        dispatch(
          acceptRejectServiceRequest(
            payload,
          ),
        ).then(
          (
            data,
          ) => {
            if (
              data.code ===
              "SR204"
            ) {
              setShowAcceptModal(
                false,
              );

              toast.success(
                data?.message ||
                  "Service request accepted successfully",
              );

              navigate(
                "/service-requests",
              );
            }
          },
        );
      };

    // BACK
    const handleBack =
      () => {
        navigate(
          -1,
        );
      };

    // STATUS STYLE
    const getStatusStyle =
      (
        status,
      ) => {
        if (
          status ===
          "Accepted"
        ) {
          return "bg-green-100 text-green-700 border border-green-200";
        }

        if (
          status ===
          "Rejected"
        ) {
          return "bg-red-100 text-red-700 border border-red-200";
        }

        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      };

    // COMMON CLASSES
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-700";

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    // LOADER
    if (
      isLoading
    ) {
      return (
        <>
          <Header />

          <div className="flex">
            <AdminSideNavbar />

            <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen flex justify-center items-center">
              <img
                src={
                  Loader
                }
                alt="Loading..."
                className="h-20 w-20"
              />
            </div>
          </div>
        </>
      );
    }

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
                  Service
                  Request
                  Details
                </h1>

                <p className="text-gray-500 mt-1">
                  Review and
                  process
                  customer
                  service
                  requests
                </p>
              </div>

              {/* STATUS */}
              <div
                className={`px-5 py-3 rounded-2xl font-semibold shadow-sm w-fit ${getStatusStyle(
                  serviceRequest.status,
                )}`}
              >
                Status:{" "}
                {serviceRequest.status ||
                  "Pending"}
              </div>
            </div>

            {/* DETAILS CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="p-8">
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <MdAssignment size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Request
                      Information
                    </h2>

                    <p className="text-gray-500 text-sm">
                      Customer
                      service
                      request
                      overview
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
                        Client
                      </label>

                      <div className="relative">
                        <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.client_name
                          }
                          readOnly
                        />
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

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.client_location
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* CONTACT PERSON */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Contact
                        Person
                      </label>

                      <div className="relative">
                        <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.contact_person
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* CONTACT PHONE */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Contact
                        Phone
                      </label>

                      <div className="relative">
                        <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.contact_phone_number
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div>
                      <label
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
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.contact_email
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* SERVICE LOCATION */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Service
                        Location
                      </label>

                      <div className="relative">
                        <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.service_location
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* ONSITE CONTACT */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Onsite
                        Contact
                      </label>

                      <div className="relative">
                        <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.local_onsite_contact
                          }
                          readOnly
                        />
                      </div>
                    </div>

                    {/* ONSITE NUMBER */}
                    <div>
                      <label
                        className={
                          labelClass
                        }
                      >
                        Onsite
                        Contact
                        Number
                      </label>

                      <div className="relative">
                        <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          className={`${inputClass} pl-12`}
                          value={
                            serviceRequest.local_onsite_contact_number
                          }
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* SERVICE DETAILS */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Service
                      Details
                    </h3>
                  </div>

                  <div className="relative">
                    <MdDescription className="absolute top-4 left-4 text-indigo-400 text-xl" />

                    <textarea
                      rows={
                        6
                      }
                      className={`${inputClass} pl-12 pt-4 resize-none`}
                      value={
                        serviceRequest.service_ticket_details
                      }
                      readOnly
                    />
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap justify-end gap-4 mt-10">
                  {serviceRequest.status !==
                    "Accepted" && (
                    <button
                      type="button"
                      onClick={
                        handleAcceptRequest
                      }
                      disabled={
                        loading
                      }
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                    >
                      <MdCheckCircle size={20} />

                      {loading
                        ? "Processing..."
                        : "Accept Request"}
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
            </div>
          </div>
        </div>

        {/* ACCEPT MODAL */}
        {showAcceptModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />

              <div className="p-8">
                {/* TITLE */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg">
                    <MdCheckCircle size={24} />
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-[#1E1B4B]">
                      Confirm
                      Acceptance
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Finalize the
                      service
                      request
                    </p>
                  </div>
                </div>

                {/* FORM */}
                <div className="space-y-6">
                  {/* SERVICE REQUEST */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Service
                      Request
                      Title{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <MdAssignment className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <textarea
                        rows="3"
                        value={
                          serviceRequest.service_request
                        }
                        onChange={(
                          e,
                        ) =>
                          setServiceRequest(
                            (
                              prev,
                            ) => ({
                              ...prev,
                              service_request:
                                e
                                  .target
                                  .value,
                            }),
                          )
                        }
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                        placeholder="Enter service request..."
                        required
                      />
                    </div>
                  </div>

                  {/* SERVICE DATE */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Select
                      Service
                      Date{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <MdCalendarToday className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="date"
                        value={
                          serviceDate
                        }
                        onChange={(
                          e,
                        ) =>
                          setServiceDate(
                            e
                              .target
                              .value,
                          )
                        }
                        min={
                          new Date()
                            .toISOString()
                            .split(
                              "T",
                            )[0]
                        }
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        required
                      />
                    </div>
                  </div>

                  {/* PO NUMBER */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      PO Number{" "}
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <MdInventory className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        value={
                          serviceRequest.po_number
                        }
                        onChange={(
                          e,
                        ) =>
                          setServiceRequest(
                            (
                              prev,
                            ) => ({
                              ...prev,
                              po_number:
                                e
                                  .target
                                  .value,
                            }),
                          )
                        }
                        className="w-full border border-gray-200 rounded-2xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        placeholder="Enter PO number"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 mt-8">
                  <button
                    onClick={() =>
                      setShowAcceptModal(
                        false,
                      )
                    }
                    className="px-5 py-3 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={
                      confirmAcceptRequest
                    }
                    disabled={
                      loading
                    }
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
                  >
                    {loading
                      ? "Processing..."
                      : "Confirm Acceptance"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

export default AcceptServiceRequest;