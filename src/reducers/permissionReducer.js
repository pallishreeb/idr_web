const initialState = {
  selectedRole: "client-employee",
  permissions: [],
  loading: false,
  error: null,
};

const permissionReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "permission/setRole":
      return {
        ...state,
        selectedRole: action.payload,
      };

    case "permission/setPermissions":
      return {
        ...state,
        permissions: action.payload,
      };

    case "permission/setLoading":
      return {
        ...state,
        loading: action.payload,
      };

    case "permission/setError":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default permissionReducer;