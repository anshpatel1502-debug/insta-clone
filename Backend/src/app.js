const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
]

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const isAllowedOrigin =
      allowedOrigins.includes(origin) ||
      /https?:\/\/.*\.vercel\.app$/i.test(origin) ||
      /https?:\/\/.*\.netlify\.app$/i.test(origin) ||
      /https?:\/\/.*\.onrender\.com$/i.test(origin)

    if (isAllowedOrigin) {
      return callback(null, true)
    }

    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

app.use(cors(corsOptions))
app.options(/(.*)/, cors(corsOptions))

/* require routes */
const authRouter = require("./routes/auth.routes")
const postRouter = require("./routes/post.routes")
const userRouter = require("./routes/user.routes")

app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is running", timestamp: new Date() });
});

/* using routes */
app.use("/api/auth",authRouter)
app.use("/api/posts",postRouter)
app.use("/api/users",userRouter)  

module.exports = app 