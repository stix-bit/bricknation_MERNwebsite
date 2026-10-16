const express = require('express')
const router = express.Router()
const { createBlueprint, getMyBlueprints, getBlueprint } = require('../controllers/blueprint')
const { isAuthenticatedUser } = require('../middlewares/auth')

router.post('/blueprint', isAuthenticatedUser, createBlueprint)
router.get('/blueprints/me', isAuthenticatedUser, getMyBlueprints)
router.get('/blueprint/:id', isAuthenticatedUser, getBlueprint)

module.exports = router
