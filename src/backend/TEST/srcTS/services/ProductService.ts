import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { poolConnect } from "../utils/dbConnection.js";


export class ProductService {
    // Lấy thông tin của 1 product bằng ID 
    async getProduct(id: string) {
        const [product] = await poolConnect.query('SELECT * FROM product WHERE ProductID = ?', [id]);
        return product as QueryResult[];
    }

    // tìm product trong database bằng name
    async searchProducts(sname: string, slimit: number, ssortBy: string, soffset: number) {
        const search = `%${sname}%`;
        const limit =  slimit;
        const sortBy = ssortBy;
        const offset = soffset;

        // const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE Name LIKE ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
                                                    [search, limit, offset]
        );
        return products as QueryResult[];
    }

    // đếm số lượng product trong database bằng name
    async getTotalProductsByName(name: string) {
        const search = `%${name}%`;

        const [total]: [RowDataPacket[], any] = await poolConnect.query('SELECT COUNT(*) as count FROM PRODUCT WHERE Name LIKE ?', [search]);
        const count: number = total[0].count;

        return count;
    }

    // tìm product trong database bằng brand id
    async searchProductsByBrand(sid: string, slimit: number, ssortBy: string, soffset: number) {
        const id = sid;
        const limit =  slimit;
        const sortBy = ssortBy;
        const offset = soffset;

        // const [products] = await poolConnect.query(`SELECT * FROM PRODUCT WHERE BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
        //                                             [brand, limit, offset]
        // );

        const [products] = await poolConnect.query(`SELECT * 
                                                    FROM PRODUCT 
                                                    WHERE BrandID = ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`,
                                                    [id, limit, offset]
        );

        return products as QueryResult[]; 
    }

    // đếm số lượng product trong database bằng brand id
    async getTotalProductsByBrand(id: string) {
        const search = id;

        const [total]: [RowDataPacket[], any] = await poolConnect.query(`SELECT COUNT(*) as count 
                                                                        FROM PRODUCT 
                                                                        WHERE BrandID = ?`, [search]);
        const count: number = total[0].count;

        return count;
    }

    // lấy feedback bằng id của nó
    async getFeedback(id: string | number) {
        const [feedback]: [RowDataPacket[], any] = await poolConnect.query("Select * FROM feedback WHERE FeedbackID = ?",
                                                                            [id]
        );
        return feedback;
    }

    // lấy feedbacks từ 1 product
    async getFeedbacksByProductID(id: string) {
        const [feedbacks]: [RowDataPacket[], any] = await poolConnect.query("Select * FROM feedback WHERE ProductID = ?",
                                                                            [id]
        );
        return feedbacks;
    }

    // tạo feedback và lưu xuống database
    async createFeedback(productId: string, userId: string, rating: number, content: string) {
        const [feedback]: [ResultSetHeader, any] = await poolConnect.query("INSERT INTO feedback (ProductID, UserID, Rating, Content) VALUES (?, ?, ?, ?)",
                                                                            [productId, userId, rating, content]
        )
        return feedback;
    }
}