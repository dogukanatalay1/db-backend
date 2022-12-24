const ApiError = require('../scripts/responses/api-error');
const ApiDataSuccess = require('../scripts/responses/api-data-success');
const httpStatus = require('http-status');
// const BaseService = require('../services/base.service');
const sequelize = require('../scripts/helpers/sequelize.helper');

const getCompanyBranchByCityName = async (req, res, next) => {
    const { cityname } = req.params;

    try {
        const companies = await sequelize.query(
            `SELECT name,Adress_ID FROM 
            shopapp.company WHERE 
            company.Adress_ID = 
            (SELECT adress.ID FROM shopapp.adress 
            WHERE adress.City = '${cityname}')  ;`
        );

        console.log(companies[0]);

        const validCompanies = companies[0];

        if (validCompanies.length === 0) {
            return next(
                new ApiError(
                    'There are no company branches by this name',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Branches succesfully fetched!',
            httpStatus.OK,
            res,
            validCompanies
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getCompanyBranchByPostcode = async (req, res, next) => {
    const { postcode } = req.params;
    const intPostCode = parseInt(postcode);

    try {
        const companies = await sequelize.query(
            `SELECT name,Adress_ID FROM 
            shopapp.company WHERE 
            company.Adress_ID = 
            (SELECT adress.ID FROM shopapp.adress 
             WHERE adress.PostCode = ${intPostCode});`
        );

        const validCompanies = companies[0];

        if (validCompanies.length === 0) {
            return next(
                new ApiError(
                    'There are no company branches by this postcode',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Branches succesfully fetched!',
            httpStatus.OK,
            res,
            validCompanies
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

module.exports = { getCompanyBranchByCityName, getCompanyBranchByPostcode };
