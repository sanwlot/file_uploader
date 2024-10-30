import { Router } from "express"
import { indexController } from "../controllers/index.js"

const indexRouter = Router()

indexRouter.get("/", indexController)

export default indexRouter
