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
        const name = req.query.n as string;

        const blogs = await this.blogService.searchBlogs(name);
        if (blogs.length === 0) {
            return res.status(404).send({error: "Blogs not found!"});
        }
        res.status(200).send(blogs);
    };
}