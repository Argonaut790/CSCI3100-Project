const express = require("express");
const Dislike = require("../model/like");
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
    const dislike = new Dislike({
      postId: req.body.postId,
      userId: req.body.userId,
    });

    const savedDislike = await dislike.save();
    res.status(200).json(savedDislike);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Undislike
router.delete("/", dislikeLimiter, async (req, res) => {
  await Dislike.deleteOne({
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

// Count dislike by postId
router.get("/", async (req, res) => {
  try {
    const dislikeNum = await Dislike.count({
      postId: req.body.postId,
    });

    res.status(200).json({
      dislikeNum: dislikeNum,
    });
  } catch (err) {
    res.status(401).json(err);
  }
});

module.exports = router;
