import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  addClient,
  getIndustries,
} from "../../actions/clientActions";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  MdBusiness,
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWork,
} from "react-icons/md";

const AddNewClient = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const [formData, setFormData] = useState({
    industry_id: "",
    staff: "",
    company_name: "",
    contact_person_firstname: "",
    contact_person_lastname: "",
    contact_email: "",
    address_line_one: "",
    address_line_two: "",
    address_line_three: "",
    city: "",
    state: "",
    zipcode: "",
    fax_number: "",
    phone_number: "",
    cell_phone: "",
  });

  useEffect(() => {
    dispatch(getIndustries());
  }, [dispatch]);

  const { industries } = useSelector(
    (state) => state.client.industries,
  );

  const { loading } = useSelector(
    (state) => state.client,
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      addClient(
        formData,
        navigate,
        location.search,
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
                Add New Client
              </h1>

              <p className="text-gray-500 mt-1">
                Create and manage new client
                information
              </p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                type="submit"
                form="clientForm"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                {loading ? "Saving..." : "Save Client"}
              </button>

              <Link
                to={`/clients${location.search}`}
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
              id="clientForm"
              onSubmit={handleSubmit}
              className="p-8"
            >
              {/* SECTION TITLE */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <MdBusiness size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1E1B4B]">
                    Client Details
                  </h2>

                  <p className="text-gray-500 text-sm">
                    Enter client information below
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* INDUSTRY */}
                  <div>
                    <label className={labelClass}>
                      Industry Code
                    </label>

                    <select
                      id="industry_id"
                      name="industry_id"
                      value={formData.industry_id}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    >
                      <option value="">
                        Select Industry
                      </option>

                      {industries
                        ? [...industries]
                            .sort((a, b) =>
                              a.industry_name.localeCompare(
                                b.industry_name,
                              ),
                            )
                            .map((industry) => (
                              <option
                                key={
                                  industry.industry_id
                                }
                                value={
                                  industry.industry_id
                                }
                              >
                                {
                                  industry.industry_name
                                }
                              </option>
                            ))
                        : null}
                    </select>
                  </div>

                  {/* STAFF */}
                  <div>
                    <label className={labelClass}>
                      Staff
                    </label>

                    <div className="relative">
                      <MdWork className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="staff"
                        value={formData.staff}
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {/* COMPANY */}
                  <div>
                    <label className={labelClass}>
                      Company Name
                    </label>

                    <div className="relative">
                      <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="company_name"
                        value={
                          formData.company_name
                        }
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CONTACT INFO */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    Contact Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* FIRST NAME */}
                  <div>
                    <label className={labelClass}>
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
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {/* LAST NAME */}
                  <div>
                    <label className={labelClass}>
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
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className={labelClass}>
                      Email
                    </label>

                    <div className="relative">
                      <MdEmail className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="email"
                        name="contact_email"
                        value={
                          formData.contact_email
                        }
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    Address Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>
                      Job Location
                    </label>

                    <div className="relative">
                      <MdLocationOn className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="address_line_one"
                        value={
                          formData.address_line_one
                        }
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Address Line 1
                    </label>

                    <input
                      type="text"
                      name="address_line_two"
                      value={
                        formData.address_line_two
                      }
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Address Line 2
                    </label>

                    <input
                      type="text"
                      name="address_line_three"
                      value={
                        formData.address_line_three
                      }
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      State
                    </label>

                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Zipcode
                    </label>

                    <input
                      type="text"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* PHONE DETAILS */}
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

                  <h3 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                    Phone Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={labelClass}>
                      Fax Number
                    </label>

                    <input
                      type="text"
                      name="fax_number"
                      value={formData.fax_number}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phone Number
                    </label>

                    <div className="relative">
                      <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="phone_number"
                        value={
                          formData.phone_number
                        }
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      Cell Number
                    </label>

                    <div className="relative">
                      <MdPhone className="absolute top-4 left-4 text-indigo-400 text-xl" />

                      <input
                        type="text"
                        name="cell_phone"
                        value={
                          formData.cell_phone
                        }
                        onChange={handleChange}
                        className={`${inputClass} pl-12`}
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

export default AddNewClient;