import cloudinary from "../configs/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder = "rms") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};

export const uploadMultipleToCloudinary = async (files, folder = "rms") => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder),
  );

  return Promise.all(uploadPromises);
};

export const getPublicIdFromUrl = (url, folder) => {
  const parts = url.split("/");
  const fileNameWithExtension = parts[parts.length - 1];
  const publicIdWithoutExtension = fileNameWithExtension.split(".")[0];
  return `${folder}/${publicIdWithoutExtension}`;
};
