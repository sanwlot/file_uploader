import { Router } from "express"
import { deleteFile } from "../controllers/file.js"
import { isAuthenticated } from "../passportConfig.js"
const deleteFileRouter = Router()

deleteFileRouter.post("/delete/:id", isAuthenticated, deleteFile)
export default deleteFileRouter
