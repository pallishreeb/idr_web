/** @format */

import { useEffect, useState } from "react";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { useDispatch, useSelector } from "react-redux";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import {
  getInventoryById,
  updateInventory,
} from "../../actions/inventoryAction";

import { useNavigate, useParams, useLocation,useSearchParams } from "react-router-dom";

import Loader from "../../Images/ZZ5H.gif";

import {
  MdInventory2,
  MdArrowBack,
  MdEdit,
  MdSave,
  MdQrCode2,
} from "react-icons/md";

const EditInventory = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const location = useLocation();

  // const previousFilters = location.state;

  const { inventory_id } = useParams();

  const [selectedImage, setSelectedImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const loadingInventory = useSelector((state) => state.inventory.loading);

  const availableLocations = useSelector(
    (state) => state.locationInventory.locations,
  );

  const [editableFields, setEditableFields] = useState({
    quantity: "",
    description: "",
    make: "",
    device_type: "",
    color: "",
    size: "",
    location_id: "",
  });

  const [readOnlyFields, setReadOnlyFields] = useState({
    model: "",
    qr: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const { user_type } = useSelector((state) => state.user.user);

  const { access } = useSelector((state) => state.user);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    dispatch(getLocationInventory());

    if (inventory_id) {
      setLoading(true);

      dispatch(getInventoryById(inventory_id))
        .then((data) => {
          setLoading(false);

          setEditableFields({
            quantity: data.quantity,
            description: data.description,
            make: data.make,
            device_type: data.device_type,
            color: data.color,
            size: data.size,
            location_id: data.location_id,
          });

          setReadOnlyFields({
            model: data.model,
            qr: data.qr,
          });
        })
        .catch((error) => {
          setLoading(false);

          console.error("Error fetching inventory item:", error);
        });
    }
  }, [dispatch, inventory_id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setReadOnlyFields((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));

      const file = e.target.files[0];

      setSelectedImage(file);
    } else {
      setEditableFields((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleLocationChange = (e) => {
    const selectedLocation = availableLocations.find(
      (loc) => loc.inventory_location_id === e.target.value,
    );

    setEditableFields((prevData) => ({
      ...prevData,
      location: selectedLocation.location,
      location_id: selectedLocation.inventory_location_id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    editableFields.inventory_id = inventory_id;

    dispatch(
  updateInventory(
    editableFields,
    navigate,
    searchParams.toString(),
  ),
);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <img className="w-20 h-20" src={Loader} alt="Loading..." />

          <p className="text-sm text-gray-500 mt-3">
            Loading inventory details...
          </p>
        </div>
      </div>
    );
  }

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
                    Edit Inventory Item
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    View and manage inventory information
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                {access.includes(user_type) && !isEditing && (
                  <button
                    onClick={handleEditToggle}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2.5
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
                    <MdEdit className="text-lg" />
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/inventory?${searchParams.toString()}`)
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
              {/* FORM HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Inventory Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review and update inventory information
                  </p>
                </div>

                {isEditing && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="
                        px-5
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
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={loadingInventory}
                      className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-2.5
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
                      <MdSave className="text-lg" />

                      {loadingInventory ? "Saving..." : "Update"}
                    </button>
                  </div>
                )}
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* MAKE */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Make
                  </label>

                  <input
                    name="make"
                    type="text"
                    value={editableFields.make}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* MODEL */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Model
                  </label>

                  <input
                    type="text"
                    value={readOnlyFields.model}
                    readOnly
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-gray-100
                      text-gray-500
                    "
                  />
                </div>

                {/* DEVICE TYPE */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Device Type
                  </label>

                  <input
                    name="device_type"
                    type="text"
                    value={editableFields.device_type}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* COLOR */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Color
                  </label>

                  <input
                    name="color"
                    type="text"
                    value={editableFields.color}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* SIZE */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Size
                  </label>

                  <input
                    name="size"
                    type="text"
                    value={editableFields.size}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Location
                  </label>

                  <select
                    name="location_id"
                    value={editableFields.location_id}
                    onChange={handleLocationChange}
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  >
                    <option value="">Select location</option>

                    {availableLocations?.map((location) => (
                      <option
                        key={location.inventory_location_id}
                        value={location.inventory_location_id}
                      >
                        {location.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Quantity
                  </label>

                  <input
                    name="quantity"
                    type="number"
                    value={editableFields.quantity}
                    placeholder="Type quantity"
                    onChange={handleInputChange}
                    required
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>

                {/* QR CODE */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    QR Code
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
                      src={`https://idr-app-images-bucket.s3.amazonaws.com/${readOnlyFields.qr}`}
                      alt="QR Code"
                      className="w-28 h-28 object-contain rounded-xl bg-white p-2 border"
                    />
                  <p
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-[#1E1B4B]
                    text-center
                    break-all
                  "
                >
                  Model : {readOnlyFields.model}
                </p>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={editableFields.description}
                    placeholder="Type description"
                    onChange={handleInputChange}
                    required
                    rows={5}
                    disabled={!isEditing}
                    className="
                      w-full
                      rounded-2xl
                      border
                      border-gray-200
                      px-4
                      py-3
                      text-sm
                      resize-none
                      bg-white
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500
                    "
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditInventory;
