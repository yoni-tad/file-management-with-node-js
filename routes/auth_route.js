const express = require('express')
const { Register } = require('../controller/auth_controller')
const authRoute = express.Router()

authRoute.post('/register', Register)

module.exports = authRoute