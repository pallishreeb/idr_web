/** @format */

import { useEffect, useState } from "react";

import { Link, useNavigate, useLocation } from "react-router-dom";

import { BiSolidShow } from "react-icons/bi";

import { BsCheckCircle } from "react-icons/bs";

import {
  MdDevices,
  MdArrowBack,
  MdRefresh,
  MdAssignment,
  MdKeyboardReturn,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getAssignedEquipments,
  getReturnedRequestEquipments,
  confirmReturnedEquipment,
} from "../../actions/idrEquipmentAction";

import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

const AssignedEquipments = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  /* FILTERS */
  const [filters, setFilters] = useState({
    signout: "",
  });

  const [selectedOption, setSelectedOption] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ASC",
  });

  const { access } = useSelector((state) => state.user);

  const { user_type } = useSelector((state) => state.user.user);

  const loading = useSelector((state) => state.idrequipment.loading);

  const equipmentData = useSelector((state) => state.idrequipment.equipments);

  const isReturnPage = location.search.includes("returns");

  /* FETCH DATA */
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const type = params.get("type");

    if (type === "assignment") {
      dispatch(getAssignedEquipments(filters));
    } else if (type === "returns") {
      dispatch(getReturnedRequestEquipments(filters));
    }
  }, [location.search, dispatch, filters]);

  /* SELECT FILTER */
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    setSelectedOption(selectedValue);

    const param =
      selectedValue === "assignedEquipments" ? "assignment" : "returns";

    navigate(`/assigned-equipment?type=${param}`);
  };

  /* RESET */
  const handleReset = () => {
    const resetFilters = {
      signout: "",
    };

    setFilters(resetFilters);

    dispatch(getAssignedEquipments(resetFilters));
  };

  /* CONFIRM */
  const handleConfirm = (equipmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to confirm this return request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(confirmReturnedEquipment(equipmentId))
          .then(() => {
            dispatch(getReturnedRequestEquipments(filters));
          })
          .catch((error) => {
            console.log(error);

            toast.error("Failed to confirm equipment.");
          });
      }
    });
  };

  /* SORT */
  const handleSort = (key) => {
    let direction = "ASC";

    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }

    setSortConfig({
      key,
      direction,
    });

    const params = new URLSearchParams(location.search);

    const type = params.get("type");

    if (type === "returns") {
      dispatch(
        getReturnedRequestEquipments({
          ...filters,
          sortBy: key,
          orderBy: direction,
        }),
      );
    } else {
      dispatch(
        getAssignedEquipments({
          ...filters,
          sortBy: key,
          orderBy: direction,
        }),
      );
    }
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
                  {isReturnPage ? (
                    <MdKeyboardReturn className="text-2xl" />
                  ) : (
                    <MdAssignment className="text-2xl" />
                  )}
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    {isReturnPage
                      ? "Return Equipment Requests"
                      : "Assigned IDR Equipments"}
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    {isReturnPage
                      ? "Manage and confirm equipment return requests"
                      : "View all assigned company equipments"}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-wrap gap-3">
                {/* TYPE FILTER */}
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
                  {isReturnPage ? (
                    <>
                      <option value="returnRequestEquipments">
                        Return Requests
                      </option>

                      <option value="assignedEquipments">
                        Assigned Equipment
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="assignedEquipments">
                        Assigned Equipment
                      </option>

                      <option value="returnRequestEquipments">
                        Return Requests
                      </option>
                    </>
                  )}
                </select>

                {/* BACK */}
                <Link to="/idr-equipment" state={location.state}>
                  <button
                    className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2.5
                        rounded-2xl
                        border
                        border-gray-200
                        bg-white
                        text-gray-700
                        text-sm
                        font-medium
                        hover:bg-gray-50
                        transition-all
                      "
                  >
                    <MdArrowBack className="text-lg" />
                    Back to Equipments
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

            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* DATE FILTER */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Filter by Signed Out Date
                  </label>

                  <input
                    type="date"
                    value={filters.signout}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        signout: e.target.value,
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
                  />
                </div>

                {/* RESET */}
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
                        label: "Assigned To",
                        key: "assigned_to",
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
                              whitespace-nowrap
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
                      <td colSpan="8" className="py-16 text-center">
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
                      <td colSpan="8" className="py-16 text-center">
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
                            No Records Found
                          </h3>

                          <p className="text-sm text-gray-500 mt-2">
                            Assigned equipment data will appear here
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
                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {equipment.equipments?.location_name}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {equipment.equipments?.assigned_to
                            ? equipment.equipments.assigned_to
                            : "NA"}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {equipment.equipments?.serial_number}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {equipment.equipments?.device_type}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {equipment.equipments?.make}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {equipment.equipments?.model}
                        </td>

                        <td className="px-4 py-3 border-b text-[13px] text-gray-700 max-w-[220px]">
                          {truncateText(equipment.equipments?.description, 30)}
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3 border-b">
                          <div className="flex gap-2">
                            {/* VIEW */}
                            <button
                              onClick={() =>
                                navigate(
                                  `/edit-company-equipment/${equipment.equipments?.equipment_id}?type=assign`,
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
                              <BiSolidShow className="text-base" />
                            </button>

                            {/* CONFIRM */}
                            {access.includes(user_type) && isReturnPage && (
                              <button
                                onClick={() =>
                                  handleConfirm(equipment?.assign_equip_id)
                                }
                                className="
                                      w-8
                                      h-8
                                      rounded-xl
                                      bg-green-50
                                      text-green-600
                                      flex
                                      items-center
                                      justify-center
                                      hover:bg-green-100
                                      transition-all
                                    "
                              >
                                <BsCheckCircle className="text-base" />
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

export default AssignedEquipments;
