import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getIdrEquipmentById, updateEquipment } from "../../actions/idrEquipmentAction"; 
import { getLocationInventory } from "../../actions/locationsInventoryAction";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Images/ZZ5H.gif";

const EditEquipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { equipment_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [editableFields, setEditableFields] = useState({
    serial_number: "",
    label: "",
    make: "",
    model: "",
    device_type: "",
    mac_address: "",
    location: "",
    description: "",
    location_id: "",
  });

  const [readOnlyFields, setReadOnlyFields] = useState({
    qr_code: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const { user_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations
  );

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    if (equipment_id) {
      setLoading(true);
      dispatch(getIdrEquipmentById(equipment_id))
        .then((data) => {
          setLoading(false);
          setEditableFields({
            serial_number: data.serial_number,
            label: data.label,
            make: data.make,
            model: data.model,
            device_type: data.device_type,
            mac_address: data.mac_address,
            location: data.location,
            location_id: data.location_id,
            description: data.description,
          });
          setReadOnlyFields({
            qr_code: data.qr_code,
          });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching equipment item:", error);
        });
    }
    dispatch(getLocationInventory()); // Fetch locations
  }, [dispatch, equipment_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const selectedLocation = locationsInventory.find(
      (loc) => loc.location === e.target.value
    );
    setEditableFields((prevData) => ({
      ...prevData,
      location: selectedLocation.location,
      location_id: selectedLocation.inventory_location_id,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editableFields.equipment_id = equipment_id;
    dispatch(updateEquipment(editableFields, navigate));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img className="w-20 h-20" src={Loader} alt="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-8 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-lg">Edit IDR Equipment Item</h1>
            <div className="flex gap-2">
              {(access.includes(user_type) && !isEditing) && (
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded"
                  onClick={handleEditToggle}
                >
                  Edit
                </button>
              )}
              <button
                type="button"
                className="border py-2 px-4 rounded"
                onClick={() => navigate("/idr-equipment")}
              >
                Back
              </button>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col mt-4 border py-7 px-5 bg-white gap-6"
          >
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-normal">Details</h1>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="border py-2 px-4 rounded"
                    onClick={handleEditToggle}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="border bg-indigo-600 py-2 px-4 text-white rounded"
                    disabled={loading}
                  >
                    {loading ? "Saving" : "Update"}
                  </button>
                </div>
              )}
            </div>
            <div className="border border-gray-200 mb-4"></div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Serial Number</label>
                <input
                  name="serial_number"
                  type="text"
                  value={editableFields.serial_number}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Label</label>
                <input
                  name="label"
                  type="text"
                  value={editableFields.label}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Make</label>
                <input
                  name="make"
                  type="text"
                  value={editableFields.make}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Model</label>
                <input
                  name="model"
                  type="text"
                  value={editableFields.model}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Device Type</label>
                <input
                  name="device_type"
                  type="text"
                  value={editableFields.device_type}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Mac Address</label>
                <input
                  name="mac_address"
                  type="text"
                  value={editableFields.mac_address}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Location</label>
                {isEditing ? (
                  <select
                    name="location"
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                    onChange={handleLocationChange}
                    value={editableFields.location}
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
                    name="location"
                    type="text"
                    value={editableFields.location}
                    className="px-3 border border-gray-200 h-10 text-sm rounded"
                    disabled
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">QR Code</label>
                <img
                  src={`https://idr-app-images-bucket.s3.amazonaws.com/${readOnlyFields.qr_code}`}
                  alt="QR Code"
                  className="w-24 h-24 object-cover rounded-md shadow"
                />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-normal text-base">Description</label>
                <textarea
                  name="description"
                  value={editableFields.description}
                  className="px-3 py-2 border border-gray-200 text-sm rounded resize-y w-full"
                  onChange={handleInputChange}
                  rows={4}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditEquipment;
