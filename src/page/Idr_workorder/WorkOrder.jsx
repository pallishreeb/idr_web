import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";
import {
  getWorkOrderLists,
  deleteWorkOrder,
} from "../../actions/workOrderActions";
import { getClients } from "../../actions/clientActions";
import { fetchIDREmployees } from "../../actions/employeeActions";
import { toast } from "react-toastify";

const WorkOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    client_name: "",
    status: "",
    technician: "",
    project_manager: "",
  });

  const { workOrders, loading } = useSelector((state) => state.workOrder);
  const { clients } = useSelector((state) => state.client);
  const { idrEmployees } = useSelector((state) => state.employee);

  useEffect(() => {
    dispatch(getWorkOrderLists(filters));
    dispatch(getClients());
    dispatch(fetchIDREmployees());
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this work order?")) {
      dispatch(deleteWorkOrder(orderId))
        .then(() => {
          dispatch(getWorkOrderLists(filters)); // Refresh the list after deletion
        })
        .catch((error) => {
          console.log(error);
          toast.error("Failed to delete the work order");
        });
    }
  };

  function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = d.getFullYear();
    return `${month}-${day}-${year}`;
  }
  
  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />
        <div className="py-12 px-2 bg-gray-50 w-full h-screen overflow-y-scroll">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg">Work Orders</h1>
          </div>
          <div className="flex flex-col gap-5 mt-4 border py-7 px-5 bg-white">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 w-[70%]">
                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter By Client Name
                  </label>
                  <select
                    name="client_name"
                    className="px-3 border border-gray-200 h-10 rounded"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    {clients?.data?.map((client) => (
                      <option key={client.id} value={client.company_name}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter By Ticket Status
                  </label>
                  <select
                    name="status"
                    className="px-3 border border-gray-200 h-10 rounded"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    <option value="Open">Open</option>
                    <option value="Design">Design</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter By Technician Name
                  </label>
                  <select
                    name="technician"
                    className="px-3 border border-gray-200 h-10 rounded"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    {idrEmployees.map((employee) => (
                      <option
                        key={employee.idr_emp_id}
                        value={employee.first_name}
                      >
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-normal text-sm">
                    Filter By Technician Manager
                  </label>
                  <select
                    name="project_manager"
                    className="px-3 border border-gray-200 h-10 rounded"
                    onChange={handleFilterChange}
                  >
                    <option value="">All</option>
                    {idrEmployees.map((employee) => (
                      <option
                        key={employee.idr_emp_id}
                        value={employee.first_name}
                      >
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <Link to={"/add-work-order"}>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded mt-7">
                  New Work Order
                </button>
              </Link>
            </div>
            {!loading ? (
              <table className="mt-2 w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Client Name
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Generated Date
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Service Date
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Contact Person
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Mobile Number
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Status
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Service Request
                    </th>
                    <th className="px-1 py-1 text-left  font-semibold bg-gray-200 tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workOrders && workOrders.workOrder?.length > 0 ? (
                    workOrders.workOrder?.map((order) => (
                      <tr key={order.id} className="text-left ">
                        <td className=" py-3">{order.client_name}</td>
                        <td className=" py-3">{formatDate(order.generated_date)}</td>
                        <td className=" py-3">{formatDate(order.service_date)}</td>
                        <td className=" py-3">{order.contact_person}</td>
                        <td className=" py-3">{order.contact_phone_number}</td>
                        <td className="py-3">{order.status}</td>
                        <td className="py-3">{order.issue}</td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <BiSolidEditAlt
                                onClick={() =>
                                  navigate(
                                    `/edit-work-order/${order.work_order_id}`
                                  )
                                }
                              />
                            </div>
                            <div className="p-[4px] bg-gray-100 cursor-pointer">
                              <AiFillDelete
                                onClick={() =>
                                  handleDelete(order.work_order_id)
                                }
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center text-xs py-3">
                        No work orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              "Loading Work orders..."
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkOrder;
