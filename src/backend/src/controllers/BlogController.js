import { BlogService } from "../services/BlogService.js";
import { ProductService } from "../services/ProductService.js";

const blogService = new BlogService();
const productService = new ProductService();

export class BlogController {

    async getBlogById(req, res) {
        const id = req.params.id;
        const blog = await blogService.getBlog(id);
        if (blog.length === 0) {
            return res.status(404).send({ error: "Blog not found!" });
        }

        const blogProducts = await productService.getBlogProductList(id);

        res.status(200).send({
            blog: blog[0],
            blogProducts: blogProducts,
        });
    };

    async getAllBlogs(req, res) {
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

        const blogs = await blogService.getAllBlogs(limit, sortBy, offset);
        const total = await blogService.getTotalBlogs();
        res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: blogs,
        });
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

        const blogs = await blogService.searchBlogs(content, limit, sortBy, offset);
        const total = await blogService.getTotalBlogsByContent(content);
        
        res.status(200).send({
            total: total,
            page: page,
            totalPages: Math.ceil(total / limit),
            data: blogs,
        });
    };

}
