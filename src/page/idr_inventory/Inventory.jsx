import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BiTransferAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { postLocationInventory } from "../../actions/locationsInventoryAction";
import { toast } from "react-toastify";

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [location, setLocation] = useState("");

  const loading = useSelector((state) => state.locationInventory.loading);
  const handleOpenModel = () => {
    setShowModal(true);
  };
  const handleConfirmSave = async () => {
    const data = {
      location: location,
    };
    if(data.location == ""){
      toast.error("Please enter location.")
      return
    }
    dispatch(postLocationInventory(data));
    setLocation("");
    setShowModal(false);
  };
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Inventory</h1>
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
                    className="px-3 border border-gray-200 h-10 rounded"
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
                    className="px-3 border border-gray-200 h-10 rounded"
                  >
                    <option value="">All Type</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Filter by model</label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded"
                  >
                    <option value="">All model</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">Search List</label>
                  <div className="flex border border-gray-200 h-10 rounded">
                    <input
                      className="flex-1 border-none text-xs font-normal px-2 py-2 rounded-l"
                      placeholder="Type"
                    />
                    <button className="border-none text-xs font-normal px-4 py-2 bg-gray-200 rounded-r">
                      Search
                    </button>
                  </div>
                </div>
               
              </div>
                  <button
                    className="bg-indigo-600 text-white px-6 py-2 rounded mt-7"
                    onClick={handleOpenModel}
                  >
                    Add Location
                  </button>

              <Link to={"/addinventory"}>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded mt-7">
                  Add Inventory
                </button>
              </Link>
            </div>

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
                    ListPrice
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
                  <td className="border text-sm px-1 py-3">-</td>
                  <td className="border text-sm px-1 py-3">1</td>
                  <td className="border text-sm px-1 py-3">-</td>
                  <td className="border text-sm px-1 py-3">
                    <div className="flex gap-2">
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <BiSolidEditAlt
                          onClick={() => navigate("/edit_inventory")}
                        />
                      </div>
                      <div className="p-[4px] bg-gray-100 cursor-pointer">
                        <BiTransferAlt
                          onClick={() =>
                            navigate("/transfer-company-equipment")
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
      {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="flex flex-col gap-2 bg-white p-8 rounded shadow-lg w-[30%] m-auto text-center">
      <p>Add Location</p>
      <div className="flex border border-gray-200 h-10 rounded">
        <input
          className="flex-1 border-none text-xs font-normal px-2 py-2 rounded-l"
          placeholder="Type Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button
          disabled={loading}
          onClick={() => setShowModal(false)}
          className="border-none text-xs font-normal px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={() => {
            handleConfirmSave();
          }}
          className="border-none text-xs font-normal px-4 py-2 bg-gray-200 rounded"
        >
          Add
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default Inventory;
