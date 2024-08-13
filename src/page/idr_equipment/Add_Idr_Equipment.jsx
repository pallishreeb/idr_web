import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdCloudUpload } from "react-icons/md";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getLocationInventory } from "../../actions/locationsInventoryAction"; // Assuming locations are fetched from here
import { addIdrEquipment } from "../../actions/idrEquipmentAction"; // Replace with actual action

const AddIdrEquipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations
  ); // Assuming locations are fetched like this
  const loading = useSelector((state) => state.idrequipment.loading); // Replace with actual loading state
  const [formData, setFormData] = useState({
    serial_number: "",
    label: "",
    make: "",
    model: "",
    device_type: "",
    mac_address: "",
    location: "",
    location_id: "",
    description: "",
    qr_code: null,
  });

  useEffect(() => {
    dispatch(getLocationInventory()); // Fetch locations if needed
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] }));
      const file = e.target.files[0];
      setSelectedImage(file);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = locationsInventory.find(
      (loc) => loc.location === e.target.value
    );
    setFormData((prevData) => ({
      ...prevData,
      location: selectedLocation.location,
      location_id: selectedLocation.inventory_location_id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    dispatch(addIdrEquipment(data, navigate));
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Add New IDR Equipment Item</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6">
            <div className="mb-2">
              <h1 className="text-xl font-normal mb-2">Details</h1>
              <div className="border border-gray-200"></div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              {[
                { name: "serial_number", label: "Serial Number", type: "text" },
                { name: "label", label: "Label", type: "text" },
                { name: "make", label: "Make", type: "text" },
                { name: "model", label: "Model", type: "text" },
                { name: "device_type", label: "Device Type", type: "text" },
                { name: "mac_address", label: "Mac Address", type: "text" },
              ].map(({ name, label, type }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="font-normal text-base">{label}</label>
                  <input
                    name={name}
                    type={type}
                    placeholder={`Type ${label.toLowerCase()}`}
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={handleInputChange}
                    required
                  />
                </div>
              ))}

              <select
                name="location"
                className="px-3 border border-gray-200 h-10 text-sm rounded"
                onChange={handleLocationChange}
                required
              >
                <option value="">Select Location</option>
                {locationsInventory?.map((ele) => (
                  <option key={ele.inventory_location_id} value={ele.location}>
                    {ele.location}
                  </option>
                ))}
              </select>

              <div className="flex flex-col gap-2 relative">
                <label className="font-normal text-base">QR code</label>
                <label className="flex justify-center items-center bg-gray-200 rounded-md shadow-sm px-3 py-2 border border-gray-200 text-sm">
                  <span>Click here to upload</span>
                  <input
                    name="qr_code"
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    onChange={handleInputChange}
                    required
                  />
                  <MdCloudUpload />
                </label>
              </div>
              {selectedImage && (
                <div className="flex flex-col gap-2">
                  <span className="font-normal text-base">Selected Image: {selectedImage.name}</span>
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected QR Code"
                    className="w-24 h-24 object-cover rounded-md shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-normal text-base">Description</label>
              <textarea
                name="description"
                placeholder="Type"
                className="w-full px-2 py-2 border border-gray-200 h-24 text-sm rounded"
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="flex flex-row gap-10 justify-center mt-7 items-center">
              <button
                type="button"
                className="border w-1/3 py-2 rounded"
                onClick={() => navigate('/idr-equipment')} // Adjust the path as needed
              >
                Cancel
              </button>
              <button
                type="submit"
                className="border bg-indigo-600 w-1/3 py-2 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Saving' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddIdrEquipment;
