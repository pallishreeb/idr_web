import React, { useState, useEffect } from 'react';
import circle from "../../Images/banner.png";
import { MdPhone } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { MdTaskAlt } from "react-icons/md";
import { useSelector ,useDispatch} from "react-redux";
import { MdOutlineBorderColor } from "react-icons/md";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";
import { fetchUsers } from "../../actions/userActions";
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const loggedInuser = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.users);
  const usersLoading = useSelector((state) => state.user.loading);
  // Define a state variable to hold the matched user
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  useEffect(() => {
    // Find the user object in the users array that matches the user.userId
    const matched = users?.data?.find(u => u.user_id === loggedInuser.user_id);
    // Update the matchedUser state variable
    setUser(matched);
  }, [loggedInuser, users]);
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50">
          <h1 className="font-bold text-lg">Dashboard</h1>
          <div className="flex mt-4 border py-7 px-5 bg-white">
          {usersLoading ? <p>Loading user data...</p> :
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="font-medium text-lg">
                  Hello,{ user?.first_name !== null ? user?.first_name + ' ' + user?.last_name : 'User'} 
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
                    <p>{user?.contact_number !== null ? user?.contact_number : "NA"}</p>
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
            </div> }
            <div className="w-[60%]">
              <img src={circle} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-4 border py-7 px-5 bg-white">
              <h1 className="font-medium text-xl">ASSIGNMENTS</h1>
              <div className="flex gap-16 mt-8">
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <MdTaskAlt size={20} />
                  </div>
                  <h1 className="font-normal text-sm">Open Tasks</h1>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <MdOutlineBorderColor size={20} />
                  </div>
                  <h1 className="font-normal text-sm">Open work orders</h1>
                </div>
              </div>
            </div>
            <div className="mt-4 border py-7 px-5 bg-white w-[65%]">
              <h1 className="font-medium text-xl">User Details</h1>
              <table className="mt-2">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      Name
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      Role
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      User Email
                    </th>
                    {/* <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      Password
                    </th> */}
                  </tr>
                </thead>
                <tbody>
                {usersLoading ? <p>Loading logged in user data...</p> :
                  <tr>
                    <td className="px-[12px] py-3">{ user?.first_name !== null ? user?.first_name + ' ' + user?.last_name : "NA"}</td>
                    <td className="px-[12px] py-3">{user?.user_type}</td>
                    <td className="px-[12px] py-3">{user?.email_id}</td>
                    {/* <td className="px-[12px] py-3">Update password</td> */}
                  </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
