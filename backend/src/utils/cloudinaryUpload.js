import cloudinary from "../configs/cloudinary.js";

export const uploadToCloundinary = (fileBuffer, folder = "rms") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, resolve) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};

export const uploadMultipleToCloundinary = async (files, folder = "rms") => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder),
  );

  return Promise.all(uploadPromises);
};
