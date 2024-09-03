const express = require('express')
const { Register, Login, Profile, Contact, UpdateProfile, Payment, InitPayment, paymentCallback } = require('../controller/auth_controller')
const { Authenticate } = require('../middlewares/auth_middleware')
const authRoute = express.Router()

authRoute.post('/register', Register)

authRoute.post('/login', Login)

authRoute.get('/profile', Authenticate, Profile)

authRoute.post('/update-profile', Authenticate, UpdateProfile)

authRoute.post('/contact', Contact)

authRoute.post('/initialize-payment', InitPayment)

authRoute.post('/payment-callback', paymentCallback)



module.exports = authRoute