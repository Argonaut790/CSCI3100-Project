const express = require("express");
const Like = require("../model/like");
const Dislike = require("../model/dislike");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { postId, userId } = req.body;

    const existingDislike = await Dislike.findOne({ postId, userId });
    if (existingDislike) {
      return res.status(400).json({ message: "You have already disliked this post. Please undislike it before liking." });
    }

    const existingLike = await Like.findOne({ postId, userId });
    if (existingLike) {
      return res.status(400).json({ message: "You have already liked this post." });
    }

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
router.delete("/",  async (req, res) => {
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