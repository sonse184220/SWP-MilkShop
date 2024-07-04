import { poolConnect, connection } from "../utils/dbConnection.js";


export class BlogService {
    // Lấy thông tin của 1 blog bằng ID
    async getBlog(id) {
        const [blog] = await poolConnect.query(`SELECT u.Name, b.* 
                                                FROM blog as b 
                                                JOIN user as u ON b.UserID = u.UserID 
                                                WHERE BlogID = ?`, [id]);
        return blog;
    }

    // Lấy thông tin của toàn bộ blogs
    async getAllBlogs(limit, sortBy, offset) {
        const [blogs] = await poolConnect.query(`SELECT u.Name, b.* 
                                                FROM blog as b 
                                                JOIN user as u ON b.UserID = u.UserID 
                                                ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [limit, offset]);
        return blogs;
    }
    async getTotalBlogs() {
        const [total] = await poolConnect.query('SELECT COUNT(*) as count FROM BLOG');
        const count = total[0].count;
        return count;
    }

    // tìm blog trong database bằng name
    async searchBlogs(content, limit, sortBy, offset) {
        const search = `%${content}%`;

        const [blogs] = await poolConnect.query(`SELECT u.Name, b.* 
                                                FROM blog as b 
                                                JOIN user as u ON b.UserID = u.UserID 
                                                WHERE Title LIKE ? OR Content like ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, search, limit, offset]);
        return blogs;
    }

    // đếm số lượng blog trong database bằng name
    async getTotalBlogsByContent(name) {
        const search = `%${name}%`;
        
        const [total] = await poolConnect.query('SELECT COUNT(*) as count FROM BLOG WHERE Title LIKE ? OR Content like ?', [search, search]);
        const count = total[0].count;
        return count;
    }
}
