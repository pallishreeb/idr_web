import React from "react";

const RoleSelector = ({
  roles,
  selectedRole,
  setSelectedRole,
  isEditing,
  loading,
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        <div className="w-full md:max-w-sm">

          <label className="mb-2 block text-sm font-medium text-gray-700">
            Select Role
          </label>

          <select
            value={selectedRole || ""}
            disabled={isEditing || loading}
            onChange={(e) =>
              setSelectedRole(e.target.value)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-gray-100 disabled:text-gray-500"
          >

            {loading ? (
              <option value="">
                Loading roles...
              </option>
            ) : (
              <>
                <option value="">
                  Select Role
                </option>

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

        <div className="text-sm text-gray-500">
          {isEditing
            ? "You are currently editing permissions."
            : "Permissions are currently read-only."}
        </div>

      </div>
    </div>
  );
};

export default RoleSelector;