const { json } = require("express");
const fs = require("fs");
const FolderSchema = require("../models/file_model");
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
      email: email
    });
    res.status(201).json({ message: "Folder successfully created" });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFiles = async (req, res) => {
  const {path, email} = req.body

  try {
    const filePath = dir + email + path
    if(!fs.existsSync(filePath)){
      return res.json({ message: "Folder doesn't exist!" });
    }

    const fileList = fs.readdirSync(filePath)
    if(fileList == '') {
      return res.json({message: 'Empty folder'})
    }

    res.json(fileList)
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ message: "Server error" });
  }
}


exports.uploadFile = async (req, res) => {
  console.log("req file", req.file)
  console.log("req originalname", req.file.originalname)
  res.json({message: 'Successfully upload files'})
}
