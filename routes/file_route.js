const express = require("express");
const {
  createFolder,
  getFiles,
  uploadFile,
} = require("../controller/file_controller");
const fileRoute = express.Router();
const { Authenticate } = require("../middlewares/auth_middleware");
const FileUpload = require("../middlewares/file_middleware");

fileRoute.post("/get-folder", getFiles);

fileRoute.post("/upload-folder",  FileUpload.single('file'), uploadFile);

fileRoute.post("/create-folder", createFolder);

module.exports = fileRoute;
