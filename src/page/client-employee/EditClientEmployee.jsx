import React, { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  MdBusiness,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBadge,
  MdSecurity,
  MdEdit,
} from "react-icons/md";

import {
  updateClientEmployee,
  getEmployeeById,
} from "../../actions/clientEmployeeActions";

import { getClients } from "../../actions/clientActions";

import { getLocationByClient } from "../../actions/locationActions";

import MultiSelectDropdown from "./MultiSelectDropdown";

const EditEmployeePage = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const { employeeId } = useParams();

  const clients = useSelector(
    (state) => state.client.clients,
  );

  const locations = useSelector(
    (state) => state.location.locations,
  );

  const loadingClients = useSelector(
    (state) => state.client.loading,
  );

  const employee = useSelector(
    (state) => state.clientEmployee.employee,
  );

  const loadingEmployees = useSelector(
    (state) => state.clientEmployee.loading,
  );

  const user = useSelector(
    (state) => state.user.user,
  );

  const [formData, setFormData] = useState({
    client_id: "",
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number: "",
    employee_type: "",
    client_location_id: [],
    access_to_website: true,
  });

  useEffect(() => {
    dispatch(getEmployeeById(employeeId));

    dispatch(getClients());
  }, [dispatch, employeeId]);

  useEffect(() => {
    if (
      user?.client_type === "Admin" &&
      user?.client_id &&
      formData.client_id &&
      String(formData.client_id) !==
        String(user.client_id)
    ) {
      setFormData((prev) => ({
        ...prev,
        client_id: String(
          user.client_id,
        ),
        client_location_id: [],
      }));

      dispatch(
        getLocationByClient(
          user.client_id,
        ),
      );
    }
  }, [
    user,
    formData.client_id,
    dispatch,
  ]);

  useEffect(() => {
    if (employee) {
      const {
        client_id,
        first_name,
        last_name,
        email_id,
        contact_number,
        employee_type,
        access_to_website,
        locations,
      } = employee;

      const assignedLocationIds =
        locations?.map(
          (location) =>
            location.client_location_id,
        ) || [];

      setFormData({
        client_id,
        first_name:
          first_name || "",
        last_name:
          last_name || "",
        email_id:
          email_id || "",
        contact_number:
          contact_number || "",
        employee_type:
          employee_type || "",
        client_location_id:
          assignedLocationIds,
        access_to_website,
      });

      if (client_id) {
        dispatch(
          getLocationByClient(
            client_id,
          ),
        );
      }
    }
  }, [employee, dispatch]);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "client_id") {
      setFormData({
        ...formData,
        client_id: value,
        client_location_id: [],
      });

      dispatch(
        getLocationByClient(value),
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
    };

    if (
      typeof updatedFormData.client_location_id ===
      "string"
    ) {
      updatedFormData.client_location_id =
        updatedFormData.client_location_id.split(
          ",",
        );
    }

    if (
      formData.employee_type !==
      "Location Admin"
    ) {
      delete updatedFormData.client_location_id;
    }

    dispatch(
      updateClientEmployee(
        employeeId,
        updatedFormData,
        navigate,
        location.state,
      ),
    );
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

  const labelClass =
    "block text-sm font-semibold text-[#1E1B4B] mb-2";

  return (
    <>
      <Header />

      <div className="flex">
        <AdminSideNavbar />

        <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-8">
          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                Edit Employee
              </h1>

              <p className="text-gray-500 mt-1">
                Update employee details,
                permissions and access
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                form="employeeEditForm"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {loadingEmployees
                  ? "Updating..."
                  : "Update Employee"}
              </button>

              <Link
                to={"/client-employees"}
                state={location.state}
              >
                <button className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300">
                  Cancel
                </button>
              </Link>
            </div>
          </div>

          {/* FORM CARD */}
          <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
            {/* TOP GRADIENT */}
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <form
              id="employeeEditForm"
              onSubmit={handleSubmit}
              className="p-8"
            >
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <MdEdit size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1E1B4B]">
                    Employee Details
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Modify employee
                    information below
                  </p>
                </div>
              </div>

              {/* BASIC INFO */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* CLIENT */}
                  {[
                    "Admin",
                    "Subadmin",
                  ].includes(
                    user?.user_type,
                  ) && (
                    <div>
                      <label
                        htmlFor="client_id"
                        className={
                          labelClass
                        }
                      >
                        Client
                      </label>

                      <div className="relative">
                        <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <select
                          id="client_id"
                          name="client_id"
                          value={
                            formData.client_id
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12`}
                          disabled={
                            user?.client_type ===
                            "Admin"
                          }
                        >
                          <option value="">
                            Select Client
                          </option>

                          {loadingClients ? (
                            <option
                              value=""
                              disabled
                            >
                              Loading...
                            </option>
                          ) : (
                            (user?.client_type ===
                            "Admin"
                              ? clients?.data?.filter(
                                  (
                                    client,
                                  ) =>
                                    String(
                                      client.client_id,
                                    ) ===
                                    String(
                                      user.client_id,
                                    ),
                                )
                              : clients?.data
                            )?.map(
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
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* EMPLOYEE TYPE */}
                  <div>
                    <label
                      htmlFor="employee_type"
                      className={
                        labelClass
                      }
                    >
                      Employee Type
                    </label>

                    <div className="relative">
                      <MdBadge className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <select
                        id="employee_type"
                        name="employee_type"
                        value={
                          formData.employee_type
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} pl-12`}
                        required
                      >
                        <option value="">
                          Select Employee Type
                        </option>

                        <option value="Admin">
                          Admin
                        </option>

                        <option value="Location Admin">
                          Location Admin
                        </option>

                        <option value="User">
                          User
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* ACCESS */}
                  <div>
                    <label
                      className={
                        labelClass
                      }
                    >
                      Website Access
                    </label>

                    <div className="flex items-center gap-4 h-[52px] px-5 rounded-2xl border border-gray-200 bg-white">
                      <MdSecurity className="text-indigo-500 text-xl" />

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="access_to_website"
                          value="true"
                          checked={
                            formData.access_to_website ===
                            true
                          }
                          onChange={(
                            e,
                          ) =>
                            setFormData({
                              ...formData,
                              access_to_website:
                                e.target
                                  .value ===
                                "true",
                            })
                          }
                          className="accent-indigo-600"
                        />

                        <span className="text-sm font-medium">
                          Yes
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="access_to_website"
                          value="false"
                          checked={
                            formData.access_to_website ===
                            false
                          }
                          onChange={(
                            e,
                          ) =>
                            setFormData({
                              ...formData,
                              access_to_website:
                                e.target
                                  .value ===
                                "true",
                            })
                          }
                          className="accent-indigo-600"
                        />

                        <span className="text-sm font-medium">
                          No
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOCATION ACCESS */}
              {formData.employee_type ===
                "Location Admin" && (
                <div className="mb-10">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                    <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                      Location Access
                    </h3>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6">
                    <label
                      htmlFor="client_location_ids"
                      className={
                        labelClass
                      }
                    >
                      Client Locations
                    </label>

                    <MultiSelectDropdown
                      options={locations.map(
                        (
                          location,
                        ) => ({
                          value:
                            location.location_id,
                          label:
                            location.address_line_one,
                        }),
                      )}
                      selectedValues={
                        formData.client_location_id ||
                        []
                      }
                      onChange={(
                        selectedValues,
                      ) =>
                        setFormData({
                          ...formData,
                          client_location_id:
                            selectedValues,
                        })
                      }
                    />

                    {Array.isArray(
                      formData.client_location_id,
                    ) &&
                      formData
                        .client_location_id
                        .length > 0 && (
                        <div className="mt-4 text-sm text-gray-600">
                          <span className="font-semibold text-indigo-600">
                            Selected:
                          </span>{" "}
                          {formData.client_location_id
                            .map(
                              (
                                id,
                              ) =>
                                locations.find(
                                  (
                                    location,
                                  ) =>
                                    location.location_id ===
                                    id,
                                )
                                  ?.address_line_one,
                            )
                            .join(", ")}
                        </div>
                      )}
                  </div>
                </div>
              )}

              {/* EMPLOYEE DETAILS */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    Employee Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* FIRST NAME */}
                  <div>
                    <label
                      htmlFor="first_name"
                      className={
                        labelClass
                      }
                    >
                      First Name
                    </label>

                    <div className="relative">
                      <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={
                          formData.first_name
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {/* LAST NAME */}
                  <div>
                    <label
                      htmlFor="last_name"
                      className={
                        labelClass
                      }
                    >
                      Last Name
                    </label>

                    <div className="relative">
                      <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={
                          formData.last_name
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email_id"
                      className={
                        labelClass
                      }
                    >
                      Email Address
                    </label>

                    <div className="relative">
                      <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="email"
                        name="email_id"
                        id="email_id"
                        value={
                          formData.email_id
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label
                      htmlFor="contact_number"
                      className={
                        labelClass
                      }
                    >
                      Contact Number
                    </label>

                    <div className="relative">
                      <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="contact_number"
                        id="contact_number"
                        value={
                          formData.contact_number
                        }
                        onChange={
                          handleChange
                        }
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEmployeePage;