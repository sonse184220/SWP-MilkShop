import { Router } from "express";

import { checkProductSearch, checkProductId, checkProductSearchBrand, checkFeedbackData, checkFeedbackId } from "../middlewares/productValidators.js";
import { ProductController } from "../controllers/ProductController.js";
import { getAuthRole, checkAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();
const productController = new ProductController();

/**
 * 
 */
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
router.get("/api/products/search", checkProductSearch, async (req, res) => {
    await productController.searchProducts(req, res);
});

/** URL: localhost:xxxx/api/products/search/brand?id={...}&limit={...}&page={...}&sort={...}
 * Search product bằng brand id, lấy data trong query của API
 * - "brand" là id của brand. Nếu không cung cấp "brand" => mặc định = "" và trả về not found
 * - "limit" là giới hạn số lượng product trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/products/search/brand", checkProductSearchBrand, async (req, res) => {
    await productController.searchProductsByBrandId(req, res);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** URL: localhost:xxxx/api/product/{...}/feedbacks
 * Lấy danh sách feedbacks của một product bằng product id
 * - {...} là product id
 */
router.get("/api/product/:id/feedbacks", checkProductId, async (req, res) => {
    await productController.getFeedbacks(req, res);
});

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
router.post("/api/product/:id/feedbacks", checkAuthenticated, getAuthRole, checkProductId, checkFeedbackData, async (req, res) => {
    await productController.createFeedback(req, res);

    // chưa xong, còn chờ xong order với pre order để đảm bảo chỉ được viết feedback khi đã mua hàng
});

/** URL: localhost:xxxx/api/product/feedbacks/{...}
 * xóa 1 feedback dựa vào feedbackId
 * - {...} là feedback id
 */
router.delete("/api/product/feedbacks/:id", checkAuthenticated, getAuthRole, checkFeedbackId, async (req, res) => {
    await productController.deleteFeedback(req, res); 
});



// export router
export { router as productRoutes };
