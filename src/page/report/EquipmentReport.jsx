import { useEffect, useState } from "react";
import { useNavigate , useLocation, Link} from "react-router-dom";
import { BiSolidShow } from "react-icons/bi";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getEquipmentReportList } from "../../actions/reportActions";
import { useDispatch, useSelector } from "react-redux";

const EquipmentReport = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const location = useLocation(); 
  // const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });

  const { equipments, loading } = useSelector((state) => state.report);
  // const { access } = useSelector((state) => state.user);
  // const { user_type } = useSelector((state) => state.user.user);
  // const [selectedOption, setSelectedOption] = useState("");


  // const handleSelectChange = (e) => {
  //   const selectedValue = e.target.value;
  //   setSelectedOption(selectedValue);

  //   const param =
  //     selectedValue === "equipmentReport"
  //       ? "/equipment-report"
  //       : "/inventory-report";
  //   navigate(param);
  // };

  // // Update the selected option based on the current route
  // useEffect(() => {
  //   if (location.pathname === "/equipment-report") {
  //     setSelectedOption("equipmentReport");
  //   } else if (location.pathname === "/inventory-report") {
  //     setSelectedOption("inventoryReport");
  //   } else {
  //     setSelectedOption("");
  //   }
  // }, [location.pathname]);

  useEffect(() => {
    dispatch(getEquipmentReportList());
  }, [dispatch]);

  // console.log(equipments,"equipments-------")

  // const handleSort = (key) => {
  //   let direction = "ASC";
  //   if (sortConfig.key === key && sortConfig.direction === "ASC") {
  //     direction = "DESC";
  //   }
  //   setSortConfig({ key, direction });
  //   dispatch(getEquipmentReportList({ sortBy: key, orderBy: direction }));
  // };

  // const getSortSymbol = (key) => {
  //   if (sortConfig.key === key) {
  //     return sortConfig.direction === "ASC" ? "▲" : "▼";
  //   }
  //   return "↕";
  // };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex gap-6 items-center">
            <h1 className="font-bold text-lg">Equipment Reports</h1>
            <Link to="/inventory-report">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                 Inventory Reports
                </button>
              </Link>
            {/* {access.includes(user_type) && (
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
            )} */}
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Location{" "}
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Assigned To{" "}
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Serial Number{" "}
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Device Type{" "}
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Make
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Model
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
                      <p className="text-center">Loading Equipment Report...</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {equipments?.data?.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center">
                          <p className="text-center">No Record Found</p>
                        </td>
                      </tr>
                    ) : (
                      <>
                        {equipments?.data?.map((equipment, index) => (
                          <tr key={index} className="text-left">
                            <td className="border text-sm px-1 py-3">
                              {equipment?.equipments?.location_name}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {equipment?.equipments?.assigned_to
                                ? equipment?.equipments?.assigned_to
                                : "NA"}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {equipment?.equipments?.serial_number}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {equipment?.equipments?.device_type}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {equipment?.equipments?.make}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {equipment?.equipments?.model}
                            </td>

                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {equipment?.performed_by}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {new Date(equipment?.created_at).toLocaleString('en-US', {
                                timeZone: 'America/New_York',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                hour12: true,
                              })}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              {" "}
                              {equipment?.performed_action}
                            </td>
                            <td className="border text-sm px-1 py-3">
                              <div className="flex gap-2">
                                <div className="p-[4px] bg-gray-100 cursor-pointer">
                                  <BiSolidShow
                                    onClick={() =>
                                      navigate(
                                        `/equipment-report/${equipment?.equipment_report_id}`
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

export default EquipmentReport;
