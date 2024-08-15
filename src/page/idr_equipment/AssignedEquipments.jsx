import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { BsCheckCircle } from "react-icons/bs";
// import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
// import { BiTransferAlt } from "react-icons/bi";
import {
  getAssignedEquipments,
  getReturnedRequestEquipments,
  confirmReturnedEquipment
} from "../../actions/idrEquipmentAction";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const AssignedEquipments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State for filters and search
  const [selectedOption, setSelectedOption] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  const { user_type } = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.idrequipment.loading);
  const equipmentData = useSelector((state) => state.idrequipment.equipments);


  useEffect(() => {
    if (selectedOption === "returnRequestEquipments") {
      dispatch(getReturnedRequestEquipments());
    }else{
      dispatch(getAssignedEquipments());
    }
  }, [dispatch, selectedOption]);

  const handleConfirm = (equipmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to Confirm this return request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, confirm it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(confirmReturnedEquipment(equipmentId))
          .then(() => {
            dispatch(getAssignedEquipments()); // Refresh the list after deletion
          })
          .catch((error) => {
            console.log(error);
            toast.error("Failed to Confirm the Equipment.");
          });
      }
    });
  };

  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    // dispatch(getInventories({ ...filters, sortBy: key, orderBy: direction }));
    if (selectedOption === "returnRequestEquipments") {
      dispatch(getReturnedRequestEquipments({ sortBy: key, orderBy: direction }));
    }else{
      dispatch(getAssignedEquipments({ sortBy: key, orderBy: direction }));
    }
  };

  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }
    return "↕";
  };

  const truncateText = (text, maxLength) => {
    if (text?.length <= maxLength) return text;
    return text?.slice(0, maxLength) + "...";
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">{selectedOption === "returnRequestEquipments" ? "Return Equipment Requests"  : "Assigned IDR Equipment"} </h1>
            <div className="flex gap-2">
            <div className="flex flex-col gap-2">
                  {/* <label className="font-normal text-sm">
                    Filter by location
                  </label> */}
                  <select
                    name="equipmentFilters"
                    className="px-3 border border-gray-200 h-10 rounded w-50"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option value="assignedEquipments" >Assigned Equipments</option>
                    <option value="returnRequestEquipments">Return Equipments</option>
                  
                  </select>
                </div>
              <Link to="/add-company-equipment">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                  Add Inventory
                </button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">

            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("location_name")}
                  >
                    Location{" "}
                    <span className="ml-2">{getSortSymbol("location")}</span>
                  </th>
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("assigned_to")}
                  >
                    Assigned To{" "}
                    <span className="ml-2">{getSortSymbol("assigned_to")}</span>
                  </th>
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("serial_number")}
                  >
                    Serial Number{" "}
                    <span className="ml-2">
                      {getSortSymbol("serial_number")}
                    </span>
                  </th>
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("device_type")}
                  >
                    Device Type{" "}
                    <span className="ml-2">{getSortSymbol("device_type")}</span>
                  </th>
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("make")}
                  >
                    Make <span className="ml-2">{getSortSymbol("make")}</span>
                  </th>
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("model")}
                  >
                    Model <span className="ml-2">{getSortSymbol("model")}</span>
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

            {/* show no data if length is 0 */}
            {loading ? (
                  <tr>
                  <td colSpan="5" className="text-center">
                  <p className="text-center">Loading Equipments...</p>
                  </td>
                  </tr>
              ) : (
                <>

                {equipmentData?.data?.length === 0 ? (
                 <tr>
                 <td colSpan="6" className="text-center">
                 <p className="text-center">No Record Found</p>
                 </td>
              </tr>
                ) : (
                  <>
                    {equipmentData?.data?.map((equipment, index) => (
                      <tr key={index} className="text-left">
                        <td className="border text-sm px-1 py-3">
                          {equipment.equipments?.location_name}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment.equipments?.assigned_to ? equipment.equipments.assigned_to : "NA"}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment.equipments?.serial_number}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment.equipments?.device_type}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment.equipments?.make}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment.equipments?.model}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {" "}
                          {truncateText(equipment.equipments?.description, 30)}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          <div className="flex gap-2">
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <BiSolidEditAlt
                                onClick={() =>
                                  navigate(
                                    `/edit-company-equipment/${equipment.equipments?.equipment_id}`
                                  )
                                }
                              />
                            </div>
                            {/* <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <BiTransferAlt
                                onClick={() =>
                                  navigate(
                                    `/transfer-company-equipment/${equipment.equipments?.equipment_id}`
                                  )
                                }
                              />
                            </div> */}
                            {(user_type === "Admin" && selectedOption === "returnRequestEquipments" ) && (
                              <div className="p-[4px] bg-gray-100 cursor-pointer">
                                <BsCheckCircle
                                  onClick={() =>
                                    handleConfirm(equipment?.assign_equip_id)
                                  }
                                />
                              </div>
                            )}
                            {/* {user_type === "Admin" && (
                              <div className="p-[4px] bg-gray-100 cursor-pointer">
                                <AiFillDelete
                                  onClick={() =>
                                    handleDelete(equipment.equipments.equipment_id)
                                  }
                                />
                              </div>
                            )} */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
                </> )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};




export default AssignedEquipments;
