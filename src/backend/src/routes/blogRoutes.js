import { Router } from "express";
import multer from "multer";

import { checkBlogData, checkBlogId, checkBlogSearch, checkBlogUpdateData, checkPaginationQueryForBlog, multerBlogFileErrorHandler } from "../middlewares/blogValidators.js";
import { BlogController } from "../controllers/BlogController.js";
import { checkAuthenticated } from "../middlewares/authMiddleware.js";
import { checkImageUpload, isStaff, isStaffOrAdmin } from "../middlewares/validationMiddleware.js";

const router = Router();
const upload = multer({ limits: { fileSize: 15 * 1024 * 1024 } });
const blogController = new BlogController();

/** URL: localhost:xxxx/api/blogs
 * Lấy toàn bộ blog trong database
 */
router.get("/api/blogs", checkPaginationQueryForBlog, async (req, res) => {
    await blogController.getAllBlogs(req, res);
});

/** URL: localhost:xxxx/api/blog/{...}
 * Lấy thông tin 1 blog bằng ID
 * - ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/api/blog/:id", checkBlogId, async (req, res) => {
    await blogController.getBlogById(req, res);
});

/** URL: localhost:xxxx/api/blogs/search?content={...}&limit={...}&page={...}&sort={...}
 * Search blog, lấy data trong query của API
 * - "content" là nội dung của blog, bao gồm tiêu đề và nội dung chi tiết. Nếu không cung cấp "content" => mặc định = "" để search toàn bộ
 * - "limit" là giới hạn số lượng blog trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest]
 */
router.get("/api/blogs/search", checkBlogSearch, checkPaginationQueryForBlog, async (req, res) => {
    await blogController.searchBlogs(req, res);
});

/** tạo 1 blog
 * 
 */
router.post("/api/blog/staff/create", checkAuthenticated, isStaff, upload.single("image"), checkBlogData, checkImageUpload, multerBlogFileErrorHandler, async (req, res) => {
    await blogController.createBlog(req, res);
})

router.patch("/api/blog/staff/:id", checkAuthenticated, isStaff, checkBlogId, upload.single("image"), checkBlogUpdateData, checkImageUpload, multerBlogFileErrorHandler, async (req, res) => {
    await blogController.editBlog(req, res);
})

router.delete("/api/blog/staff/:id", checkAuthenticated, isStaff, checkBlogId, async (req, res) => {
    await blogController.deleteBlog(req, res)
})


// export router
export { router as blogRoutes };
