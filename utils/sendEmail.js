const nodemailer = require("nodemailer");
const Token = require("../models/tokenModel");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");

module.exports = async (savedUser, type) => {
  try {
    const newToken = new Token({
      token: bcrypt.hashSync(savedUser._id.toString(), 10).replaceAll("/", ""),
      userId: savedUser._id,
    });
    const savedToken = await newToken.save();

    let emailContent = "";

    if (type === "verify-email") {
      emailContent = `
    <h3>Welcome to the application</h3>
    <p>
      Please click on the following link to verify your email and complete your registration:
    </p>
    <a href="http://localhost:3000/auth/verify/${savedToken.token}">
       CLICK HERE TO VERIFY
    </a>
  `;
    } else {
      emailContent = `
    <h3>Password Reset</h3>
    <p>
      Please click on the following link to reset your password:
    </p>
    <a href="http://localhost:3000/auth/reset-password/${savedToken.token}">
       CLICK HERE TO RESET YOUR PASSWORD
    </a>
  `;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: "sheylearnings@gmail.com",
        pass: "sathyapr123.",
      },
    });

    const mailOptions = {
      from: "sheylearnings@gmail.com",
      to: savedUser.email,
      subject: "Verify your email",
      html: emailContent,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
};
