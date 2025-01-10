import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { BiTransferAlt } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { postLocationInventory, getLocationInventory } from "../../actions/locationsInventoryAction";
import { deleteInventory, getInventories } from "../../actions/inventoryAction";
import { toast } from "react-toastify";
import Loader from "../../Images/ZZ5H.gif";
import Swal from "sweetalert2";

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [location, setLocation] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    model: "",
    device_type: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "ASC" });
  const [searchTerm, setSearchTerm] = useState(""); 
  const [deviceType, setDeviceType] = useState("");
  const [model, setModel] = useState(""); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user_type } = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.locationInventory.loading);
  const loadingInventory = useSelector((state) => state.inventory.loading);
  const inventoryList = useSelector((state) => state.inventory.inventories);
  const locationsInventory = useSelector((state) => state.locationInventory.locations);
  const locationsLoading = useSelector((state) => state.locationInventory.loading);

  useEffect(() => {
    dispatch(getLocationInventory());
    dispatch(getInventories(filters));
  }, [dispatch, filters]); // Fetch inventory initially and whenever filters (except search) change

  // const [allDeviceTypes, setAllDeviceTypes] = useState([]);
  // const [allModels, setAllModels] = useState([]);

  // useEffect(() => {
  //   // Extract unique device_types and models from the initial unfiltered inventory list
  //   dispatch(getInventories({})).then((response) => {
  //     if (response && response.data) {
  //       const uniqueDeviceTypes = new Set();
  //       const uniqueModels = new Set();

  //       response.data.forEach(item => {
  //         uniqueDeviceTypes.add(item.device_type);
  //         uniqueModels.add(item.model);
  //       });

  //       setAllDeviceTypes([...uniqueDeviceTypes]);
  //       setAllModels([...uniqueModels]);
  //     }
  //   });
  // }, [dispatch]);

  const handleSearch = () => {
    const newFilters = { ...filters, search: searchTerm, device_type:deviceType, model:model };
    dispatch(getInventories(newFilters));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      location: "",
      model: "",
      device_type: ""
    });
    setSearchTerm("");
    setDeviceType("");
    setModel("");
    dispatch(getInventories());
  };
  const handleSort = (key) => {
    let direction = "ASC";
    if (sortConfig.key === key && sortConfig.direction === "ASC") {
      direction = "DESC";
    }
    setSortConfig({ key, direction });
    dispatch(getInventories({ ...filters, sortBy: key, orderBy: direction }));
  };
  
  const getSortSymbol = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ASC" ? "▲" : "▼";
    }
    return "↕";
  };
  const handleOpenModel = () => {
    setShowModal(true);
  };

  const handleConfirmSave = async () => {
    const data = {
      location: location
    };
    if (data.location === "") {
      toast.error("Please enter location.");
      return;
    }
    dispatch(postLocationInventory(data)).then((res) => {
      if (res) { //code=='IL201'
        toast.success("Location  added successfully.");
        setLocation("");
        dispatch(getLocationInventory());
        setShowModal(false)
      }
    });
  };

  const handleDelete = (inventoryId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this Inventory?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteInventory(inventoryId))
          .then(() => {
            dispatch(getInventories(filters)); // Refresh the list after deletion
          })
          .catch((error) => {
            console.log(error);
            toast.error("Failed to delete the Inventory.");
          });
      }
    });
  };
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">Inventory</h1>
            <div className="flex gap-2">
              <button
                className="bg-indigo-600 text-white px-6 py-2 rounded"
                onClick={handleOpenModel}
              >
                Add Location
              </button>
              <Link to={"/addinventory"}>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded">
                  Add Inventory
                </button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-between items-center">
            <div className="flex gap-4 w-[70%]">
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">Filter by location</label>
            <select
              name="client_name"
              className="px-3 border border-gray-200 h-10 rounded"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              <option value="">All Location</option>
              {locationsInventory?.map((ele) => (
                <option key={ele.inventory_location_id} value={ele.location}>
                  {ele.location}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">Search by device type</label>
            <input
              type="text"
              className="px-3 border border-gray-200 h-10 rounded"
              placeholder="Type"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value )}
            />
            {/* Uncomment the following block if you want to use a dropdown instead
            <select
              name="device_type"
              className="px-3 border border-gray-200 h-10 rounded"
              value={filters.device_type}
              onChange={(e) => setFilters({ ...filters, device_type: e.target.value })}
            >
              <option value="">All Type</option>
              {allDeviceTypes.map((deviceType, index) => (
                <option key={index} value={deviceType}>
                  {deviceType}
                </option>
              ))}
            </select> */}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">Search by model</label>
            <input
              type="text"
              className="px-3 border border-gray-200 h-10 rounded"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">Search by make</label>
            <div className="flex border border-gray-200 h-10 rounded">
              <input
                className="flex-1 border-none text-xs font-normal px-2 py-2 rounded-l"
                placeholder="Type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">&nbsp;</label>
            <button
              className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-normal text-sm">&nbsp;</label>
            <button
              className="border-none text-xs font-normal px-4 py-3 bg-gray-200 rounded"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
            <table className="mt-2 w-full overflow-x-scroll">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('location')}>
                    Location <span className="ml-2">{getSortSymbol('location')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('device_type')}>
                    Device Type <span className="ml-2">{getSortSymbol('device_type')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('make')}>
                    Make <span className="ml-2">{getSortSymbol('make')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border"  onClick={() => handleSort('model')}>
                    Model <span className="ml-2">{getSortSymbol('model')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('color')}>
                    Color <span className="ml-2">{getSortSymbol('color')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border" onClick={() => handleSort('size')}>
                    Size <span className="ml-2">{getSortSymbol('size')}</span>
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Quantity
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Description
                  </th>
                  <th className="px-1 py-1 text-left text-sm font-semibold tracking-wider border">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {loadingInventory ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <img className="w-20 h-20" src={Loader} alt="Loading..." />
                      </div>
                    </td>
                  </tr>
                ) : inventoryList && inventoryList?.data?.length > 0 ? (
                  inventoryList.data.map((item) => (
                    <tr key={item.id} className="text-left">
                      <td className="border text-sm px-1 py-3">{item.location}</td>
                      <td className="border text-sm px-1 py-3">{item.device_type}</td>
                      <td className="border text-sm px-1 py-3">{item.make}</td>
                      <td className="border text-sm px-1 py-3">{item.model}</td>
                      <td className="border text-sm px-1 py-3">{item.color}</td>
                      <td className="border text-sm px-1 py-3">{item.size}</td>
                      <td className="border text-sm px-1 py-3">{item.quantity}</td>
                      <td className="border text-sm px-1 py-3"> {truncateText(item.description, 30)}</td>
                      <td className="border text-sm px-1 py-3">
                        <div className="flex gap-2">
                          <div className="p-[4px] bg-gray-100 cursor-pointer">
                            <BiSolidEditAlt
                              onClick={() => navigate(`/edit_inventory/${item.inventory_id}`)}
                            />
                          </div>
                          <div className="p-[4px] bg-gray-100 cursor-pointer">
                            <BiTransferAlt
                              onClick={() => navigate(`/transfer-inventory/${item.inventory_id}`)}
                            />
                          </div>
                          {user_type === "Admin" && (
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <AiFillDelete
                                onClick={() =>
                                  handleDelete(item.inventory_id)
                                }
                              />
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      <img src="not-found.png" alt="Data Not Found" className="mx-auto w-64 h-64 mt-4" />
                      <p className="mt-4 text-gray-500">No data available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="flex flex-col gap-2 bg-white p-8 rounded shadow-lg w-[30%] m-auto text-center">
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
                {locationsLoading ? 'Saving' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Inventory;
