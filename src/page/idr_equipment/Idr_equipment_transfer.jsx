/** @format */

import { useNavigate, useParams, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  MdDevices,
  MdArrowBack,
  MdAssignment,
  MdEngineering,
  MdBusinessCenter,
  MdCalendarToday,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getClients } from "../../actions/clientActions";

import {
  getWorkOrderListsByClientId,
  getWorkOrderDetails,
} from "../../actions/workOrderActions";

import {
  idrWorkOrderAssign,
  idrEmployeeAssign,
  getIdrEquipmentById,
} from "../../actions/idrEquipmentAction";

import { fetchIDREmployees } from "../../actions/employeeActions";

import Loader from "../../Images/ZZ5H.gif";

const TransferIdrEquipment = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const location = useLocation();

  const { idr_equipment_id } = useParams();

  const [selectedClient, setSelectedClient] = useState("");

  const [selectedWorkorder, setSelectedWorkorder] = useState("");

  const [selectedTechnician, setSelectedTechnician] = useState("");

  const [selectedEmployee, setSelectedEmployee] = useState("");

  const [signedInDate, setSignedInDate] = useState("");

  const [idrSignedInDate, setIdrSignedInDate] = useState("");

  const [assignDesc, setAssignDesc] = useState("");

  const [technicians, setTechnicians] = useState([]);

  const [loading, setLoading] = useState(false);

  const [equipment, setEquipment] = useState(null);

  const { clients, loading: clientsLoading } = useSelector(
    (state) => state.client,
  );

  const {
    workOrders,
    loading: workOrdersLoading,
    workOrderDetails,
    loadingDetails,
  } = useSelector((state) => state.workOrder);

  const loadingAssign = useSelector(
    (state) => state.idrequipment.loadingAssign,
  );

  const loadingTransfer = useSelector(
    (state) => state.idrequipment.loadingTransfer,
  );

  const { idrEmployees } = useSelector((state) => state.employee);

  const { access, technicianAccess } = useSelector((state) => state.user);

  const { user_type } = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(getClients());

    dispatch(fetchIDREmployees());

    if (idr_equipment_id) {
      setLoading(true);

      dispatch(getIdrEquipmentById(idr_equipment_id))
        .then((data) => {
          setEquipment(data);

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);

          console.error("Error fetching IDR equipment item:", error);
        });
    }
  }, [dispatch, idr_equipment_id]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(getWorkOrderListsByClientId(selectedClient));
    }
  }, [selectedClient, dispatch]);

  useEffect(() => {
    if (selectedWorkorder) {
      dispatch(getWorkOrderDetails(selectedWorkorder));
    }
  }, [selectedWorkorder, dispatch]);

  useEffect(() => {
    if (workOrderDetails) {
      setTechnicians(workOrderDetails.assignees || []);
    }
  }, [workOrderDetails]);

  const handleAssignWorkorder = (e) => {
    e.preventDefault();

    const formattedDateTime = new Date(signedInDate).toLocaleString("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const assignData = {
      equipment_id: idr_equipment_id,

      work_order_id: selectedWorkorder,

      user_id: selectedTechnician,

      user_name: technicians.find(
        (emp) => emp.technician_user_id === selectedTechnician,
      )?.technician_name,

      signed_out: formattedDateTime,
    };

    dispatch(idrWorkOrderAssign(assignData, navigate, location.state));
  };

  const handleAssignIDREmployee = (e) => {
    e.preventDefault();

    const selectedEmployeeData = idrEmployees.find(
      (emp) => emp.user_id === selectedEmployee,
    );

    const userName = selectedEmployeeData
      ? `${selectedEmployeeData.first_name} ${selectedEmployeeData.last_name}`
      : "";

    const formattedDateTime = new Date(idrSignedInDate).toLocaleString(
      "en-US",
      {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      },
    );

    const assignData = {
      equipment_id: idr_equipment_id,

      user_id: selectedEmployee,

      user_name: userName,

      signed_out: formattedDateTime,

      assign_desc: assignDesc,
    };

    dispatch(idrEmployeeAssign(assignData, navigate, location.state));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <img className="w-20 h-20" src={Loader} alt="Loading..." />

          <p className="text-sm text-gray-500 mt-4">
            Loading equipment details...
          </p>
        </div>
      </div>
    );
  }

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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <div
                  className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow-md
                    "
                >
                  <MdDevices className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Transfer IDR Equipment
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Assign equipment to work orders or employees
                  </p>
                </div>
              </div>

              {/* BACK */}
              <button
                className="
                    flex
                    items-center
                    gap-2
                    px-4
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
                onClick={() =>
                  navigate("/idr-equipment", {
                    state: location.state,
                  })
                }
              >
                <MdArrowBack className="text-lg" />
                Back
              </button>
            </div>
          </div>

          {/* EQUIPMENT DETAILS */}
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
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-5">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="
                      w-11
                      h-11
                      rounded-2xl
                      bg-indigo-100
                      text-indigo-600
                      flex
                      items-center
                      justify-center
                    "
                >
                  <MdDevices className="text-2xl" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Equipment Details
                  </h2>

                  <p className="text-sm text-gray-500">
                    Current equipment information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {[
                  {
                    label: "Make",
                    value: equipment?.make,
                  },

                  {
                    label: "Model",
                    value: equipment?.model,
                  },

                  {
                    label: "Device Type",
                    value: equipment?.device_type,
                  },

                  {
                    label: "Serial Number",
                    value: equipment?.serial_number || "NA",
                  },

                  {
                    label: "Location",
                    value: equipment?.location_name,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="
                          rounded-2xl
                          border
                          border-gray-100
                          bg-gray-50
                          p-4
                        "
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                      {item.label}
                    </p>

                    <p className="text-sm font-semibold text-[#1E1B4B]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ASSIGN TO WORK ORDER */}
          {technicianAccess.includes(user_type) && (
            <form
              onSubmit={handleAssignWorkorder}
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
              <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-blue-100
                          text-blue-600
                          flex
                          items-center
                          justify-center
                        "
                    >
                      <MdAssignment className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-[#1E1B4B]">
                        Assign to Work Order
                      </h2>

                      <p className="text-sm text-gray-500">
                        Assign this equipment to a work order technician
                      </p>
                    </div>
                  </div>

                  <button
                    className="
                        px-5
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-indigo-500
                        via-purple-500
                        to-pink-500
                        text-white
                        text-sm
                        font-semibold
                        shadow-sm
                      "
                    type="submit"
                    disabled={loadingAssign}
                  >
                    {loadingAssign ? "Saving..." : "Assign Equipment"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  {/* CLIENT */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Select Client
                    </label>

                    {clientsLoading ? (
                      <div className="text-sm text-gray-500">
                        Loading clients...
                      </div>
                    ) : (
                      <select
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            px-4
                            py-3
                            text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                          "
                        value={selectedClient}
                        onChange={(e) => setSelectedClient(e.target.value)}
                        required
                      >
                        <option value="">Select client</option>

                        {clients?.data?.map((client) => (
                          <option
                            key={client.client_id}
                            value={client.client_id}
                          >
                            {client.company_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* WORK ORDER */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Select Work Order
                    </label>

                    {workOrdersLoading ? (
                      <div className="text-sm text-gray-500">
                        Loading work orders...
                      </div>
                    ) : (
                      <select
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            px-4
                            py-3
                            text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                          "
                        value={selectedWorkorder}
                        onChange={(e) => setSelectedWorkorder(e.target.value)}
                        required
                      >
                        <option value="">Select Work Order</option>

                        {workOrders?.workorders
                          ?.filter((wo) => wo.status !== "Closed")
                          .map((wo) => (
                            <option
                              key={wo.work_order_id}
                              value={wo.work_order_id}
                            >
                              {wo.issue}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>

                  {/* TECHNICIAN */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Assign Technician
                    </label>

                    {loadingDetails ? (
                      <div className="text-sm text-gray-500">
                        Loading technicians...
                      </div>
                    ) : (
                      <select
                        className="
                            w-full
                            rounded-2xl
                            border
                            border-gray-200
                            px-4
                            py-3
                            text-sm
                            focus:outline-none
                            focus:ring-2
                            focus:ring-indigo-500
                          "
                        value={selectedTechnician}
                        onChange={(e) => setSelectedTechnician(e.target.value)}
                        required
                      >
                        <option value="">Select Technician</option>

                        {technicians?.map((employee) => (
                          <option
                            key={employee.technician_user_id}
                            value={employee.technician_user_id}
                          >
                            {employee.technician_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* DATE */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Signed Out Date
                    </label>

                    <input
                      type="datetime-local"
                      className="
                          w-full
                          rounded-2xl
                          border
                          border-gray-200
                          px-4
                          py-3
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                        "
                      value={signedInDate}
                      onChange={(e) => setSignedInDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* ASSIGN TO EMPLOYEE */}
          {access.includes(user_type) && (
            <form
              onSubmit={handleAssignIDREmployee}
              className="
                  bg-white
                  rounded-[24px]
                  shadow-sm
                  border
                  border-gray-100
                  overflow-hidden
                "
            >
              <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                          w-11
                          h-11
                          rounded-2xl
                          bg-purple-100
                          text-purple-600
                          flex
                          items-center
                          justify-center
                        "
                    >
                      <MdEngineering className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-[#1E1B4B]">
                        Assign to IDR Employee
                      </h2>

                      <p className="text-sm text-gray-500">
                        Directly assign equipment to an internal employee
                      </p>
                    </div>
                  </div>

                  <button
                    className="
                        px-5
                        py-3
                        rounded-2xl
                        bg-gradient-to-r
                        from-indigo-500
                        via-purple-500
                        to-pink-500
                        text-white
                        text-sm
                        font-semibold
                        shadow-sm
                      "
                    type="submit"
                    disabled={loadingTransfer}
                  >
                    {loadingTransfer ? "Saving..." : "Assign Equipment"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* EMPLOYEE */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Select Employee
                    </label>

                    <select
                      className="
                          w-full
                          rounded-2xl
                          border
                          border-gray-200
                          px-4
                          py-3
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                        "
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      required
                    >
                      <option value="">Select employee</option>

                      {idrEmployees?.map((employee) => (
                        <option key={employee.user_id} value={employee.user_id}>
                          {employee.first_name + " " + employee.last_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* DATE */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Signed Out Date
                    </label>

                    <input
                      type="datetime-local"
                      className="
                          w-full
                          rounded-2xl
                          border
                          border-gray-200
                          px-4
                          py-3
                          text-sm
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                        "
                      value={idrSignedInDate}
                      onChange={(e) => setIdrSignedInDate(e.target.value)}
                      required
                    />
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                      Description
                    </label>

                    <textarea
                      className="
                          w-full
                          rounded-2xl
                          border
                          border-gray-200
                          px-4
                          py-3
                          text-sm
                          resize-none
                          h-[52px]
                          focus:outline-none
                          focus:ring-2
                          focus:ring-indigo-500
                        "
                      value={assignDesc}
                      onChange={(e) => setAssignDesc(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default TransferIdrEquipment;
