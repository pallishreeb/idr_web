/** @format */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBusinessDetails } from "../../actions/subContractorAction";

const BusinessDetailsForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();
  const { user_type } = useSelector((state) => state.user.user);

  const disabledClass = !isEditable ? "bg-gray-100 cursor-not-allowed" : "";

  const [formData, setFormData] = useState({
    subcontractor_name: "",
    street_address: "",
    suite: "",
    city: "",
    state: "",
    zipcode: "",
    coverage_area: "",
    hourly_rate: "",
    trip_charge: "",
    no_of_technicians: "",
    is_certifier: false,
    rating: "",
    b_firstname: "",
    b_lastname: "",
    authorized_to_submit: false,
    referer_name: "",
    business_dba: "",
    company_type: "",
    llc_classification: "",
    licenses_held: "",
    shop_union: false,
    company_provide_service: false,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        subcontractor_name: data.subcontractor_name || "",
        street_address: data.street_address || "",
        suite: data.suite || "",
        city: data.city || "",
        state: data.state || "",
        zipcode: data.zipcode || "",
        coverage_area: data.coverage_area || "",
        hourly_rate: data.hourly_rate || "",
        trip_charge: data.trip_charge || "",
        no_of_technicians: data.no_of_technicians || "",
        is_certifier: data.is_certifier || false,
        rating: data.rating || "",
        b_firstname: data.b_firstname || "",
        b_lastname: data.b_lastname || "",
        authorized_to_submit: data.authorized_to_submit || false,
        referer_name: data.referer_name || "",
        business_dba: data.business_dba || "",
        company_type: data.company_type || "",
        llc_classification: data.llc_classification || "",
        licenses_held: data.licenses_held || "",
        shop_union: data.shop_union || false,
        company_provide_service: data.company_provide_service || false,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    if (!isEditable) return;
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;

    dispatch(
      updateBusinessDetails({
        subcontractor_id: id,
        ...formData,
      }),
    );
  };

  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">Business Details</h2>

      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-2 gap-4 ${!isEditable ? "opacity-60" : ""}`}
      >
        {/* Subcontractor Name */}
        <div>
          <label className="text-sm font-medium">Subcontractor Name</label>
          <input
            name="subcontractor_name"
            value={formData.subcontractor_name}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter subcontractor name"
          />
        </div>
        {/* DBA */}
        <div>
          <label className="text-sm font-medium">Business DBA</label>
          <input
            name="business_dba"
            value={formData.business_dba}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter DBA name"
          />
        </div>
        {/* Street */}
        <div>
          <label className="text-sm font-medium">Street Address</label>
          <input
            name="street_address"
            value={formData.street_address}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter street address"
          />
        </div>
        {/* Suite */}
        <div>
          <label className="text-sm font-medium">Suite</label>
          <input
            name="suite"
            value={formData.suite}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter suite (if any)"
          />
        </div>
        {/* City */}
        <div>
          <label className="text-sm font-medium">City</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter city"
          />
        </div>
        {/* State */}
        <div>
          <label className="text-sm font-medium">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {/* Zip */}
        <div>
          <label className="text-sm font-medium">Zip Code</label>
          <input
            name="zipcode"
            value={formData.zipcode}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter zip code"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Company Type</label>
          <select
            name="company_type"
            value={formData.company_type}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded  w-full ${disabledClass}`}
          >
            <option value="">Select Company Type</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="LLC">LLC</option>
            <option value="Corporation">Corporation</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">LLC Classification</label>
          <input
            name="llc_classification"
            value={formData.llc_classification}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded  w-full ${disabledClass}`}
            placeholder="LLC Classification"
          />
        </div>{" "}
        {/* Coverage */}
        <div className="col-span-2">
          <label className="text-sm font-medium">Coverage Area</label>
          <textarea
            name="coverage_area"
            value={formData.coverage_area}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter coverage areas"
            rows="3"
          />
        </div>
        {/* Technicians */}
        <div>
          <label className="text-sm font-medium">No. of Technicians</label>
          <input
            name="no_of_technicians"
            value={formData.no_of_technicians}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter number"
          />
        </div>
        {/* Rating */}
        {user_type !== "Subcontractor" && (
          <div>
            <label className="text-sm font-medium">Rating</label>
            <select
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              disabled={!isEditable}
              className={`border p-2 rounded w-full ${disabledClass}`}
            >
              <option value="">Select Rating</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="F">F</option>
            </select>
          </div>
        )}
        {/* Licenses */}
        <div className="col-span-2">
          <label className="text-sm font-medium">Licenses Held</label>
          <textarea
            name="licenses_held"
            value={formData.licenses_held}
            onChange={handleChange}
            disabled={!isEditable}
            className={`border p-2 rounded w-full ${disabledClass}`}
            placeholder="Enter license type and ID"
            rows="3"
          />
        </div>
        {/* Checkbox section */}
        <div className="col-span-2 text-sm font-medium text-gray-600">
          Please select all that apply
        </div>
        <div className="flex items-center space-x-6 col-span-2 flex-wrap">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_certifier"
              checked={formData.is_certifier}
              onChange={handleChange}
              disabled={!isEditable}
              className="mr-2"
            />
            Company owns a certifier
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="shop_union"
              checked={formData.shop_union}
              onChange={handleChange}
              disabled={!isEditable}
              className="mr-2"
            />
            Company is a Union Shop
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="company_provide_service"
              checked={formData.company_provide_service}
              onChange={handleChange}
              disabled={!isEditable}
              className="mr-2"
            />
            Does your company provide service?
          </label>
        </div>
        {/* Certification */}
        <div className="col-span-2">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              name="authorized_to_submit"
              checked={formData.authorized_to_submit}
              onChange={handleChange}
              disabled={!isEditable}
              className="mr-2"
            />
            I certify that I am legally authorized to submit this form
          </label>
        </div>
        {isEditable && (
          <div className="col-span-2 text-right">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Update Business Details
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BusinessDetailsForm;
