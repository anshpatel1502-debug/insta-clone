const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  caption : {
    type : String,
    default : ""
  },
  imgURL : {
    type : String,
    required : [true,"imgURl is require for creating an post"]
  },
  user : {
    type : mongoose.Schema.Types.ObjectId ,
    ref : "users",
    required : [true,"user id is require for creating an post"]
  }
})

const postModel = mongoose.model("posts",postSchema)

module.exports = postModel