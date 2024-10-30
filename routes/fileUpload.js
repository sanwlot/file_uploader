import { Router } from "express"
import { getfileUpload, postFileUpload } from "../controllers/fileUpload.js"
import { isAuthenticated } from "../passportConfig.js"
import { upload } from "../cloudinaryConfig.js"

const fileUploadRouter = Router()

fileUploadRouter.get("/", isAuthenticated, getfileUpload)
fileUploadRouter.post(
  "/",
  isAuthenticated,
  upload.single("file"),
  postFileUpload
)

export default fileUploadRouter
