const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dislikeSchema = new Schema({
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

module.exports = mongoose.model("Like", dislikeSchema);
