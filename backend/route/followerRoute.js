const express = require("express");
const Follower = require("../model/follower");
const Account = require("../model/account");
const router = express.Router();

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
    const updatedAccount = await Account.updateOne(
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

// Reject follow request
router.delete("/", async (req, res) => {
  await Follower.deleteOne({
    followedUserId: req.body.followedUserId,
    followerUserId: req.body.followerUserId,
  })
    .then(() => {
      res.json("deleted successfully");
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

module.exports = router;
