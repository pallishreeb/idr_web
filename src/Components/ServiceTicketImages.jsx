import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { AiFillDelete } from "react-icons/ai";
// import Swal from "sweetalert2";
import { FaDownload } from "react-icons/fa";
import { uploadServiceTicketImages } from "../actions/serviceTicket";
import { getServiceTicketDetails } from "../actions/serviceTicket";
import { toast } from "react-toastify";
import { S3_BASE_URL } from "../config";

const ServiceTicketImages = ({ images, serviceTicketId }) => {
  const dispatch = useDispatch();
  const { user_type } = useSelector((state) => state.user.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFiles([]);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    dispatch(uploadServiceTicketImages(serviceTicketId, selectedFiles))
      .then(() => {
        toast.success("Images uploaded successfully.");
        dispatch(getServiceTicketDetails(serviceTicketId));
        handleCloseModal();
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
        toast.error("Failed to upload images.");
      });
  };

  // const handleDelete = (imageId) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "Do you really want to delete this image?",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, delete it!",
  //     cancelButtonText: "No, keep it",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       console.log("Image is removed")
  //       // dispatch(deleteImage(imageId)).then(() => {
  //       //   toast.success("Image deleted successfully.");
  //       //   dispatch(getServiceTicketDetails(serviceTicketId));
  //       // });
  //     }
  //   });
  // };
  const handleDownload = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "image.jpg";
    link.click();
  };
  return (
    <div className="flex flex-col mt-2 border py-7 px-5 bg-white gap-6">
      <div className="mb-2 flex justify-between">
        <h1 className="font-normal text-xl mb-2">Service Ticket Images</h1>
        {user_type === "Admin" && (
          <button
            className="bg-indigo-600 text-white px-6 py-2 rounded"
            onClick={handleOpenModal}
          >
            Add Images
          </button>
        )}
      </div>

      {/* Image table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-200 border rounded">
          <thead>
            <tr className="bg-gray-300 text-left">
              <th className="border px-4 py-2">Photos</th>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {images?.map((image, index) => (
              <tr key={index} className="bg-white text-sm">
                <td className="border px-4 py-2">
                 
                    <img
                      src={`${S3_BASE_URL}/${image?.attachment_url}`} // Replace with the actual image URL
                      alt={`Service Ticket Image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                </td>
                <td className="border px-4 py-2">{image?.by_user_id}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() =>
                      handleDownload(
                        `${S3_BASE_URL}/${image?.attachment_url}`,
                        `image-${index + 1}.jpg`
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-3 rounded"
                  >
                     <FaDownload />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Image Modal */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4 my-8 max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-center">Add Images</h2>
            <div className="mb-4">
              <label className="block font-normal text-base mb-2">
                Select Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={handleUpload}
              >
                Upload
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTicketImages;
