const express = require('express')
const { generateEstimate } = require('../controllers/bob')

const router = express.Router()

router.post('/bob/chat', generateEstimate)

module.exports = router
