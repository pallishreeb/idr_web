import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClientEquipmentById } from "../../actions/clientEquipment";
import { getLocationById } from "../../actions/locationActions";
import { getRMADetails, updateRMA } from "../../actions/rmaActions";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../Images/ZZ5H.gif";
import RmaImages from "../../Components/RmaImages";
import RmaNotes from "../../Components/RmaNotes";
import { toast } from "react-toastify";

export default function EditRma() {
  const { rmaId } = useParams(); // Get RMA ID from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user_type } = useSelector((state) => state.user.user);
  const { technicianAccess } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [notes, setNotes] = useState([]);
  const [rmaImages, setRmaImages] = useState([]);
  const [formData, setFormData] = useState({
    rma_id: rmaId,
    client_equipment_id: "",
    manufacturer: "",
    client_id: "",
    location_id: "",
    client_name: "",
    location_name: "",
    model: "",
    serial: "",
    aprooved_date: "",
    aprooved_by: "",
    outbound_shipping_method: "",
    outbound_date_shipped: "",
    outbound_tracking: "",
    shipped_by: "",
    inbound_shipping_method: "",
    inbound_date_shipped: "",
    inbound_tracking: "",
    date_received: "",
    received_by: "",
    rma_number:"",
    status:"",
  });

  // Redux state
  const location = useSelector((state) => state.location.location);
  const loading = useSelector((state) => state.rma.loading);
  const rmaDetails = useSelector((state) => state.rma.rmaDetails);
  const loadingDetails = useSelector((state) => state.rma.loadingDetails);

  // Fetch RMA details on component mount
  useEffect(() => {
    if (rmaId) {
      dispatch(getRMADetails(rmaId)).then((data) => {
        if (data) {
          setFormData({
            rma_id:rmaId,
            client_equipment_id: data.client_equipment_id || "",
            manufacturer: data.manufacturer || "",
            client_id: data.client_id || "",
            client_name: data.client_name || "",
            location_id: data.location_id || "",
            location_name: data.location_name || "",
            model: data.model || "",
            serial: data.serial || "",
            aprooved_by: data.aprooved_by || "",
            outbound_shipping_method: data.outbound_shipping_method || "",
            outbound_tracking: data.outbound_tracking || "",
            shipped_by: data.shipped_by || "",
            inbound_shipping_method: data.inbound_shipping_method || "",
            inbound_tracking: data.inbound_tracking || "",
            received_by: data.received_by || "",
            rma_number:data?.rma_number || "",
            status:data?.status || "",
            aprooved_date: formatDateToYYYYMMDD(data.aprooved_date),
            outbound_date_shipped: formatDateToYYYYMMDD(data.outbound_date_shipped),
            inbound_date_shipped: formatDateToYYYYMMDD(data.inbound_date_shipped),
            date_received: formatDateToYYYYMMDD(data.date_received),
          });
          setNotes(data.rma_notes || []);
          setRmaImages(
            data?.rma_attachments || []
          );
          // Fetch client equipment details if needed
          if (data.client_equipment_id) {
            dispatch(getClientEquipmentById(data.client_equipment_id));
          }

          // Fetch location details if needed
          if (data.location_id) {
            dispatch(getLocationById(data.location_id));
          }
        }
      });
    }
  }, [rmaId, dispatch]);

  // Update form data when location is fetched
  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        location_name: location.address_line_one || "",
      }));
    }
  }, [location]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Format date from DD/MM/YYYY to YYYY-MM-DD for input fields
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY for API submission
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Format date fields
    const formattedData = {
      ...formData,
      aprooved_date: formatDateToDDMMYYYY(formData.aprooved_date),
      outbound_date_shipped: formatDateToDDMMYYYY(formData.outbound_date_shipped),
      inbound_date_shipped: formatDateToDDMMYYYY(formData.inbound_date_shipped),
      date_received: formatDateToDDMMYYYY(formData.date_received),
    };
  
    // Remove empty fields
    const filteredData = Object.fromEntries(
      Object.entries(formattedData).filter(([_, value]) => value !== "")
    );
  
    try {
      await dispatch(updateRMA(filteredData, navigate));
      setIsEditing(false); // Disable editing after submission
    } catch (error) {
      console.error("Error updating RMA", error);
    }
  };
  

  // Handle cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    dispatch(getRMADetails(rmaId)); // Reset form data to original values
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        {loadingDetails ? (
                  <div className="container mx-auto p-4">
                    <div className="flex justify-center items-center h-screen">
                     <img className="w-20 h-20" src={Loader} alt="Loading..." />
                   </div>
                   </div>
                ) : (
        <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit RMA :  {rmaDetails?.rma_number}</h2>
            {technicianAccess?.includes(user_type) &&
            <div>
              {(!isEditing) ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                   type="button"
                    form="rma-form"
                    className="bg-indigo-600 text-white px-4 py-2 rounded m-2"
                    onClick={handleSubmit}
                  >
                    {loading ? "Saving" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>}
          </div>
          <form id="rma-form">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="aprooved_date" className="mr-2">
                  Date RMA Approved:
                </label>
                <input
                  type="date"
                  id="aprooved_date"
                  name="aprooved_date"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.aprooved_date}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="aprooved_by" className="mr-2">
                  RMA Approved By:
                </label>
                <input
                  type="text"
                  id="aprooved_by"
                  name="aprooved_by"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.aprooved_by}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="rma_number" className="mr-2">
                  RMA Number:
                </label>
                <input
                  type="text"
                  id="rma_number"
                  name="rma_number"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.rma_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="client_name" className="mr-2">
                  Client Name:
                </label>
                <input
                  type="text"
                  id="client_name"
                  name="client_name"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.client_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="location_name" className="mr-2">
                  Client Location:
                </label>
                <input
                  type="text"
                  id="location_name"
                  name="location_name"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.location_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  readOnly
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="manufacturer" className="mr-2">
                  Manufacturer:
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.manufacturer}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="model" className="mr-2">
                  Model:
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.model}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  readOnly
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="serial" className="mr-2">
                  Serial Number:
                </label>
                <input
                  type="text"
                  id="serial"
                  name="serial"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.serial}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  readOnly
                />
              </div>
            </div>
            {/* Outbound Shipping Section */}
            <h2 className="text-xl font-semibold mb-2">Outbound Shipping</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="outbound_shipping_method" className="mr-2">
                  Outbound Shipping Method:
                </label>
                <input
                  type="text"
                  id="outbound_shipping_method"
                  name="outbound_shipping_method"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.outbound_shipping_method}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="outbound_date_shipped" className="mr-2">
                  Outbound Date Shipped:
                </label>
                <input
                  type="date"
                  id="outbound_date_shipped"
                  name="outbound_date_shipped"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.outbound_date_shipped}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="outbound_tracking" className="mr-2">
                  Outbound Tracking:
                </label>
                <input
                  type="text"
                  id="outbound_tracking"
                  name="outbound_tracking"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.outbound_tracking}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="shipped_by" className="mr-2">
                  Shipped By:
                </label>
                <input
                  type="text"
                  id="shipped_by"
                  name="shipped_by"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.shipped_by}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            {/* Inbound Shipping Section */}
            <h2 className="text-xl font-semibold mb-2">Inbound Shipping</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="inbound_shipping_method" className="mr-2">
                  Inbound Shipping Method:
                </label>
                <input
                  type="text"
                  id="inbound_shipping_method"
                  name="inbound_shipping_method"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.inbound_shipping_method}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="inbound_date_shipped" className="mr-2">
                  Inbound Date Shipped:
                </label>
                <input
                  type="date"
                  id="inbound_date_shipped"
                  name="inbound_date_shipped"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.inbound_date_shipped}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="inbound_tracking" className="mr-2">
                  Inbound Tracking:
                </label>
                <input
                  type="text"
                  id="inbound_tracking"
                  name="inbound_tracking"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.inbound_tracking}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col mb-4">
                <label htmlFor="date_received" className="mr-2">
                  Date Received:
                </label>
                <input
                  type="date"
                  id="date_received"
                  name="date_received"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.date_received}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="flex flex-col mb-4">
                <label htmlFor="received_by" className="mr-2">
                  Received By:
                </label>
                <input
                  type="text"
                  id="received_by"
                  name="received_by"
                  className="border border-gray-300 rounded px-3 py-1 w-full"
                  value={formData.received_by}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col mb-4">
              <label htmlFor="status" className="mr-2">
                Status:
              </label>
              <select
                id="status"
                name="status"
                className="border border-gray-300 rounded px-3 py-1 w-full"
                value={formData.status}
                onChange={handleChange}
                disabled={!isEditing}
              >
                <option value="Open">Open</option>
                <option value="Approved">Approved</option>
                <option value="Shipped back">Shipped back</option>
                <option value="Received by manufacturer">Received by manufacturer</option>
                <option value="Received replacement">Received replacement</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            </div>
          </form>

                    {/* Show Images  */}
          <RmaImages
            images={rmaImages}
            rmaId={rmaId}
          />

          {/* Ticket Notes */}
          <RmaNotes
            notes={notes}
            loading={loading}
            rmaId={rmaId}
          />
        </div>)}
      </div>
    </>
  );
}