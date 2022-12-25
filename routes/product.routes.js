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

// favs
router
    .route('/favoriteproduct/:productId')
    .post(productController.favoriteProduct);

router
    .route('/unfavoriteproduct/:productId')
    .post(productController.unfavoriteProduct);

router
    .route('/update-customer-score/:customedId')
    .post(productController.updateCustomerScore);

router
    .route('/getsaleamount/:gender')
    .get(productController.getSellAmountByGender);

router.route('/addtobasket').post(productController.addToBasket);

router.route('/removefrombasket').post(productController.removeFromBasket);

router.route('/searchbysize/:size').get(productController.searchBySize);

router.route('/searchbysize/:color').get(productController.searchByColor);

router.route('/add-comment').post(productController.addComment);

router.route('/update-comment').post(productController.updateComment);

router.route('/create-order').post(productController.createOrder);

router.route('/return-product').post(productController.returnProduct);

router.route('/get-returned-list').get(productController.getReturnedList);

router.route('/get-most-sold').get(productController.getMostSoldProducts);

module.exports = router;
