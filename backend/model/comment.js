const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  // TODO: check duplicate id
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
