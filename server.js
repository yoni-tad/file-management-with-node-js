const express = require("express");
const mongoose = require("mongoose");
const fileRoute = require("./routes/file_route");
const authRoute = require("./routes/auth_route");
const cors = require("cors");
require("dotenv").config();

const app = express();
const coreOptions = {
  origin: "*",
  Credential: true,
  optionSuccessStatus: 200,
};

app.use(cors(coreOptions));
app.use(express.json());
app.use("/api/file", fileRoute);
app.use("/api/auth", authRoute);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public/"));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("✅ Mongo db successfully connected");

    await app.listen(3000, () => console.log("✅ Server start at 3000"));
  } catch (e) {
    console.error("❌ Server error:", e.message);
  }
})();
