import { Request, Response } from 'express';
import { BlogService } from "../services/BlogService.js";

export class BlogController {
    private blogService: BlogService;

    constructor() {
        this.blogService = new BlogService();
    }


    async getBlogById(req: Request, res: Response) {
        const id = req.params.id; 
    
        const blog = await this.blogService.getBlog(id);
        if (blog.length === 0) {
            return res.status(404).send({error: "Blog not found!"});
        }
        res.status(200).send(blog);
    };

    async searchBlogs(req: Request, res: Response) {
        const name = req.query.name as string; 
        const limit = parseInt(req.query.limit as string);
        const page = parseInt(req.query.page as string);
        const sort = req.query.sort as string;
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
    
        const blogs = await this.blogService.searchBlogs(name, limit, sortBy, offset);
        const total = await this.blogService.getTotalBlogsByName(name);

        res.status(200).send({
            data: blogs,
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
        })
    };
}