import { connection, poolConnect } from '../utils/dbConnection.js';

export class CartService {
    async addToCart(data, user) {
        const { ProductID, CartQuantity } = data;
        if (!CartQuantity || CartQuantity <= 0) {
            throw new Error('Invalid CartQuantity');
        }
        const UserID = user.userId;

        const query = 'Select * FROM CART WHERE UserID = ? AND ProductID = ?';
        const [results] = await poolConnect.query(query, [UserID, ProductID]);

        if (results.length > 0) {
            const updateQuery = 'Update CART SET CartQuantity = CartQuantity + ? WHERE UserID = ? AND ProductID = ?';
            await poolConnect.query(updateQuery, [CartQuantity, UserID, ProductID]);
            return { message: 'Product quantity updated in cart' };
        } else {
            const insertQuery = 'Insert iNTO CART (UserID, ProductID, CartQuantity) VALUES (?, ?, ?)';
            await poolConnect.query(insertQuery, [UserID, ProductID, CartQuantity]);
            return { message: 'Product added to cart' };
        }
    }

    async removeFromCart(data, user) {
        const { ProductID } = data;
        const UserID = user.userId;

        const query = 'Delete FROM CART WHERE UserID = ? AND ProductID = ?';
        await poolConnect.query(query, [UserID, ProductID]);
        return { message: 'Product removed from cart' };
    }

    async updateCart(data, user) {
        const { ProductID, CartQuantity } = data;
        const UserID = user.userId;

        const query = 'Update CART SET CartQuantity = ? WHERE UserID = ? AND ProductID = ?';
        await poolConnect.query(query, [CartQuantity, UserID, ProductID]);
        return { message: 'Cart updated successfully' };
    }

    async viewCart(user) {
        const UserID = user.userId;

        const query = `Select CART.ProductID, CART.CartQuantity, PRODUCT.Name, PRODUCT.Price 
                       FROM CART JOIN PRODUCT ON CART.ProductID = PRODUCT.ProductID 
                       WHERE CART.UserID = ?`;
        const [results] = await poolConnect.query(query, [UserID]);
        return results;
    }
}
