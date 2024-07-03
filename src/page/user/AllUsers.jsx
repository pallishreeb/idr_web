import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { BsPencil, BsTrash } from "react-icons/bs";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { fetchUsers ,deleteUser} from "../../actions/userActions";

const AllUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.user.users);
  const usersLoading = useSelector((state) => state.user.loading);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  useEffect(() => {
    dispatch(fetchUsers(sortConfig));
  }, [dispatch, sortConfig]);

  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    dispatch(fetchUsers({ sortBy: key, orderBy: direction }));
  };

  const handleEdit = (userId) => {
    navigate(`/users/update/${userId}`);
  };

  const handleSetPassword = (userId) => {
    navigate(`/set-user-password/${userId}`);
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteUser(userId));
        dispatch(fetchUsers(sortConfig));
      }

    });
  };
  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }
    return "↕";
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 mt-5 h-screen overflow-y-scroll">
          <div className="flex justify-between mb-4">
            <h1 className="font-bold text-lg">Users Management</h1>
            <Link
              to="/users/create"
              className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create New User
            </Link>
          </div>
          {usersLoading ? (
            <p>Loading users data...</p>
          ) : (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-200 px-4 py-2">Email</th>
                  <th
                    className="border border-gray-200 px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("user_type")}
                  >
                    User Type {getSortSymbol("user_type")}
                  </th>
                  <th
                    className="border border-gray-200 px-4 py-2 cursor-pointer"
                    onClick={() => handleSort("first_name")}
                  >
                    User Name {getSortSymbol("first_name")}
                  </th>
                  <th className="border border-gray-200 px-4 py-2">Contact Number</th>
                  <th className="border border-gray-200 px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.data ? (
                  [...users.data]
                    .sort((a, b) => {
                      if (sortConfig.key === "user_type" || sortConfig.key === "first_name") {
                        return sortConfig.direction === "ASC"
                          ? a[sortConfig.key].localeCompare(b[sortConfig.key])
                          : b[sortConfig.key].localeCompare(a[sortConfig.key]);
                      }
                      return 0;
                    })
                    .map((user) => (
                      <tr key={user?.id}>
                        <td className="border border-gray-200 px-4 py-2">{user.email_id}</td>
                        <td className="border border-gray-200 px-4 py-2">{user.user_type}</td>
                        <td className="border border-gray-200 px-4 py-2">
                          {user?.first_name !== null ? user?.first_name + " " + user?.last_name : "NA"}
                        </td>
                        <td className="border border-gray-200 px-4 py-2">
                          {user?.contact_number ? user?.contact_number : "NA"}
                        </td>
                        <td className="border border-gray-200 px-2 py-2">
                          <button
                            className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded mr-2"
                            onClick={() => handleSetPassword(user.user_id)}
                          >
                            Set Password
                          </button>
                          <button className=" bg-gray-500 hover:bg-gray-600 text-white font-bold py-1 px-2 rounded mr-2" onClick={() => handleEdit(user.user_id)}>
                          <BsPencil />
                          </button>
                          <button className=" bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded" onClick={() => handleDelete(user.user_id)}>
                          <BsTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      No Data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default AllUsers;
