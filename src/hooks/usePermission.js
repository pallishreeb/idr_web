import { useSelector } from "react-redux";

const usePermission = () => {
  const permissions = useSelector(
    (state) => state.permission.permissions
  );

  const can = (moduleName, permissionType) => {
    const module = permissions?.find(
      (item) => item.module_name === moduleName
    );

    if (!module) return false;

    const permission = module.permission_types?.find(
      (item) => item.type === permissionType
    );

    return permission?.allow === true;
  };

  return { can };
};

export default usePermission;