import circle from "../Images/banner.png";
import { MdPhone } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import Header from "../Components/Header";
import SideNavbar from "../Components/SideNavbar";
import { MdTaskAlt } from "react-icons/md";
import { MdOutlineBorderColor } from "react-icons/md";
const Dashboard = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <SideNavbar />
        <div className="py-12 px-8 bg-gray-50">
          <h1 className="font-bold text-lg">Dashboard</h1>
          <div className="flex mt-4 border py-7 px-5 bg-white">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="font-medium text-lg">
                  Hello, Michael LaPunzina
                </h1>
                <p className="font-normal">
                  Lorem Ipsum is simply dummy text of the printing and type
                  setting industry.
                </p>
              </div>
              <div className="flex gap-[4%]">
                <div className="flex gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <MdPhone size={20} />
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-400">Phone</p>
                    <p>+1 7322173550</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <IoMail size={20} />
                  </div>

                  <div className="text-sm">
                    <p className="text-gray-400">Email</p>
                    <p>mlapunzina@idrtechnologysolutions.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[60%]">
              <img src={circle} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="mt-4 border py-7 px-5 bg-white">
              <h1 className="font-medium text-xl">ASSIGNMENTS</h1>
              <div className="flex gap-16 mt-8">
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <MdTaskAlt size={20} />
                  </div>
                  <h1 className="font-normal text-sm">Open Tasks</h1>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                    <MdOutlineBorderColor size={20} />
                  </div>
                  <h1 className="font-normal text-sm">Open work orders</h1>
                </div>
              </div>
            </div>
            <div className="mt-4 border py-7 px-5 bg-white w-[60%]">
              <h1 className="font-medium text-xl">User Details</h1>
              <table className="mt-2">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      User Name
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      Role
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      User Email
                    </th>
                    <th className="px-1 py-1 text-left text-sm font-semibold bg-gray-200 tracking-wider">
                      Password
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-[12px] py-3">Lorem Ipsum</td>
                    <td className="px-[12px] py-3">Super Admin</td>
                    <td className="px-[12px] py-3">loremipsum@admin.com</td>
                    <td className="px-[12px] py-3">Password@123</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
