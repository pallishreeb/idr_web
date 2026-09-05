export const PERMISSION_ACTIONS = [
  {
    key: "view",
    label: "View",
  },
  {
    key: "add",
    label: "Add",
  },
  {
    key: "edit",
    label: "Edit",
  },
  {
    key: "delete",
    label: "Delete",
  },
  {
    key: "reply",
    label: "Reply",
  },
  {
    key: "assign",
    label: "Assign",
  },
  {
    key: "export",
    label: "Export",
  },
];

export const PERMISSION_MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    actions: ["view"],
  },

  {
    key: "clients",
    label: "Clients",
    actions: ["view", "add", "edit", "delete"],
  },

  {
    key: "clientEmployees",
    label: "Client Employees",
    actions: ["view", "add", "edit", "delete"],
  },

  {
    key: "clientLocations",
    label: "Client Locations",
    actions: ["view", "add", "edit", "delete"],
  },

  {
    key: "idrEmployees",
    label: "IDR Employees",
    actions: ["view", "add", "edit", "delete"],
  },

  {
    key: "equipment",
    label: "Equipment",
    actions: ["view", "add", "edit", "delete"],
  },

  {
    key: "inventory",
    label: "Inventory",
    actions: ["view", "add", "edit", "delete"],
  },

  {
    key: "workOrders",
    label: "Work Orders",
    actions: [
      "view",
      "add",
      "edit",
      "delete",
      "assign",
    ],
  },

  {
    key: "serviceTickets",
    label: "Service Tickets",
    actions: [
      "view",
      "add",
      "edit",
      "delete",
      "reply",
      "assign",
    ],
  },

  {
    key: "subcontractors",
    label: "Subcontractors",
    actions: [
      "view",
      "add",
      "edit",
      "delete",
    ],
  },

  {
    key: "rma",
    label: "RMA",
    actions: [
      "view",
      "add",
      "edit",
      "delete",
    ],
  },

  {
    key: "reports",
    label: "Reports",
    actions: [
      "view",
      "export",
    ],
  },

  {
    key: "users",
    label: "Users",
    actions: [
      "view",
      "add",
      "edit",
      "delete",
    ],
  },

  {
    key: "settings",
    label: "Settings",
    actions: [
      "view",
      "edit",
    ],
  },
];