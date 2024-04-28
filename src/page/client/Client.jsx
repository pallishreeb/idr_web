import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { BsPencil, BsTrash } from "react-icons/bs";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import { getClients,deleteClient } from "../../actions/clientActions";
import { useNavigate } from 'react-router-dom';

const Client = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, loading } = useSelector((state) => state.client);

  useEffect(() => {
    dispatch(getClients());
  }, [dispatch]);
  const handleEdit = (clientId) => {
    // Navigate to the update client page
    navigate(`/update-client/${clientId}`);
  };


  const handleDeleteEmployee = (clientId) => {
    if (window.confirm("Are you sure you want to delete this Client?")) {
      dispatch(deleteClient(clientId)); // Dispatch deleteClientEmployee action if confirmed
    
    }
  };
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="container mx-auto p-4 mt-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-bold text-lg">Client Management</h1>
            <button className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              <Link to={"/add-client"}> Add New Client</Link>
            </button>
          </div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full table-auto shadow-lg">
              <thead className="text-left">
                <tr>
                  <th className="px-4 py-2">Company Name</th>
                  <th className="px-4 py-2">Industry Code</th>
                  <th className="px-4 py-2">Staff ID</th>
                  <th className="px-4 py-2">Phone Number</th>
                  <th className="px-4 py-2">Contact Person Name</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {clients?.data?.map((client) => (
                  <tr key={client?.client_id}>
                    <td className="border px-4 py-2">{client?.company_name}</td>
                    <td className="border px-4 py-2">{client?.industries.industry_name}</td>
                    <td className="border px-4 py-2">{client?.staff}</td>
                    <td className="border px-4 py-2">{client?.phone_number}</td>
                    <td className="border px-4 py-2">
                      {client?.contact_person_firstname} {client?.contact_person_lastname}
                    </td>
                    <td className="border px-4 py-2">
                      <button  onClick={() => handleEdit(client?.client_id)} className="bg-indigo-700 hover:bg-indigo-700 text-white font-bold py-1 px-2 rounded mr-2">
                        <BsPencil />
                      </button>
                      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleDeleteEmployee(client?.client_id)}>
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Client;
