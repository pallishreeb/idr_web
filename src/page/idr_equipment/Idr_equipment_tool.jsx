import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BiTransferAlt } from "react-icons/bi";
import { getLocationInventory } from "../../actions/locationsInventoryAction";
import {
  getIdrEquipments,
  deleteInventory,
} from "../../actions/idrEquipmentAction";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const IdrEquipment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State for filters and search
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    model: "",
    device_type: "",
    signout: "", //signout
  });
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations
  );
  const { user_type } = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.idrequipment.loading);
  const equipmentData = useSelector((state) => state.idrequipment.equipments);

  useEffect(() => {
    dispatch(getLocationInventory()); // Fetch locations if needed
  }, [dispatch]);

  useEffect(() => {
    dispatch(getIdrEquipments(filters));
  }, [dispatch,filters]);

  const handleSearch = () => {
    const newFilters = {
      ...filters,
      search: searchQuery,
      device_type: deviceTypeFilter,
      model: modelFilter,
    };
    setFilters(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      location: "",
      model: "",
      device_type: "",
      signout: "",
    };
    setFilters(resetFilters);
    setDeviceTypeFilter("");
    setModelFilter("");
    setSearchQuery("");
    dispatch(getIdrEquipments(resetFilters));
  };

  const handleDelete = (equipmentId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Equipment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInventory(equipmentId))
          .then(() => {
            dispatch(getIdrEquipments(filters)); // Refresh the list after deletion
          })
          .catch((error) => {
            console.log(error);
            toast.error("Failed to delete the Equipment.");
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
    dispatch(getIdrEquipments({ ...filters, sortBy: key, orderBy: direction }));
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
  const convertDateFormat = (dateString) => {
    // Split the date string into its components
    const [year, month, day] = dateString.split('-');
    // Return the date in the desired format
    return `${month}/${day}/${year}`;
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">IDR Equipment</h1>
            <div className="flex gap-2">
              <Link to="/add-company-equipment">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                  Add Inventory
                </button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 w-[70%]">
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter by location
                  </label>
                  <select
                    name="locationFilter"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Locations</option>
                    {locationsInventory?.map((ele) => (
                      <option
                        key={ele.inventory_location_id}
                        value={ele.location}
                      >
                        {ele.location}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter by Signed Out
                  </label>
                  <input
                    type="date"
                    name="signedOutFilter"
                    value={filters.signout}
                    onChange={(e) =>
                      setFilters({ ...filters, signout: convertDateFormat(e.target.value) })
                    }
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  />
                </div> */}
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter by device type
                  </label>
                  <input
                    type="text"
                    name="deviceTypeFilter"
                    value={deviceTypeFilter}
                    onChange={(e) => setDeviceTypeFilter(e.target.value)}
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                    placeholder="Search Device..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Filter by model</label>
                  <input
                    type="text"
                    name="modelFilter"
                    value={modelFilter}
                    onChange={(e) => setModelFilter(e.target.value)}
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                    placeholder="Search Model..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Search list</label>
                  <input
                    type="text"
                    name="searchQuery"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                    placeholder="Search..."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">&nbsp;</label>
                  <button
                    onClick={handleSearch}
                    className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
                  >
                    Search
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">&nbsp;</label>
                  <button
                    onClick={handleReset}
                    className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
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
                 <td colSpan="6" className="text-center">
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
                          {equipment?.location_name}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment?.assigned_to ? equipment?.assigned_to : "NA"}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment?.serial_number}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment?.device_type}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment?.make}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {equipment?.model}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          {" "}
                          {truncateText(equipment?.description, 30)}
                        </td>
                        <td className="border text-sm px-1 py-3">
                          <div className="flex gap-2">
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <BiSolidEditAlt
                                onClick={() =>
                                  navigate(
                                    `/edit-company-equipment/${equipment?.equipment_id}`
                                  )
                                }
                              />
                            </div>
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <BiTransferAlt
                                onClick={() =>
                                  navigate(
                                    `/transfer-company-equipment/${equipment?.equipment_id}`
                                  )
                                }
                              />
                            </div>
                            {user_type === "Admin" && (
                              <div className="p-[4px] bg-gray-100 cursor-pointer">
                                <AiFillDelete
                                  onClick={() =>
                                    handleDelete(equipment?.equipment_id)
                                  }
                                />
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                )}
                </>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdrEquipment;
