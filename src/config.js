const API_BASE_URL = 'https://api.portal.idrtechnologysolutions.com'

const apiConfig = {
  setPassword: "/users/set_password",
  createUser: "/users/create",
  loginUser: "/users/login",
  allUsers: "/users/all_users",
  forgotPassword: "/users/forgot_password",
  updateUser: "/users/update",
  addClient: "/client/add",
  getClients: "/client/all",
  updateClient: "client/update",
  getIndustries: "/industry/all",
  getClientById: "/client",
  deleteClient: "/client",
  addClientEmployee: "/client_emp/add",
  getClientEmployeeById: "/client_emp",
  deleteClientEmployee: "/client_emp",
  getLocationByClient: "/location",
  addLocation: "/location/add",
  deleteLocation: "/location",
  client_emp_by_id: "/client_emp/by_id",
  location_by_id: "/location/by_id",
  updateClientEmp: "/client_emp",
  updateLocation: "/location",
  getIdrEmployees: "/idr_emp/all",
  deleteIdrEmp: "/idr_emp/delete",
  addIdrEmployee: "/idr_emp/create",
  updateIdrEmp: "/idr_emp/updateEmp",
  getIdrEmpById: "/idr_emp",
  generateTicket: "/work_order/add",
  addTechnicianToTicket: "/work_order/technician/add",
  addNotesToTicket: "/work_order/note/add",
  getWorkOrderLists: "/work_order/all",
  workOrderbyId: "/work_order/by_id",
  deleteWorkOrder: "/work_order/by_id",
  updateTicket: "/work_order/update_ticket",
  updateTechnician: "/work_order/update_technician",
  updateNotes: "/work_order/update_note",
  getTechniciansByWorkOrder: "/work_order/technician/by_work_order",
  getNotesByWorkOrder: "/work_order/note/by_work_order",
  getWorkOrderByClientId: "/work_order/by_client",
  deleteUser: "/users/delete",
  assignPeople: "/work_order/assignee",
  deleteAssignee: "/work_order/delete/assignee",
  deleteNote: "/work_order/delete/note",
  getInventoryLocation: "/inv_loc/all",
  postInventoryLocation: "/inv_loc/add",
  addInventory: '/inventory/add',
  getInventories: '/inventory/all',
  getInventoryById: '/inventory',
  deleteInventory: '/inventory',
  updateInventory: '/inventory/update',
  inventoryWorkOrderAssign:'/inventory/work_order/assign',
  inventoryTransfer:'/inventory/location/transfer',
  workOrderByClient:'/work_order/by_client',
  deleteInventoryLocation:'/inv_loc',
  techniciansListByWorkorder:'/work_order/technician/by_work_order',
  addEquipment:'/equipment/add',
  editEquipment:'/equipment/update',
  deleteEquipment:'/equipment',
  getEquipments:'/equipment/all',
  getEquimentById:'/equipment',
  transferEquipmentToWorkorder:'/equipment/transfer/work_order',
  transferEquipmentToEmployee:'/equipment/assign',
  equipmentReturnRequestList:'/equipment/list/return',
  confirmReturnedEquipment:'/equipment/confirm/return',
  equipmentAssigned:'/equipment/assigned',
  equipmentAcceptRejectInvitations:'/equipment/accept',
  equipmentInvitationsList:'/equipment/invitations',
  getInventoryReportList:'/reports/inventory/all',
  getInventoryReportById:'/reports/inventory',
  getEquipmentReportList:'/reports/equipment/all',
  getEquipmentReportById:'/reports/equipment',
  returnInventory:'/work_order/return_inventory',
  generateServiceTicket: "/service_ticket/add",
  getServiceTicketLists: "/service_ticket/all",
  deleteServiceTicket: "/service_ticket",
  updateServiceTicket: "/work_order/all",
  assignPeopleToServiceTicket: "/service_ticket/assignee",
  deleteAssigneeFromServiceTicket: "/service_ticket/delete/assignee",
  serviceTicketByClient: "/work_order/update_ticket",
  serviceTicketByID: "/service_ticket",
  addAttachmentToServiceTicket:"/service_ticket/image/add"

};

export { API_BASE_URL, apiConfig };
