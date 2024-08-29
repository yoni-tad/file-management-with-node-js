const { json } = require("express");
const fs = require("fs");
const FolderSchema = require("../models/file_model");
const dir = "uploads/";

exports.createFolder = async (req, res) => {
  let { path, name, email } = req.body;

  name = name.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, "");

  try {
    if (fs.existsSync(dir + path + name)) {
      return res.json({ message: "Folder exist!" });
    }

    const createFolder = fs.mkdirSync(dir + path + name);
    if (!fs.existsSync(dir + path + name)) {
      return res.json({ message: "Try again!" });
    }

    const storeFolder = await FolderSchema.create({
      folderName: name,
      folderPath: path,
      email: email
    });
    res.status(201).json({ message: "Folder successfully created" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFolder = async (req, res) => {
  
}
