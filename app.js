const express = require("express");
const path = require("path");
const app = express();
const userRouter = require("./routers/user");
const PORT = 8000;
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/bhide")
  .then((err) => console.log("DB Connected Successfully"))
  .catch((err) => console.log("DB connection problem: ", err));

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// app.get("/", async (req, res) => {
//   res.render("home",{user:req.user})
// });

app.get("/", (req, res) => {
  console.log(req)
  console.log("I Just Came Here")
  res.render("home", { user: req.user }); // Pass the user object to the template
});


app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("Server Started");
});
