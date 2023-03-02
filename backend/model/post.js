const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  userEmail: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  comment: {
    type: Array,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

module.exports = mongoose.model("posts", postSchema);
