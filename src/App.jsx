import { Route, Routes } from "react-router-dom";
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
import WorkOrder from "./page/home/WorkOrder";
import AddWorkOrder from "./Components/AddNewWorkOrder";
import EmployeePage from "./page/client-employee/EmployeePage";
import AddEmployeePage from "./page/client-employee/AddEmployeePage";
import Locations from "./page/locations/Locations";
import EditLocationPage from './page/locations/EditLocation';
import EditEmployeePage from './page/client-employee/EditClientEmployee';
import UpdateClient from "./page/client/UpdateClient";
import AddLocation from "./page/locations/AddLocation";
function App() {
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
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
          <Route path="/users/create" element={<CreateUser />}></Route>
          <Route path="/users/update/:userId" element={<UpdateUser />}></Route>
          <Route path="/workorder" element={<WorkOrder />}></Route>
          <Route path="/add-work-order" element={<AddWorkOrder />}></Route>
          <Route path="/client-employees" element={<EmployeePage />}></Route>
          <Route path="/add-employee/:clientId" element={<AddEmployeePage />}></Route>
          <Route path="/locations" element={<Locations />}></Route>
          <Route path="/add-location/:clientId" element={<AddLocation />}></Route>
          <Route path="/update-client/:clientId" element={<UpdateClient />} />
          <Route path="/edit-location/:locationId" element={<EditLocationPage />} />
          <Route path="/edit-employee/:employeeId" element={<EditEmployeePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;