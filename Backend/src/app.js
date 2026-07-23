const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
console.log(process.env.FRONTEND_URL);
app.use(cors({    
  origin:process.env.FRONTEND_URL,
  credentials : true,
  redentials:true,
  methods:["GET","POST","PUT","DELETE"]
  // origin : "http://localhost:5173"
}))

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