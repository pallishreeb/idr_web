/** @format */

import React, { useRef, useState } from "react";

import ReactModal from "react-modal";

import { useDispatch, useSelector } from "react-redux";

import {
  MdDraw,
  MdSave,
  MdClose,
  MdDelete,
  MdPerson,
  MdCalendarToday,
} from "react-icons/md";

import {
  uploadServiceTicketSign,
  getServiceTicketDetails,
} from "../actions/serviceTicket";

import { toast } from "react-toastify";

import "./SignatureModal.css";

const SignatureModal = ({ isOpen, onClose, serviceTicketId }) => {
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

    ctx.lineWidth = 2.5;

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

  // CLEAR CANVAS
  const clearCanvas = () => {
    const canvas = canvasRef.current;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // CHECK EMPTY CANVAS
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

  // UPLOAD SIGNATURE
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

    const blob = await fetch(dataURL).then((res) => res.blob());

    const image = new File([blob], "signature.png", {
      type: "image/png",
    });

    const formData = new FormData();

    formData.append("service_ticket_id", serviceTicketId);

    formData.append("image", image);

    formData.append("signature_name", signatureName);

    formData.append("signature_date", formatDateToDDMMYYYY(signatureDate));

    dispatch(uploadServiceTicketSign(serviceTicketId, formData))
      .then((data) => {
        if (data.code === "ST201") {
          toast.success("Signature uploaded successfully.");

          dispatch(getServiceTicketDetails(serviceTicketId));

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
      className="
        max-w-4xl
        w-full
        mx-auto
        bg-white
        rounded-[28px]
        shadow-2xl
        overflow-hidden
        outline-none
        max-h-[95vh]
        overflow-y-auto
      "
      overlayClassName="
        fixed
        inset-0
        bg-black/50
        z-50
        flex
        items-center
        justify-center
        p-4
      "
    >
      {/* TOP BORDER */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

      <div className="p-6 md:p-8">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-indigo-100
                text-indigo-600
                flex
                items-center
                justify-center
              "
            >
              <MdDraw className="text-3xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1E1B4B]">
                Client Signature
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Please review and sign below to confirm work completion.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              w-11
              h-11
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
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* AGREEMENT */}
        <div
          className="
            bg-indigo-50
            border
            border-indigo-100
            rounded-2xl
            p-5
            mb-6
          "
        >
          <p className="text-sm leading-relaxed text-gray-700">
            <span className="font-semibold text-[#1E1B4B]">Agreement:</span> By
            signing this document, you acknowledge that all work performed has
            been completed satisfactorily according to the notes, updates, and
            supporting photos provided in this service ticket.
          </p>
        </div>

        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
              Customer Name
            </label>

            <div className="relative">
              <div
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >
                <MdPerson className="text-lg" />
              </div>

              <input
                type="text"
                placeholder="Enter your full name"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-2xl
                  pl-10
                  pr-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />
            </div>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
              Signature Date
            </label>

            <div className="relative">
              <div
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              >
                <MdCalendarToday className="text-lg" />
              </div>

              <input
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-2xl
                  pl-10
                  pr-4
                  py-3
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                "
              />
            </div>
          </div>
        </div>

        {/* SIGNATURE AREA */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-[#1E1B4B]">
                Draw Signature
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Use your mouse or trackpad to sign below
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
                rounded-xl
                bg-red-50
                text-red-600
                text-sm
                font-semibold
                hover:bg-red-100
                transition-all
              "
            >
              <MdDelete className="text-lg" />
              Clear
            </button>
          </div>

          {/* CANVAS */}
          <div
            className="
              bg-gray-50
              border
              border-gray-200
              rounded-[24px]
              p-4
              overflow-hidden
            "
          >
            <canvas
              ref={canvasRef}
              width={900}
              height={260}
              className="
                w-full
                bg-white
                rounded-2xl
                border
                border-dashed
                border-gray-300
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
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onClose}
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
          >
            <MdClose className="text-lg" />
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
              from-indigo-500
              via-purple-500
              to-pink-500
              text-white
              text-sm
              font-semibold
              shadow-sm
              hover:shadow-md
              transition-all
            "
          >
            <MdSave className="text-lg" />

            {loadingAssignImage ? "Uploading..." : "Save Signature"}
          </button>
        </div>
      </div>
    </ReactModal>
  );
};

export default SignatureModal;
