import { Router } from "express"
import passport from "passport"

const logInRouter = Router()

logInRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
)

export default logInRouter
