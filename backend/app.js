const express = require('express');
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser')
const products = require('./routes/product');
const auth = require('./routes/auth');
const orders = require('./routes/order');
const categories = require('./routes/category');
const blueprints = require('./routes/blueprint');

// app.use(cors());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use('/api/v1', products);
app.use('/api/v1', auth);
app.use('/api/v1', orders);
app.use('/api/v1', categories);
app.use('/api/v1', blueprints);

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error)
    }

    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(validationError => validationError.message)
        return res.status(400).json({
            success: false,
            message: `Validation failed: ${messages.join('; ')}`
        })
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${error.path || 'identifier'}: ${error.value}`
        })
    }

    if (error.code === 11000) {
        const fields = Object.keys(error.keyPattern || {})
        return res.status(409).json({
            success: false,
            message: `A record with the same ${fields.join(', ') || 'unique value'} already exists`
        })
    }

    console.error(`${req.method} ${req.originalUrl}:`, error)
    return res.status(500).json({
        success: false,
        message: `Product update failed due to a server error: ${error.message || 'Unknown error'}`
    })
})

module.exports = app