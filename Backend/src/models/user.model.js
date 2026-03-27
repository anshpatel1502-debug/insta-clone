const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  username : {
    type : String,
    unique : [true,"user name already exists"],
    required : [true,"user name is required"]
  },
  email : {
    type : String,
    unique : [true,"email already exists"],
    required : [true,"email is required"]
  },
  password : {
    type : String,
    required : [true,"password is required"],
    select : false
  },
  bio:String,
  profileImage : {
    type : String,
    default : "https://ik.imagekit.io/dih0yop7l/download.jpg"
  },
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel