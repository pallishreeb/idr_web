import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import PermissionHeader from "../../Components/permission/PermissionHeader";
import PermissionTable from "../../Components/permission/PermissionTable";
import RoleSelector from "../../Components/permission/RoleSelector";

import {
  getAllRoles,
  getRolePermissions,
  updateRolePermissions,
} from "../../actions/permissionAction";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const Permission = () => {
    const dispatch = useDispatch();

  const [roles, setRoles] = useState([]);

  const [selectedRole, setSelectedRole] =
    useState("");

  const [permissions, setPermissions] =
    useState([]);

  const [isEditing, setIsEditing] =
    useState(false);

  const [loadingRoles, setLoadingRoles] =
    useState(false);

  const [loadingPermissions, setLoadingPermissions] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
   * Get all roles
   */
  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      setError("");

      const response = await getAllRoles();

      console.log("Roles:", response?.roles[0].user_role_id);

      setRoles(response?.roles || []);

      // Select first role
      if (response?.roles?.length > 0) {
        setSelectedRole(response?.roles[0].user_role_id);
      }
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load roles."
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  /*
   * Get permissions for selected role
   */
  const fetchRolePermissions = async (
    roleId
  ) => {
    if (!roleId) return;

    try {
      setLoadingPermissions(true);
      setError("");
      setSaved(false);

      const response =
        await getRolePermissions(roleId);

      setPermissions(response?.modules || []);
      // Save permissions in Redux
      dispatch({
        type: "permission/setPermissions",
        payload: response?.modules || [],
      });
    } catch (error) {
      console.error(
        "Error fetching permissions:",
        error
      );

      setError(
        error?.response?.data?.message ||
          "Failed to load permissions."
      );
    } finally {
      setLoadingPermissions(false);
    }
  };

  /*
   * Load roles when page opens
   */
  useEffect(() => {
    fetchRoles();
  }, []);

  /*
   * Load permissions whenever role changes
   */
  useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  /*
   * Change permission
   */
 const handlePermissionChange = (
  moduleId,
  permissionId
) => {
  setPermissions((current) =>
    current.map((module) => {

      if (
        module.perm_module_id !== moduleId
      ) {
        return module;
      }

      return {
        ...module,

        permission_types:
          module.permission_types?.map(
            (permission) => {

              if (
                permission.perm_type_id !==
                permissionId
              ) {
                return permission;
              }

              return {
                ...permission,
                allow: !permission.allow,
              };
            }
          ),
      };
    })
  );

  setSaved(false);
};

  /*
   * Edit
   */
  const handleEdit = () => {
    setIsEditing(true);
    setSaved(false);
  };

  /*
   * Cancel
   */
  const handleCancel = () => {
    setIsEditing(false);

    // Reload original data from API
    fetchRolePermissions(selectedRole);

    setSaved(false);
  };

  /*
   * Save
   */
  const handleSave = async () => {
  try {
    setSaving(true);
    setError("");

    const updatePermissions = [];

    permissions.forEach((module) => {

      module.permission_types?.forEach(
        (permission) => {

          updatePermissions.push({
            perm_type_id:
              permission.perm_type_id,

            allow: permission.allow,
          });

        }
      );

    });

    console.log(
      "Update permissions:",
      updatePermissions
    );

    await updateRolePermissions(
      selectedRole,
      updatePermissions
    );

    setIsEditing(false);
    setSaved(true);

  } catch (error) {

    console.error(
      "Error updating permissions:",
      error
    );

    setError(
      error?.response?.data?.message ||
        "Failed to update permissions."
    );

  } finally {
    setSaving(false);
  }
};

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-50">

        <AdminSideNavbar />

        <main className="min-w-0 flex-1 bg-gray-50 p-4 md:p-6">

          <div className="mx-auto w-full max-w-[1600px] space-y-6">

            <PermissionHeader
              isEditing={isEditing}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              saving={saving}
            />

            {saved && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Permissions saved successfully.
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <RoleSelector
              roles={roles}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              isEditing={isEditing}
              loading={loadingRoles}
            />

            {loadingPermissions ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
                Loading permissions...
              </div>
            ) : (
              <PermissionTable
                modules={permissions}
                isEditing={isEditing}
                onPermissionChange={
                  handlePermissionChange
                }
              />
            )}

          </div>

        </main>
      </div>
    </>
  );
};

export default Permission;