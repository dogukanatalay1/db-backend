const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();

router.route('/').get(productController.getProducts);
router.route('/:id').get(productController.getProduct);
router.route('/').post(productController.createProduct);
router.route('/:id').delete(productController.deleteProduct);
router.route('/:category').get(productController.getProductsByCategory);

module.exports = router;
