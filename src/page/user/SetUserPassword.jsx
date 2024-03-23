import React, { useState,useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import {  fetchUsers, setUserPasswordByAdmin} from '../../actions/userActions';
import { useNavigate,useParams } from 'react-router-dom'; 
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
const SetUserPasswordForm = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const users = useSelector((state) => state.user.users);
  const user = users?.data?.find(user => user.user_id === userId); 
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setEmail(user.email_id);
    }
  }, [user]);
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (passwordValue !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Dispatch the setPassword action
    dispatch(setUserPasswordByAdmin({ password:passwordValue, email_id:email },navigate));
  };

  return (
    <>
    <Header />
    <div className="flex">
      <AdminSideNavbar />
      <div className="container mt-8 mx-auto p-4">
          <h1 className="text-2xl text-center mb-2">Set User Password</h1>
          <form onSubmit={handleSubmit} className="w-1/2 mx-auto">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Enter your password"
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {/* Submit button */}
            <div className="flex items-center justify-between">
              <button
                className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded-md w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
   
    </>
  );
};

export default SetUserPasswordForm;