const express = require('express')
const { Register, Login } = require('../controller/auth_controller')
const authRoute = express.Router()

authRoute.post('/register', Register)

authRoute.post('/login', Login)


module.exports = authRoute