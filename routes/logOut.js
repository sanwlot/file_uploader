import { Router } from "express"
import { getLogOut } from "../controllers/logOut.js"
const logOutRouter = Router()

logOutRouter.get("/", getLogOut)

export default logOutRouter
