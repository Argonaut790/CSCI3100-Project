const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const followerSchema = new Schema({
  followedUserId: {
    type: String,
    required: true,
  },
  followerUserId: {
    type: String,
    required: true,
  },
  isAccepted: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: String,
    default: Date.now(),
  },
});

followerSchema.index(
  { followedUserId: 1, followerUserId: 1 },
  { unique: true }
);

module.exports = mongoose.model("followers", followerSchema);
