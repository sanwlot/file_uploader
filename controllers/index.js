import { prisma } from "../db.js"

export async function indexController(req, res) {
  const userId = req.user?.id
  let userFolders = []

  try {
    // Fetch folders only for the logged-in user
    if (userId) {
      userFolders = await prisma.folder.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }, // sort by creation date
      })
    }
  } catch (error) {
    console.error("Error fetching folders:", error)
    return res.status(500).send("Error loading folders") // return an error response
  }

  res.render("index", { user: req.user, folders: userFolders })
}
