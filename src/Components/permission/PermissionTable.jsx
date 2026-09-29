import React from "react";

const PermissionTable = ({
  module,
  isEditing,
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
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">

      {/* MODULE HEADER */}
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <h3 className="text-base font-semibold text-gray-800">
          {module.module_name}
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Manage permissions for this module.
        </p>
      </div>

      {/* PERMISSIONS */}
      <div className="divide-y divide-gray-100">

        {permissions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No permission types available for this module.
          </div>
        ) : (
          permissions.map((permission) => (
            <div
              key={permission.perm_type_id}
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                hover:bg-gray-50
              "
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

              {!isEditing ? (
                <span
                  className={`
                    inline-flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-full
                    px-2
                    text-sm
                    font-semibold
                    ${
                      permission.allow
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }
                  `}
                >
                  {permission.allow ? "✓" : "✕"}
                </span>
              ) : (
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={permission.allow === true}
                    onChange={() =>
                      onPermissionChange(
                        permission.perm_type_id
                      )
                    }
                    className="
                      h-5
                      w-5
                      cursor-pointer
                      rounded
                      border-gray-300
                      text-indigo-600
                      focus:ring-indigo-500
                    "
                  />
                </label>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default PermissionTable;