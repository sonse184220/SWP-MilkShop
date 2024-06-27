import { poolConnect, connection } from "../utils/dbConnection.js";


export class ProductService {
    // Lấy thông tin của 1 product bằng ID
    async getProduct(id) {
        const [product] = await poolConnect.query(`SELECT p.*, b.Name AS BrandName
                                                FROM product AS p 
                                                JOIN brand AS b ON p.BrandID = b.BrandID
                                                WHERE ProductID = ?`, [id]);
        return product;
    }

    async getBlogProductList(blogId) {
        const [products] = await poolConnect.query(`SELECT b.Name AS BrandName, p.* 
                                                    FROM blog_products AS bp 
                                                    JOIN product AS p ON bp.ProductID = p.ProductID
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE BlogID = ?`, 
                                                    [blogId]);
        return products;
    }

    // tìm product trong database bằng name
    async searchProducts(name, limit, sortBy, offset) {
        const search = `%${name}%`;

        // const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        const [products] = await poolConnect.query(`SELECT p.*, b.Name AS BrandName
                                                    FROM PRODUCT AS p
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE p.Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, limit, offset]);
        return products;
    }

    // đếm số lượng product trong database bằng name
    async getTotalProductsByName(name) {
        const search = `%${name}%`;
        
        const [total] = await poolConnect.query('SELECT COUNT(*) as count FROM PRODUCT WHERE Name LIKE ?', [search]);
        const count = total[0].count;
        return count;
    } 

    // tìm product trong database bằng brand id
    async searchProductsByBrand(id, limit, sortBy, offset) {
        const [products] = await poolConnect.query(`SELECT p.*, b.Name AS BrandName 
                                                    FROM PRODUCT AS p
                                                    JOIN brand AS b ON p.BrandID = b.BrandID
                                                    WHERE p.BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [id, limit, offset]);
        return products;
    }

    // đếm số lượng product trong database bằng brand id
    async getTotalProductsByBrand(id) {
        const search = id;
        const [total] = await poolConnect.query(`SELECT COUNT(*) as count 
                                                                        FROM PRODUCT 
                                                                        WHERE BrandID = ?`, [search]);
                                                                  
        const count = total[0].count;
        return count;
    }

    // 
    getAllProducts = (callback) => {
        const query = 'SELECT * FROM PRODUCT';
        connection.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    };

    // lấy feedback bằng id của nó
    async getFeedback(id) {
        const [feedback] = await poolConnect.query("Select * FROM feedback WHERE FeedbackID = ?", [id]);
        return feedback;
    }

    // lấy feedbacks từ 1 product
    async getFeedbacksByProductID(id) {
        const [feedbacks] = await poolConnect.query(`Select f.*, m.Name
                                                    FROM feedback as f 
                                                    JOIN member as m
                                                    ON f.UserID = m.UserID
                                                    WHERE ProductID = ?`, [id]);
        return feedbacks;
    }

    // check xem người dùng đã từng mua sản phẩm này chưa? kể cả order và pre-order
    async checkHasUserPurchasedProduct(userId, productId) {
        const [result] = await poolConnect.query(`SELECT 
                                                EXISTS (
                                                    SELECT 1
                                                    FROM \`order\` AS o
                                                    JOIN order_details AS od ON o.OrderID = od.OrderID
                                                    WHERE o.UserID = ? AND o.Status = 'Done' AND od.ProductID = ?
                                                    LIMIT 1
                                                ) 
                                                OR 
                                                EXISTS (
                                                    SELECT 1
                                                    FROM pre_order
                                                    WHERE UserID = ? AND Status = 'Done'AND ProductID = ?
                                                    LIMIT 1
                                                ) AS result;`,
                                                [userId, productId, userId, productId]);
        return result;
    }
    
    // tạo feedback và lưu xuống database
    async createFeedback(productId, userId, rating, content) {
        const [feedback] = await poolConnect.query("INSERT INTO feedback (ProductID, UserID, Rating, Content) VALUES (?, ?, ?, ?)", [productId, userId, rating, content]);
        return feedback;
    }

    // xóa feedback khỏi database
    async removeFeedback(id) {
        const [result] = await poolConnect.query('DELETE FROM feedback WHERE FeedbackID = ?', [id]);
        return result;
    }

}
