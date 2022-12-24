const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

// product
router.route('/').get(productController.getProducts);
router.route('/:id').get(productController.getProduct);
router.route('/').post(productController.createProduct);
router.route('/:id').delete(productController.deleteProduct);

// category
router.route('/categories/getall').get(productController.getCategories);
router
    .route('/categories/getone/:category')
    .get(productController.getProductsByCategory);

router
    .route('/customertype/:customertype')
    .get(productController.getProductsByCustomerType);

module.exports = router;
