import {  Route, Routes } from "react-router-dom";
import ForgotPassword from "./page/auth/forgot-password";
import Login from "./page/auth/login";
import ResetPassword from "./page/auth/reset-password";
import AddNewClient from "./page/client/AddNewClient";
import Client from "./page/client/Client";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/add-client" element={<AddNewClient />} />
      </Routes>
    </>
  );
}

export default App;
