const mongoose = require('mongoose')

const blueprintSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image_url: {
        type: String,
        required: true,
        trim: true
    },
    extracted_materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }]
})

module.exports = mongoose.model('Blueprint', blueprintSchema)
