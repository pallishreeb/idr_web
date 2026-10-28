import React from "react";

const RoleSelector = ({
  roles,
  selectedRole,
  setSelectedRole,
  isEditing,
  loading,
}) => {
  const roleOrder = [
    "Admin",
    "Subadmin",
    "IDR Employee",
    "Laborer",
    "Client Admin",
    "Client Location Admin",
    "Client Employee User",
    "Subcontractor",
    "Subcontractor_User",
  ];

  const sortedRoles = [...(roles || [])].sort((a, b) => {
    const indexA = roleOrder.indexOf(a.role_name);
    const indexB = roleOrder.indexOf(b.role_name);

    return (
      (indexA === -1 ? roleOrder.length : indexA) -
      (indexB === -1 ? roleOrder.length : indexB)
    );
  });

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
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

            {sortedRoles.map((role) => (
              <option
                key={role.user_role_id}
                value={role.user_role_id}
              >
                {role.display_name}
              </option>
            ))}
          </>
        )}
      </select>

      <div className="mt-4 text-sm text-gray-500">
        {isEditing
          ? "You are currently editing permissions."
          : "Select a role to manage its module permissions."}
      </div>
    </div>
  );
};

export default RoleSelector;