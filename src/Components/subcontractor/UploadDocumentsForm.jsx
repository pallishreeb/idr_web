/** @format */

import React, {
  useState,
} from "react";

import {
  FaDownload,
  FaFilePdf,
} from "react-icons/fa";

import {
  MdUploadFile,
  MdDescription,
  MdImage,
  MdCloudUpload,
  MdClose,
} from "react-icons/md";

import {
  useDispatch,
} from "react-redux";

import {
  uploadSubcontractorDocument,
} from "../../actions/subContractorAction";

import {
  S3_BASE_URL,
} from "../../config";

/* FILES */
import W9_FILE from "../../assets/subcontractor/fw9.pdf";
import COI_FILE from "../../assets/subcontractor/coi.pdf";

const UploadDocumentsForm =
  ({
    id,
    data,
    isEditable,
  }) => {
    const dispatch =
      useDispatch();

    const existingDocs =
      data?.subcontractor_documents?.filter(
        (
          doc,
        ) =>
          !doc.is_deleted,
      ) || [];

    const [
      documentName,
      setDocumentName,
    ] = useState("");

    const [
      file,
      setFile,
    ] = useState(null);

    const [
      preview,
      setPreview,
    ] = useState(null);

    const [
      viewImage,
      setViewImage,
    ] = useState(null);

    const [
      loading,
      setLoading,
    ] = useState(false);

    /* ===========================
       FILE CHANGE
    =========================== */

    const handleFileChange =
      (e) => {
        if (
          !isEditable
        )
          return;

        const selectedFile =
          e.target
            .files[0];

        if (
          !selectedFile
        )
          return;

        setFile(
          selectedFile,
        );

        if (
          selectedFile.type.startsWith(
            "image",
          )
        ) {
          setPreview(
            URL.createObjectURL(
              selectedFile,
            ),
          );
        } else {
          setPreview(
            null,
          );
        }
      };

    /* ===========================
       SUBMIT
    =========================== */

    const handleSubmit =
      async (
        e,
      ) => {
        e.preventDefault();

        if (
          !isEditable
        )
          return;

        if (
          !file ||
          !documentName.trim()
        ) {
          alert(
            "Document name and file required",
          );

          return;
        }

        const formData =
          new FormData();

        formData.append(
          "subcontractor_id",
          id,
        );

        formData.append(
          "document_name",
          documentName.trim(),
        );

        formData.append(
          "image",
          file,
        );

        try {
          setLoading(
            true,
          );

          await dispatch(
            uploadSubcontractorDocument(
              formData,
            ),
          );

          setDocumentName(
            "",
          );

          setFile(
            null,
          );

          setPreview(
            null,
          );
        } finally {
          setLoading(
            false,
          );
        }
      };

    /* ===========================
       DOWNLOAD
    =========================== */

    const handleDownload =
      (
        url,
        name,
      ) => {
        const link =
          document.createElement(
            "a",
          );

        link.href =
          url;

        link.download =
          name ||
          "file";

        document.body.appendChild(
          link,
        );

        link.click();

        document.body.removeChild(
          link,
        );
      };

    // COMMON STYLES
    const inputClass =
      "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-300";

    const labelClass =
      "block text-sm font-semibold text-[#1E1B4B] mb-2";

    return (
      <div className="bg-white rounded-[32px] shadow-lg border border-gray-100 overflow-hidden">
        {/* TOP BAR */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-6 md:p-8">
          {/* HEADER */}
          {/* <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex items-center justify-center shadow-lg">
              <MdUploadFile className="text-2xl" />
            </div>

            <div>
             
              <h2 className="text-xl md:text-xl font-bold text-[#1E1B4B]">
                Upload Documents
              </h2>

              <p className="text-gray-500 mt-1 text-sm">
                Upload required
                subcontractor
                documents and
                certifications
              </p>
            </div>
          </div> */}

          {/* REQUIRED FORMS */}
          <div className="bg-gradient-to-r from-indigo-50 to-pink-50 border border-indigo-100 rounded-[28px] p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">
              Required Forms
            </h3>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() =>
                  handleDownload(
                    W9_FILE,
                    "Form W9",
                  )
                }
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <FaDownload />
                Download
                Form W9
              </button>

              <button
                onClick={() =>
                  handleDownload(
                    COI_FILE,
                    "Sample COI",
                  )
                }
                className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                <FaDownload />
                Download
                Sample COI
              </button>
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="bg-amber-50 border border-amber-200 rounded-[28px] p-6 mb-8">
            <h3 className="text-lg font-semibold text-[#1E1B4B] mb-4">
              Required
              Documents
            </h3>

            <ul className="space-y-3">
              {[
                "Form W9",
                "Certificate of Insurance",
                "Resale Certificate Form",
                "Copies of any state licenses held by your firm",
              ].map(
                (
                  item,
                  index,
                ) => (
                  <li
                    key={
                      index
                    }
                    className="flex items-start gap-3 text-sm text-gray-700"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />

                    <span>
                      {
                        item
                      }
                    </span>
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* EXISTING DOCS */}
          {existingDocs.length >
            0 && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-5">
                <MdDescription className="text-indigo-500 text-2xl" />

                {/* SMALLER TITLE */}
                <h3 className="text-lg font-semibold text-[#1E1B4B]">
                  Existing
                  Documents
                </h3>
              </div>

              <div className="overflow-x-auto rounded-[24px] border border-gray-100">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-50 to-pink-50 text-left">
                      <th className="px-5 py-4 text-sm font-semibold text-[#1E1B4B]">
                        Attachment
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold text-[#1E1B4B]">
                        Document
                        Name
                      </th>

                      <th className="px-5 py-4 text-sm font-semibold text-center text-[#1E1B4B]">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {existingDocs.map(
                      (
                        doc,
                      ) => {
                        const fullUrl =
                          S3_BASE_URL +
                          "/" +
                          doc.document_url;

                        return (
                          <tr
                            key={
                              doc.subcontractor_doc_id
                            }
                            className="border-t border-gray-100 hover:bg-gray-50 transition-all duration-200"
                          >
                            {/* FILE */}
                            <td className="px-5 py-4">
                              {doc.document_url.match(
                                /\.(jpg|jpeg|png|webp)$/i,
                              ) ? (
                                <img
                                  src={
                                    fullUrl
                                  }
                                  alt={
                                    doc.document_name
                                  }
                                  className="h-16 w-16 object-cover rounded-2xl cursor-pointer border border-gray-200 shadow-sm"
                                  onClick={() =>
                                    setViewImage(
                                      fullUrl,
                                    )
                                  }
                                />
                              ) : doc.document_url.match(
                                  /\.pdf$/i,
                                ) ? (
                                <div
                                  className="cursor-pointer"
                                  onClick={() =>
                                    window.open(
                                      fullUrl,
                                      "_blank",
                                    )
                                  }
                                >
                                  <FaFilePdf
                                    size={
                                      42
                                    }
                                    className="text-red-500"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                                  <MdDescription className="text-2xl text-gray-500" />
                                </div>
                              )}
                            </td>

                            {/* NAME */}
                            <td className="px-5 py-4">
                              <p className="font-medium text-[#1E1B4B]">
                                {
                                  doc.document_name
                                }
                              </p>
                            </td>

                            {/* DOWNLOAD */}
                            <td className="px-5 py-4 text-center">
                              <button
                                onClick={() =>
                                  handleDownload(
                                    fullUrl,
                                    doc.document_name,
                                  )
                                }
                                className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                              >
                                <FaDownload />
                              </button>
                            </td>
                          </tr>
                        );
                      },
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* UPLOAD */}
          {isEditable ? (
            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-6"
            >
              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Document
                  Name
                </label>

                <input
                  type="text"
                  value={
                    documentName
                  }
                  onChange={(
                    e,
                  ) =>
                    setDocumentName(
                      e
                        .target
                        .value,
                    )
                  }
                  className={
                    inputClass
                  }
                  placeholder="Enter document name"
                  required
                />
              </div>

              {/* FILE INPUT */}
              <div>
                <label
                  className={
                    labelClass
                  }
                >
                  Upload
                  File
                </label>

                <label className="border-2 border-dashed border-indigo-200 rounded-[28px] p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-300">
                  <MdCloudUpload className="text-5xl text-indigo-500 mb-3" />

                  <p className="font-semibold text-[#1E1B4B]">
                    Click to
                    upload
                    document
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Images or PDF
                    files
                  </p>

                  <input
                    type="file"
                    onChange={
                      handleFileChange
                    }
                    className="hidden"
                    accept="image/*,.pdf"
                    required
                  />
                </label>
              </div>

              {/* PREVIEW */}
              {preview && (
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <img
                    src={
                      preview
                    }
                    alt="Preview"
                    className="h-24 w-24 object-cover rounded-2xl border border-gray-200"
                  />

                  <div>
                    <p className="font-medium text-[#1E1B4B]">
                      Image
                      Preview
                    </p>

                    <p className="text-sm text-gray-500">
                      Ready for
                      upload
                    </p>
                  </div>
                </div>
              )}

              {/* BUTTON */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={
                    loading
                  }
                  className={`flex items-center gap-3 px-8 py-3 rounded-2xl text-white font-semibold shadow-lg transition-all duration-300 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-xl hover:scale-[1.02]"
                  }`}
                >
                  <MdCloudUpload className="text-xl" />

                  {loading
                    ? "Uploading..."
                    : "Upload Document"}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 text-sm text-gray-600">
              Document upload
              is disabled.
            </div>
          )}
        </div>

        {/* IMAGE MODAL */}
        {viewImage && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="relative">
              <button
                onClick={() =>
                  setViewImage(
                    null,
                  )
                }
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg"
              >
                <MdClose className="text-xl" />
              </button>

              <img
                src={
                  viewImage
                }
                alt="Document"
                className="max-h-[85vh] max-w-[90vw] rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

export default UploadDocumentsForm;