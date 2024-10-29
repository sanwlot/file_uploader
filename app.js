import express from "express"
// import path from "path"
import dotenv from "dotenv"
import session from "express-session"
import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
dotenv.config()

const app = express()
const prisma = new PrismaClient()

// cloudinary config
;(async function () {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  })
})()

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    resource_type: "auto", // Allows all file types (images, videos, etc.)
    format: async (req, file) => file.originalname.split(".").pop(), // Keeps original file extension
    public_id: (req, file) => file.originalname.split(".")[0], // Keeps original filename without extension
  },
})

const upload = multer({
  storage,
})

// import { fileURLToPath } from "url"
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// passport config
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
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next()
  }
  res.redirect("/")
}

// app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }))
app.use(passport.session())

app.get("/", async (req, res) => {
  let folders = []
  try {
    folders = await prisma.folder.findMany()
  } catch (error) {}
  res.render("index", { user: req.user, folders })
})
app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
)
app.get("/sign-up", (req, res) => res.render("sign-up-form"))
app.post("/sign-up", async (req, res, next) => {
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
})
app.get("/file-upload", isAuthenticated, (req, res) =>
  res.render("file-upload-form")
)
app.post("/file-upload", upload.single("file"), (req, res) => {
  // Cloudinary upload result is stored in req.file
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File upload failed",
    })
  }

  res.status(200).json({
    success: true,
    message: "File uploaded successfully",
    data: req.file,
  })
})
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err)
    }
    res.redirect("/")
  })
})

// FOLDERS

app.post("/new-folder", isAuthenticated, async (req, res) => {
  try {
    await prisma.folder.create({
      data: {
        userId: req.user.id,
        name: req.body.newFolder,
      },
    })
    res.redirect("/")
  } catch (error) {
    console.log(error)
    res.status(400).json({
      success: false,
      message: "Folder not created",
      error: error,
    })
  }
})

app.get("/folders/:id", isAuthenticated, async (req, res) => {
  const folderId = parseInt(req.params.id)
  try {
    // Retrieve the folder and its files by folder ID
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: {
        files: true, // Include files within this folder
      },
    })

    if (!folder) {
      return res.status(404).send("Folder not found")
    }

    // Render 'files.ejs' with folder and files data
    res.render("files", { folder, files: folder.files })
  } catch (error) {
    console.error(error)
    res.status(500).send("An error occurred")
  }
})

app.listen(4000)
