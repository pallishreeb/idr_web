/** @format */

import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams, useLocation } from "react-router-dom";

import {
  MdAssignment,
  MdArrowBack,
  MdBusiness,
  MdLocationOn,
  MdPrecisionManufacturing,
  MdQrCode2,
  MdCalendarToday,
  MdPerson,
  MdSave,
} from "react-icons/md";

import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getClientEquipmentById } from "../../actions/clientEquipment";

import { getLocationById } from "../../actions/locationActions";

import { generateRMA } from "../../actions/rmaActions";

import Loader from "../../Images/ZZ5H.gif";

export default function AddRma() {
  const { clientEquipmentId } = useParams();

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const locationState = useLocation();

  const { state } = locationState;

  const loadingEquipmentDetails = useSelector(
    (state) => state.clientEquipment.loadingDetails,
  );

  const location = useSelector((state) => state.location.location);

  const loading = useSelector((state) => state.rma.loading);

  const [formData, setFormData] = useState({
    client_equipment_id: clientEquipmentId || "",

    service_ticket_id: state?.serviceTicketId || "",

    manufacturer: "",

    client_id: "",

    location_id: "",

    client_name: "",

    location_name: "",

    model: "",

    serial: "",

    aprooved_date: "",

    aprooved_by: "",

    rma_number: "",
  });

  useEffect(() => {
    if (clientEquipmentId) {
      dispatch(getClientEquipmentById(clientEquipmentId)).then((data) => {
        if (data) {
          setFormData((prev) => ({
            ...prev,

            manufacturer: data.manufacturer || "",

            client_id: data.client_id || "",

            client_name: data.client_name || "",

            location_id: data.location_id || "",

            location_name: data.location_name || "",

            model: data.model || "",

            serial: data.serial_number || "",
          }));

          if (data.location_id) {
            dispatch(getLocationById(data.location_id));
          }
        }
      });
    }
  }, [clientEquipmentId, dispatch]);

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
    };
// Remove service_ticket_id if not available
  if (!formattedData.service_ticket_id) {
    delete formattedData.service_ticket_id;
  }

    try {
      dispatch(generateRMA(formattedData, navigate));
    } catch (error) {
      console.error("Error submitting RMA", error);
    }
  };

  const renderInput = (label, name, icon, type = "text", readOnly = false) => (
    <div>
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        {label}
      </label>

      <div className="relative">
        <div
          className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
        >
          {icon}
        </div>

        <input
          type={type}
          id={name}
          name={name}
          className={`
              w-full
              rounded-2xl
              border
              border-gray-200
              pl-10
              pr-4
              py-3
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500
              ${readOnly ? "bg-gray-50 text-gray-600" : "bg-white"}
            `}
          value={formData[name]}
          onChange={handleChange}
          required
          readOnly={readOnly}
        />
      </div>
    </div>
  );

  if (loadingEquipmentDetails) {
    return (
      <>
        <Header />

        <div className="flex bg-gray-50 min-h-screen">
          <AdminSideNavbar />

          <div className="flex-1 flex justify-center items-center">
            <div className="flex flex-col items-center">
              <img className="w-20 h-20" src={Loader} alt="Loading..." />

              <p className="text-sm text-gray-500 mt-4">
                Loading equipment details...
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
                  <MdAssignment className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-[#1E1B4B]">
                    Create RMA
                  </h1>

                  <p className="text-sm text-gray-500 mt-1">
                    Create Return Merchandise Authorization for device
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(-1)}
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
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-5 space-y-8">
              {/* RMA INFO */}
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    RMA Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Enter approval and RMA details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {renderInput(
                    "Date RMA Approved",
                    "aprooved_date",
                    <MdCalendarToday className="text-lg" />,
                    "date",
                  )}

                  {renderInput(
                    "RMA Approved By",
                    "aprooved_by",
                    <MdPerson className="text-lg" />,
                  )}

                  {renderInput(
                    "RMA Number",
                    "rma_number",
                    <MdQrCode2 className="text-lg" />,
                  )}
                </div>
              </div>

              {/* CLIENT DETAILS */}
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Client Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Device owner and location information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {renderInput(
                    "Client Name",
                    "client_name",
                    <MdBusiness className="text-lg" />,
                    "text",
                    true,
                  )}

                  {renderInput(
                    "Client Location",
                    "location_name",
                    <MdLocationOn className="text-lg" />,
                    "text",
                    true,
                  )}
                </div>
              </div>

              {/* DEVICE DETAILS */}
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Device Details
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Equipment information for this RMA
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {renderInput(
                    "Manufacturer",
                    "manufacturer",
                    <MdPrecisionManufacturing className="text-lg" />,
                    "text",
                    true,
                  )}

                  {renderInput(
                    "Model",
                    "model",
                    <MdAssignment className="text-lg" />,
                    "text",
                    true,
                  )}

                  {renderInput(
                    "Serial Number",
                    "serial",
                    <MdQrCode2 className="text-lg" />,
                    "text",
                    true,
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="
                    flex
                    items-center
                    justify-center
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
                    from-indigo-500
                    via-purple-500
                    to-pink-500
                    text-white
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    disabled:opacity-60
                  "
                >
                  <MdSave className="text-lg" />

                  {loading ? "Creating..." : "Create RMA"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
