import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getRolePermissions } from "../../actions/permissionAction";

import {
  setPermissions,
  setLoading,
  setError,
  clearPermissions,
} from "../../reducers/permissionReducer";

const PermissionLoader = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const loadPermissions = async () => {
      const roleId = user?.user_role_id;

    //   console.log("Permission role ID:", roleId);

      if (!roleId) {
        dispatch(clearPermissions());
        return;
      }

      try {
        dispatch(setLoading(true));

        const response = await getRolePermissions(roleId);

        // console.log("Permission API response:", response);


        dispatch(setPermissions(response?.modules || []));
      } catch (error) {
        console.error(
          "Failed to load user permissions:",
          error
        );

        dispatch(
          setError(
            error?.response?.data?.message ||
              "Failed to load permissions."
          )
        );
      }
    };

    loadPermissions();
  }, [user?.user_role_id, dispatch]);

  return null;
};

export default PermissionLoader;