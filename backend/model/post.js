const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // TODO: check duplicate id
  postId: {
    type: String,
    required: true,
    default: () => uuidv4().substr(0, 10),
    unique: true,
  },
  image: {
    filename: String,
    contentType: String,
  },
  desc: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  isPrivate: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Array,
    default: [],
  },
  reply: {
    type: Array,
    default: [],
  },
  retweetedPostId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// create a virtual property to get the image URL
postSchema.virtual("imageURL").get(function () {
  return `/images/${this.image.filename}`;
});

module.exports = mongoose.model("Post", postSchema);
