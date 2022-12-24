const express = require('express');
const companyController = require('../controllers/company.controller');
const router = express.Router();

router
    .route('/searchbranchbyname/:cityname')
    .get(companyController.getCompanyBranchByCityName);

router
    .route('/searchbranchbypostcode/:postcode')
    .get(companyController.getCompanyBranchByPostcode);

module.exports = router;
