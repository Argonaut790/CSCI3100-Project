const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  image: {
    filename: String,
    contentType: String,
  },
  desc: {
    type: String,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

// create a virtual property to get the image URL
postSchema.virtual("imageURL").get(function () {
  return `/images/${this.image.filename}`;
});

module.exports = mongoose.model("Post", postSchema);
