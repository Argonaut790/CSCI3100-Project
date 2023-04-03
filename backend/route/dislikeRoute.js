const express = require("express");
const Dislike = require("../model/dislike");
const Like = require("../model/like");
const router = express.Router();

// Dislike
router.post("/", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post. Please unlike it before disliking." });
    }

    const existingDislike = await Dislike.findOne({ postId, userId });
    if (existingDislike) {
      return res.status(400).json({ message: "You have already disliked this post." });
    }

    const newDislike = new Dislike({ postId, userId });
    await newDislike.save();

    const dislikes = await Dislike.find({ postId });
    const dislikeNum = dislikes.length;
    const userIds = dislikes.map((dislike) => dislike.userId);

    res.status(200).json({
      postId,
      dislikeNum,
      userIds,
    });
  } catch (err) {
    res.status(500).json({ message: "Debug 2" });
  }
});

// Undislike
router.delete("/", async (req, res) => {
  const { postId, userId } = req.query;

  await Dislike.deleteOne({ postId, userId })
      .then(() => {
        res.json("deleted successfully");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
});

// Count dislike by postId
router.get("/", async (req, res) => {
  try {
    const { postId, userId } = req.query;

    const dislikeNum = await Dislike.countDocuments({ postId });

    const isDisliked = await Dislike.exists({ postId, userId });

    res.status(200).json({
      dislikeNum,
      isDisliked,
      postId,
      userId,
    });
  } catch (err) {
    res.status(500).json({ message: "Debug 1" });
  }
});

module.exports = router;