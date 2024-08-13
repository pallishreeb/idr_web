import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BiTransferAlt } from "react-icons/bi";

const IdrEquipment = () => {
  const navigate = useNavigate();

  // State for filters and search
  const [locationFilter, setLocationFilter] = useState("");
  const [staffFilter, setStaffFilter] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  // Mock data for demonstration
  const equipmentData = [
    {
      location: "Christopher Defina's House",
      assignedTo: "Access Control - Power Supply",
      serialNumber: "Test123",
      deviceType: "AL600ULACMCB",
      make: "Altronix",
      model: "AL600ULACMCB",
    },
    {
      location: "John Doe's Office",
      assignedTo: "IT Department",
      serialNumber: "SN12345",
      deviceType: "Router",
      make: "Cisco",
      model: "RV340",
    },
    {
      location: "Jane Smith's Lab",
      assignedTo: "Lab Equipment",
      serialNumber: "LAB9876",
      deviceType: "Microscope",
      make: "Zeiss",
      model: "Axio",
    },
    // Add more mock data here...
  ];

  // Filter and search handler
  const handleSearch = () => {
    // Apply filtering logic based on state variables
    console.log("Filters applied:", { locationFilter, staffFilter, deviceTypeFilter, modelFilter, searchQuery });
  };

  // Reset handler
  const handleReset = () => {
    setLocationFilter("");
    setStaffFilter("");
    setDeviceTypeFilter("");
    setModelFilter("");
    setSearchQuery("");
  };

  // Filtered and searched data
  const filteredData = equipmentData.filter((item) => {
    return (
      (!locationFilter || item.location.includes(locationFilter)) &&
      (!staffFilter || item.assignedTo.includes(staffFilter)) &&
      (!deviceTypeFilter || item.deviceType.includes(deviceTypeFilter)) &&
      (!modelFilter || item.model.includes(modelFilter)) &&
      (!searchQuery || item.serialNumber.includes(searchQuery))
    );
  });
  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    // dispatch(getInventories({ ...filters, sortBy: key, orderBy: direction }));
  };
  
  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }
    return "↕";
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
                  <label className="font-normal text-sm">Filter by location</label>
                  <select
                    name="locationFilter"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Locations</option>
                    {/* Add options dynamically if needed */}
                  </select>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Filter by staff with out</label>
                  <select
                    name="staffFilter"
                    value={staffFilter}
                    onChange={(e) => setStaffFilter(e.target.value)}
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Staff</option>
                  </select>
                </div> */}
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Filter by device type</label>
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
                <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('location')}>
                  Location <span className="ml-2">{getSortSymbol('location')}</span>
                </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('assigned_to')}>
                    Assigned To <span className="ml-2">{getSortSymbol('location')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('serial_number')}>
                    Serial Number <span className="ml-2">{getSortSymbol('location')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('device_type')}>
                      Device Type <span className="ml-2">{getSortSymbol('device_type')}</span>
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('make')}>
                      Make <span className="ml-2">{getSortSymbol('make')}</span>
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('model')}>
                      Model <span className="ml-2">{getSortSymbol('model')}</span>
                    </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((equipment, index) => (
                  <tr key={index} className="text-left">
                    <td className="border text-sm px-1 py-3">{equipment.location}</td>
                    <td className="border text-sm px-1 py-3">{equipment.assignedTo}</td>
                    <td className="border text-sm px-1 py-3">{equipment.serialNumber}</td>
                    <td className="border text-sm px-1 py-3">{equipment.deviceType}</td>
                    <td className="border text-sm px-1 py-3">{equipment.make}</td>
                    <td className="border text-sm px-1 py-3">{equipment.model}</td>
                    <td className="border text-sm px-1 py-3">
                      <div className="flex gap-2">
                        <div
                          className="p-[4px] bg-gray-100 cursor-pointer"
                          onClick={() => navigate("/edit-company-equipment")}
                        >
                          <BiSolidEditAlt />
                        </div>
                        <div className="p-[4px] bg-gray-100 cursor-pointer">
                          <BiTransferAlt
                            onClick={() => navigate("/transfer-company-equipment")}
                          />
                        </div>
                        <div className="p-[4px] bg-gray-100 cursor-pointer">
                          <AiFillDelete />
                        </div>
                      </div>
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

export default IdrEquipment;
