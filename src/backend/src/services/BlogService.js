import { poolConnect, connection } from "../utils/dbConnection.js";


export class BlogService {
    // Lấy thông tin của 1 blog bằng ID
    async getBlog(id) {
        const [blog] = await poolConnect.query(`SELECT u.Name AS Author, b.* 
                                                FROM blog as b 
                                                JOIN user as u ON b.UserID = u.UserID 
                                                WHERE BlogID = ?`, [id]);
        return blog;
    }

    // Lấy thông tin của toàn bộ blogs
    async getAllBlogs(limit, sortBy, offset) {
        const [blogs] = await poolConnect.query(`SELECT u.Name AS Author, b.* 
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

        const [blogs] = await poolConnect.query(`SELECT u.Name AS Author, b.* 
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

    async getMaxBlogId() {
        const [blogId] = await poolConnect.query("SELECT MAX(CAST(SUBSTR(BlogID, 2) AS UNSIGNED)) AS maxId FROM blog WHERE BlogID LIKE 'B%'");
        return blogId;
    }

    async createBlog(blogId, userId, title, image, content) {
        const [blog] = await poolConnect.query(`INSERT INTO blog (BlogID, UserID, Title, Image, Content)
                                                VALUES (?,?,?,?,?)`,[blogId, userId, title, image, content]);
        return blog;
    }

    async editBlog(blogId, updateQuery, updateValue) {
        const [updatedBlog] = await poolConnect.query(`UPDATE blog SET ${updateQuery.join(", ")} WHERE BlogID = ?`, [...updateValue, blogId]);
        return updatedBlog;
    }

    async deleteBlog(blogId) {
        const [result] = await poolConnect.query(`DELETE FROM blog WHERE BlogID = ?`, [blogId]);
        return result;
    }
}
