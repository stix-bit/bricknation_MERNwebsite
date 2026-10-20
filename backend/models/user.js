const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    firebaseUid: {
        type: String,
        unique: true,
        sparse: true
    },
    authProvider: {
        type: String,
        enum: ['password', 'google.com', 'facebook.com'],
        default: 'password'
    },
    avatar: {
        public_id: {
            type: String,
            default: 'avatars/default'
        },
        url: {
            type: String,
            default: '/images/default_avatar.png'
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    loginLockedUntil: {
        type: Date,
        default: null
    }
})

userSchema.pre('findOneAndDelete', async function () {
    const userId = this.getQuery()._id
    const Review = require('./review')
    const Order = require('./order')
    const Blueprint = require('./blueprint')

    await Promise.all([
        Review.deleteMany({ user_id: userId }),
        Order.deleteMany({ user: userId }),
        Blueprint.deleteMany({ user_id: userId })
    ])
})

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    this.password = await bcrypt.hash(this.password, 10)
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    if (!this.password) {
        return false
    }

    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken

}

module.exports = mongoose.model('User', userSchema);