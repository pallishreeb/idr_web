import { useState } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
// import tem from "../Images/template.png";
const SideNavbar = () => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className=" text-black w-64 flex-shrink-0 border-r border-gray-400">
        <nav>
          <ul>
            <li className="flex items-center justify-between px-4 py-2 bg-gray-300 font-semibold">
              <span>IDR</span>
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
                <div className="flex items-center gap-3 bg-gray-100 hover:bg-red-700 hover:text-white cursor-pointer">
                  <MdDashboardCustomize size={20} className="ml-6" />
                  <li className="py-2">Dashboard</li>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 hover:bg-red-700 hover:text-white cursor-pointer">
                  <MdDashboardCustomize size={20} className="ml-6" />
                  <li className="py-2">Work Order</li>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 hover:bg-red-700 hover:text-white cursor-pointer">
                  <MdDashboardCustomize size={20} className="ml-6" />
                  <li className="py-2">Inventory</li>
                </div>
                <div className="flex items-center gap-3 bg-gray-100 hover:bg-red-700 hover:text-white cursor-pointer">
                  <MdDashboardCustomize size={20} className="ml-6" />
                  <li className="py-2">Company Equipment</li>
                </div>
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

export default SideNavbar;
