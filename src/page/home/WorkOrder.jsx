import { useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import SideNavbar from "../../Components/AdminSideNavbar";
import { BiSolidEditAlt } from "react-icons/bi";
import { IoMdDownload } from "react-icons/io";
const WorkOrder = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <h1 className="font-bold text-lg">Work Orders</h1>
          <div className="flex mt-4 border py-7 px-5 bg-white">
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
                          onClick={() => navigate("/add-work-order")}
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
