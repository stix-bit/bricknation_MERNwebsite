const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product price cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },

    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please select category for this product']
    },
    seller: {
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

productSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product_id'
})

productSchema.set('toJSON', { virtuals: true })
productSchema.set('toObject', { virtuals: true })

productSchema.pre('findOneAndDelete', async function () {
    const productId = this.getQuery()._id
    const Review = require('./review')
    const Blueprint = require('./blueprint')

    await Promise.all([
        Review.deleteMany({ product_id: productId }),
        Blueprint.updateMany(
            { extracted_materials: productId },
            { $pull: { extracted_materials: productId } }
        )
    ])
})

module.exports = mongoose.model('Product', productSchema);