const express = require('express');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.route('/login').post(userController.login);
router.route('/register').post(userController.register);
router
    .route('/pastorders/:customerId')
    .get(userController.getPastOrdersByCustomerId);

module.exports = router;
