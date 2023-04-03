const express = require("express");
const Like = require("../model/like");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const likeLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 1, // limit each IP to 1 request per windowMs
  message: "You can only like or unlike once every 10 seconds.",
});


router.post("/", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    /*
    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post." });
    }*/

    const newLike = new Like({ postId, userId });
    await newLike.save();

    const likes = await Like.find({ postId });
    const likeNum = likes.length;
    const userIds = likes.map((like) => like.userId);

    res.status(200).json({
      postId,
      likeNum,
      userIds,
    });
  } catch (err) {
    res.status(500).json({ message: "Debug 2" });
  }
});

router.get("/", async (req, res) => {
  try {
    const { postId, userId } = req.query;

    const likeNum = await Like.countDocuments({ postId });

    const isLiked = await Like.exists({ postId, userId });

    res.status(200).json({
      likeNum,
      isLiked,
      postId,
      userId,
    });
  } catch (err) {
    res.status(500).json({ message: "Debug 1" });
  }
});
// Unlike
router.delete("/", likeLimiter, async (req, res) => {
  const { postId, userId } = req.query;

  await Like.deleteOne({ postId, userId })
      .then(() => {
        res.json("deleted successfully");
      })
      .catch((err) => {
        res.status(401).json(err);
      });
});




module.exports = router;
