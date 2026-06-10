/** @format */

import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import Swal from "sweetalert2";
import heic2any from "heic2any";
import {
  MdAddPhotoAlternate,
  MdDelete,
  MdDownload,
  MdImage,
  MdVideoLibrary,
  MdCloudUpload,
  MdClose,
  MdPerson,
} from "react-icons/md";

import { FaSpinner } from "react-icons/fa";

import {
  uploadServiceTicketImages,
  deleteServiceFiles,
  getServiceTicketDetails,
} from "../actions/serviceTicket";

import { toast } from "react-toastify";

import { S3_BASE_URL } from "../config";

import ImageModal from "./ImageModal";
import ImagePreview from "./ImagePreview";
import { convertHeicToJpg } from "../utils/imageUtils";

const ServiceTicketImages = ({ images, serviceTicketId }) => {
  const dispatch = useDispatch();

  const { user_type, user_id } = useSelector((state) => state.user.user);

  const { technicianAccess,access } = useSelector((state) => state.user);

  const { loadingAssignImage } = useSelector((state) => state.serviceTicket);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  // =========================
  // ACCESS
  // =========================

  const newAccess = [
    ...technicianAccess,
    "Subcontractor_User",
    "Subcontractor",
  ];

  const canManageImages = newAccess.includes(user_type);

  // =========================
  // MODAL
  // =========================

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFiles([]);
  };

  // =========================
  // FILE CHANGE
  // =========================

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  // =========================
  // FILE TYPE
  // =========================

  const isVideo = (fileName) => /\.(mp4|mov|avi|webm|mkv)$/i.test(fileName);
 const isPdf = (fileName = "") =>
  /\.pdf$/i.test(fileName);
  // =========================
  // UPLOAD
  // =========================

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");

      return;
    }

    const maxFileSize = 150 * 1024 * 1024;

    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxFileSize,
    );

    if (oversizedFiles.length > 0) {
      toast.warning("One or more files exceed the 150 MB limit.");

      return;
    }

    const isVideoFile = selectedFiles.some((file) =>
      file.type.startsWith("video/"),
    );

    const isImage = selectedFiles.some((file) =>
      file.type.startsWith("image/"),
    );
    const processedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        return await convertHeicToJpg(file);
      })
    );

    dispatch(uploadServiceTicketImages(serviceTicketId, processedFiles))
      .then((data) => {
        if (data?.code === "ST201") {
          if (isVideoFile) {
            toast.success("Video uploaded successfully.");
          } else if (isImage) {
            toast.success("Image uploaded successfully.");
          } else {
            toast.success("Files uploaded successfully.");
          }

          dispatch(getServiceTicketDetails(serviceTicketId));

          handleCloseModal();
        } else {
          toast.error("Upload failed. Please try again.");
        }
      })
      .catch((error) => {
        console.error(error);

        toast.error("Failed to upload files.");
      });
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = (fileId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this file?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6366f1",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteServiceFiles(fileId))
          .then((res) => {
            if (res?.code === "ST203") {
              toast.success("File deleted successfully.");

              dispatch(getServiceTicketDetails(serviceTicketId));
            } else {
              toast.error("Failed to delete file.");
            }
          })
          .catch((err) => {
            console.error(err);

            toast.error("Something went wrong.");
          });
      }
    });
  };

  // =========================
  // DOWNLOAD
  // =========================

  const handleDownload = (url, filename) => {
    const link = document.createElement("a");

    link.href = url;

    link.download = filename || "attachment";

    link.click();
  };

  // =========================
  // IMAGE MODAL
  // =========================

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImageUrl(null);
  };
