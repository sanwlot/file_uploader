import { prisma } from "../db.js"

export async function getfileUpload(req, res) {
  const folders = await prisma.folder.findMany()
  res.render("file-upload-form", { folders, user: req.user })
}

// export async function postFileUpload(req, res) {
//   // Cloudinary upload result is stored in req.file
//   if (!req.file) {
//     return res.status(400).json({
//       success: false,
//       message: "File upload failed",
//     })
//   }

//   try {
//     try {
//       await prisma.file.create({
//         data: {
//           name: req.file.originalname,
//           url: req.file.path,
//           folderId: req.body.folderId,
//           userId: req.user.id,
//         },
//       })
//     } catch (error) {
//       console.log(error)
//       return res.status(400).json({
//         success: false,
//         message: "File not created in the database",
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message: "File uploaded successfully",
//       data: req.file,
//     })
//   } catch (error) {}
// }

export async function postFileUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File upload failed",
    })
  }

  try {
    // Log req.file to ensure it has the expected data
    console.log("File data:", req.file)

    const fileRecord = await prisma.file.create({
      data: {
        name: req.file.originalname,
        url: req.file.path,
        folderId: parseInt(req.body.folderId, 10),
        userId: req.user.id,
        // file public_id from cloudinary
      },
    })

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: fileRecord,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while uploading the file",
    })
  }
}
