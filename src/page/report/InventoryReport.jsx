import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidShow } from "react-icons/bi";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getLocationInventory } from "../../actions/locationsInventoryAction";
import {
  getIdrEquipments,
} from "../../actions/idrEquipmentAction";
import { useDispatch, useSelector } from "react-redux";

// Mock data for demonstration
const mockEquipmentData = {
  data: [
    {
      equipment_id: "1",
      color: "Green",
      size: "SN123456",
      device_type: "Laptop",
      make: "Dell",
      model: "Latitude 5420",
      quantity: "5",
      performedBy: "John",
      createdAt: "01/09/2024",
    },
    {
      equipment_id: "2",
      color: "White",
      size: "SN7891011",
      device_type: "Router",
      make: "Cisco",
      model: "RV340",
      quantity: "5",
      performedBy: "John",
      createdAt: "01/09/2024",
    },
    {
      equipment_id: "3",
      color: "Yellow",
      size: "SN12131415",
      device_type: "Printer",
      make: "HP",
      model: "LaserJet Pro M404n",
      quantity: "5",
      performedBy: "John",
      createdAt: "01/09/2024",
    },
    {
      equipment_id: "4",
      color: "Blue",
      size: "SN16171819",
      device_type: "Monitor",
      make: "Samsung",
      model: "U28E590D",
      quantity: "5",
      performedBy: "John",
      createdAt: "01/09/2024",
    },
    {
      equipment_id: "5",
      color: "Green",
      size: "SN20212223",
      device_type: "Server",
      make: "HP",
      model: "ProLiant DL360 Gen10",
      quantity: "5",
      performedBy: "John",
      createdAt: "01/09/2024",
    },
  ],
};

const InventoryReport = () => {
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
  // const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  // const [modelFilter, setModelFilter] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  // const locationsInventory = useSelector(
  //   (state) => state.locationInventory.locations
  // );
  const { access } = useSelector((state) => state.user);
  const { user_type } = useSelector((state) => state.user.user);

  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false)
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);

    // Navigate to the AssignedEquipments page with the appropriate param
    const param =
      selectedValue === "equipmentReport"
        ? "/equipment-report"
        : "/inventory-report";
    navigate(`${param}`);
  };
  useEffect(() => {
    dispatch(getLocationInventory()); // Fetch locations if needed
  }, [dispatch]);

  useEffect(() => {
    dispatch(getIdrEquipments(filters));
  }, [dispatch, filters]);

  // const handleSearch = () => {
  //   const newFilters = {
  //     ...filters,
  //     search: searchQuery,
  //     device_type: deviceTypeFilter,
  //     model: modelFilter,
  //   };
  //   setFilters(newFilters);
  // };

  // const handleReset = () => {
  //   const resetFilters = {
  //     search: "",
  //     location: "",
  //     model: "",
  //     device_type: "",
  //     signout: "",
  //   };
  //   setFilters(resetFilters);
  //   setDeviceTypeFilter("");
  //   setModelFilter("");
  //   setSearchQuery("");
  //   dispatch(getIdrEquipments(resetFilters));
  // };



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

  // const truncateText = (text, maxLength) => {
  //   if (text?.length <= maxLength) return text;
  //   return text?.slice(0, maxLength) + "...";
  // };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">IDR Inventory Reports</h1>
            {access.includes(user_type) && (
              <div className="flex gap-2">
                <div className="flex flex-col gap-2">
                  <select
                    name="equipmentFilters"
                    className="px-3 border border-gray-200 h-10 rounded w-50"
                    value={selectedOption}
                    onChange={handleSelectChange}
                  >
                    <option value="">Filter Reports</option>
                    <option value="equipmentReport">Equipment Reports</option>
                    <option value="inventoryReport">Inventory Reports</option>
                  </select>
                </div>
                {/* <Link to="/add-company-equipment">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                  Add Inventory Report
                </button>
              </Link> */}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            {/* <div className="flex justify-between items-center">
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
            </div> */}
            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("color")}
                  >
                    Color{" "}
                    <span className="ml-2">{getSortSymbol("location")}</span>
                  </th>
                  {/* <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("assigned_to")}
                  >
                    Assigned To{" "}
                    <span className="ml-2">{getSortSymbol("assigned_to")}</span>
                  </th> */}
                  <th
                    className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"
                    onClick={() => handleSort("size")}
                  >
                    Size <span className="ml-2">{getSortSymbol("size")}</span>
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
                    Quantity
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Performed By
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Created Date
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Performed Action
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
                      <p className="text-center">Loading Inventory Report...</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {mockEquipmentData?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <p className="text-center">No Record Found</p>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {mockEquipmentData?.data?.map((equipment, index) => (
                          <tr key={index} className="text-left">
                            <td className="border text-sm px-1 py-3">
                              {equipment?.color}
                            </td>
                            {/* <td className="border text-sm px-1 py-3">
                          {equipment?.assigned_to ? equipment?.assigned_to : "NA"}
                        </td> */}
                            <td className="border text-sm px-1 py-3">
                              {equipment?.size}
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
                              {equipment?.quantity}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {equipment?.performedBy}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {equipment?.createdAt}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              Add,Edit,Trasnfer, to Location, Transfer to Technician
                            </td>
                            <td className="border text-sm px-1 py-3">
                              <div className="flex gap-2">
                                <div className="p-[4px] bg-gray-100 cursor-pointer">
                                  <BiSolidShow
                                    onClick={() =>
                                      navigate(
                                        `/inventory-report/${equipment?.equipment_id}`
                                      )
                                    }
                                  />
                                </div>
                              
                              </div>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryReport;
