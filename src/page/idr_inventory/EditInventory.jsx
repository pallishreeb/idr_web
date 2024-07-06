import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import save from "../../Images/save.png";
import { MdCloudUpload } from "react-icons/md";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getLocationInventory } from "../../actions/locationsInventoryAction";

const EditInventory = () => {
  const dispatch = useDispatch();
  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations
  );

  useEffect(() => {
    dispatch(getLocationInventory());
  }, []);

  console.log("locationsInventory:", locationsInventory);
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Edit Inventory Item</h1>
          </div>

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="text-xl font-normal mb-2">Details</h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Make</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Model</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Device Type</label>

                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Quantity</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Color</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">GC</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Location</label>
                <select className="px-3 border border-gray-200 h-10 text-sm rounded">
                  <option>Select Location</option>
                  {locationsInventory?.map((ele) => (
                    <option className="capitalize" key={ele.id}>
                      {ele.location}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Size</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Label</label>
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
                <label className="font-normal text-base">UPC</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">SKU</label>
                <input
                  placeholder="Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  required
                />
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="font-normal text-base">QR code</label>
                <label className="flex justify-center items-center gap-4 bg-gray-200  rounded-md shadow-sm px-3 py-2 border border-gray-200 text-sm">
                  <span>Click here to upload</span>
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    placeholder="Select"
                  />
                  <MdCloudUpload />
                </label>
              </div>
            </div>
            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">Description</label>
              <textarea
                placeholder="Type"
                className="w-[100%] px-2 py-2 border border-gray-200 h-24 text-sm rounded"
                required
              />
            </div>

            <div className="flex flex-row gap-10 justify-center mt-7 items-center">
              <button className="border w-1/3 py-2  rounded">Cancel</button>
              <button className="border bg-indigo-600 w-1/3 py-2 text-white rounded">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditInventory;
