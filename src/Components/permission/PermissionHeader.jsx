import React from "react";
import {
  MdVerifiedUser,
  MdEdit,
  MdClose,
  MdSave,
} from "react-icons/md";
const PermissionHeader = ({
  isEditing,
  onEdit,
  onCancel,
  onSave,
}) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
          <MdVerifiedUser className="h-6 w-6 text-indigo-600" />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Permission Management
          </h1>

          <p className="text-sm text-gray-500">
            Manage module and action permissions.
          </p>
        </div>
      </div>

      {!isEditing ? (
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <MdEdit size={16} />
          Edit Permissions
        </button>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <MdClose size={16} />
            Cancel
          </button>

          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <MdSave size={16} />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default PermissionHeader;