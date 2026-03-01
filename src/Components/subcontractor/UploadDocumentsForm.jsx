import React, { useState } from "react";
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

          <div className="grid grid-cols-4 gap-4">
            {existingDocs.map((doc) => {
              const fullUrl = S3_BASE_URL + "/" + doc.document_url;

              return (
                <div
                  key={doc.subcontractor_doc_id}
                  className="border rounded p-2 text-center hover:shadow transition"
                >
                  {doc.document_url.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <img
                      src={fullUrl}
                      alt={doc.document_name}
                      className="h-24 w-full object-cover rounded mb-2 cursor-pointer"
                      onClick={() => setViewImage(fullUrl)}
                    />
                  ) : (
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block bg-gray-100 p-4 rounded text-sm text-indigo-600"
                    >
                      View PDF
                    </a>
                  )}

                  <p className="text-sm truncate">
                    {doc.document_name}
                  </p>
                </div>
              );
            })}
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