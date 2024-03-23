import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser,fetchUsers } from "../../actions/userActions";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { useParams, useNavigate } from 'react-router-dom'; 

const UpdateUser = () => {
  const { userId } = useParams(); // Extract userId from params
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  // const successMessage = useSelector((state) => state.user.successMessage);
  // const errorMessage = useSelector((state) => state.user.errorMessage);
  const users = useSelector((state) => state.user.users);
  const user = users?.data?.find(user => user.user_id === userId); // Convert userId to number for comparison

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEmail(user.email_id);
      setUserType(user.user_type);
    }
  }, [user]); // Trigger effect when user data changes

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      user_id: userId,
      user_type: userType,
    };

    dispatch(updateUser(userData, navigate));
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mt-8 mx-auto p-4">
          <h1 className="text-2xl text-center font-bold mb-4">Update User</h1>
          {/* {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">{successMessage}</span>
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )} */}
          <form onSubmit={handleSubmit} className="w-1/2 mx-auto">
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 px-4 py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userType" className="block mb-2">User Type</label>
              <select
                id="userType"
                className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 px-4 py-2"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select User Type</option>
                <option value="Admin">Admin</option>
                <option value="Subadmin">Subadmin</option>
                <option value="IDR Employee">IDR Employee</option>
                <option value="Client Employee">Client Employee</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update User
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
