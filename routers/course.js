const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Added for file system operations
const Course = require("../models/course");
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
  const course = await Course.findById(req.params.id);
  res.render("coursepage", {
    user: req.user,
    course,
  });
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
