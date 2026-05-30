/** @format */

import React, {
  useState,
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  MdGroups,
  MdPerson,
  MdBusiness,
  MdClose,
  MdAssignmentInd,
  MdCheckCircle,
} from "react-icons/md";

import {
  getSubcontractorLists,
  getSubcontractorUsersById,
} from "../../actions/subContractorAction";

const AddSubcontractorUserModal =
  ({
    isOpen,
    onClose,
    onSave,
    parentId,
    parentKey = "work_order_id",
  }) => {
    const dispatch =
      useDispatch();

    const subcontractors =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .subcontractors,
      );

    const users =
      useSelector(
        (
          state,
        ) =>
          state
            .subcontractor
            .subcontractorUsers,
      );

    const [
      selectedSub,
      setSelectedSub,
    ] =
      useState("");

    const [
      selectedUsers,
      setSelectedUsers,
    ] =
      useState([]);

    /* ===========================
       LOAD SUBCONTRACTORS
    =========================== */

    useEffect(() => {
      dispatch(
        getSubcontractorLists(
          {
            contractor_state_active:
              true,
          },
        ),
      );
    }, []);

    /* ===========================
       LOAD USERS
    =========================== */

    useEffect(() => {
      if (
        selectedSub
      ) {
        dispatch(
          getSubcontractorUsersById(
            selectedSub,
          ),
        );
      }
    }, [
      selectedSub,
    ]);

    /* ===========================
       USER SELECT
    =========================== */

    const handleUserSelect =
      (user) => {
        if (
          !user
        )
          return;

        setSelectedUsers(
          [
            {
              subcontractor_user_contact:
                user.mobile,

              subcontractor_user_name:
                user.first_name,

              s_user_id:
                user?.s_user_id,
            },
          ],
        );
      };

    /* ===========================
       SAVE
    =========================== */

    const handleSave =
      () => {
        const selectedCompany =
          subcontractors.find(
            (
              sub,
            ) =>
              sub.subcontractor_id ===
              selectedSub,
          );

        const payload =
          {
            [parentKey]:
              parentId,

            subcontractor_company:
              selectedCompany?.subcontractor_name,

            subcontractor_id:
              selectedSub,

            users:
              selectedUsers,
          };

        onSave(
          payload,
        );
      };

    if (
      !isOpen
    )
      return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        {/* MODAL */}
        <div className="w-full max-w-xl bg-white rounded-[30px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* TOP BAR */}
          <div className="h-2 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

          <div className="p-6 md:p-7">
            {/* HEADER */}
            <div className="flex items-start justify-between gap-4 mb-7">
              <div className="flex items-center gap-3">
                {/* ICON */}
                <div className="w-11 h-11 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                  <MdAssignmentInd className="text-2xl" />
                </div>

                <div>
                  {/* SMALL TITLE */}
                  <h2 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                    Assign
                    Subcontractor
                    User
                  </h2>

                  <p className="text-xs text-gray-500 mt-0.5">
                    Assign a
                    subcontractor
                    and user
                  </p>
                </div>
              </div>

              {/* CLOSE */}
              <button
                onClick={
                  onClose
                }
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all duration-300"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-6">
              {/* SUBCONTRACTOR */}
              <div>
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Select
                  Subcontractor
                </label>

                <div className="relative">
                  <MdBusiness className="absolute top-4 left-4 text-indigo-400 text-xl" />

                  <select
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                    value={
                      selectedSub
                    }
                    onChange={(
                      e,
                    ) =>
                      setSelectedSub(
                        e
                          .target
                          .value,
                      )
                    }
                  >
                    <option value="">
                      Select
                      Subcontractor
                    </option>

                    {subcontractors?.map(
                      (
                        sub,
                      ) => (
                        <option
                          key={
                            sub.subcontractor_id
                          }
                          value={
                            sub.subcontractor_id
                          }
                        >
                          {
                            sub.subcontractor_name
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* USER */}
              <div>
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Select User
                </label>

                <div className="relative">
                  <MdPerson className="absolute top-4 left-4 text-indigo-400 text-xl" />

                  <select
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300"
                    onChange={(
                      e,
                    ) => {
                      const selected =
                        users.find(
                          (
                            u,
                          ) =>
                            u.subcontractor_user_id ===
                            e
                              .target
                              .value,
                        );

                      handleUserSelect(
                        selected,
                      );
                    }}
                  >
                    <option value="">
                      Select User
                    </option>

                    {users?.map(
                      (
                        user,
                      ) => (
                        <option
                          key={
                            user.subcontractor_user_id
                          }
                          value={
                            user.subcontractor_user_id
                          }
                        >
                          {
                            user.first_name
                          }{" "}
                          {
                            user.last_name
                          }
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* SELECTED USER CARD */}
              {selectedUsers.length >
                0 && (
                <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center">
                      <MdGroups className="text-indigo-500 text-xl" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <MdCheckCircle className="text-green-500 text-lg" />

                        <p className="text-sm font-semibold text-[#1E1B4B]">
                          User
                          Selected
                        </p>
                      </div>

                      <p className="text-sm text-gray-700">
                        {
                          selectedUsers[0]
                            ?.subcontractor_user_name
                        }
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {
                          selectedUsers[0]
                            ?.subcontractor_user_contact
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  className="px-5 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all duration-300"
                  onClick={
                    onClose
                  }
                >
                  Cancel
                </button>

                <button
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                  onClick={
                    handleSave
                  }
                >
                  <MdAssignmentInd className="text-lg" />
                  Assign User
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default AddSubcontractorUserModal;