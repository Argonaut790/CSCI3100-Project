const express = require("express");
const router = express.Router();
const Post = require("../model/post");

router.post("/", async (req, res) => {
  const formData = req.body.formData;
  console.log("<------------------------------------>");
  if (formData) {
    const { image, desc } = formData;
    console.log(image);
    console.log(desc);
  } else {
    console.log("formData Can't pass to the backend");
  }
  console.log(req.file);
  const file = formData.get("image");
  // const desc = formData.desc;

  const fileBuffer = formData.get("image");
  Object.assign(file, { buffer: file.data });

  // save the image to GridFS
  Post.saveImage(fileBuffer, async function (err, fileId) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      // create a new post object and save it to the database
      const post = new Post({
        image: {
          filename: file.originalname,
          contentType: file.mimetype,
          fileId: fileId,
        },
        desc: formData.get("desc"),
      });
      await post.save();
      console.log("Data inserted successfully");
      res.status(200).send(post);
    }
  });
});

module.exports = router;
