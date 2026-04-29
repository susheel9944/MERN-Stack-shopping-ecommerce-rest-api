import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const upload_file = async (file, folder) => {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "auto",
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
  };
};

// export const delete_file = async (file) => {
//   const res = await cloudinary.uploader.destroy(file);
//   if (res?.result === "ok") return true;
// };

export const delete_file = async (public_id) => {
  const result = await cloudinary.uploader.destroy(public_id);
  return result.result === "ok";
};
