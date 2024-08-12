import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Loader from "../../Images/ZZ5H.gif";

const EditEquipment = () => {
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-lg">Edit IDR Equipment Item</h1>
            <div className="flex gap-2">
              <button
                type="button"
                className="bg-indigo-600 text-white px-6 py-2 rounded"
              >
                Edit
              </button>
              <button type="button" className="border py-2 px-4 rounded">
                Back
              </button>
            </div>
          </div>
          <div className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-normal">Details</h1>
            </div>
            <div className="border border-gray-200 mb-4"></div>
            <div className="grid grid-cols-2 gap-8">
              {/* Static Fields */}
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Seial Number</label>
                <input
                  type="text"
                  value="Sample Make"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Label</label>
                <input
                  type="text"
                  value="Sample Model"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Make</label>
                <input
                  type="text"
                  value="Sample Device Type"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Model</label>
                <input
                  type="text"
                  value="Sample Color"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Device Type</label>
                <input
                  type="text"
                  value="Sample Size"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Mac Address</label>
                <input
                  type="text"
                  value="Sample Location"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Location</label>
                <input
                  type="text"
                  value="Sample Location"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">QR Code</label>
                <img
                  src={`https://idr-app-images-bucket.s3.amazonaws.com/sample-qr-code.png`}
                  alt="QR Code"
                  className="w-24 h-24 object-cover rounded-md shadow"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-normal text-base">Description</label>
                <textarea
                  value="This is a sample description for the equipment."
                  className="px-3 py-2 border border-gray-200 text-sm rounded resize-y w-full"
                  readOnly
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditEquipment;
