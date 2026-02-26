import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link,useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getSubcontractorLists,
  getSubcontractorUsersById,
  deleteSubcontractorUser,
} from "../../actions/subContractorAction";

const SubcontractorUsersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const subcontractors = useSelector(
    (state) => state.subcontractor.subcontractors,
  );
  const loadingSubs = useSelector((state) => state.subcontractor.loading);

  const users = useSelector((state) => state.subcontractor.subcontractorUsers);

  const loadingUsers = useSelector((state) => state.subcontractor.loadingUsers);

  const user = useSelector((state) => state.subcontractor.subcontractorUser);

  const [selectedSubcontractor, setSelectedSubcontractor] = useState(
  location.state?.selectedSubcontractor || ""
);

  /* ===========================
     Load Subcontractors
     =========================== */
  useEffect(() => {
    dispatch(getSubcontractorLists());
  }, [dispatch]);
  
useEffect(() => {
  if (location.state?.selectedSubcontractor) {
    setSelectedSubcontractor(location.state.selectedSubcontractor);
  }
}, [location.state]);
  /* ===========================
     Fetch Users On Select
     =========================== */
  useEffect(() => {
    if (selectedSubcontractor) {
      dispatch(getSubcontractorUsersById(selectedSubcontractor));
    }
  }, [dispatch, selectedSubcontractor]);

  /* ===========================
     Handlers
     =========================== */

  const handleSubChange = (id) => {
    setSelectedSubcontractor(id);
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSubcontractorUser(userId));
      }
    });
  };

  const handleEdit = (userId) => {
    navigate(`/edit-subcontractor-user/${userId}`, {
      state: { selectedSubcontractor },
    });
  };

  /* ===========================
     UI
     =========================== */

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />

        <div className="container mx-auto p-4 bg-gray-50">
          {/* Dropdown */}
          <div className="mb-6">
            <label className="block text-xl font-semibold mb-2">
              Select Subcontractor
            </label>

            <select
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={selectedSubcontractor}
              onChange={(e) => handleSubChange(e.target.value)}
            >
              <option value="">Select a subcontractor</option>

              {loadingSubs ? (
                <option disabled>Loading...</option>
              ) : (
                subcontractors?.map((sub) => (
                  <option
                    key={sub.subcontractor_id}
                    value={sub.subcontractor_id}
                  >
                    {sub.subcontractor_name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Table Section */}
          {selectedSubcontractor && (
            <div>
              {/* Header + Add Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Users List</h2>

                <button className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800">
                  <Link
                    to={`/create-sub-contractor-user/${selectedSubcontractor}`}
                    state={{ selectedSubcontractor }}
                  >
                    Add Subcontractor User
                  </Link>
                </button>
              </div>

              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <table className="table-auto w-full bg-white shadow rounded">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2 text-left">Name</th>
                      <th className="border px-4 py-2 text-left">Email</th>
                      <th className="border px-4 py-2 text-left">Contact</th>
                      <th className="border px-4 py-2 text-left">Role</th>
                      <th className="border px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users?.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-6">
                          No Users Found
                        </td>
                      </tr>
                    ) : (
                      users
                        ?.slice()
                        .sort((a, b) =>
                            (a?.first_name || "")
                            .toLowerCase()
                            .localeCompare(
                                (b?.first_name || "").toLowerCase()
                            )
                        )
                        .map((userItem) => (
                          <tr
                            key={userItem.subcontractor_user_id}
                            className="hover:bg-gray-50"
                          >
                            <td className="border px-4 py-2">
                              {userItem.first_name} {userItem.last_name}
                            </td>

                            <td className="border px-4 py-2">
                              {userItem.email_id}
                            </td>

                            <td className="border px-4 py-2">
                              {userItem.mobile || "NA"}
                            </td>

                            <td className="border px-4 py-2">
                              {userItem.is_active ? "Active" : "Inactive"}
                            </td>

                            <td className="border px-4 py-2 text-center space-x-2">
                              <button
                                onClick={() =>
                                  handleEdit(userItem.subcontractor_user_id)
                                }
                                className="p-[6px] bg-gray-100 rounded hover:bg-gray-200"
                              >
                                <BiSolidEditAlt />
                              </button>

                              <button
                                onClick={() =>
                                  handleDeleteUser(
                                    userItem.subcontractor_user_id,
                                  )
                                }
                                className="p-[6px] bg-gray-100 rounded hover:bg-gray-200"
                              >
                                <AiFillDelete />
                              </button>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubcontractorUsersPage;
