const API_BASE_URL = 'https://idr.ensyncit.com'
const apiConfig = {
    setPassword: '/users/set_password',
    createUser: '/users/create',
    loginUser: '/users/login',
    allUsers: '/users/all_users',
    forgotPassword:'/users/forgot_password',
    updateUser:'/users/update',
    addClient:'/client/add',
    getClients:'/client/all',
    updateClient:'client/update',
    getIndustries:'/industry/all',
    getClientById:'/client',
    deleteClient:'/client',
    addClientEmployee:'/client_emp/add',
    getClientEmployeeById:'/client_emp',
    deleteClientEmployee:'/client_emp',
    getLocationByClient:'/location',
    addLocation:'/location/add',
    deleteLocation:'/location',
    client_emp_by_id:'/client_emp/by_id',
    location_by_id:'/location/by_id',
    updateClientEmp:'/client_emp',
    updateLocation:'/location',
    getIdrEmployees:'/idr_emp/all',
    deleteIdrEmp:'/idr_emp/delete',
    addIdrEmployee:'/idr_emp/create'

  };
  
  export {API_BASE_URL,apiConfig};
  