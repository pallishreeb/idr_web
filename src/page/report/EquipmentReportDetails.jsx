import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getEquipmentReportById } from "../../actions/reportActions";
import { useDispatch } from "react-redux";

const EquipmentReportDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { equipmentRreportId } = useParams();
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    if (equipmentRreportId) {
      dispatch(getEquipmentReportById(equipmentRreportId))
        .then((response) => {
          setReportDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching report details:", error);
        });
    }
  }, [dispatch, equipmentRreportId]);

  if (!reportDetails) {
    return <div>Loading...</div>;
  }
  const goBack = () => {
    navigate(-1); // Navigate to the previous page
  };


  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4">
          <button
            onClick={goBack}
            className="bg-indigo-600 text-white py-2 px-4 rounded mb-4"
          >
            Back
          </button>
          <div className="bg-white border rounded p-6">
            <h2 className="text-2xl font-semibold mb-4">Equipment Report Details</h2>
            {reportDetails ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Assigned To:</strong> {reportDetails.equipments?.assigned_to ? reportDetails.equipments?.assigned_to : "NA"}</p>
                  <p><strong>Device Type:</strong> {reportDetails?.equipments?.device_type}</p>
                  <p><strong>Make:</strong> {reportDetails.equipments?.make}</p>
                  <p><strong>Model:</strong> {reportDetails.equipments?.model}</p>
                </div>
                <div>
                  <p><strong>Location Name:</strong> {reportDetails.equipments?.location_name}</p>
                  <p><strong>Serial Number:</strong> {reportDetails.equipments?.serial_number}</p>
                  <p><strong>MAC Address:</strong> {reportDetails.equipments?.mac_address}</p>
                  <p><strong>Performed By:</strong> {reportDetails.performed_by}</p>
                </div>
                <div>
                  <p><strong>Description:</strong> {reportDetails.equipments?.description}</p>
                  <p><strong>Performed Action:</strong> {reportDetails.performed_action}</p>
                </div>
                <div className="col-span-2 text-center">
                  <img
                    src={`https://idr-app-images-bucket.s3.amazonaws.com/${reportDetails.equipments?.qr_image}`} 
                    alt="QR Code"
                    className="w-24 h-24 object-cover rounded-md shadow"
                  />
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentReportDetails;
