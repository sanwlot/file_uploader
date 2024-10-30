import { prisma } from "../db.js"

export async function postNewFolder(req, res) {
  try {
    await prisma.folder.create({
      data: {
        userId: req.user.id,
        name: req.body.newFolder,
      },
    })
    res.redirect("/")
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Folder not created",
      error: error,
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
