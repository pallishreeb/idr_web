/** @format */

import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";

import {
  MdCloudUpload,
  MdInventory2,
  MdArrowBack,
  MdQrCode2,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { useDispatch, useSelector } from "react-redux";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import { addInventory } from "../../actions/inventoryAction";

const AddInventory = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations,
  );

  const loadingInventory = useSelector((state) => state.inventory.loading);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    device_type: "",
    quantity: "",
    color: "",
    location: "",
    location_id: "",
    size: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    dispatch(getLocationInventory());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));

      const file = e.target.files[0];

      setSelectedImage(file);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = locationsInventory.find(
      (loc) => loc.location === e.target.value,
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

    dispatch(addInventory(data, navigate));
  };

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div
          className="
            flex-1
            p-4
            md:p-5
            overflow-x-hidden
          "
        >
          {/* PAGE HEADER */}
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
              mb-5
            "
          >
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    to-pink-500
                    text-white
                    flex
                    items-center
                    justify-center
                    shadow-md
                  "
                >
                  <MdInventory2 className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Add Inventory Item
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Create and manage new inventory items
                  </p>
                </div>
              </div>

              {/* BACK BUTTON */}
              <button
                type="button"
                onClick={() => navigate("/inventory")}
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-2xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-700
                  text-sm
                  font-medium
                  hover:bg-gray-50
                  transition-all
                "
              >
                <MdArrowBack className="text-lg" />
                Back
              </button>
            </div>
          </div>

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className="
              bg-white
              rounded-[24px]
              shadow-sm
              border
              border-gray-100
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-5">
              {/* SECTION HEADER */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#1E1B4B]">
                  Inventory Details
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Fill all required information for inventory creation
                </p>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[
                  {
                    name: "make",
                    label: "Make",
                    type: "text",
                  },

                  {
                    name: "model",
                    label: "Model",
                    type: "text",
                  },

                  {
                    name: "device_type",
                    label: "Device Type",
                    type: "text",
                  },

                  {
                    name: "quantity",
                    label: "Quantity",
                    type: "number",
                  },

                  {
                    name: "color",
                    label: "Color",
                    type: "text",
                  },

                  {
                    name: "size",
                    label: "Size",
                    type: "text",
                  },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      {label}
                    </label>

                    <input
                      name={name}
                      type={type}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      onChange={handleInputChange}
                      required
                      className="
                          w-full
                          rounded-2xl
                          border
                          border-gray-200
                          px-4
                          py-3
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                          transition-all
                        "
                    />
                  </div>
                ))}

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <select
                    name="location"
                    onChange={handleLocationChange}
                    required
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                      transition-all
                    "
                  >
                    <option value="">Select Location</option>

                    {locationsInventory?.map((ele) => (
                      <option
                        key={ele.inventory_location_id}
                        value={ele.location}
                      >
                        {ele.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* QR IMAGE */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    QR Code Image
                  </label>

                  <label
                    className="
                      relative
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-2
                      border-2
                      border-dashed
                      border-indigo-200
                      bg-indigo-50/50
                      rounded-2xl
                      px-4
                      py-6
                      cursor-pointer
                      hover:bg-indigo-50
                      transition-all
                    "
                  >
                    <MdCloudUpload className="text-4xl text-indigo-600" />

                    <div className="text-center">
                      <p className="text-sm font-semibold text-[#1E1B4B]">
                        Upload QR Code
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        Click to browse image
                      </p>
                    </div>

                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>

                {/* PREVIEW */}
                {selectedImage && (
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      QR Preview
                    </label>

                    <div
                      className="
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                        bg-gradient-to-br
                        from-indigo-50
                        to-pink-50
                        flex
                        flex-col
                        items-center
                        justify-center
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-white
                          flex
                          items-center
                          justify-center
                          shadow-sm
                          mb-3
                        "
                      >
                        <MdQrCode2 className="text-2xl text-indigo-600" />
                      </div>

                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected QR Code"
                        className="w-28 h-28 object-contain rounded-xl bg-white p-2 border"
                      />

                      <p className="text-xs text-gray-500 mt-3 text-center break-all">
                        {selectedImage.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Description
                </label>

                <textarea
                  name="description"
                  placeholder="Enter inventory description..."
                  rows={6}
                  onChange={handleInputChange}
                  required
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    resize-none
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                    transition-all
                  "
                />
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => navigate("/inventory")}
                  className="
                    px-6
                    py-3
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    text-sm
                    font-medium
                    hover:bg-gray-50
                    transition-all
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loadingInventory}
                  className="
                    px-6
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-indigo-500
                    via-purple-500
                    to-pink-500
                    text-white
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                >
                  {loadingInventory ? "Saving..." : "Create Inventory"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddInventory;
