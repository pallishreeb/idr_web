/** @format */

import { useState, useEffect } from "react";

import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { BiSolidEditAlt, BiTransferAlt } from "react-icons/bi";

import { AiFillDelete } from "react-icons/ai";

import {
  MdInventory2,
  MdAdd,
  MdSearch,
  MdRefresh,
  MdLocationOn,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  postLocationInventory,
  getLocationInventory,
} from "../../actions/locationsInventoryAction";

import {
  deleteInventory,
  getInventories,
  updateInventory,
} from "../../actions/inventoryAction";

import { toast } from "react-toastify";

import Loader from "../../Images/ZZ5H.gif";

import Swal from "sweetalert2";

import * as XLSX from "xlsx";

const Inventory = () => {
  const locationState = useLocation();

  const [showModal, setShowModal] = useState(false);

  const [location, setLocation] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    model: searchParams.get("model") || "",
    device_type:
      searchParams.get("device_type") || "",
  });

  const [editRowId, setEditRowId] = useState(null);

  const [editQuantity, setEditQuantity] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ASC",
  });

const [searchTerm, setSearchTerm] = useState(
  searchParams.get("search") || ""
);

const [deviceType, setDeviceType] = useState(
  searchParams.get("device_type") || ""
);

const [model, setModel] = useState(
  searchParams.get("model") || ""
);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { user_type } = useSelector((state) => state.user.user);

  const { access } = useSelector((state) => state.user);

  const loading = useSelector((state) => state.locationInventory.loading);

  const loadingInventory = useSelector((state) => state.inventory.loading);

  const inventoryList = useSelector((state) => state.inventory.inventories);

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations,
  );

  const locationsLoading = useSelector(
    (state) => state.locationInventory.loading,
  );

  // // const [filtersReady, setFiltersReady] = useState(false);

  // useEffect(() => {
  //   if (locationState.state) {
  //     const restoredFilters = {
  //       location: locationState.state.filters?.location || "",

  //       search: locationState.state.searchTerm || "",

  //       device_type: locationState.state.deviceType || "",

  //       model: locationState.state.model || "",
  //     };

  //     setFilters(restoredFilters);

  //     setSearchTerm(restoredFilters.search);

  //     setDeviceType(restoredFilters.device_type);

  //     setModel(restoredFilters.model);
  //   }

  //   setFiltersReady(true);
  // }, []);

