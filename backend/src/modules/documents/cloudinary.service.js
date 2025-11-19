import { v2 as cloudinary } from "cloudinary";
import config from "../../config/index.js";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export function getSignedUploadParams(folder) {
  // For client direct uploads, use unsigned preset combined with server-side rules or signed parameters
  return {
    upload_preset: config.cloudinary.uploadPreset,
    folder: folder || "kyc",
  };
}

export async function deleteByPublicId(publicId) {
  if (!publicId) return null;
  const res = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  return res;
}
