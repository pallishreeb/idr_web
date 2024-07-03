import React, { useState, useEffect } from "react";
import circle from "../../Images/banner.png";
import { MdPhone } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { MdTaskAlt } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { MdOutlineBorderColor } from "react-icons/md";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";
import { fetchUsers } from "../../actions/userActions";
import { getWorkOrderLists } from "../../actions/workOrderActions";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const loggedInuser = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.users);
  const usersLoading = useSelector((state) => state.user.loading);
  const { workOrders, loading } = useSelector((state) => state.workOrder);
  // Define a state variable to hold the matched user
  const [user, setUser] = useState(null);

    
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(getWorkOrderLists());
  }, [dispatch]);
  useEffect(() => {
    let loggedInUsers = JSON.parse(localStorage.getItem('user'))
    // Find the user object in the users array that matches the user.userId
    // const matched = users?.data?.find(
    //   (u) => u.user_id === loggedInuser.user_id
    // );
    // // Update the matchedUser state variable
    // setUser(matched);
    setUser(loggedInUsers)
  }, [loggedInuser, users]);
  // Define all possible statuses
  const statuses = ["Open", "Design", "In Progress", "Reviewing", "Closed"];

  // Function to count occurrences of each status
  const getStatusCounts = () => {
    const statusCounts = {};
    statuses.forEach((status) => {
      statusCounts[status] = workOrders?.workOrder?.filter(
        (order) => order.status === status
      ).length;
    });
    return statusCounts;
  };

  // Calculate status counts
  const statusCounts = getStatusCounts();
  // Split statuses into two columns
  const column1 = statuses.slice(0, Math.ceil(statuses.length / 2));
  const column2 = statuses.slice(Math.ceil(statuses.length / 2));

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50">
          <h1 className="font-bold text-lg">Dashboard</h1>
          <div className="flex mt-4 border py-7 px-5 bg-white">
            {usersLoading ? (
              <p>Loading user data...</p>
            ) : (
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h1 className="font-medium text-lg">
                    Hello,
                    {user?.first_name !== null
                      ? user?.first_name + " " + user?.last_name
                      : "User"}
                  </h1>
                  <p className="font-normal">
                    Welcome to IDR Technology Solution Portal.
                  </p>
                </div>
                <div className="flex gap-[2%]">
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                      <MdPhone size={20} />
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-400">Phone</p>
                      <p>
                        {user?.contact_number !== null
                          ? user?.contact_number
                          : "NA"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                      <IoMail size={20} />
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-400">Email</p>
                      <p>{user?.email_id}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="w-[60%]">
              <img src={circle} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-4 border py-7 px-5 bg-white">
              <h1 className="font-medium text-xl">Assignments</h1>

              <div className="flex mt-2">
                <div className="flex flex-col gap-3 mr-8">
                  {column1.map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                        <MdTaskAlt size={20} />
                      </div>
                      <div>
                        <h1 className="font-normal text-sm">{status}</h1>
                        <span>({statusCounts[status]})</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {column2.map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                        <MdTaskAlt size={20} />
                      </div>
                      <div>
                        <h1 className="font-normal text-sm">{status}</h1>
                        <span>({statusCounts[status]})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-4 border py-7 px-5 bg-white w-full">
      <h1 className="font-medium text-xl mb-4">User Details</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                User Email
              </th>
              {/* Uncomment below to include Password column */}
              {/* <th scope="col" className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Password
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {usersLoading ? (
              <tr>
                <td colSpan="3" className="px-6 py-4 whitespace-nowrap">
                  Loading logged in user data...
                </td>
              </tr>
            ) : (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user?.first_name !== null ? `${user?.first_name} ${user?.last_name}` : "NA"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{user?.user_type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user?.email_id}</td>
                {/* Uncomment below to include Password cell */}
                {/* <td className="px-6 py-4 whitespace-nowrap">Update password</td> */}
              </tr>
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

export default AdminDashboard;
