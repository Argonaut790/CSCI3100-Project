const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  // userEmail: {
  //   type: String,
  //   required: true,
  // },
  image: {
    filename: String,
    contentType: String,
  },
  desc: {
    type: String,
    // required: true,
  },
  // tags: {
  //   type: String,
  //   required: true,
  // },
  // comment: {
  //   type: Array,
  // },
  timestamp: {
    type: String,
    default: Date.now(),
  },
  // public: {
  //   type: Boolean,
  //   required: true,
  // },
});

// create a virtual property to get the image URL
postSchema.virtual("imageURL").get(function () {
  return `/images/${this.image.filename}`;
});

// create a static method to save the image to GridFS
postSchema.statics.saveImage = function (file, callback) {
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db);
  const uploadStream = gridFSBucket.openUploadStream(file.originalname);
  const id = uploadStream.id;
  uploadStream.once("finish", function () {
    callback(null, id);
  });
  uploadStream.end(file.buffer);
};

module.exports = mongoose.model("Post", postSchema);
