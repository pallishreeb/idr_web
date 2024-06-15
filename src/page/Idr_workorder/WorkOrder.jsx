import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoMdDownload } from "react-icons/io";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
const WorkOrder = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Work Orders</h1>
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 w-[70%]">
                <div className="flex flex-col gap-2 w-[30%]">
                  <label className="font-normal text-sm">
                    Filter By Client
                  </label>
                  <select className="px-3  border border-gray-200  h-10 text-xs rounded">
                    <option>All</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-[30%]">
                  <label className="font-normal text-sm">
                    Filter By Status
                  </label>
                  <select className="px-3  border border-gray-200  h-10 text-xs rounded">
                    <option>All</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-[30%]">
                  <label className="font-normal text-sm">Filter By Staff</label>
                  <select className="px-3  border border-gray-200  h-10 text-xs rounded">
                    <option>All</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2 w-[30%]">
                  <label className="font-normal text-sm">
                    Filter By Work Order Type
                  </label>
                  <select className="px-3  border border-gray-200  h-10 text-xs rounded">
                    <option>All</option>
                  </select>
                </div>
              </div>
              <Link to={"/add-work-order"}>
                <button className="bg-blue-500 text-white px-6 py-2 rounded mt-7">
                  New Work Order
                </button>
              </Link>
            </div>
            <table className="mt-2 w-[100%]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Work Order Code
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Client Name
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Created Date &Time
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Status
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Issue
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left ">
                  <td className=" text-xs py-3">WO1000001853</td>
                  <td className="text-xs py-3">IDR Technology Solutions</td>
                  <td className="text-xs py-3">6/21/2023 5:06:00 PM</td>
                  <td className="text-xs py-3">Open</td>
                  <td className="text-xs py-3">Whole Foods/ ComNet</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <BiSolidEditAlt
                          onClick={() => navigate("/idr/edit-work-order")}
                        />
                      </div>

                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <IoMdDownload />
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

export default WorkOrder;