useEffect(() => {
  dispatch(getLocationInventory());

  dispatch(getInventories(filters));
}, [dispatch, filters]);
useEffect(() => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  setSearchParams(params);
}, [filters, setSearchParams]);

  const handleSearch = () => {
    const newFilters = {
      ...filters,

      search: searchTerm,

      device_type: deviceType,

      model: model,
    };

    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters({
      search: "",
      location: "",
      model: "",
      device_type: "",
    });

    setSearchTerm("");

    setDeviceType("");

    setModel("");
  };

  const handleSort = (key) => {
    let direction = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    setSortConfig({
      key,
      direction,
    });

    dispatch(
      getInventories({
        ...filters,
        sortBy: key,
        orderBy: direction,
      }),
    );
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }

    return "↕";
  };

  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleConfirmSave = async () => {
    const data = {
      location: location,
    };

    if (data.location === "") {
      toast.error("Please enter location.");

      return;
    }

    dispatch(postLocationInventory(data)).then((res) => {
      if (res) {
        toast.success("Location added successfully.");

        setLocation("");

        dispatch(getLocationInventory());

        setShowModal(false);
      }
    });
  };

  const handleDelete = (inventoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Inventory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInventory(inventoryId))
          .then(() => {
            dispatch(getInventories(filters));
          })
          .catch((error) => {
            console.log(error);

            toast.error("Failed to delete the Inventory.");
          });
      }
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "NA";

    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + "...";
  };

  const handleSaveQuantity = (inventoryId) => {
    if (editQuantity === "" || isNaN(editQuantity)) {
      toast.error("Please enter a valid quantity.");

      return;
    }

    const inventoryData = {
      inventory_id: inventoryId,

      quantity: Number(editQuantity),
    };

    dispatch(updateInventory(inventoryData, navigate)).then(() => {
      setEditRowId(null);

      setEditQuantity("");
    });
  };

  const handleInventoryExportToExcel = () => {
    if (!inventoryList?.data || inventoryList.data.length === 0) {
      Swal.fire("No Data", "There is no inventory data to export", "info");

      return;
    }

    const exportData = inventoryList.data.map((item) => ({
      Location: item.location || "",

      "Device Type": item.device_type || "",

      Make: item.make || "",

      Model: item.model || "",

      Color: item.color || "",

      Size: item.size || "",

      Quantity: item.quantity || 0,

      Description: item.description || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Inventory");

    const fileName = `inventory_export_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    XLSX.writeFile(wb, fileName, {
      bookType: "csv",
    });
  };

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div
          className="
            flex-1
            p-4
            md:p-5
            overflow-x-hidden
          "
        >
          {/* PAGE HEADER */}
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-5
            "
          >
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-4 md:p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              {/* LEFT */}
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
                  <MdInventory2 className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Inventory
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Manage and track all inventory items
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                {access.includes(user_type) && (
                  <button
                    onClick={handleInventoryExportToExcel}
                    className="
                      px-4
                      py-2.5
                      rounded-2xl
                      bg-green-600
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                      hover:bg-green-700
                      transition-all
                    "
                  >
                    Export Inventory
                  </button>
                )}

                {user_type === "Admin" && (
                  <button
                    onClick={handleOpenModel}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
                      rounded-2xl
                      bg-indigo-600
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                      hover:bg-indigo-700
                      transition-all
                    "
                  >
                    <MdLocationOn className="text-lg" />
                    Add Location
                  </button>
                )}

               <Link to={`/addinventory?${searchParams.toString()}`} >
                  <button
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
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
                      transition-all
                    "
                  >
                    <MdAdd className="text-lg" />
                    Add Inventory
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* FILTER CARD */}
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-5
            "
          >
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-4 md:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <select
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        location: e.target.value,
                      })
                    }
                  >
                    <option value="">All Location</option>

                    {locationsInventory?.map((ele) => (
                      <option
                        key={ele.inventory_location_id}
                        value={ele.location}
                      >
                        {ele.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DEVICE TYPE */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Device Type
                  </label>

                  <input
                    type="text"
                    placeholder="Device Type"
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* MODEL */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Model
                  </label>

                  <input
                    type="text"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* SEARCH */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Search
                  </label>

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
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="
                        w-full
                        rounded-2xl
                        border
                        border-gray-200
                        pl-11
                        pr-4
                        py-3
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                      "
                    />
                  </div>
                </div>

                {/* SEARCH BUTTON */}
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    className="
                      w-full
                      rounded-2xl
                      bg-indigo-600
                      text-white
                      py-3
                      text-sm
                      font-semibold
                      hover:bg-indigo-700
                      transition-all
                    "
                  >
                    Search
                  </button>
                </div>

                {/* RESET BUTTON */}
                <div className="flex items-end">
                  <button
                    onClick={handleReset}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      bg-white
                      text-gray-700
                      py-3
                      text-sm
                      font-semibold
                      hover:bg-gray-50
                      transition-all
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <MdRefresh className="text-lg" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
            "
          >
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      "Location",
                      "Device Type",
                      "Make",
                      "Model",
                      "Color",
                      "Size",
                      "Quantity",
                      "Description",
                      "Action",
                    ].map((heading, index) => (
                      <th
                        key={index}
                        className="
                            px-3
                            py-3
                            text-left
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-gray-500
                            border-b
                            cursor-pointer
                          "
                        onClick={() =>
                          heading !== "Description" &&
                          heading !== "Action" &&
                          handleSort(heading.toLowerCase().replace(" ", "_"))
                        }
                      >
                        {heading}

                        {heading !== "Description" && heading !== "Action" && (
                          <span className="ml-2">
                            {getSortSymbol(
                              heading.toLowerCase().replace(" ", "_"),
                            )}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loadingInventory ? (
                    <tr>
                      <td colSpan="9" className="py-16 text-center">
                        <div className="flex flex-col items-center">
                          <img
                            className="w-16 h-16"
                            src={Loader}
                            alt="Loading..."
                          />

                          <p className="text-sm text-gray-500 mt-3">
                            Loading inventory...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : inventoryList?.data?.length > 0 ? (
                    inventoryList.data.map((item) => (
                      <tr
                        key={item.inventory_id}
                        className="
                            hover:bg-indigo-50/40
                            transition-all
                          "
                      >
                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {item.location}
                        </td>

                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {item.device_type}
                        </td>

                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {item.make}
                        </td>

                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {item.model}
                        </td>

                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {item.color}
                        </td>

                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {item.size}
                        </td>

                        {/* QUANTITY */}
                        <td
                          className={`
                              px-3
                              py-3
                              border-b
                              text-[13px]
                              ${
                                access.includes(user_type)
                                  ? "cursor-pointer"
                                  : ""
                              }
                            `}
                          onDoubleClick={() => {
                            if (access.includes(user_type)) {
                              setEditRowId(item.inventory_id);

                              setEditQuantity(item.quantity);
                            }
                          }}
                        >
                          {editRowId === item.inventory_id ? (
                            <input
                              type="number"
                              className="
                                  w-20
                                  border
                                  border-gray-300
                                  rounded-lg
                                  px-2
                                  py-1
                                  text-sm
                                "
                              value={editQuantity}
                              autoFocus
                              onChange={(e) => setEditQuantity(e.target.value)}
                            />
                          ) : (
                            <span
                              className="
                                  inline-flex
                                  items-center
                                  px-2.5
                                  py-1
                                  rounded-full
                                  bg-indigo-50
                                  text-indigo-700
                                  text-[11px]
                                  font-semibold
                                "
                            >
                              {item.quantity}
                            </span>
                          )}
                        </td>

                        {/* DESCRIPTION */}
                        <td className="px-3 py-3 border-b text-[13px] text-gray-700">
                          {truncateText(item.description, 30)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-3 py-3 border-b">
                          <div className="flex gap-2">
                            {editRowId === item.inventory_id ? (
                              <>
                                <button
                                  className="
                                      px-3
                                      py-1.5
                                      rounded-lg
                                      bg-green-600
                                      text-white
                                      text-xs
                                      font-medium
                                    "
                                  onClick={() =>
                                    handleSaveQuantity(item.inventory_id)
                                  }
                                >
                                  Save
                                </button>

                                <button
                                  className="
                                      px-3
                                      py-1.5
                                      rounded-lg
                                      bg-gray-200
                                      text-gray-700
                                      text-xs
                                      font-medium
                                    "
                                  onClick={() => {
                                    setEditRowId(null);

                                    setEditQuantity("");
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className="
                                      w-8
                                      h-8
                                      rounded-xl
                                      bg-blue-50
                                      text-blue-600
                                      flex
                                      items-center
                                      justify-center
                                      hover:bg-blue-100
                                      transition-all
                                    "
                                  onClick={() =>
                                    navigate(
                                        `/edit_inventory/${item.inventory_id}?${searchParams.toString()}`
                                      )
                                  }
                                >
                                  <BiSolidEditAlt className="text-base" />
                                </button>

                                <button
                                  className="
                                      w-8
                                      h-8
                                      rounded-xl
                                      bg-purple-50
                                      text-purple-600
                                      flex
                                      items-center
                                      justify-center
                                      hover:bg-purple-100
                                      transition-all
                                    "
                                  onClick={() =>
                                    navigate(
                                        `/transfer-inventory/${item.inventory_id}?${searchParams.toString()}`
                                      )
                                  }
                                >
                                  <BiTransferAlt className="text-base" />
                                </button>

                                {user_type === "Admin" && (
                                  <button
                                    className="
                                        w-8
                                        h-8
                                        rounded-xl
                                        bg-red-50
                                        text-red-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-red-100
                                        transition-all
                                      "
                                    onClick={() =>
                                      handleDelete(item.inventory_id)
                                    }
                                  >
                                    <AiFillDelete className="text-base" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="py-16 text-center">
                        <div className="flex flex-col items-center">
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
                            Inventory items will appear here
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
      </div>

      {/* ADD LOCATION MODAL */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-[28px]
              shadow-2xl
              overflow-hidden
            "
          >
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
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
                  <MdLocationOn className="text-2xl" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#1E1B4B]">
                    Add Location
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Create a new inventory location
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Location Name
                </label>

                <input
                  type="text"
                  placeholder="Enter location name"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                  "
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  disabled={loading}
                  onClick={() => setShowModal(false)}
                  className="
                    px-5
                    py-2.5
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    text-sm
                    font-medium
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                <button
                  disabled={loading}
                  onClick={handleConfirmSave}
                  className="
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
                  "
                >
                  {locationsLoading ? "Saving..." : "Add Location"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
