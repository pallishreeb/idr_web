import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
// import { AiFillDelete } from "react-icons/ai";
// import Swal from "sweetalert2";
// import { FaDownload } from "react-icons/fa";
import { uploadServiceTicketSign,getServiceTicketDetails } from "../actions/serviceTicket";
import { toast } from "react-toastify";
// import { S3_BASE_URL } from "../config";
import "./SignatureModal.css"; // Optional for styling

const SignatureModal = ({ isOpen, onClose,serviceTicketId}) => {
  const dispatch = useDispatch();

  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state
  // const { user_type } = useSelector((state) => state.user.user);
  // const {  technicianAccess} = useSelector((state) => state.user);
  const { loadingAssignImage } = useSelector((state) => state.serviceTicket);
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

  // Save the signature as an image
  // const saveSignature = () => {
  //   const canvas = canvasRef.current;
  //   const image = canvas.toDataURL("image/png"); // Convert canvas to PNG
  //   onSave(image); // Pass the image data to the parent component
  //   onClose(); // Close the modal
  // };

  const handleUpload = async() => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    if (!dataURL) {
      toast.error("Please select at least one image.");
      return;
    }

    
    // Convert Base64 to Blob
    const blob = await fetch(dataURL).then(res => res.blob());

    // Create a File object
    const image = new File([blob], "signature.png", { type: "image/png" });
    dispatch(uploadServiceTicketSign(serviceTicketId, image))
      .then(() => {
        toast.success("Signature uploaded successfully.");
        dispatch(getServiceTicketDetails(serviceTicketId));
        onClose(); 
      })
      .catch((error) => {
        console.error("Error uploading signature:", error);
        toast.error("Failed to upload signature.");
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
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: "1px solid #000" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="modal-actions">
        <button onClick={clearCanvas} className="bg-red-600 text-white px-4 py-2 rounded">Clear</button>
        <button onClick={handleUpload} className="bg-indigo-600 text-white px-4 py-2 rounded">{loadingAssignImage ? "uploading" : "Save"}</button>
        <button onClick={onClose} className="bg-gray-600 text-white px-4 py-2 rounded">Close</button>
      </div>
    </ReactModal>
  );
};

export default SignatureModal;