const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Added for file system operations
const Course = require("../models/course");
const Comment = require("../models/comment");
const User = require("../models/user");
const router = express.Router();

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  const uploadDirectory = path.resolve(`./public/uploads/${req.user._id}`);

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDirectory)) {
   fs.mkdirSync(uploadDirectory, { recursive: true });
  }
  cb(null, uploadDirectory);
 },
 filename: function (req, file, cb) {
  const fileName = `${Date.now()}-${file.originalname}`;
  cb(null, fileName);
 },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
 res.render("addCourse", { user: req.user });
});

router.get("/:id", async (req, res) => {
 const course = await Course.findById(req.params.id).populate("instructor").populate('enrolledStudents', 'fullName')
 const comments = await Comment.find({ courseId: req.params.id }).populate(
  "createdBy"
 );
 const user = await User.findById(req.user._id).populate("enrolledCourses");

 //   console.log("comments", comments);
 //  console.log(req.params.id, "Stay Tunrd,: ", req);
 //  console.log(req)
 console.log(user)
 //  const user = await User.findById(userId).populate('enrolledCourses');
 console.log("User Enrolled Courses:", user.enrolledCourses);

 res.render("coursepage", {
  user,
  course,
  comments,
 });
});

// router.get("/purchase/:courseId",(req,res)=>{
//     const course= Course.updateOne(req.params.id,req.user.)
// })

router.post("/purchase/:courseId", async (req, res) => {
 const courseId = req.params.courseId;
 const userId = req.user._id;

 // Update user's enrolled courses
 await User.findByIdAndUpdate(userId, { $push: { enrolledCourses: courseId } });

 // Update course's enrolled students
 await Course.findByIdAndUpdate(courseId, {
  $push: { enrolledStudents: userId },
 });

 // Congratulate the user
 const course = await Course.findById(courseId);
 res.render("congratulations", { user: req.user, course });
});

router.get("/comments/:courseId", async (req, res) => {
 await Comment.create({
  content: req.body.content,
  createdBy: req.user._id,
  courseId: req.params.courseId,
 });
 return res.redirect(`/course/${req.params.courseId}`);
});

router.post("/add-new", upload.single("coverImage"), async (req, res) => {
 const Body = req.body;
 const File = req.file;

 const userDirectory = `uploads/${req.user._id}`;
 const coverImageURL = `${userDirectory}/${File.filename}`;

 Course.create({
  title: Body.title,
  details: Body.details,
  price: Body.price,
  mode: Body.mode,
  coverImage: coverImageURL,
  instructor: req.user._id,
 });

 return res.redirect("/courses");
});

module.exports = router;
