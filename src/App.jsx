import { Route, Routes } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./page/auth/forgot-password";
import Login from "./page/auth/login";
import ResetPassword from "./page/auth/reset-password";
import AddNewClient from "./page/client/AddNewClient";
import Client from "./page/client/Client";
import Dashboard from "./page/home/dashboard";
import CreateUser from "./page/user/CreateUser";
import AllUsers from "./page/user/AllUsers";
import SetPasswordForm from "./page/user/SetPasswordForm";
import AdminDashboard from "./page/home/adminDashboard";
import UpdateUser from "./page/user/UpdateUser";
import SetUserPasswordForm from "./page/user/SetUserPassword";
import NotFoundPage from "./page/home/404Page";
import PrivateRoute from "./PrivateRoute";
// import WorkOrder from "./page/home/WorkOrder";
// import AddWorkOrder from "./Components/AddNewWorkOrder";
import EmployeePage from "./page/client-employee/EmployeePage";
import AddEmployeePage from "./page/client-employee/AddEmployeePage";
import Locations from "./page/locations/Locations";
import EditLocationPage from "./page/locations/EditLocation";
import EditEmployeePage from "./page/client-employee/EditClientEmployee";
import UpdateClient from "./page/client/UpdateClient";
import AddLocation from "./page/locations/AddLocation";
import WorkOrder from "./page/Idr_workorder/WorkOrder";
import AddWorkOrder from "./page/Idr_workorder/AddWorkOrder";
import IDREmployeePage from "./page/idr-employee/IDREmployeesPage";
import EditIDREmployeePage from "./page/idr-employee/EditIDREmployeePage";
import AddIDREmployeePage from "./page/idr-employee/AddIDREmployeePage";
import EditWorkOrder from "./page/Idr_workorder/EditWorkOrder";
import { logout } from "./reducers/userSlice";
import Inventory from "./page/idr_inventory/Inventory";
import AddInventory from "./page/idr_inventory/AddInventory";
import EditInventory from "./page/idr_inventory/EditInventory";
import ClientEquipment from "./page/idr_client_equipment/ClientEquipment";
import AddClientEqiupment from "./page/idr_client_equipment/AddClientEqupment";
import EditClientEqiupment from "./page/idr_client_equipment/EditClientEqupment";
import TransferInventory from "./page/idr_inventory/TransferInventory";
function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("user_idr_token");
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      let res = error?.response;
      if (res?.status === 401 && res?.config && !res?.config.__isRetryRequest) {
        localStorage.removeItem("user_idr_token");
        dispatch(logout());
      }
    }
  );
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-password" element={<SetPasswordForm />} />
        <Route path="/" element={<PrivateRoute />}>
          <Route
            path="/set-user-password/:userId"
            element={<SetUserPasswordForm />}
          />
          <Route path="/users" element={<AllUsers />}></Route>
          <Route path="/clients" element={<Client />} />
          <Route path="/add-client" element={<AddNewClient />} />
          <Route path="/add-idr-employees" element={<AddIDREmployeePage />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route path="/users/create" element={<CreateUser />}></Route>
          <Route path="/users/update/:userId" element={<UpdateUser />}></Route>
          <Route path="/workorder" element={<WorkOrder />}></Route>
          <Route path="/add-work-order" element={<AddWorkOrder />}></Route>
          <Route
            path="/edit-work-order/:workOrderId"
            element={<EditWorkOrder />}
          ></Route>
          <Route path="/client-employees" element={<EmployeePage />}></Route>
          <Route
            path="/add-employee/:clientId"
            element={<AddEmployeePage />}
          ></Route>
          <Route path="/locations" element={<Locations />}></Route>
          <Route
            path="/add-location/:clientId"
            element={<AddLocation />}
          ></Route>
          <Route path="/idr-employees" element={<IDREmployeePage />}></Route>
          <Route
            path="/idr-employees/:employeeId"
            element={<EditIDREmployeePage />}
          ></Route>
          <Route
            path="/add-location/:clientId"
            element={<AddLocation />}
          ></Route>
          <Route path="/update-client/:clientId" element={<UpdateClient />} />
          <Route
            path="/edit-location/:locationId"
            element={<EditLocationPage />}
          />
          <Route
            path="/edit-employee/:employeeId"
            element={<EditEmployeePage />}
          />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/addinventory" element={<AddInventory />} />
          <Route path="/edit_inventory/:inventory_id" element={<EditInventory />} />
          <Route path="/company-equipment" element={<ClientEquipment />} />
          <Route
            path="/add-company-equipment"
            element={<AddClientEqiupment />}
          />
          <Route
            path="/edit-company-equipment"
            element={<EditClientEqiupment />}
          />
          <Route
            path="/transfer-inventory/:inventory_id"
            element={<TransferInventory />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
