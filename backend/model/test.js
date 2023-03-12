const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: false,
  },
});

module.exports = mongoose.model("testinfos", testSchema);
