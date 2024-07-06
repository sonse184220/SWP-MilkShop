import { Router } from "express";
import multer from 'multer';
import { ProductController } from "../controllers/ProductController.js";
import { checkProductId, checkProductSearch, checkProductSearchBrand, checkFeedbackData, checkFeedbackId, checkProductData, checkFeedbackSearchInput } from "../middlewares/productValidators.js";
import { checkAuthenticated } from "../middlewares/authMiddleware.js";
import { isStaff } from "../middlewares/validationMiddleware.js";
import { checkPaginationQuery } from "../middlewares/utilsMiddleware.js";

const router = Router();
const productController = new ProductController();
const upload = multer();

router.get('/api/products', productController.getAllProducts);

/** URL: localhost:xxxx/api/product/{...}
 * Lấy thông tin 1 product bằng ID
 * - ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/api/product/:id", checkProductId, async (req, res) => {
    await productController.getProductById(req, res);
});

/** URL: localhost:xxxx/api/products/search?name={...}&limit={...}&page={...}&sort={...}
 * Search product, lấy data trong query của API
 * - "name" là tên của product. Nếu không cung cấp "name" => mặc định = "" để search toàn bộ product
 * - "limit" là giới hạn số lượng product trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/products/search", checkProductSearch, checkPaginationQuery, async (req, res) => {
    await productController.searchProducts(req, res);
});

/** URL: localhost:xxxx/api/products/search/brand?id={...}&limit={...}&page={...}&sort={...}
 * Search product bằng brand id, lấy data trong query của API
 * - "brand" là id của brand. Nếu không cung cấp "brand" => mặc định = "" và trả về not found
 * - "limit" là giới hạn số lượng product trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/products/search/brand", checkProductSearchBrand, checkPaginationQuery, async (req, res) => {
    await productController.searchProductsByBrandId(req, res);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** /api/product/feedbacks?content={...}&filter={...}&fuid={...}&fpid={...}&sort={...}&limit={...}&page={...}
 * Lấy danh sách tất cả feedbacks trong database
 * - "search" là nhập từ muốn tìm kiếm trong feedback, search mặc định là "" (trống không), để trống không đồng nghĩa lấy tất cả
 * - "filter" là lọc, nếu để trống thì sẽ không lọc, nếu có, có thể chọn giữa [user, product, user%26product]
 * - "fUid" là userId, nhập userId vô để lọc feedback theo user đó, chỉ hoạt động khi "filter" là "user" hoặc "user%26product"
 * - "fPid" là productId, nhập productId vô để lọc theo product đó, chỉ hoạt động khi "filter" là "product" hoặc "user%26product"
 * 
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 * - "limit" là giới hạn số lượng product trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 */
router.get("/api/product/feedbacks/search", checkFeedbackSearchInput, checkPaginationQuery, async (req, res) => {
    await productController.searchFeedbacks(req, res);
})

/** URL: localhost:xxxx/api/product/{...}/feedbacks
 * tạo 1 feedback cho một product bằng product id và lưu xuống database
 * - {...} là product id
 * file json gửi lên API phải có thông tin như sau:
 * - {
 *      "userId": "",
 *      "rating": "",
 *      "content": ""
 *   }
 * - cả 3 dòng đều không được để trống và rating chỉ có thể là từ 1 -> 5
 */
router.post("/api/product/:id/feedbacks", checkAuthenticated, checkProductId, checkFeedbackData, async (req, res) => {
    await productController.createFeedback(req, res);
});

/** URL: localhost:xxxx/api/product/feedbacks/{...}
 * xóa 1 feedback dựa vào feedbackId
 * - {...} là feedback id
 */
router.delete("/api/product/feedbacks/:id", checkAuthenticated, checkFeedbackId, async (req, res) => {
    await productController.deleteFeedback(req, res);
});

router.post("/api/product/create", checkAuthenticated, isStaff, upload.single('image'), (req, res, next) => {
    if (!req.file) {
        return res.status(400).send({ error: "No file uploaded" });
    }
    console.log("File received:", req.file);
    next();
}, checkProductData, async (req, res) => {
    await productController.createProduct(req, res);
});

router.put("/api/product/:id", checkAuthenticated, isStaff, checkProductId, upload.single('image'), async (req, res) => {
    await productController.updateProduct(req, res);
});

// export router
export { router as productRoutes };
