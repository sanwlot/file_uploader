import { prisma } from "../db.js"

export async function indexController(req, res) {
  let folders = []
  try {
    folders = await prisma.folder.findMany()
  } catch (error) {}
  res.render("index", { user: req.user, folders })
}
