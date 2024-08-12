import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { MdCloudUpload } from "react-icons/md";

const AddIdrEquipment = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Add New IDR Equipment Item</h1>
          </div>

          <form className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="text-xl font-normal mb-2">Details</h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[
                { label: "Serial Number", type: "text" },
                { label: "Label", type: "text" },
                { label: "Make", type: "text" },
                { label: "Model", type: "text" },
                { label: "Device Type", type: "text" },
                { label: "Mac Address", type: "text" },
              ].map(({ label, type }) => (
                <div key={label} className="flex flex-col gap-2">
                  <label className="font-normal text-base">{label}</label>
                  <input
                    type={type}
                    placeholder={`Type ${label.toLowerCase()}`}
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Location</label>
                <select
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  disabled
                >
                  <option value="">Select Location</option>
                  <option value="Location 1">Location 1</option>
                  <option value="Location 2">Location 2</option>
                </select>
              </div>

              <div className="flex flex-col gap-2 relative">
                <label className="font-normal text-base">QR code</label>
                <label className="flex justify-center items-center bg-gray-200 rounded-md shadow-sm px-3 py-2 border border-gray-200 text-sm">
                  <span>Click here to upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                  <MdCloudUpload />
                </label>
              </div>
              {/* <div className="flex flex-col gap-2">
                <span className="font-normal text-base">
                  Selected Image: No Image Selected
                </span>
                <img
                  src=""
                  alt="Selected QR Code"
                  className="w-24 h-24 object-cover rounded-md shadow"
                />
              </div> */}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-normal text-base">Description</label>
              <textarea
                placeholder="Type"
                className="w-full px-2 py-2 border border-gray-200 h-24 text-sm rounded"
              />
            </div>

            <div className="flex flex-row gap-10 justify-center mt-7 items-center">
              <button type="button" className="border w-1/3 py-2 rounded">
                Cancel
              </button>
              <button
                type="submit"
                className="border bg-indigo-600 w-1/3 py-2 text-white rounded"
                disabled
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddIdrEquipment;
