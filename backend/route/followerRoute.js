const express = require("express");
const Follower = require("../model/follower");
const Account = require("../model/account");
const router = express.Router();

// Get followed user list
router.get("/followed/:userId", async (req, res) => {
  try {
    const followedList = await Follower.find({
      followerUserId: req.params.userId,
      isAccepted: true,
    });
    res.status(200).json(followedList);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get follower list
router.get("/follower/:userId", async (req, res) => {
  try {
    const followerList = await Follower.find({
      followedUserId: req.params.userId,
      isAccepted: true,
    });
    res.status(200).json(followerList);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

// Get pending follower list
router.get("/pending/:userId", async (req, res) => {
  try {
    const pendingFollowerList = await Follower.find({
      followedUserId: req.params.userId,
      isAccepted: false,
    });
    res.status(200).json(pendingFollowerList);
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
      followedUserId: req.body.followedUserId,
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
        followedUserId: req.body.followedUserId,
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
  try {
    const removedRequest = await Legal.remove({
      followedUserId: req.body.followedUserId,
      followedUserId: req.body.followedUserId,
    });
    res.json(removedRequest);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
