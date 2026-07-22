const followModel = require("../models/follows.model")
const userModel = require("../models/user.model")

async function followUserController(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "unauthorized" })
    }

    const followerId = req.user._id
    const followeeUsername = req.params.username

    const followeeUser = await userModel.findOne({
      username: followeeUsername
    })
    if (!followeeUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    if (followerId.equals(followeeUser._id)) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      })
    }

    const isAlreadyFollowing = await followModel.findOne({
      follower: followerId,
      followee: followeeUser._id
    })
    if (isAlreadyFollowing) {
      if (isAlreadyFollowing.status === "rejected") {
        isAlreadyFollowing.status = "pending"
        await isAlreadyFollowing.save()
        return res.status(200).json({
          message: `Follow request sent to ${followeeUsername}`,
          follow: isAlreadyFollowing
        })
      }
      return res.status(200).json({
        message: `Follow request already ${isAlreadyFollowing.status}`,
        follow: isAlreadyFollowing
      })
    }

    const followRecord = await followModel.create({
      follower: followerId,
      followee: followeeUser._id
    })

    return res.status(201).json({
      message: `Follow request sent to ${followeeUsername}`,
      follow: followRecord
    })

  } catch (err) {
    console.log(err)
    return res.status(500).json({
      message: "Server error",
      error: err.message
    })
  }
}

async function acceptFollowRequestController(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const followeeId = req.user._id;  // Current user (followee) accepting
    const { username: followerUsername } = req.params;

    const followerUser = await userModel.findOne({ 
      username: followerUsername 
    });
    if (!followerUser) {
      return res.status(404).json({ 
        message: "Follower user does not exist" 
      });
    }

    const followerId = followerUser._id;

    const updatedFollow = await followModel.findOneAndUpdate(
      { 
        follower: followerId, 
        followee: followeeId, 
        status: "pending" 
      },
      { 
        status: "accepted" 
      },
      {
        new: true, 
        runValidators: true 
      }
    );
    if (!updatedFollow) {
      return res.status(404).json({ message: `No pending request from ${followerUsername}` });
    }

    res.status(200).json({
      message: `Accepted follow request from ${followerUsername}`,
      follow: updatedFollow
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}


async function rejectFollowRequestController(req, res) {
  try {
    const followeeId = req.user._id
    const followerUsername = req.params.username

    const followerUser = await userModel.findOne({
      username: followerUsername
    })

    if (!followerUser) {
      return res.status(404).json({
        message: "Follower user not found"
      })
    }

    const followRequest = await followModel.findOne({
      follower: followerUser._id,
      followee: followeeId,
      status: "pending"
    })
    if (!followRequest) {
      return res.status(404).json({
        message: "No pending follow request found"
      })
    }
    followRequest.status = "rejected"
    await followRequest.save()

    return res.status(200).json({
      message: `You rejected ${followerUsername}'s request`,
      follow: followRequest
    })

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    })
  }
}

async function unfollowUserController(req, res) {
  try {
    const followerId = req.user._id
    const followeeUsername = req.params.username

    const followeeUser = await userModel.findOne({
      username: followeeUsername
    })

    if (!followeeUser) {
      return res.status(404).json({
        message: "User not found"
      })
    }

    const isUserFollowing = await followModel.findOne({
      follower: followerId,
      followee: followeeUser._id
    })

    if (!isUserFollowing) {
      return res.status(200).json({
        message: `You are not following ${followeeUsername}`
      })
    }

    await followModel.findByIdAndDelete(isUserFollowing._id)

    return res.status(200).json({
      message: `You have unfollowed ${followeeUsername}`
    })

  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message
    })
  }
}

async function getPendingFollowRequestsController(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const followeeId = req.user._id
    const requests = await followModel
      .find({ followee: followeeId, status: "pending" })
      .populate("follower", "username profileImage bio")

    return res.status(200).json({
      message: "Pending follow requests fetched successfully",
      requests
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Server error", error: err.message })
  }
}

module.exports = {
  followUserController,
  unfollowUserController,
  acceptFollowRequestController,
  rejectFollowRequestController,
  getPendingFollowRequestsController
}
