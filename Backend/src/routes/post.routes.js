const express = require("express")
const postRouter = express.Router()
const multer = require("multer")
const upload = multer({ Storage: multer.memoryStorage() })

const postController = require("../controllers/post.controller")
const identifyUser = require("../middlewares/auth.middleware")
const likeModel = require("../models/like.model")  

/**
 * POST /api/posts [protected]
 * - req.body = { caption,image-file }
 */
postRouter.post("/", upload.single("BMW"), identifyUser, postController.createPostController)

/**
 * GET /api/posts/ [protected]
 */
postRouter.get("/", identifyUser, postController.getPostController)

/**
 * GET /api/posts/details/:postid
 * - return an detail about specific post with the id. also check whether the post belongs to the user that the request come from
 */
postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

/**
 * @route POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params. 
 */
postRouter.post("/like/:postId", identifyUser ,postController.likePostController )

/**
 * @route POST /api/posts/unlike/:postid
 * @description unlike a post with the id provided in the request params. 
 */
postRouter.post("/unlike/:postId", identifyUser ,postController.unLikePostController )

/**
 * @route GET /api/posts/feed
 * @description get all the post created in the DB
 * @access private
 */
postRouter.get("/feed", identifyUser , postController.getFeedController)


module.exports = postRouter