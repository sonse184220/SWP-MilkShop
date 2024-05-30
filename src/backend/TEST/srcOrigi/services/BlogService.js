import { poolConnect } from "../utils/dbConnection.js";


export class BlogService {
    // Lấy thông tin của 1 blog bằng ID
    async getBlog(id) {
        const [blog] = await poolConnect.query('SELECT * FROM blog WHERE BlogID = ?', [id]);
        return blog;
    }

    // tìm blog trong database bằng name
    async searchBlogs(name) {
        const search = `%${name}%`;
        const [blogs] = await poolConnect.query('SELECT * FROM blog WHERE Name LIKE ?', [search]);
        return blogs;
    }
}
