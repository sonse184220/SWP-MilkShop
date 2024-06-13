import { poolConnect, connection } from "../utils/dbConnection.js";


export class ProductService {
    // Lấy thông tin của 1 product bằng ID
    async getProduct(id) {
        const [product] = await poolConnect.query('SELECT * FROM product WHERE ProductID = ?', [id]);
        return product;
    }

    // tìm product trong database bằng name
    async searchProducts(sname, slimit, ssortBy, soffset) {
        const search = `%${sname}%`;
        const limit = slimit;
        const sortBy = ssortBy;
        const offset = soffset;

        // const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, limit, offset]);
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
    async searchProductsByBrand(sid, slimit, ssortBy, soffset) {
        const id = sid;
        const limit = slimit;
        const sortBy = ssortBy;
        const offset = soffset;

        const [products] = await poolConnect.query(`SELECT * 
                                                    FROM PRODUCT 
                                                    WHERE BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [id, limit, offset]);
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
