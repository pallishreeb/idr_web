import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import Swal from "sweetalert2";
import { AiFillDelete } from "react-icons/ai";
import { getClients } from "../../actions/clientActions";
import { getLocationByClient } from "../../actions/locationActions";
import { getRmaLists, deleteRma } from "../../actions/rmaActions"; // Updated imports
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";
import Loader from "../../Images/ZZ5H.gif";
import { clearRma } from "../../reducers/rmaSlice"; // Updated import

const RmaViewList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients } = useSelector((state) => state.client);
  const { locations } = useSelector((state) => state.location);
  const { rmaList, loading } = useSelector((state) => state.rma); // Updated state
  const { user_type, client_type } = useSelector((state) => state.user.user);
  const { access } = useSelector((state) => state.user);
  const [filters, setFilters] = useState({
    client_id: "",
    location_id: "",
    manufacturer: "",
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (user_type === "Client Employee") {
      dispatch(getRmaLists({}));
    } else {
      dispatch(getRmaLists({}));
      dispatch(getClients());
    }
  }, [dispatch, user_type]);

  const handleClientChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      client_id: value,
      location_id: "",
      manufacturer: "",
    }));
    setSelectedClient(value);
    dispatch(getLocationByClient(value));
    if (value) {
      dispatch(getRmaLists({ client_id: value }));
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      location_id: value,
    }));
    if (filters.client_id && value) {
      dispatch(getRmaLists({ client_id: filters.client_id, location_id: value }));
    }
    setSelectedLocation(value);
  };

  const handleManufacturerChange = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      manufacturer: value,
    }));
  };

  const handleSearch = () => {
    const { client_id, location_id, manufacturer } = filters;
    const query = {
      ...(client_id && { client_id }),
      ...(location_id && { location_id }),
      ...(manufacturer && { manufacturer }),
    };
    dispatch(getRmaLists(query));
  };

  const handleReset = () => {
    setFilters({
      client_id: "",
      location_id: "",
      manufacturer: "",
    });
    if (user_type === "Client Employee") {
      dispatch(getRmaLists({}));
    } else {
      dispatch(clearRma());
    }
  };

  const handleDeleteRma = (rmaId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this RMA?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteRma(rmaId));
      }
    });
  };

  const handleEdit = (rmaId) => {
    navigate(`/edit-device-rma/${rmaId}`);
  };

  const formatDateToMDY = (dateString) => {
    if (!dateString) return "";
    const [day, month, year] = dateString.split("/");
    return `${month}/${day}/${year}`;
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">RMA List</h2>
          <div className="mb-4">
            {user_type !== "Client Employee" && (
              <form className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="client_id" className="text-sm mb-2">
                    Filter by Client:
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    className="border border-gray-300 rounded px-3 py-1"
                    value={filters.client_id}
                    onChange={handleClientChange}
                  >
                    <option value="">Select Client</option>
                    {clients?.data?.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="location_id" className="text-sm mb-2">
                    Filter by Location:
                  </label>
                  <select
                    id="location_id"
                    name="location_id"
                    className={`border border-gray-300 rounded px-3 py-1 ${
                      !filters.client_id ? "bg-gray-100 text-gray-500" : ""
                    }`}
                    value={filters.location_id}
                    onChange={handleLocationChange}
                    disabled={!filters.client_id}
                  >
                    <option value="">Select Location</option>
                    {locations?.map((location) => (
                      <option key={location.location_id} value={location.location_id}>
                        {location.address_line_one} {location.address_line_two}
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            )}
            <div className="flex flex-row items-end gap-2">
              <div className="flex flex-col">
                <label htmlFor="manufacturer" className="text-sm mb-2">
                  Filter by Manufacturer:
                </label>
                <input
                  type="text"
                  id="manufacturer"
                  name="manufacturer"
                  className="border border-gray-300 rounded px-3 py-1"
                  value={filters.manufacturer}
                  onChange={handleManufacturerChange}
                />
              </div>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={handleSearch}
              >
                Search
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            {user_type === "Admin" && (
              <button
                className="bg-indigo-700 text-white px-4 py-2 rounded"
                disabled={!selectedClient}
              >
                <Link to={`/add-rma/${selectedClient}/${selectedLocation}`}>
                  Add New RMA
                </Link>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Client</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Location</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Manufacturer</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Model</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Serial</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Approved Date</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Approved By</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={"8"} className="py-4">
                      <div className="flex justify-center items-center">
                        <img src={Loader} alt="Loading..." className="h-16 w-16" />
                      </div>
                    </td>
                  </tr>
                ) : rmaList?.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No RMAs found
                    </td>
                  </tr>
                ) : (
                  rmaList?.map((rma) => (
                    <tr key={rma.rma_id}>
                      <td className="border text-sm px-1 py-3">{rma.client_name}</td>
                      <td className="border text-sm px-1 py-3">{`${rma?.location_details?.address_line_one}` || "NA"}</td>
                      <td className="border text-sm px-1 py-3">{rma.manufacturer}</td>
                      <td className="border text-sm px-1 py-3">{rma.model}</td>
                      <td className="border text-sm px-1 py-3">{rma.serial}</td>
                      <td className="border text-sm px-1 py-3">{formatDateToMDY(rma.aprooved_date)}</td>
                      <td className="border text-sm px-1 py-3">{rma.aprooved_by}</td>
                      <td className="border text-sm px-1 py-3">
                        <button
                          onClick={() => handleEdit(rma.rma_id)}
                          className="p-2 bg-gray-100"
                        >
                          <BiSolidEditAlt />
                        </button>
                        {user_type === "Admin" && (
                          <button
                            onClick={() => handleDeleteRma(rma.rma_id)}
                            className="p-2 bg-gray-100"
                          >
                            <AiFillDelete />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RmaViewList;