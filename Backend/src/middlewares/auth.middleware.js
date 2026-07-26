const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function identifyUser(req,res,next){
    const authHeader = req.headers.authorization || ""
    const tokenFromHeader = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null
    const token = req.cookies?.token || tokenFromHeader

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

module.exports = identifyUser