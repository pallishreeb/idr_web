import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateContactDetails } from "../../actions/subContractorAction";

const ContactDetailsForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();

  const disabledClass = !isEditable
    ? "bg-gray-100 cursor-not-allowed"
    : "";

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

  /* ===========================
     Populate From Backend
  =========================== */
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

  /* ===========================
     Handlers
  =========================== */
  const handleChange = (e) => {
    if (!isEditable) return;

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ===========================
     Sync Same-As Toggles
  =========================== */
  useEffect(() => {
    if (!isEditable) return;

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
  }, [
    serviceSameAsProject,
    formData.p_firstname,
    formData.p_lastname,
    formData.p_phonenumber,
    formData.p_mobilenumber,
    formData.p_email,
    isEditable,
  ]);

  useEffect(() => {
    if (!isEditable) return;

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
  }, [
    accountsSameAsProject,
    formData.p_firstname,
    formData.p_lastname,
    formData.p_phonenumber,
    formData.p_mobilenumber,
    formData.p_email,
    isEditable,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;

    dispatch(
      updateContactDetails({
        subcontractor_id: id,
        ...formData,
      })
    );
  };

  /* ===========================
     UI
  =========================== */

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Contact Details
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-8 ${!isEditable ? "opacity-60" : ""}`}
      >
        {/* Project Contact */}
        <div>
          <h3 className="font-semibold mb-4">Project Contact</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              "p_firstname",
              "p_lastname",
              "p_phonenumber",
              "p_mobilenumber",
              "p_email",
            ].map((field) => (
              <input
                key={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditable}
                className={`border p-2 rounded ${
                  field === "p_email" ? "col-span-2" : ""
                } ${disabledClass}`}
                placeholder={field.replace(/_/g, " ").replace("p ", "")}
              />
            ))}
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
                disabled={!isEditable}
                onChange={(e) =>
                  isEditable &&
                  setServiceSameAsProject(e.target.checked)
                }
                className="mr-2"
              />
              Same as Project
            </label>
          </div>

          {!serviceSameAsProject && (
            <div className="grid grid-cols-2 gap-4">
              {[
                "s_firstname",
                "s_lastname",
                "s_phonenumber",
                "s_mobilenumber",
                "s_email",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`border p-2 rounded ${
                    field === "s_email" ? "col-span-2" : ""
                  } ${disabledClass}`}
                  placeholder={field.replace(/_/g, " ").replace("s ", "")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Accounts Contact */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">
              Accounts Receivable Contact
            </h3>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={accountsSameAsProject}
                disabled={!isEditable}
                onChange={(e) =>
                  isEditable &&
                  setAccountsSameAsProject(e.target.checked)
                }
                className="mr-2"
              />
              Same as Project
            </label>
          </div>

          {!accountsSameAsProject && (
            <div className="grid grid-cols-2 gap-4">
              {[
                "a_firstname",
                "a_lastname",
                "a_phonenumber",
                "a_mobilenumber",
                "a_email",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  disabled={!isEditable}
                  className={`border p-2 rounded ${
                    field === "a_email" ? "col-span-2" : ""
                  } ${disabledClass}`}
                  placeholder={field.replace(/_/g, " ").replace("a ", "")}
                />
              ))}
            </div>
          )}
        </div>

        {isEditable && (
          <div className="text-right">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Update Contact Details
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactDetailsForm;