import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateContactDetails } from "../../actions/subContractorAction";

const ContactDetailsForm = ({ id, data }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    p_firstname: "",
    p_lastname: "",
    p_phonenumber: "",
    p_mobilenumber: "",
    p_email: "",

    s_firstname: "",
    s_lastname: "",
    s_phonenumber: "",
    s_mobilenumber: "",
    s_email: "",

    a_firstname: "",
    a_lastname: "",
    a_phonenumber: "",
    a_mobilenumber: "",
    a_email: "",
  });

  const [serviceSameAsProject, setServiceSameAsProject] = useState(false);
  const [accountsSameAsProject, setAccountsSameAsProject] = useState(false);

  // Populate from backend
  useEffect(() => {
    if (data) {
      setFormData({
        p_firstname: data.p_firstname || "",
        p_lastname: data.p_lastname || "",
        p_phonenumber: data.p_phonenumber || "",
        p_mobilenumber: data.p_mobilenumber || "",
        p_email: data.p_email || "",

        s_firstname: data.s_firstname || "",
        s_lastname: data.s_lastname || "",
        s_phonenumber: data.s_phonenumber || "",
        s_mobilenumber: data.s_mobilenumber || "",
        s_email: data.s_email || "",

        a_firstname: data.a_firstname || "",
        a_lastname: data.a_lastname || "",
        a_phonenumber: data.a_phonenumber || "",
        a_mobilenumber: data.a_mobilenumber || "",
        a_email: data.a_email || "",
      });

      setServiceSameAsProject(!data.s_firstname);
      setAccountsSameAsProject(!data.a_firstname);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Sync when same-as toggled
  useEffect(() => {
    if (serviceSameAsProject) {
      setFormData((prev) => ({
        ...prev,
        s_firstname: prev.p_firstname,
        s_lastname: prev.p_lastname,
        s_phonenumber: prev.p_phonenumber,
        s_mobilenumber: prev.p_mobilenumber,
        s_email: prev.p_email,
      }));
    }
  }, [serviceSameAsProject, formData.p_firstname, formData.p_lastname, formData.p_phonenumber, formData.p_mobilenumber, formData.p_email]);

  useEffect(() => {
    if (accountsSameAsProject) {
      setFormData((prev) => ({
        ...prev,
        a_firstname: prev.p_firstname,
        a_lastname: prev.p_lastname,
        a_phonenumber: prev.p_phonenumber,
        a_mobilenumber: prev.p_mobilenumber,
        a_email: prev.p_email,
      }));
    }
  }, [accountsSameAsProject, formData.p_firstname, formData.p_lastname, formData.p_phonenumber, formData.p_mobilenumber, formData.p_email]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateContactDetails({
        subcontractor_id: id,
        ...formData,
      })
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Contact Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* Project Contact */}
        <div>
          <h3 className="font-semibold mb-4">Project Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            <input name="p_firstname" value={formData.p_firstname} onChange={handleChange} className="border p-2 rounded" placeholder="First Name" />
            <input name="p_lastname" value={formData.p_lastname} onChange={handleChange} className="border p-2 rounded" placeholder="Last Name" />
            <input name="p_phonenumber" value={formData.p_phonenumber} onChange={handleChange} className="border p-2 rounded" placeholder="Phone Number" />
            <input name="p_mobilenumber" value={formData.p_mobilenumber} onChange={handleChange} className="border p-2 rounded" placeholder="Mobile Number" />
            <input name="p_email" value={formData.p_email} onChange={handleChange} className="border p-2 rounded col-span-2" placeholder="Email" />
          </div>
        </div>

        {/* Service Contact */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Service Contact</h3>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={serviceSameAsProject}
                onChange={(e) => setServiceSameAsProject(e.target.checked)}
                className="mr-2"
              />
              Same as Project
            </label>
          </div>

          {!serviceSameAsProject && (
            <div className="grid grid-cols-2 gap-4">
              <input name="s_firstname" value={formData.s_firstname} onChange={handleChange} className="border p-2 rounded" placeholder="First Name" />
              <input name="s_lastname" value={formData.s_lastname} onChange={handleChange} className="border p-2 rounded" placeholder="Last Name" />
              <input name="s_phonenumber" value={formData.s_phonenumber} onChange={handleChange} className="border p-2 rounded" placeholder="Phone Number" />
              <input name="s_mobilenumber" value={formData.s_mobilenumber} onChange={handleChange} className="border p-2 rounded" placeholder="Mobile Number" />
              <input name="s_email" value={formData.s_email} onChange={handleChange} className="border p-2 rounded col-span-2" placeholder="Email" />
            </div>
          )}
        </div>

        {/* Accounts Contact */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Accounts Receivable Contact</h3>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={accountsSameAsProject}
                onChange={(e) => setAccountsSameAsProject(e.target.checked)}
                className="mr-2"
              />
              Same as Project
            </label>
          </div>

          {!accountsSameAsProject && (
            <div className="grid grid-cols-2 gap-4">
              <input name="a_firstname" value={formData.a_firstname} onChange={handleChange} className="border p-2 rounded" placeholder="First Name" />
              <input name="a_lastname" value={formData.a_lastname} onChange={handleChange} className="border p-2 rounded" placeholder="Last Name" />
              <input name="a_phonenumber" value={formData.a_phonenumber} onChange={handleChange} className="border p-2 rounded" placeholder="Phone Number" />
              <input name="a_mobilenumber" value={formData.a_mobilenumber} onChange={handleChange} className="border p-2 rounded" placeholder="Mobile Number" />
              <input name="a_email" value={formData.a_email} onChange={handleChange} className="border p-2 rounded col-span-2" placeholder="Email" />
            </div>
          )}
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Update Contact Details
          </button>
        </div>

      </form>
    </div>
  );
};

export default ContactDetailsForm;