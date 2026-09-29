import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getMyRolePermissions,
} from "../../actions/permissionAction";

import {
  setPermissions,
  setLoading,
  setError,
  clearPermissions,
} from "../../reducers/permissionReducer";

const PermissionLoader = () => {
  const dispatch = useDispatch();

  const user = useSelector(
    (state) => state.user.user
  );

  useEffect(() => {
    const loadPermissions = async () => {
      /*
       * We only need the user to be logged in.
       *
       * The backend determines the user's role from
       * the authenticated request.
       */
      if (!user?.user_id) {
        dispatch(clearPermissions());
        return;
      }

      try {
        dispatch(setLoading(true));

        console.log(
          "Loading permissions for logged-in user..."
        );

        const response =
          await getMyRolePermissions();

        console.log(
          "My role permissions response:",
          response
        );

        /*
         * API response:
         *
         * {
         *   code: "PERM200",
         *   message: "Records",
         *   role: {...},
         *   modules: [...]
         * }
         */

        const permissions =
          response?.modules || [];

        console.log(
          "Final permissions:",
          permissions
        );

        dispatch(
          setPermissions(permissions)
        );
      } catch (error) {
        console.error(
          "Failed to load user permissions:",
          error
        );

        dispatch(clearPermissions());

        dispatch(
          setError(
            error?.response?.data?.message ||
              error?.message ||
              "Failed to load permissions."
          )
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    loadPermissions();
  }, [user?.user_id, dispatch]);

  return null;
};

export default PermissionLoader;