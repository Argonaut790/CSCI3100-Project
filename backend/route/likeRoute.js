const express = require("express");
const Like = require("../model/like");
const router = express.Router();

// Like
router.post("/", async (req, res) => {
  try {
    const like = new Like({
      postId: req.body.postId,
      userId: req.body.userId,
    });

    const savedLike = await like.save();
    res.status(200).json(savedLike);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Unlike
router.delete("/", async (req, res) => {
  await Like.deleteOne({
    postId: req.body.postId,
    userId: req.body.userId,
  })
    .then(() => {
      res.json("deleted successfully");
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

// Count like by postId
router.get("/", async (req, res) => {
  try {
    const likeNum = await Like.count({
      postId: req.body.postId,
    });

    res.status(200).json({
      likeNum: likeNum,
    });
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
