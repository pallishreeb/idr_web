import React, { useState } from "react";
import { FaDownload, FaFilePdf} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { uploadSubcontractorDocument } from "../../actions/subContractorAction";
import { S3_BASE_URL } from "../../config";

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
    if (!isEditable) return; // 🔥 Prevent change if not editable

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

    if (!isEditable) return; // 🔥 Prevent submit if not editable

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
const handleDownload = (url, name) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = name || "file";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-6">
        Upload Document
      </h2>

      {/* ===========================
          Existing Documents
      =========================== */}
      {existingDocs.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold mb-4">
            Existing Documents
          </h3>

          <div className="overflow-x-auto">
  <table className="min-w-full border">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="px-4 py-2 border">Attachment</th>
        <th className="px-4 py-2 border">Document Name</th>
        <th className="px-4 py-2 border text-center">Action</th>
      </tr>
    </thead>

    <tbody>
      {existingDocs.map((doc) => {
        const fullUrl = S3_BASE_URL + "/" + doc.document_url;

        return (
          <tr key={doc.subcontractor_doc_id} className="bg-white">
            {/* Attachment Preview */}
           <td className="border px-4 py-2">
              {doc.document_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                <img
                  src={fullUrl}
                  alt={doc.document_name}
                  className="h-16 w-16 object-cover rounded cursor-pointer"
                  onClick={() => setViewImage(fullUrl)}
                />
              ) : doc.document_url.match(/\.pdf$/i) ? (
                <div
                  className="flex  cursor-pointer"
                  onClick={() => window.open(fullUrl, "_blank")}
                >
                  <FaFilePdf size={40} className="text-red-600" />
                </div>
              ) : (
                <span className="text-gray-500">File</span>
              )}
            </td>

            {/* Document Name */}
            <td className="border px-4 py-2">
              {doc.document_name}
            </td>

            {/* Download Action */}
            <td className="border px-4 py-2 text-center">
              <button
                onClick={() =>
                  handleDownload(fullUrl, doc.document_name)
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

      {/* ===========================
          Upload New
      =========================== */}

      {isEditable ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
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
            <div>
              <p className="text-sm mb-2">
                New Upload Preview:
              </p>
              <img
                src={preview}
                alt="Preview"
                className="h-24 w-24 object-cover rounded border"
              />
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-100 p-4 rounded text-gray-600 text-sm">
          Document upload is disabled.
        </div>
      )}

      {/* ===========================
          Full Image Modal
      =========================== */}
      {viewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative">
            <button
              onClick={() => setViewImage(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full px-3 py-1 shadow"
            >
              ✕
            </button>

            <img
              src={viewImage}
              alt="Full View"
              className="max-h-[85vh] max-w-[90vw] rounded shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadDocumentsForm;