/** @format */

import { useEffect, useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { BiSolidEditAlt, BiTransferAlt } from "react-icons/bi";

import { AiFillDelete } from "react-icons/ai";

import {
  MdDevices,
  MdAdd,
  MdSearch,
  MdRefresh,
  MdDownload,
  MdAssignment,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import {
  getIdrEquipments,
  deleteInventory,
} from "../../actions/idrEquipmentAction";

import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

import * as XLSX from "xlsx";

const IdrEquipment = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  const [filtersInitialized, setFiltersInitialized] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    model: "",
    device_type: "",
    signout: "",
  });

  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");

  const [modelFilter, setModelFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ASC",
  });

  const [selectedOption, setSelectedOption] = useState("");

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations,
  );

  const { access, technicianAccess } = useSelector((state) => state.user);

  const { user_type } = useSelector((state) => state.user.user);

  const loading = useSelector((state) => state.idrequipment.loading);

  const equipmentData = useSelector((state) => state.idrequipment.equipments);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    setSelectedOption(selectedValue);

    const param =
      selectedValue === "assignedEquipments" ? "assignment" : "returns";

    navigate(`/assigned-equipment?type=${param}`);
  };

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);

      setSearchQuery(location.state.filters.search || "");

      setDeviceTypeFilter(location.state.filters.device_type || "");

      setModelFilter(location.state.filters.model || "");
    }

    setFiltersInitialized(true);
  }, []);

  useEffect(() => {
    dispatch(getLocationInventory());
  }, [dispatch]);

  useEffect(() => {
    if (!filtersInitialized) return;

    dispatch(
      getIdrEquipments({
        ...filters,
        sortBy: sortConfig.key,
        orderBy: sortConfig.direction,
      }),
    );
  }, [dispatch, filters, sortConfig, filtersInitialized]);

  const handleSearch = () => {
    const newFilters = {
      ...filters,
      search: searchQuery,
      device_type: deviceTypeFilter,
      model: modelFilter,
    };

    setFilters(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      location: "",
      model: "",
      device_type: "",
      signout: "",
    };

    setFilters(resetFilters);

    setDeviceTypeFilter("");

    setModelFilter("");

    setSearchQuery("");
  };

  const handleDelete = (equipmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Equipment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInventory(equipmentId))
          .then(() => {})
          .catch((error) => {
            console.log(error);

            toast.error("Failed to delete the Equipment.");
          });
      }
    });
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
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }

    return "↕";
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;

    return text?.slice(0, maxLength) + "...";
  };

  const handleExportToExcel = () => {
    const exportData = equipmentData?.data?.map((item) => ({
      Location: item?.location_name || "",

      "Serial Number": item?.serial_number || "",

      "Device Type": item?.device_type || "",

      Make: item?.make || "",

      Model: item?.model || "",

      Description: item?.description || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "IDR Equipment");

    const fileName = `IDR_Equipment_${
      new Date().toISOString().split("T")[0]
    }.csv`;

    XLSX.writeFile(workbook, fileName, {
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-4 md:p-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div
                  className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-md
                    "
                >
                  <MdDevices className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    IDR Equipment
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Manage all company equipment and assignments
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              {access.includes(user_type) && (
                <div className="flex flex-wrap gap-3">
                  {/* FILTER */}
                  <select
                    name="equipmentFilters"
                    value={selectedOption}
                    onChange={handleSelectChange}
                    className="
                        rounded-2xl
                        border
                        border-gray-200
                        px-4
                        py-2.5
                        text-sm
                        bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-indigo-500
                      "
                  >
                    <option value="">Filter Equipment</option>

                    <option value="assignedEquipments">
                      Assigned Equipment
                    </option>

                    <option value="returnRequestEquipments">
                      Return Requests
                    </option>
                  </select>

                  {/* EXPORT */}
                  <button
                    onClick={handleExportToExcel}
                    className="
                        flex
                        items-center
                        gap-2
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
                    <MdDownload className="text-lg" />
                    Export
                  </button>

                  {/* ADD */}
                  <Link
                    to="/add-company-equipment"
                    state={{
                      filters,
                    }}
                  >
                    <button
                      className="
                          flex
                          items-center
                          gap-2
                          px-4
                          py-2.5
                          rounded-2xl
                          bg-gradient-to-r
                         from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                          text-white
                          text-sm
                          font-semibold
                          shadow-sm
                          hover:shadow-md
                          transition-all
                        "
                    >
                      <MdAdd className="text-lg" />
                      Add Equipment
                    </button>
                  </Link>
                </div>
              )}
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <select
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        location: e.target.value,
                      })
                    }
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
                  >
                    <option value="">All Locations</option>

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
                    value={deviceTypeFilter}
                    onChange={(e) => setDeviceTypeFilter(e.target.value)}
                    placeholder="Search device..."
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
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    placeholder="Search model..."
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
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search equipment..."
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

                {/* SEARCH BTN */}
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

                {/* RESET BTN */}
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      {
                        label: "Location",
                        key: "location_name",
                      },

                      {
                        label: "Serial Number",
                        key: "serial_number",
                      },

                      {
                        label: "Device Type",
                        key: "device_type",
                      },

                      {
                        label: "Make",
                        key: "make",
                      },

                      {
                        label: "Model",
                        key: "model",
                      },
                    ].map((item) => (
                      <th
                        key={item.key}
                        onClick={() => handleSort(item.key)}
                        className="
                              px-4
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
                      >
                        {item.label}

                        <span className="ml-2">{getSortSymbol(item.key)}</span>
                      </th>
                    ))}

                    <th
                      className="
                          px-4
                          py-3
                          text-left
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                    >
                      Description
                    </th>

                    <th
                      className="
                          px-4
                          py-3
                          text-left
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-wider
                          text-gray-500
                          border-b
                        "
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center">
                        <div className="flex flex-col items-center">
                          <div
                            className="
                                w-12
                                h-12
                                border-4
                                border-indigo-200
                                border-t-indigo-600
                                rounded-full
                                animate-spin
                              "
                          />

                          <p className="text-sm text-gray-500 mt-4">
                            Loading equipments...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : equipmentData?.data?.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-16 text-center">
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
                            <MdDevices className="text-4xl text-gray-400" />
                          </div>

                          <h3 className="text-base font-semibold text-[#1E1B4B]">
                            No Equipment Found
                          </h3>

                          <p className="text-sm text-gray-500 mt-2">
                            Equipment records will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    equipmentData?.data?.map((equipment, index) => (
                      <tr
                        key={index}
                        className="
                              hover:bg-indigo-50/40
                              transition-all
                            "
                      >
                        <td className="px-4 py-3 border-b text-[13px] text-gray-700">
                          {equipment?.location_name}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700">
                          {equipment?.serial_number}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700">
                          {equipment?.device_type}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700">
                          {equipment?.make}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700">
                          {equipment?.model}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 max-w-[220px]">
                          {truncateText(equipment?.description, 30)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3 border-b">
                          <div className="flex gap-2">
                            {/* EDIT */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/edit-company-equipment/${equipment?.equipment_id}`,
                                  {
                                    state: {
                                      filters,
                                    },
                                  },
                                )
                              }
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
                            >
                              <BiSolidEditAlt className="text-base" />
                            </button>

                            {/* TRANSFER */}
                            {technicianAccess.includes(user_type) && (
                              <button
                                onClick={() =>
                                  navigate(
                                    `/transfer-company-equipment/${equipment?.equipment_id}`,
                                    {
                                      state: {
                                        filters,
                                      },
                                    },
                                  )
                                }
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
                              >
                                <BiTransferAlt className="text-base" />
                              </button>
                            )}

                            {/* DELETE */}
                            {user_type === "Admin" && (
                              <button
                                onClick={() =>
                                  handleDelete(equipment?.equipment_id)
                                }
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
                              >
                                <AiFillDelete className="text-base" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
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

export default IdrEquipment;
