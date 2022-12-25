const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.route('/login').post(userController.login);
router.route('/register').post(userController.register);
router.route('/delete/:customerId').delete(userController.deleteUser);
router.route('/update-email/:customerId').post(userController.updateEmail);

router
    .route('/create-first-card/:customerId')
    .post(userController.createFirstCard);

router
    .route('/create-second-card/:customerId')
    .post(userController.createFirstCard);

router
    .route('/pastorders/:customerId')
    .get(userController.getPastOrdersByCustomerId);

router
    .route('/update-password/:customerId')
    .post(userController.updatePassword);

router
    .route('/create-first-address/:customerId')
    .post(userController.createAndAddFirstAdress);

router
    .route('/create-second-address/:customerId')
    .post(userController.createAndAddSecondAddress);

module.exports = router;
