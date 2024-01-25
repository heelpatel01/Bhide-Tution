const express = require("express");
const Course=require("../models/course")
const User = require("../models/user");
const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin",{ user: req.user });
});
router.get("/signup", (req, res) => {
  return res.render("signup",{ user: req.user });
});

router.get("/yourLearnings/:id",async(req,res)=>{
  
  const course = await Course.findById(req.params.id)
  .populate("instructor")
  .populate("enrolledStudents", "fullName");
 
  const user = await User.findById(req.user?._id)?.populate("enrolledCourses");
  return res.render("myCourses",{user,course});
})

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);

    console.log("token:", token);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error(error);
    return res.render("signin", {
      error: "Incorrect email or password",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
