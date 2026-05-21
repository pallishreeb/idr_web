/** @format */

import CryptoJS from "crypto-js";

const SECRET_KEY =
  "AOdgJMOzJS+H9hH63/GHwMeKSx7dOXKLTAQq0g452n+Re2XtOVxM0t7/+FvB+5KN";

export const decryptResponse = (encryptedData) => {
  try {
    if (encryptedData && typeof encryptedData === "string") {
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);

      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (decryptedText) {
        return JSON.parse(decryptedText);
      }
    }

    return null;
  } catch (error) {
    console.error("Decryption failed:", error);

    return null;
  }
};
