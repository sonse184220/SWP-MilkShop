import { Router } from "express";
import { BlogService } from "../services/BlogService.js";
import { checkBlogId, checkBlogSearch } from "../middlewares/blogValidators.js";
const router = Router();
const blogService = new BlogService();
/** URL: localhost:xxxx/api/blogs/id/{...}
 * Lấy thông tin 1 blog bằng ID
 * - ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/id/:id", checkBlogId, async (req, res) => {
    const id = req.params.id;
    const blog = await blogService.getBlog(id);
    if (blog.length === 0) {
        return res.status(404).send({ error: "Blog not found!" });
    }
    res.status(200).send(blog);
});
/** URL: localhost:xxxx/api/blogs/search?n={...}
 * Search blog, lấy data trong query của API
 * - "n" là tên của blog. Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ blog
 */
router.get("/search", checkBlogSearch, async (req, res) => {
    const name = req.query.n;
    const blogs = await blogService.searchBlogs(name);
    res.status(200).send(blogs);
});
// export router
export { router as blogRoutes };
