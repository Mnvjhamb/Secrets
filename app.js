const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { log } = require("console");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const secret = "thisIsOurEncKEY.";

userSchema.plugin(encrypt, {
  secret,
  encryptedFields: ["password"],
});

const User = mongoose.model("User", userSchema);

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (req.body.password === user.password) {
      res.render("secrets");
    }
  } else {
    res.send("Please register ");
  }
});

app.post("/register", (req, res) => {
  const newUser = new User(req.body);
  newUser.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

app.listen("3000", () => {
  console.log("Server started at port 3000");
});