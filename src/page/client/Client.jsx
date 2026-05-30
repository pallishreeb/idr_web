import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import Swal from "sweetalert2";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { BiSolidEditAlt } from "react-icons/bi";

import { AiFillDelete } from "react-icons/ai";

import { MdBusiness, MdSearch, MdFilterList, MdAdd } from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getClients,
  deleteClient,
  getIndustries,
} from "../../actions/clientActions";

const Client = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { clients, loading } = useSelector((state) => state.client);

  const { industries } = useSelector((state) => state.client.industries);

  const { user_type } = useSelector((state) => state.user.user);

  const [searchParams, setSearchParams] = useSearchParams();

  const [clientName, setClientName] = useState(
    searchParams.get("clientName") || "",
  );

  const [industryId, setIndustryId] = useState(
    searchParams.get("industryId") || "",
  );

  useEffect(() => {
    dispatch(
      getClients({
        clientName,
        industryId,
      }),
    );
  }, [dispatch, clientName, industryId]);

  useEffect(() => {
    dispatch(getIndustries());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (clientName) params.set("clientName", clientName);

    if (industryId) params.set("industryId", industryId);

    setSearchParams(params);
  }, [clientName, industryId, setSearchParams]);

  const handleEdit = (clientId) => {
    navigate(`/update-client/${clientId}?${searchParams.toString()}`);
  };

  const handleDeleteClient = (clientId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this client?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#6366F1",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteClient(clientId)).then(() => {
          dispatch(
            getClients({
              clientName,
              industryId,
            }),
          );
        });
      }
    });
  };

  const handleSearch = () => {
    dispatch(
      getClients({
        clientName,
        industryId,
      }),
    );
  };

  const clearSearch = () => {
    setClientName("");

    setIndustryId("");

    setSearchParams({});
  };

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
                Client Management
              </h1>

              <p className="text-gray-500 mt-1">
                Manage all client information and records
              </p>
            </div>

            <Link to={`/add-client?${searchParams.toString()}`}>
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <MdAdd size={22} />
                Add New Client
              </button>
            </Link>
          </div>

          {/* SEARCH CARD */}
          <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]" />

              <h2 className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
                Search & Filters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* SEARCH INPUT */}
              <div className="relative">
                <MdSearch className="absolute top-4 left-4 text-indigo-400 text-xl" />

                <input
                  type="text"
                  placeholder="Search Client Name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
                />
              </div>

              {/* INDUSTRY */}
              <div className="relative">
                <MdFilterList className="absolute top-4 left-4 text-indigo-400 text-xl z-10" />

                <select
                  value={industryId}
                  onChange={(e) => setIndustryId(e.target.value)}
                  className="w-full appearance-none pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300 bg-white"
                >
                  <option value="">Select Industry</option>

                  {industries
                    ? [...industries]
                        .sort((a, b) =>
                          a.industry_name.localeCompare(b.industry_name),
                        )
                        .map((industry) => (
                          <option
                            key={industry.industry_id}
                            value={industry.industry_id}
                          >
                            {industry.industry_name}
                          </option>
                        ))
                    : null}
                </select>
              </div>

              {/* SEARCH BUTTON */}
              <button
                onClick={handleSearch}
                className="rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Search
              </button>

              {/* CLEAR BUTTON */}
              <button
                onClick={clearSearch}
                className="rounded-2xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Clear Search
              </button>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
            {/* TOP GRADIENT */}
            <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            {/* TABLE HEADER */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#1E1B4B]
via-[#312E81]
to-[#4338CA] flex items-center justify-center text-white shadow-lg">
                  <MdBusiness size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#1E1B4B]">Clients</h2>

                  <p className="text-sm text-gray-500">
                    Total Clients: {clients?.data?.length}
                  </p>
                </div>
              </div>
            </div>

            {/* TABLE */}
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading clients...
              </div>
            ) : (
              <div className="overflow-x-auto xl:overflow-x-hidden">
                <table className="w-full table-auto">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Company Name
                      </th>

                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Industry
                      </th>

                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Staff ID
                      </th>

                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Phone
                      </th>

                      <th className="px-4 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Contact Person
                      </th>

                      <th className="w-[120px] px-4 py-4 text-center text-xs uppercase tracking-wider font-bold text-indigo-600">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {clients?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-12">
                          <img
                            src="not-found.png"
                            alt="Data Not Found"
                            className="mx-auto w-48 h-48 opacity-70"
                          />

                          <p className="text-gray-500 mt-4">No Clients Found</p>
                        </td>
                      </tr>
                    ) : (
                      clients?.data?.map((client) => (
                        <tr
                          key={client?.client_id}
                          className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-100"
                        >
                          {/* COMPANY NAME */}
                          <td className="px-4 py-4 font-semibold text-[#1E1B4B] max-w-[220px] truncate">
                            {client?.company_name}
                          </td>

                          {/* INDUSTRY */}
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                              {client?.industries?.industry_name}
                            </span>
                          </td>

                          {/* STAFF */}
                          <td className="px-4 py-4 text-gray-600">
                            {client?.staff}
                          </td>

                          {/* PHONE */}
                          <td className="px-4 py-4 text-gray-600">
                            {client?.phone_number}
                          </td>

                          {/* CONTACT PERSON */}
                          <td className="px-4 py-4 text-gray-600 max-w-[180px] truncate">
                            {client?.contact_person_firstname}{" "}
                            {client?.contact_person_lastname}
                          </td>

                          {/* ACTIONS */}
                          <td className="px-4 py-4 w-[120px]">
                            <div className="flex items-center justify-center gap-2">
                              {/* EDIT */}
                              <button
                                onClick={() => handleEdit(client?.client_id)}
                                className="w-10 h-10 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 flex items-center justify-center transition-all duration-300"
                              >
                                <BiSolidEditAlt size={20} />
                              </button>

                              {/* DELETE */}
                              {user_type === "Admin" && (
                                <button
                                  onClick={() =>
                                    handleDeleteClient(client?.client_id)
                                  }
                                  className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all duration-300"
                                >
                                  <AiFillDelete size={20} />
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Client;
