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
    };

    async getAllBlogs(req, res) {
        const blogs = await this.blogService.getAllBlogs();
        res.status(200).send(blogs);
    };

    async searchBlogs(req, res) {
        const content = req.query.content;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const sort = req.query.sort;
        const offset = (page - 1) * limit;

        let sortBy;
        switch (sort) {
            case "newest":
                sortBy = "updated DESC";
                break;
            case "oldest":
                sortBy = "updated ASC";
                break;
            default:
                sortBy = "updated DESC";
        }

        const blogs = await this.blogService.searchBlogs(content, limit, sortBy, offset);
        const total = await this.blogService.getTotalBlogsByContent(content);
        
        res.status(200).send({
            data: blogs,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
        });
    };

}
