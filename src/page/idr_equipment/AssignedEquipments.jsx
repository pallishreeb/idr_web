import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedEquipments } from "../../actions/assignedEquipmentsAction"; // Action to fetch assigned equipments
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const AssignedEquipments = () => {
  const dispatch = useDispatch();

  // State for filters
  const [statusFilter, setStatusFilter] = useState("");
  const [isReturn, setIsReturn] = useState(false);

  const assignedEquipments = useSelector(
    (state) => state.assignedEquipments.data
  );

  useEffect(() => {
    const fetchAssignedEquipments = () => {
      const filtersWithStatus = { status: statusFilter, isReturn: isReturn };
      dispatch(getAssignedEquipments(filtersWithStatus)); // Fetch data based on selected filters
    };

    fetchAssignedEquipments();
  }, [dispatch, statusFilter, isReturn]);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleReturnFilter = () => {
    setIsReturn(true); // Set return filter
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <h1 className="font-bold text-lg">Assigned Equipments</h1>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-normal text-sm">Filter by Status</label>
                <select
                  name="statusFilter"
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="px-3 border border-gray-200 h-10 rounded w-40"
                >
                  <option value="">Select Status</option>
                  <option value="accepted">Accepted</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-sm">&nbsp;</label>
                <button
                  onClick={handleReturnFilter}
                  className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
                >
                  Filter by Returned
                </button>
              </div>
            </div>

            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Location
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Assigned To
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Serial Number
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Device Type
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Make
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Model
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Description
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignedEquipments?.map((equipment, index) => (
                  <tr key={index} className="text-left">
                    <td className="border text-sm px-1 py-3">
                      {equipment.location_name}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      {equipment.assigned_to || "NA"}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      {equipment.serial_number}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      {equipment.device_type}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      {equipment.make}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      {equipment.model}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      {equipment.description}
                    </td>
                    <td className="border text-sm px-1 py-3">
                      <button className="bg-indigo-600 text-white px-2 py-1 rounded">
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignedEquipments;
