const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "adfndfnwjke3fdafrewrweef343234324242442342jnd23";
const mongoUrl =
  "mongodb+srv://admin:adminadmin@cluster0.5kddgqn.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => console.log(e));
require("./userDetails");
const User = mongoose.model("UserInfo");
app.post("/register", async (req, res) => {
  const { fname, lname, email, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "user exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "user not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);
    if (res.status(201)) {
      return res.json({ status: "Ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid password" });
});

app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail }).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.listen(5000, () => {
  console.log("Server Started");
});

// app.post("/post", async (req, res) => {
//   console.log(req.body);
// });

// require("./userDetails");

// const User = mongoose.model("UserInfo");
// app.post("/register", async (req, res) => {
//   const { name, email, mobileNo } = req.body;
//   console.log(req.body);
//   try {
//     await User.create({
//       uname: name,
//       email,
//       phoneNo: mobileNo,
//     });
//     res.send({ status: "ok" });
//   } catch (error) {
//     console.log(error);
//     res.send({ status: "not ok" });
//   }
// });
