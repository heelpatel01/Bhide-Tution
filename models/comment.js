const { Schema, model } = require("mongoose");
const moment = require("moment");

const commentSchema = new Schema(
  {
    content: {
      type: "String",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  { timestamps: true }
);

commentSchema.virtual("timeAgo").get(function () {
  return moment(this.createdAt).fromNow();
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
