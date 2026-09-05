import React from "react";

const PermissionTable = ({
  modules,
  isEditing,
  onPermissionChange,
}) => {
  // Get all unique permission types from API response
const permissionTypes = [
  ...new Set(
    modules?.flatMap((module) =>
      (module.permission_types || []).map(
        (permission) => permission.type
      )
    )
  ),
];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">

          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">

              <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                Module
              </th>

              {permissionTypes.map((type) => (
                <th
                  key={type}
                  className="px-4 py-4 text-center text-sm font-semibold text-gray-700"
                >
                  {type}
                </th>
              ))}

            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {modules.map((module) => (

              <tr
                key={module.perm_module_id}
                className="hover:bg-gray-50"
              >

                <td className="px-5 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {module.module_name}
                  </span>
                </td>

                {permissionTypes.map((type) => {

                  const permission =
                    module.permission_types?.find(
                      (item) => item.type === type
                    );

                  if (!permission) {
                    return (
                      <td
                        key={type}
                        className="px-4 py-4 text-center text-gray-300"
                      >
                        —
                      </td>
                    );
                  }

                  return (
                    <td
                      key={permission.perm_type_id}
                      className="px-4 py-4 text-center"
                    >
                     {!isEditing ? (
                             <span
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                              permission.allow
                                ? "bg-green-100 text-green-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {permission.allow ? "✓" : "✕"}
                          </span>
                        ) : (
                          <input
                            type="checkbox"
                            checked={permission.allow}
                            onChange={() =>
                              onPermissionChange(
                                module.perm_module_id,
                                permission.perm_type_id
                              )
                            }
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        )}
                    </td>
                  );

                })}

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PermissionTable;