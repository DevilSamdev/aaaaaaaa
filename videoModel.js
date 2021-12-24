const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videoSchema = new Schema(
  {
    Videotype: {
      type: String,
    },
    videoname: {
      type: String,
      required: true,
    },
    authorname: {
      type: String,
      required: true,
    },
    video: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

var Video = mongoose.model("video", videoSchema);
module.exports = Video;
