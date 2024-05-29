const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const resetPasswordRoutes = require('./src/routes/resetPasswordRoutes');
const brandRoutes = require('./src/routes/brandRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/product', productRoutes);
app.use('/reset-password', resetPasswordRoutes);
app.use('/brand', brandRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
