import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubcontractorLists, getSubcontractorUsersById } from "../../actions/subContractorAction";

const AddSubcontractorUserModal = ({
  isOpen,
  onClose,
  onSave,
  parentId,   // 🔥 generic
  parentKey = "work_order_id", // 🔥 default
}) => {
  const dispatch = useDispatch();

  const subcontractors = useSelector(
    (state) => state.subcontractor.subcontractors
  );

  const users = useSelector(
    (state) => state.subcontractor.subcontractorUsers
  );

  const [selectedSub, setSelectedSub] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    dispatch(getSubcontractorLists({ contractor_state_active: true }));
  }, []);

  useEffect(() => {
    if (selectedSub) {
      dispatch(getSubcontractorUsersById(selectedSub));
    }
  }, [selectedSub]);

  const handleUserSelect = (user) => {
    setSelectedUsers([{
      subcontractor_user_contact: user.mobile,
      subcontractor_user_name: user.first_name,
      s_user_id: user?.s_user_id,
    }]);
  };

  const handleSave = () => {
    const selectedCompany = subcontractors.find(
      (sub) => sub.subcontractor_id === selectedSub
    );

    const payload = {
    [parentKey]: parentId,   // 🔥 dynamic key
    subcontractor_company: selectedCompany?.subcontractor_name,
    subcontractor_id: selectedSub,
    users: selectedUsers,
    };

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 w-[500px] rounded">

        <h2 className="text-lg mb-4">
          Assign Subcontractor User
        </h2>

        {/* Select Subcontractor */}
        <select
          className="border p-2 w-full mb-3"
          onChange={(e) => setSelectedSub(e.target.value)}
        >
          <option value="">Select Subcontractor</option>
          {subcontractors?.map((sub) => (
            <option
              key={sub.subcontractor_id}
              value={sub.subcontractor_id}
            >
              {sub.subcontractor_name}
            </option>
          ))}
        </select>

        {/* Select User */}
        <select
          className="border p-2 w-full mb-3"
          onChange={(e) => {
            const selected = users.find(
              (u) => u.subcontractor_user_id === e.target.value
            );
            handleUserSelect(selected);
          }}
        >
          <option value="">Select User</option>
          {users?.map((user) => (
            <option
              key={user.subcontractor_user_id}
              value={user.subcontractor_user_id}
            >
              {user.first_name} {user.last_name}
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Assign
          </button>

          <button
            className="ml-2 px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddSubcontractorUserModal;