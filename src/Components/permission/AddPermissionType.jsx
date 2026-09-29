import React, { useState } from "react";
import { toast } from "react-toastify";

import { addPermissionType } from "../../actions/permissionAction";

const AddPermissionType = ({
  module,
  onPermissionAdded,
  disabled = false,
}) => {
  const [permissionType, setPermissionType] =
    useState("");

  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    const value = permissionType.trim();

    if (!value) {
      toast.error(
        "Please enter a permission type."
      );
      return;
    }

    if (!module?.perm_module_id) {
      toast.error(
        "Please select a module first."
      );
      return;
    }

    try {
      setSaving(true);

      await addPermissionType(
        module.perm_module_id,
        [value]
      );

      toast.success(
        "Permission type added successfully."
      );

      setPermissionType("");

      if (onPermissionAdded) {
        await onPermissionAdded();
      }
    } catch (error) {
      console.error(
        "Error adding permission type:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Failed to add permission type."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!module) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">
          Add Permission Type
        </h3>

        <p className="mt-1 text-xs text-gray-500">
          Add a new permission type to{" "}
          {module.module_name}.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={permissionType}
          disabled={disabled || saving}
          onChange={(e) =>
            setPermissionType(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAdd();
            }
          }}
          placeholder="e.g. Approve RMA"
          className="
            flex-1
            rounded-lg
            border
            border-gray-300
            px-3
            py-2.5
            text-sm
            outline-none
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-100
            disabled:bg-gray-100
          "
        />

        <button
          type="button"
          disabled={
            disabled ||
            saving ||
            !permissionType.trim()
          }
          onClick={handleAdd}
          className="
            rounded-lg
            bg-indigo-600
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-indigo-700
            disabled:cursor-not-allowed
            disabled:bg-gray-300
          "
        >
          {saving
            ? "Adding..."
            : "Add Permission"}
        </button>
      </div>
    </div>
  );
};

export default AddPermissionType;