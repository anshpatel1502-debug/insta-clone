const postModel = require("../models/post.model")
const ImageKit = require("@imagekit/nodejs")
const { toFile } = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken");
const likeModel = require("../models/like.model");
const followModel = require("../models/follows.model");

const imageKit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function createPostController(req, res) {

  if (!req.file) {
    return res.status(400).json({
      message: "Image is required"
    })
  }

  const file = await imageKit.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), "file"),
    fileName: "Test",
    folder: "insta-clone-posts"
  });

  const post = await postModel.create({
    caption: req.body.caption,
    imgURL: file.url,
    user: req.user.id
  });

  res.status(201).json({
    message: "Post created successfully",
    post
  })

}

async function getPostController(req, res) {

  const userId = req.user.id

  const posts = await postModel.find({
    user: userId
  })

  res.status(200).json({
    message: "Post fetched successfully.",
    posts
  })
}

async function getPostDetailsController(req, res) {

  const userId = req.user.id
  const postId = req.params.postId

  const post = await postModel.findById(postId)

  if (!post) {
    return res.status(404).json({
      message: "Post not found"
    })
  }

  const isValidUser = post.user.toString() === userId

  if (!isValidUser) {
    return res.status(403).json({
      message: "Forbidden content"
    })
  }

  return res.status(200).json({
    message: "Post fetched successfully.",
    post
  })
}

async function likePostController(req, res) {
  const username = req.user.username
  const postId = req.params.postId

  const post = await postModel.findById(postId)

  if (!post) {
    return res.status(404).json({
      message: "post not found"
    })
  }

  const like = await likeModel.create({
    post: postId,
    user: username
  })

  res.status(200).json({
    message: "post like successfully",
    like
  })
}

async function unLikePostController(req, res) {
  const postId = req.params.postId
  const username = req.user.username

  const isLiked = await likeModel.findOne({
    post: postId,
    user: username
  })

  if (!isLiked) {
    return res.status(400).json({
      message: "post not liked"
    })
  }

  await likeModel.findOneAndDelete({ _id: isLiked._id })

  res.status(200).json({
    message: "post unlike successfully"
  })
}


async function getFeedController(req, res) {

  const User = req.user

  const posts = await Promise.all((await postModel.find({}).populate("user").lean())
    .map(async (post) => {
      const isLiked = await likeModel.findOne({
        user: User.username,
        post: post._id
      })

      post.isLiked = Boolean(isLiked)

      if (post.user) {
        const followRecord = await followModel.findOne({
          follower: User._id,
          followee: post.user._id
        })
        post.user.followStatus = followRecord ? followRecord.status : "none"
        post.user.isFollowed = followRecord ? (followRecord.status === "accepted") : false
      }

      return post
    }))
  res.status(200).json({
    message: "posts fetched successfully.",
    posts
  })
}


module.exports = {
  createPostController,
  getPostController,
  getPostDetailsController,
  likePostController,
  unLikePostController,
  getFeedController
}