/** @format */

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { BiSolidEditAlt } from "react-icons/bi";

import { AiFillDelete } from "react-icons/ai";

import {
  MdOutlineInventory2,
  MdSearch,
  MdRefresh,
  MdBusiness,
  MdLocationOn,
} from "react-icons/md";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import Loader from "../../Images/ZZ5H.gif";

import { getClients } from "../../actions/clientActions";

import { getLocationByClient } from "../../actions/locationActions";

import { getRmaLists, deleteRma } from "../../actions/rmaActions";

const RmaViewList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { clients } = useSelector((state) => state.client);

  const { locations } = useSelector((state) => state.location);

  const { rmaList, loading } = useSelector((state) => state.rma);

  const { user_type, client_type } = useSelector((state) => state.user.user);

  const [filters, setFilters] = useState({
    client_id: "",
    location_id: "",
    manufacturer: "",
    status: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "ASC",
  });

  useEffect(() => {
    dispatch(getRmaLists({}));

    if (user_type !== "Client Employee") {
      dispatch(getClients());
    }
  }, [dispatch, user_type]);

  /* CLIENT CHANGE */
  const handleClientChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      client_id: value,
      location_id: "",
      manufacturer: "",
    }));

    dispatch(getLocationByClient(value));
  };

  /* LOCATION */
  const handleLocationChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      location_id: value,
    }));
  };

  /* MANUFACTURER */
  const handleManufacturerChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      manufacturer: value,
    }));
  };

  /* STATUS */
  const handleStatusChange = (e) => {
    const { value } = e.target;

    setFilters((prevFilters) => ({
      ...prevFilters,
      status: value,
    }));
  };

  /* SEARCH */
  const handleSearch = () => {
    const { client_id, location_id, manufacturer, status } = filters;

    const query = {
      ...(client_id && {
        client_id,
      }),

      ...(location_id && {
        location_id,
      }),

      ...(manufacturer && {
        manufacturer,
      }),

      ...(status && {
        status,
      }),
    };

    dispatch(getRmaLists(query));
  };

  /* RESET */
  const handleReset = () => {
    setFilters({
      client_id: "",
      location_id: "",
      manufacturer: "",
      status: "",
    });

    dispatch(getRmaLists({}));
  };

  /* DELETE */
  const handleDeleteRma = (rmaId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this RMA?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteRma(rmaId))
          .then(() => {
            dispatch(getRmaLists(filters));
          })
          .catch((error) => {
            console.log(error);

            toast.error("Failed to delete this item");
          });
      }
    });
  };

  /* EDIT */
  const handleEdit = (rmaId) => {
    navigate(`/edit-device-rma/${rmaId}`);
  };

  /* DATE */
  const formatDateToMDY = (dateString) => {
    if (!dateString) return "";

    const [day, month, year] = dateString.split("/");

    return `${month}/${day}/${year}`;
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

    const { client_id, location_id, manufacturer, status } = filters;

    const query = {
      ...(client_id && {
        client_id,
      }),

      ...(location_id && {
        location_id,
      }),

      ...(manufacturer && {
        manufacturer,
      }),

      ...(status && {
        status,
      }),
    };

    dispatch(getRmaLists(query, key, direction));
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }

    return "↕";
  };

  const userTypesWithClientPermission = [
    "Subcontractor_User",
    "Client Employee",
    "Subcontractor",
  ];

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

            <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                  <MdOutlineInventory2 className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-[#1E1B4B]">
                    RMA Management
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Manage and track all return merchandise authorizations
                  </p>
                </div>
              </div>

              <div
                className="
                    px-4
                    py-2
                    rounded-2xl
                    bg-indigo-50
                    border
                    border-indigo-100
                  "
              >
                <p className="text-sm text-indigo-700 font-semibold">
                  Total RMAs: {rmaList?.length}
                </p>
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
              {!userTypesWithClientPermission.includes(user_type) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    handleSearch();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                    {/* CLIENT */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Client
                      </label>

                      <div className="relative">
                        <MdBusiness
                          className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              text-gray-400
                            "
                        />

                        <select
                          className="
                              w-full
                              rounded-2xl
                              border
                              border-gray-200
                              pl-10
                              pr-4
                              py-3
                              text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                            "
                          value={filters.client_id}
                          onChange={handleClientChange}
                        >
                          <option value="">Select Client</option>

                          {clients?.data?.map((client) => (
                            <option
                              key={client.client_id}
                              value={client.client_id}
                            >
                              {client.company_name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* LOCATION */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Location
                      </label>

                      <div className="relative">
                        <MdLocationOn
                          className="
                              absolute
                              left-3
                              top-1/2
                              -translate-y-1/2
                              text-gray-400
                            "
                        />

                        <select
                          className={`
                              w-full
                              rounded-2xl
                              border
                              border-gray-200
                              pl-10
                              pr-4
                              py-3
                              text-sm
                              focus:outline-none
                              focus:ring-2
                              focus:ring-indigo-500
                              ${
                                !filters.client_id
                                  ? "bg-gray-100 text-gray-500"
                                  : ""
                              }
                            `}
                          value={filters.location_id}
                          onChange={handleLocationChange}
                          disabled={!filters.client_id}
                        >
                          <option value="">Select Location</option>

                          {locations?.map((location) => (
                            <option
                              key={location.location_id}
                              value={location.location_id}
                            >
                              {location.address_line_one}{" "}
                              {location.address_line_two}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Status
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
                        value={filters.status}
                        onChange={handleStatusChange}
                      >
                        <option value="">All Status</option>

                        <option value="Open">Open</option>

                        <option value="Approved">Approved</option>

                        <option value="Shipped back">Shipped back</option>

                        <option value="Received by manufacturer">
                          Received by manufacturer
                        </option>

                        <option value="Received replacement">
                          Received replacement
                        </option>

                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* MANUFACTURER */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Manufacturer
                      </label>

                      <input
                        type="text"
                        placeholder="Search manufacturer"
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
                        value={filters.manufacturer}
                        onChange={handleManufacturerChange}
                      />
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="
                          flex
                          items-center
                          gap-2
                          px-5
                          py-3
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          text-gray-700
                          text-sm
                          font-semibold
                          hover:bg-gray-50
                          transition-all
                        "
                    >
                      <MdRefresh className="text-lg" />
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="
                          flex
                          items-center
                          gap-2
                          px-5
                          py-3
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
                      <MdSearch className="text-lg" />
                      Search
                    </button>
                  </div>
                </form>
              )}

              {user_type === "Client Employee" && client_type !== "user" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    handleSearch();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* STATUS */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Status
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
                        value={filters.status}
                        onChange={handleStatusChange}
                      >
                        <option value="">All Status</option>

                        <option value="Open">Open</option>

                        <option value="Approved">Approved</option>

                        <option value="Shipped back">Shipped back</option>

                        <option value="Received by manufacturer">
                          Received by manufacturer
                        </option>

                        <option value="Received replacement">
                          Received replacement
                        </option>

                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* MANUFACTURER */}
                    <div>
                      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                        Manufacturer
                      </label>

                      <input
                        type="text"
                        placeholder="Search manufacturer"
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
                        value={filters.manufacturer}
                        onChange={handleManufacturerChange}
                      />
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-700
                            text-sm
                            font-semibold
                            hover:bg-gray-50
                            transition-all
                          "
                    >
                      <MdRefresh className="text-lg" />
                      Reset
                    </button>

                    <button
                      type="submit"
                      className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
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
                      <MdSearch className="text-lg" />
                      Search
                    </button>
                  </div>
                </form>
              )}
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50">
                    {[
                      {
                        label: "Client",
                        key: "client_name",
                      },
                      {
                        label: "RMA",
                        key: "rma_number",
                      },
                      {
                        label: "Location",
                        key: "location_name",
                      },
                      {
                        label: "Manufacturer",
                        key: "manufacturer",
                      },
                      {
                        label: "Model",
                        key: "model",
                      },
                      {
                        label: "Serial",
                        key: "serial",
                      },
                      {
                        label: "Status",
                        key: "status",
                      },
                    ].map((item) => (
                      <th
                        key={item.key}
                        onClick={() =>
                          item.key === "status" && handleSort(item.key)
                        }
                        className={`
              px-2
              py-3
              text-[11px]
              font-semibold
              uppercase
              tracking-wide
              text-gray-500
              border-b
              ${item.key === "status" ? "cursor-pointer" : ""}
            `}
                      >
                        <div className="flex items-center gap-1">
                          {item.label}

                          {item.key === "status" && (
                            <span>{getSortSymbol("status")}</span>
                          )}
                        </div>
                      </th>
                    ))}

                    <th className="px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b">
                      Approved
                    </th>

                    <th className="px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b">
                      By
                    </th>

                    <th className="px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 border-b text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="py-16">
                        <div className="flex justify-center items-center">
                          <img
                            src={Loader}
                            alt="Loading..."
                            className="h-14 w-14"
                          />
                        </div>
                      </td>
                    </tr>
                  ) : rmaList?.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-14 text-center">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <MdOutlineInventory2 className="text-3xl text-gray-400" />
                          </div>

                          <h3 className="text-sm font-semibold text-[#1E1B4B]">
                            No RMAs Found
                          </h3>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    rmaList?.map((rma) => (
                      <tr
                        key={rma.rma_id}
                        className="hover:bg-indigo-50/40 transition-all"
                      >
                        <td className="px-2 py-3 border-b text-[13px] text-gray-700">
                          {rma.client_name}
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] font-medium text-gray-700">
                          {rma.rma_number}
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] text-gray-700">
                          {rma?.location_name || "NA"}
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] text-gray-700">
                          {rma.manufacturer}
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] text-gray-700">
                          {rma.model}
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] text-gray-700">
                          {rma.serial}
                        </td>

                        <td className="px-2 py-3 border-b">
                          <span
                            className={`
                  px-2
                  py-1
                  rounded-full
                  text-[11px]
                  font-semibold
                  whitespace-nowrap
                  ${
                    rma.status === "Closed"
                      ? "bg-green-100 text-green-700"
                      : rma.status === "Approved"
                        ? "bg-blue-100 text-blue-700"
                        : rma.status === "Open"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                  }
                `}
                          >
                            {rma.status}
                          </span>
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] text-gray-700 whitespace-nowrap">
                          {formatDateToMDY(rma.aprooved_date)}
                        </td>

                        <td className="px-2 py-3 border-b text-[13px] text-gray-700">
                          {rma.aprooved_by}
                        </td>

                        <td className="px-2 py-3 border-b">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEdit(rma.rma_id)}
                              className="
                    w-8
                    h-8
                    rounded-lg
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

                            {user_type === "Admin" && (
                              <button
                                onClick={() => handleDeleteRma(rma.rma_id)}
                                className="
                      w-8
                      h-8
                      rounded-lg
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

export default RmaViewList;
