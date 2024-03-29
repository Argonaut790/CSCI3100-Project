const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../model/post");
const Account = require("../model/account");
const Follower = require("../model/follower");
const { GridFSBucket } = require("mongodb");
const sharp = require("sharp");

//multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Setup GridFS
const conn = mongoose.connection;

// Upload post
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file Received" });
  }

  const image = req.file;
  const desc = req.body.desc;

  // Compress and resize the image using sharp
  const metadata = await sharp(image.buffer).metadata();

  const originalWidth = metadata.width;
  const originalHeight = metadata.height;
  const desiredSize = 1280;

  // Calculate the central part of the image
  const cropSize = Math.min(originalWidth, originalHeight);
  const left = parseInt((originalWidth - cropSize) / 2);
  const top = parseInt((originalHeight - cropSize) / 2);

  const resizedImageBuffer = await sharp(image.buffer)
    .extract({ left: left, top: top, width: cropSize, height: cropSize }) // Set the cropping region
    .resize({
      width: desiredSize,
      height: desiredSize,
      kernel: sharp.kernel.lanczos3,
    }) // Set the desired dimensions
    .jpeg({ quality: 95 }) // Set the desired output format
    .toBuffer();
  console.log("cropsize: " + cropSize);

  console.log("<--------------------------------->");
  console.log(image);
  console.log(desc);

  //we use uploads collection to store those images' chunk
  const bucket = new GridFSBucket(conn.db, { bucketName: "posts" });

  const uploadStream = bucket.openUploadStream(image.originalname, {
    contentType: image.mimetype,
  });

  uploadStream.on("error", (err) => {
    console.error(err);
    res.status(500).send(err);
  });

  uploadStream.on("finish", (file) => {
    res
      .status(200)
      .json({ message: "File uploaded and stored in MongoDB", file });

    // Create a new post object and save it to the database
    const post = new Post({
      image: {
        filename: file.filename,
        contentType: file.contentType,
      },
      desc: desc,
      userId: req.body.userId,
      retweetedPostId: req.body.retweetedPostId || null,
    });

    post.save().then(() => {
      console.log("Data inserted successfully");
    });
  });

  uploadStream.write(resizedImageBuffer);
  uploadStream.end();
});

// Retweet post
router.post("/retweet", async (req, res) => {
  const { desc, userId, retweetedPostId } = req.body;
  console.log(desc + " " + userId + " " + retweetedPostId);
  try {
    const retweetPost = new Post({
      desc: desc,
      userId: userId,
      retweetedPostId: retweetedPostId,
    });

    const savedRetweetPost = await retweetPost.save();
    res.status(200).json(savedRetweetPost);
  } catch (err) {
    res.status(401).json(err);
  }
});

// Get all posts data

