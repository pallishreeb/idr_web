/** @format */

import { useEffect, useState } from "react";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { useDispatch, useSelector } from "react-redux";

import {
  getIdrEquipmentById,
  updateEquipment,
} from "../../actions/idrEquipmentAction";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import Loader from "../../Images/ZZ5H.gif";

import {
  MdDevices,
  MdArrowBack,
  MdEdit,
  MdSave,
  MdQrCode2,
} from "react-icons/md";

const EditEquipment = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const type = queryParams.get("type");

  const { idr_equipment_id } = useParams();

  const [loading, setLoading] = useState(false);

  const [editableFields, setEditableFields] = useState({
    serial_number: "",
    make: "",
    model: "",
    device_type: "",
    mac_address: "",
    location_name: "",
    description: "",
    location_id: "",
  });

  const [readOnlyFields, setReadOnlyFields] = useState({
    image: "",
    serial_number: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const { user_type } = useSelector((state) => state.user.user);

  const { access } = useSelector((state) => state.user);

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations,
  );

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (idr_equipment_id) {
      setLoading(true);

      dispatch(getIdrEquipmentById(idr_equipment_id))
        .then((data) => {
          setLoading(false);

          setEditableFields({
            serial_number: data?.serial_number,

            make: data?.make,

            model: data?.model,

            device_type: data?.device_type,

            mac_address: data?.mac_address,

            location_name: data?.location_name,

            location_id: data?.location_id,

            description: data?.description,
          });

          setReadOnlyFields({
            image: data?.qr_image,

            serial_number: data?.serial_number,
          });
        })
        .catch((error) => {
          setLoading(false);

          console.error("Error fetching equipment item:", error);
        });
    }

    dispatch(getLocationInventory());
  }, [dispatch, idr_equipment_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditableFields((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const selectedLocation = locationsInventory.find(
      (loc) => loc.location === e.target.value,
    );

    setEditableFields((prevData) => ({
      ...prevData,
      location_name: selectedLocation.location,
      location_id: selectedLocation.inventory_location_id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    editableFields.equipment_id = idr_equipment_id;

    dispatch(updateEquipment(editableFields, navigate, location.state));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <img className="w-20 h-20" src={Loader} alt="Loading..." />

          <p className="text-sm text-gray-500 mt-3">
            Loading equipment details...
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
                  <MdDevices className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Edit IDR Equipment
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    View and manage equipment information
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap gap-3">
                {access.includes(user_type) &&
                  !isEditing &&
                  type !== "assign" && (
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
                    navigate("/idr-equipment", {
                      state: location.state,
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
              {/* HEADER */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Equipment Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review and update equipment information
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
                      disabled={loading}
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

                      {loading ? "Saving..." : "Update"}
                    </button>
                  </div>
                )}
              </div>

              {/* FORM GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* SERIAL NUMBER */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Serial Number
                  </label>

                  <input
                    name="serial_number"
                    type="text"
                    value={readOnlyFields.serial_number}
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
                    name="model"
                    type="text"
                    value={editableFields.model}
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

                {/* MAC ADDRESS */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    MAC Address
                  </label>

                  <input
                    name="mac_address"
                    type="text"
                    value={editableFields.mac_address}
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

                  {isEditing ? (
                    <select
                      name="location"
                      value={editableFields.location_name}
                      onChange={handleLocationChange}
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
                  ) : (
                    <input
                      type="text"
                      value={editableFields.location_name}
                      disabled
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
                  )}
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
                      src={`https://idr-app-images-bucket.s3.amazonaws.com/${readOnlyFields.image}`}
                      alt="QR Code"
                      className="w-28 h-28 object-contain rounded-xl bg-white p-2 border"
                    />
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
                    onChange={handleInputChange}
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

export default EditEquipment;
