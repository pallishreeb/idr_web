import { MdCloudUpload } from "react-icons/md";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";

const EditClientEqiupment = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className=" py-12 px-8 bg-gray-50 w-[100%]">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">Company Equipment</h1>

            <div className="flex gap-3">
              <button
                className="border border-gray-400 text-gray-400 px-6 py-2 rounded"
                // onClick={() => navigate("/idr/company-equipment")}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                // onClick={handleOpenModel}
              >
                Save
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-3">
            <label className=" text-Roboto text-xl font-normal">Client</label>
            <select className="bg-gray-100 rounded px-4 py-2 text-sm font-normal">
              <option>IDR Technology Solutions</option>
            </select>
          </div>

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="font-normal text-xl mb-2">Details</h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Description</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                  required
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Make</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                  required
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Model</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                  required
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Serial number</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                  required
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">MacAddress</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Label</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Location</label>

                <select
                  className="px-3 border  border-gray-200 h-10 text-sm rounded"
                  required
                >
                  <option value="">Choose</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">
                  Assigned equipment to
                </label>

                <select
                  className="px-3 border  border-gray-200 h-10 text-sm rounded"
                  required
                >
                  <option value="">Choose</option>
                </select>
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

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Signed in</label>
                <input
                  type="date"
                  placeholder="Select"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Signed out</label>
                <input
                  type="date"
                  placeholder="Select"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">Device type</label>
              <textarea
                placeholder="Type"
                className="px-3 py-3 border border-gray-200 h-40 text-sm rounded resize-none"
                required
              />
            </div>
          </div>

          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="font-normal text-xl mb-2">
                Transfer Company Equipment
              </h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Assigned</label>
                <input
                  placeholder="Type"
                  className="px-3 py-3 border border-gray-200 bg-[#F1F1F1] h-10 text-sm rounded"
                  required
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Transfer to *</label>
                <input
                  placeholder="Choose"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                  required
                ></input>
              </div>

              <div className="flex flex-col gap-2 ">
                <label className="font-normal text-base">Signed in</label>
                <input
                  type="date"
                  placeholder="Select"
                  className="px-3 py-3 border border-gray-200 h-10 text-sm rounded"
                ></input>
              </div>
            </div>

            <div className="flex flex-col gap-2 ">
              <label className="font-normal text-base">Description</label>
              <textarea
                placeholder="Type"
                className="px-3 py-3 border border-gray-200 h-40 text-sm rounded resize-none"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditClientEqiupment;
