import { QueryResult, ResultSetHeader, RowDataPacket } from "mysql2";
import { poolConnect } from "../utils/dbConnection.js";


export class WishlistService{
    // lấy 1 dòng thông tin wishlist (memberId và productId)
    async getWishlistRecord(id: string, pid: string) {
        const [record]: [RowDataPacket[], any] = await poolConnect.query(`SELECT w.*, p.Name as productName, b.Name as brandName
                                                                        FROM wishlist as w 
                                                                        JOIN product as p 
                                                                        ON w.ProductID = p.ProductID 
                                                                        JOIN brand as b
                                                                        ON p.BrandID = b.BrandID
                                                                        WHERE w.UserID = ? AND w.ProductID = ?`
                                                                    , [id, pid]);
        return record;
    }

    // lấy cả danh sách wishlist bằng member ID
    async getWishlistByMemberID(id: string) {
        const [wishlist]: [RowDataPacket[], any] = await poolConnect.query(`SELECT w.*, p.Name, p.Price, p.Status, b.Name as brandName
                                                                            FROM wishlist as w 
                                                                            JOIN product as p 
                                                                            ON w.ProductID = p.ProductID 
                                                                            JOIN brand as b
                                                                            ON p.BrandID = b.BrandID
                                                                            WHERE w.UserID = ?`
                                                                        , [id]);
        return wishlist;
    }

    // thêm 1 product vô wishlist của 1 member
    async addToWishlist(id: string, pid: string) {
        const [record]: [ResultSetHeader, any] = await poolConnect.query("INSERT INTO wishlist (ProductID, UserID) VALUES (?, ?)",
                                                                        [pid, id]
                                                                    );
        return record;
    }

    // xóa 1 product khỏi wishlist của 1 member
    async removeFromWishlist(id: string, pid: string) {
        const [record]: [ResultSetHeader, any] = await poolConnect.query("DELETE FROM wishlist WHERE ProductID = ? AND UserID = ?",
                                                                        [pid, id]
                                                                    );
        return record;
    }

}