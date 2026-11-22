
import React from "react";

import {
  MdVerifiedUser,
  MdClose,
  MdSave,
} from "react-icons/md";

const PermissionHeader = ({
  onCancel,
  onSave,
  saving,
  hasChanges,
  changedModuleCount,
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

          {hasChanges && (
            <p className="mt-1 text-xs font-medium text-amber-600">
              {changedModuleCount} module(s) have unsaved changes.
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={!hasChanges || saving}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MdClose size={16} />
          Discard Changes
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={!hasChanges || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MdSave size={16} />
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default PermissionHeader;
