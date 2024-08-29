const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

app.use(express.json());
app.use(express.static('./public/'));

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB)
        console.log("✅ Mongo db successfully connected")

        await app.listen(3000, () => console.log('✅ Server start at 3000'))
    } catch(e) {
        console.error("❌ Server error:", e.message);
    }
})();