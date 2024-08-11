import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BiTransferAlt } from "react-icons/bi";

const IdrEquipment = () => {
  const Navigate = useNavigate();
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
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Location</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    {/* Filter by staff with Equip signed out */}
                    Filter by staff with out
                  </label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Location</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter by device type
                  </label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Location</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Filter by model</label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Location</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Search list</label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded w-40"
                  >
                    <option value="">All Location</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">&nbsp;</label>
                  <button className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded">
                    Search
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">&nbsp;</label>
                  <button className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded">
                    Reset
                  </button>
                </div>
              </div>
            </div>
            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Location
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Assigned To
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Serial Number
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Device Type
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Make
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Model
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left">
                  <td className="border text-sm px-1 py-3">
                    Christopher Defina's House
                  </td>
                  <td className="border text-sm px-1 py-3">
                    Access Control - Power Supply
                  </td>
                  <td className="border text-sm px-1 py-3">Test123</td>
                  <td className="border text-sm px-1 py-3">AL600ULACMCB </td>
                  <td className="border text-sm px-1 py-3">Altronix</td>
                  <td className="border text-sm px-1 py-3">AL600ULACMCB</td>
                  <td className="border text-sm px-1 py-3">
                    <div className="flex gap-2">
                      <div
                        className="p-[4px] bg-gray-100 cursor-pointer"
                        onClick={() => Navigate("/edit-company-equipment")}
                      >
                        <BiSolidEditAlt />
                      </div>
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <BiTransferAlt
                          onClick={() =>
                            Navigate("/transfer-company-equipment")
                          }
                        />
                      </div>
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <AiFillDelete />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdrEquipment;
