import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AiFillDelete } from "react-icons/ai";

import {
  MdGroups,
  MdEngineering,
  MdOutlineBadge,
  MdBusiness,
} from "react-icons/md";

import Swal from "sweetalert2";

import AddTechnicianToServiceTicket from "./AddTechnicianToServiceTicket";

import {
  getServiceTicketDetails,
  assignPeopleToServiceTicket,
  deleteAssignee,
} from "../actions/serviceTicket";

import { getClients } from "../actions/clientActions";

import { fetchIDREmployees } from "../actions/employeeActions";

import { toast } from "react-toastify";

const ServiceTicketAssigneePeopleCard =
  ({
    assignees,
    idrEmployees,
    serviceTicketId,
    subcontractorAssignees,
  }) => {
    const dispatch =
      useDispatch();

    const {
      user_type,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
      );

    const {
      access,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user,
      );

    const [
      isModalOpen,
      setIsModalOpen,
    ] =
      useState(
        false,
      );

    const handleOpenModal =
      () => {
        setIsModalOpen(
          true,
        );
      };

    const handleCloseModal =
      () => {
        setIsModalOpen(
          false,
        );
      };

    const handleAddAssignee =
      (
        newTechnician,
      ) => {
        dispatch(
          assignPeopleToServiceTicket(
            newTechnician,
            null,
            true,
          ),
        )
          .then(
            (
              response,
            ) => {
              if (
                response.code ===
                "ST201"
              ) {
                toast.success(
                  "People assigned to service ticket.",
                );

                handleCloseModal();

                dispatch(
                  getServiceTicketDetails(
                    serviceTicketId,
                  ),
                );

                dispatch(
                  getClients(),
                );

                dispatch(
                  fetchIDREmployees(),
                );
              } else {
                console.error(
                  "Error adding new technician:",
                  response.error,
                );
              }
            },
          )
          .catch(
            (
              error,
            ) => {
              console.error(
                "API call error:",
                error,
              );
            },
          );
      };

    const handleDelete =
      (
        assigneeId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",

          text: "Do you really want to delete this assignee?",

          icon: "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, delete it!",

          cancelButtonText:
            "No, keep it",
        }).then(
          (
            result,
          ) => {
            if (
              result.isConfirmed
            ) {
              dispatch(
                deleteAssignee(
                  assigneeId,
                ),
              ).then(
                () => {
                  dispatch(
                    getServiceTicketDetails(
                      serviceTicketId,
                    ),
                  );

                  dispatch(
                    getClients(),
                  );

                  dispatch(
                    fetchIDREmployees(),
                  );
                },
              );
            }
          },
        );
      };

    /* =========================================
       COMBINED DATA FOR CLIENT EMPLOYEES ONLY
    ========================================= */

    const allAssignees =
      [
        ...(assignees?.map(
          (
            technician,
          ) => ({
            id:
              technician.assignee_id,

            name:
              technician.technician_name ||
              technician.project_manager ||
              "NA",

            role:
              technician.project_manager
                ? "Project Manager"
                : "Technician",

            company:
              "IDR",

            isSubcontractor:
              false,
          }),
        ) ||
          []),

        ...(user_type ===
        "Client Employee"
          ? subcontractorAssignees?.map(
              (
                subcontractor,
              ) => ({
                id:
                  subcontractor.subcontractor_in_st_id,

                name:
                  subcontractor.subcontractor_user_name ||
                  "NA",

                role:
                  "Technician",

                company:
                  subcontractor.subcontractor_company ||
                  "Subcontractor",

                isSubcontractor:
                  true,
              }),
            ) || []
          : []),
      ];

    return (
      <div className="flex flex-col mt-4 bg-white border border-gray-100 rounded-[28px] shadow-sm overflow-hidden">
        {/* TOP BAR */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-5 md:p-6">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-md">
                <MdGroups className="text-2xl" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#1E1B4B]">
                  Technicians &
                  Managers
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Assigned
                  service ticket
                  people
                </p>
              </div>
            </div>

            {access.includes(
              user_type,
            ) && (
              <button
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  via-purple-500
                  to-pink-500
                  text-white
                  text-sm
                  font-semibold
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
                onClick={
                  handleOpenModal
                }
              >
                <MdEngineering className="text-lg" />
                Add Person
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-pink-50">
                  <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                    Name
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                    Role
                  </th>

                  <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                    Company
                  </th>

                  {user_type ===
                    "Admin" && (
                    <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B] w-[100px]">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {allAssignees?.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={
                        user_type ===
                        "Admin"
                          ? 4
                          : 3
                      }
                      className="py-14 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <MdGroups className="text-5xl text-gray-300 mb-4" />

                        <h3 className="text-lg font-semibold text-[#1E1B4B]">
                          No
                          Assignees
                          Found
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          No
                          people
                          assigned
                          yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  allAssignees.map(
                    (
                      person,
                      index,
                    ) => (
                      <tr
                        key={
                          index
                        }
                        className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                      >
                        {/* NAME */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`
                                w-10
                                h-10
                                rounded-xl
                                flex
                                items-center
                                justify-center
                                border
                                
                                ${
                                  person.isSubcontractor
                                    ? "bg-orange-50 border-orange-100 text-orange-500"
                                    : person.role ===
                                      "Project Manager"
                                    ? "bg-purple-50 border-purple-100 text-purple-500"
                                    : "bg-indigo-50 border-indigo-100 text-indigo-500"
                                }
                              `}
                            >
                              {person.isSubcontractor ? (
                                <MdBusiness className="text-lg" />
                              ) : person.role ===
                                "Project Manager" ? (
                                <MdOutlineBadge className="text-lg" />
                              ) : (
                                <MdEngineering className="text-lg" />
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-[#1E1B4B]">
                                {
                                  person.name
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ROLE */}
                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex
                              px-3
                              py-1
                              rounded-xl
                              text-xs
                              font-semibold
                              
                              ${
                                person.role ===
                                "Project Manager"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-indigo-100 text-indigo-700"
                              }
                            `}
                          >
                            {
                              person.role
                            }
                          </span>
                        </td>

                        {/* COMPANY */}
                        <td className="px-5 py-4 text-sm text-gray-700">
                          {
                            person.company
                          }
                        </td>

                        {/* ACTION */}
                        {user_type ===
                          "Admin" && (
                          <td className="px-5 py-4">
                            <div className="flex justify-center">
                              {!person.isSubcontractor && (
                                <button
                                  className="
                                    w-9
                                    h-9
                                    rounded-xl
                                    bg-red-50
                                    border
                                    border-red-100
                                    text-red-500
                                    hover:bg-red-100
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    duration-300
                                  "
                                  onClick={() =>
                                    handleDelete(
                                      person.id,
                                    )
                                  }
                                >
                                  <AiFillDelete className="text-lg" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ),
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* MODAL */}
          <AddTechnicianToServiceTicket
            isOpen={
              isModalOpen
            }
            onClose={
              handleCloseModal
            }
            onSave={
              handleAddAssignee
            }
            serviceTicketId={
              serviceTicketId
            }
            idrEmployees={
              idrEmployees
            }
          />
        </div>
      </div>
    );
  };

export default ServiceTicketAssigneePeopleCard;