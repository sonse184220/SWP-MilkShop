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

/** URL: localhost:xxxx/api/blogs
 * Lấy toàn bộ blog trong database
 */
router.get("/api/blogs", async (req, res) => {
    await blogController.getAllBlogs(req, res);
})

/** URL: localhost:xxxx/api/blogs/search?content={...}&limit={...}&page={...}&sort={...}
 * Search blog, lấy data trong query của API
 * - "content" là nội dung của blog, bao gồm tiêu đề và nội dung chi tiết. Nếu không cung cấp "content" => mặc định = "" để search toàn bộ
 * - "limit" là giới hạn số lượng blog trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest]
 */
router.get("/api/blogs/search", checkBlogSearch, async (req, res) => {
    await blogController.searchBlogs(req, res);
});



// export router
export { router as blogRoutes};