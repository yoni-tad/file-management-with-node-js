const multer = require("multer");
const Authenticate = require("./auth_middleware");
const dir = "uploads/";

FileUpload = async (req, res) => {
  const user = await Authenticate.user

  console.log(user)
}

// const filePath = dir + email + path
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, filePath);
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

module.exports = FileUpload