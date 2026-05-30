/** @format */

import { useNavigate,useSearchParams } from "react-router-dom";

import { useEffect, useState,useRef } from "react";

import {
  MdCloudUpload,
  MdInventory2,
  MdArrowBack,
  MdQrCode2,
} from "react-icons/md";
import QRCode from "qrcode";
import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { useDispatch, useSelector } from "react-redux";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import { addInventory } from "../../actions/inventoryAction";

const AddInventory = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
const [searchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
const [qrPreview, setQrPreview] = useState("");

const debounceRef = useRef(null);
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
    // image: null,
  });

  useEffect(() => {
    dispatch(getLocationInventory());
  }, [dispatch]);
useEffect(() => {
  // Clear previous timer
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }

  // If model empty remove QR
  if (!formData.model?.trim()) {
    setQrPreview("");
    return;
  }

  // Debounce QR generation
  debounceRef.current = setTimeout(async () => {
    try {
      const qrUrl = await QRCode.toDataURL(
        formData.model,
        {
          width: 300,
          margin: 2,
        },
      );

      setQrPreview(qrUrl);
    } catch (error) {
      console.error("QR generation failed:", error);
    }
  }, 500);

  return () => clearTimeout(debounceRef.current);
}, [formData.model]);
  // const handleInputChange = (e) => {
  //   const { name, value, files } = e.target;

  //   if (files) {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: files[0],
  //     }));

  //     const file = e.target.files[0];

  //     setSelectedImage(file);
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };
const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
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

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const data = new FormData();

  //   Object.keys(formData).forEach((key) => {
  //     data.append(key, formData[key]);
  //   });

  //   dispatch(addInventory(data, navigate));
  // };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let qrFile = null;

    // Convert generated QR to file
    if (qrPreview) {
      const response = await fetch(qrPreview);

      const blob = await response.blob();

      qrFile = new File(
        [blob],
        `${formData.model}-qr.png`,
        {
          type: "image/png",
        },
      );
    }

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Append generated QR image
    if (qrFile) {
      data.append("image", qrFile);
    }

    dispatch(addInventory(data, navigate));
  } catch (error) {
    console.error("Error creating inventory:", error);
  }
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-gradient-to-r
                   from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
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
                onClick={() => navigate(`/inventory?${searchParams.toString()}`)}
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

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
                {/* <div>
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
                </div> */}

                {/* PREVIEW */}
                {/* {selectedImage && (
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
                )} */}

                {/* AUTO GENERATED QR */}
<div className="xl:col-span-2">
  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
    Auto Generated QR Code
  </label>

  <div
    className="
      border-2
      border-dashed
      border-indigo-200
      rounded-2xl
      p-6
      bg-indigo-50/40
      min-h-[220px]
      flex
      flex-col
      items-center
      justify-center
    "
  >
    {qrPreview ? (
      <>
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
            mb-4
          "
        >
          <MdQrCode2 className="text-3xl text-indigo-600" />
        </div>

        <img
          src={qrPreview}
          alt="Generated QR"
          className="
            w-44
            h-44
            object-contain
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-3
          "
        />

        <p className="text-sm text-gray-600 mt-4 font-medium">
          QR generated automatically from model
        </p>
      </>
    ) : (
      <>
        <div
          className="
            w-14
            h-14
            rounded-2xl
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
            mb-3
          "
        >
          <MdQrCode2 className="text-3xl text-indigo-400" />
        </div>

        <p className="text-sm font-medium text-gray-500">
          Enter model to generate QR code
        </p>
      </>
    )}
  </div>
</div>
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
                  onClick={() => navigate(`/inventory?${searchParams.toString()}`)}
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
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
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
