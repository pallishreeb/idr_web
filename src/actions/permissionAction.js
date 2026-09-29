import axios from "../axios-config";

// Get all available roles
export const getAllRoles = async () => {
  const response = await axios.get(
    "/permission/roles/all"
  );

  return response.data;
};

// Get permissions for a specific role + module
export const getRolePermissions = async (
  userRoleId,
  moduleId
) => {
  try {
    const response = await axios.post(
      "/permission/role/by_module",
      {
        user_role_id: userRoleId,
        module_id: moduleId,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching role/module permissions:",
      error
    );

    throw error;
  }
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

// Add new permission types to a module
export const addPermissionType = async (
  moduleId,
  types
) => {
  try {
    const response = await axios.patch(
      "/permission/add_type",
      {
        perm_module_id: moduleId,
        types,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error adding permission type:",
      error
    );

    throw error;
  }
};

// Get all permissions for logged-in user's role
export const getRolePermissionsByRoleId = async (roleId) => {
  try {
    const response = await axios.get(
      `/permission/role/${roleId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching role permissions:",
      error
    );

    throw error;
  }
};

/*
 * Get permissions for the currently logged-in user's role.
 *
 * Backend determines the role from the authenticated user.
 */
export const getMyRolePermissions = async () => {
  try {
    const response = await axios.get(
      "/permission/mobile/by_role"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching current user permissions:",
      error
    );

    throw error;
  }
};