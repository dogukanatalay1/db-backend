const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const errorHandler = require('./middlewares/error-handler.middleware');
const loaders = require('./loaders');
const PORT = process.env.PORT || 5001;
const routes = require('./routes');

loaders();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('s.a');
});

app.use('/products', routes.products);
app.use('/users', routes.users);
app.use('/companies', routes.companies);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
