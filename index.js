const express = require("express");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const userRoute = require("./routers/user");
const courseRoute = require("./routers/course");
const Course = require("./models/course");
const cookieParser = require("cookie-parser");
const { checkForAuthentication } = require("./middlewares/authentication");

const PORT = 203;

mongoose
 .connect("mongodb://localhost:27017/bhide")
 .then((e) => console.log("DB Connected"))
 .catch((e) => console.log("DB Error: ", e));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(checkForAuthentication("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
    
 const allCourses = await Course.find({}).sort("createdAt");

 res.render("home", {
  user: req.user,
  courses: allCourses,
 });
});

app.get("/courses", async (req, res) => {
 const allCourses = await Course.find({}).sort("createdAt");

 res.render("courses", {
  user: req.user,
  courses: allCourses,
 });
});

app.use("/user", userRoute);
app.use("/course", courseRoute);

app.listen(PORT, () => {
 console.log("Server Started", PORT);
});
