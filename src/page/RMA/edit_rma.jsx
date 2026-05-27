/** @format */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams,useSearchParams } from "react-router-dom";

import {
  MdEdit,
  MdSave,
  MdClose,
  MdArrowBack,
  MdInventory2,
  MdLocalShipping,
  MdOutlineQrCode2,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getClientEquipmentById } from "../../actions/clientEquipment";
import { getLocationById } from "../../actions/locationActions";

import {
  getRMADetails,
  updateNotes,
  updateRMA,
} from "../../actions/rmaActions";

import Loader from "../../Images/ZZ5H.gif";

import RmaImages from "../../Components/RmaImages";
import RmaNotes from "../../Components/RmaNotes";

export default function EditRma() {
  const { rmaId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();
const [searchParams] = useSearchParams();
  const { user_type } = useSelector((state) => state.user.user);

  const { technicianAccess } = useSelector((state) => state.user);

  const [isEditing, setIsEditing] = useState(false);

  const [notes, setNotes] = useState([]);

  const [rmaImages, setRmaImages] = useState([]);

  const [formData, setFormData] = useState({
    rma_id: rmaId,
    client_equipment_id: "",
    service_ticket_id: "",
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
    rma_number: "",
    status: "",
  });

  const location = useSelector((state) => state.location.location);

  const loading = useSelector((state) => state.rma.loading);

  const rmaDetails = useSelector((state) => state.rma.rmaDetails);

  const loadingDetails = useSelector((state) => state.rma.loadingDetails);

  useEffect(() => {
    if (rmaId) {
      dispatch(getRMADetails(rmaId)).then((data) => {
        if (data) {
          setFormData({
            rma_id: rmaId,
            client_equipment_id: data.client_equipment_id || "",

            service_ticket_id: data?.service_ticket_id || "",

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

            rma_number: data?.rma_number || "",

            status: data?.status || "",

            aprooved_date: formatDateToYYYYMMDD(data.aprooved_date),

            outbound_date_shipped: formatDateToYYYYMMDD(
              data.outbound_date_shipped,
            ),

            inbound_date_shipped: formatDateToYYYYMMDD(
              data.inbound_date_shipped,
            ),

            date_received: formatDateToYYYYMMDD(data.date_received),
          });

          setNotes(data.rma_notes || []);

          setRmaImages(data?.rma_attachments || []);

          if (data.client_equipment_id) {
            dispatch(getClientEquipmentById(data.client_equipment_id));
          }

          if (data.location_id) {
            dispatch(getLocationById(data.location_id));
          }
        }
      });
    }
  }, [rmaId, dispatch]);

  useEffect(() => {
    if (location) {
      setFormData((prev) => ({
        ...prev,
        location_name: location.address_line_one || "",
      }));
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return "";

    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day}`;
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedData = {
      ...formData,

      aprooved_date: formatDateToDDMMYYYY(formData.aprooved_date),

      outbound_date_shipped: formatDateToDDMMYYYY(
        formData.outbound_date_shipped,
      ),

      inbound_date_shipped: formatDateToDDMMYYYY(formData.inbound_date_shipped),

      date_received: formatDateToDDMMYYYY(formData.date_received),
    };

    const filteredData = Object.fromEntries(
      Object.entries(formattedData).filter(([_, value]) => value !== ""),
    );

    try {
      await dispatch(updateRMA(filteredData, navigate));

      setIsEditing(false);
    } catch (error) {
      console.error("Error updating RMA", error);
    }
  };

  const getFilteredNote = (note) => {
    const allowedFields = ["rma_id", "comments", "created_by"];

    const filteredNote = {};

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(note, field)) {
        filteredNote[field] = note[field];
      }
    });

    return filteredNote;
  };

  const handleSaveNote = (index) => {
    const note = notes[index];

    const filteredNote = getFilteredNote(notes[index]);

    dispatch(updateNotes(filteredNote, note?.["note_id"]));
  };

  const handleNoteChange = (index, e) => {
    const { name, value } = e.target;

    const updatedNotes = [...notes];

    updatedNotes[index] = {
      ...updatedNotes[index],
      [name]: value,
    };

    setNotes(updatedNotes);
  };

  const handleCancel = () => {
    setIsEditing(false);

    dispatch(getRMADetails(rmaId));
    
  };

  const newAccess = [
    ...technicianAccess,
    "Subcontractor_User",
    "Subcontractor",
  ];

  const renderInput = (label, name, type = "text", readOnly = false) => (
    <div>
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        disabled={!isEditing}
        readOnly={readOnly}
        className={`
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
          ${!isEditing || readOnly ? "bg-gray-50 text-gray-600" : "bg-white"}
        `}
      />
    </div>
  );

  if (loadingDetails) {
    return (
      <>
        <Header />

        <div className="flex bg-gray-50 min-h-screen">
          <AdminSideNavbar />

          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <img className="w-20 h-20" src={Loader} alt="Loading..." />

              <p className="text-sm text-gray-500 mt-4">
                Loading RMA Details...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex bg-gray-50 min-h-screen">
        <AdminSideNavbar />

        <div className="flex-1 p-4 md:p-5 overflow-x-hidden">
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

            <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                  <h1 className="text-xl font-bold text-[#1E1B4B]">Edit RMA</h1>

                  <p className="text-sm text-gray-500 mt-1">
                    RMA Number: {rmaDetails?.rma_number}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate(`/device-rma?${searchParams.toString()}`)}
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    text-sm
                    font-semibold
                    hover:bg-gray-50
                    transition-all
                  "
                >
                  <MdArrowBack className="text-lg" />
                  Back
                </button>

                {newAccess?.includes(user_type) && (
                  <>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="
                          flex
                          items-center
                          gap-2
                          px-5
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
                        "
                      >
                        <MdEdit className="text-lg" />
                        Edit RMA
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSubmit}
                          className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-2xl
                            bg-green-600
                            text-white
                            text-sm
                            font-semibold
                          "
                        >
                          <MdSave className="text-lg" />
                          {loading ? "Saving..." : "Save"}
                        </button>

                        <button
                          onClick={handleCancel}
                          className="
                            flex
                            items-center
                            gap-2
                            px-5
                            py-3
                            rounded-2xl
                            border
                            border-gray-200
                            bg-white
                            text-gray-700
                            text-sm
                            font-semibold
                          "
                        >
                          <MdClose className="text-lg" />
                          Cancel
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* FORM */}
          <form className="space-y-5">
            {/* BASIC INFO */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <MdOutlineQrCode2 className="text-xl text-indigo-600" />

                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {renderInput("Approved Date", "aprooved_date", "date")}

                  {renderInput("Approved By", "aprooved_by")}

                  {renderInput("RMA Number", "rma_number")}

                  {renderInput("Client Name", "client_name", "text", true)}

                  {renderInput(
                    "Client Location",
                    "location_name",
                    "text",
                    true,
                  )}

                  {renderInput("Manufacturer", "manufacturer", "text", true)}

                  {renderInput("Model", "model", "text", true)}

                  {renderInput("Serial Number", "serial", "text", true)}

                  {/* STATUS */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Status
                    </label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      disabled={!isEditing}
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
                      <option value="Open">Open</option>

                      <option value="Approved">Approved</option>

                      <option value="Shipped back">Shipped back</option>

                      <option value="Received by manufacturer">
                        Received by manufacturer
                      </option>

                      <option value="Received replacement">
                        Received replacement
                      </option>

                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* OUTBOUND SHIPPING */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

              <div className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <MdLocalShipping className="text-xl text-blue-600" />

                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Outbound Shipping
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {renderInput("Shipping Method", "outbound_shipping_method")}

                  {renderInput("Date Shipped", "outbound_date_shipped", "date")}

                  {renderInput("Tracking Number", "outbound_tracking")}

                  {renderInput("Shipped By", "shipped_by")}
                </div>
              </div>
            </div>

            {/* INBOUND SHIPPING */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />

              <div className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <MdLocalShipping className="text-xl text-purple-600" />

                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Inbound Shipping
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {renderInput("Shipping Method", "inbound_shipping_method")}

                  {renderInput("Date Shipped", "inbound_date_shipped", "date")}

                  {renderInput("Tracking Number", "inbound_tracking")}

                  {renderInput("Received Date", "date_received", "date")}

                  {renderInput("Received By", "received_by")}
                </div>
              </div>
            </div>
          </form>

          {/* IMAGES */}
          <div className="mt-5">
            <RmaImages images={rmaImages} rmaId={rmaId} />
          </div>

          {/* NOTES */}
          <div className="mt-5">
            <RmaNotes
              notes={notes}
              loading={loading}
              rmaId={rmaId}
              handleSaveNote={handleSaveNote}
              handleNoteChange={handleNoteChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
