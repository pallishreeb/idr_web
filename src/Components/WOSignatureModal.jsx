import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
// import { AiFillDelete } from "react-icons/ai";
// import Swal from "sweetalert2";
// import { FaDownload } from "react-icons/fa";
import {
 uploadWorkOrderSign, getWorkOrderDetails
} from "../actions/workOrderActions";
import { toast } from "react-toastify";
// import { S3_BASE_URL } from "../config";
import "./SignatureModal.css"; // Optional for styling

const WOSignatureModal = ({ isOpen, onClose, serviceTicketId }) => {
  const dispatch = useDispatch();

  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
  // const { user_type } = useSelector((state) => state.user.user);
  // const {  technicianAccess} = useSelector((state) => state.user);
  const { loadingAssignImage } = useSelector((state) => state.serviceTicket);
  const [signatureName, setSignatureName] = useState("");
  const [signatureDate, setSignatureDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  // Start drawing
  const startDrawing = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  // Draw on the canvas
  const draw = (event) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Clear the canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Check if the canvas has a valid signature
  const isCanvasEmpty = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return !imageData.data.some((channel) => channel !== 0); // Check if all pixels are blank
  };
  // Save the signature as an image
  // const saveSignature = () => {
  //   const canvas = canvasRef.current;
  //   const image = canvas.toDataURL("image/png"); // Convert canvas to PNG
  //   onSave(image); // Pass the image data to the parent component
  //   onClose(); // Close the modal
  // };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };
  const handleUpload = async () => {
    if (!signatureName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (isCanvasEmpty()) {
      toast.error("Please provide a signature.");
      return;
    }

    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");

    // Convert Base64 to Blob
    const blob = await fetch(dataURL).then((res) => res.blob());

    // Create a File object
    const image = new File([blob], "signature.png", { type: "image/png" });

    const formData = new FormData();
    formData.append("work_order_id", serviceTicketId);
    formData.append(`image`, image);

    formData.append("signature_name", signatureName);
    formData.append("signature_date", formatDateToDDMMYYYY(signatureDate));
    dispatch(uploadWorkOrderSign(serviceTicketId, formData))
      .then((data) => {
        if (data.code === "ST201") {
          toast.success("Signature uploaded successfully.");
          dispatch(getWorkOrderDetails(serviceTicketId));
          onClose();
        }
      })
      .catch((error) => {
        console.error("Error uploading signature:", error);
      });
  };
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Signature Modal"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Draw Your Signature</h2>
      <p className="text-gray-700 text-sm mb-4">
        <strong>
          By signing this document, you are acknowledging that all work
          performed to your satisfaction.
        </strong>
      </p>

      <div className="signature-inputs border border-gray-400 p-4 rounded-md">
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Customer Name (Type)
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>

          <div className="flex-1 flex flex-col">
            <label className="text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={signatureDate}
              onChange={(e) => setSignatureDate(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-400 p-2 mt-4 rounded-md w-full">
        <canvas
          ref={canvasRef}
          width={700}
          height={200}
          style={{ border: "1px solid #000" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      {/* Modal Actions */}
      <div className="modal-actions mt-4 flex justify-end gap-2">
        <button
          onClick={clearCanvas}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Clear
        </button>
        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          {loadingAssignImage ? "Uploading..." : "Save"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </ReactModal>
  );
};

export default WOSignatureModal;
