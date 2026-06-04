/** @format */

import React, {
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import Swal from "sweetalert2";

import {
  toast,
} from "react-toastify";

import {
  AiFillDelete,
} from "react-icons/ai";

import {
  FaDownload,
  FaSpinner,
} from "react-icons/fa";

import {
  MdImage,
  MdVideoLibrary,
  MdCloudUpload,
  MdClose,
  MdPermMedia,
} from "react-icons/md";

import {
  uploadWorkOrderImages,
  getWorkOrderDetails,
  deleteWorkOrderFiles,
} from "../actions/workOrderActions";

import {
  S3_BASE_URL,
} from "../config";

import ImageModal from "./ImageModal";

const WorkOrderImages =
  ({
    images,
    serviceTicketId,
  }) => {
    const dispatch =
      useDispatch();

    const {
      user_type,
      user_id,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user.user,
      );

    const {
      technicianAccess,
    } =
      useSelector(
        (
          state,
        ) =>
          state.user,
      );

    const {
      loadingAssignImage,
    } =
      useSelector(
        (
          state,
        ) =>
          state
            .serviceTicket,
      );

    const [
      isModalOpen,
      setIsModalOpen,
    ] =
      useState(
        false,
      );

    const [
      selectedFiles,
      setSelectedFiles,
    ] =
      useState([]);

    const [
      selectedImageUrl,
      setSelectedImageUrl,
    ] =
      useState(
        null,
      );

    const handleOpenModal =
      () =>
        setIsModalOpen(
          true,
        );

    const handleCloseModal =
      () => {
        setIsModalOpen(
          false,
        );

        setSelectedFiles(
          [],
        );
      };

    const handleFileChange =
      (
        e,
      ) => {
        setSelectedFiles(
          Array.from(
            e.target.files,
          ),
        );
      };

    const handleUpload =
      () => {
        if (
          selectedFiles.length ===
          0
        ) {
          toast.error(
            "Please select at least one image.",
          );

          return;
        }

        const maxFileSize =
          150 *
          1024 *
          1024;

        const oversizedFiles =
          selectedFiles.filter(
            (
              file,
            ) =>
              file.size >
              maxFileSize,
          );

        if (
          oversizedFiles.length >
          0
        ) {
          toast.warning(
            "One or more files exceed the 150 MB limit.",
          );

          return;
        }

        const isVideoFile =
          selectedFiles.some(
            (
              file,
            ) =>
              file.type.startsWith(
                "video/",
              ),
          );

        const isImage =
          selectedFiles.some(
            (
              file,
            ) =>
              file.type.startsWith(
                "image/",
              ),
          );

        dispatch(
          uploadWorkOrderImages(
            serviceTicketId,
            selectedFiles,
          ),
        )
          .then(
            (
              data,
            ) => {
              if (
                data?.code ===
                "ST201"
              ) {
                if (
                  isVideoFile
                ) {
                  toast.success(
                    "Video uploaded successfully.",
                  );
                } else if (
                  isImage
                ) {
                  toast.success(
                    "Image uploaded successfully.",
                  );
                } else {
                  toast.success(
                    "Files uploaded successfully.",
                  );
                }

                dispatch(
                  getWorkOrderDetails(
                    serviceTicketId,
                  ),
                );

                handleCloseModal();
              } else {
                toast.error(
                  "Upload failed. Please try again.",
                );
              }
            },
          )
          .catch(
            (
              error,
            ) => {
              console.error(
                "Error uploading images:",
                error,
              );

              toast.error(
                "Failed to upload images.",
              );
            },
          );
      };

    const handleDelete =
      (
        imageId,
      ) => {
        Swal.fire({
          title:
            "Are you sure?",

          text: "Do you really want to delete this file?",

          icon: "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Yes, delete it!",

          cancelButtonText:
            "No, keep it",
        }).then(
          (
            result,
          ) => {
            if (
              result.isConfirmed
            ) {
              dispatch(
                deleteWorkOrderFiles(
                  imageId,
                ),
              )
                .then(
                  (
                    res,
                  ) => {
                    if (
                      res?.code ===
                      "ST203"
                    ) {
                      toast.success(
                        "File deleted successfully.",
                      );

                      dispatch(
                        getWorkOrderDetails(
                          serviceTicketId,
                        ),
                      );
                    } else {
                      toast.error(
                        "Failed to delete file.",
                      );
                    }
                  },
                )
                .catch(
                  (
                    err,
                  ) => {
                    console.error(
                      err,
                    );

                    toast.error(
                      "Something went wrong.",
                    );
                  },
                );
            }
          },
        );
      };

    const handleDownload =
      (
        url,
        filename,
      ) => {
        const link =
          document.createElement(
            "a",
          );

        link.href =
          url;

        link.download =
          filename ||
          "image.jpg";

        link.click();
      };

    const handleImageClick =
      (
        imageUrl,
      ) => {
        setSelectedImageUrl(
          imageUrl,
        );
      };

    const closeImageModal =
      () => {
        setSelectedImageUrl(
          null,
        );
      };

const isVideo = (fileName = "") =>
  /\.(mp4|mov|avi|webm|mkv)$/i.test(fileName);

const isPdf = (fileName = "") =>
  /\.pdf$/i.test(fileName);

const isImage = (fileName = "") =>
  !isVideo(fileName) && !isPdf(fileName);

    const newAccess =
      [
        ...technicianAccess,
        "Subcontractor_User",
        "Subcontractor",
      ];

    return (
      <div className="mt-4 bg-white border border-gray-100 rounded-[30px] shadow-sm overflow-hidden">
        {/* TOP BAR */}
        <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

        <div className="p-5 md:p-7">
          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
            <div className="flex items-center gap-4">
              {/* ICON */}
              <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                <MdPermMedia className="text-2xl" />
              </div>

              {/* TITLE */}
              <div>
                <h1 className="text-lg md:text-xl font-semibold text-[#1E1B4B]">
                  Work Order
                  Media
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Images &
                  videos uploaded
                  for this work
                  order
                </p>
              </div>
            </div>

            {/* BUTTON */}
            {(newAccess?.includes(
              user_type,
            ) ||
              user_type
                ?.trim()
                .toLowerCase() ===
                "subcontractor_user") && (
              <button
                className="
                  flex
                  items-center
                  gap-2
                  px-5
                  py-2.5
                  rounded-2xl
                  bg-gradient-to-r
                 from-[#312E81]
via-[#4338CA]
to-[#6366F1]
                  text-white
                  text-sm
                  font-semibold
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
                onClick={
                  handleOpenModal
                }
              >
                <MdCloudUpload className="text-lg" />
                Upload
                Media
              </button>
            )}
          </div>

          {/* EMPTY */}
          {images?.length ===
            0 && (
            <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-10 text-center">
              <MdPermMedia className="mx-auto text-5xl text-gray-300 mb-4" />

              <h3 className="text-lg font-semibold text-[#1E1B4B]">
                No Media
                Uploaded
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Uploaded images
                and videos will
                appear here.
              </p>
            </div>
          )}

          {/* TABLE */}
          {images?.length >
            0 && (
            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-50 to-pink-50">
                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      Preview
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-[#1E1B4B]">
                      Uploaded By
                    </th>

                    <th className="px-5 py-4 text-center text-sm font-semibold text-[#1E1B4B]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {images?.map(
                    (
                      image,
                      index,
                    ) => {
                      const fileUrl =
                        `${S3_BASE_URL}/${image?.attachment_url}`;

                      return (
                        <tr
                          key={
                            index
                          }
                          className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                        >
                          {/* PREVIEW */}
                          <td className="px-5 py-4">
                           {isVideo(image?.attachment_url) ? (
  <div className="flex items-center gap-4">
    <video
      src={fileUrl}
      className="w-20 h-20 rounded-2xl object-cover border border-gray-200 cursor-pointer"
      controls
    />

    <div className="flex items-center gap-2 text-sm font-medium text-purple-600">
      <MdVideoLibrary className="text-lg" />
      Video
    </div>
  </div>
                            ) : isPdf(image?.attachment_url) ? (
                              <div className="flex items-center gap-4">
                                <div
                                  className="w-20 h-20 rounded-2xl border border-gray-200 bg-red-50 flex items-center justify-center cursor-pointer"
                                  onClick={() => window.open(fileUrl, "_blank")}
                                >
                                  <span className="font-bold text-red-600">
                                    PDF
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm font-medium text-red-600">
                                  PDF
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-4">
<img
  src={fileUrl}
  alt={`Attachment ${index + 1}`}
  className="w-20 h-20 rounded-2xl object-cover border border-gray-200 cursor-pointer hover:scale-[1.02] transition-all duration-300"
  onClick={() => handleImageClick(fileUrl)}
  onError={(e) => {
    e.target.style.display = "none";

    const fallback =
      e.target.parentElement.querySelector(".heic-fallback");

    if (fallback) {
      fallback.style.display = "flex";
    }
  }}
/>

<div
  className="heic-fallback hidden w-20 h-20 rounded-2xl border border-gray-200 bg-indigo-50 items-center justify-center cursor-pointer"
  onClick={() => window.open(fileUrl, "_blank")}
>
  <div className="text-center">
    <MdImage className="mx-auto text-indigo-600 text-xl" />
    <span className="text-[10px] font-semibold text-indigo-600">
      HEIC
    </span>
  </div>
</div>

                                <div className="flex items-center gap-2 text-sm font-medium text-indigo-600">
                                  <MdImage className="text-lg" />
                                  Image
                                </div>
                              </div>
                            )}
                          </td>

                          {/* USER */}
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <p className="text-sm font-semibold text-[#1E1B4B]">
                                {image?.user_name ||
                                  "NA"}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                Uploaded
                                media file
                              </p>
                            </div>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-5 py-4">
                            <div className="flex justify-center gap-2">
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
                                  border
                                  border-blue-100
                                  text-blue-600
                                  hover:bg-blue-100
                                  flex
                                  items-center
                                  justify-center
                                  transition-all
                                  duration-300
                                "
                              >
                                <FaDownload />
                              </button>

                              {/* DELETE */}
                              {(
                                        user_type === "Admin" ||
                                        (
                                          newAccess.includes(user_type) &&
                                          image?.by_user_id === user_id
                                        )
                                      ) && (
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        image?.attachment_id,
                                      )
                                    }
                                    className="
                                      w-10
                                      h-10
                                      rounded-xl
                                      bg-red-50
                                      border
                                      border-red-100
                                      text-red-500
                                      hover:bg-red-100
                                      flex
                                      items-center
                                      justify-center
                                      transition-all
                                      duration-300
                                    "
                                  >
                                    <AiFillDelete />
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* UPLOAD MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6">
            <div className="w-full max-w-2xl bg-white rounded-[30px] shadow-2xl overflow-hidden">
              {/* TOP BAR */}
              <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

              <div className="p-6 md:p-7">
                {/* HEADER */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] text-[#312E81] flex items-center justify-center shadow-md">
                      <MdCloudUpload className="text-2xl" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-[#1E1B4B]">
                        Upload Files
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Upload work
                        order media
                        files
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={
                      handleCloseModal
                    }
                    className="
                      w-10
                      h-10
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-50
                      flex
                      items-center
                      justify-center
                      text-gray-500
                      hover:bg-red-50
                      hover:text-red-500
                      hover:border-red-100
                      transition-all
                      duration-300
                    "
                  >
                    <MdClose className="text-xl" />
                  </button>
                </div>

                {/* INPUT */}
                <div className="border-2 border-dashed border-indigo-200 rounded-[24px] p-8 text-center bg-indigo-50/40">
                  <input
                    type="file"
                    multiple
                    onChange={
                      handleFileChange
                    }
                    className="block w-full text-sm text-gray-600"
                  />

                  <p className="text-xs text-gray-500 mt-3">
                    Maximum file
                    size: 150 MB
                  </p>
                </div>

                {/* SELECTED FILES */}
                {selectedFiles.length >
                  0 && (
                  <div className="mt-5 space-y-2">
                    {selectedFiles.map(
                      (
                        file,
                        idx,
                      ) => (
                        <div
                          key={
                            idx
                          }
                          className="flex items-center justify-between border border-gray-100 rounded-2xl px-4 py-3 bg-gray-50"
                        >
                          <p className="text-sm text-[#1E1B4B] font-medium truncate">
                            {
                              file.name
                            }
                          </p>

                          <span className="text-xs text-gray-500">
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(
                              2,
                            )}{" "}
                            MB
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                )}

                {/* FOOTER */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7">
                  <button
                    className="
                      px-5
                      py-3
                      rounded-2xl
                      border
                      border-gray-200
                      bg-gray-100
                      text-gray-700
                      text-sm
                      font-semibold
                      hover:bg-gray-200
                      transition-all
                      duration-300
                    "
                    onClick={
                      handleCloseModal
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="
                      px-6
                      py-3
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
                      text-white
                      text-sm
                      font-semibold
                      shadow-md
                      hover:shadow-lg
                      hover:scale-[1.02]
                      transition-all
                      duration-300
                      flex
                      items-center
                      justify-center
                      gap-2
                      min-w-[150px]
                    "
                    onClick={
                      handleUpload
                    }
                  >
                    {loadingAssignImage ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Uploading
                      </>
                    ) : (
                      <>
                        <MdCloudUpload className="text-lg" />
                        Upload
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMAGE MODAL */}
        {selectedImageUrl && (
          <ImageModal
            imageUrl={
              selectedImageUrl
            }
            onClose={
              closeImageModal
            }
          />
        )}
      </div>
    );
};

export default WorkOrderImages;