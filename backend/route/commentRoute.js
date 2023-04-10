const express = require("express");
const Comment = require("../model/comment");
const Account = require("../model/account");
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
router.delete("/:postId/:userId", async (req, res) => {
  await Comment.deleteOne({
    postId: req.params.postId,
    userId: req.params.userId,
  })
    .then(() => {
      res.json("deleted successfully");
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

// Get comments by post
// router.get("/comments/:postId", async (req, res) => {
//   try {
//     const comments = await Comment.find({
//       postId: req.body.postId,
//     }).populate("userId", "username avatar"); // Add populate to fetch user data

//     // Map comments to include user data and avatar URL
//     const commentsWithUserData = comments.map((comment) => {
//       const user = comment.userId;
//       const avatarURL = user.avatar.filename
//         ? `http://${req.headers.host}/account/profile/avatar/${user.avatar.filename}`
//         : null;

//       return {
//         ...comment._doc,
//         username: user.username,
//         avatarURL: avatarURL,
//       };
//     });

//     res.status(200).json(commentsWithUserData);
//   } catch (err) {
//     res.status(401).json(err);
//   }
// });
// Get comments by post
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    });
    // Map comments to include user data and avatar URL
    const commentsWithUserData = await Promise.all(
      comments.map(async (comment) => {
        const user = await Account.findOne({ userId: comment.userId });
        const username = user ? user.username : "";
        const userAvatar = user.avatar.filename || null;
        const avatarURL = userAvatar
          ? `http://${req.headers.host}/account/profile/avatar/${userAvatar}`
          : null;

        return {
          comment: comment.comment,
          timestamp: comment.timestamp,
          username: username,
          avatarURL: avatarURL,
        };
      })
    );

    res.status(200).json(commentsWithUserData);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Count comment by post
router.get("/counts/", async (req, res) => {
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
