/** @format */

import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  AiFillDelete,
} from "react-icons/ai";

import Swal from "sweetalert2";

import {
  MdSearch,
  MdFilterList,
  MdAdd,
  MdBusiness,
  MdLocationOn,
  MdAttachMoney,
  MdGroups,
  MdPerson,
  MdStar,
} from "react-icons/md";

import {
  getSubcontractorLists,
  deleteSubcontractor,
} from "../../actions/subContractorAction";

import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";

import Loader from "../../Images/ZZ5H.gif";

import { toast } from "react-toastify";

const SubContractorList =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    // FILTERS
    const [
      filters,
      setFilters,
    ] = useState({
      state: "",
      name: "",
      city: "",
      coverage:
        "",
      type: "",
      status:
        "",
    });

    // SORT
    const [
      sortConfig,
      setSortConfig,
    ] = useState({
      key: "",
      direction:
        "ASC",
    });

    // REDUX
    const {
      subcontractors,
      loading,
    } =
      useSelector(
        (state) =>
          state.subcontractor,
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

    // FETCH
    useEffect(() => {
      dispatch(
        getSubcontractorLists(),
      );
    }, [
      dispatch,
    ]);

    // DELETE
    const handleDelete =
      (
        subcontractorId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",
          text: "Do you really want to delete this subcontractor?",
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
                deleteSubcontractor(
                  subcontractorId,
                ),
              )
                .then(
                  () => {
                    dispatch(
                      getSubcontractorLists(),
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

    // SEARCH
    const handleSearch =
      () => {
        const query =
          Object.fromEntries(
            Object.entries(
              filters,
            ).filter(
              ([
                _,
                value,
              ]) =>
                value.trim() !==
                "",
            ),
          );

        dispatch(
          getSubcontractorLists(
            query,
          ),
        );
      };

    // RESET
    const handleReset =
      () => {
        const resetFilters =
          {
            state:
              "",
            name: "",
            city: "",
            coverage:
              "",
            type: "",
            status:
              "",
          };

        setFilters(
          resetFilters,
        );

        dispatch(
          getSubcontractorLists(
            {},
          ),
        );
      };

    // FILTER CHANGE
    const handleFilterChange =
      (e) => {
        const {
          name,
          value,
        } = e.target;

        setFilters(
          (
            prev,
          ) => ({
            ...prev,
            [name]:
              value,
          }),
        );
      };

    // EDIT
    const handleEdit =
      (
        subcontractorId,
      ) => {
        navigate(
          `/edit-subcontractor/${subcontractorId}`,
        );
      };

    // FORMAT CURRENCY
    const formatCurrency =
      (
        value,
      ) => {
        if (
          typeof value ===
          "string"
        ) {
          value =
            value.replace(
              /[^0-9.]/g,
              "",
            );
        }

        return new Intl.NumberFormat(
          "en-US",
          {
            style:
              "currency",
            currency:
              "USD",
            minimumFractionDigits: 2,
          },
        ).format(
          value,
        );
      };

    // SORT
    const requestSort =
      (key) => {
        let direction =
          "ASC";

        if (
          sortConfig.key ===
            key &&
          sortConfig.direction ===
            "ASC"
        ) {
          direction =
            "DESC";
        }

        setSortConfig({
          key,
          direction,
        });

        const nonEmptyFilters =
          Object.fromEntries(
            Object.entries(
              filters,
            ).filter(
              ([
                _,
                value,
              ]) =>
                value.trim() !==
                "",
            ),
          );

        dispatch(
          getSubcontractorLists(
            {
              ...nonEmptyFilters,
              sort_by:
                key,
              order:
                direction,
            },
          ),
        );
      };

    // SORT SYMBOL
    const getSortSymbol =
      (key) => {
        if (
          sortConfig.key ===
          key
        ) {
          return sortConfig.direction ===
            "ASC"
            ? "▲"
            : "▼";
        }

        return "↕";
      };

    // FILTER STATUS
    const filteredSubcontractors =
      subcontractors?.filter(
        (
          sub,
        ) => {
          if (
            !filters.status
          )
            return true;

          return (
            sub.contract_status ===
            filters.status
          );
        },
      );

    // INPUT STYLE
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    return (
      <>
        <Header />

        <div className="flex">
          <AdminSideNavbar />

          {/* IMPORTANT:
              max-w-[1920px] + w-full used to reduce unnecessary scrolling on 3XL screens
          */}
          <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto overflow-x-hidden">
            <div className="w-full max-w-[1920px] mx-auto p-4 md:p-6 xl:p-8">
              {/* PAGE HEADER */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5 mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                    Subcontractor
                    Management
                  </h1>

                  <p className="text-gray-500 mt-1">
                    Manage
                    subcontractors,
                    pricing,
                    technicians
                    and coverage
                    details
                  </p>
                </div>

                {/* SUMMARY CARD */}
                <div className="bg-white rounded-[24px] shadow-lg border border-gray-100 px-6 py-4 min-w-[220px]">
                  <p className="text-sm text-gray-500 mb-1">
                    Total
                    Subcontractors
                  </p>

                  <h2 className="text-3xl font-bold text-[#1E1B4B]">
                    {filteredSubcontractors?.length ||
                      0}
                  </h2>
                </div>
              </div>

              {/* FILTER CARD */}
              {access.includes(
                user_type,
              ) && (
                <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                    <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Filters &
                      Search
                    </h2>
                  </div>

                  {/* FILTERS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
                    <input
                      type="text"
                      placeholder="Name"
                      name="name"
                      className={
                        inputClass
                      }
                      value={
                        filters.name
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                    <input
                      type="text"
                      placeholder="City"
                      name="city"
                      className={
                        inputClass
                      }
                      value={
                        filters.city
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                    <input
                      type="text"
                      placeholder="State"
                      name="state"
                      className={
                        inputClass
                      }
                      value={
                        filters.state
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                    <input
                      type="text"
                      placeholder="Coverage Area"
                      name="coverage"
                      className={
                        inputClass
                      }
                      value={
                        filters.coverage
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                    <input
                      type="text"
                      placeholder="Contractor Type"
                      name="type"
                      className={
                        inputClass
                      }
                      value={
                        filters.type
                      }
                      onChange={
                        handleFilterChange
                      }
                    />

                    <select
                      name="status"
                      className={
                        inputClass
                      }
                      value={
                        filters.status
                      }
                      onChange={
                        handleFilterChange
                      }
                    >
                      <option value="">
                        All
                        Status
                      </option>

                      <option value="In Review">
                        In
                        Review
                      </option>

                      <option value="In Progress">
                        In
                        Progress
                      </option>

                      <option value="Re-Opened">
                        Re-Opened
                      </option>

                      <option value="Active">
                        Active
                      </option>
                    </select>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap gap-3 mt-6">
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                      onClick={
                        handleSearch
                      }
                    >
                      <MdSearch size={20} />
                      Search
                    </button>

                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300"
                      onClick={
                        handleReset
                      }
                    >
                      <MdFilterList size={20} />
                      Clear
                    </button>

                    {user_type ===
                      "Admin" && (
                      <Link
                        to="/create-sub-contractor"
                        className="ml-auto"
                      >
                        <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                          <MdAdd size={20} />
                          Add New
                          Subcontractor
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* TABLE CARD */}
              <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
                {/* TOP BAR */}
                <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

                {/* HEADER */}
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-2xl font-bold text-[#1E1B4B]">
                    Subcontractor
                    List
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Responsive
                    optimized
                    table for
                    large desktop
                    screens
                  </p>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                  {/* IMPORTANT:
                      Wider min width to fit 3XL screens better
                  */}
                  <table className="w-full min-w-[1650px] table-auto">
                    <thead className="bg-indigo-50">
                      <tr>

                        <th
                          className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                          onClick={() =>
                            requestSort(
                              "subcontractor_name",
                            )
                          }
                        >
                          <div className="flex items-center gap-1">
                            <MdBusiness />
                            Company Name{" "}
                            {
                              getSortSymbol(
                                "subcontractor_name",
                              )
                            }
                          </div>
                        </th>
                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                           Contact Name
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          Email
                        </th>


                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          Address
                        </th>

                        <th
                          className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                          onClick={() =>
                            requestSort(
                              "city",
                            )
                          }
                        >
                          City{" "}
                          {
                            getSortSymbol(
                              "city",
                            )
                          }
                        </th>

                        <th
                          className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                          onClick={() =>
                            requestSort(
                              "state",
                            )
                          }
                        >
                          State{" "}
                          {
                            getSortSymbol(
                              "state",
                            )
                          }
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          Zipcode
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          Coverage
                        </th>

                        <th
                          className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 cursor-pointer whitespace-nowrap"
                          onClick={() =>
                            requestSort(
                              "hourly_rate",
                            )
                          }
                        >
                          <div className="flex items-center gap-1">
                            <MdAttachMoney />
                            Hourly
                            Rate{" "}
                            {
                              getSortSymbol(
                                "hourly_rate",
                              )
                            }
                          </div>
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          Trip
                          Charge
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MdGroups />
                            Technicians
                          </div>
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MdPerson />
                            Primary
                            Contact
                          </div>
                        </th>

                        <th className="px-4 py-4 text-left text-xs uppercase font-bold text-indigo-600 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <MdStar />
                            Rating
                          </div>
                        </th>

                        <th className="px-4 py-4 text-center text-xs uppercase font-bold text-indigo-600 whitespace-nowrap sticky right-0 bg-indigo-50 z-10">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan="14"
                            className="py-20 text-center"
                          >
                            <img
                              src={
                                Loader
                              }
                              alt="Loading..."
                              className="h-16 w-16 mx-auto"
                            />
                          </td>
                        </tr>
                      ) : subcontractors?.length ===
                        0 ? (
                        <tr>
                          <td
                            colSpan="14"
                            className="text-center py-20"
                          >
                            <div className="flex flex-col items-center">
                              <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
                                <MdBusiness className="text-4xl text-indigo-400" />
                              </div>

                              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                                No
                                Subcontractors
                                Found
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                Try
                                adjusting
                                your
                                filters
                                or add a
                                new
                                subcontractor.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredSubcontractors?.map(
                          (
                            subcontractor,
                          ) => (
                            <tr
                              key={
                                subcontractor.subcontractor_id
                              }
                              className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                            >
                              <td className="px-4 py-4 text-sm font-semibold text-[#1E1B4B] whitespace-nowrap">
                                {subcontractor.subcontractor_name ||
                                  "NA"}
                              </td>
                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                {subcontractor.b_firstname +
                                  " " +
                                  subcontractor.b_lastname ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                {subcontractor.b_email ||
                                  "NA"}
                              </td>
                              <td className="px-4 py-4 text-sm min-w-[220px]">
                                {subcontractor.street_address ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                {subcontractor.city ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                {subcontractor.state ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                {subcontractor.zipcode ||
                                  "NA"}
                              </td>

                            <td className="px-4 py-4 text-sm whitespace-wrap">
                              
                                {subcontractor.coverage_area || "NA"}
                              
                            </td>

                              <td className="px-4 py-4  text-sm whitespace-nowrap font-medium text-emerald-600">
                                {formatCurrency(
                                  subcontractor.hourly_rate,
                                ) ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap font-medium text-emerald-600">
                                {formatCurrency(
                                  subcontractor.trip_charge,
                                ) ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm text-center whitespace-nowrap">
                                {subcontractor.no_of_technicians ||
                                  "NA"}
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                {
                                  subcontractor.p_firstname
                                }{" "}
                                {
                                  subcontractor.p_lastname
                                }
                              </td>

                              <td className="px-4 py-4 text-sm whitespace-nowrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-medium">
                                  ⭐{" "}
                                  {subcontractor?.rating ||
                                    "N/A"}
                                </span>
                              </td>

                              {/* STICKY ACTION */}
                              <td className="px-4 py-4 sticky right-0 bg-white border-l border-gray-100">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                                    onClick={() =>
                                      handleEdit(
                                        subcontractor.subcontractor_id,
                                      )
                                    }
                                  >
                                    <BiSolidEditAlt size={18} />
                                  </button>

                                  <button
                                    className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all duration-300"
                                    onClick={() =>
                                      handleDelete(
                                        subcontractor.subcontractor_id,
                                      )
                                    }
                                  >
                                    <AiFillDelete size={18} />
                                  </button>
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
        </div>
      </>
    );
  };

export default SubContractorList;