import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AiFillDelete } from "react-icons/ai";

import { MdLocationOn, MdAdd, MdSearchOff } from "react-icons/md";

import { toast } from "react-toastify";

import Swal from "sweetalert2";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import Loader from "../../Images/ZZ5H.gif";

import {
  getLocationInventory,
  deleteLocationInventory,
  postLocationInventory,
} from "../../actions/locationsInventoryAction";

const InventoryLocations = () => {
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);

  const [location, setLocation] = useState("");

  const { loading, locations } = useSelector(
    (state) => state.locationInventory,
  );

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

    dispatch(
      postLocationInventory({
        location: location,
      }),
    ).then((res) => {
      if (res) {
        toast.success("Location added successfully.");

        setLocation("");

        dispatch(getLocationInventory());

        setShowModal(false);
      }
    });
  };

  const handleDelete = (locationId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this location?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLocationInventory(locationId))
          .then(() => {
            dispatch(getLocationInventory());
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
            {/* TOP BAR */}
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
                  <MdLocationOn className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Inventory Locations
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Manage inventory storage and warehouse locations
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              {user_type === "Admin" && (
                <button
                  onClick={handleOpenModel}
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
                    font-semibold
                    text-sm
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                >
                  <MdAdd className="text-lg" />
                  Add Location
                </button>
              )}
            </div>
          </div>

          {/* TABLE CARD */}
          <div
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

            {/* CONTENT */}
            <div className="p-4 md:p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <img className="w-16 h-16" src={Loader} alt="Loading..." />

                  <p className="text-sm text-gray-500 mt-3">
                    Loading locations...
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th
                          className="
                            px-4
                            py-3
                            text-left
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wider
                            text-gray-500
                            border-b
                          "
                        >
                          Location
                        </th>

                        {user_type === "Admin" && (
                          <th
                            className="
                              px-4
                              py-3
                              text-left
                              text-[11px]
                              font-semibold
                              uppercase
                              tracking-wider
                              text-gray-500
                              border-b
                              w-24
                            "
                          >
                            Action
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {locations?.length > 0 ? (
                        locations.map((location) => (
                          <tr
                            key={location.inventory_location_id}
                            className="
                                hover:bg-indigo-50/40
                                transition-all
                              "
                          >
                            <td className="px-4 py-3 border-b text-[13px] text-gray-700">
                              <div className="flex items-center gap-2">
                                <div
                                  className="
                                      w-8
                                      h-8
                                      rounded-xl
                                      bg-indigo-50
                                      text-indigo-600
                                      flex
                                      items-center
                                      justify-center
                                    "
                                >
                                  <MdLocationOn className="text-lg" />
                                </div>

                                <span className="font-medium">
                                  {location.location}
                                </span>
                              </div>
                            </td>

                            {user_type === "Admin" && (
                              <td className="px-4 py-3 border-b">
                                <button
                                  onClick={() =>
                                    handleDelete(location.inventory_location_id)
                                  }
                                  className="
                                      w-8
                                      h-8
                                      rounded-xl
                                      bg-red-50
                                      text-red-600
                                      flex
                                      items-center
                                      justify-center
                                      hover:bg-red-100
                                      transition-all
                                    "
                                >
                                  <AiFillDelete className="text-base" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="py-16 text-center">
                            <div className="flex flex-col items-center">
                              <div
                                className="
                                  w-20
                                  h-20
                                  rounded-full
                                  bg-gray-100
                                  flex
                                  items-center
                                  justify-center
                                  mb-4
                                "
                              >
                                <MdSearchOff className="text-4xl text-gray-400" />
                              </div>

                              <h3 className="text-base font-semibold text-[#1E1B4B]">
                                No Locations Available
                              </h3>

                              <p className="text-sm text-gray-500 mt-2">
                                Inventory locations will appear here
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ADD LOCATION MODAL */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            backdrop-blur-sm
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-[28px]
              shadow-2xl
              overflow-hidden
            "
          >
            {/* TOP BAR */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

            <div className="p-6">
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-5">
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
                  <MdLocationOn className="text-2xl" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#1E1B4B]">
                    Add Inventory Location
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Create a new storage location
                  </p>
                </div>
              </div>

              {/* INPUT */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                  Location Name
                </label>

                <input
                  type="text"
                  placeholder="Enter location name"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    text-gray-700
                    focus:outline-none
                    focus:ring-2
                    focus:ring-indigo-500
                    transition-all
                  "
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <button
                  disabled={loading}
                  onClick={() => setShowModal(false)}
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
                  disabled={loading}
                  onClick={handleConfirmSave}
                  className="
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
                  {loading ? "Saving..." : "Add Location"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryLocations;
