import { poolConnect } from "../utils/dbConnection.js";
export class BlogService {
    // Lấy thông tin của 1 blog bằng ID
    async getBlog(id) {
        const [blog] = await poolConnect.query('SELECT * FROM blog WHERE BlogID = ?', [id]);
        return blog;
    }
    // Lấy thông tin của toàn bộ blogs
    async getAllBlogs() {
        const [blogs] = await poolConnect.query('SELECT * FROM blog');
        return blogs;
    }
    // tìm blog trong database bằng name
    async searchBlogs(sname, slimit, ssortBy, soffset) {
        const search = `%${sname}%`;
        const limit = slimit;
        const sortBy = ssortBy;
        const offset = soffset;
        // const [products] = await poolConnect.query('SELECT * FROM product WHERE Name LIKE ?', [search]);
        const [blogs] = await poolConnect.query(`SELECT * FROM BLOG WHERE Name LIKE ? OR Content like ? ORDER BY ${sortBy} LIMIT ? OFFSET ?`, [search, search, limit, offset]);
        return blogs;
    }
    // đếm số lượng blog trong database bằng name
    async getTotalBlogsByContent(name) {
        const search = `%${name}%`;
        const [total] = await poolConnect.query('SELECT COUNT(*) as count FROM BLOG WHERE Name LIKE ? OR Content like ?', [search, search]);
        const count = total[0].count;
        return count;
    }
}
