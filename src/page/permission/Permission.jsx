/** @format */

import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";

import PermissionHeader from "../../Components/permission/PermissionHeader";
import PermissionTable from "../../Components/permission/PermissionTable";
import RoleSelector from "../../Components/permission/RoleSelector";
import AddPermissionType from "../../Components/permission/AddPermissionType";

import {
  getAllRoles,
  getRolePermissions,
  updateRolePermissions,
} from "../../actions/permissionAction";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const Permission = () => {
  const dispatch = useDispatch();

  // -----------------------------
  // Roles
  // -----------------------------
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] =
    useState("");

  // -----------------------------
  // Modules
  // -----------------------------
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] =
    useState("");

  // -----------------------------
  // Selected module permissions
  // -----------------------------
  const [selectedModuleData, setSelectedModuleData] =
    useState(null);

  // -----------------------------
  // UI state
  // -----------------------------
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

  // ============================================
  // GET ROLES + MODULES
  // ============================================
  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      setError("");

      const response = await getAllRoles();

      console.log("Roles response:", response);

      setRoles(response?.roles || []);

      /*
       * Backend now returns modules from:
       * GET /permission/roles/all
       */
      setModules(response?.modules || []);

      // Select first role
      if (response?.roles?.length > 0) {
        setSelectedRole(
          response.roles[0].user_role_id
        );
      }

      // Select first module
      if (response?.modules?.length > 0) {
        setSelectedModule(
          response.modules[0].perm_module_id
        );
      }
    } catch (error) {
      console.error(
        "Error fetching roles:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load roles."
      );
    } finally {
      setLoadingRoles(false);
    }
  };

  // ============================================
  // GET ROLE + MODULE PERMISSIONS
  // ============================================
  const fetchRolePermissions = async (
    roleId,
    moduleId
  ) => {
    if (!roleId || !moduleId) {
      setSelectedModuleData(null);
      return;
    }

    try {
      setLoadingPermissions(true);
      setError("");
      setSaved(false);

      const response =
        await getRolePermissions(
          roleId,
          moduleId
        );

      console.log(
        "Role/module permission response:",
        response
      );

      /*
       * Depending on backend response:
       *
       * response.module
       * response.modules
       *
       * We support both.
       */
      const moduleData =
        response?.module ||
        response?.modules ||
        response?.data?.module ||
        response?.data?.modules ||
        null;

      setSelectedModuleData(moduleData);

      /*
       * Keep Redux permission state updated.
       *
       * IMPORTANT:
       * Your application-wide usePermission hook
       * expects an ARRAY of modules.
       */
      if (moduleData) {
        dispatch({
          type: "permission/setPermissions",
          payload: Array.isArray(moduleData)
            ? moduleData
            : [moduleData],
        });
      }
    } catch (error) {
      console.error(
        "Error fetching role/module permissions:",
        error
      );

      setSelectedModuleData(null);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load permissions."
      );
    } finally {
      setLoadingPermissions(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================
  useEffect(() => {
    fetchRoles();
  }, []);

  // ============================================
  // ROLE + MODULE CHANGE
  // ============================================
  useEffect(() => {
    if (
      selectedRole &&
      selectedModule
    ) {
      fetchRolePermissions(
        selectedRole,
        selectedModule
      );
    }
  }, [
    selectedRole,
    selectedModule,
  ]);

  // ============================================
  // ROLE CHANGE
  // ============================================
  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);

    /*
     * Reset selected module permissions
     * while the new role is loading.
     */
    setSelectedModuleData(null);

    setIsEditing(false);
    setSaved(false);
  };

  // ============================================
  // MODULE CHANGE
  // ============================================
  const handleModuleChange = (moduleId) => {
    setSelectedModule(moduleId);

    setSelectedModuleData(null);

    setIsEditing(false);
    setSaved(false);
  };

  // ============================================
  // CHANGE PERMISSION
  // ============================================
  const handlePermissionChange = (
    permissionId
  ) => {
    setSelectedModuleData((current) => {
      if (!current) return current;

      return {
        ...current,

        permission_types:
          current.permission_types?.map(
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
    });

    setSaved(false);
  };

  // ============================================
  // EDIT
  // ============================================
  const handleEdit = () => {
    if (!selectedModuleData) {
      return;
    }

    setIsEditing(true);
    setSaved(false);
  };

  // ============================================
  // CANCEL
  // ============================================
  const handleCancel = () => {
    setIsEditing(false);

    if (
      selectedRole &&
      selectedModule
    ) {
      fetchRolePermissions(
        selectedRole,
        selectedModule
      );
    }

    setSaved(false);
  };

  // ============================================
  // SAVE
  // ============================================
  const handleSave = async () => {
    if (
      !selectedRole ||
      !selectedModuleData
    ) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const updatePermissions =
        selectedModuleData.permission_types?.map(
          (permission) => ({
            perm_type_id:
              permission.perm_type_id,
            allow: permission.allow,
          })
        ) || [];

      console.log(
        "Updating permissions:",
        updatePermissions
      );

      /*
       * Existing update API.
       *
       * If backend changed this endpoint,
       * only updateRolePermissions() needs
       * to be changed.
       */
      await updateRolePermissions(
        selectedRole,
        updatePermissions
      );

      setIsEditing(false);
      setSaved(true);

      /*
       * Reload latest backend data
       */
      await fetchRolePermissions(
        selectedRole,
        selectedModule
      );
    } catch (error) {
      console.error(
        "Error updating permissions:",
        error
      );

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update permissions."
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // PERMISSION TYPE ADDED
  // ============================================
  const handlePermissionAdded = async () => {
    await fetchRolePermissions(
      selectedRole,
      selectedModule
    );
  };

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-50">
        <AdminSideNavbar />

        <main className="min-w-0 flex-1 bg-gray-50 p-4 md:p-6">

          <div className="mx-auto w-full max-w-[1200px] space-y-6">

            {/* HEADER */}
            <PermissionHeader
              isEditing={isEditing}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onSave={handleSave}
              saving={saving}
            />

            {/* SUCCESS */}
            {saved && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Permissions saved successfully.
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ROLE + MODULE */}
            <RoleSelector
              roles={roles}
              modules={modules}
              selectedRole={selectedRole}
              selectedModule={selectedModule}
              setSelectedRole={
                handleRoleChange
              }
              setSelectedModule={
                handleModuleChange
              }
              isEditing={isEditing}
              loading={loadingRoles}
              loadingPermissions={
                loadingPermissions
              }
            />

            {/* PERMISSIONS */}
            {loadingPermissions ? (
              <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
                Loading permissions...
              </div>
            ) : (
              <PermissionTable
                module={selectedModuleData}
                isEditing={isEditing}
                onPermissionChange={
                  handlePermissionChange
                }
              />
            )}

            {/* ADD NEW PERMISSION TYPE */}
            {selectedModuleData && (
              <AddPermissionType
                module={selectedModuleData}
                disabled={isEditing}
                onPermissionAdded={
                  handlePermissionAdded
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