/** @format */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  MdAddPhotoAlternate,
  MdDownload,
  MdImage,
  MdVideoLibrary,
  MdCloudUpload,
  MdClose,
} from "react-icons/md";

import { getRMADetails, uploadRmaImages } from "../actions/rmaActions";

import { toast } from "react-toastify";

import { S3_BASE_URL } from "../config";

import ImageModal from "./ImageModal";

const RmaImages = ({ images, rmaId }) => {
  const dispatch = useDispatch();

  const { user_type } = useSelector((state) => state.user.user);

  const { technicianAccess } = useSelector((state) => state.user);

  const { loadingAssignImage } = useSelector((state) => state.rma);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

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

    dispatch(uploadRmaImages(rmaId, selectedFiles))
      .then((data) => {
        if (data.code === "RMA201") {
          toast.success("Images uploaded successfully.");

          dispatch(getRMADetails(rmaId));

          window.location.reload();

          handleCloseModal();
        }
      })
      .catch((error) => {
        console.error("Error uploading images:", error);

        toast.error("Failed to upload images.");
      });
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");

    link.href = url;

    link.download = filename || "attachment";

    link.click();
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImageUrl(null);
  };

  const isVideo = (fileName) => /\.(mp4|mov|avi|webm|mkv)$/i.test(fileName);

  const newAccess = [
    ...technicianAccess,
    "Subcontractor_User",
    "Subcontractor",
  ];

  return (
    <>
      <div
        className="
          bg-white
          rounded-[24px]
          border
          border-gray-100
          shadow-sm
          overflow-hidden
        "
      >
        {/* TOP BORDER */}
        <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-indigo-100
                  text-indigo-600
                  flex
                  items-center
                  justify-center
                "
              >
                <MdImage className="text-2xl" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#1E1B4B]">
                  RMA Images & Videos
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Upload and manage RMA attachments
                </p>
              </div>
            </div>

            {newAccess.includes(user_type) && (
              <button
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-2xl
                  bg-gradient-to-r
                 from-[#312E81]
via-[#4338CA]
to-[#6366F1]
                  text-white
                  text-sm
                  font-semibold
                  shadow-sm
                  hover:shadow-md
                  transition-all
                "
                onClick={handleOpenModal}
              >
                <MdAddPhotoAlternate className="text-lg" />
                Add Images/Videos
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {images?.length === 0 ? (
            <div className="py-14 flex flex-col items-center justify-center text-center">
              <div
                className="
                  w-20
                  h-20
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  mb-4
                "
              >
                <MdImage className="text-4xl text-gray-400" />
              </div>

              <h3 className="text-base font-semibold text-[#1E1B4B]">
                No Attachments Added
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Uploaded RMA images and videos will appear here
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Preview
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      File Type
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Uploaded By
                    </th>

                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                  {images?.map((image, index) => {
                    const fileUrl = `${S3_BASE_URL}/${image?.attachment_url}`;

                    return (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-all"
                      >
                        {/* IMAGE / VIDEO */}
                        <td className="px-4 py-4">
                          <div
                            onClick={() => handleImageClick(fileUrl)}
                            className="
                  w-20
                  h-20
                  rounded-xl
                  overflow-hidden
                  bg-gray-100
                  cursor-pointer
                  border
                  border-gray-200
                "
                          >
                            {isVideo(image?.attachment_url) ? (
                              <video
                                src={fileUrl}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img
                                src={fileUrl}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </td>

                        {/* FILE TYPE */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {isVideo(image?.attachment_url) ? (
                              <>
                                <MdVideoLibrary className="text-xl text-purple-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Video
                                </span>
                              </>
                            ) : (
                              <>
                                <MdImage className="text-xl text-indigo-500" />
                                <span className="text-sm font-medium text-gray-700">
                                  Image
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* UPLOADED BY */}
                        <td className="px-4 py-4">
                          <p className="text-sm font-semibold text-[#1E1B4B]">
                            {image?.user_name || "NA"}
                          </p>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() =>
                                handleDownload(
                                  fileUrl,
                                  `attachment-${index + 1}`,
                                )
                              }
                              className="
                    flex
                    items-center
                    gap-2
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-50
                    text-blue-600
                    text-sm
                    font-semibold
                    hover:bg-blue-100
                    transition-all
                  "
                            >
                              <MdDownload className="text-lg" />
                              Download
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >
          <div
            className="
              bg-white
              rounded-[24px]
              shadow-xl
              w-full
              max-w-2xl
              overflow-hidden
            "
          >
            {/* TOP BORDER */}
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-6">
              {/* HEADER */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#1E1B4B]">
                    Upload Images/Videos
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Select multiple files to upload
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-gray-100
                    text-gray-500
                    flex
                    items-center
                    justify-center
                    hover:bg-gray-200
                    transition-all
                  "
                >
                  <MdClose className="text-xl" />
                </button>
              </div>

              {/* FILE UPLOAD */}
              <label
                className="
                  border-2
                  border-dashed
                  border-indigo-200
                  rounded-2xl
                  bg-indigo-50/40
                  hover:bg-indigo-50
                  transition-all
                  p-8
                  flex
                  flex-col
                  items-center
                  justify-center
                  cursor-pointer
                "
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  className="
                    w-16
                    h-16
                    rounded-2xl
                    bg-white
                    shadow-sm
                    flex
                    items-center
                    justify-center
                    mb-4
                  "
                >
                  <MdCloudUpload className="text-4xl text-indigo-600" />
                </div>

                <h3 className="text-base font-semibold text-[#1E1B4B]">
                  Click to Upload Files
                </h3>

                <p className="text-sm text-gray-500 mt-2 text-center">
                  Upload images or videos for this RMA
                </p>
              </label>

              {/* SELECTED FILES */}
              {selectedFiles.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-[#1E1B4B] mb-3">
                    Selected Files ({selectedFiles.length})
                  </h4>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="
                            flex
                            items-center
                            justify-between
                            bg-gray-50
                            border
                            border-gray-100
                            rounded-xl
                            px-4
                            py-3
                          "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="
                                w-10
                                h-10
                                rounded-xl
                                bg-indigo-100
                                text-indigo-600
                                flex
                                items-center
                                justify-center
                              "
                          >
                            {isVideo(file.name) ? (
                              <MdVideoLibrary className="text-lg" />
                            ) : (
                              <MdImage className="text-lg" />
                            )}
                          </div>

                          <div>
                            <p className="text-sm font-medium text-[#1E1B4B] break-all">
                              {file.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  className="
                    px-5
                    py-3
                    rounded-2xl
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    text-sm
                    font-semibold
                    hover:bg-gray-50
                    transition-all
                  "
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  className="
                    flex
                    items-center
                    gap-2
                    px-5
                    py-3
                    rounded-2xl
                    bg-gradient-to-r
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                  "
                  onClick={handleUpload}
                >
                  <MdCloudUpload className="text-lg" />

                  {loadingAssignImage ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE MODAL */}
      {selectedImageUrl && (
        <ImageModal imageUrl={selectedImageUrl} onClose={closeImageModal} />
      )}
    </>
  );
};

export default RmaImages;
