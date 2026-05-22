/** @format */

import React, {
  useEffect,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Swal from "sweetalert2";

import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  BiSolidEditAlt,
} from "react-icons/bi";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  MdSearch,
  MdRefresh,
  MdAdd,
  MdAssignment,
  MdContentCopy
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getWorkOrderLists,
  deleteWorkOrder,
} from "../../actions/workOrderActions";

import {
  getLocationByClient,
} from "../../actions/locationActions";

import {
  getClients,
} from "../../actions/clientActions";

import {
  fetchIDREmployees,
} from "../../actions/employeeActions";

import {
  toast,
} from "react-toastify";

const WorkOrder = () => {
  const dispatch =
    useDispatch();

  const location =
    useLocation();
   
   const navigate = useNavigate() 

  const [filters, setFilters] =
    useState({
      client_id: "",
      status: "",
      technician: "",
      project_manager: "",
      location_id: "",
      is_billed: "",
    });

  const [
    sortConfig,
    setSortConfig,
  ] = useState({
    key: "",
    direction:
      "asc",
  });

  const {
    user_type,
    client_type,
    locations,
  } =
    useSelector(
      (
        state,
      ) =>
        state.user.user,
    );

  const {
    access,
    clientAccess,
    technicianAccess,
  } =
    useSelector(
      (
        state,
      ) =>
        state.user,
    );

  const {
    workOrders,
    loading,
  } =
    useSelector(
      (
        state,
      ) =>
        state.workOrder,
    );

  const {
    clients,
  } =
    useSelector(
      (
        state,
      ) =>
        state.client,
    );

  const {
    idrEmployees,
  } =
    useSelector(
      (
        state,
      ) =>
        state.employee,
    );

  const clientLocations =
    useSelector(
      (
        state,
      ) =>
        state.location
          .locations,
    );

  useEffect(() => {
    const appliedFilters =
      location.state
        ?.filters || {};

    setFilters(
      appliedFilters,
    );

    dispatch(
      getWorkOrderLists(
        appliedFilters,
      ),
    );

    dispatch(
      getClients(),
    );

    dispatch(
      fetchIDREmployees(),
    );
  }, [
    dispatch,
    location,
  ]);

  useEffect(() => {
    if (
      filters?.client_id
    ) {
      dispatch(
        getLocationByClient(
          filters.client_id,
        ),
      );
    }
  }, [
    dispatch,
    filters?.client_id,
  ]);

  const handleFilterChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setFilters({
        ...filters,
        [name]:
          value,
      });
    };

  const handleDelete =
    (
      orderId,
    ) => {
      Swal.fire({
        title:
          "Are you sure?",
        text: "Do you really want to delete this work order?",
        icon:
          "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, delete it!",
      }).then(
        (
          result,
        ) => {
          if (
            result.isConfirmed
          ) {
            dispatch(
              deleteWorkOrder(
                orderId,
              ),
            )
              .then(
                () => {
                  dispatch(
                    getWorkOrderLists(
                      filters,
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
                    "Failed to delete work order",
                  );
                },
              );
          }
        },
      );
    };

  const handleSearch =
    () => {
      dispatch(
        getWorkOrderLists(
          filters,
        ),
      );
    };

  const handleReset =
    () => {
      const clearedFilters =
        {
          status:
            "",
          client_id:
            "",
          location_id:
            "",
          technician:
            "",
          project_manager:
            "",
          is_billed:
            "",
        };

      setFilters(
        clearedFilters,
      );

      dispatch(
        getWorkOrderLists(
          clearedFilters,
        ),
      );
    };

  const handleSort =
    (key) => {
      let direction =
        "asc";

      if (
        sortConfig.key ===
          key &&
        sortConfig.direction ===
          "asc"
      ) {
        direction =
          "desc";
      }

      setSortConfig({
        key,
        direction,
      });
    };

  const sortedWorkOrders =
    React.useMemo(
      () => {
        if (
          !workOrders
        )
          return [];

        const sorted =
          [
            ...(workOrders?.workOrder ||
              []),
          ];

        if (
          sortConfig.key
        ) {
          sorted.sort(
            (
              a,
              b,
            ) => {
              let aValue =
                a[
                  sortConfig.key
                ];

              let bValue =
                b[
                  sortConfig.key
                ];

              if (
                sortConfig.key ===
                "client_name"
              ) {
                aValue =
                  a.client_name ||
                  "";

                bValue =
                  b.client_name ||
                  "";
              }

              if (
                sortConfig.key ===
                "service_date"
              ) {
                aValue =
                  new Date(
                    aValue,
                  );

                bValue =
                  new Date(
                    bValue,
                  );
              }

              if (
                aValue <
                bValue
              )
                return sortConfig.direction ===
                  "asc"
                  ? -1
                  : 1;

              if (
                aValue >
                bValue
              )
                return sortConfig.direction ===
                  "asc"
                  ? 1
                  : -1;

              return 0;
            },
          );
        }

        return sorted;
      },
      [
        workOrders,
        sortConfig,
      ],
    );

  const filterInputClass =
    `
      w-full
      h-11
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-4
      text-sm
      text-gray-700
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      transition-all
    `;

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div className="flex-1 p-4 md:p-6 overflow-x-hidden">

          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

            <div className="flex items-center gap-4">
              
              <div className="w-14 h-14 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
                <MdAssignment className="text-3xl" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#1E1B4B]">
                  Work Orders
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage and track all work orders
                </p>
              </div>
            </div>

            {access.includes(
              user_type,
            ) && (
              <Link
                to="/add-work-order"
                state={{
                  filters,
                }}
              >
                <button
                  className="
                    flex
                    items-center
                    gap-2
                    px-6
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-pink-500
                    text-white
                    font-semibold
                    shadow-md
                    hover:shadow-lg
                    hover:scale-[1.02]
                    transition-all
                  "
                >
                  <MdAdd className="text-xl" />
                  New Work Order
                </button>
              </Link>
            )}
          </div>

          {/* FILTER CARD */}
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden mb-6">

            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-5 md:p-7">

              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Filters
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Search and filter work orders
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                {/* STATUS */}
                <div>
                  <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                    Ticket Status
                  </label>

                  <select
                    name="status"
                    value={
                      filters.status
                    }
                    className={
                      filterInputClass
                    }
                    onChange={
                      handleFilterChange
                    }
                  >
                    <option value="">
                      All
                    </option>

                    <option value="Open">
                      Open
                    </option>

                    <option value="Design">
                      Design
                    </option>

                    <option value="In Progress">
                      In
                      Progress
                    </option>

                    <option value="Reviewing">
                      Reviewing
                    </option>

                    <option value="Closed">
                      Closed
                    </option>
                  </select>
                </div>

                {/* CLIENT */}
                {technicianAccess.includes(
                  user_type,
                ) && (
                  <div>
                    <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                      Client Name
                    </label>

                    <select
                      name="client_id"
                      value={
                        filters.client_id
                      }
                      className={
                        filterInputClass
                      }
                      onChange={
                        handleFilterChange
                      }
                    >
                      <option value="">
                        All
                      </option>

                      {[
                        ...(clients?.data ||
                          []),
                      ]
                        .sort(
                          (
                            a,
                            b,
                          ) =>
                            (
                              a.company_name ||
                              ""
                            ).localeCompare(
                              b.company_name ||
                                "",
                            ),
                        )
                        .map(
                          (
                            client,
                          ) => (
                            <option
                              key={
                                client.client_id
                              }
                              value={
                                client.client_id
                              }
                            >
                              {
                                client.company_name
                              }
                            </option>
                          ),
                        )}
                    </select>
                  </div>
                )}

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <select
                    name="location_id"
                    value={
                      filters.location_id
                    }
                    className={
                      filterInputClass
                    }
                    onChange={
                      handleFilterChange
                    }
                  >
                    <option value="">
                      All
                    </option>

                    {[
                      ...(clientLocations ||
                        []),
                    ].map(
                      (
                        location,
                      ) => (
                        <option
                          key={
                            location.location_id
                          }
                          value={
                            location.location_id
                          }
                        >
                          {
                            location.address_line_one
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>

                {/* TECH */}
                {access.includes(
                  user_type,
                ) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                        Technician
                      </label>

                      <select
                        name="technician"
                        value={
                          filters.technician
                        }
                        className={
                          filterInputClass
                        }
                        onChange={
                          handleFilterChange
                        }
                      >
                        <option value="">
                          All
                        </option>

                        {idrEmployees.map(
                          (
                            emp,
                          ) => {
                            const fullName = `${emp.first_name} ${emp.last_name}`;

                            return (
                              <option
                                key={
                                  emp.idr_emp_id
                                }
                                value={
                                  fullName
                                }
                              >
                                {
                                  fullName
                                }
                              </option>
                            );
                          },
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                        Project Manager
                      </label>

                      <select
                        name="project_manager"
                        value={
                          filters.project_manager
                        }
                        className={
                          filterInputClass
                        }
                        onChange={
                          handleFilterChange
                        }
                      >
                        <option value="">
                          All
                        </option>

                        {idrEmployees.map(
                          (
                            emp,
                          ) => {
                            const fullName = `${emp.first_name} ${emp.last_name}`;

                            return (
                              <option
                                key={
                                  emp.idr_emp_id
                                }
                                value={
                                  fullName
                                }
                              >
                                {
                                  fullName
                                }
                              </option>
                            );
                          },
                        )}
                      </select>
                    </div>

                    {/* BILLED */}
                    <div>
                      <label className="block text-sm font-medium text-[#1E1B4B] mb-2">
                        Billed Status
                      </label>

                      <select
                        name="is_billed"
                        value={
                          filters.is_billed
                        }
                        className={
                          filterInputClass
                        }
                        onChange={
                          handleFilterChange
                        }
                      >
                        <option value="">
                          All
                        </option>

                        <option value="Unbilled">
                          Unbilled
                        </option>

                        <option value="Final Billed">
                          Final
                          Billed
                        </option>

                        <option value="Retainage Billed">
                          Retainage
                          Billed
                        </option>
                      </select>
                    </div>
                  </>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">

                <button
                  onClick={
                    handleSearch
                  }
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
                    font-semibold
                    shadow-md
                    hover:shadow-lg
                    transition-all
                  "
                >
                  <MdSearch className="text-xl" />
                  Search
                </button>

                <button
                  onClick={
                    handleReset
                  }
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-6
                    py-3
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    font-medium
                    hover:bg-gray-50
                    transition-all
                  "
                >
                  <MdRefresh className="text-xl" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-[30px] border border-gray-100 shadow-sm overflow-hidden">

            <div className="overflow-x-auto">

              {!loading ? (
                <table className="min-w-full">

                  <thead className="bg-gradient-to-r from-indigo-50 to-pink-50">

                    <tr>

                      {[
                        [
                          "ticket_number",
                          "Ticket Number",
                        ],
                        [
                          "client_name",
                          "Client",
                        ],
                        [
                          "service_date",
                          "Service Date",
                        ],
                      ].map(
                        (
                          col,
                        ) => (
                          <th
                            key={
                              col[0]
                            }
                            onClick={() =>
                              handleSort(
                                col[0],
                              )
                            }
                            className="
                              px-5
                              py-4
                              text-left
                              text-sm
                              font-semibold
                              text-[#1E1B4B]
                              cursor-pointer
                              whitespace-nowrap
                            "
                          >
                            {
                              col[1]
                            }{" "}
                            {sortConfig.key ===
                            col[0]
                              ? sortConfig.direction ===
                                "asc"
                                ? "▲"
                                : "▼"
                              : "↕"}
                          </th>
                        ),
                      )}

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B] whitespace-nowrap">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B] whitespace-nowrap">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B] whitespace-nowrap">
                        Billed
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B] whitespace-nowrap">
                        Service Request
                      </th>

                      <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B] whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {sortedWorkOrders
                      ?.length >
                    0 ? (
                      sortedWorkOrders.map(
                        (
                          order,
                        ) => (
                          <tr
                            key={
                              order.work_order_id
                            }
                            className="border-t border-gray-100 hover:bg-gray-50 transition-all"
                          >
                            <td className="px-5 py-4 text-sm font-medium text-[#1E1B4B] whitespace-nowrap">
                              {order.ticket_number ||
                                "NA"}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                              {
                                order.client_name
                              }
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                              {
                                order.service_date
                              }
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                              <div>
                                <p className="font-medium">
                                  {
                                    order.contact_person
                                  }
                                </p>

                                <p className="text-xs text-gray-500 mt-1">
                                  {
                                    order.contact_phone_number
                                  }
                                </p>
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span className="inline-flex px-3 py-1 rounded-xl text-xs font-semibold bg-indigo-100 text-indigo-700 whitespace-nowrap">
                                {
                                  order.status
                                }
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                              {order.is_billed ||
                                "NA"}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700 max-w-[320px]">
                              <div className="line-clamp-2">
                                {
                                  order.issue
                                }
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-3">

                                <Link
                                  to={`/edit-work-order/${order?.work_order_id}`}
                                  state={{
                                    filters,
                                  }}
                                >
                                  <button className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-all">
                                    <BiSolidEditAlt className="text-lg" />
                                  </button>
                                </Link>

                                {user_type ===
                                  "Admin" && (
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        order.work_order_id,
                                      )
                                    }
                                    className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all"
                                  >
                                    <AiFillDelete className="text-lg" />
                                  </button>
                                )}
                                <button
  onClick={() =>
    navigate(
      `/duplicate-work-order/${order.work_order_id}`,
      {
        state: {
          duplicate: true,
        },
      }
    )
  }
  className="
    w-10
    h-10
    rounded-2xl
    bg-blue-50
    text-blue-600
    flex
    items-center
    justify-center
    hover:bg-blue-100
    transition-all
  "
>
  <MdContentCopy className="text-lg" />
</button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="py-16 text-center"
                        >
                          <div className="flex flex-col items-center">
                            <MdAssignment className="text-6xl text-gray-300 mb-4" />

                            <h3 className="text-lg font-semibold text-[#1E1B4B]">
                              No Work
                              Orders
                              Found
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                              Try
                              changing
                              filters
                              or
                              create
                              a new
                              work
                              order.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="flex items-center justify-center py-24">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkOrder;