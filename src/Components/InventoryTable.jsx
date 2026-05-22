/** @format */

import React, { useState, useMemo } from "react";

import { useSelector, useDispatch } from "react-redux";

import {
  MdInventory2,
  MdKeyboardReturn,
  MdClose,
  MdCheckCircle,
  MdSearch,
  MdCategory,
} from "react-icons/md";

import { returnInventory } from "../actions/workOrderActions";

import { returnInventoryFromServiceTicket } from "../actions/serviceTicket";

const InventoryTable = ({ inventories, work_order_id, service_ticket_id }) => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const [quantity, setQuantity] = useState("");

  const [selectedInventoryId, setSelectedInventoryId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const { user_type } = useSelector((state) => state.user.user);

  const { technicianAccess } = useSelector((state) => state.user);

  // =========================
  // FILTERED INVENTORY
  // =========================

  const filteredInventories = useMemo(() => {
    return inventories?.filter((inventory) => {
      const search = searchTerm.toLowerCase();

      return (
        inventory?.model?.toLowerCase()?.includes(search) ||
        inventory?.make?.toLowerCase()?.includes(search) ||
        inventory?.device_type?.toLowerCase()?.includes(search)
      );
    });
  }, [inventories, searchTerm]);

  // =========================
  // RETURN INVENTORY
  // =========================

  const handleReturnInventory = () => {
    if (!quantity || quantity === 0) {
      alert("Please enter a quantity");

      return;
    }

    const payload = {
      assigned_inventory_id: selectedInventoryId,

      quantity,
    };

    let action;

    if (work_order_id) {
      payload.work_order_id = work_order_id;

      action = returnInventory;
    } else if (service_ticket_id) {
      payload.service_ticket_id = service_ticket_id;

      action = returnInventoryFromServiceTicket;
    } else {
      alert("No valid ID provided.");

      return;
    }

    dispatch(action(payload))
      .then(() => {
        setShowModal(false);

        setQuantity("");
      })
      .catch((error) => {
        console.error("Error returning inventory:", error);
      });
  };

  // =========================
  // EMPTY STATE
  // =========================

  if (!inventories || inventories.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className="
          mt-5
          bg-white
          border
          border-gray-100
          rounded-[28px]
          shadow-sm
          overflow-hidden
        "
      >
        {/* TOP BORDER */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-5 md:p-7">
          {/* HEADER */}
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-7">
            {/* LEFT */}
            <div className="flex items-center gap-4">
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gradient-to-r
                  from-indigo-500
                  to-pink-500
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                "
              >
                <MdInventory2 className="text-3xl" />
              </div>

              <div>
                <h1 className="text-xl font-semibold text-[#1E1B4B]">
                  Inventory Parts Used
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Inventory parts used to complete the service
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* SEARCH */}
              <div className="relative">
                <MdSearch
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    text-lg
                  "
                />

                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full
                    sm:w-72
                    pl-11
                    pr-4
                    py-3
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-sm
                    text-gray-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                />
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-gradient-to-r
                from-indigo-50
                to-purple-50
                p-5
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inventory Items</p>

                  <h2 className="text-3xl font-bold text-[#1E1B4B] mt-2">
                    {filteredInventories.length}
                  </h2>
                </div>

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white
                    text-indigo-600
                    flex
                    items-center
                    justify-center
                    shadow-sm
                  "
                >
                  <MdInventory2 className="text-3xl" />
                </div>
              </div>
            </div>

            <div
              className="
                rounded-2xl
                border
                border-gray-100
                bg-gradient-to-r
                from-pink-50
                to-orange-50
                p-5
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Device Types</p>

                  <h2 className="text-3xl font-bold text-[#1E1B4B] mt-2">
                    {
                      [
                        ...new Set(
                          filteredInventories?.map((item) => item.device_type),
                        ),
                      ].length
                    }
                  </h2>
                </div>

                <div
                  className="
                    w-14
                    h-14
                    rounded-2xl
                    bg-white
                    text-pink-600
                    flex
                    items-center
                    justify-center
                    shadow-sm
                  "
                >
                  <MdCategory className="text-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div
            className="
              overflow-x-auto
              rounded-2xl
              border
              border-gray-100
            "
          >
            <table className="w-full min-w-[850px]">
              {/* HEAD */}
              <thead>
                <tr
                  className="
                    bg-gradient-to-r
                    from-indigo-50
                    via-purple-50
                    to-pink-50
                  "
                >
                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-[#1E1B4B]
                      whitespace-nowrap
                    "
                  >
                    Model
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-[#1E1B4B]
                      whitespace-nowrap
                    "
                  >
                    Make
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-[#1E1B4B]
                      whitespace-nowrap
                    "
                  >
                    Device Type
                  </th>

                  <th
                    className="
                      px-5
                      py-4
                      text-left
                      text-xs
                      font-semibold
                      uppercase
                      tracking-wide
                      text-[#1E1B4B]
                      whitespace-nowrap
                    "
                  >
                    Quantity
                  </th>

                  {(user_type === "Admin" ||
                    technicianAccess.includes(user_type)) && (
                    <th
                      className="
                        px-5
                        py-4
                        text-center
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        text-[#1E1B4B]
                        whitespace-nowrap
                      "
                    >
                      Action
                    </th>
                  )}
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {filteredInventories?.map((inventory) => (
                  <tr
                    key={inventory.inventory_id}
                    className="
                        border-t
                        border-gray-100
                        hover:bg-gray-50
                        transition-all
                        duration-200
                      "
                  >
                    {/* MODEL */}
                    <td className="px-5 py-5 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-semibold text-[#1E1B4B]">
                          {inventory.model}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Inventory Model
                        </p>
                      </div>
                    </td>

                    {/* MAKE */}
                    <td className="px-5 py-5 whitespace-nowrap">
                      <p className="text-sm text-gray-700 font-medium">
                        {inventory.make}
                      </p>
                    </td>

                    {/* TYPE */}
                    <td className="px-5 py-5 whitespace-nowrap">
                      <span
                        className="
                            inline-flex
                            px-3
                            py-1.5
                            rounded-xl
                            text-xs
                            font-semibold
                            bg-indigo-100
                            text-indigo-700
                          "
                      >
                        {inventory.device_type}
                      </span>
                    </td>

                    {/* QUANTITY */}
                    <td className="px-5 py-5 whitespace-nowrap">
                      <span
                        className="
                            inline-flex
                            items-center
                            justify-center
                            min-w-[50px]
                            px-3
                            py-1.5
                            rounded-xl
                            bg-gray-100
                            text-gray-700
                            text-sm
                            font-semibold
                          "
                      >
                        {inventory.quantity}
                      </span>
                    </td>

                    {/* ACTION */}
                    {technicianAccess.includes(user_type) && (
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div className="flex justify-center">
                          <button
                            onClick={() => {
                              setShowModal(true);

                              setSelectedInventoryId(
                                inventory.assigned_inventory_id,
                              );
                            }}
                            className="
                                flex
                                items-center
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
                                shadow-sm
                                hover:shadow-md
                                hover:scale-[1.02]
                                transition-all
                                duration-300
                              "
                          >
                            <MdKeyboardReturn className="text-lg" />
                            Return Inventory
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {/* EMPTY */}
                {filteredInventories.length === 0 && (
                  <tr>
                    <td
                      colSpan={technicianAccess.includes(user_type) ? 5 : 4}
                      className="py-16"
                    >
                      <div className="flex flex-col items-center justify-center text-center">
                        <div
                          className="
                            w-20
                            h-20
                            rounded-full
                            bg-gray-100
                            flex
                            items-center
                            justify-center
                            mb-4
                          "
                        >
                          <MdInventory2 className="text-4xl text-gray-400" />
                        </div>

                        <h3 className="text-base font-semibold text-[#1E1B4B]">
                          No Inventory Found
                        </h3>

                        <p className="text-sm text-gray-500 mt-2">
                          No inventory items match your search.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* RETURN MODAL */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            px-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-[30px]
              shadow-2xl
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6">
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-gradient-to-r
                      from-indigo-500
                      to-pink-500
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-md
                    "
                  >
                    <MdKeyboardReturn className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#1E1B4B]">
                      Return Inventory
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Enter quantity to return
                    </p>
                  </div>
                </div>

                {/* CLOSE */}
                <button
                  onClick={() => setShowModal(false)}
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

              {/* INPUT */}
              <div className="mb-6">
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    text-[#1E1B4B]
                    mb-2
                  "
                >
                  Return Quantity
                </label>

                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    text-gray-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                    focus:border-transparent
                  "
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
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
                >
                  Cancel
                </button>

                <button
                  onClick={handleReturnInventory}
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
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
                >
                  <MdCheckCircle className="text-lg" />
                  Submit Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
