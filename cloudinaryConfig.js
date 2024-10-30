import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
;(async function () {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  })
})()

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto", // Allows all file types (images, videos, etc.)
    format: async (req, file) => file.originalname.split(".").pop(), // Keeps original file extension
    public_id: (req, file) => file.originalname.split(".")[0], // Keeps original filename without extension
  },
})

export const upload = multer({
  storage,
})
