import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerSubcontractor } from "../../actions/subContractorAction";
import Header from "../../Components/Header";
import AdminSideNavbar from "../../Components/AdminSideNavbar";

const AddSubcontractorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.subcontractor);

  const [formData, setFormData] = useState({
    b_firstname: "",
    b_lastname: "",
    b_email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedData = {
      b_firstname: formData.b_firstname.trim(),
      b_lastname: formData.b_lastname.trim(),
      b_email: formData.b_email.trim(),
    };

    try {
      await dispatch(registerSubcontractor(cleanedData));

      // Reset only after success
      setFormData({
        b_firstname: "",
        b_lastname: "",
        b_email: "",
      });

      navigate("/sub-contractors");

    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="flex">
        <AdminSideNavbar />

        <div className="flex-1 p-6 bg-gray-50 min-h-screen">

          <div className="flex justify-center items-start py-10">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">

              <h2 className="text-2xl font-semibold mb-6 text-center">
                Register Subcontractor
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* First Name */}
                <div>
                  <label
                    htmlFor="b_firstname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="b_firstname"
                    id="b_firstname"
                    value={formData.b_firstname}
                    onChange={handleChange}
                    className="mt-2 p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="b_lastname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="b_lastname"
                    id="b_lastname"
                    value={formData.b_lastname}
                    onChange={handleChange}
                    className="mt-2 p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="b_email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="b_email"
                    id="b_email"
                    value={formData.b_email}
                    onChange={handleChange}
                    className="mt-2 p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/sub-contractors")}
                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-5 py-2 rounded-md text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-700 hover:bg-indigo-800"
                    }`}
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>

              </form>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddSubcontractorPage;