const jwt = require('jsonwebtoken');

const createLoginToken = (user, res) => {
    const token = jwt.sign(
        {
            // check id here
            id: user.ID,
            email: user.email,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: '24h',
        }
    );
    res.header('token', token);

    return token;
};

module.exports = { createLoginToken };
