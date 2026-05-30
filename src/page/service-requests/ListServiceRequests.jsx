/** @format */

import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdAssignment,
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdCalendarToday,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  useNavigate,
} from "react-router-dom";

import {
  getServiceRequestLists,
  deleteServiceRequest,
} from "../../actions/serviceTicket";

import Loader from "../../Images/ZZ5H.gif";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ListServiceRequests =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    // REDUX
    const {
      serviceRequests,
      loading,
    } =
      useSelector(
        (state) =>
          state.serviceTicket,
      );

    const {
      user_type,
    } =
      useSelector(
        (state) =>
          state.user.user,
      );

    const {
      access,
    } =
      useSelector(
        (state) =>
          state.user,
      );

    // FETCH REQUESTS
    useEffect(() => {
      dispatch(
        getServiceRequestLists(
          {},
        ),
      );
    }, [
      dispatch,
    ]);

    // EDIT
    const handleEdit =
      (
        requestId,
      ) => {
        navigate(
          `/edit-service-request/${requestId}`,
        );
      };

    // DELETE
    const handleDeleteRequest =
      (
        requestId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",
          text: "Do you really want to delete this Service Request?",
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
                deleteServiceRequest(
                  requestId,
                ),
              )
                .then(
                  () => {
                    dispatch(
                      getServiceRequestLists(
                        {},
                      ),
                    );
                  },
                )
                .catch(
                  (
                    error,
                  ) => {
                    console.log(
                      error,
                    );

                    toast.error(
                      "Failed to delete this item",
                    );
                  },
                );
            }
          },
        );
      };

    // TRUNCATE
    const truncateDetails =
      (
        text,
      ) => {
        if (!text)
          return "";

        return text.length >
          200
          ? `${text.substring(
              0,
              200,
            )}...`
          : text;
      };

    // FORMAT DATE
    const formatDate =
      (
        date,
      ) => {
        const d =
          new Date(
            date,
          );

        const day =
          String(
            d.getDate(),
          ).padStart(
            2,
            "0",
          );

        const month =
          String(
            d.getMonth() +
              1,
          ).padStart(
            2,
            "0",
          );

        const year =
          d.getFullYear();

        return `${month}/${day}/${year}`;
      };

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
                  Customer
                  Service
                  Requests
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage and
                  track all
                  incoming
                  customer
                  service
                  requests
                </p>
              </div>

              {/* SUMMARY CARD */}
              <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 px-6 py-4 min-w-[220px]">
                <p className="text-sm text-gray-500 mb-1">
                  Total
                  Requests
                </p>

                <h2 className="text-3xl font-bold text-[#1E1B4B]">
                  {serviceRequests?.length ||
                    0}
                </h2>
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              {/* HEADER */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] flex items-center justify-center text-white shadow-lg">
                    <MdAssignment size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1E1B4B]">
                      Service
                      Request
                      List
                    </h2>

                    <p className="text-sm text-gray-500">
                      View and
                      manage all
                      service
                      requests
                    </p>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MdBusiness />
                          Client
                        </div>
                      </th>

                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MdLocationOn />
                          Location
                        </div>
                      </th>

                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MdPerson />
                          Requester
                        </div>
                      </th>

                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 min-w-[320px]">
                        Service
                        Request
                      </th>

                      <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <MdCalendarToday />
                          Requested
                          Date
                        </div>
                      </th>

                      <th className="px-6 py-4 text-center text-xs uppercase tracking-wider font-bold text-indigo-600 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan={
                            6
                          }
                          className="py-16"
                        >
                          <div className="flex justify-center items-center">
                            <img
                              src={
                                Loader
                              }
                              alt="Loading..."
                              className="h-16 w-16"
                            />
                          </div>
                        </td>
                      </tr>
                    ) : serviceRequests?.length ===
                      0 ? (
                      <tr>
                        <td
                          colSpan={
                            6
                          }
                          className="text-center py-16"
                        >
                          <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                              <MdAssignment className="text-3xl text-indigo-400" />
                            </div>

                            <p className="text-lg font-semibold text-gray-700">
                              No Service
                              Requests
                              Found
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              There are
                              currently
                              no service
                              requests
                              available.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      serviceRequests?.map(
                        (
                          request,
                        ) => (
                          <tr
                            key={
                              request?.service_request_id
                            }
                            className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                          >
                            {/* CLIENT */}
                            <td className="px-6 py-5">
                              <div className="font-semibold text-[#1E1B4B]">
                                {
                                  request.client_name
                                }
                              </div>
                            </td>

                            {/* LOCATION */}
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-600">
                                {
                                  request.service_location
                                }
                              </div>
                            </td>

                            {/* REQUESTER */}
                            <td className="px-6 py-5">
                              <div className="text-sm font-medium text-gray-700">
                                {
                                  request.contact_person
                                }
                              </div>
                            </td>

                            {/* DETAILS */}
                            <td className="px-6 py-5">
                              <div className="text-sm text-gray-600 leading-relaxed">
                                {truncateDetails(
                                  request.service_ticket_details,
                                )}
                              </div>
                            </td>

                            {/* DATE */}
                            <td className="px-6 py-5 whitespace-nowrap">
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                                {formatDate(
                                  request.created_at,
                                )}
                              </div>
                            </td>

                            {/* ACTIONS */}
                            <td className="px-6 py-5">
                              <div className="flex items-center justify-center gap-3">
                                {/* EDIT */}
                                <button
                                  className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                                  onClick={() =>
                                    handleEdit(
                                      request?.service_request_id,
                                    )
                                  }
                                >
                                  <BiSolidEditAlt size={18} />
                                </button>

                                {/* DELETE */}
                                {access.includes(
                                  user_type,
                                ) && (
                                  <button
                                    onClick={() =>
                                      handleDeleteRequest(
                                        request.service_request_id,
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
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

export default ListServiceRequests;