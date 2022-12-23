const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5001;

app.use(cors());

app.get('/', (req, res) => {
    res.send('s.a');
});

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});
