const ApiError = require('../scripts/responses/api-error');
const ApiDataSuccess = require('../scripts/responses/api-data-success');
const httpStatus = require('http-status');
const BaseService = require('../services/base.service');
const { sequelize } = require('../loaders/db-connection.loader');

const getProducts = async (req, res, next) => {
    try {
        const products = await BaseService.getAll('product');

        if (!products) {
            return next(
                new ApiError(
                    'There have been an error!',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Products fetched succesfully!',
            httpStatus.OK,
            res,
            products
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        const product = BaseService.getOneById('product', id);

        if (!product) {
            return next(
                new ApiError(
                    'There have been an error!',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Product fetched succesfully!',
            httpStatus.OK,
            res,
            product
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getProductsByCategory = async (req, res, next) => {
    const { category } = req.params;

    try {
        const products = await sequelize.query(
            `SELECT * FROM shopapp.product,
            shopapp.productcategory 
            WHERE shopapp.productcategory.name = '${category}';
            `
        );

        const validProducts = products[0];

        if (!validProducts) {
            return next(
                new ApiError(
                    'There have been an error!',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            `${category} category products fetched succesfully!`,
            httpStatus.OK,
            res,
            validProducts
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const createProduct = async (req, res, next) => {
    const { price } = req.body;

    const productData = {
        Price: price,
    };

    try {
        const createdProduct = BaseService.create(productData);

        if (!createdProduct) {
            return next(
                new ApiError(
                    'Product could not be created!',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Product created succesfully!',
            httpStatus.CREATED,
            res,
            createdProduct
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedProduct = BaseService.deleteById(id);

        if (!deletedProduct) {
            return next(
                new ApiError(
                    'Product could not be deleted!',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Product deleted succesfully!',
            httpStatus.CREATED,
            res,
            deleteProduct
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getCategories = async (req, res, next) => {
    try {
        const categories = await BaseService.getAll('productcategory');

        const categoryList = categories[0];

        ApiDataSuccess.send(
            'Categories fetched succesfully!',
            httpStatus.OK,
            res,
            categoryList
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getProductsByCustomerType = async (req, res, next) => {
    const { customertype } = req.params;

    try {
        const products = await sequelize.query(
            `SELECT * FROM shopapp.product WHERE
            CustomerType_ID = ${customertype};`
        );

        const validProducts = products[0];

        if (validProducts.length == 0) {
            return next(
                new ApiError(
                    'There is no product with this customertype',
                    httpStatus.BAD_REQUEST
                )
            );
        }

        ApiDataSuccess.send(
            'Products by customertype fetched!',
            httpStatus.OK,
            res,
            validProducts
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    getProductsByCategory,
    getCategories,
    getProductsByCustomerType,
};
