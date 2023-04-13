const express = require("express");
const Follower = require("../model/follower");
const Account = require("../model/account");
const router = express.Router();

// Get matched record
router.get("/visiable/:followerUserId/:followedUserId", async (req, res) => {
  try {
    const follow = await Follower.findOne({
      followerUserId: req.params.followerUserId,
      followedUserId: req.params.followedUserId,
    });
    res.status(200).json(follow);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get followed user list with followed user info
router.get("/followed/:userId", async (req, res) => {
  try {
    const followedList = await Follower.find({
      followerUserId: req.params.userId,
      isAccepted: true,
    });
    const followedUserIds = followedList.map(
      (followed) => followed["followedUserId"]
    );
    const users = await Account.find({
      userId: {
        $in: followedUserIds,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get follower list with follower user info
router.get("/follower/:userId", async (req, res) => {
  try {
    const followerList = await Follower.find({
      followedUserId: req.params.userId,
      isAccepted: true,
    });
    const followerUserIds = followerList.map(
      (follower) => follower["followerUserId"]
    );
    const users = await Account.find({
      userId: {
        $in: followerUserIds,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get pending follower list with pending follower user info
router.get("/pending/:userId", async (req, res) => {
  try {
    const pendingFollowerList = await Follower.find({
      followedUserId: req.params.userId,
      isAccepted: false,
    });
    const pendingUserIds = pendingFollowerList.map(
      (pendingFollower) => pendingFollower["followerUserId"]
    );
    const users = await Account.find({
      userId: {
        $in: pendingUserIds,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get follower & followed stat
router.get("/stat/:userId", async (req, res) => {
  try {
    const followerNum = await Follower.count({
      followedUserId: req.params.userId,
      isAccepted: true,
    });
    const followedNum = await Follower.count({
      followerUserId: req.params.userId,
      isAccepted: true,
    });
    const pendingNum = await Follower.count({
      followedUserId: req.params.userId,
      isAccepted: false,
    });

    res.status(200).json({
      followedNum: followedNum,
      followerNum: followerNum,
      pendingNum: pendingNum,
    });
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get most followed accounts for suggestion
router.get("/suggestion/:userId", async (req, res) => {
  try {
    const follow = await Follower.aggregate([
      {
        $group: {
          _id: { userId: "$followedUserId", isAccepted: "$isAccepted" },
          count: { $sum: 1 },
        },
      },
      {
        $match: { "_id.isAccepted": true },
      },
      {
        $sort: { count: -1 },
      },
      { $limit: 10 },
    ]);
    const userIds = follow.map((e) => e["_id"].userId);

    // Filter followed user
    const followedUsers = await Follower.find({
      followerUserId: req.params.userId,
      followedUserId: { $in: userIds },
    });
    const followedUserIds = followedUsers.map(
      (follower) => follower.followedUserId
    );

    const suggestedUsers = userIds.filter(
      (userId) =>
        !followedUserIds.includes(userId) && userId !== req.params.userId
    );

    const users = await Account.find({
      userId: {
        $in: suggestedUsers,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Request follow
router.post("/", async (req, res) => {
  try {
    const followeduser = await Account.findOne({
      userId: req.body.followedUserId,
    });
    let isAccepted = false;
    if (!followeduser.isPrivate) {
      isAccepted = true;
    }
    const followRequest = new Follower({
      followedUserId: req.body.followedUserId,
      followerUserId: req.body.followerUserId,
      isAccepted: isAccepted,
    });

    const savedFollow = await followRequest.save();
    res.status(200).json(savedFollow);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Accept follow request
router.patch("/", async (req, res) => {
  try {
    const updatedAccount = await Follower.updateOne(
      {
        followedUserId: req.body.followedUserId,
        followerUserId: req.body.followerUserId,
        isAccepted: false,
      },
      { $set: { isAccepted: true } }
    );
    res.status(200).json(updatedAccount);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Reject follow request / Unfollow
router.delete("/", async (req, res) => {
  try {
    const { followedUserId, followerUserId } = req.query;
    const result = await Follower.deleteOne({
      followedUserId: followedUserId,
      followerUserId: followerUserId,
    });
    if (result.deletedCount > 0) {
      res.json("deleted successfully");
    } else {
      res.json("Document not found or not deleted");
    }
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Delete all relationships associated with a user
router.delete("/adminDelete/:userId", async (req, res) => {
  try {
    // Delete relationships where the user is a follower
    await Follower.deleteMany({
      followerUserId: req.params.userId,
    });

    // Delete relationships where the user is being followed
    await Follower.deleteMany({
      followedUserId: req.params.userId,
    });

    res.json("All relationships associated with the userId were deleted successfully");
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
