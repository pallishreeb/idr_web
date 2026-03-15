import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import AddSubcontractorUserModal from "./AddSubcontractorUserModal";

const ShowSubcontractorUsers = ({
  subcontractorAssignees,
  parentId,
  assignAction,
  deleteAction,
  refreshAction,
  parentKey,
  idKey,
  title = "Subcontractor Users",
}) => {
  const dispatch = useDispatch();
  const { user_type } = useSelector((state) => state.user.user);
  const { access, technicianAccess } = useSelector((state) => state.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAdd = (payload) => {
    dispatch(assignAction(payload)).then((res) => {
      if (res?.code === "WO201" || res?.code === "ST201") {
        toast.success("Subcontractor users assigned");
        dispatch(refreshAction(parentId));
        setIsModalOpen(false);
      }
    });
  };

  const handleDelete = (assignmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Delete this subcontractor user?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAction(assignmentId)).then(() => {
          dispatch(refreshAction(parentId));
        });
      }
    });
  };

  return (
    <div className="flex flex-col mt-6 border py-7 px-5 bg-white gap-6">
      <div className="flex justify-between">
        <h1 className="text-xl">{title}</h1>

        {access.includes(user_type) && (
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded"
            onClick={() => setIsModalOpen(true)}
          >
            Add Subcontractor User
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {subcontractorAssignees?.length === 0 ? (
          <div className="text-gray-500"></div>
        ) : (
          subcontractorAssignees?.map((user) => {
            const assignmentId = user[idKey];
            return (
              <div key={assignmentId} className="border p-4">
                <div className="flex justify-end">
                  {user_type === "Admin" && (
                    <button
                      className="p-[4px] bg-gray-100"
                      onClick={() => handleDelete(assignmentId)}
                    >
                      <AiFillDelete />
                    </button>
                  )}
                </div>

                <div
                  className={`grid ${technicianAccess.includes(user_type) ? "grid-cols-3" : "grid-cols-2"} gap-4`}
                >
                  {technicianAccess.includes(user_type) && (
                    <div>
                      <label>Subcontractor</label>
                      <div className="border p-2 rounded">
                        {user.subcontractor_company || "NA"}
                      </div>
                    </div>
                  )}

                  <div>
                    <label>Name</label>
                    <div className="border p-2 rounded">
                      {user.subcontractor_user_name}
                    </div>
                  </div>

                  <div>
                    <label>Contact</label>
                    <div className="border p-2 rounded">
                      {user.subcontractor_user_contact}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddSubcontractorUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAdd}
        parentId={parentId}
        parentKey={parentKey}
      />
    </div>
  );
};

export default ShowSubcontractorUsers;
