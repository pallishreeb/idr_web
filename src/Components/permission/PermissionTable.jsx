
import React from "react";

const PermissionTable = ({
  module,
  isAdminRole,
  onPermissionChange,
}) => {
  if (!module) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
        <p className="text-sm text-gray-500">
          Select a module to view its permissions.
        </p>
      </div>
    );
  }

  const permissions = module.permission_types || [];

  return (
    <div className="bg-white">
      <div className="divide-y divide-gray-100">
        {permissions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No permission types available for this module.
          </div>
        ) : (
          permissions.map((permission) => (
            <div
              key={permission.perm_type_id}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {permission.type}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {permission.allow
                    ? "Permission allowed"
                    : "Permission not allowed"}
                </p>
              </div>

              <label className="relative inline-flex items-center">
                <input
                  type="checkbox"
                  checked={permission.allow === true}
                  disabled={isAdminRole}
                  onChange={() =>
                    onPermissionChange(
                      permission.perm_type_id
                    )
                  }
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PermissionTable;
