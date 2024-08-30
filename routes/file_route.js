const express = require("express");
const {
  createFolder,
  getFiles,
  uploadFile,
} = require("../controller/file_controller");
const fileRoute = express.Router();
const FileUpload = require('../middlewares/file_middleware')

fileRoute.post("/get-folder", getFiles);

fileRoute.post("/upload-folder", FileUpload, uploadFile);

fileRoute.post("/create-folder", createFolder);

module.exports = fileRoute;
