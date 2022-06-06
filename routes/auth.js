const express = require("express");
const User = require("../models/userModel");
const router = express.Router();
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");
const Token = require("../models/tokenModel");

router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password,
    });
    const savedUser = await newUser.save();
    await sendEmail(savedUser, "verify-email");
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Password is incorrect", success: false });
    }
    if (user.isVerified === false) {
      return res
        .status(200)
        .json({ message: "Please verify your email", success: false });
    }
    const token = jsonwebtoken.sign(
      { _id: user._id, name: user.name, email: user.email },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      data: token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    const tokenObj = await Token.findOne({ token });
    if (!tokenObj) {
      return res.status(200).json({ message: "Token is invalid" });
    }
    const user = await User.findOne({ _id: tokenObj.userId.toString() });
    if (!user) {
      return res.status(200).json({ message: "User does not exist" });
    }
    user.isVerified = true;
    await user.save();
    await Token.findOneAndDelete({ token });
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/send-reset-password-link", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User does not exist", success: false });
    }
    await sendEmail(user, "reset-password");
    res.status(200).json({ message: "Email sent successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/verify-reset-password-token", async (req, res) => {
  try {
    const { token } = req.body;
    const tokenObj = await Token.findOne({ token });
    if (!tokenObj) {
      return res
        .status(200)
        .json({ message: "Token is invalid", success: false });
    }
    const user = await User.findOne({ _id: tokenObj.userId.toString() });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User does not exist", success: false });
    }
    res
      .status(200)
      .json({ message: "Token verified successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    let { token, password } = req.body;
    const tokenObj = await Token.findOne({ token });
    if (!tokenObj) {
      return res
        .status(200)
        .json({ message: "Token is invalid", success: false });
    }
    const user = await User.findOne({ _id: tokenObj.userId.toString() });
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);
    user.password = password;
    await user.save();
    await Token.findOneAndDelete({ token });
    res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
});

module.exports = router;
