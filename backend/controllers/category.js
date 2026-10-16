const Category = require('../models/category')

exports.getCategories = async (req, res) => {
    const categories = await Category.find().sort({ name: 1 })
    res.status(200).json({ success: true, categories })
}

exports.createCategory = async (req, res) => {
    const { name, subcategories = [] } = req.body
    const category = await Category.create({ name, subcategories })
    res.status(201).json({ success: true, category })
}

exports.updateCategory = async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name, subcategories: req.body.subcategories },
        { new: true, runValidators: true }
    )
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' })
    res.status(200).json({ success: true, category })
}

exports.deleteCategory = async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' })
    res.status(200).json({ success: true })
}
