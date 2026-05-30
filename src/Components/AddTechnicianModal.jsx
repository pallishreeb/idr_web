import React, { useState } from "react";

import {
  MdEngineering,
  MdOutlineBadge,
  MdClose,
  MdGroups,
} from "react-icons/md";

const AddTechnicianModal = ({
  isOpen,
  onClose,
  onSave,
  workOrderId,
  idrEmployees,
}) => {
  const [assigns, setAssigns] =
    useState({
      work_order_id:
        workOrderId,
      technicians: [],
      managers: [],
    });

  const handleSave =
    () => {
      if (
        !validateStep()
      ) {
        return;
      }

      onSave(
        assigns,
      );

      setAssigns({
        work_order_id:
          workOrderId,
        technicians:
          [],
        managers:
          [],
      });

      onClose();
    };

  const validateStep =
    () => {
      return (
        assigns
          .technicians
          .length >
          0 ||
        assigns.managers
          .length >
          0
      );
    };

  if (!isOpen)
    return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 py-6">
      <div className="w-full max-w-4xl bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* TOP BAR */}
        <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5 md:p-7">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-4 mb-7">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                <MdGroups className="text-2xl" />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#1E1B4B]">
                  Assign
                  Technicians &
                  Managers
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select
                  employees
                  for this
                  work order
                </p>
              </div>
            </div>

            {/* CLOSE */}
            <button
              onClick={
                onClose
              }
              className="
                w-10
                h-10
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                flex
                items-center
                justify-center
                text-gray-500
                hover:bg-red-50
                hover:text-red-500
                hover:border-red-100
                transition-all
                duration-300
              "
            >
              <MdClose className="text-xl" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TECHNICIANS */}
            <div className="border border-gray-100 rounded-3xl p-5 bg-gradient-to-br from-indigo-50/60 to-white">
              {/* TITLE */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <MdEngineering className="text-xl" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#1E1B4B]">
                    Technicians
                  </h3>

                  <p className="text-xs text-gray-500">
                    Select one
                    or multiple
                    technicians
                  </p>
                </div>
              </div>

              {/* CHECKBOX LIST */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {idrEmployees.map(
                  (
                    employee,
                  ) => {
                    const checked =
                      assigns.technicians.some(
                        (
                          tech,
                        ) =>
                          tech.technician_user_id ===
                          employee.user_id,
                      );

                    return (
                      <label
                        key={
                          employee.idr_emp_id
                        }
                        className={`
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-2xl
                          border
                          cursor-pointer
                          transition-all
                          duration-200
                          
                          ${
                            checked
                              ? "border-indigo-400 bg-indigo-50"
                              : "border-gray-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          onChange={(
                            e,
                          ) => {
                            if (
                              e
                                .target
                                .checked
                            ) {
                              setAssigns(
                                (
                                  prev,
                                ) => ({
                                  ...prev,
                                  technicians:
                                    [
                                      ...prev.technicians,
                                      {
                                        technician_user_id:
                                          employee.user_id,

                                        technician_name: `${employee.first_name} ${employee.last_name}`,

                                        technician_contact:
                                          employee.contact_number ||
                                          "",
                                      },
                                    ],
                                }),
                              );
                            } else {
                              setAssigns(
                                (
                                  prev,
                                ) => ({
                                  ...prev,
                                  technicians:
                                    prev.technicians.filter(
                                      (
                                        tech,
                                      ) =>
                                        tech.technician_user_id !==
                                        employee.user_id,
                                    ),
                                }),
                              );
                            }
                          }}
                          className="w-4 h-4 accent-indigo-600"
                        />

                        <div>
                          <p className="text-sm font-medium text-[#1E1B4B]">
                            {
                              employee.first_name
                            }{" "}
                            {
                              employee.last_name
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            Technician
                          </p>
                        </div>
                      </label>
                    );
                  },
                )}
              </div>
            </div>

            {/* MANAGERS */}
            <div className="border border-gray-100 rounded-3xl p-5 bg-gradient-to-br from-purple-50/60 to-white">
              {/* TITLE */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <MdOutlineBadge className="text-xl" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[#1E1B4B]">
                    Project
                    Managers
                  </h3>

                  <p className="text-xs text-gray-500">
                    Select one
                    or multiple
                    managers
                  </p>
                </div>
              </div>

              {/* CHECKBOX LIST */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {idrEmployees.map(
                  (
                    employee,
                  ) => {
                    const checked =
                      assigns.managers.some(
                        (
                          manager,
                        ) =>
                          manager.pm_user_id ===
                          employee.user_id,
                      );

                    return (
                      <label
                        key={
                          employee.idr_emp_id
                        }
                        className={`
                          flex
                          items-center
                          gap-3
                          p-3
                          rounded-2xl
                          border
                          cursor-pointer
                          transition-all
                          duration-200
                          
                          ${
                            checked
                              ? "border-purple-400 bg-purple-50"
                              : "border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/40"
                          }
                        `}
                      >
                        <input
                          type="checkbox"
                          checked={
                            checked
                          }
                          onChange={(
                            e,
                          ) => {
                            if (
                              e
                                .target
                                .checked
                            ) {
                              setAssigns(
                                (
                                  prev,
                                ) => ({
                                  ...prev,
                                  managers:
                                    [
                                      ...prev.managers,
                                      {
                                        pm_user_id:
                                          employee.user_id,

                                        project_manager: `${employee.first_name} ${employee.last_name}`,

                                        project_manager_contact:
                                          employee.contact_number ||
                                          "",
                                      },
                                    ],
                                }),
                              );
                            } else {
                              setAssigns(
                                (
                                  prev,
                                ) => ({
                                  ...prev,
                                  managers:
                                    prev.managers.filter(
                                      (
                                        manager,
                                      ) =>
                                        manager.pm_user_id !==
                                        employee.user_id,
                                    ),
                                }),
                              );
                            }
                          }}
                          className="w-4 h-4 accent-purple-600"
                        />

                        <div>
                          <p className="text-sm font-medium text-[#1E1B4B]">
                            {
                              employee.first_name
                            }{" "}
                            {
                              employee.last_name
                            }
                          </p>

                          <p className="text-xs text-gray-500">
                            Project
                            Manager
                          </p>
                        </div>
                      </label>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <button
              className="
                px-5
                py-3
                rounded-2xl
                border
                border-gray-200
                bg-gray-100
                text-gray-700
                text-sm
                font-semibold
                hover:bg-gray-200
                transition-all
                duration-300
              "
              onClick={
                onClose
              }
            >
              Cancel
            </button>

            <button
              className="
                px-6
                py-3
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
                handleSave
              }
            >
              Save
              Assignments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTechnicianModal;