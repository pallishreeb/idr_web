import { TiEye } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
const ClientEquipment = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          {" "}
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Company Equipment</h1>
          </div>
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-3">
            <label className=" text-Roboto text-xl font-normal">Client</label>
            <input className="bg-gray-100 rounded px-4 py-2 text-sm font-normal" />
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex gap-3 justify-between w-[100%]">
                <div className="flex flex-col gap-2 w-[25%]">
                  <label className="font-normal text-sm">
                    Filter by location
                  </label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded"
                  >
                    <option value="">All Location</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 w-[25%] ">
                  <label className="font-normal text-sm">
                    Staff with equip signed out
                  </label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded"
                  >
                    <option value="">Type</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2  w-[25%]">
                  <label className="font-normal text-sm">
                    Filter by device type
                  </label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded"
                  >
                    <option value="">All type</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2 w-[25%]">
                  <label className="font-normal text-sm">Filter by model</label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded"
                  >
                    <option value="">All models</option>
                  </select>
                </div>
                <div class="flex flex-col gap-2 w-[25%]">
                  <label class="font-normal text-sm">Search List</label>
                  <div class="flex border border-gray-200 h-10 rounded">
                    <input
                      class="flex-1 border-none text-xs font-normal px-2 py-2 rounded-l"
                      placeholder="Type"
                    />
                    <button class="border-none text-xs font-normal px-4 py-2 bg-gray-200 rounded-r">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <Link to={"/add-company-equipment"}>
              <div className="text-end">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                  Add Equipment
                </button>
              </div>
            </Link>

            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border">
                    Device Type
                  </th>
                  <th className="px-1 py-1 text-left  text-sm font-semibold  tracking-wider border">
                    Make
                  </th>
                  <th className="px-1 py-1 text-left text-sm  font-semibold tracking-wider border">
                    Model
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold  tracking-wider border">
                    Location
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Label
                  </th>
                  <th className="px-1 py-1 text-left text-sm  font-semibold  tracking-wider border">
                    Quantity
                  </th>
                  <th className="px-1 py-1 text-left text-sm  font-semibold  tracking-wider border">
                    Size
                  </th>
                  <th className="px-1 py-1 text-left text-sm  font-semibold tracking-wider border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-left ">
                  <td className="border text-sm px-1 py-3">Pry Plate</td>
                  <td className="border text-sm px-1 py-3">Pry Plate</td>
                  <td className="border text-sm px-1 py-3">Pry Plate</td>
                  <td className="border text-sm px-1 py-3">VAN #1</td>
                  <td className="border text-sm px-1 py-3">-</td>
                  <td className="border text-sm px-1 py-3">1</td>
                  <td className="border text-sm px-1 py-3">-</td>
                  <td className="border text-sm px-1 py-3">
                    <div className="flex gap-2">
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <BiSolidEditAlt
                          onClick={() => navigate("/edit-company-equipment")}
                        />
                      </div>
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <TiEye onClick={() => navigate("/edit_inventory")} />
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

export default ClientEquipment;
