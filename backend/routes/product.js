const express = require('express');
const router = express.Router();
const upload = require("../utils/multer");

const {
    newProduct,
    getSingleProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
    bulkArchiveProducts,
    bulkUnarchiveProducts,
    getAdminProducts,
    getProductReviews,
    createProductReview,
    getMyProductReview,
    deleteReview,
    productSales
} = require('../controllers/product');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
// router.post('/admin/product/new', upload.array('images', 10), newProduct);
router.get('/product/:id', getSingleProduct)
router.get('/products', getProducts)
router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), upload.array('images', 10), updateProduct);
router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);
router.delete('/admin/products/bulk', isAuthenticatedUser, authorizeRoles('admin'), bulkDeleteProducts);
router.patch('/admin/products/bulk/archive', isAuthenticatedUser, authorizeRoles('admin'), bulkArchiveProducts);
router.patch('/admin/products/bulk/unarchive', isAuthenticatedUser, authorizeRoles('admin'), bulkUnarchiveProducts);
router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);
router.post('/admin/product/new', isAuthenticatedUser, upload.array('images', 10), newProduct);
router.put('/review', isAuthenticatedUser, createProductReview);
router.get('/review', isAuthenticatedUser, getMyProductReview);
router.get('/reviews', isAuthenticatedUser, getProductReviews)
router.delete('/reviews', isAuthenticatedUser, authorizeRoles('admin'), deleteReview)
router.get('/admin/product-sales', isAuthenticatedUser, authorizeRoles('admin'), productSales);

module.exports = router