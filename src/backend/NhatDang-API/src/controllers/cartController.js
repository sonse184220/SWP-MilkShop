const connection = require('../utils/db');

const addToCart = (data, user, callback) => {
    const { ProductID, Quantity } = data;
    const UserID = user ? user.userId : null;

    if (UserID) {
        const query = 'INSERT INTO CART (UserID, ProductID, CartQuantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE CartQuantity = CartQuantity + ?';
        connection.query(query, [UserID, ProductID, Quantity, Quantity], callback);
    } else {
        callback(null, null); // Đây là phần xử lí Guest của FrontEnd
    }
};

const viewCart = (user, guestId, callback) => {
    const UserID = user ? user.userId : null;

    const query = UserID ? 'SELECT * FROM CART WHERE UserID = ?' : 'SELECT * FROM CART WHERE GuestID = ?';
    const id = UserID ? UserID : guestId;

    connection.query(query, [id], callback);
};

module.exports = {
    addToCart,
    viewCart,
};
