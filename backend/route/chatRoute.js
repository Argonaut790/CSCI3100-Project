// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

// require("../model/post");

// const TweetModel = mongoose.model("posts");

// router.post("/", async (req, res) => {
//   const { image, desc, tags } = req.body;
//   const data = { image, desc, tags };
//   console.log(`data = ${desc}`);

//   try {
//     //create Object in db
//     await TweetModel.insertMany([data]);
//     res.status(200);
//     console.log("Data inserted successfully");
//   } catch (error) {
//     res.status(400);
//     console.log(error);
//   }
// });

// module.exports = router;
