import { useEffect, useState } from "react";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getLocationInventory } from "../../actions/locationsInventoryAction";
import {
  getInventoryById,
  updateInventory,
} from "../../actions/inventoryAction";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Images/ZZ5H.gif";

const EditInventory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { inventory_id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false); // State to track loading status
  const loadingInventory = useSelector((state) => state.inventory.loading);

  const [editableFields, setEditableFields] = useState({
    quantity: "",
    label: "",
    sku: "",
    description: "",
  });

  const [readOnlyFields, setReadOnlyFields] = useState({
    make: "",
    model: "",
    device_type: "",
    color: "",
    size: "",
    location: "",
    location_id: "",
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
          // Extract editable fields
          setEditableFields({
            quantity: data.quantity,
            label: data.label,
            sku: data.sku,
            description: data.description,
          });
          // Extract read-only fields
          setReadOnlyFields({
            make: data.make,
            model: data.model,
            device_type: data.device_type,
            color: data.color,
            size: data.size,
            location: data.location,
            location_id: data.location_id,
            qr: data.qr, // Assuming this is how you handle image data
          });
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error fetching inventory item:", error);
          // Handle error, e.g., show an error message
        });
    }
  }, [dispatch, inventory_id]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setReadOnlyFields((prevData) => ({ ...prevData, [name]: files[0] }));
      const file = e.target.files[0];
      setSelectedImage(file);
    } else {
      setEditableFields((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editableFields.inventory_id = inventory_id;
    dispatch(updateInventory(editableFields, navigate));
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
            <h1 className="font-bold text-lg">Edit Inventory Item</h1>
            <div className="flex gap-2">
            { (access.includes(user_type) && !isEditing) && (
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
                    onClick={() => navigate("/inventory")}
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
                    disabled={loadingInventory}
                  >
                    {loadingInventory ? "Saving" : "Update"}
                  </button>
                </div>
              )}
            </div>
            <div className="border border-gray-200 mb-4"></div>
            <div className="grid grid-cols-2 gap-8">
              {/* Read-only fields */}
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Make</label>
                <input
                  type="text"
                  value={readOnlyFields.make}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Model</label>
                <input
                  type="text"
                  value={readOnlyFields.model}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Device Type</label>
                <input
                  type="text"
                  value={readOnlyFields.device_type}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Color</label>
                <input
                  type="text"
                  value={readOnlyFields.color}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Size</label>
                <input
                  type="text"
                  value={readOnlyFields.size}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Location</label>
                <input
                  type="text"
                  value={readOnlyFields.location}
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  readOnly
                />
              </div>

              {/* Editable fields */}
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={editableFields.quantity}
                  placeholder="Type quantity"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">Label</label>
                <input
                  name="label"
                  type="text"
                  value={editableFields.label}
                  placeholder="Type label"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">SKU</label>
                <input
                  name="sku"
                  type="text"
                  value={editableFields.sku}
                  placeholder="Type SKU"
                  className="px-3 border border-gray-200 h-10 text-sm rounded"
                  onChange={handleInputChange}
                  required
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-normal text-base">QR code</label>
 
                    <img
                      src={`https://idr-app-images-bucket.s3.amazonaws.com/${readOnlyFields.qr}`}
                      alt="QR Code"
                      className="w-24 h-24 object-cover rounded-md shadow"
                    />

              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-normal text-base">Description</label>
                <textarea
                  name="description"
                  value={editableFields.description}
                  placeholder="Type description"
                  className="px-3 py-2 border border-gray-200 text-sm rounded resize-y w-full col-span-2"
                  onChange={handleInputChange}
                  required
                  rows={4} // Adjust rows as needed
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

export default EditInventory;
