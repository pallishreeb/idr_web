/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getClientEmployeeByClientId,
} from "../../actions/clientEmployeeActions";

import {
  updateLocation,
  getLocationById,
} from "../../actions/locationActions";

import {
  Link,
  useParams,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  MdBusiness,
  MdLocationOn,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSave,
  MdArrowBack,
  MdHomeWork,
} from "react-icons/md";

import Loader from "../../Images/ZZ5H.gif";

const EditLocationPage =
  () => {
    const dispatch =
      useDispatch();

    const navigate =
      useNavigate();

    const locationState =
      useLocation();

    const {
      locationId,
    } = useParams();

    // REDUX
    const location =
      useSelector(
        (state) =>
          state.location
            .location,
      );

    const clients =
      useSelector(
        (state) =>
          state.client
            .clients,
      );

    const loadingClients =
      useSelector(
        (state) =>
          state.client
            .loading,
      );

    const loadingLocations =
      useSelector(
        (state) =>
          state.location
            .loading,
      );

    const clientEmployees =
      useSelector(
        (state) =>
          state
            .clientEmployee
            .clientEmployees,
      );

    const loadingClientEmployees =
      useSelector(
        (state) =>
          state
            .clientEmployee
            .loading,
      );

    // FORM STATE
    const [
      formData,
      setFormData,
    ] = useState({
      client_id: "",
      address_line_one:
        "",
      address_line_two:
        "",
      address_line_three:
        "",
      city: "",
      state: "",
      zipcode: "",
      fax_number:
        "",
      phone_number:
        "",
      cell_number:
        "",
      contact_person_firstname:
        "",
      contact_person_lastname:
        "",
      contact_person_mail_id:
        "",
    });

    const [
      selectedClientEmployee,
      setSelectedClientEmployee,
    ] = useState(
      "",
    );

    // FETCH LOCATION
    useEffect(() => {
      dispatch(
        getLocationById(
          locationId,
        ),
      );
    }, [
      dispatch,
      locationId,
    ]);

    // SET LOCATION DATA
    useEffect(() => {
      if (
        location
      ) {
        const {
          client_id,
          address_line_one,
          address_line_two,
          address_line_three,
          city,
          state,
          zipcode,
          fax_number,
          phone_number,
          contact_person_firstname,
          contact_person_lastname,
          contact_person_mail_id,
          cell_number,
        } = location;

        setFormData({
          client_id,
          address_line_one,
          address_line_two,
          address_line_three,
          city,
          state,
          zipcode,
          fax_number,
          phone_number,
          cell_number,
          contact_person_firstname,
          contact_person_lastname,
          contact_person_mail_id,
        });

        const selectedEmployee =
          clientEmployees.find(
            (
              emp,
            ) => (
              emp.first_name ===
                contact_person_firstname &&
              emp.last_name ===
                contact_person_lastname &&
              emp.email_id ===
                contact_person_mail_id &&
              emp.contact_number ===
                cell_number
            ),
          );

        if (
          selectedEmployee
        ) {
          setSelectedClientEmployee(
            selectedEmployee.client_emp_id,
          );
        }
      }
    }, [
      location,
      clientEmployees,
    ]);

    // FETCH EMPLOYEES
    useEffect(() => {
      if (
        formData.client_id
      ) {
        dispatch(
          getClientEmployeeByClientId(
            formData.client_id,
          ),
        );
      }
    }, [
      dispatch,
      formData.client_id,
    ]);

    // HANDLE CHANGE
    const handleChange =
      (e) => {
        const {
          name,
          value,
        } = e.target;

        setFormData({
          ...formData,
          [name]:
            value,
        });

        if (
          name ===
          "client_id"
        ) {
          setSelectedClientEmployee(
            "",
          );
        }

        if (
          name ===
          "selected_client_employee"
        ) {
          setSelectedClientEmployee(
            value,
          );

          const selectedEmployee =
            clientEmployees.find(
              (
                emp,
              ) =>
                emp.client_emp_id ===
                value,
            );

          if (
            selectedEmployee
          ) {
            setFormData({
              ...formData,
              contact_person_firstname:
                selectedEmployee.first_name,

              contact_person_lastname:
                selectedEmployee.last_name,

              contact_person_mail_id:
                selectedEmployee.email_id,

              cell_number:
                selectedEmployee.contact_number,
            });
          }
        }
      };

    // SAVE
    const handleSave =
      (e) => {
        e.preventDefault();

        delete formData.location_id;
        delete formData.is_deleted;
        delete formData.created_by;
        delete formData.updated_by;
        delete formData.deleted_by;
        delete formData.created_at;

        dispatch(
          updateLocation(
            locationId,
            formData,
            navigate,
            locationState.state,
          ),
        );
      };

    // COMMON CLASSES
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    const readOnlyInputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed";

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
                  Edit
                  Location
                </h1>

                <p className="text-gray-500 mt-1">
                  Update and
                  manage
                  client
                  location
                  details
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  form="editLocationForm"
                  disabled={
                    loadingLocations
                  }
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
                >
                  <MdSave size={20} />

                  {loadingLocations
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <Link
                  to="/locations"
                  state={
                    locationState.state
                  }
                >
                  <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300">
                    <MdArrowBack size={20} />
                    Cancel
                  </button>
                </Link>
              </div>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
              {/* TOP BAR */}
              <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              {loadingLocations ? (
                <div className="flex justify-center items-center py-24">
                  <img
                    src={
                      Loader
                    }
                    alt="Loading..."
                    className="h-20 w-20"
                  />
                </div>
              ) : (
                <form
                  id="editLocationForm"
                  onSubmit={
                    handleSave
                  }
                  className="p-8"
                >
                  {/* TITLE */}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] flex items-center justify-center text-white shadow-lg">
                      <MdHomeWork size={24} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-[#1E1B4B]">
                        Location
                        Details
                      </h2>

                      <p className="text-gray-500 text-sm">
                        Update
                        location and
                        contact
                        information
                      </p>
                    </div>
                  </div>

                  {/* CLIENT INFO */}
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Client &
                        Employee
                        Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* CLIENT */}
                      <div>
                        <label
                          htmlFor="client_id"
                          className={
                            labelClass
                          }
                        >
                          Select
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
                          >
                            <option value="">
                              Select a
                              client
                            </option>

                            {loadingClients ? (
                              <option disabled>
                                Loading...
                              </option>
                            ) : (
                              clients?.data?.map(
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

                      {/* CLIENT EMPLOYEE */}
                      <div>
                        <label
                          htmlFor="selected_client_employee"
                          className={
                            labelClass
                          }
                        >
                          Select
                          Client
                          Employee
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <select
                            id="selected_client_employee"
                            name="selected_client_employee"
                            className={`${inputClass} pl-12`}
                            value={
                              selectedClientEmployee
                            }
                            onChange={
                              handleChange
                            }
                          >
                            <option value="">
                              Select a
                              client
                              employee
                            </option>

                            {loadingClientEmployees ? (
                              <option disabled>
                                Loading...
                              </option>
                            ) : (
                              clientEmployees?.map(
                                (
                                  employee,
                                ) => (
                                  <option
                                    key={
                                      employee.client_emp_id
                                    }
                                    value={
                                      employee.client_emp_id
                                    }
                                  >
                                    {
                                      employee.first_name
                                    }{" "}
                                    {
                                      employee.last_name
                                    }
                                  </option>
                                ),
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LOCATION DETAILS */}
                  <div className="mb-10">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Location
                        Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* LOCATION NAME */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Location
                          Name
                        </label>

                        <div className="relative">
                          <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="address_line_one"
                            value={
                              formData.address_line_one
                            }
                            onChange={
                              handleChange
                            }
                            className={`${inputClass} pl-12`}
                          />
                        </div>
                      </div>

                      {/* ADDRESS 1 */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Address
                          Line 1
                        </label>

                        <input
                          type="text"
                          name="address_line_two"
                          value={
                            formData.address_line_two
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />
                      </div>

                      {/* ADDRESS 2 */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Address
                          Line 2
                        </label>

                        <input
                          type="text"
                          name="address_line_three"
                          value={
                            formData.address_line_three
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />
                      </div>

                      {/* CITY */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          City
                        </label>

                        <input
                          type="text"
                          name="city"
                          value={
                            formData.city
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />
                      </div>

                      {/* STATE */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          State
                        </label>

                        <input
                          type="text"
                          name="state"
                          value={
                            formData.state
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />
                      </div>

                      {/* ZIPCODE */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Zipcode
                        </label>

                        <input
                          type="text"
                          name="zipcode"
                          value={
                            formData.zipcode
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* CONTACT DETAILS */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

                      <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                        Contact
                        Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {/* FAX */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Fax
                          Number
                        </label>

                        <input
                          type="text"
                          name="fax_number"
                          value={
                            formData.fax_number
                          }
                          onChange={
                            handleChange
                          }
                          className={
                            inputClass
                          }
                        />
                      </div>

                      {/* PHONE */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Phone
                          Number
                        </label>

                        <div className="relative">
                          <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="phone_number"
                            value={
                              formData.phone_number
                            }
                            onChange={
                              handleChange
                            }
                            className={`${inputClass} pl-12`}
                          />
                        </div>
                      </div>

                      {/* CELL */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Cell
                          Number
                        </label>

                        <div className="relative">
                          <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="cell_number"
                            value={
                              formData.cell_number
                            }
                            readOnly
                            className={`${readOnlyInputClass} pl-12`}
                          />
                        </div>
                      </div>

                      {/* FIRST NAME */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Contact
                          First Name
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="contact_person_firstname"
                            value={
                              formData.contact_person_firstname
                            }
                            readOnly
                            className={`${readOnlyInputClass} pl-12`}
                          />
                        </div>
                      </div>

                      {/* LAST NAME */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Contact
                          Last Name
                        </label>

                        <div className="relative">
                          <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="contact_person_lastname"
                            value={
                              formData.contact_person_lastname
                            }
                            readOnly
                            className={`${readOnlyInputClass} pl-12`}
                          />
                        </div>
                      </div>

                      {/* EMAIL */}
                      <div>
                        <label
                          className={
                            labelClass
                          }
                        >
                          Contact
                          Email ID
                        </label>

                        <div className="relative">
                          <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />

                          <input
                            type="text"
                            name="contact_person_mail_id"
                            value={
                              formData.contact_person_mail_id
                            }
                            readOnly
                            className={`${readOnlyInputClass} pl-12`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

export default EditLocationPage;