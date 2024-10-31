import { Router } from "express"
import {
  getFolder,
  postNewFolder,
  deleteFolder,
} from "../controllers/folders.js"
import { isAuthenticated } from "../passportConfig.js"

const foldersRouter = Router()

foldersRouter.post("/new-folder", isAuthenticated, postNewFolder)
foldersRouter.get("/:id", isAuthenticated, getFolder)
foldersRouter.post("/delete/:id", isAuthenticated, deleteFolder)

export default foldersRouter
