// src/hooks/useModulePermissions.js

import usePermission from "./usePermission";

import {
  PERMISSION_TYPES,
} from "../constants/permissionConstants";

const useModulePermissions = (moduleName) => {
  const { can } = usePermission();

  return {
    // --------------------------------
    // Basic CRUD
    // --------------------------------

    canRead: can(
      moduleName,
      PERMISSION_TYPES.READ
    ),

    canCreate: can(
      moduleName,
      PERMISSION_TYPES.CREATE
    ),

    canUpdate: can(
      moduleName,
      PERMISSION_TYPES.UPDATE
    ),

    canDelete: can(
      moduleName,
      PERMISSION_TYPES.DELETE
    ),
    
    // --------------------------------
    // Attachments
    // --------------------------------

    canAddAttachment: can(
      moduleName,
      PERMISSION_TYPES.ADD_ATTACHMENT
    ),

    canDeleteAttachment: can(
      moduleName,
      PERMISSION_TYPES.DELETE_ATTACHMENT
    ),

    // --------------------------------
    // Notes
    // --------------------------------

    canAddNote: can(
      moduleName,
      PERMISSION_TYPES.ADD_NOTE
    ),

    canUpdateNote: can(
      moduleName,
      PERMISSION_TYPES.UPDATE_NOTE
    ),

    canDeleteNote: can(
      moduleName,
      PERMISSION_TYPES.DELETE_NOTE
    ),

    // Backward-compatible names
    canAddComment: can(
      moduleName,
      PERMISSION_TYPES.ADD_COMMENT
    ),

    canEditComment: can(
      moduleName,
      PERMISSION_TYPES.EDIT_COMMENT
    ),

    canDeleteComment: can(
      moduleName,
      PERMISSION_TYPES.DELETE_COMMENT
    ),

    // --------------------------------
    // Device History
    // --------------------------------

    canAddDeviceHistory: can(
      moduleName,
      PERMISSION_TYPES.ADD_DEVICE_HISTORY
    ),

    // --------------------------------
    // Signature
    // --------------------------------

    canAddSignature: can(
      moduleName,
      PERMISSION_TYPES.ADD_SIGNATURE
    ),

    // --------------------------------
    // Technician / Manager
    // --------------------------------

    canAssignTechnicianManager: can(
      moduleName,
      PERMISSION_TYPES.ASSIGN_TECHNICIAN_MANAGER
    ),

    canRemoveTechnicianManager: can(
      moduleName,
      PERMISSION_TYPES.REMOVE_TECHNICIAN_MANAGER
    ),

    // --------------------------------
    // Subcontractor
    // --------------------------------

    canAssignSubcontractorUser: can(
      moduleName,
      PERMISSION_TYPES.ASSIGN_SUBCONTRACTOR_USER
    ),

    canDeleteSubcontractorUser: can(
      moduleName,
      PERMISSION_TYPES.DELETE_SUBCONTRACTOR_USER
    ),

    canChangeSubcontractorNoteStatus: can(
      moduleName,
      PERMISSION_TYPES.CHANGE_SUBCONTRACTOR_NOTE_STATUS
    ),
    canChangeSubcontractorStatus: can(
      moduleName,
      PERMISSION_TYPES.CHANGE_SUBCONTRACTOR_STATUS
    ),

    canUploadDocument: can(
      moduleName,
      PERMISSION_TYPES.UPLOAD_DOCUMENT
    ),
    // --------------------------------
    // Inventory
    // --------------------------------

    canReturnInventory: can(
      moduleName,
      PERMISSION_TYPES.RETURN_INVENTORY
    ),

    // --------------------------------
    // PDF
    // --------------------------------

    canDownloadPDF: can(
      moduleName,
      PERMISSION_TYPES.DOWNLOAD_PDF
    ),

    // --------------------------------
    // Device
    // --------------------------------

    canLinkDevice: can(
      moduleName,
      PERMISSION_TYPES.LINK_DEVICE
    ),
    canAddEquipment: can(moduleName,PERMISSION_TYPES.ADD_EQUIPMENT),
    // canViewEquipment,

    // --------------------------------
    // Filters
    // --------------------------------

    canViewClientFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_CLIENT_FILTER
    ),

    canViewLocationFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_LOCATION_FILTER
    ),

    canViewManufacturerFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_MANUFACTURER_FILTER
    ),

    canViewBilledFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_BILLED_FILTER
    ),

    canViewDateFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_DATE_FILTER
    ),

    canViewProjectManagerFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_PROJECT_MANAGER_FILTER
    ),

    canViewStatusFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_STATUS_FILTER
    ),

    canViewSubcontractorFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_SUBCONTRACTOR_FILTER
    ),

    canViewTechnicianFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_TECHNICIAN_FILTER
    ),
     canViewEquipmentFilter: can(
      moduleName,
      PERMISSION_TYPES.VIEW_EQUIPMENT_FILTER
    ),
    // --------------------------------
    // Financial
    // --------------------------------

    canViewIdrCost: can(
      moduleName,
      PERMISSION_TYPES.VIEW_IDR_COST
    ),

    canViewSalePrice: can(
      moduleName,
      PERMISSION_TYPES.VIEW_SALE_PRICE
    ),

    canViewTotalSalesCost: can(
      moduleName,
      PERMISSION_TYPES.VIEW_TOTAL_SALES_COST
    ),

    canViewTotalSalePrice: can(
      moduleName,
      PERMISSION_TYPES.VIEW_TOTAL_SALE_PRICE
    ),
    canDuplicate :can(
       moduleName,
      PERMISSION_TYPES.CAN_DUPLICATE
    ),
    canAssign: can(moduleName, PERMISSION_TYPES.ASSIGN),

    canTransfer: can(moduleName, PERMISSION_TYPES.TRANSFER),
    canViewSubcontractor:can(moduleName,PERMISSION_TYPES.VIEW_SUBCONTRACTOR),
    canReadIDREmp:can(moduleName,PERMISSION_TYPES.READ_IDR_EMP),
    canUpdatePassword:can(moduleName,PERMISSION_TYPES.UPDATE_PASSWORD),
    canDecommission:can(moduleName,PERMISSION_TYPES.DECOMMISSION)


  };
};

export default useModulePermissions;