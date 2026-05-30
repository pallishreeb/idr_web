/** @format */

import { useNavigate, useParams, useLocation,useSearchParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import {
  MdInventory2,
  MdArrowBack,
  MdSwapHoriz,
  MdAssignment,
  MdConfirmationNumber,
  MdLocationOn,
} from "react-icons/md";

import Header from "../../Components/Header";

import AdminSideNavbar from "../../Components/AdminSideNavbar";

import { getClients } from "../../actions/clientActions";

import { getWorkOrderListsByClientId } from "../../actions/workOrderActions";

import { getServiceTicketListsByClientId } from "../../actions/serviceTicket";

import { getLocationInventory } from "../../actions/locationsInventoryAction";

import {
  inventoryTransfer,
  inventoryWorkOrderAssign,
  inventoryAssignToServiceTicket,
  getInventoryById,
} from "../../actions/inventoryAction";

const TransferInventory = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  // const location = useLocation();

  // const previousFilters = location.state;

  const { inventory_id } = useParams();

  const [selectedClient, setSelectedClient] = useState("");

  const [selectedClientName, setSelectedClientName] = useState("");

  const [selectedWorkorder, setSelectedWorkorder] = useState("");

  const [selectedServiceTicket, setSelectedServiceTicket] = useState("");

  const [selectedLocation, setSelectedLocation] = useState("");

  const [quantityAssigned, setQuantityAssigned] = useState("");

  const [quantityAssignedToTicket, setQuantityAssignedToTicket] = useState("");

  const [quantityTransferred, setQuantityTransferred] = useState("");

  const [assignedLocation, setAssignedLocation] = useState("");

  const [loading, setLoading] = useState(false);

  const [inventory, setInventory] = useState(null);

  const { clients, loading: clientsLoading } = useSelector(
    (state) => state.client,
  );

  const { workOrders, loading: workOrdersLoading } = useSelector(
    (state) => state.workOrder,
  );

  const { serviceTickets, loading: ticketsLoading } = useSelector(
    (state) => state.serviceTicket,
  );

  const locationsInventory = useSelector(
    (state) => state.locationInventory.locations,
  );

  const loadingTransfer = useSelector(
    (state) => state.inventory.loadingTransfer,
  );

  const loadingAssign = useSelector((state) => state.inventory.loadingAssign);

  const loadingServiceTicketAssign = useSelector(
    (state) => state.inventory.loadingServiceTicketAssign,
  );

  useEffect(() => {
    dispatch(getClients());

    dispatch(getLocationInventory());

    if (inventory_id) {
      setLoading(true);

      dispatch(getInventoryById(inventory_id))
        .then((data) => {
          setLoading(false);

          setInventory(data);

          setAssignedLocation(data.location);
        })
        .catch((error) => {
          setLoading(false);

          console.error("Error fetching inventory item:", error);
        });
    }
  }, [dispatch, inventory_id]);

  useEffect(() => {
    if (selectedClient) {
      dispatch(getWorkOrderListsByClientId(selectedClient));
    }
  }, [selectedClient, dispatch]);

  useEffect(() => {
    if (selectedClientName) {
      dispatch(getServiceTicketListsByClientId(selectedClientName));
    }
  }, [selectedClientName, dispatch]);

  const handleAssignWorkorder = (e) => {
    e.preventDefault();

    dispatch(
      inventoryWorkOrderAssign(
        {
          inventory_id: inventory_id,

          work_order_id: selectedWorkorder,

          quantity: quantityAssigned,
        },
        navigate,
        searchParams.toString()
      ),
    );

    setQuantityAssigned("");
  };

  const handleAssignServiceTicket = (e) => {
    e.preventDefault();

    dispatch(
      inventoryAssignToServiceTicket(
        {
          inventory_id: inventory_id,

          service_ticket_id: selectedServiceTicket,

          quantity: quantityAssignedToTicket,
        },
        navigate,
        searchParams.toString()
      ),
    );

    setQuantityAssignedToTicket("");
  };

  const handleTransferInventory = (e) => {
    e.preventDefault();

    dispatch(
      inventoryTransfer(
        {
          inventory_id: inventory_id,

          location_id: selectedLocation,

          quantity: quantityTransferred,
        },
        navigate,
        searchParams.toString()
      ),
    );

    setQuantityTransferred("");
  };

  const availableLocations = locationsInventory?.filter(
    (location) => location.location !== assignedLocation,
  );

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
                  <MdSwapHoriz className="text-2xl" />
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#1E1B4B]">
                    Transfer Inventory
                  </h1>

                  <p className="text-xs text-gray-500 mt-1">
                    Assign or transfer inventory across locations and tickets
                  </p>
                </div>
              </div>

              {/* BACK BUTTON */}
              <button
                onClick={() =>
                  navigate(`/inventory?${searchParams.toString()}`)
                }
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
              >
                <MdArrowBack className="text-lg" />
                Back
              </button>
            </div>
          </div>

          {/* INVENTORY DETAILS */}
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
                  <MdInventory2 className="text-2xl" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-[#1E1B4B]">
                    Inventory Details
                  </h2>

                  <p className="text-sm text-gray-500">
                    Current inventory information
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {[
                  {
                    label: "Make",
                    value: inventory?.make,
                  },

                  {
                    label: "Model",
                    value: inventory?.model,
                  },

                  {
                    label: "Device Type",
                    value: inventory?.device_type,
                  },

                  {
                    label: "Location",
                    value: inventory?.location,
                  },

                  {
                    label: "Quantity",
                    value: inventory?.quantity,
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
                      {item.value || "NA"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ASSIGN TO WORK ORDER */}
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
                      Assign inventory directly to a work order
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingAssign}
                  className="
                      px-5
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                    "
                >
                  {loadingAssign ? "Saving..." : "Assign Inventory"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* CLIENT */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select Client
                  </label>

                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
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
                  >
                    <option value="">Select client</option>

                    {clients?.data?.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* WORK ORDER */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select Work Order
                  </label>

                  <select
                    value={selectedWorkorder}
                    onChange={(e) => setSelectedWorkorder(e.target.value)}
                    required
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
                  >
                    <option value="">Select work order</option>

                    {workOrders?.workorders
                      ?.filter((wo) => wo.status !== "Closed")
                      .map((wo) => (
                        <option key={wo.work_order_id} value={wo.work_order_id}>
                          {wo.issue}
                        </option>
                      ))}
                  </select>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    value={quantityAssigned}
                    onChange={(e) => setQuantityAssigned(e.target.value)}
                    required
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
                  />
                </div>
              </div>
            </div>
          </form>

          {/* ASSIGN TO SERVICE TICKET */}
          <form
            onSubmit={handleAssignServiceTicket}
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
                        bg-purple-100
                        text-purple-600
                        flex
                        items-center
                        justify-center
                      "
                  >
                    <MdConfirmationNumber className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#1E1B4B]">
                      Assign to Service Ticket
                    </h2>

                    <p className="text-sm text-gray-500">
                      Assign inventory to an active service ticket
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingServiceTicketAssign}
                  className="
                      px-5
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                    "
                >
                  {loadingServiceTicketAssign
                    ? "Saving..."
                    : "Assign Inventory"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* CLIENT */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select Client
                  </label>

                  <select
                    value={selectedClientName}
                    onChange={(e) => setSelectedClientName(e.target.value)}
                    required
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
                  >
                    <option value="">Select client</option>

                    {clients?.data?.map((client) => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SERVICE TICKET */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select Service Ticket
                  </label>

                  <select
                    value={selectedServiceTicket}
                    onChange={(e) => setSelectedServiceTicket(e.target.value)}
                    required
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
                  >
                    <option value="">Select service ticket</option>

                    {serviceTickets
                      ?.filter((st) => st.status !== "Closed")
                      .map((st) => (
                        <option
                          key={st.service_ticket_id}
                          value={st.service_ticket_id}
                        >
                          {st?.service_request}
                        </option>
                      ))}
                  </select>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    value={quantityAssignedToTicket}
                    onChange={(e) =>
                      setQuantityAssignedToTicket(e.target.value)
                    }
                    required
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
                  />
                </div>
              </div>
            </div>
          </form>

          {/* TRANSFER LOCATION */}
          <form
            onSubmit={handleTransferInventory}
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
                        bg-pink-100
                        text-pink-600
                        flex
                        items-center
                        justify-center
                      "
                  >
                    <MdLocationOn className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-[#1E1B4B]">
                      Transfer to Another Location
                    </h2>

                    <p className="text-sm text-gray-500">
                      Move inventory to another inventory location
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingTransfer}
                  className="
                      px-5
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                      shadow-sm
                    "
                >
                  {loadingTransfer ? "Saving..." : "Transfer Inventory"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LOCATION */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Select Location
                  </label>

                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    required
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
                  >
                    <option value="">Select location</option>

                    {availableLocations?.map((location) => (
                      <option
                        key={location.inventory_location_id}
                        value={location.inventory_location_id}
                      >
                        {location.location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* QUANTITY */}
                <div>
                  <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    value={quantityTransferred}
                    onChange={(e) => setQuantityTransferred(e.target.value)}
                    required
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
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default TransferInventory;
