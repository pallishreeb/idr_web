import React, { useEffect, useState } from "react";

import {
  FaEdit,
  FaPlus,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
// import useModulePermissions from "../../hooks/useModulePermissions";
// import { PERMISSION_MODULES } from "../../constants/permissionConstants";

import {
  getAllUserTypes,
  createUserType,
  updateUserType,
  deleteUserType,
} from "../../actions/permissionAction";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const UserTypes = () => {
//   const {
//     canRead,
//     canCreate,
//     canUpdate,
//     canDelete,
//   } = useModulePermissions(PERMISSION_MODULES.USER_TYPES);

  const [userTypes, setUserTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingUserType, setEditingUserType] = useState(null);

  const [roleName, setRoleName] = useState("");
  const [saving, setSaving] = useState(false);

  // ============================================
  // Get User Types
  // ============================================

  const fetchUserTypes = async () => {


    try {
      setLoading(true);

      const response = await getAllUserTypes();

      /*
       * Keep this flexible because the exact response
       * wrapper may vary.
       */
      const data =
        response?.roles ||
        response?.data ||
        response ||
        [];

      setUserTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching user types:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch user types"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserTypes();
  }, []);

  // ============================================
  // Open Create Modal
  // ============================================

  const handleCreate = () => {

    setEditingUserType(null);
    setRoleName("");
    setShowModal(true);
  };

  // ============================================
  // Open Edit Modal
  // ============================================

  const handleEdit = (role) => {
    setEditingUserType(role);
    setRoleName(role?.display_name || "");
    setShowModal(true);
  };

  // ============================================
  // Close Modal
  // ============================================

  const handleCloseModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingUserType(null);
    setRoleName("");
  };

  // ============================================
  // Create / Update
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = roleName.trim();

    if (!trimmedName) {
      toast.error("Please enter a user type name");
      return;
    }

    try {
      setSaving(true);

      if (editingUserType) {

        await updateUserType(
          editingUserType.user_role_id,
          trimmedName
        );

        toast.success("User type updated successfully");
      } else {

        await createUserType(trimmedName);

        toast.success("User type created successfully");
      }

      handleCloseModal();
      await fetchUserTypes();
    } catch (error) {
      console.error("Error saving user type:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to save user type"
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // Delete
  // ============================================


const handleDelete = (role) => {
  Swal.fire({
    title: "Are you sure?",
    text: `Do you really want to delete "${role?.display_name}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, keep it",
    
  }).then(async (result) => {
    if (!result.isConfirmed) return;

    try {
      setLoading(true);

      await deleteUserType(role.user_role_id);

      toast.success("User type deleted successfully");

      // Refresh the list after deletion
      await fetchUserTypes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete the user type");
    } finally {
      setLoading(false);
    }
  });
};




  return (
        <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
    <div className="p-6">
      {/* ============================================
          Header
      ============================================ */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            User Types
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage user types.
          </p>
        </div>


          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
           <FaPlus size={16} />
            Add User Type
          </button>

      </div>

      {/* ============================================
          Table
      ============================================ */}

      <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                  User Type
                </th>


                  <th className="px-6 py-3 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">
                    Actions
                  </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={ 2}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    Loading user types...
                  </td>
                </tr>
              ) : userTypes.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No user types found.
                  </td>
                </tr>
              ) : (
                [...userTypes]
                .sort((a, b) =>
                    (a.display_name || "").localeCompare(
                    b.display_name || "",
                    undefined,
                    { sensitivity: "base" }
                    )
                )
                .map((role) => (
                  <tr
                    key={role.user_role_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {role.display_name}
                    </td>

                    
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
   
                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(role)
                              }
                              className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-indigo-600"
                              title="Edit"
                            >
                              <FaEdit size={16} />
                            </button>
  

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(role)
                              }
                              className="p-2 text-gray-500 rounded-md hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <FaTrash size={15} />
                            </button>

                        </div>
                      </td>
             
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================
          Create / Edit Modal
      ============================================ */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md mx-4 bg-white rounded-lg shadow-xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {editingUserType
                  ? "Edit User Type"
                  : "Create User Type"}
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={saving}
                className="p-1 text-gray-500 rounded hover:bg-gray-100"
              >
               <FaTimes size={18} />
              </button>
            </div>

            {/* Modal Body */}

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-5">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  User Type Name
                </label>

                <input
                  type="text"
                  value={roleName}
                  onChange={(e) =>
                    setRoleName(e.target.value)
                  }
                  placeholder="Enter user type name"
                  disabled={saving}
                  autoFocus
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Modal Footer */}

              <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || !roleName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving
                    ? "Saving..."
                    : editingUserType
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
      </div>
      </div>
    </>
  );
};

export default UserTypes;