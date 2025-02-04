import React, { useRef, useState } from "react";
import ReactModal from "react-modal";
import "./SignatureModal.css"; // Optional for styling

const SignatureModal = ({ isOpen, onClose, onSave }) => {
  const canvasRef = useRef(null); // Reference to the canvas element
  const [isDrawing, setIsDrawing] = useState(false); // Track drawing state

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
  const saveSignature = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL("image/png"); // Convert canvas to PNG
    onSave(image); // Pass the image data to the parent component
    onClose(); // Close the modal
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
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveSignature}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </ReactModal>
  );
};

export default SignatureModal;