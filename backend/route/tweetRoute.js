const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../model/post");
const { GridFSBucket } = require("mongodb");

//multer
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Setup GridFS
const conn = mongoose.connection;

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file Received" });
  }

  const image = req.file;
  const desc = req.body.desc;
  console.log("<--------------------------------->");
  console.log(image);
  console.log(desc);

  //we use uploads collection to store those images' chunk
  const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });

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
    });

    post.save().then(() => {
      console.log("Data inserted successfully");
    });
  });

  uploadStream.write(image.buffer);
  uploadStream.end();
});

// Get all posts data

// Abstraction: once we get from localhost:5500/tweet,
// we will response aloo posts data to frontend
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
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
    const bucket = new GridFSBucket(conn.db, { bucketName: "uploads" });

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

module.exports = router;
