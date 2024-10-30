import { prisma } from "../db.js"

export async function getfileUpload(req, res) {
  const folders = await prisma.folder.findMany()
  res.render("file-upload-form", { folders })
}

export async function postFileUpload(req, res) {
  // Cloudinary upload result is stored in req.file
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File upload failed",
    })
  }

  try {
    // todo
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: req.file,
    })
  } catch (error) {}
}
