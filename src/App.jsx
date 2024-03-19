import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/DashBoard";

function App() {
  return (
    <>
      {/* <h1>Hello</h1> */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
}

export default App;
