const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');


const app = express();
const port = 4500;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/product', productRoutes);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
