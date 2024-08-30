const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    quota: {
        type: Number,
        require: true,
        default: 0
    },
    role: {
        type: String,
        enum: ['user', 'premium', 'admin'],
        default: 'user'
    }
}, {timestamps: true})

UserSchema.pre("save", async function (next) {
    const user = this

    try {
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password, salt)
        next()
    } catch(e) {
        return next(e)
    }
})

UserSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("users", UserSchema)