import sharp from "sharp";

import { BlogService } from "../services/BlogService.js";
import { ProductService } from "../services/ProductService.js";
import { poolConnect } from "../utils/dbConnection.js";

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

    async createBlog(req, res) {
        const { userId, title, content, productList } = req.body;
        let nextMaxId;
        const Image = req.file.buffer;

        const maxBlogId = await blogService.getMaxBlogId();
        if (!maxBlogId[0].maxId) {
            nextMaxId = "B001";
        } else {
            const nextNumericId = maxBlogId[0].maxId + 1;
            nextMaxId = `B${nextNumericId.toString().padStart(3, '0')}`;
        }

        const creatingBlog = await blogService.createBlog(nextMaxId, userId, title, Image, content);
        if (creatingBlog.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to create blog!" })
        }

        for (const productId of productList) {
            const checkExistedProductInList = await productService.getProductInBlogProductList(nextMaxId, productId);
            if(checkExistedProductInList.length === 0) {
                const creatingBlogProducts = await productService.addProductToBlogProductList(nextMaxId, productId);
                if (creatingBlogProducts.affectedRows === 0) {
                    return res.status(500).send({ error: `Failed to add product ${productId} into product list for blog ${nextMaxId}!` })
                }
            }
        }

        const blog = await blogService.getBlog(nextMaxId);
        const blogProducts = await productService.getBlogProductList(nextMaxId);

        res.status(200).send({
            blog: blog[0],
            blogProducts: blogProducts,
        });
    }

}
