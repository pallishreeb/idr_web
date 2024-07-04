import { useNavigate } from "react-router-dom";
import { useState } from "react";
import save from "../../Images/save.png";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const EditInventory = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleConfirmSave = () => {
    // Your save logic here
    setShowModal(false);
  };
  const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between items-end">
            <h1 className="font-bold text-lg">Inventory Item</h1>

            <div className="flex gap-3">
              <button
                className="border border-gray-400 text-gray-400 px-6 py-2 rounded"
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                onClick={handleOpenModel}
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="text-xl font-normal mb-2">Details</h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-normal text-sm">Make</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-normal text-sm">Model</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-normal text-sm">Device Type</label>

                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Quantity</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Color</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">GC</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Location</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Size</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">Label</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">List Price</label>
                <input
                  placeholder="$"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Unit Cost</label>
                <input
                  placeholder="$"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">UPC</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-sm">SKU</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-sm">Description</label>
              <textarea
                placeholder="Type"
                className="w-[100%] px-2 py-2 border border-gray-200 h-24 text-sm rounded"
                required
              />
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col gap-2 bg-white p-8 rounded shadow-lg w-[20%] m-auto text-center">
            <p>Are you sure you want to save this information?</p>
            <div className="items-center flex justify-center">
              <img className="w-[30%]" src={save} alt="save image" />
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <button
                className=" px-4 py-2 text-white bg-blue-600 rounded"
                onClick={handleConfirmSave}
              >
                Save
              </button>
              <button
                className="px-4 py-2 text-black border bg-gray-300 border-gray-300 rounded"
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditInventory;
