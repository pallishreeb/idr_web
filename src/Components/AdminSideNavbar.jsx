/** @format */

import { useState, useEffect } from "react";

import {
  BsChevronDown,
  BsChevronUp,
} from "react-icons/bs";

import {
  MdDashboard,
  MdPeople,
  MdLocationOn,
  MdBuild,
  MdAssignment,
  MdVerified,
  MdEngineering,
  MdInventory,
  MdOutlineBusinessCenter,
  MdMiscellaneousServices,
  MdSettings,
  MdOutlineGroup,
  MdOutlineSupportAgent,
  MdOutlineRequestPage,
  MdOutlineHandyman,
  MdOutlineAnalytics,
  MdOutlineApartment,
  MdOutlineBadge,
} from "react-icons/md";

import { Link, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { getServiceRequestLists } from "../actions/serviceTicket";

const AdminSideNavbar = () => {
  const dispatch = useDispatch();

  const {
    user_type,
    client_type,
    subcontractor_id,
    first_name,last_name
  } = useSelector((state) => state.user.user);
const fullname = first_name + ' ' + last_name
  const location = useLocation();

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(true);

  const [isSubMenuOpenClient, setIsSubMenuOpenClient] =
    useState(true);

  const [isSubcontractorMenuOpen, setIsSubcontractorMenuOpen] =
    useState(true);

  const { serviceRequests } = useSelector(
    (state) => state.serviceTicket,
  );

  useEffect(() => {
    dispatch(getServiceRequestLists({}));
  }, [dispatch]);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <MdDashboard size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Clients",
      path: "/clients",
      icon: <MdPeople size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Client Employees",
      path: "/client-employees",
      icon: <MdOutlineBadge size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Client Locations",
      path: "/locations",
      icon: <MdLocationOn size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Client Equipment",
      path: "/client-equipments",
      icon: <MdBuild size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Service Agreements",
      path: "/service-agreements",
      icon: <MdAssignment size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Client Licensing",
      path: "/client-licensing",
      icon: <MdVerified size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Service Requests",
      path: "/service-requests",
      icon: <MdOutlineRequestPage size={22} />,
      roles: ["Admin", "Subadmin"],
    },
  ];

  const idrMenuItems = [
    {
      title: "Users",
      path: "/client-employees",
      icon: <MdPeople size={22} />,
      roles: client_type === "Admin" ? ["Client Employee"] : [""],
    },

    {
      title: "IDR Employees",
      path: "/idr-employees",
      icon: <MdEngineering size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Service Agreements",
      path: "/service-agreements",
      icon: <MdAssignment size={22} />,
      roles: client_type !== "User" ? ["Client Employee"] : [""],
    },

    {
      title: "Client Equipment",
      path: "/client-equipments",
      icon: <MdBuild size={22} />,
      roles:
        client_type !== "User"
          ? ["IDR Employee", "Client Employee"]
          : ["IDR Employee"],
    },

    {
      title: "Client Licensing",
      path: "/client-licensing",
      icon: <MdVerified size={22} />,
      roles:
        client_type !== "User"
          ? ["IDR Employee", "Client Employee"]
          : ["IDR Employee"],
    },

    {
      title: "Work Order",
      path: "/workorder",
      icon: <MdMiscellaneousServices size={22} />,
      roles: [
        "Admin",
        "Subadmin",
        "IDR Employee",
        "Client Employee",
        "Subcontractor_User",
        "Subcontractor",
      ],
    },

    {
      title: "Service Ticket",
      path: "/service-tickets",
      icon: <MdOutlineSupportAgent size={22} />,
      roles: [
        "Admin",
        "Subadmin",
        "IDR Employee",
        "Client Employee",
        "Subcontractor_User",
        "Subcontractor",
      ],
    },

    {
      title: "RMA",
      path: "/device-rma",
      icon: <MdSettings size={22} />,
      roles:
        client_type !== "User"
          ? [
              "Admin",
              "Subadmin",
              "IDR Employee",
              "Subcontractor_User",
              "Client Employee",
              "Subcontractor",
            ]
          : [
              "Admin",
              "Subadmin",
              "IDR Employee",
              "Subcontractor_User",
              "Subcontractor",
            ],
    },

    {
      title: "Request Service",
      path: "/add-service-request",
      icon: <MdOutlineRequestPage size={22} />,
      roles: ["Client Employee"],
    },

    {
      title: "Inventory",
      path: "/inventory",
      icon: <MdInventory size={22} />,
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },

    {
      title: "Inventory Locations",
      path: "/inventory-locations",
      icon: <MdOutlineApartment size={22} />,
      roles: ["Admin"],
    },

    {
      title: "IDR Equipment and Tools",
      path: "/idr-equipment",
      icon: <MdOutlineHandyman size={22} />,
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },

    {
      title: "Reports",
      path: "/equipment-report",
      icon: <MdOutlineAnalytics size={22} />,
      roles: ["Admin", "Subadmin"],
    },

    {
      title: "Business Information",
      path: "/sub-contractors",
      icon: <MdOutlineBusinessCenter size={22} />,
      roles: ["Subcontractor"],
    },
  ];

  const subcontractorMenuItems = [
    {
      title: "Sub Contractors",
      path: "/sub-contractors",
      icon: <MdOutlineBusinessCenter size={22} />,
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },

    {
      title: "Subcontractor Users",
      path: "/sub-contractors-users",
      icon: <MdOutlineGroup size={22} />,
      roles: ["Admin", "Subadmin", "IDR Employee"],
    },
  ];

  const toggleSubcontractorMenu = () =>
    setIsSubcontractorMenuOpen(!isSubcontractorMenuOpen);

  const toggleSubMenu = () =>
    setIsSubMenuOpen(!isSubMenuOpen);

  const toggleSubMenuClient = () =>
    setIsSubMenuOpenClient(!isSubMenuOpenClient);

  const getUserLabel = (user_type) => {
    const map = {
      "Client Employee": "CLIENT",
      Subcontractor: "SUBCONTRACTOR",
      Subcontractor_User: "SUBCONTRACTOR",
    };

    return map[user_type] || "IDR";
  };

  const getInitials = (fullName) => {
    if (!fullName) return "ID";

    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };
 const getUserType = (user_type) => {
  if(user_type === "Subcontractor_User"){
    return "Subcontractor User"
  }else {
    return user_type
  }
 }
  const MenuItem = ({ item, badge, finalPath }) => {
    const isActive =
      location.pathname === item.path;

    return (
      <Link to={finalPath || item.path}>
        <div
          className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 cursor-pointer
          
          ${
            isActive
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg scale-[1.02]"
              : "bg-white text-gray-700 border border-gray-100 hover:border-indigo-100 hover:shadow-md hover:translate-x-1"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`transition-all duration-300
              ${
                isActive
                  ? "text-white"
                  : "text-indigo-500 group-hover:text-pink-500"
              }`}
            >
              {item.icon}
            </div>

            <span className="font-semibold text-[15px] tracking-tight">
              {item.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {badge && (
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full
                ${
                  isActive
                    ? "bg-white text-indigo-600"
                    : "bg-red-500 text-white"
                }`}
              >
                {badge}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  const SectionHeader = ({
    title,
    isOpen,
    onClick,
  }) => (
    <div className="flex items-center justify-between mt-8 mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-6 rounded-full bg-gradient-to-b from-pink-500 to-indigo-500" />

        <span className="uppercase tracking-[0.25em] text-xs font-bold text-indigo-500">
          {title}
        </span>
      </div>

      <button
        onClick={onClick}
        className="text-gray-500 hover:text-indigo-500 transition"
      >
        {isOpen ? (
          <BsChevronUp size={18} />
        ) : (
          <BsChevronDown size={18} />
        )}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen ">
      <aside className="w-[290px] bg-[#FAFAFA] border-r border-gray-200 overflow-y-auto hide-scrollbar shadow-sm">
        {/* Header */}
        {/* Top Accent */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Profile Card */}
        <div className="px-4 pt-4 pb-0">
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {getInitials(fullname)}
              </div>

              <div>
                <h4 className="font-bold text-[#1E1B4B] text-md">
                  {fullname || "IDR User"}
                </h4>

                <span className="inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600">
                  {getUserType(user_type)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <nav className="px-4 py-5">
          {/* CLIENT SECTION */}
          {["Admin", "Subadmin"].includes(user_type) && (
            <>
              <SectionHeader
                title="CLIENT"
                isOpen={isSubMenuOpenClient}
                onClick={toggleSubMenuClient}
              />

              {isSubMenuOpenClient && (
                <div className="flex flex-col gap-3">
                  {menuItems.map(
                    (item) =>
                      item.roles.includes(user_type) && (
                        <MenuItem
                          key={item.title}
                          item={item}
                          badge={
                            item.title === "Service Requests" &&
                            serviceRequests?.length > 0
                              ? serviceRequests.length
                              : null
                          }
                        />
                      ),
                  )}
                </div>
              )}
            </>
          )}

          {/* IDR SECTION */}
          <SectionHeader
            title={getUserLabel(user_type)}
            isOpen={isSubMenuOpen}
            onClick={toggleSubMenu}
          />

          {isSubMenuOpen && (
            <div className="flex flex-col gap-3">
              {!["Admin", "Subadmin"].includes(user_type) && (
                <MenuItem
                  item={{
                    title: "Dashboard",
                    path: "/admin/dashboard",
                    icon: <MdDashboard size={22} />,
                  }}
                />
              )}

              {idrMenuItems.map((item) => {
                const finalPath =
                  item.title === "Business Information" &&
                  user_type === "Subcontractor"
                    ? `/edit-subcontractor/${subcontractor_id}`
                    : item.path;

                return (
                  item.roles.includes(user_type) && (
                    <MenuItem
                      key={item.title}
                      item={item}
                      finalPath={finalPath}
                    />
                  )
                );
              })}
            </div>
          )}

          {/* SUBCONTRACTOR SECTION */}
          {["Admin", "Subadmin"].includes(user_type) && (
            <>
              <SectionHeader
                title="SUBCONTRACTORS"
                isOpen={isSubcontractorMenuOpen}
                onClick={toggleSubcontractorMenu}
              />

              {isSubcontractorMenuOpen && (
                <div className="flex flex-col gap-3">
                  {subcontractorMenuItems.map(
                    (item) =>
                      item.roles.includes(user_type) && (
                        <MenuItem key={item.title} item={item} />
                      ),
                  )}
                </div>
              )}
            </>
          )}
        </nav>
      </aside>
    </div>
  );
};

export default AdminSideNavbar;