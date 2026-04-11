import React, { useState } from "react";
import { FaDownload, FaFilePdf } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { uploadSubcontractorDocument } from "../../actions/subContractorAction";
import { S3_BASE_URL } from "../../config";

/* 🔥 IMPORT YOUR LOCAL FILES */
import W9_FILE from "../../assets/subcontractor/fw9.pdf";
import COI_FILE from "../../assets/subcontractor/coi.pdf";

const UploadDocumentsForm = ({ id, data, isEditable }) => {
  const dispatch = useDispatch();

  const existingDocs =
    data?.subcontractor_documents?.filter(
      (doc) => !doc.is_deleted
    ) || [];

  const [documentName, setDocumentName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [viewImage, setViewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===========================
     File Change
  =========================== */
  const handleFileChange = (e) => {
    if (!isEditable) return;

    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  /* ===========================
     Submit
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditable) return;

    if (!file || !documentName.trim()) {
      alert("Document name and file required");
      return;
    }

    const formData = new FormData();
    formData.append("subcontractor_id", id);
    formData.append("document_name", documentName.trim());
    formData.append("image", file);

    try {
      setLoading(true);
      await dispatch(uploadSubcontractorDocument(formData));

      setDocumentName("");
      setFile(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
     Download Helper
  =========================== */
  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* ===========================
     UI
  =========================== */
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Upload Documents
      </h2>

      {/* ================= DOWNLOAD FORMS ================= */}
      <div className="mb-6 bg-gray-50 p-4 rounded">
        <h3 className="font-semibold mb-3">
          Required Forms
        </h3>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => handleDownload(W9_FILE, "Form W9")}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FaDownload /> Download Form W9
          </button>

          <button
            onClick={() =>
              handleDownload(COI_FILE, "Sample COI")
            }
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            <FaDownload /> Download Sample COI
          </button>
        </div>
      </div>

      {/* ================= INSTRUCTIONS ================= */}
      <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4 rounded text-sm">
        <p className="font-semibold mb-2">
          Please upload all of the following documents:
        </p>

        <ul className="list-disc ml-5 space-y-1">
          <li>Form W9</li>
          <li>
            Certificate of Insurance (Please read insurance
            requirements from the insurance section)
          </li>
          <li>Resale Certificate Form</li>
          <li>
            Copies of any state licenses held by your firm
          </li>
        </ul>
      </div>

      {/* ================= EXISTING DOCUMENTS ================= */}
      {existingDocs.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">
            Existing Documents
          </h3>

          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">
                    Attachment
                  </th>
                  <th className="px-4 py-2 border">
                    Document Name
                  </th>
                  <th className="px-4 py-2 border text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {existingDocs.map((doc) => {
                  const fullUrl =
                    S3_BASE_URL + "/" + doc.document_url;

                  return (
                    <tr
                      key={doc.subcontractor_doc_id}
                      className="bg-white"
                    >
                      {/* Attachment */}
                      <td className="border px-4 py-2">
                        {doc.document_url.match(
                          /\.(jpg|jpeg|png|webp)$/i
                        ) ? (
                          <img
                            src={fullUrl}
                            alt={doc.document_name}
                            className="h-16 w-16 object-cover rounded cursor-pointer"
                            onClick={() =>
                              setViewImage(fullUrl)
                            }
                          />
                        ) : doc.document_url.match(
                            /\.pdf$/i
                          ) ? (
                          <div
                            className="cursor-pointer"
                            onClick={() =>
                              window.open(
                                fullUrl,
                                "_blank"
                              )
                            }
                          >
                            <FaFilePdf
                              size={40}
                              className="text-red-600"
                            />
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            File
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="border px-4 py-2">
                        {doc.document_name}
                      </td>

                      {/* Download */}
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() =>
                            handleDownload(
                              fullUrl,
                              doc.document_name
                            )
                          }
                          className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700"
                        >
                          <FaDownload />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= UPLOAD ================= */}
      {isEditable ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            value={documentName}
            onChange={(e) =>
              setDocumentName(e.target.value)
            }
            className="border p-2 rounded w-full"
            placeholder="Document Name"
            required
          />

          <input
            type="file"
            onChange={handleFileChange}
            className="border p-2 rounded w-full"
            accept="image/*,.pdf"
            required
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="h-24 w-24 object-cover rounded border"
            />
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 p-4 rounded text-sm">
          Document upload is disabled.
        </div>
      )}

      {/* ================= IMAGE MODAL ================= */}
      {viewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
          <div className="relative">
            <button
              onClick={() => setViewImage(null)}
              className="absolute -top-4 -right-4 bg-white px-3 py-1 rounded"
            >
              ✕
            </button>

            <img
              src={viewImage}
              className="max-h-[85vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocumentsForm;