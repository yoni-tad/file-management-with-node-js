const multer = require("multer");

exports const FileUpload = {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "upload/");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });

  const upload = multer({ storage: storage });
  upload.single("file")

  console.log("req file", req.file);
  res.json({ message: "Successfully uploaded single file" });
};
