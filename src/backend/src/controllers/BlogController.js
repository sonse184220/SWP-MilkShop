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
        const image = req.file.buffer.toString("base64");

        const maxBlogId = await blogService.getMaxBlogId();
        if (!maxBlogId[0].maxId) {
            nextMaxId = "B001";
        } else {
            const nextNumericId = maxBlogId[0].maxId + 1;
            nextMaxId = `B${nextNumericId.toString().padStart(3, '0')}`;
        }

        const creatingBlog = await blogService.createBlog(nextMaxId, userId, title, image, content);
        if (creatingBlog.affectedRows === 0) {
            return res.status(500).send({ error: "Failed to create blog!" })
        }

        for (const productId of productList) {
            const checkProductExist = await productService.getProduct(productId);
            if (checkProductExist.length === 0) {
                return res.status(404).send({ error: `Product ${productId} not found!` })
            }

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

    async editBlog(req, res) {
        const blogId = req.params.id;
        const { title, content, productList } = req.body;
        const image = req.file ? req.file.buffer.toString("base64") : undefined;

        const checkBlog = await blogService.getBlog(blogId);
        if (checkBlog.length === 0) {
            return res.status(404).send({ error: `Blog not found!` })
        }

        const queryField = [];
        const valueField = [];

        if (title && title !== checkBlog[0].Title) {
            queryField.push("Title = ?")
            valueField.push(title)
        }
        if (content && content !== checkBlog[0].Content) {
            queryField.push("Content = ?")
            valueField.push(content)
        }
        if (image) {
            queryField.push("Image = ?")
            valueField.push(image)
        }

        if (queryField.length >  0) {
            const updatingBlog = await blogService.editBlog(blogId, queryField, valueField);
            if (updatingBlog.affectedRows === 0) {
                return res.status(500).send({ error: "Cant update blog!" })
            }
        }

        if (Array.isArray(productList) && productList.length > 0) {
            const checkBlogProductList = await productService.getBlogProductList(blogId);
            
            if (checkBlogProductList.length > 0) {
                const removingBlogProductList = await productService.deleteBlogProductList(blogId);
                if (removingBlogProductList.affectedRows === 0) {
                    return res.status(500).send({ error: `Failed to delete blog ${blogId}'s product list!` })
                }
            }

            for (const productId of productList) {
                const checkProductExist = await productService.getProduct(productId);
                if (checkProductExist.length === 0) {
                    return res.status(404).send({ error: `Product ${productId} not found!` })
                }
    
                const checkExistedProductInList = await productService.getProductInBlogProductList(blogId, productId);
                if(checkExistedProductInList.length === 0) {
                    const creatingBlogProducts = await productService.addProductToBlogProductList(blogId, productId);
                    if (creatingBlogProducts.affectedRows === 0) {
                        return res.status(500).send({ error: `Failed to add product ${productId} into product list for blog ${blogId}!` })
                    }
                }
            }
        }

        const updatedBlog = await blogService.getBlog(blogId);
        const blogProducts = await productService.getBlogProductList(blogId);
        res.status(200).send({
            blog: updatedBlog[0],
            blogProducts: blogProducts,
        });
    }

    async deleteBlog(req, res) {
        const blogId = req.params.id;

        const checkBlog = await blogService.getBlog(blogId);
        if (checkBlog.length === 0) {
            return res.status(404).send({ error: "Blog not found!" })
        }

        const checkProductList = await productService.getBlogProductList(blogId);
        if (checkProductList.length > 0) {
            const deletingBlogProductList = await productService.deleteBlogProductList(blogId);
            if (deletingBlogProductList.affectedRows === 0) {
                return res.status(500).send({ error: `Failed to delete blog ${blogId}'s product list!` })
            }
        }
        const deletingBlog = await blogService.deleteBlog(blogId);
        if (deletingBlog.affectedRows === 0) {
            return res.status(500).send({ error: `Failed to delete blog "${checkBlog[0].Title}" (${blogId})!` })
        }

        return res.status(200).send({ msg: `Successfully deleted blog '${checkBlog[0].Title}' (${blogId})!` })
    }

}
