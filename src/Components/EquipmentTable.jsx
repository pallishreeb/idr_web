/** @format */

import React, {
  useState,
} from "react";

import {
  useSelector,
  useDispatch,
} from "react-redux";

import {
  MdDevices,
  MdKeyboardReturn,
  MdCheckCircle,
} from "react-icons/md";

import {
  returnEquipment,
} from "../actions/workOrderActions";

const EquipmentTable =
  ({
    equipments,
    work_order_id,
  }) => {
    const dispatch =
      useDispatch();

    const [
      loading,
      setLoading,
    ] =
      useState(
        null,
      );

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

    const handleReturnEquipment =
      (
        assigned_inventory_id,
      ) => {
        setLoading(
          assigned_inventory_id,
        );

        dispatch(
          returnEquipment(
            assigned_inventory_id,
          ),
        )
          .then(
            () => {
              setLoading(
                null,
              );
            },
          )
          .catch(
            (
              error,
            ) => {
              console.error(
                "Error returning Equipment:",
                error,
              );

              setLoading(
                null,
              );
            },
          );
      };

    return (
      <>
        {equipments.length >
          0 && (
          <div className="mt-4 bg-white border border-gray-100 rounded-[30px] shadow-sm overflow-hidden">
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-5 md:p-7">
              {/* HEADER */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
                <div className="flex items-center gap-4">
                  {/* ICON */}
                  <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                    <MdDevices className="text-2xl" />
                  </div>

                  {/* TITLE */}
                  <div>
                    <h1 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                      Assigned
                      Equipments
                    </h1>

                    <p className="text-sm text-gray-500 mt-1">
                      Equipment
                      assigned for
                      this work
                      order
                    </p>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-pink-50">
                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                        Model
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                        Make
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                        Device
                        Type
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                        Location
                      </th>

                      {access.includes(
                        user_type,
                      ) && (
                        <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B]">
                          Action
                        </th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {equipments?.map(
                      (
                        equipment,
                      ) => (
                        <tr
                          key={
                            equipment.equipment_id
                          }
                          className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                          {/* MODEL */}
                          <td className="px-5 py-4">
                            <div className="font-medium text-sm text-[#1E1B4B]">
                              {
                                equipment.model
                              }
                            </div>
                          </td>

                          {/* MAKE */}
                          <td className="px-5 py-4">
                            <div className="text-sm text-gray-700">
                              {
                                equipment.make
                              }
                            </div>
                          </td>

                          {/* DEVICE TYPE */}
                          <td className="px-5 py-4">
                            <span className="inline-flex px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-100 text-indigo-700">
                              {
                                equipment.device_type
                              }
                            </span>
                          </td>

                          {/* LOCATION */}
                          <td className="px-5 py-4">
                            <div className="text-sm text-gray-700">
                              {
                                equipment.location_name
                              }
                            </div>
                          </td>

                          {/* ACTION */}
                          {access.includes(
                            user_type,
                          ) && (
                            <td className="px-5 py-4">
                              <div className="flex justify-center">
                                <button
                                  onClick={() =>
                                    handleReturnEquipment(
                                      equipment.assign_equip_id,
                                    )
                                  }
                                  disabled={
                                    loading ===
                                    equipment.assign_equip_id
                                  }
                                  className={`
                                    flex
                                    items-center
                                    gap-2
                                    px-4
                                    py-2.5
                                    rounded-2xl
                                    text-sm
                                    font-semibold
                                    shadow-sm
                                    transition-all
                                    duration-300
                                    
                                    ${
                                      loading ===
                                      equipment.assign_equip_id
                                        ? "bg-gray-300 text-white cursor-not-allowed"
                                        : "bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white hover:shadow-md hover:scale-[1.02]"
                                    }
                                  `}
                                >
                                  {loading ===
                                  equipment.assign_equip_id ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      Returning...
                                    </>
                                  ) : (
                                    <>
                                      <MdKeyboardReturn className="text-lg" />
                                      Return
                                      Equipment
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* EMPTY */}
              {equipments.length ===
                0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-10 text-center">
                  <MdCheckCircle className="mx-auto text-5xl text-gray-300 mb-4" />

                  <h3 className="text-lg font-semibold text-[#1E1B4B]">
                    No Equipment
                    Assigned
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    Assigned
                    equipment
                    details will
                    appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

export default EquipmentTable;