const express = require("express");
const Follower = require("../model/follower");
const router = express.Router();

// Get followed user list
router.get("/followed", async (req, res) => {
  try {
    const followedList = await Follower.find({
      followerUserId: req.params.userId,
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
    });
    res.status(200).json(followerList);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});
