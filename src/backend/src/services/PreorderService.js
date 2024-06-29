import { connection, poolConnect } from '../utils/dbConnection.js';

export class PreorderService {
    
    async createPreorder(uid, pid, quantity, totalPrice, paymentMethod, name, email, phone, address) {
        const [preorder] = await poolConnect.query(`INSERT INTO pre_order (UserID, ProductID, Quantity, TotalPrice, PaymentMethod, Name, Email, Phone, Address) 
                                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                    [uid, pid, quantity, totalPrice, paymentMethod, name, email, phone, address]);
        return preorder;
    }

    async getPreorder(id) {
        const [preorder] = await poolConnect.query(`SELECT po.*, p.Name as productName, p.Price as productPrice, p.brandId, b.Name as brandName
                                                    FROM pre_order AS po
                                                    JOIN product AS p ON po.ProductID = p.ProductID
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE PreorderID = ?`, [id]);
        return preorder;
    }

    async getAllPreorderHistory(limit, sortBy, offset) {
        const [preorders] = await poolConnect.query(`SELECT po.*, p.Name as productName, p.Price as productPrice, p.brandId, b.Name as brandName
                                                    FROM pre_order AS po
                                                    JOIN product AS p ON po.ProductID = p.ProductID
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [limit, offset]);
        return preorders;
    }

    async getTotalPreorderNumber() {
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count FROM pre_order`);
        const count = total[0].count;
        return count;
    }
}