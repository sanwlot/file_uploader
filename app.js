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

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`server started @ http://localhost:${PORT}`))
