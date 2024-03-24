import { Route, Routes } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
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
    transition: Bounce
    />
      <Routes> 
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-password" element={<SetPasswordForm />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/set-user-password/:userId" element={<SetUserPasswordForm />} />
        <Route path="/users" element={<AllUsers />}></Route>
        <Route path="/clients" element={<Client />} />
        <Route path="/add-client" element={<AddNewClient />} />
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
        <Route path="/users/create" element={<CreateUser />}></Route>
        <Route path="/users/update/:userId" element={<UpdateUser />}></Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>


      </Routes>
    </>
  );
}

export default App;
