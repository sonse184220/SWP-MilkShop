import { QueryResult } from "mysql2";
import { poolConnect } from "../utils/dbConnection.js";


export class BlogService {
    // Lấy thông tin của 1 blog bằng ID
    async getBlog(id: string) {
        const [blog] = await poolConnect.query('SELECT * FROM blog WHERE BlogID = ?', [id]);
        return blog as QueryResult[];
    }

    // tìm blog trong database bằng name
    async searchBlogs(name: string) {
        const search = `%${name}%`;
        const [blogs] = await poolConnect.query('SELECT * FROM blog WHERE Name LIKE ?', [search]);
        return blogs as QueryResult[];
    }
}