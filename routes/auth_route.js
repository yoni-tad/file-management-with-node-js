const express = require('express')
const { Register, Login, Profile, Contact, UpdateProfile, Payment } = require('../controller/auth_controller')
const { Authenticate } = require('../middlewares/auth_middleware')
const authRoute = express.Router()

authRoute.post('/register', Register)

authRoute.post('/login', Login)

authRoute.get('/profile', Authenticate, Profile)

authRoute.post('/update-profile', Authenticate, UpdateProfile)

authRoute.post('/contact', Contact)

authRoute.post('/payment', Payment)



module.exports = authRoute