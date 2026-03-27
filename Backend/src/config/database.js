const mongoose = require("mongoose")

async function connectedToDb(){
  await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
      console.log("Database is connect to MongoDB")
    })
}

module.exports = connectedToDb