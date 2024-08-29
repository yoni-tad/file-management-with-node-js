const express = require('express')
const { createFolder } = require('../controller/file_controller')
const fileRoute = express.Router()

fileRoute.post('/get-folder', ) 

fileRoute.post('/create-folder', createFolder) 


module.exports = fileRoute