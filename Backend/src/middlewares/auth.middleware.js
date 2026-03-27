const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function identifyUser(req,res,next){
  
    const token = req.cookies.token 
    if (!token) {
      return res.status(401).json({   
        message: "Token is not provided,unauthorized access"
      })
    }
  
    let decoded = null
  
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await userModel.findById(decoded.id).select('username')
      if(!user){
        return res.status(404).json({
          message : "user not found"
        })
      }

      req.user = user
      next()
    } catch (err) {
      console.log(err.message);
      return res.status(401).json({
        message: "user not authorized"
      })
    }    
}

// async function identifyUser(req, res, next) {
//     const token = req.cookies.token

//     if (!token) {
//         return res.status(401).json({
//             message: "Token not provided, Unauthorized access"
//         })
//     }

//     let decoded = null

//     try {
//         decoded = jwt.verify(token, process.env.JWT_SECRET)
//     } catch (err) {
//         return res.status(401).json({
//             message: "user not authorized"
//         })
//     }

//     req.user = decoded

//     next()
// }

module.exports = identifyUser