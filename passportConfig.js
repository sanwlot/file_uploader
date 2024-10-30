import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        })

        if (!user) {
          console.log("this user does not exist")
          return done(null, false, { message: "Incorrect username" })
        }
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
          console.log("wrong password")
          return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user)
      } catch (err) {
        return done(err)
      }
    }
  )
)
passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    })
    done(null, user)
  } catch (err) {
    done(err)
  }
})
export const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next()
  }
  res.redirect("/")
}
