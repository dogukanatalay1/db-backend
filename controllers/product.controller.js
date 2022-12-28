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

const favoriteProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { customerId } = req.body;

    const intProductId = parseInt(productId);
    const intCustomerId = parseInt(customerId);

    try {
        const favoritedProduct = await sequelize.query(`
    INSERT INTO 'favorites' ('Customer_ID', 'Product_ID') 
    VALUES (${intCustomerId}, ${intProductId});
    `);

        const favAmount = await sequelize.query(`
    SELECT FavAmount FROM shopapp.product WHERE ID = ${productId};
    `);

        await sequelize.query(`
    UPDATE shopapp.product SET 
    FavAmount = 1+a  WHERE ID = ${favAmount};
    `);

        ApiDataSuccess.send(
            'Product added to favorites',
            httpStatus.OK,
            res,
            favoritedProduct[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const unfavoriteProduct = async (req, res, next) => {
    const { productId } = req.params;
    const { customerId } = req.body;

    const intProductId = parseInt(productId);
    const intCustomerId = parseInt(customerId);

    try {
        const unFavoritedProduct = await sequelize.query(`
        DELETE FROM favorites WHERE Customer_ID = 
        ${intCustomerId} and Product_ID = ${intProductId};
    `);

        ApiDataSuccess.send(
            'Product deleted from favorites',
            httpStatus.OK,
            res,
            unFavoritedProduct[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const addToBasket = async (req, res, next) => {
    const { productId } = req.params;
    const { customerId } = req.body;

    const intProductId = parseInt(productId);
    const intCustomerId = parseInt(customerId);

    try {
        const addedProduct = await sequelize.query(`
        INSERT INTO 'basket' ('Customer_ID', 'Product_ID')
        VALUES (${intProductId}, ${intCustomerId});
    `);

        ApiDataSuccess.send(
            'Product deleted from favorites',
            httpStatus.OK,
            res,
            addedProduct[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const removeFromBasket = async (req, res, next) => {
    const { productId } = req.params;
    const { customerId } = req.body;

    const intProductId = parseInt(productId);
    const intCustomerId = parseInt(customerId);

    try {
        const addedProduct = await sequelize.query(`
        DELETE FROM basket WHERE Customer_ID =
        ${intCustomerId} and Product_ID = ${intProductId};
    `);

        ApiDataSuccess.send(
            'Product deleted from favorites',
            httpStatus.OK,
            res,
            addedProduct[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const searchBySize = async (req, res, next) => {
    const { size } = req.params;

    try {
        const products = await sequelize.query(`
        SELECT * FROM shopapp.product WHERE Size = '${size}'
        `);

        ApiDataSuccess.send(
            'Successfully fetched!',
            httpStatus.OK,
            res,
            products[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const searchByColor = async (req, res, next) => {
    const { color } = req.params;

    try {
        const products = await sequelize.query(`
        SELECT * FROM shopapp.product WHERE Color = '${color}'
        `);

        ApiDataSuccess.send(
            'Successfully fetched!',
            httpStatus.OK,
            res,
            products[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const addComment = async (req, res, next) => {
    const { comment, score, customerId, productId, ImgUrl } = req.body;

    try {
        const commentRes = await sequelize.query(`
        INSERT INTO shopapp.productcomment 
        (Comment, Score, Customer_ID, Product_ID, ImgUrl)
        VALUES ('${comment}', ${score}, ${customerId}, 
        ${productId}, '${ImgUrl}');
        `);

        ApiDataSuccess.send(
            'Comment added!',
            httpStatus.CREATED,
            res,
            commentRes[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const updateComment = async (req, res, next) => {
    const { comment, score, customerId, productId } = req.body;

    try {
        const commentRes = await sequelize.query(`
        UPDATE shopapp.productcomment SET Comment = 
        '${comment}', Score = ${score} WHERE (ID = ${productId}) and 
        (Customer_ID = ${customerId}) and (Product_ID = ${productId});
        `);

        ApiDataSuccess.send(
            'Comment added!',
            httpStatus.CREATED,
            res,
            commentRes[0]
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const updateCustomerScore = async (req, res, next) => {
    const { customerId } = req.params;

    const intCustomerId = parseInt(customerId);

    try {
        const updatedCustomer = await sequelize.query(`
        UPDATE shopapp.customer SET Score = 5 + 
        (SELECT score ) WHERE (ID = ${intCustomerId}) ;
        `);

        ApiDataSuccess.send('Updated!', httpStatus.OK, res, updatedCustomer[0]);
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const createOrder = async (req, res, next) => {
    const { customerId, productId, addressId, date } = req.body;

    const intCustomerId = parseInt(customerId);
    const intProductId = parseInt(productId);
    const intAdressId = parseInt(addressId);

    try {
        const order = await sequelize.query(`
        INSERT INTO shopapp.order (Customer_ID, Product_ID,
        Adress_ID, Date) VALUES (${intCustomerId}, ${intProductId},
        ${intAdressId}, '${date}');
        `);

        let productCategoryID = await sequelize.query(
            `SELECT ProductCategory_ID FROM
             shopapp.product WHERE ID = ${productId};`
        );
        let sellAmount = await sequelize.query(`
        SELECT SaleAmount FROM shopapp.productcategory
        WHERE ID = ${productCategoryID}
       `);

        console.log('sellamount:', sellAmount);

        await sequelize.query(`
       UPDATE shopapp.productcategory SET
        SaleAmount = 1 + ${sellAmount}  WHERE ID =${productCategoryID};
       `);

        ApiDataSuccess.send('Updated!', httpStatus.OK, res, order[0]);
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const returnProduct = async (req, res, next) => {
    const { customerId, productId, date } = req.body;

    const intCustomerId = parseInt(customerId);
    const intProductId = parseInt(productId);

    try {
        const returned = await sequelize.query(`
        INSERT INTO shopapp.productreturn (Product_ID,
        Customer_ID, Date) VALUES (${intCustomerId}, 
        ${intProductId}, '${date}');
        `);

        ApiDataSuccess.send('Updated!', httpStatus.OK, res, returned[0]);
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getReturnedList = async (req, res, next) => {
    const { customerId } = req.body;

    const intId = parseInt(customerId);
    try {
        const returned = await sequelize.query(`
        SELECT * FROM shopapp.productreturn WHERE Customer_ID = ${intId};
        `);

        ApiDataSuccess.send('Fetched!', httpStatus.OK, res, returned[0]);
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getMostSoldProducts = async (req, res, next) => {
    const { customerId } = req.body;

    const intId = parseInt(customerId);
    try {
        const returned = await sequelize.query(`
        SELECT * FROM shopapp.product WHERE CustomerType_ID
        = ${intId} ORDER BY SaleAmount DESC
        `);

        ApiDataSuccess.send('Fetched!', httpStatus.OK, res, returned[0]);
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

const getSellAmountByGender = async (req, res, next) => {
    const { gender } = req.params;

    try {
        const amount = await sequelize.query(`
        SELECT SaleAmount FROM 
        shopapp.productcategory WHERE Gender = '${gender}';
        `);

        ApiDataSuccess.send('fetched!', httpStatus.OK, res, amount[0]);
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

app.put('/product/:id', async (req, res) => {
    const { id } = req.params;
    const price = req.body.price;

    try {
        const [results, metadata] = await sequelize.query(
            `
        UPDATE shopapp.product SET Price = :price WHERE ID = :id
      `,
            {
                replacements: { id, price },
            }
        );

        res.send(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/products/lowest-selling', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(`
        SELECT * FROM shopapp.product WHERE SaleAmount < 5 ORDER BY SaleAmount ASC
      `);

        res.send(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/customers/most-points', async (req, res) => {
    try {
        const [results, metadata] = await sequelize.query(`
        SELECT * FROM shopapp.customer WHERE Score > 2 ORDER BY Score DESC
      `);

        res.send(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/customer/:id', async (req, res) => {
    const { id } = req.params;
    const score = req.body.score;
    const customerTypeId = req.body.customerTypeId;

    try {
        const [results, metadata] = await sequelize.query(
            `
        UPDATE shopapp.customer SET Score = :score WHERE ID = :id AND CustomerType_ID = :customerTypeId
      `,
            {
                replacements: { id, score, customerTypeId },
            }
        );

        res.send(results);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.delete('/product/comment', async (req, res) => {
    const { id, customerId, productId } = req.body;

    try {
        const [results, metadata] = await sequelize.query(
            `
        DELETE FROM shopapp.productcomment WHERE ID = :id AND Customer_ID = :customerId AND Product_ID = :productId
      `,
            {
                replacements: { id, customerId, productId },
            }
        );

        res.send(results);
    } catch (error) {
        res.send();
    }
});

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    deleteProduct,
    getProductsByCategory,
    getCategories,
    getProductsByCustomerType,
    favoriteProduct,
    unfavoriteProduct,
    addToBasket,
    removeFromBasket,
    searchBySize,
    searchByColor,
    addComment,
    updateComment,
    updateCustomerScore,
    createOrder,
    returnProduct,
    getReturnedList,
    getMostSoldProducts,
    getSellAmountByGender,
    discount,
};