const getFileType = (fileName = "") => {
  const lower = fileName.toLowerCase();

  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(lower)) {
    return "image";
  }

  if (/\.(mp4|mov|avi|webm|mkv)$/i.test(lower)) {
    return "video";
  }

  if (/\.pdf$/i.test(lower)) {
    return "pdf";
  }

  return "attachment";
};
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
          mt-5
        "
      >
        {/* TOP BORDER */}
        <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
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
                  Service Ticket Attachments
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage ticket images, videos, PDFs and attachments
                </p>
              </div>
            </div>

            {/* ADD BUTTON */}
            {canManageImages && (
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
                No Media Uploaded
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Images and videos uploaded for this ticket will appear here.
              </p>
            </div>
          ) : (
            <div
              className="
      overflow-x-auto
      border
      border-gray-100
      rounded-2xl
    "
            >
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th
                      className="
              px-4
              py-3
              text-left
              text-xs
              font-bold
              text-gray-600
              uppercase
              whitespace-nowrap
            "
                    >
                      Preview
                    </th>

                    <th
                      className="
              px-4
              py-3
              text-left
              text-xs
              font-bold
              text-gray-600
              uppercase
              whitespace-nowrap
            "
                    >
                      File Type
                    </th>

                    <th
                      className="
              px-4
              py-3
              text-left
              text-xs
              font-bold
              text-gray-600
              uppercase
              whitespace-nowrap
            "
                    >
                      Uploaded By
                    </th>

                    <th
                      className="
              px-4
              py-3
              text-left
              text-xs
              font-bold
              text-gray-600
              uppercase
              whitespace-nowrap
            "
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {images?.map((image, index) => {
                    const fileUrl = `${S3_BASE_URL}/${image?.attachment_url}`;

                    // const fileType = getFileType(image?.attachment_url);
                    const fileType = isVideo(image?.attachment_url)
                    ? "video"
                    : isPdf(image?.attachment_url)
                    ? "pdf"
                    : "image";
                    return (
                      <tr
                        key={index}
                        className="
                border-b
                border-gray-100
                hover:bg-gray-50
                transition-all
              "
                      >
                        {/* PREVIEW */}
<td className="px-4 py-3">
  <div
    className="
      w-24
      h-20
      rounded-xl
      overflow-hidden
      bg-gray-100
      border
      border-gray-200
      cursor-pointer
      flex
      items-center
      justify-center
    "
    onClick={() => {
      if (fileType === "image") {
        handleImageClick(fileUrl);
      } else {
        window.open(fileUrl, "_blank");
      }
    }}
  >
    {fileType === "image" && (
<ImagePreview
  fileUrl={fileUrl}
  onClick={handleImageClick}
/>
    )}

    {fileType === "video" && (
      <video
        src={fileUrl}
        className="w-full h-full object-cover"
      />
    )}

    {fileType === "pdf" && (
      <div className="text-center">
        <div className="text-red-600 font-bold text-lg">PDF</div>
      </div>
    )}

    {fileType === "attachment" && (
      <div className="text-center text-xs font-medium text-gray-600">
        FILE
      </div>
    )}
  </div>
</td>

                        {/* TYPE */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div
                            className={`
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    py-1.5
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      fileType === "video"
                      ? "bg-purple-100 text-purple-700"
                      : fileType === "pdf"
                      ? "bg-red-100 text-red-700"
                      : fileType === "attachment"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-indigo-100 text-indigo-700"
                    }
                  `}
                          >
                            <>
                          {fileType === "image" && (
                            <>
                              <MdImage className="text-sm" />
                              Image
                            </>
                          )}

                            {fileType === "video" && (
                              <>
                                <MdVideoLibrary className="text-sm" />
                                Video
                              </>
                            )}

                            {fileType === "pdf" && (
                              <>
                                <MdCloudUpload className="text-sm" />
                                PDF
                              </>
                            )}

                            {fileType === "attachment" && (
                              <>
                                <MdCloudUpload className="text-sm" />
                                Attachment
                              </>
                            )}
                          </>
                          </div>
                        </td>

                        {/* USER */}
                        <td className="px-4 py-3 whitespace-nowrap">
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
                              <MdPerson className="text-lg" />
                            </div>

                            <div>
                              <p className="text-sm font-semibold text-[#1E1B4B]">
                                {image?.user_name || "NA"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {/* DOWNLOAD */}
                            <button
                              onClick={() =>
                                handleDownload(
                                  fileUrl,
                                  `attachment-${index + 1}`,
                                )
                              }
                              className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      text-blue-600
                      flex
                      items-center
                      justify-center
                      hover:bg-blue-100
                      transition-all
                    "
                            >
                              <MdDownload className="text-lg" />
                            </button>

                            {/* DELETE */}
                            {(
                              access.includes(user_type) ||
                              (
                                canManageImages &&
                                image?.by_user_id === user_id
                              )
                            ) && (
                                <button
                                  onClick={() =>
                                    handleDelete(image?.attachment_id)
                                  }
                                  className="
                          w-10
                          h-10
                          rounded-xl
                          bg-red-50
                          text-red-600
                          flex
                          items-center
                          justify-center
                          hover:bg-red-100
                          transition-all
                        "
                                >
                                  <MdDelete className="text-lg" />
                                </button>
                              )}
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
              rounded-[28px]
              shadow-2xl
              w-full
              max-w-2xl
              overflow-hidden
            "
          >
            {/* TOP BORDER */}
            <div className="h-1 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

            <div className="p-6">
              {/* HEADER */}
              <div className="flex items-start justify-between mb-6">
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
                    <MdCloudUpload className="text-2xl" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-[#1E1B4B]">
                      Upload Files
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Upload images or videos for this service ticket
                    </p>
                  </div>
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

              {/* FILE INPUT */}
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
                  Click to Select Files
                </h3>

                <p className="text-sm text-gray-500 mt-2 text-center">
                  Upload images or videos up to 150 MB each
                </p>
              </label>

              {/* FILES */}
              {selectedFiles.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-sm font-semibold text-[#1E1B4B] mb-3">
                    Selected Files ({selectedFiles.length})
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
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
                            {file.type.startsWith("video/") ? (
                                  <MdVideoLibrary className="text-lg" />
                                ) : file.type === "application/pdf" ? (
                                  <span className="text-sm font-bold">PDF</span>
                                ) : file.type.startsWith("image/") ? (
                                  <MdImage className="text-lg" />
                                ) : (
                                  <MdCloudUpload className="text-lg" />
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
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                <button
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
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
                  <MdClose className="text-lg" />
                  Cancel
                </button>

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
                    from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                    text-white
                    text-sm
                    font-semibold
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    min-w-[150px]
                  "
                  onClick={handleUpload}
                >
                  {loadingAssignImage ? (
                    <>
                      <FaSpinner className="animate-spin text-white" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <MdCloudUpload className="text-lg" />
                      Upload Files
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {selectedImageUrl && (
        <ImageModal imageUrl={selectedImageUrl} onClose={closeImageModal} />
      )}
    </>
  );
};
export default ServiceTicketImages;
