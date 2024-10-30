import { Router } from "express"
import { getFolder, postNewFolder } from "../controllers/folders.js"
import { isAuthenticated } from "../passportConfig.js"

const foldersRouter = Router()

foldersRouter.post("/new-folder", isAuthenticated, postNewFolder)
foldersRouter.get("/:id", isAuthenticated, getFolder)

export default foldersRouter
