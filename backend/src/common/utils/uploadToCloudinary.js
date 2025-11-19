import { v2 as cloudinary } from "cloudinary";

async function uploadToCloudinary(fileInput, options = {}) {
  return new Promise((resolve, reject) => {
    // Handle buffer upload (from memory storage)
    if (Buffer.isBuffer(fileInput)) {
      cloudinary.uploader
        .upload_stream(options, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        })
        .end(fileInput);
    }
    // Handle file path upload (from disk storage)
    else {
      cloudinary.uploader
        .upload(fileInput, options)
        .then(resolve)
        .catch(reject);
    }
  });
}

export { uploadToCloudinary };
