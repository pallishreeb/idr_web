import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import tem from "../Images/template.png";
const AdminSideNavbar = () => {
  const { user_type } = useSelector((state) => state.user.user);
  // console.log(user_type)
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);
  const [isSubMenuOpenClient, setIsSubMenuOpenClient] = useState(true);
  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      roles: ["Admin", "Subadmin"],
    },
    // { title: "Users", path: "/users", roles: ["Admin"] },
    {
      title: "Clients",
      path: "/clients",
      roles: ["Admin", "Subadmin"],
    },
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
    // {
    //   title: "Client Equipment",
    //   path: "/client-equipment",
    //   roles: ["Admin", "Subadmin"],
    // },
    // Add more menu items as needed
  ];
  const idrMenuItems = [

    {
      title: "IDR Employees",
      path: "/idr-employees",
      roles: ["Admin", "Subadmin"],
    },
    {
      title: "Work Order",
      path: "/workorder",
      roles: ["Admin", "Subadmin", "IDR Employee", "Client Employee"],
    },
    {
      title: "Inventory",
      path: "/inventory",
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },
    {
      title: "Inventory Locations",
      path: "/inventory-locations",
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },
    {
      title: "IDR Equipment and Tools",
      path: "/idr-equipment",
      roles: ["Admin", "Subadmin", "IDR Employee",],
    },
    {
      title: "Reports",
      path: "/equipment-report",
      roles: ["Admin", "Subadmin",],
    },
    // Add more menu items as needed
  ];
  const mainMenu = ["Admin", "Subadmin"];

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const toggleSubMenuClient = () => {
    setIsSubMenuOpenClient(!isSubMenuOpenClient);
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className=" text-black w-64 flex-shrink-0 border-r border-gray-400">
        <nav>
          <ul>
            {mainMenu.includes(user_type) && (
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
                            <div className="flex items-center gap-3 bg-gray-100 hover:bg-indigo-700 hover:text-white cursor-pointer">
                              <MdDashboardCustomize
                                size={20}
                                className="ml-6"
                              />
                              <li className="py-2">{item.title}</li>
                            </div>
                          </Link>
                        )
                    )}
                  </ul>
                )}
              </>
            )}
            <li className="flex items-center justify-between px-4 py-2 bg-gray-300 font-semibold">
              <span>{user_type === "Client Employee" ? "Client" : "IDR"}</span>
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
                {!mainMenu.includes(user_type) && (
                  <Link to={"/admin/dashboard"} key="/admin/dashboard">
                    <div className="flex items-center gap-3 bg-gray-100 hover:bg-indigo-700 hover:text-white cursor-pointer">
                      <MdDashboardCustomize size={20} className="ml-6" />
                      <li className="py-2">Dashboard</li>
                    </div>
                  </Link>
                )}
                {idrMenuItems.map(
                  (item) =>
                    item.roles.includes(user_type) && (
                      <Link to={item.path} key={item.title}>
                        <div className="flex items-center gap-3 bg-gray-100 hover:bg-indigo-700 hover:text-white cursor-pointer">
                          <MdDashboardCustomize size={20} className="ml-6" />
                          <li className="py-2">{item.title}</li>
                        </div>
                      </Link>
                    )
                )}
              </ul>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default AdminSideNavbar;
