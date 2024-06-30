import React, { useEffect,useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients,deleteClient ,getIndustries} from "../../actions/clientActions";
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, loading } = useSelector((state) => state.client);
  const {industries} = useSelector((state) => state.client.industries);
  const { user_type } = useSelector((state) => state.user.user);
  const [clientName, setClientName] = useState('');
  const [industryId, setIndustryId] = useState('');

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getIndustries());
  }, [dispatch]);

  // useEffect(() => {
  //   if(industryId){
  //     dispatch(getClients({ industryId }));
  //   }
  // }, [dispatch,industryId]);

  const handleEdit = (clientId) => {
    // Navigate to the update client page
    navigate(`/update-client/${clientId}`);
  };

const handleDeleteClient = (clientId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this client?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      dispatch(deleteClient(clientId));
      dispatch(getClients());
    }

  });
};

  const handleSearch = () => {
    dispatch(getClients({ clientName, industryId }));
  };
  const clearSearch = () => {
    setClientName("")
    setIndustryId("")
    dispatch(getClients());
  }
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto bg-gray-50 p-4 mt-5 h-screen overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-lg">Client Management</h1>
            <button className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              <Link to={"/add-client"}> Add New Client</Link>
            </button>
          </div>
          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search by Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="border p-2 rounded-md mr-2"
            />
            <select
              value={industryId}
              onChange={(e) => setIndustryId(e.target.value)}
              className="border p-2 rounded-md mr-2"
            >
              <option value="">Select Industry</option>
              {industries
                    ? [...industries] // Create a shallow copy of the industries array
                        .sort((a, b) => a.industry_name.localeCompare(b.industry_name)) // Sort the copied array alphabetically by industry name
                        .map((industry) => (
                          <option key={industry.industry_id} value={industry.industry_id}>
                            {industry.industry_name}
                          </option>
                        ))
                    : null}
            </select>
            <button
              onClick={handleSearch}
              className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              className="bg-red-700 hover:bg-red-700 text-white font-bold py-2 px-4 ml-2 rounded"
            >
             Clear Search
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
            
               <table className="w-full table-auto">
              <thead className="text-left">
                <tr>
                  <th className="border px-4 py-2">Company Name</th>
                  <th className="border px-4 py-2">Industry Code</th>
                  <th className="border px-4 py-2">Staff ID</th>
                  <th className="border px-4 py-2">Phone Number</th>
                  <th className="border px-4 py-2">Contact Person Name</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
              {clients?.data?.length === 0 ? (
                   <tr>
                   <td colSpan="5" className="text-center">
                     <img src="not-found.png" alt="Data Not Found" className="mx-auto w-64 h-64 mt-4" />
                   </td>
                 </tr>
                  ) : (
                    clients?.data?.map((client) => (
                  <tr key={client?.client_id}>
                    <td className="border px-4 py-2">{client?.company_name}</td>
                    <td className="border px-4 py-2">{client?.industries.industry_name}</td>
                    <td className="border px-4 py-2">{client?.staff}</td>
                    <td className="border px-4 py-2">{client?.phone_number}</td>
                    <td className="border px-4 py-2">
                      {client?.contact_person_firstname} {client?.contact_person_lastname}
                    </td>
                    <td className="border flex px-2 py-2">
                      <button  onClick={() => handleEdit(client?.client_id)} className="p-[4px] bg-gray-100 cursor-pointer">
                        <BiSolidEditAlt />
                      </button>
                      {user_type === "Admin" && 
                      <button className="p-[4px] bg-gray-100 cursor-pointer" onClick={() => handleDeleteClient(client?.client_id)}>
                        <AiFillDelete />
                      </button>
                      }
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
            </>
         
          )}
        </div>
      </div>
    </>
  );
};

export default Client;
