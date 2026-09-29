import React from "react";

const RoleSelector = ({
  roles,
  modules,
  selectedRole,
  selectedModule,
  setSelectedRole,
  setSelectedModule,
  isEditing,
  loading,
  loadingPermissions,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* ROLE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Select Role
          </label>

          <select
            value={selectedRole || ""}
            disabled={isEditing || loading}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
              disabled:bg-gray-100
              disabled:text-gray-500
            "
          >
            {loading ? (
              <option value="">Loading roles...</option>
            ) : (
              <>
                <option value="">Select Role</option>

                {roles?.map((role) => (
                  <option
                    key={role.user_role_id}
                    value={role.user_role_id}
                  >
                    {role.role_name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

        {/* MODULE */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Select Module
          </label>

          <select
            value={selectedModule || ""}
            disabled={
              isEditing ||
              loading ||
              loadingPermissions ||
              !selectedRole
            }
            onChange={(e) => setSelectedModule(e.target.value)}
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              py-2.5
              text-sm
              text-gray-700
              outline-none
              focus:border-indigo-500
              focus:ring-2
              focus:ring-indigo-100
              disabled:bg-gray-100
              disabled:text-gray-500
            "
          >
            {loadingPermissions ? (
              <option value="">Loading module permissions...</option>
            ) : (
              <>
                <option value="">Select Module</option>

                {modules?.map((module) => (
                  <option
                    key={module.perm_module_id}
                    value={module.perm_module_id}
                  >
                    {module.module_name}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>

      </div>

      <div className="mt-4 text-sm text-gray-500">
        {isEditing
          ? "You are currently editing permissions."
          : "Select a role and module to view permissions."}
      </div>
    </div>
  );
};

export default RoleSelector;