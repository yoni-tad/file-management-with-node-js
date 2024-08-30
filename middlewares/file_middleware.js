const multer = require("multer");
const Authenticate = require("./auth_middleware");
const UserSchema = require("../models/user_model");
const dir = "uploads/";

// FileUpload = async (req, res) => {
//   const email = req.body.email;

//   // const filePath = dir + email + path;
//   const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, dir);
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname);
//     },
//   });

//   const upload = multer({ storage: storage });

//   console.log("Email: " + email);
// };

// const filePath = dir + email + path
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const size = req.body.size;
    const path = req.body.path;
    const email = req.body.email;
    if (size > 524288000) {
      return;
    }

    cb(null, dir + email + path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const FileUpload = multer({ storage: storage });

module.exports = FileUpload;
