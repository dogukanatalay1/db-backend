const ApiError = require('../scripts/responses/api-error');
const ApiDataSuccess = require('../scripts/responses/api-data-success');
const httpStatus = require('http-status');
const BaseService = require('../services/base.service');

const products = [
    {
        ID: 1,
        Name: 'Sırt kaşıma aparatı',
        ImageUrl:
            'https://productimages.hepsiburada.net/s/2/1500/9576631664690.jpg',
        SaleAmount: 3,
        Score: 3,
        FavAmount: 3,
        ProductCategory_ID: 3,
        CustomerType_ID: 2,
    },
    {
        ID: 2,
        Name: ' Oto Kış Lastiği',
        ImageUrl:
            'https://productimages.hepsiburada.net/s/35/500/10483858604082.jpg',
        SaleAmount: 3,
        Score: 3,
        FavAmount: 3,
        ProductCategory_ID: 3,
        CustomerType_ID: 2,
    },
    {
        ID: 3,
        Name: 'Varol Lastikli Pamuk Çizgili Çift Kişilik Nevresim Takım-Beyaz',
        ImageUrl:
            // eslint-disable-next-line max-len
            'https://productimages.hepsiburada.net/s/312/1500/110000305305759.jpg',
        SaleAmount: 3,
        Score: 3,
        FavAmount: 3,
        ProductCategory_ID: 3,
        CustomerType_ID: 2,
    },
    {
        ID: 4,
        Name: 'Dp Daily Perfection Çörek Otu Yağı Tuzsuz Şampuan 500 ml',
        ImageUrl:
            // eslint-disable-next-line max-len
            'https://productimages.hepsiburada.net/s/289/1500/110000278254697.jpg',
        SaleAmount: 3,
        Score: 3,
        FavAmount: 3,
        ProductCategory_ID: 3,
        CustomerType_ID: 2,
    },
    {
        ID: 5,
        Name: 'ertbile emzik',
        ImageUrl:
            'https://productimages.hepsiburada.net/s/31/500/10323153911858.jpg',
        SaleAmount: 3,
        Score: 3,
        FavAmount: 3,
        ProductCategory_ID: 3,
        CustomerType_ID: 2,
    },
];

const getProducts = async (req, res, next) => {
    try {
        // const products = await BaseService.getAll();

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

    let idInt = parseInt(id);

    try {
        const product = products.find((product) => product.ID === idInt);

        console.log(product);

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
        const products = BaseService.getAllByQuery(category);

        if (!products) {
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
            products
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

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    getProductsByCategory,
};
