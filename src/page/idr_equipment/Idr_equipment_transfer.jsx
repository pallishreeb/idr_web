import { useNavigate } from "react-router-dom";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const TransferIdrEquipment = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between items-end">
            <h1 className="font-bold text-lg">IDR Equipment Item</h1>
            <div className="flex gap-3">
              <button className="border border-gray-400 text-gray-400 px-6 py-2 rounded">
                Cancel
              </button>
            </div>
          </div>

          {/* Assign Inventory to Work Order Section */}
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <div className="flex justify-between items-end mb-2">
                <h1 className="text-xl font-normal mb-2">
                  Assign inventory to work order
                </h1>
              </div>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">
                  Select client for WO choices and site locations
                </label>
                <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                  <option value="">Select client</option>
                  {/* Mocking client options */}
                  <option value="client1">Client 1</option>
                  <option value="client2">Client 2</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Select WO</label>
                <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                  <option value="">Select code</option>
                  {/* Mocking work order options */}
                  <option value="wo1">WO 1</option>
                  <option value="wo2">WO 2</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Quantity Assigned</label>
                <input
                  type="text"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                />
              </div>
            </div>
          </div>

          {/* Transfer Inventory to Alternate Location Section */}
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <div className="flex justify-between items-end mb-2">
                <h1 className="font-normal text-xl">
                  Transfer inventory to alternate location
                </h1>
              </div>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">
                  Select location to transfer inventory to
                </label>
                <select className="px-2 border border-gray-200 h-10 rounded text-sm">
                  <option value="">Select location</option>
                  {/* Mocking location options */}
                  <option value="location1">Location 1</option>
                  <option value="location2">Location 2</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">
                  Quantity Transferred
                </label>
                <input
                  type="text"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferIdrEquipment;
