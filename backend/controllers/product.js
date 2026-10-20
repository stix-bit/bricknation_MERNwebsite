const Product = require('../models/product')
const Order = require('../models/order')
const Category = require('../models/category')
const Review = require('../models/review')
const Blueprint = require('../models/blueprint')
const mongoose = require('mongoose')
const cloudinary = require('cloudinary')
const APIFeatures = require('../utils/apiFeatures')

async function resolveCategoryId(categoryId, categoryName) {
    if (categoryId) {
        return Category.findById(categoryId)
    }
    if (categoryName) {
        return Category.findOneAndUpdate(
            { name: categoryName },
            { $setOnInsert: { name: categoryName, subcategories: [] } },
            { new: true, upsert: true, runValidators: true }
        )
    }
    return null
}

exports.newProduct = async (req, res, next) => {
    let images = []
    // if (typeof req.files === 'string') {
    //     images.push(req.files)
    // } else {
    //     images = req.files
    // }

    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images || []
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        try {
            // const result = await cloudinary.v2.uploader.upload(images[i].path, {
            //     folder: 'products',
            //     width: 150,
            //     crop: "scale",
            // });

            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products',
                width: 150,
                crop: "scale",
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })

        } catch (error) {
            console.log(error)
        }

    }

    const category = await resolveCategoryId(req.body.category_id, req.body.category)
    if (!category) {
        return res.status(400).json({ success: false, message: 'Please select a valid category' })
    }

    const product = await Product.create({
        ...req.body,
        images: imagesLinks,
        category_id: category._id,
        category: undefined,
        user: undefined
    });

    if (!product)
        return res.status(400).json({
            success: false,
            message: 'Product not created'
        })


    return res.status(201).json({
        success: true,
        product
    })
}

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findOne({ _id: req.params.id, isArchived: { $ne: true } })
        .populate('category_id')
        .populate({ path: 'reviews', populate: { path: 'user_id', select: 'name avatar' } })
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }
    const productResponse = product.toObject()
    productResponse.reviews = productResponse.reviews.map(review => ({
        ...review,
        user: review.user_id?._id,
        name: review.user_id?.name,
        avatar: review.user_id?.avatar
    }))
    return res.status(200).json({
        success: true,
        product: productResponse
    })
}

exports.getProducts = async (req, res) => {

    const resPerPage = 4;
    const productsCount = await Product.countDocuments({ isArchived: { $ne: true } });

   // const products = await Product.find()
    const apiFeatures = new APIFeatures(Product.find({ isArchived: { $ne: true } }), req.query).search().filter()

    const filteredProductsCount = await Product.countDocuments(apiFeatures.query.getFilter());

    apiFeatures.query = apiFeatures.query.sort({ createdAt: -1 });
    apiFeatures.pagination(resPerPage);
    const products = await apiFeatures.query.populate('category_id');

    if (!products)
        return res.status(400).json({ message: 'error loading products' })
    return res.status(200).json({
        success: true,
        products,
        filteredProductsCount,
        resPerPage,
        productsCount,

    })
    // if (!products)
    //     return res.status(400).json({ message: 'error loading products' })

    // return res.status(200).json({
    //     success: true,
    //     products,
    //     resPerPage,
    //     productsCount,

    // })
}

exports.getAdminProducts = async (req, res, next) => {
    const products = await Product.find().populate('category_id');
    if (!products) {
        return res.status(404).json({
            success: false,
            message: 'Products not found'
        })
    }
    return res.status(200).json({
        success: true,
        products
    })
}

exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${req.params.id} was not found`
            })
        }

        const images = req.body.images
            ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images])
            : []
        let imagesLinks = product.images

        if (images.length > 0) {
            imagesLinks = []
            for (const image of images) {
                try {
                    const result = await cloudinary.v2.uploader.upload(image, {
                        folder: 'products',
                        width: 150,
                        crop: "scale",
                    })
                    imagesLinks.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    })
                } catch (error) {
                    return res.status(502).json({
                        success: false,
                        message: `Product image upload failed: ${error.message}`
                    })
                }
            }
        }

        const category = await resolveCategoryId(req.body.category_id, req.body.category)
        if (!category) {
            return res.status(400).json({
                success: false,
                message: 'Product update failed: provide a valid category name or category ID'
            })
        }

        product = await Product.findByIdAndUpdate(req.params.id, {
            ...req.body,
            images: imagesLinks,
            category_id: category._id,
            category: undefined,
            user: undefined
        }, {
            new: true,
            runValidators: true
        })

        return res.status(200).json({
            success: true,
            product
        })
    } catch (error) {
        return next(error)
    }
}

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'Product deleted'
    })
}

function getProductIds(req, res) {
    const { ids } = req.body || {}
    if (!Array.isArray(ids) || ids.length === 0 || ids.some(id => !mongoose.isValidObjectId(id))) {
        res.status(400).json({
            success: false,
            message: 'Please provide a non-empty array of valid product IDs'
        })
        return null
    }
    return [...new Set(ids.map(id => id.toString()))]
}

exports.bulkDeleteProducts = async (req, res, next) => {
    try {
        const ids = getProductIds(req, res)
        if (!ids) return

        await Promise.all([
            Review.deleteMany({ product_id: { $in: ids } }),
            Blueprint.updateMany(
                { extracted_materials: { $in: ids } },
                { $pull: { extracted_materials: { $in: ids } } }
            )
        ])
        const result = await Product.deleteMany({ _id: { $in: ids } })

        return res.status(200).json({
            success: true,
            deletedCount: result.deletedCount
        })
    } catch (error) {
        return next(error)
    }
}

exports.bulkArchiveProducts = async (req, res, next) => {
    try {
        const ids = getProductIds(req, res)
        if (!ids) return

        const result = await Product.updateMany(
            { _id: { $in: ids }, isArchived: { $ne: true } },
            { $set: { isArchived: true } }
        )

        return res.status(200).json({
            success: true,
            archivedCount: result.modifiedCount
        })
    } catch (error) {
        return next(error)
    }
}

exports.bulkUnarchiveProducts = async (req, res, next) => {
    try {
        const ids = getProductIds(req, res)
        if (!ids) return

        const result = await Product.updateMany(
            { _id: { $in: ids }, isArchived: true },
            { $set: { isArchived: false } }
        )

        return res.status(200).json({
            success: true,
            unarchivedCount: result.modifiedCount
        })
    } catch (error) {
        return next(error)
    }
}

exports.createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const numericRating = Number(rating)
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5 || !comment?.trim()) {
        return res.status(400).json({ success: false, message: 'Please provide a rating from 1 to 5 and a review' })
    }
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const hasPurchased = await Order.exists({
        user: req.user._id,
        orderStatus: 'Delivered',
        'orderItems.product': product._id
    })
    if (!hasPurchased) {
        return res.status(403).json({
            success: false,
            message: 'You can review a product only after purchasing and receiving it'
        })
    }

    await Review.findOneAndUpdate(
        { user_id: req.user._id, product_id: productId },
        { rating: numericRating, comment: comment.trim() },
        { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )
    const stats = await Review.aggregate([
        { $match: { product_id: product._id } },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    await Product.findByIdAndUpdate(productId, {
        ratings: stats[0]?.average || 0,
        numOfReviews: stats[0]?.count || 0
    })
    return res.status(200).json({
        success: true,
        message: 'Review saved successfully'
    })
}

exports.getMyProductReview = async (req, res, next) => {
    try {
        const product = await Product.findById(req.query.productId).select('_id')
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' })
        }

        const hasPurchased = await Order.exists({
            user: req.user._id,
            orderStatus: 'Delivered',
            'orderItems.product': product._id
        })
        if (!hasPurchased) {
            return res.status(200).json({ success: true, canReview: false, review: null })
        }

        const review = await Review.findOne({
            user_id: req.user._id,
            product_id: product._id
        })
        return res.status(200).json({
            success: true,
            canReview: true,
            review
        })
    } catch (error) {
        return next(error)
    }
}

exports.getProductReviews = async (req, res, next) => {
    const reviews = await Review.find({ product_id: req.query.id })
        .populate('user_id', 'name avatar')
        .sort({ createdAt: -1 })
    res.status(200).json({
        success: true,
        reviews: reviews.map(review => ({
            ...review.toObject(),
            user: review.user_id?._id,
            name: review.user_id?.name,
            avatar: review.user_id?.avatar
        }))
    })
}

exports.deleteReview = async (req, res, next) => {
    await Review.findByIdAndDelete(req.query.id)
    const stats = await Review.aggregate([
        { $match: { product_id: new mongoose.Types.ObjectId(req.query.productId) } },
        { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } }
    ])
    await Product.findByIdAndUpdate(req.query.productId, {
        ratings: stats[0]?.average || 0,
        numOfReviews: stats[0]?.count || 0
    })

    return res.status(200).json({
        success: true
    })
}

exports.productSales = async (req, res, next) => {
    // SELECT product.name,sum(price * quantity) as total
    // FROM order
    // GROUP BY product_id
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$itemsPrice" }

            },

        },
    ])
    // console.log(totalSales)
    const sales = await Order.aggregate([
        { $project: { _id: 0, "orderItems": 1, totalPrice: true } },
        { $unwind: "$orderItems" },

        {
            $group: {
                _id: { product: "$orderItems.name" },
                total: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } }
            },
        },
    ])
    console.log(sales)

    if (!totalSales) {
        return res.status(404).json({
            message: 'error sales'
        })

    }
    if (!sales) {
        return res.status(404).json({
            message: 'error sales'
        })

    }

    let totalPercentage = {}
    totalPercentage = sales.map(item => {

        // console.log( ((item.total/totalSales[0].total) * 100).toFixed(2))
        percent = Number(((item.total / totalSales[0].total) * 100).toFixed(2))
        total = {
            name: item._id.product,
            percent
        }
        return total
    })
    console.log(totalPercentage)
    res.status(200).json({
        success: true,
        totalPercentage,
        sales,
        totalSales
    })

}