import { prisma } from "../db.js"
import { v2 as cloudinary } from "cloudinary"

export async function deleteFile(req, res) {
  const { id } = req.params
  try {
    // Find the file in the database
    const file = await prisma.file.findUnique({
      where: {
        id: parseInt(id),
      },
    })
    console.log("file publicId:", file.publicId)
    if (!file) {
      return res.status(404).send("File not found")
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(file.publicId)
    console.log(result)

    if (result.result !== "ok") {
      return res.status(500).json({
        success: false,
        message: "Error deleting file from Cloudinary",
        error: result,
      })
    }

    // Delete the file from the database
    await prisma.file.delete({
      where: {
        id: parseInt(id),
      },
    })

    res.redirect("/")
  } catch (error) {
    console.error("Deletion error:", error)
    res.status(500).json({ success: false, message: "Error deleting file" })
  }
}
