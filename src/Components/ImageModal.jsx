import React from "react";

const ImageModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative bg-white rounded shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-red-500 rounded-full px-3 py-1"
        >
          ✖
        </button>
        <img
          src={imageUrl}
          alt="Full View"
          className="max-w-full max-h-screen object-contain rounded"
        />
      </div>
    </div>
  );
};

export default ImageModal;
