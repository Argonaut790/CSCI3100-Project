const express = require("express");
const Dislike = require("../model/dislike");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const dislikeLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1, // limit each IP to 1 request per windowMs
  message: "You can only dislike or undislike once every 10 seconds.",
});


// Dislike
router.post("/", dislikeLimiter, async (req, res) => {
  try {
    const { postId, userId } = req.body;

    /*
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post." });
    }*/

    const newdislike = new Dislike({ postId, userId });
    await newdislike.save();

    const dislikes = await Dislike.find({ postId });
    const dislikeNum = Dislikes.length;
    const userIds = dislikes.map((like) => like.userId);

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
router.delete("/", dislikeLimiter, async (req, res) => {
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

    const dislikeNum = await Like.countDocuments({ postId });

    const isDisliked = await Like.exists({ postId, userId });

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
