
import React, { useEffect, useRef, useState } from "react";

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

const getModuleKey = (roleId, moduleId) =>
  `${roleId}:${moduleId}`;

const hasModuleChanges = (original, current) => {
  if (!original || !current) return false;

  const originalPermissions = original.permission_types || [];
  const currentPermissions = current.permission_types || [];

  if (originalPermissions.length !== currentPermissions.length) {
    return true;
  }

  const originalMap = new Map(
    originalPermissions.map((permission) => [
      String(permission.perm_type_id),
      permission.allow === true,
    ])
  );

  return currentPermissions.some((permission) => {
    const id = String(permission.perm_type_id);

    return (
      !originalMap.has(id) ||
      originalMap.get(id) !== (permission.allow === true)
    );
  });
};

const Permission = () => {
  // Roles
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const isAdminRole =
    roles.find(
      (role) => role.user_role_id === selectedRole
    )?.role_name === "Admin";

  // Modules
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");

  // Current module
  const [selectedModuleData, setSelectedModuleData] = useState(null);

  // Draft and original permissions
  const [moduleDrafts, setModuleDrafts] = useState({});
  const [originalModuleDrafts, setOriginalModuleDrafts] = useState({});

  // UI states
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Prevent outdated requests
  const permissionRequestRef = useRef(0);

  // Check all modified modules for the selected role
  const changedModules = modules.filter((module) => {
    const key = getModuleKey(
      selectedRole,
      module.perm_module_id
    );

    return hasModuleChanges(
      originalModuleDrafts[key],
      moduleDrafts[key]
    );
  });

  const hasChanges = changedModules.length > 0;

  // ============================================
  // FETCH ROLES AND MODULES
  // ============================================

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        setError("");

        const response = await getAllRoles();

        setRoles(response?.roles || []);
        setModules(response?.modules || []);

        if (response?.roles?.length > 0) {
          setSelectedRole(response.roles[0].user_role_id);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load roles."
        );
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, []);

  // ============================================
  // FETCH ROLE + MODULE PERMISSIONS
  // ============================================

  const fetchRolePermissions = async (roleId, moduleId) => {
    if (!roleId || !moduleId) return;

    const requestId = ++permissionRequestRef.current;

    try {
      setLoadingPermissions(true);
      setError("");

      const response = await getRolePermissions(
        roleId,
        moduleId
      );

      if (requestId !== permissionRequestRef.current) {
        return;
      }

      const moduleData =
        response?.module ||
        response?.modules ||
        response?.data?.module ||
        response?.data?.modules ||
        null;

      if (!moduleData) {
        throw new Error("No module permissions received.");
      }

      const key = getModuleKey(roleId, moduleId);

      setSelectedModuleData(moduleData);

      setModuleDrafts((previous) => ({
        ...previous,
        [key]: moduleData,
      }));

      setOriginalModuleDrafts((previous) => ({
        ...previous,
        [key]: moduleData,
      }));
    } catch (error) {
      if (requestId !== permissionRequestRef.current) {
        return;
      }

      console.error("Error fetching permissions:", error);

      setSelectedModuleData(null);

      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load permissions."
      );
    } finally {
      if (requestId === permissionRequestRef.current) {
        setLoadingPermissions(false);
      }
    }
  };

  // ============================================
  // ROLE + MODULE SELECTION
  // ============================================

  useEffect(() => {
    if (!selectedRole || !selectedModule) {
      setSelectedModuleData(null);
      setLoadingPermissions(false);
      return;
    }

    const key = getModuleKey(
      selectedRole,
      selectedModule
    );

    const hasCachedModule =
      Object.prototype.hasOwnProperty.call(
        moduleDrafts,
        key
      );

    if (hasCachedModule) {
      setSelectedModuleData(moduleDrafts[key]);
      setLoadingPermissions(false);
      return;
    }

    fetchRolePermissions(selectedRole, selectedModule);
  }, [selectedRole, selectedModule, moduleDrafts]);

  // ============================================
  // ROLE CHANGE
  // ============================================

  const handleRoleChange = (roleId) => {
    if (saving) return;

    permissionRequestRef.current += 1;

    setSelectedRole(roleId);
    setSelectedModule("");
    setSelectedModuleData(null);

    setLoadingPermissions(false);
    setSaved(false);
    setError("");

    // Existing drafts for other roles are preserved.
  };

  // ============================================
  // MODULE CHANGE
  // ============================================

  const handleModuleChange = (moduleId) => {
    if (saving) return;

    permissionRequestRef.current += 1;

    if (selectedModule === moduleId) {
      setSelectedModule("");
      setSelectedModuleData(null);
      setLoadingPermissions(false);
      return;
    }

    const key = getModuleKey(selectedRole, moduleId);

    const hasCachedModule =
      Object.prototype.hasOwnProperty.call(
        moduleDrafts,
        key
      );

    setSelectedModule(moduleId);

    setSelectedModuleData(
      hasCachedModule ? moduleDrafts[key] : null
    );

    setLoadingPermissions(!hasCachedModule);
    setSaved(false);
    setError("");
  };

  // ============================================
  // CHANGE PERMISSION
  // ============================================

  const handlePermissionChange = (permissionId) => {
    if (
      !selectedModuleData ||
      !selectedRole ||
      !selectedModule ||
      isAdminRole ||
      saving
    ) {
      return;
    }

    const key = getModuleKey(
      selectedRole,
      selectedModule
    );

    const updatedModule = {
      ...selectedModuleData,
      permission_types:
        selectedModuleData.permission_types?.map(
          (permission) =>
            String(permission.perm_type_id) ===
            String(permissionId)
              ? {
                  ...permission,
                  allow: !permission.allow,
                }
              : permission
        ),
    };

    setSelectedModuleData(updatedModule);

    setModuleDrafts((previous) => ({
      ...previous,
      [key]: updatedModule,
    }));

    setSaved(false);
    setError("");
  };

  // ============================================
  // DISCARD ALL UNSAVED CHANGES
  // ============================================

  const handleCancel = () => {
    if (!selectedRole || saving) return;

    setModuleDrafts((previous) => {
      const updated = { ...previous };

      modules.forEach((module) => {
        const key = getModuleKey(
          selectedRole,
          module.perm_module_id
        );

        if (
          Object.prototype.hasOwnProperty.call(
            originalModuleDrafts,
            key
          )
        ) {
          updated[key] = originalModuleDrafts[key];
        }
      });

      return updated;
    });

    const currentKey = getModuleKey(
      selectedRole,
      selectedModule
    );

    setSelectedModuleData(
      originalModuleDrafts[currentKey] || null
    );

    setSaved(false);
    setError("");
  };

  // ============================================
  // SAVE ALL MODIFIED MODULES
  // ============================================

  const handleSave = async () => {
    if (!selectedRole || saving || !hasChanges) {
      return;
    }

    const roleId = selectedRole;

    // Capture all modified module data before saving.
    const modulesToSave = changedModules.map((module) => {
      const key = getModuleKey(
        roleId,
        module.perm_module_id
      );

      return {
        key,
        moduleName: module.module_name,
        moduleData: moduleDrafts[key],
      };
    });

    try {
      setSaving(true);
      setError("");
      setSaved(false);

      const successfulModules = [];
      const failedModules = [];

      // Preserve the existing API contract.
      // Save each modified module separately.
      for (const item of modulesToSave) {
        try {
          const updatePermissions =
            item.moduleData.permission_types?.map(
              (permission) => ({
                perm_type_id: permission.perm_type_id,
                allow: permission.allow === true,
              })
            ) || [];

          await updateRolePermissions(
            roleId,
            updatePermissions
          );

          successfulModules.push(item);
        } catch (moduleError) {
          console.error(
            `Failed to save ${item.moduleName}:`,
            moduleError
          );

          failedModules.push(item.moduleName);
        }
      }

      // Update original snapshots only for successful modules.
      if (successfulModules.length > 0) {
        setOriginalModuleDrafts((previous) => {
          const updated = { ...previous };

          successfulModules.forEach((item) => {
            updated[item.key] = item.moduleData;
          });

          return updated;
        });
      }

      if (failedModules.length > 0) {
        setError(
          `Could not save: ${failedModules.join(", ")}. Other modules were saved successfully. You can retry the failed changes.`
        );

        return;
      }

      setSaved(true);
      setError("");
    } catch (error) {
      console.error("Error saving permissions:", error);

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
  // RENDER
  // ============================================

  return (
    <>
      <Header />

      <div className="flex min-h-screen bg-gray-50">
        <AdminSideNavbar />

        <main className="min-w-0 flex-1 bg-gray-50 p-4 md:p-6">
          <div className="mx-auto w-full max-w-[1200px] space-y-6">

            <PermissionHeader
              onCancel={handleCancel}
              onSave={handleSave}
              saving={saving}
              hasChanges={hasChanges}
              changedModuleCount={changedModules.length}
            />

            {saved && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                All permissions saved successfully.
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <RoleSelector
              roles={roles}
              modules={modules}
              selectedRole={selectedRole}
              selectedModule={selectedModule}
              setSelectedRole={handleRoleChange}
              setSelectedModule={handleModuleChange}
              isEditing={saving}
              loading={loadingRoles}
              loadingPermissions={loadingPermissions}
            />

            {selectedRole && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

                <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
                  <h3 className="text-base font-semibold text-gray-800">
                    Modules & Permissions
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Select modules and update permissions.
                    Your changes will remain until you save or discard them.
                  </p>
                </div>

                <div className="divide-y divide-gray-200">
                  {modules.map((module) => {
                    const isOpen =
                      selectedModule === module.perm_module_id;

                    return (
                      <div key={module.perm_module_id}>

                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            handleModuleChange(
                              module.perm_module_id
                            )
                          }
                          className={`
                            flex w-full items-center justify-between
                            px-5 py-4 text-left transition
                            ${
                              isOpen
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-white text-gray-700 hover:bg-gray-50"
                            }
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          `}
                        >
                          <span className="text-sm font-semibold">
                            {module.module_name}
                          </span>

                          <span
                            className={`
                              text-xl transition-transform
                              ${isOpen ? "rotate-90" : ""}
                            `}
                          >
                            ›
                          </span>
                        </button>

                        {isOpen && (
                          <div className="border-t border-gray-200 bg-gray-50 p-4">

                            {loadingPermissions ? (
                              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
                                Loading permissions...
                              </div>
                            ) : (
                              <PermissionTable
                                module={selectedModuleData}
                                isAdminRole={isAdminRole}
                                onPermissionChange={
                                  handlePermissionChange
                                }
                              />
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
};

export default Permission;
