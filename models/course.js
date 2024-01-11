const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
 {
  enrolledStudents: [
   {
    type: Schema.Types.ObjectId,
    ref: "User",
   },
  ],

  title: {
   type: String,
   required: true,
  },
  details: {
   type: String,
   required: true,
  },
  price: {
   type: Number,
   required: true,
   default: 0,
  },
  instructor: {
   type: Schema.Types.ObjectId,
   ref: "User",
  },
  coverImage: {
   type: String,
   required: false,
  },
  mode: {
   enum: ["online", "offline"],
  },
 },
 { timestamps: true }
);

const Course = model("Course", courseSchema);
module.exports = Course;
