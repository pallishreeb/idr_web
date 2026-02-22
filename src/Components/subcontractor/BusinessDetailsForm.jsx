import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateBusinessDetails } from "../../actions/subContractorAction";

const BusinessDetailsForm = ({ id, data }) => {
  const dispatch = useDispatch();

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
  });

  // Populate form when data loads
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
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateBusinessDetails({
        subcontractor_id: id,
        ...formData,
      })
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Business Details
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

        <input name="subcontractor_name" value={formData.subcontractor_name} onChange={handleChange} className="border p-2 rounded" placeholder="Subcontractor Name" />
        <input name="business_dba" value={formData.business_dba} onChange={handleChange} className="border p-2 rounded" placeholder="Business DBA" />

        <input name="street_address" value={formData.street_address} onChange={handleChange} className="border p-2 rounded" placeholder="Street Address" />
        <input name="suite" value={formData.suite} onChange={handleChange} className="border p-2 rounded" placeholder="Suite" />

        <input name="city" value={formData.city} onChange={handleChange} className="border p-2 rounded" placeholder="City" />
        <input name="state" value={formData.state} onChange={handleChange} className="border p-2 rounded" placeholder="State" />

        <input name="zipcode" value={formData.zipcode} onChange={handleChange} className="border p-2 rounded" placeholder="Zip Code" />
        <input name="coverage_area" value={formData.coverage_area} onChange={handleChange} className="border p-2 rounded" placeholder="Coverage Area" />

        <input name="hourly_rate" value={formData.hourly_rate} onChange={handleChange} className="border p-2 rounded" placeholder="Hourly Rate" />
        <input name="trip_charge" value={formData.trip_charge} onChange={handleChange} className="border p-2 rounded" placeholder="Trip Charge" />

        <input name="no_of_technicians" value={formData.no_of_technicians} onChange={handleChange} className="border p-2 rounded" placeholder="No of Technicians" />

        <select name="rating" value={formData.rating} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Rating</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
        </select>

        <input name="b_firstname" value={formData.b_firstname} onChange={handleChange} className="border p-2 rounded" placeholder="Business First Name" />
        <input name="b_lastname" value={formData.b_lastname} onChange={handleChange} className="border p-2 rounded" placeholder="Business Last Name" />

        <input name="referer_name" value={formData.referer_name} onChange={handleChange} className="border p-2 rounded" placeholder="Referer Name" />

        <select name="company_type" value={formData.company_type} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Company Type</option>
          <option value="Sole Proprietorship">Sole Proprietorship</option>
          <option value="LLC">LLC</option>
          <option value="Corporation">Corporation</option>
          <option value="Partnership">Partnership</option>
        </select>

        <input name="llc_classification" value={formData.llc_classification} onChange={handleChange} className="border p-2 rounded" placeholder="LLC Classification" />

        <textarea
          name="licenses_held"
          value={formData.licenses_held}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          placeholder="Licenses Held"
          rows="3"
        />

        {/* Boolean fields */}
        <div className="flex items-center space-x-6 col-span-2">
          <label className="flex items-center">
            <input type="checkbox" name="is_certifier" checked={formData.is_certifier} onChange={handleChange} className="mr-2" />
            Is Certifier
          </label>

          <label className="flex items-center">
            <input type="checkbox" name="authorized_to_submit" checked={formData.authorized_to_submit} onChange={handleChange} className="mr-2" />
            Authorized To Submit
          </label>

          <label className="flex items-center">
            <input type="checkbox" name="shop_union" checked={formData.shop_union} onChange={handleChange} className="mr-2" />
            Shop Union
          </label>
        </div>

        <div className="col-span-2 text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            Update Business Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default BusinessDetailsForm;