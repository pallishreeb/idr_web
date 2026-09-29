// src/constants/permissionConstants.js

export const PERMISSION_MODULES = {
  CLIENTS: "Clients",
  CLIENT_EMPLOYEES: "Client Employees",
  CLIENT_LOCATIONS: "Client Locations",
  CLIENT_EQUIPMENT: "Client Equipment",
  CLIENT_LICENSING: "Client Licensing",

  SERVICE_AGREEMENTS: "Service Agreements",
  SERVICE_REQUESTS: "Service Requests",
  SERVICE_TICKETS: "Service Tickets",

  WORK_ORDERS: "Work Orders",

  INVENTORY: "Inventory",
  INVENTORY_LOCATIONS: "Inventory Locations",

  IDR_EQUIPMENT: "IDR Equipment",
  IDR_EMPLOYEES: "IDR Employees",

  RMAS: "RMAs",

  SUBCONTRACTORS: "Subcontractors",
  SUBCONTRACTOR_USERS: "Subcontractor Users",

  REPORTS: "Reports",

};

export const PERMISSION_TYPES = {
  // --------------------------------
  // Basic CRUD
  // --------------------------------
  CREATE: "Create",
  READ: "Read",
  UPDATE: "Update",
  DELETE: "Delete",

  // --------------------------------
  // Attachments
  // --------------------------------
  ADD_ATTACHMENT: "Add Attachment",
  DELETE_ATTACHMENT: "Delete Attachment",

  // --------------------------------
  // Notes
  // --------------------------------
  ADD_NOTE: "Add Note",
  UPDATE_NOTE: "Update Note",
  DELETE_NOTE: "Delete Note",

  // Keep these aliases if existing components
  // are already using them.
  ADD_COMMENT: "Add Note",
  EDIT_COMMENT: "Update Note",
  DELETE_COMMENT: "Delete Note",

  // --------------------------------
  // Service Ticket / Device History
  // --------------------------------
  ADD_DEVICE_HISTORY: "Add Device History",

  // --------------------------------
  // Signature
  // --------------------------------
  ADD_SIGNATURE: "Add Signature",

  // --------------------------------
  // Technician / Manager
  // --------------------------------
  ASSIGN_TECHNICIAN_MANAGER:
    "Assign Technician & Manager",

  REMOVE_TECHNICIAN_MANAGER:
    "Remove Technician & Manager",

  // --------------------------------
  // Subcontractor
  // --------------------------------
  ASSIGN_SUBCONTRACTOR_USER:
    "Assign Subcontractor User",

  DELETE_SUBCONTRACTOR_USER:
    "Delete Subcontractor User",

  CHANGE_SUBCONTRACTOR_NOTE_STATUS:
    "Change Subcontractor Note Status",
   
  CHANGE_SUBCONTRACTOR_STATUS:
  "Change Subcontractor Status",

  UPLOAD_DOCUMENT:
    "Upload Document",    

  // --------------------------------
  // Inventory
  // --------------------------------
  RETURN_INVENTORY: "Return Inventory",

  // --------------------------------
  // PDF
  // --------------------------------
  DOWNLOAD_PDF: "Download PDF",

  // --------------------------------
  // Device
  // --------------------------------
  LINK_DEVICE: "Link Device",
  ADD_EQUIPMENT:"Add Equipment",
  // --------------------------------
  // Filters
  // --------------------------------
  VIEW_CLIENT_FILTER: "View Client Filter",
  VIEW_LOCATION_FILTER: "View Location Filter",
  VIEW_MANUFACTURER_FILTER: "View Manufacturer Filter",

  VIEW_BILLED_FILTER: "View Billed Filter",
  VIEW_DATE_FILTER: "View Date Filter",
  VIEW_PROJECT_MANAGER_FILTER:
    "View Project Manager Filter",
  VIEW_STATUS_FILTER: "View Status Filter",
  VIEW_SUBCONTRACTOR_FILTER:
    "View Subcontractor Filter",
  VIEW_TECHNICIAN_FILTER:
    "View Technician Filter",
  VIEW_EQUIPMENT_FILTER:"View Equipment Filter",

  // --------------------------------
  // Financial
  // --------------------------------
  VIEW_IDR_COST: "View IDR Cost",
  VIEW_SALE_PRICE: "View Sale Price",
  VIEW_TOTAL_SALES_COST:
    "View Total Sales Cost",
  VIEW_TOTAL_SALE_PRICE:
    "View Total Sale Price",

CAN_DUPLICATE:"Can Duplicate",
ASSIGN: "Assign",
TRANSFER: "Transfer",
VIEW_SUBCONTRACTOR:"View Subcontractor",

READ_IDR_EMP:"View IDR Employee",
ASSIGN_WORK_ORDER:"Assign Work Order",
ASSIGN_IDR_EMPLOYEE:"Assign Idr Employee",
UPDATE_PASSWORD:"Update Password",
DECOMMISSION:"Decommission"
};