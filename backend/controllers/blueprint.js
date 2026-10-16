const Blueprint = require('../models/blueprint')

exports.createBlueprint = async (req, res) => {
    const blueprint = await Blueprint.create({
        user_id: req.user._id,
        image_url: req.body.image_url,
        extracted_materials: req.body.extracted_materials || []
    })
    res.status(201).json({ success: true, blueprint })
}

exports.getMyBlueprints = async (req, res) => {
    const blueprints = await Blueprint.find({ user_id: req.user._id })
        .populate('extracted_materials')
        .sort({ _id: -1 })
    res.status(200).json({ success: true, blueprints })
}

exports.getBlueprint = async (req, res) => {
    const blueprint = await Blueprint.findOne({
        _id: req.params.id,
        user_id: req.user._id
    }).populate('extracted_materials')
    if (!blueprint) return res.status(404).json({ success: false, message: 'Blueprint not found' })
    res.status(200).json({ success: true, blueprint })
}
