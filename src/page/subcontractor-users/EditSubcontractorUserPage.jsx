import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import {
  getSubcontractorUserById,
  updateSubcontractorUser,
  getSubcontractorLists,
} from "../../actions/subContractorAction";

const EditSubcontractorUserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();

  const subcontractors = useSelector(
    (state) => state.subcontractor.subcontractors
  );

  const userDetails = useSelector(
    (state) => state.subcontractor.subcontractorUser
  );

  const loading = useSelector(
    (state) => state.subcontractor.loadingUsers
  );

  const [formData, setFormData] = useState({
    subcontractor_user_id: "",
    subcontractor_id: "",
    subcontractor_company: "",
    email_id: "",
    mobile: "",
    first_name: "",
    last_name: "",
    is_active: true,
    internal_note: "",
  });

  /* ===========================
     Load Data
  =========================== */

  useEffect(() => {
    dispatch(getSubcontractorLists());
    dispatch(getSubcontractorUserById(userId));
  }, [dispatch, userId]);

  /* ===========================
     Prefill Form
  =========================== */

  useEffect(() => {
    if (!userDetails) return;

    const selectedSub = subcontractors?.find(
      (sub) =>
        String(sub.subcontractor_id) ===
        String(userDetails.subcontractor_id)
    );

    setFormData({
      subcontractor_user_id:
        userDetails.subcontractor_user_id,
      subcontractor_id:
        userDetails.subcontractor_id,
      subcontractor_company:
        selectedSub?.subcontractor_name || "",
      email_id: userDetails.email_id || "",
      mobile: userDetails.mobile || "",
      first_name: userDetails.first_name || "",
      last_name: userDetails.last_name || "",
      is_active:
        userDetails.is_active ?? true,
      internal_note:
        userDetails.internal_note || "",
    });
  }, [userDetails, subcontractors]);

  /* ===========================
     Handlers
  =========================== */

  const handleChange = (e) => {
    const { name, value, type, checked } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  };

  const handleSubcontractorChange = (e) => {
    const selectedId = e.target.value;

    const selectedSub = subcontractors.find(
      (sub) =>
        String(sub.subcontractor_id) ===
        String(selectedId)
    );

    setFormData((prev) => ({
      ...prev,
      subcontractor_id: selectedId,
      subcontractor_company:
        selectedSub?.subcontractor_name || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      subcontractor_user_id:
        formData.subcontractor_user_id,
      mobile: formData.mobile.trim(),
      first_name:
        formData.first_name.trim(),
      last_name:
        formData.last_name.trim(),
      is_active: formData.is_active,
      internal_note:
        formData.internal_note.trim(),
    };

    await dispatch(
      updateSubcontractorUser(payload)
    );

    navigate(-1);
  };

  /* ===========================
     UI
  =========================== */

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />

        <div className="container mx-auto p-6 bg-gray-50">
          <div className="max-w-xl mx-auto bg-white shadow rounded p-6">

            <h2 className="text-2xl font-semibold mb-6">
              Edit Subcontractor User
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* Subcontractor Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subcontractor
                </label>

                <select
                  value={formData.subcontractor_id}
                  onChange={
                    handleSubcontractorChange
                  }
                  className="border p-2 rounded w-full"
                  required
                  disabled
                >
                  <option value="">
                    Select Subcontractor
                  </option>

                  {subcontractors?.map((sub) => (
                    <option
                      key={
                        sub.subcontractor_id
                      }
                      value={
                        sub.subcontractor_id
                      }
                    >
                      {sub.subcontractor_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={
                    formData.first_name
                  }
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={
                    formData.last_name
                  }
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email_id}
                  disabled
                  className="border p-2 rounded w-full bg-gray-100"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Mobile
                </label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              {/* Internal Note */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Internal Note
                </label>
                <textarea
                  name="internal_note"
                  value={
                    formData.internal_note
                  }
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                  rows="3"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={
                    formData.is_active
                  }
                  onChange={handleChange}
                />
                <label>
                  Active User
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/sub-contractors-users", {
                    state: { selectedSubcontractor: formData.subcontractor_id }
                  })}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded text-white ${
                    loading
                      ? "bg-gray-400"
                      : "bg-indigo-700 hover:bg-indigo-800"
                  }`}
                >
                  {loading
                    ? "Updating..."
                    : "Update User"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSubcontractorUserPage;