import { Router } from "express";

import { checkBlogId, checkBlogSearch } from "../middlewares/blogValidators.js";
import { BlogController } from "../controllers/BlogController.js";

const router = Router();
const blogController = new BlogController();

/** URL: localhost:xxxx/api/blogs/id/{...}
 * Lấy thông tin 1 blog bằng ID
 * - ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/api/blogs/id/:id", checkBlogId, async (req, res) => {
    await blogController.getBlogById(req, res);
});

/** URL: localhost:xxxx/api/blogs/search?n={...}
 * Search blog, lấy data trong query của API
 * - "n" là tên của blog. Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ blog
 */
router.get("/api/blogs/search", checkBlogSearch, async (req, res) => {
    await blogController.searchBlogs(req, res);
});



// export router
export { router as blogRoutes };
