import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getInventoryReportById } from "../../actions/reportActions";
import { useDispatch } from "react-redux";

const InventoryReportDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { inventoryReportId } = useParams();
  const [reportDetails, setReportDetails] = useState(null);

  useEffect(() => {
    if (inventoryReportId) {
      dispatch(getInventoryReportById(inventoryReportId))
        .then((response) => {
          setReportDetails(response?.data);
          // console.log(response)
        })
        .catch((error) => {
          console.error("Error fetching report details:", error);
        });
    }
  }, [dispatch, inventoryReportId]);


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
            <h2 className="text-2xl font-semibold mb-4">Inventory Report Details</h2>
            {reportDetails ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                <p><strong>Location Name:</strong> {reportDetails.inventories?.location}</p>
                  <p><strong>Device Type:</strong> {reportDetails?.inventories?.device_type}</p>
                  <p><strong>Make:</strong> {reportDetails.inventories?.make}</p>
                  <p><strong>Model:</strong> {reportDetails.inventories?.model}</p>
                </div>
                <div>
                  
                  <p><strong>Quantity:</strong> {reportDetails.inventories?.quantity}</p>
                  <p><strong>Size:</strong> {reportDetails.inventories?.size}</p>
                  <p><strong>Color:</strong> {reportDetails.inventories?.color}</p>
                  <p><strong>Performed By:</strong> {reportDetails.performed_by}</p>
                </div>
                <div>
                  <p><strong>Description:</strong> {reportDetails.inventories?.description}</p>
                  <p><strong>Performed Action:</strong> {reportDetails.performed_action}</p>
                </div>
                <div className="col-span-2 text-center">
                  <img
                    src={`https://idr-app-images-bucket.s3.amazonaws.com/${reportDetails.inventories?.qr}`} 
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

export default InventoryReportDetails;
