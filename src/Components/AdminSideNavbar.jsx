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
      roles: ["Admin", "Subadmin",],
    },
    { title: "Users", path: "/users", roles: ["Admin"] },
    {
      title: "Clients",
      path: "/clients",
      roles: ["Admin", "Subadmin",],
    },
    {
      title: "Client Employees",
      path: "/client-employees",
      roles: ["Admin", "Subadmin", ],
    },
    {
      title: "Locations",
      path: "/locations",
      roles: ["Admin",],
    },
    // {
    //   title: "Client Equipment",
    //   path: "/client-equipment",
    //   roles: ["Admin",],
    // },
    // Add more menu items as needed
  ];
  const idrMenuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      roles: ["Admin", "IDR Employee", "Client Employee"],
    },
    {
      title: "IDR Employee",
      path: "/idr-employee",
      roles: ["Admin", "Subadmin", "Client Employee"],
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
      title: "Company Equipment",
      path: "/company-equipment",
      roles: ["Admin", "Subadmin", "IDR Employee", "Client Employee"],
    },
    {
      title: "Upload CSV File",
      path: "/upload-csv",
      roles: ["Admin", "Client Employee"],
    },
    // Add more menu items as needed
  ];
  const mainMenu = ['Admin', 'Subadmin']

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  const toggleSubMenuClient = () => {
    setIsSubMenuOpenClient(!isSubMenuOpen);
  };
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className=" text-black w-64 flex-shrink-0 border-r border-gray-400">
        <nav>
          <ul>
            {mainMenu.includes(user_type) && 
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
                          <MdDashboardCustomize size={20} className="ml-6" />
                          <li className="py-2">{item.title}</li>
                        </div>
                      </Link>
                    )
                )}
              </ul>
            )}
            </>
            }
            <li className="flex items-center justify-between px-4 py-2 bg-gray-300 font-semibold">
              <span>{user_type == 'IDR Employee' ? 'IDR' : 'Client Employee' }</span>
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

      {/* Content */}
      {/* <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold">Main Content</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vel
          urna ut urna efficitur commodo.
        </p>
      </div> */}
    </div>
  );
};

export default AdminSideNavbar;
