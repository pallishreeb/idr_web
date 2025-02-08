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

const SubContractorList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    state: "",
    contractorType: "",
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
        dispatch(deleteSubcontractor(subcontractorId));
      }
    });
  };
  const handleSearch = () => {
    const { state, contractorType } = filters;
    const query = {
      ...(state && { state }),
      ...(contractorType && { contractorType }),
    };
    dispatch(getSubcontractorLists(query)); // Replace with the relevant API call
  };
  
  const handleReset = () => {
    setFilters({
      state: "",
      contractorType: "",
    });
    dispatch(getSubcontractorLists({})); // Reset to fetch all records
  };
  
  const handleEdit = (subcontractorId) => {
    navigate(`/edit-subcontractor/${subcontractorId}`);
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 w-full h-screen overflow-y-scroll">
          <h2 className="text-xl font-semibold mb-4">SubContractor List</h2>
          <div className="mb-4 flex gap-4">
  <input
    type="text"
    placeholder="Filter by State"
    className="border border-gray-300 rounded px-3 py-1 w-full"
    value={filters.state}
    onChange={(e) =>
      setFilters((prevFilters) => ({ ...prevFilters, state: e.target.value }))
    }
  />
  <input
    type="text"
    placeholder="Filter by Contractor Type"
    className="border border-gray-300 rounded px-3 py-1 w-full"
    value={filters.contractorType}
    onChange={(e) =>
      setFilters((prevFilters) => ({ ...prevFilters, contractorType: e.target.value }))
    }
  />
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
    Clear
  </button>
</div>

          <div className="mb-4 flex justify-end">
            {user_type === "Admin" && (
              <button className="bg-indigo-700 text-white px-4 py-2 rounded">
                <Link to="/create-sub-contractor">Add New SubContractor</Link>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Name</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Company</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Contact</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Email</th>
                  <th className="px-4 py-2 text-sm font-semibold tracking-wider border">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-4 text-center">
                      <img src={Loader} alt="Loading..." className="h-16 w-16 mx-auto" />
                    </td>
                  </tr>
                ) : subcontractors?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No subcontractors found</td>
                  </tr>
                ) : (
                  subcontractors?.map((subcontractor) => (
                    <tr key={subcontractor.id}>
                      <td className="border text-sm px-4 py-3">{subcontractor.name}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.company}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.contact}</td>
                      <td className="border text-sm px-4 py-3">{subcontractor.email}</td>
                      <td className="border text-sm px-4 py-3 flex gap-2">
                        <button className="text-blue-600" onClick={() => handleEdit(subcontractor.id)}>
                          <BiSolidEditAlt size={18} />
                        </button>
                        <button className="text-red-600" onClick={() => handleDelete(subcontractor.id)}>
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
