import heic2any from "heic2any";

export const convertHeicToJpg = async (file) => {
  if (!file.name.toLowerCase().endsWith(".heic")) {
    return file;
  }

  const convertedBlob = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.8,
  });

  return new File(
    [convertedBlob],
    file.name.replace(/\.heic$/i, ".jpg"),
    {
      type: "image/jpeg",
    }
  );
};