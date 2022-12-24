const ApiError = require('../scripts/responses/api-error');
const ApiDataSuccess = require('../scripts/responses/api-data-success');
const httpStatus = require('http-status');
// const BaseService = require('../services/base.service');
const { createLoginToken } = require('../scripts/helpers/jwt.helper');
const sequelize = require('../scripts/helpers/sequelize.helper');
const { or } = require('sequelize');

const generateIdByGenderAndAge = (gender, age) => {
    let customerId = 0;

    if (gender === 'man') {
        if (age > 14) {
            customerId = 1;
        } else if (age > 6) {
            customerId = 2;
        } else if (age > 0.5) {
            customerId = 3;
        } else {
            customerId = 4;
        }
    } else if (gender === 'woman') {
        if (age > 14) {
            customerId = 5;
        } else if (age > 6) {
            customerId = 6;
        } else if (age > 0.5) {
            customerId = 7;
        } else {
            customerId = 8;
        }
    }

    return customerId;
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await sequelize.query(
        `SELECT ID, Password FROM shopapp.customer WHERE Email = '${email}';`
    );

    const validUser = user[0];

    if (validUser.length == 0) {
        return next(
            new ApiError(
                'Email or password is incorrect',
                httpStatus.BAD_REQUEST
            )
        );
    }

    const validPassword = validUser[0].Password === password;

    if (!validPassword) {
        return next(
            new ApiError(
                'Email or password is incorrect',
                httpStatus.BAD_REQUEST
            )
        );
    }

    const access_token = createLoginToken(user[0], res);

    ApiDataSuccess.send('Login succesfull', httpStatus.OK, res, access_token);
};

const register = async (req, res, next) => {
    const { name, password, email, age, gender, phoneNumber } = req.body;

    try {
        // const user = await BaseService.getOneByQuery(email);

        // if (user) {
        //     return next(
        //         new ApiError(
        //             'This email already exist!',
        //             httpStatus.BAD_REQUEST
        //         )
        //     );
        // }

        const userData = {
            Name: name,
            Password: password,
            PhoneNumber: phoneNumber,
            Age: age,
            Gender: gender,
            Email: email,
        };

        const generatedCustomerId = generateIdByGenderAndAge(
            userData.Gender,
            userData.Age
        );

        const createdUser = await sequelize.query(
            `INSERT INTO shopapp.customer 
            (Name, Password, Email, PhoneNumber, Age, Gender, CustomerType_ID)
            VALUES (
            '${userData.Name}',
            '${userData.Password}', 
            '${userData.Email}',
            '${userData.PhoneNumber}',
            ${userData.Age},
            '${userData.Gender}',
            ${generatedCustomerId});`
        );

        ApiDataSuccess.send(
            'User created succesfully!',
            httpStatus.CREATED,
            res,
            createdUser
        );
    } catch (error) {
        return next(new ApiError(error.message, httpStatus.NOT_FOUND));
    }
};

const getPastOrdersByCustomerId = async (req, res, next) => {
    const { customerId } = req.params;

    const intCustomerId = parseInt(customerId);
    try {
        const orderIdList = await sequelize.query(
            `SELECT Product_ID 
            FROM shopapp.order WHERE Customer_ID = ${intCustomerId};`
        );

        const validOrders = [];

        for (let index = 0; index < orderIdList[0].length; index++) {
            const order =
                await sequelize.query(`SELECT Name, ImageUrl,Price FROM 
                shopapp.product
             WHERE ID = ${orderIdList[0][index].Product_ID}; `);

            const validOrder = order[0][0];

            validOrders.push(validOrder);
        }

        if (validOrders.length === 0) {
            return next(
                new ApiError('There are no past orders!', httpStatus.NOT_FOUND)
            );
        }

        ApiDataSuccess.send(
            'Past orders fetched succesfully',
            httpStatus.OK,
            res,
            validOrders
        );
    } catch (error) {
        return next(
            new ApiError(error.message, httpStatus.INTERNAL_SERVER_ERROR)
        );
    }
};

module.exports = { login, register, getPastOrdersByCustomerId };
