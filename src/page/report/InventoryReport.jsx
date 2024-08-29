import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidShow } from "react-icons/bi";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import {
  getInventoryReportList,
} from "../../actions/reportActions";
import { useDispatch, useSelector } from "react-redux";

const InventoryReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  const { inventories,loading } = useSelector((state) => state.report);
  const { access } = useSelector((state) => state.user);
  const { user_type } = useSelector((state) => state.user.user);

  const [selectedOption, setSelectedOption] = useState("");

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
    dispatch(getInventoryReportList());
  }, [dispatch]);

  // console.log(inventories,"inventories-------inventories")
  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    dispatch(getInventoryReportList({  sortBy: key, orderBy: direction }));
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
             
              </div>
            )}
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
           
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
                    {inventories?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <p className="text-center">No Record Found</p>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {inventories?.data?.map((inventory, index) => (
                          <tr key={index} className="text-left">
                            <td className="border text-sm px-1 py-3">
                              {inventory?.inventories?.color}
                            </td>
                            {/* <td className="border text-sm px-1 py-3">
                          {equipment?.assigned_to ? equipment?.assigned_to : "NA"}
                        </td> */}
                            <td className="border text-sm px-1 py-3">
                              {inventory?.inventories?.size}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {inventory?.inventories?.device_type}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {inventory?.inventories?.make}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {inventory?.inventories?.model}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {inventory?.inventories?.quantity}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {inventory?.performed_by}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {inventory?.created_at}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {inventory?.performed_action}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              <div className="flex gap-2">
                                <div className="p-[4px] bg-gray-100 cursor-pointer">
                                  <BiSolidShow
                                    onClick={() =>
                                      navigate(
                                        `/inventory-report/${inventory?.inventory_report_id}`
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
