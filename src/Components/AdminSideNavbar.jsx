import { useState, useEffect } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getServiceRequestLists } from "../actions/serviceTicket";
import { getSubcontractorLists } from "../actions/subContractorAction";
const AdminSideNavbar = () => {
  const dispatch = useDispatch();
  const { user_type, client_type, subcontractor_id } = useSelector(
    (state) => state.user.user,
  );
  const location = useLocation(); // Get the current location
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [isSubMenuOpenClient, setIsSubMenuOpenClient] = useState(true);
  // console.log("User type:", user_type);
  // console.log("client_type:", client_type);
  const { serviceRequests, loading } = useSelector(
    (state) => state.serviceTicket,
  );
  const { subcontractors } = useSelector((state) => state.subcontractor);
  useEffect(() => {
    dispatch(getServiceRequestLists({}));
    dispatch(getSubcontractorLists());
  }, [dispatch]);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      roles: ["Admin", "Subadmin"],
    },
    { title: "Clients", path: "/clients", roles: ["Admin", "Subadmin"] },
    {
      title: "Client Employees",
      path: "/client-employees",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Client Locations",
      path: "/locations",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Client Equipment",
      path: "/client-equipments",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Service Agreements",
      path: "/service-agreements",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Client Licensing",
      path: "/client-licensing",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Service Requests",
      path: "/service-requests",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Subcontractor Users",
      path: "/sub-contractors-users",
      roles: ["Admin", "Subadmin"],
    },
  ];

  const idrMenuItems = [
    {
      title: "Subcontractor Users",
      path: "/sub-contractors-users",
      roles: ["Subcontractor"],
    },
    {
      title: "Users",
      path: "/client-employees",
      roles: client_type === "Admin" ? ["Client Employee"] : [""],
    },
    {
      title: "IDR Employees",
      path: "/idr-employees",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Service Agreements",
      path: "/service-agreements",
      roles: client_type !== "User" ? ["Client Employee"] : [""],
    },
    {
      title: "Client Equipment",
      path: "/client-equipments",
      roles:
        client_type !== "User"
          ? ["IDR Employee", "Client Employee"]
          : ["IDR Employee"],
    },
    {
      title: "Client Licensing",
      path: "/client-licensing",
      roles:
        client_type !== "User"
          ? ["IDR Employee", "Client Employee"]
          : ["IDR Employee"],
    },
    {
      title: "Work Order",
      path: "/workorder",
      roles: [
        "Admin",
        "Subadmin",
        "IDR Employee",
        "Client Employee",
        "Subcontractor_User",
      ],
    },
    {
      title: "Service Ticket",
      path: "/service-tickets",
      roles: [
        "Admin",
        "Subadmin",
        "IDR Employee",
        "Client Employee",
        "Subcontractor_User",
      ],
    },
    {
      title: "RMA",
      path: "/device-rma",
      roles:
        client_type !== "User"
          ? [
              "Admin",
              "Subadmin",
              "IDR Employee",
              "Subcontractor_User",
              "Client Employee",
            ]
          : ["Admin", "Subadmin", "IDR Employee", "Subcontractor_User"],
    },
    {
      title: "Request Service",
      path: "/add-service-request",
      roles: ["Client Employee"],
    },
    {
      title: "Inventory",
      path: "/inventory",
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },
    {
      title: "Inventory Locations",
      path: "/inventory-locations",
      roles: ["Admin"],
    },
    {
      title: "IDR Equipment and Tools",
      path: "/idr-equipment",
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },
    {
      title: "Reports",
      path: "/equipment-report",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Sub Contractors",
      path: "/sub-contractors",
      roles: ["Admin", "Subadmin","Subcontractor"],
    },
  ];

  const toggleSubMenu = () => setIsSubMenuOpen(!isSubMenuOpen);
  const toggleSubMenuClient = () =>
    setIsSubMenuOpenClient(!isSubMenuOpenClient);

  // const newSubcontractors =
  //   subcontractors?.filter(
  //     (sub) => sub?.contract_status === "In Review"
  //   ) || [];

  const getUserLabel = (user_type) => {
    const map = {
      "Client Employee": "Client",
      Subcontractor: "Subcontractor",
      Subcontractor_User: "Subcontractor",
    };

    return map[user_type] || "IDR";
  };
  return (
    <div className="flex h-screen">
      <aside className="text-black w-64 flex-shrink-0 border-r border-gray-400">
        <nav>
          <ul>
            {["Admin", "Subadmin"].includes(user_type) && (
              <>
                <li className="flex items-center justify-between px-4 py-2 bg-gray-300 font-semibold">
                  <span>CLIENT</span>
                  <button
                    onClick={toggleSubMenuClient}
                    className="focus:outline-none"
                  >
                    {isSubMenuOpenClient ? (
                      <BsChevronUp className="h-5 w-5" />
                    ) : (
                      <BsChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </li>

                {isSubMenuOpenClient && (
                  <ul className="flex flex-col gap-1 mt-1">
                    {menuItems.map(
                      (item) =>
                        item.roles.includes(user_type) && (
                          <Link to={item.path} key={item.title}>
                            <div
                              className={`flex items-center gap-3 px-4 py-2 rounded ${
                                location.pathname.includes(item.path)
                                  ? "bg-indigo-700 text-white"
                                  : "bg-gray-100 hover:bg-indigo-700 hover:text-white"
                              } cursor-pointer`}
                            >
                              <MdDashboardCustomize size={20} />
                              <li className="flex items-center justify-between w-full">
                                <span>{item.title}</span>
                                {item.title === "Service Requests" &&
                                  serviceRequests?.length > 0 && (
                                    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                      {serviceRequests.length}
                                    </span>
                                  )}
                              </li>
                            </div>
                          </Link>
                        ),
                    )}
                  </ul>
                )}
              </>
            )}
            <li className="flex items-center justify-between px-4 py-2 bg-gray-300 font-semibold">
              <span>{getUserLabel(user_type)}</span>
              <button onClick={toggleSubMenu} className="focus:outline-none">
                {isSubMenuOpen ? (
                  <BsChevronUp className="h-5 w-5" />
                ) : (
                  <BsChevronDown className="h-5 w-5" />
                )}
              </button>
            </li>
            {isSubMenuOpen && (
              <ul className="flex flex-col gap-1 mt-1">
                {!["Admin", "Subadmin"].includes(user_type) && (
                  <Link to="/admin/dashboard">
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded ${
                        location.pathname === "/admin/dashboard"
                          ? "bg-indigo-700 text-white"
                          : "bg-gray-100 hover:bg-indigo-700 hover:text-white"
                      } cursor-pointer`}
                    >
                      <MdDashboardCustomize size={20} />
                      <li>Dashboard</li>
                    </div>
                  </Link>
                )}
                {idrMenuItems.map((item) => {
                  const finalPath =
                    item.title === "Sub Contractors" &&
                    user_type === "Subcontractor"
                      ? `/edit-subcontractor/${subcontractor_id}`
                      : item.path;
                  return (
                    item.roles.includes(user_type) && (
                      <Link to={finalPath} key={item.title}>
                        <div
                          className={`flex items-center gap-3 px-4 py-2 rounded ${
                            location.pathname.includes(item.path)
                              ? "bg-indigo-700 text-white"
                              : "bg-gray-100 hover:bg-indigo-700 hover:text-white"
                          } cursor-pointer`}
                        >
                          <MdDashboardCustomize size={20} />
                          <li>{item.title}</li>
                          {/* {item.title === "Sub Contractors" &&
                                  newSubcontractors?.length > 0 && (
                                    <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                      {newSubcontractors.length}
                                    </span>
                                  )} */}
                        </div>
                      </Link>
                    )
                  );
                })}
              </ul>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSideNavbar;
