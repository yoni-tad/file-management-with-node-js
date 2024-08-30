const fs = require("fs");
const UserSchema = require("../models/user_model");
const FolderSchema = require("../models/folder_model");
const jwt = require("jsonwebtoken");

exports.Register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const checkEmail = await UserSchema.findOne({ email: email });
    if (checkEmail) {
      return res.status(409).json({ message: "This email already used" });
    }

    const user = await UserSchema.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
    const createFolder = fs.mkdirSync("uploads/" + email);
    const storeFolder = await FolderSchema.create({
      folderName: email,
      folderPath: "/",
      email: email,
    });
    res.status(201).json({ message: "Registration successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = await jwt.sign({ user: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1 hour",
    });
    res.json(token)
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.Profile = async (req, res) => {
  res.json({
    message: `Welcome ${req.user.firstName}`,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
  })
}
