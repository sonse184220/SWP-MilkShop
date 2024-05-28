import { BlogService } from "../services/BlogService.js";
export class BlogController {
    constructor() {
        this.blogService = new BlogService();
    }
    async getBlogById(req, res) {
        const id = req.params.id;
        const blog = await this.blogService.getBlog(id);
        if (blog.length === 0) {
            return res.status(404).send({ error: "Blog not found!" });
        }
        res.status(200).send(blog);
    }
    ;
    async searchBlogs(req, res) {
        const name = req.query.n;
        const blogs = await this.blogService.searchBlogs(name);
        if (blogs.length === 0) {
            return res.status(404).send({ error: "Blogs not found!" });
        }
        res.status(200).send(blogs);
    }
    ;
}
