import React, { useState } from "react";

const AddImageToServiceTicket = ({
  isOpen,
  onClose,
  onSave,
  serviceTicketId,
}) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file type and size (example: max 5 MB)
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5 MB.");
        return false;
      }
      return true;
    });

    if (validFiles.length !== files.length) {
      return;
    }

    setError(null);
    setImageFiles(validFiles);
  };

  const handleSave = () => {
    if (imageFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    onSave({
      service_ticket_id: serviceTicketId,
      images: imageFiles,
    });
    setImageFiles([]);
    onClose();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8 max-h-[95vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Upload Images</h2>
        <div className="mb-4">
          <label className="font-normal text-base">Select Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="block w-full px-2 py-2 border border-gray-300 rounded mt-2"
            onChange={handleFileChange}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {imageFiles.map((file, index) => (
            <div key={index} className="w-20 h-20 border rounded overflow-hidden">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddImageToServiceTicket;
