const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likeSchema = new Schema({
  // TODO: check duplicate id
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Like", likeSchema);
