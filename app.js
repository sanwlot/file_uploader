import express from "express"
import dotenv from "dotenv"
import session from "express-session"
import passport from "passport"
import indexRouter from "./routes/index.js"
import signUpRouter from "./routes/signUp.js"
import fileUploadRouter from "./routes/fileUpload.js"
import foldersRouter from "./routes/folders.js"
import logInRouter from "./routes/logIn.js"
import logOutRouter from "./routes/logOut.js"
import deleteFileRouter from "./routes/file.js"
dotenv.config()

const app = express()

// import path from "path"
// import { fileURLToPath } from "url"
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// app.set("views", path.join(__dirname, "views"))

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }))
app.use(passport.session())

app.use("/", indexRouter)
app.use("/sign-up", signUpRouter)
app.use("/log-in", logInRouter)
app.use("/file-upload", fileUploadRouter)
app.use("/log-out", logOutRouter)
app.use("/folders", foldersRouter)
app.use("/file", deleteFileRouter)

app.listen(4000, () => console.log("server started"))
