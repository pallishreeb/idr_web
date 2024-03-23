import React, { useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BsPencil, BsTrash } from "react-icons/bs";
import { fetchUsers } from "../../actions/userActions";


const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Get users from Redux store
  const users = useSelector((state) => state.user.users);
// console.log(users)
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  const handleEdit = (userId) => {
    // Redirect to the update page with the user ID
    navigate(`/users/update/${userId}`);
  };
  const handleSetPassword = (userId) => {
    // Redirect to the update page with the user ID
    navigate(`/set-user-password/${userId}`);
    // navigate(`/set-password`);
  };

  const handleDelete = (userId) => {
    // Implement delete functionality
    console.log("Delete user:", userId);
  };

  return (
    <>
      <Header />
      <div className="flex">
        {/* <SideNavbar /> */}
        <AdminSideNavbar />
        <div className="container mx-auto p-4 mt-5">
          <div className="flex justify-between mb-4">
            <h1 className="font-bold text-lg">All Users</h1>
            <Link
              to="/users/create"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create New User
            </Link>
          </div>
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border border-gray-200 px-4 py-2">Email</th>
                <th className="border border-gray-200 px-4 py-2">User Type</th>
                <th className="border border-gray-200 px-4 py-2">User Name</th>
                <th className="border border-gray-200 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.data?.map((user) => (
                <tr key={user?.id}>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.email_id}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {user.user_type}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    { user?.first_name !== null ? user?.first_name + "" + user?.last_name : "NA"}
                  </td>
                  <td className="border border-gray-200 px-2 py-2">
                  <button className=" hover:bg-indigo-700 hover:text-white text-black font-bold py-1 px-2 rounded mr-2" onClick={() => handleSetPassword(user.user_id)}>
                      Set Password
                    </button>
                    <button className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded mr-2" onClick={() => handleEdit(user.user_id)}>
                      <BsPencil />
                    </button>
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(user.id)}>
                      <BsTrash/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllUsers;
