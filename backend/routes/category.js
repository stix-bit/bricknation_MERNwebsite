const express = require('express')
const router = express.Router()
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/category')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.get('/categories', getCategories)
router.post('/admin/category', isAuthenticatedUser, authorizeRoles('admin'), createCategory)
router.put('/admin/category/:id', isAuthenticatedUser, authorizeRoles('admin'), updateCategory)
router.delete('/admin/category/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteCategory)

module.exports = router
