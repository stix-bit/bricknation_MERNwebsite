const User = require('../models/user');
const crypto = require('crypto')
const cloudinary = require('cloudinary')
const sendEmail = require('../utils/sendEmail')
const sendToken = require('../utils/jwtToken');

exports.registerUser = async (req, res, next) => {
    try {
      let avatar = {
        public_id: 'avatars/default',
        url: '/images/default_avatar.png'
      }
  
      if (req.body.avatar) {
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
          crop: 'scale'
        })
        avatar = {
          public_id: result.public_id,
          url: result.secure_url
        }
      }
  
      const { name, email, password } = req.body
      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required for normal registration'
        })
      }

      const user = await User.create({
        name,
        email,
        password,
        avatar
      })
  
      const token = user.getJwtToken()
      return res.status(201).json({ success: true, user, token })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

exports.firebaseLogin = async (req, res) => {
    const { idToken } = req.body

    if (!idToken) {
        return res.status(400).json({
            success: false,
            message: 'Firebase ID token is required'
        })
    }

    try {
        const firebaseAdmin = require('../config/firebaseAdmin')
        const decodedToken = await firebaseAdmin.auth.verifyIdToken(idToken)
        const email = decodedToken.email

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'This social account does not provide an email address'
            })
        }

        const provider = decodedToken.firebase?.sign_in_provider
        if (!['google.com', 'facebook.com'].includes(provider)) {
            return res.status(400).json({
                success: false,
                message: 'Only Google and Facebook accounts are supported'
            })
        }

        let user = await User.findOne({ email })
        const profile = {
            name: decodedToken.name || email.split('@')[0],
            firebaseUid: decodedToken.uid,
            authProvider: provider,
            ...(decodedToken.picture && {
                avatar: {
                    public_id: 'avatars/default',
                    url: decodedToken.picture
                }
            })
        }

        if (!user) {
            user = await User.create({
                email,
                ...profile
            })
        } else {
            user = await User.findByIdAndUpdate(user._id, profile, {
                new: true,
                runValidators: true
            })
        }

        return sendToken(user, 200, res)
    } catch (error) {
        console.error('Firebase login failed:', {
            code: error.code,
            message: error.message
        })

        return res.status(401).json({
            success: false,
            message: process.env.NODE_ENV === 'DEVELOPMENT'
                ? error.message
                : 'Invalid or expired Firebase token'
        })
    }
}

exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email & password' })
    }

    // Finding user in database

    let user = await User.findOne({ email }).select('+password')
    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' })
    }

    const now = Date.now()
    if (user.loginLockedUntil && user.loginLockedUntil.getTime() > now) {
        const secondsRemaining = Math.ceil((user.loginLockedUntil.getTime() - now) / 1000)
        return res.status(429).json({
            message: `Too many failed login attempts. Try again in ${secondsRemaining} seconds.`
        })
    }

    if (user.loginLockedUntil && user.loginLockedUntil.getTime() <= now) {
        user.failedLoginAttempts = 0
        user.loginLockedUntil = null
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        user.failedLoginAttempts += 1
        if (user.failedLoginAttempts >= 5) {
            user.loginLockedUntil = new Date(now + 60 * 1000)
            await user.save({ validateBeforeSave: false })
            return res.status(429).json({
                message: 'Too many failed login attempts. Login is temporarily locked for 1 minute.'
            })
        }
        await user.save({ validateBeforeSave: false })
        return res.status(401).json({
            message: `Invalid Email or Password. ${5 - user.failedLoginAttempts} attempts remaining.`
        })
    }

    user.failedLoginAttempts = 0
    user.loginLockedUntil = null
    await user.save({ validateBeforeSave: false })

    const token = user.getJwtToken();

    // res.status(201).json({
    //     success: true,
    //     token,
    //     user
    // });
    //  user = await User.findOne({ email })
    // sendToken(user, 200, res)

    user = await User.findOne({ email })
    sendToken(user, 200, res)
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })

    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:5173/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })

    }
}

exports.resetPassword = async (req, res, next) => {
    console.log(req.params.token)
    // Hash URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    console.log(user)

    if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has been expired' })

    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ message: 'Password does not match' })

    }

    // Setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = user.getJwtToken();
    return res.status(201).json({
        success: true,
        token,
        user
    });

}

exports.getUserProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id);
    console.log(user)

    return res.status(200).json({
        success: true,
        user
    })
}

exports.updateProfile = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Update avatar
    if (req.body.avatar !== '') {
        let user = await User.findById(req.user.id)
        // console.log(user)
        const image_id = user.avatar.public_id;
        if (user.avatar && user.avatar.public_id && user.avatar.public_id !== 'avatars/default') {
            await cloudinary.v2.uploader.destroy(user.avatar.public_id)
        }
        // console.log("Res", res)
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: "scale"
        })

        newUserData.avatar = {
            public_id: result.public_id,
            url: result.secure_url
        }
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    })
    if (!user) {
        return res.status(401).json({ message: 'User Not Updated' })
    }

    return res.status(200).json({
        success: true,
        user
    })
}

exports.updatePassword = async (req, res, next) => {
    console.log(req.body.password)
    const user = await User.findById(req.user.id).select('+password');
    // Check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword)
    if (!isMatched) {
        return res.status(400).json({ message: 'Old password is incorrect' })
    }
    user.password = req.body.password;
    await user.save();
    const token = user.getJwtToken();

    return res.status(201).json({
        success: true,
        user,
        token
    });

}

exports.allUsers = async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
}

exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(401).json({ message: `User does not found with id: ${req.params.id}` })
        // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    // Remove avatar from cloudinary
    const image_id = user.avatar.public_id;
    if (user.avatar && user.avatar.public_id && user.avatar.public_id !== 'avatars/default') {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    }
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({
        success: true,
    })
}

exports.getUserDetails = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(400).json({ message: `User does not found with id: ${req.params.id}` })
        // return next(new ErrorHandler(`User does not found with id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user
    })
}

exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        // useFindAndModify: false
    })

    return res.status(200).json({
        success: true
    })
}

exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    
    return res.status(200).json({
        success: true,
        message: 'Logged out'
    })
}