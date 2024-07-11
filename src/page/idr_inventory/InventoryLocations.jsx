import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Loader from "../../Images/ZZ5H.gif";
import { getLocationInventory, deleteLocationInventory ,postLocationInventory} from "../../actions/locationsInventoryAction";

const InventoryLocations = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState("");
  const { loading, locations } = useSelector((state) => state.locationInventory);
  const { user_type } = useSelector((state) => state.user.user);
  useEffect(() => {
    dispatch(getLocationInventory());
  }, [dispatch]);

  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleConfirmSave = async () => {

    if (location === "") {
      toast.error("Please enter location.");
      return;
    }
    dispatch(postLocationInventory({location:location})).then((res) => {
      if (res) { //code=='IL201'
        toast.success("Location  added successfully.");
        setLocation("");
        dispatch(getLocationInventory());
        setShowModal(false)
      }
    });
  };
  const handleDelete = (locationId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Location?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLocationInventory(locationId))
          .then(() => {
            dispatch(getLocationInventory()); // Refresh the list after deletion
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });
  };

  return (
    <>
    <Header />
    <div className="flex">
      <AdminSideNavbar />
      <div className="flex justify-center w-full bg-gray-50">
        <div className="py-12 px-2 bg-gray-50 w-1/2 h-screen overflow-y-scroll">
        <div className="flex justify-between">
        <h1 className="font-bold text-lg text-center">Inventory Locations</h1>
             <button
                className="bg-indigo-600 text-white px-6 py-2 rounded"
                onClick={handleOpenModel}
              >
                Add Location
              </button>
        </div>

          <div className="mt-4 border py-7 px-5 bg-white">
            {loading ? (
              <div className="flex justify-center items-center">
                <img className="w-20 h-20" src={Loader} alt="Loading..." />
              </div>
            ) : (
              <table className="w-full overflow-x-scroll">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-semibold tracking-wider border">
                      Location
                    </th>
                    {user_type === "Admin" && (
                    <th className="px-4 py-2 text-left text-sm font-semibold tracking-wider border">
                      Action
                    </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {locations?.length > 0 ? (
                    locations.map((location) => (
                      <tr key={location.inventory_location_id} className="text-left">
                        <td className="border text-sm px-4 py-2">{location.location}</td>
                        {user_type === "Admin" && (
                        <td className="border text-sm px-4 py-2">
                          <div className="flex gap-2">
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <AiFillDelete onClick={() => handleDelete(location.inventory_location_id)} />
                            </div>
                          </div>
                        </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center py-4">
                        No locations available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
    {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col gap-2 bg-white p-4 rounded shadow-lg w-[30%] m-auto text-center">
            <p>Add Location</p>
            <div className="flex border border-gray-200 h-10 rounded">
              <input
                className="flex-1 border-none text-xs font-normal px-2 py-2 rounded-l"
                placeholder="Type Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                disabled={loading}
                onClick={() => setShowModal(false)}
                className="border-none text-xs font-normal px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleConfirmSave}
                className="border-none text-xs font-normal px-4 py-2 bg-gray-200 rounded"
              >
                {loading ? 'Saving' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
  </>
  );
};

export default InventoryLocations;
