const mongoose = require('mongoose')

const FileSchema  = mongoose.Schema({
    fileName: {
        type: String,
        require: true
    },
    filePath: {
        type: String,
        require: true
    },
    size: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model("File", FileSchema)