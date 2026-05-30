/** @format */

import { useNavigate, useLocation } from "react-router-dom";

import { useEffect, useState, useRef } from "react";

import {
  MdCloudUpload,
  MdDevices,
  MdArrowBack,
  MdQrCode2,
  MdSave,
} from "react-icons/md";
import QRCode from "qrcode";
import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { useDispatch, useSelector } from "react-redux";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import { addIdrEquipment } from "../../actions/idrEquipmentAction";

const AddIdrEquipment = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const locationState = useLocation();

  const [selectedImage, setSelectedImage] = useState(null);
  const [qrPreview, setQrPreview] = useState("");

  const debounceRef = useRef(null);
  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations,
  );

  const loading = useSelector((state) => state.idrequipment.loading);

  const [formData, setFormData] = useState({
    serial_number: "",
    make: "",
    model: "",
    device_type: "",
    mac_address: "",
    location_name: "",
    location_id: "",
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

    // Remove QR if empty
    if (!formData.serial_number?.trim()) {
      setQrPreview("");
      return;
    }

    // Debounced QR generation
    debounceRef.current = setTimeout(async () => {
      try {
        const qrUrl = await QRCode.toDataURL(formData.serial_number, {
          width: 300,
          margin: 2,
        });

        setQrPreview(qrUrl);
      } catch (error) {
        console.error("QR generation failed:", error);
      }
    }, 500);

    return () => clearTimeout(debounceRef.current);
  }, [formData.serial_number]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
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

  const handleLocationChange = (e) => {
    const selectedLocation = locationsInventory.find(
      (loc) => loc.location === e.target.value,
    );

    setFormData((prevData) => ({
      ...prevData,
      location_name: selectedLocation.location,
      location_id: selectedLocation.inventory_location_id,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const data = new FormData();

  //   Object.keys(formData).forEach((key) => {
  //     data.append(key, formData[key]);
  //   });

  //   dispatch(addIdrEquipment(data, navigate, locationState.state));
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let qrFile = null;

      // Generate QR image from serial number
      if (qrPreview) {
        const response = await fetch(qrPreview);

        const blob = await response.blob();

        qrFile = new File([blob], `${formData.serial_number}-qr.png`, {
          type: "image/png",
        });
      }

      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        // Skip old image upload field
        if (key !== "image") {
          data.append(key, formData[key]);
        }
      });

      // Append generated QR image
      if (qrFile) {
        data.append("image", qrFile);
      }

      dispatch(addIdrEquipment(data, navigate, locationState.state));
    } catch (error) {
      console.error("Error creating equipment:", error);
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
                  <MdDevices className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Add New IDR Equipment
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Create and manage a new company equipment item
                  </p>
                </div>
              </div>

              {/* BACK */}
              <button
                type="button"
                onClick={() =>
                  navigate("/idr-equipment", {
                    state: locationState.state,
                  })
                }
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
            {/* TOP BORDER */}
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-5">
              {/* FORM HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Equipment Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Fill all required equipment details
                  </p>
                </div>

                {/* SAVE BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                      flex
                      items-center
                      gap-2
                      px-5
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
                  <MdSave className="text-lg" />

                  {loading ? "Saving..." : "Create Equipment"}
                </button>
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[
                  {
                    name: "serial_number",
                    label: "Serial Number",
                    type: "text",
                    required: true,
                  },

                  {
                    name: "make",
                    label: "Make",
                    type: "text",
                    required: true,
                  },

                  {
                    name: "model",
                    label: "Model",
                    type: "text",
                    required: true,
                  },

                  {
                    name: "device_type",
                    label: "Device Type",
                    type: "text",
                    required: true,
                  },

                  {
                    name: "mac_address",
                    label: "MAC Address",
                    type: "text",
                    required: false,
                  },
                ].map(({ name, label, type, required }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      {label}
                    </label>

                    <input
                      name={name}
                      type={type}
                      placeholder={`Enter ${label.toLowerCase()}`}
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
                          "
                      onChange={handleInputChange}
                      required={required}
                    />
                  </div>
                ))}

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <select
                    name="location_name"
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
                      "
                    onChange={handleLocationChange}
                    required
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

                {/* QR UPLOAD */}
                {/* <div className="xl:col-span-2">
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    QR Code Image
                  </label>

                  <label
                    className="
                        border-2
                        border-dashed
                        border-indigo-200
                        rounded-2xl
                        p-6
                        bg-indigo-50/40
                        hover:bg-indigo-50
                        transition-all
                        flex
                        flex-col
                        items-center
                        justify-center
                        cursor-pointer
                        min-h-[150px]
                        relative
                        overflow-hidden
                      "
                  >
                    <input
                      name="image"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleInputChange}
                      required
                    />

                    {!selectedImage ? (
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
                          <MdCloudUpload className="text-3xl text-indigo-600" />
                        </div>

                        <p className="text-sm font-semibold text-[#1E1B4B]">
                          Click to upload QR code
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG or JPEG
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div
                          className="
                              w-12
                              h-12
                              rounded-2xl
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
                          alt="Selected QR"
                          className="
                              w-28
                              h-28
                              object-cover
                              rounded-2xl
                              border
                              border-gray-200
                              bg-white
                              p-2
                            "
                        />

                        <p className="text-xs text-gray-600 mt-3 font-medium text-center">
                          {selectedImage.name}
                        </p>
                      </div>
                    )}
                  </label>
                </div> */}
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
                          QR generated automatically from serial number
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
                          Enter serial number to generate QR code
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {/* DESCRIPTION */}
                <div className="md:col-span-2 xl:col-span-3">
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    placeholder="Enter equipment description..."
                    rows={5}
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
                      "
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* BOTTOM ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    navigate("/idr-equipment", {
                      state: locationState.state,
                    })
                  }
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
                  disabled={loading}
                  className="
                      flex
                      items-center
                      justify-center
                      gap-2
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
                  <MdSave className="text-lg" />

                  {loading ? "Saving..." : "Create Equipment"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddIdrEquipment;
