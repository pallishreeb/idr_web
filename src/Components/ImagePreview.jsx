import { useEffect, useState } from "react";
import heic2any from "heic2any";
import { MdImage } from "react-icons/md";



const ImagePreview = ({ fileUrl, onClick }) => {
  const [previewUrl, setPreviewUrl] = useState(fileUrl);
  const [isHeicFailed, setIsHeicFailed] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        if (fileUrl.toLowerCase().includes(".heic")) {
          const response = await fetch(fileUrl);

          const blob = await response.blob();

          const convertedBlob = await heic2any({
            blob,
            toType: "image/jpeg",
            quality: 0.9,
          });

          const convertedUrl =
            URL.createObjectURL(convertedBlob);

          setPreviewUrl(convertedUrl);
        }
      } catch (err) {
        console.error(
          "HEIC conversion failed",
          err,
        );

        setIsHeicFailed(true);
      }
    };

    loadImage();
  }, [fileUrl]);

  if (isHeicFailed) {
    return (
      <div
        className="
          w-20
          h-20
          rounded-2xl
          border
          border-orange-200
          bg-orange-50
          flex
          flex-col
          items-center
          justify-center
          cursor-pointer
        "
        onClick={() =>
          window.open(fileUrl, "_blank")
        }
      >
        <MdImage className="text-orange-600 text-xl" />

        <span className="text-[10px] font-semibold text-orange-600">
          HEIC
        </span>
      </div>
    );
  }

  return (
    <img
      src={previewUrl}
      alt="Attachment"
      className="w-20 h-20 rounded-2xl object-cover border border-gray-200 cursor-pointer"
      onClick={() => onClick(previewUrl)}
    />
  );
};

export default ImagePreview;