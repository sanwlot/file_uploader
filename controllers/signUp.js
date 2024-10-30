import { prisma } from "../db.js"
import bcrypt from "bcryptjs"

export function getSignUp(req, res) {
  res.render("sign-up-form")
}

export async function postSignUp(req, res, next) {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      await prisma.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        },
      })
      res.redirect("/")
    })
  } catch (err) {
    return next(err)
  }
}
