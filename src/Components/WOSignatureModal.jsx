import React, { useRef, useState } from "react";

import ReactModal from "react-modal";

import { useDispatch, useSelector } from "react-redux";

import { MdDraw, MdDeleteOutline, MdSave, MdClose } from "react-icons/md";

import {
  uploadWorkOrderSign,
  getWorkOrderDetails,
} from "../actions/workOrderActions";

import { toast } from "react-toastify";

import "./SignatureModal.css";

const WOSignatureModal = ({ isOpen, onClose, serviceTicketId }) => {
  const dispatch = useDispatch();

  const canvasRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const { loadingAssignImage } = useSelector((state) => state.serviceTicket);

  const [signatureName, setSignatureName] = useState("");

  const [signatureDate, setSignatureDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // START DRAWING
  const startDrawing = (event) => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    ctx.beginPath();

    ctx.moveTo(x, y);

    ctx.lineWidth = 2;

    ctx.lineCap = "round";

    ctx.strokeStyle = "#111827";

    setIsDrawing(true);
  };

  // DRAW
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

  // STOP DRAWING
  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // CLEAR
  const clearCanvas = () => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // EMPTY CHECK
  const isCanvasEmpty = () => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return !imageData.data.some((channel) => channel !== 0);
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  };

  // SAVE
  const handleUpload = async () => {
    if (!signatureName.trim()) {
      toast.error("Please enter customer name.");

      return;
    }

    if (isCanvasEmpty()) {
      toast.error("Please provide a signature.");

      return;
    }

    const canvas = canvasRef.current;

    const dataURL = canvas.toDataURL("image/png");

    const blob = await fetch(dataURL).then((res) => res.blob());

    const image = new File([blob], "signature.png", {
      type: "image/png",
    });

    const formData = new FormData();

    formData.append("work_order_id", serviceTicketId);

    formData.append("image", image);

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

  const inputClass = `
      w-full
      rounded-2xl
      border
      border-gray-200
      bg-white
      px-4
      py-3
      text-sm
      text-gray-700
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      transition-all
    `;

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Signature Modal"
      className="
        max-w-4xl
        w-[95%]
        mx-auto
        mt-10
        bg-white
        rounded-[32px]
        overflow-hidden
        shadow-2xl
        outline-none
        max-h-[92vh]
        overflow-y-auto
      "
      overlayClassName="
        fixed
        inset-0
        bg-black/50
        z-[9999]
        flex
        justify-center
        items-start
        p-4
        backdrop-blur-sm
      "
    >
      {/* TOP BAR */}
      <div className="h-1.5 bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4338CA]" />

      <div className="p-5 md:p-7">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div
              className="
                w-14
                h-14
                rounded-3xl
                bg-gradient-to-r
       from-[#312E81]
via-[#4338CA]
to-[#6366F1]
                text-white
                flex
                items-center
                justify-center
                shadow-lg
              "
            >
              <MdDraw className="text-3xl" />
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
                Customer Signature
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Work order acknowledgment and approval
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-11
              h-11
              rounded-2xl
              bg-gray-100
              hover:bg-gray-200
              flex
              items-center
              justify-center
              transition-all
            "
          >
            <MdClose className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* AGREEMENT */}
        <div
          className="
            rounded-3xl
            border
            border-indigo-100
            bg-indigo-50
            p-5
            text-sm
            text-indigo-900
            leading-relaxed
            mb-6
          "
        >
          <strong>By signing this document,</strong> you acknowledge that all
          work has been completed to your satisfaction based on the service
          notes, technician updates, and supporting documentation provided in
          this work order.
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
              Customer Name
            </label>

            <input
              type="text"
              placeholder="Enter customer full name"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
              Signature Date
            </label>

            <input
              type="date"
              value={signatureDate}
              onChange={(e) => setSignatureDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* SIGNATURE CANVAS */}
        <div
          className="
            rounded-[30px]
            border
            border-gray-200
            bg-gray-50
            p-5
          "
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-[#1E1B4B]">
                Draw Signature
              </h3>

              <p className="text-xs text-gray-500 mt-1">
                Use mouse or trackpad to sign
              </p>
            </div>

            <button
              onClick={clearCanvas}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-2xl
                bg-red-50
                text-red-600
                border
                border-red-100
                hover:bg-red-100
                transition-all
                text-sm
                font-medium
              "
            >
              <MdDeleteOutline className="text-lg" />
              Clear
            </button>
          </div>

          <div
            className="
              rounded-3xl
              overflow-hidden
              border-2
              border-dashed
              border-gray-300
              bg-white
            "
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={260}
              className="
                w-full
                h-[260px]
                cursor-crosshair
              "
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-7">
          <button
            onClick={onClose}
            className="
              px-5
              py-3
              rounded-2xl
              border
              border-gray-200
              bg-white
              text-gray-700
              font-medium
              hover:bg-gray-50
              transition-all
            "
          >
            Cancel
          </button>

          <button
            onClick={handleUpload}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-6
              py-3
              rounded-2xl
              bg-gradient-to-r
             from-[#1E1B4B]
via-[#312E81]
to-[#4338CA]
              text-white
              font-semibold
              shadow-md
              hover:shadow-lg
              hover:scale-[1.02]
              transition-all
            "
          >
            <MdSave className="text-xl" />

            {loadingAssignImage ? "Uploading..." : "Save Signature"}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default WOSignatureModal;
