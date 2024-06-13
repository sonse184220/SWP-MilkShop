import { poolConnect } from "../utils/dbConnection.js";

export class WishlistService {

    // lấy 1 dòng thông tin wishlist (memberId và productId)
    async getWishlistRecord(id, pid) {
        const [record] = await poolConnect.query(`SELECT w.*, p.Name as productName, b.Name as brandName
                                                FROM wishlist as w 
                                                JOIN product as p 
                                                ON w.ProductID = p.ProductID 
                                                JOIN brand as b
                                                ON p.BrandID = b.BrandID
                                                WHERE w.UserID = ? AND w.ProductID = ?`, [id, pid]);
        return record;
    }

    // lấy cả danh sách wishlist bằng member ID
    async getWishlistByMemberID(id) {
        const [wishlist] = await poolConnect.query(`SELECT w.*, p.Name as productName, b.Name as brandName
                                                    FROM wishlist as w 
                                                    JOIN product as p 
                                                    ON w.ProductID = p.ProductID 
                                                    JOIN brand as b
                                                    ON p.BrandID = b.BrandID
                                                    WHERE w.UserID = ?`, [id]);
        return wishlist;
    }

    // thêm 1 product vô wishlist của 1 member
    async addToWishlist(id, pid) {
        const [record] = await poolConnect.query("INSERT INTO wishlist (ProductID, UserID) VALUES (?, ?)", [pid, id]);
        return record;
    }
}
