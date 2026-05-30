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
  addLocation,
} from "../../actions/locationActions";

import {
  getClientEmployeeByClientId,
} from "../../actions/clientEmployeeActions";

import {
  getClients,
} from "../../actions/clientActions";

import {
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  MdBusiness,
  MdPerson,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdSave,
  MdArrowBack,
  MdHomeWork,
} from "react-icons/md";

import Loader from "../../Images/ZZ5H.gif";

const AddLocation = () => {
  const dispatch =
    useDispatch();

  const navigate =
    useNavigate();

  const locationState =
    useLocation();

  const {
    clientId,
  } = useParams();

  // REDUX
  const clients =
    useSelector(
      (state) =>
        state.client.clients,
    );

  const loadingClients =
    useSelector(
      (state) =>
        state.client.loading,
    );

  const loadinglocations =
    useSelector(
      (state) =>
        state.location.loading,
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
    locations,
    setLocations,
  ] = useState({
    client_id:
      clientId
        ? clientId
        : "",

    contact_person_firstname:
      "",

    contact_person_lastname:
      "",

    contact_person_mail_id:
      "",

    address_line_one:
      "",

    address_line_two:
      "",

    address_line_three:
      "",

    city: "",

    state: "",

    zipcode:
      "",

    fax_number:
      "",

    phone_number:
      "",

    cell_number:
      "",

    active: true,
  });

  const [
    selectedClientEmployee,
    setSelectedClientEmployee,
  ] = useState(
    "",
  );

  // FETCH CLIENTS
  useEffect(() => {
    dispatch(
      getClients(),
    );
  }, [dispatch]);

  // FETCH EMPLOYEES
  useEffect(() => {
    if (
      locations.client_id
    ) {
      dispatch(
        getClientEmployeeByClientId(
          locations.client_id,
        ),
      );
    }
  }, [
    dispatch,
    locations.client_id,
  ]);

  // HANDLE CHANGE
  const handleChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setLocations({
        ...locations,
        [name]:
          value,
      });

      // CLIENT CHANGE
      if (
        name ===
        "client_id"
      ) {
        setLocations({
          ...locations,
          client_id:
            value,
        });

        setSelectedClientEmployee(
          "",
        );
      }

      // EMPLOYEE CHANGE
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
          setLocations({
            ...locations,

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

      delete locations?.selected_client_employee;

      dispatch(
        addLocation(
          locations,
        ),
      );

      // RESET
      setLocations({
        client_id:
          locations.client_id,

        contact_person_firstname:
          "",

        contact_person_lastname:
          "",

        contact_person_mail_id:
          "",

        address_line_one:
          "",

        address_line_two:
          "",

        address_line_three:
          "",

        city: "",

        state: "",

        zipcode:
          "",

        fax_number:
          "",

        phone_number:
          "",

        cell_number:
          "",

        active: true,
      });

      setSelectedClientEmployee(
        "",
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

        <div className="flex-1 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto p-4 md:p-8">
          {/* PAGE HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                Add Location
              </h1>

              <p className="text-gray-500 mt-1">
                Create and
                manage client
                location
                information
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                form="addLocationForm"
                disabled={
                  loadinglocations
                }
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
              >
                <MdSave size={20} />

                {loadinglocations
                  ? "Saving..."
                  : "Save Location"}
              </button>

              <Link
                to={"/locations"}
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

            {loadinglocations ? (
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
                id="addLocationForm"
                onSubmit={
                  handleSave
                }
                className="p-6 md:p-8"
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
                      Enter client
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
                          className={`${inputClass} pl-12`}
                          value={
                            locations.client_id
                          }
                          onChange={
                            handleChange
                          }
                          required
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

                    {/* EMPLOYEE */}
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
                      Information
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
                            locations.address_line_one
                          }
                          onChange={
                            handleChange
                          }
                          className={`${inputClass} pl-12`}
                          required
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
                          locations.address_line_two
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
                          locations.address_line_three
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
                          locations.city
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                        required
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
                          locations.state
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                        required
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
                          locations.zipcode
                        }
                        onChange={
                          handleChange
                        }
                        className={
                          inputClass
                        }
                        required
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
                        Fax Number
                      </label>

                      <input
                        type="text"
                        name="fax_number"
                        value={
                          locations.fax_number
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
                            locations.phone_number
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
                        Cell Number
                      </label>

                      <div className="relative">
                        <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                        <input
                          type="text"
                          name="cell_number"
                          value={
                            locations.cell_number
                          }
                          onChange={
                            handleChange
                          }
                          readOnly={
                            !!selectedClientEmployee
                          }
                          className={`${
                            !!selectedClientEmployee
                              ? readOnlyInputClass
                              : inputClass
                          } pl-12`}
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
                            locations.contact_person_firstname
                          }
                          readOnly={
                            !!selectedClientEmployee
                          }
                          className={`${
                            !!selectedClientEmployee
                              ? readOnlyInputClass
                              : inputClass
                          } pl-12`}
                          required
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
                            locations.contact_person_lastname
                          }
                          readOnly={
                            !!selectedClientEmployee
                          }
                          className={`${
                            !!selectedClientEmployee
                              ? readOnlyInputClass
                              : inputClass
                          } pl-12`}
                          required
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
                            locations.contact_person_mail_id
                          }
                          readOnly={
                            !!selectedClientEmployee
                          }
                          className={`${
                            !!selectedClientEmployee
                              ? readOnlyInputClass
                              : inputClass
                          } pl-12`}
                          required
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

export default AddLocation;