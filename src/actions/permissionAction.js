import axios from "axios";

// Get all available roles
export const getAllRoles = async () => {
  const response = await axios.get("/permission/roles/all");

  return response.data;
};

// Get permissions for a specific role
export const getRolePermissions = async (roleId) => {
  const response = await axios.get(
    `/permission/role/${roleId}`
  );

  return response.data;
};

// Update/apply permissions for a role
export const updateRolePermissions = async (
  userRoleId,
  permissions
) => {
  const response = await axios.patch(
    "/permission/role/update",
    {
      user_role_id: userRoleId,
      permissions,
    }
  );

  return response.data;
};