import React, { useState, useEffect } from "react";

import circle from "../../Images/banner.png";

import {
  MdPhone,
  MdTaskAlt,
  MdOutlineWorkOutline,
  MdOutlineSupportAgent,
  MdPeople,
} from "react-icons/md";

import { IoMail } from "react-icons/io5";

import { useSelector, useDispatch } from "react-redux";

import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";

import { fetchUsers } from "../../actions/userActions";

import { getWorkOrderLists } from "../../actions/workOrderActions";

import { getServiceTicketLists } from "../../actions/serviceTicket";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const loggedInuser = useSelector((state) => state.user.user);

  const users = useSelector((state) => state.user.users);
  const { access} = useSelector((state) => state.user);
  const usersLoading = useSelector((state) => state.user.loading);

  const { workOrders } = useSelector((state) => state.workOrder);

  const { serviceTickets } = useSelector((state) => state.serviceTicket);

  const { user_type } = useSelector((state) => state.user.user);

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (access.includes(user_type)) {
    dispatch(fetchUsers());
    }
    dispatch(getWorkOrderLists());

    dispatch(getServiceTicketLists({}));
  }, [dispatch]);

  useEffect(() => {
    let loggedInUsers = JSON.parse(localStorage.getItem("user"));

    setUser(loggedInUsers);
  }, [loggedInuser, users]);

  const statuses = ["Open", "Design", "In Progress", "Reviewing", "Closed"];

  const ticketStatuses = ["Open", "Closed"];

  const getStatusCounts = () => {
    const statusCounts = {};

    statuses.forEach((status) => {
      statusCounts[status] = workOrders?.workOrder?.filter(
        (order) => order.status === status,
      ).length;
    });

    return statusCounts;
  };

  const getTicketStatusCounts = () => {
    const statusCounts = {};

    ticketStatuses.forEach((status) => {
      statusCounts[status] = serviceTickets?.filter(
        (ticket) => ticket.status === status,
      ).length;
    });

    return statusCounts;
  };

  const statusCounts = getStatusCounts();

  const ticketStatusCounts = getTicketStatusCounts();

  const subcontractorsAccess = ["Subcontractor", "Subcontractor_User"];

  const totalWorkOrders = workOrders?.workOrder?.length || 0;

  const totalServiceTickets = serviceTickets?.length || 0;

  const totalUsers = users?.data?.length || 0;

  const statusCard = (title, count, icon) => (
    <div className="bg-white rounded-[28px] p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>

          <h1 className="text-3xl font-bold text-[#1E1B4B] mt-2">{count}</h1>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  const renderStatusItem = (status, count) => (
    <div
      key={status}
      className="flex items-center gap-4 bg-gray-50 hover:bg-indigo-50 transition-all duration-300 rounded-2xl px-4 py-3 border border-gray-100"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md">
        <MdTaskAlt size={22} />
      </div>

      <div>
        <h1 className="font-semibold text-[#1E1B4B]">{status}</h1>

        <span className="text-indigo-600 font-bold text-lg">{count}</span>
      </div>
    </div>
  );

  return (
    <>
      <Header />

      <div className="flex">
        <AdminSideNavbar />

        <div className="flex-1 py-8 px-8 bg-gradient-to-br from-[#FAFAFA] to-indigo-50 min-h-screen overflow-y-auto">
          {/* PAGE HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1E1B4B] tracking-tight">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Welcome back to IDR Technology Portal
            </p>
          </div>

          {/* WELCOME CARD */}
          <div className="relative overflow-hidden flex items-center justify-between bg-white rounded-[32px] shadow-lg border border-indigo-50 px-8 py-8">
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200 to-pink-200 opacity-30 blur-3xl rounded-full" />

            {usersLoading ? (
              <p>Loading user data...</p>
            ) : (
              <div className="relative z-10 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-bold text-3xl text-[#1E1B4B] tracking-tight">
                    Hello,{" "}
                    {user?.first_name !== null
                      ? `${user?.first_name} ${user?.last_name}`
                      : "User"}
                  </h1>

                  <p className="text-gray-500 text-[15px]">
                    Welcome to IDR Technology Solution Portal.
                  </p>
                </div>

                <div className="flex flex-wrap gap-5">
                  {/* PHONE */}
                  <div className="flex items-center gap-4 bg-indigo-50 px-5 py-4 rounded-2xl border border-indigo-100">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md">
                      <MdPhone size={22} />
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Phone</p>

                      <p className="font-semibold text-[#1E1B4B]">
                        {user?.contact_number !== null
                          ? user?.contact_number
                          : "NA"}
                      </p>
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="flex items-center gap-4 bg-indigo-50 px-5 py-4 rounded-2xl border border-indigo-100">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md">
                      <IoMail size={22} />
                    </div>

                    <div>
                      <p className="text-gray-500 text-sm">Email</p>

                      <p className="font-semibold text-[#1E1B4B]">
                        {user?.email_id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="hidden lg:flex w-[35%] justify-end relative z-10">
              <img
                src={circle}
                alt="banner"
                className="w-[320px] object-contain"
              />
            </div>
          </div>

          {/* STAT SUMMARY */}
          {/* {!subcontractorsAccess.includes(user_type) && ( */}
            <>
              {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                {statusCard(
                  "Total Work Orders",
                  totalWorkOrders,
                  <MdOutlineWorkOutline size={28} />,
                )}

                {statusCard(
                  "Service Tickets",
                  totalServiceTickets,
                  <MdOutlineSupportAgent size={28} />,
                )}

                {user_type ==="Admin" && statusCard("Users", totalUsers, <MdPeople size={28} />)}
              </div> */}

              {/* MAIN CONTENT */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
                {/* WORK ORDERS */}
                <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-[#1E1B4B]">
                      Work Order Assignments
                    </h1>

                    <div className="h-2 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {statuses.map((status) =>
                      renderStatusItem(status, statusCounts[status]),
                    )}
                  </div>
                </div>

                {/* SERVICE TICKETS */}
                <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-[#1E1B4B]">
                      Service Tickets
                    </h1>

                    <div className="h-2 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
                  </div>

                  <div className="flex flex-col gap-4">
                    {ticketStatuses.map((status) =>
                      renderStatusItem(status, ticketStatusCounts[status]),
                    )}
                  </div>
                </div>

                {/* USER DETAILS */}
                <div className="bg-white rounded-[28px] shadow-md border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-xl font-bold text-[#1E1B4B]">
                      User Details
                    </h1>

                    <div className="h-2 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-indigo-50 rounded-xl">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                            Name
                          </th>

                          <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                            Role
                          </th>

                          <th className="px-6 py-4 text-left text-xs uppercase tracking-wider font-bold text-indigo-600">
                            Email
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {usersLoading ? (
                          <tr>
                            <td colSpan="3" className="px-6 py-4">
                              Loading...
                            </td>
                          </tr>
                        ) : (
                          <tr className="hover:bg-gray-50 transition-all duration-200 border-b border-gray-100">
                            <td className="px-6 py-5 whitespace-nowrap font-medium text-[#1E1B4B]">
                              {user?.first_name !== null
                                ? `${user?.first_name} ${user?.last_name}`
                                : "NA"}
                            </td>

                            <td className="px-6 py-5 whitespace-nowrap">
                              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold">
                                {user?.user_type}
                              </span>
                            </td>

                            <td className="px-6 py-5 whitespace-nowrap text-gray-600">
                              {user?.email_id}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          {/* )} */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