// Abstraction: once we get from localhost:5500/tweet,
// we will response aloo posts data to frontend
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; //using the URL /tweet?limit=10&page=${page} to pass the limit and page variable
    const page = parseInt(req.query.page) || 0; //10 post each page
    const skip = limit * page; //bias, skipping how many posts

    /*
    For Profile & User pages: if targetUserId is not null, then we will only get the posts that belong to the user
    For home page: if targetUserId is null, then we will only get the posts from following of the user
    */
    let posts;
    if (req.query.targetUserId) {
      posts = await Post.find({ userId: req.query.targetUserId })
        .sort({ timestamp: -1 })
        .skip(skip) //base on which page to show only the following posts
        .limit(limit);
    } else {
      const followedList = await Follower.find({
        followerUserId: req.query.userId,
        isAccepted: true,
      });
      if (!followedList || followedList == []) {
        res.json([]);
      }
      const followedUserIds = followedList.map(
        (followed) => followed["followedUserId"]
      );
      followedUserIds.push(req.query.userId);
      posts = await Post.find({ userId: { $in: followedUserIds } })
        .sort({ timestamp: -1 })
        .skip(skip) //base on which page to show only the following posts
        .limit(limit);
    }

    // getting username and passing image url to fetch the whole chunks not 1 by 1
    const postsWithImageUrls = await Promise.all(
      posts.map(async (post) => {
        const user = await Account.findOne({ userId: post.userId });
        const username = user ? user.username : "";
        const imageUrl = `http://${req.headers.host}/tweet/image/${post.image.filename}`;

        const userAvatar = user.avatar.filename || null;
        let avatarURL = null;
        if (userAvatar) {
          avatarURL = `http://${req.headers.host}/account/profile/avatar/${userAvatar}`;
        } else {
          avatarURL = null;
        }
        return { ...post._doc, imageUrl, username, avatarURL };
      })
    );

    res.json(postsWithImageUrls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post by id include comments
router.get("/post/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.postId });
    const user = await Account.findOne({ userId: post.userId });
    // find comment in comment collection and sort by timestamp

    // const comments = await Comment.find({ postId: req.params.postId }).sort({
    //   timestamp: -1,
    // });
    const username = user ? user.username : "";
    const imageUrl = `http://${req.headers.host}/tweet/image/${post.image.filename}`;

    const userAvatar = user.avatar.filename || null;
    let avatarURL = null;
    if (userAvatar) {
      avatarURL = `http://${req.headers.host}/account/profile/avatar/${userAvatar}`;
    } else {
      avatarURL = null;
    }
    res.status(200).json({ ...post._doc, imageUrl, username, avatarURL });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts info without image
router.get("/info/", async (req, res) => {
  try {
    //get all posts
    const posts = await Post.find().sort({ timestamp: -1 });

    // getting username and passing image url to fetch the whole chunks not 1 by 1
    const postInfo = await Promise.all(
      posts.map(async (post) => {
        const user = await Account.findOne({ userId: post.userId });
        const username = user ? user.username : "";
        return {
          id: post._id,
          postId: post.postId,
          desc: post.desc,
          retweetId: post.retweetedPostId,
          username: username,
          timestamp: post.timestamp,
        };
      })
    );
    res.json(postInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve an image

// Abstraction here: Cause we used GridFSBucket to store the image into multiples chunck
// we have to used the related function to retrieve and combine it
// here we have openDownloadStreamByName(filename), base on we pass the filename to the URL

router.get("/image/:filename", async (req, res) => {
  try {
    // connect to mongo upload collection bucket,
    // here bucket we mean we have "upload.chunks" and "uploads.files"
    // so it actually have two collection but the root is upload which is the bucket
    const bucket = new GridFSBucket(conn.db, { bucketName: "posts" });

    //get filename from URL params
    const filename = req.params.filename;

    // config download type
    res.set("Content-Type", "image/jpeg"); // Or any other appropriate content type
    const downloadStream = bucket.openDownloadStreamByName(filename);

    downloadStream.on("error", (error) => {
      res.status(500).json({ message: error.message });
    });

    //pipe the downloaded result to res
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get post number by userId
router.get("/stat/:userId", async (req, res) => {
  try {
    const postNum = await Post.find({ userId: req.params.userId }).count({
      sent_at: null,
    });
    res.status(200).json({
      postNum: postNum,
    });
  } catch (err) {
    res.status(401).json(err);
  }
});

// Delete post by Id
router.delete("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post with the provided postId
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Remove the post with the provided postId
    const result = await Post.deleteOne({ _id: postId });

    // Delete all retweeted post
    const retweet = await Post.deleteMany({ retweetedPostId: post.postId });

    if (result.deletedCount === 1) {
      // Delete the image using GridFSBucket
      const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: "posts",
      });

      // Find the image file in the posts.files collection
      const imageFile = await bucket
        .find({ filename: post.image.filename })
        .toArray();
      if (imageFile.length > 0) {
        // Delete the image file and its associated chunks
        await bucket.delete(imageFile[0]._id);
      }

      res.json({
        success: true,
        message: "Post and image deleted successfully",
      });
    } else {
      res.status(404).json({ success: false, message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Delete all posts and retweets associated with a user
router.delete("/adminDelete/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find all posts and retweets associated with the userId
    const posts = await Post.find({ userId });

    // Remove all posts and retweets associated with the userId
    const result = await Post.deleteMany({ userId });

    // Update the retweeted posts that are retweeted by the user with that userId
    await Post.updateMany(
      { retweetedPostId: { $in: posts.map((post) => post.postId) } },
      { $unset: { retweetedPostId: "" } }
    );

    // Delete the images associated with the posts using GridFSBucket
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "posts",
    });

    for (const post of posts) {
      if (post.image && post.image.filename) {
        // Find the image file in the posts.files collection
        const imageFile = await bucket
          .find({ filename: post.image.filename })
          .toArray();

        if (imageFile.length > 0) {
          // Delete the image file and its associated chunks
          await bucket.delete(imageFile[0]._id);
        }
      }
    }

    res.json({
      success: true,
      message:
        "All posts, retweets, and images associated with the userId were deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
