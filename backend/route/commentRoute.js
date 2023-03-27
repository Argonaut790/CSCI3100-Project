const express = require("express");
const Comment = require("../model/comment");
const router = express.Router();

// Post comment
router.post("/", async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.body.postId,
      userId: req.body.userId,
      comment: req.body.comment,
    });

    const savedComment = await comment.save();
    res.status(200).json(savedComment);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Delete comment
router.delete("/", async (req, res) => {
  await Comment.deleteOne({
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

// Get comments by post
router.get("/stat/", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.body.postId,
    });

    res.status(200).json(comments);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Count comment by post
router.get("/stat/", async (req, res) => {
  try {
    const commentNum = await Comment.count({
      postId: req.body.postId,
    });

    res.status(200).json({
      commentNum: commentNum,
    });
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
