const express = require('express')
const { Register, Login, Profile } = require('../controller/auth_controller')
const { Authenticate } = require('../middlewares/auth_middleware')
const authRoute = express.Router()

authRoute.post('/register', Register)

authRoute.post('/login', Login)

authRoute.get('/profile', Authenticate, Profile)



module.exports = authRoute