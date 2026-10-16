const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['Materials', 'Tools', 'Equipment', 'Design', 'Consumables', 'Electrical']
    },
    subcategories: {
        type: [String],
        default: []
    }
})

categorySchema.pre('findOneAndDelete', async function () {
    const categoryId = this.getQuery()._id
    const Product = require('./product')
    const Review = require('./review')
    const Blueprint = require('./blueprint')

    const products = await Product.find({ category_id: categoryId }).select('_id')
    const productIds = products.map(product => product._id)

    await Promise.all([
        Product.deleteMany({ category_id: categoryId }),
        Review.deleteMany({ product_id: { $in: productIds } }),
        Blueprint.updateMany(
            { extracted_materials: { $in: productIds } },
            { $pull: { extracted_materials: { $in: productIds } } }
        )
    ])
})

module.exports = mongoose.model('Category', categorySchema)
