import { connection } from '../utils/dbConnection.js';

export class CartService {
    addToCart = (data, user, callback) => {
        const { ProductID, CartQuantity } = data;
        if (!CartQuantity || CartQuantity <= 0) {
            return callback(new Error('Invalid CartQuantity'));
        }
        const UserID = user.userId;

        const query = 'SELECT * FROM CART WHERE UserID = ? AND ProductID = ?';
        connection.query(query, [UserID, ProductID], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                const updateQuery = 'UPDATE CART SET CartQuantity = CartQuantity + ? WHERE UserID = ? AND ProductID = ?';
                connection.query(updateQuery, [CartQuantity, UserID, ProductID], (err, result) => {
                    if (err) return callback(err);
                    callback(null, { message: 'Product quantity updated in cart' });
                });
            } else {
                const insertQuery = 'INSERT INTO CART (UserID, ProductID, CartQuantity) VALUES (?, ?, ?)';
                connection.query(insertQuery, [UserID, ProductID, CartQuantity], (err, result) => {
                    if (err) return callback(err);
                    callback(null, { message: 'Product added to cart' });
                });
            }
        });
    };

    removeFromCart = (data, user, callback) => {
        const { ProductID } = data;
        const UserID = user.userId;

        const query = 'DELETE FROM CART WHERE UserID = ? AND ProductID = ?';
        connection.query(query, [UserID, ProductID], (err, result) => {
            if (err) return callback(err);
            callback(null, { message: 'Product removed from cart' });
        });
    };

    updateCart = (data, user, callback) => {
        const { ProductID, CartQuantity } = data;
        const UserID = user.userId;

        const query = 'UPDATE CART SET CartQuantity = ? WHERE UserID = ? AND ProductID = ?';
        connection.query(query, [CartQuantity, UserID, ProductID], (err, result) => {
            if (err) return callback(err);
            callback(null, { message: 'Cart updated successfully' });
        });
    };

    viewCart = (user, callback) => {
        const UserID = user.userId;

        const query = 'SELECT CART.ProductID, CART.CartQuantity, PRODUCT.Name, PRODUCT.Price FROM CART JOIN PRODUCT ON CART.ProductID = PRODUCT.ProductID WHERE CART.UserID = ?';
        connection.query(query, [UserID], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    };
}
