const fs = require('fs')
const UserSchema = require("../models/user_model");
const FolderSchema = require("../models/file_model");

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
    const createFolder = fs.mkdirSync('uploads/'  + email);
    const storeFolder = await FolderSchema.create({
      folderName: email,
      folderPath: '/',
      email: email,
    });
    res.status(201).json({ message: "Registration successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};
