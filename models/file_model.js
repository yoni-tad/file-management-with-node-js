const mongoose = require('mongoose')

const FolderSchema = new mongoose.Schema({
    folderName: {
        type: String,
        require: true
    }, 
    folderPath: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    }
}, {timestamps: true})

module.exports = mongoose.model('FolderSchema', FolderSchema)