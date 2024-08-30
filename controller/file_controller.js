const { json } = require("express");
const fs = require("fs");
const FolderSchema = require("../models/folder_model");
const FileSchema = require("../models/file_model");
const UserSchema = require("../models/user_model");
const dir = "uploads/";

exports.createFolder = async (req, res) => {
  let { path, name, email } = req.body;

  name = name.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, "");

  try {
    if (fs.existsSync(dir + email + path + name)) {
      return res.json({ message: "Folder exist!" });
    }

    const createFolder = fs.mkdirSync(dir + email + path + name);
    if (!fs.existsSync(dir + email + path + name)) {
      return res.json({ message: "Try again!" });
    }

    const storeFolder = await FolderSchema.create({
      folderName: name,
      folderPath: path,
      email: email,
    });
    res.status(201).json({ message: "Folder successfully created" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFiles = async (req, res) => {
  const { path, email } = req.body;

  try {
    const filePath = dir + email + path;
    if (!fs.existsSync(filePath)) {
      return res.json({ message: "Folder doesn't exist!" });
    }

    const fileList = fs.readdirSync(filePath);
    if (fileList == "") {
      return res.json({ message: "Empty folder" });
    }

    res.json(fileList);
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await UserSchema.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const quota = user.quota + req.file.size;
        
    const updateQuota = await UserSchema.updateOne(
      {
        email: email,
      },
      { quota: quota }
    );

    const storeFile = await FileSchema.create({
      fileName: req.file.originalname,
      filePath: req.file.destination,
      size: req.file.size,
      type: req.file.mimetype,
      email: email,
    });

    res.status(201).json({ message: "Successfully upload files" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.DeleteFolder = async (req, res) => {};
