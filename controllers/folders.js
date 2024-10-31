import { prisma } from "../db.js"

export async function postNewFolder(req, res) {
  // Ensure the folder name is provided
  const folderName = req.body.newFolder
  if (!folderName) {
    return res.status(400).json({
      success: false,
      message: "Folder name is required",
    })
  }

  try {
    // Create a new folder
    const newFolder = await prisma.folder.create({
      data: {
        userId: req.user.id,
        name: folderName,
      },
    })

    // Redirect or send success response
    res.redirect("/")
  } catch (error) {
    console.error("Error creating folder:", error)

    // Handle specific errors, such as unique constraint violations
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Folder name already exists for this user.",
      })
    }

    // General error response
    res.status(500).json({
      success: false,
      message: "Folder not created",
      error: error.message || "An unexpected error occurred.",
    })
  }
}

export async function getFolder(req, res) {
  const folderId = parseInt(req.params.id)
  try {
    // Retrieve the folder and its files by folder ID
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        files: true, // Include files within this folder
      },
    })

    if (!folder) {
      return res.status(404).send("Folder not found")
    }

    // Render 'files.ejs' with folder and files data
    res.render("files", { folder, files: folder.files })
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred")
  }
}
