import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import Swal from 'sweetalert2';
import { AiFillDelete } from "react-icons/ai";
import { getSubcontractorLists, deleteSubcontractor } from "../../actions/subContractorAction";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import Header from "../../Components/Header";
import Loader from "../../Images/ZZ5H.gif";
import { toast } from "react-toastify";

const SubContractorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    state: "",
    name: "",
    city: "",
    coverage: "",
    type: ""
  });
  
  const { subcontractors, loading } = useSelector((state) => state.subcontractor);
  const { user_type } = useSelector((state) => state.user.user);
  
  useEffect(() => {
    dispatch(getSubcontractorLists());
  }, [dispatch]);

  const handleDelete = (subcontractorId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this subcontractor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSubcontractor(subcontractorId)).then(() => {
          dispatch(getSubcontractorLists());
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to delete this item");
        });
      }
    });
  };

  const handleSearch = () => {
    const query = Object.keys(filters).reduce((acc, key) => {
      if (filters[key]) acc[key] = filters[key];
      return acc;
    }, {});
    dispatch(getSubcontractorLists(query));
  };
  
  const handleReset = () => {
    setFilters({
      state: "",
      name: "",
      city: "",
      coverage: "",
      type: ""
    });
    dispatch(getSubcontractorLists({}));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (subcontractorId) => {
    navigate(`/edit-subcontractor/${subcontractorId}`);
  };

  const formatCurrency = (value) => {
    if (typeof value === "string") {
      // value = value.replace(/,/g, ""); // Remove all commas
      value = value.replace(/[^0-9.]/g, ""); 
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD", // Change to appropriate currency if needed
      minimumFractionDigits: 2,
    }).format(value);
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">SubContractor List</h2>
          
          {/* Search Filters */}
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Name"
              name="name"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={filters.name}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={filters.city}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              placeholder="State"
              name="state"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={filters.state}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              placeholder="Coverage Area"
              name="coverage"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={filters.coverage}
              onChange={handleFilterChange}
            />
            <input
              type="text"
              placeholder="Contractor Type"
              name="type"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={filters.type}
              onChange={handleFilterChange}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
              onClick={handleSearch}
            >
              Search
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              onClick={handleReset}
            >
              Clear
            </button>
            {user_type === "Admin" && (
              <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 ml-auto">
                <Link to="/create-sub-contractor">Add New SubContractor</Link>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Subcontractor Name</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Street Address</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">City</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">State</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Zipcode</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Coverage Area</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Hourly Rate</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Trip Charge</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Technicians</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Primary Contact</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Rating</th>
                  {/* <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Phone</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Mobile</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Email</th> */}
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="14" className="py-4 text-center">
                      <img src={Loader} alt="Loading..." className="h-16 w-16 mx-auto" />
                    </td>
                  </tr>
                ) : subcontractors?.length === 0 ? (
                  <tr>
                    <td colSpan="14" className="text-center py-4">No subcontractors found</td>
                  </tr>
                ) : (
                  subcontractors?.map((subcontractor) => (
                    <tr key={subcontractor.subcontractor_id}>
                      <td className="border text-sm px-4 py-3">{subcontractor.subcontractor_name}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.street_address}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.city}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.state}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.zipcode}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.coverage_area}</td>
                      <td className="border text-sm px-4 py-3">{formatCurrency(subcontractor.hourly_rate)}</td>
                      <td className="border text-sm px-4 py-3">{formatCurrency(subcontractor.trip_charge)}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.no_of_technicians}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.p_firstname} {subcontractor.p_lastname}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor?.rating || "N/A"}</td>
                      {/* <td className="border text-sm px-4 py-3">{subcontractor.p_phonenumber}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.p_mobilenumber}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.p_email}</td> */}
                      <td className="border text-sm px-4 py-3 flex gap-2">
                        <button className="bg-gray-100" onClick={() => handleEdit(subcontractor.subcontractor_id)}>
                          <BiSolidEditAlt size={18} />
                        </button>
                        <button className="bg-gray-100" onClick={() => handleDelete(subcontractor.subcontractor_id)}>
                          <AiFillDelete size={18} />
                        </button>
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

export default SubContractorList;