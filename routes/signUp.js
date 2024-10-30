import { Router } from "express"
import { getSignUp, postSignUp } from "../controllers/signUp.js"

const signUpRouter = Router()

signUpRouter.get("/", getSignUp)

signUpRouter.post("/", postSignUp)

export default signUpRouter
