import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClientEquipmentById } from "../../actions/clientEquipment";
import { getLocationById } from "../../actions/locationActions";
import { generateRMA } from "../../actions/rmaActions";

import { useNavigate, useParams } from "react-router-dom";

export default function AddRma() {
  const { clientEquipmentId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loadingEquipmentDetails = useSelector(
    (state) => state.clientEquipment.loadingDetails
  );
  const location = useSelector((state) => state.location.location);
  const loading = useSelector((state) => state.rma.loading);


  const [formData, setFormData] = useState({
    client_equipment_id: clientEquipmentId || "",
    manufacturer: "",
    client_id: "",
    location_id: "",
    client_name: "",
    location_name: "",
    model: "",
    serial: "",
    aprooved_date: "",
    aprooved_by: "",
  });

  useEffect(() => {
    if (clientEquipmentId) {
      dispatch(getClientEquipmentById(clientEquipmentId)).then((data) => {
        if (data) {
          setFormData(prev => ({
            ...prev,
            manufacturer: data.manufacturer || "",
            client_id: data.client_id || "",
            client_name: data.client_name || "",
            location_id: data.location_id || "",
            location_name: data.location_name || "",
            model: data.model || "",
            serial: data.serial_number || ""
          }));
  
          // Call API to fetch location details by location_id
          if (data.location_id) {
            dispatch(getLocationById(data.location_id));
          }
        }
      });
    }
  }, [clientEquipmentId, dispatch]);



  useEffect(() => {
    if (location) {
      // Extract location data and update form data
      setFormData(prev => ({
        ...prev,
        location_name: location.address_line_one || ""
      }));

    }
    }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    try {

     dispatch(generateRMA(formattedData,navigate));
    } catch (error) {
      console.error("Error submitting RMA", error);
    }
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Create RMA For Device
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
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
                    // min={getTodayDate()}
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
                    required
                    readOnly
                  />
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <button
                  type="submit"
                  className="bg-indigo-700 text-white px-4 py-2 rounded m-2"
                  disabled={loading}
                >
                  {loading ? "Saving" : "Create RMA"}
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded m-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
