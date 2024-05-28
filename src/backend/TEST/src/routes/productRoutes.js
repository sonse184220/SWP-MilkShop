import { Router } from "express";
import { checkProductSearch, checkProductId } from "../middlewares/productValidators.js";
import { ProductController } from "../controllers/ProductController.js";
const router = Router();
const productController = new ProductController();
/** URL: localhost:xxxx/api/products/id/{...}
 * Lấy thông tin 1 product bằng ID
 * - ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 *
 */
router.get("/api/products/id/:id", checkProductId, async (req, res) => {
    await productController.getProductById(req, res);
});
/** URL: localhost:xxxx/api/products/search?n={...}
 * Search product, lấy data trong query của API
 * - "n" là tên của product. Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ product
 *
 */
router.get("/api/products/search", checkProductSearch, async (req, res) => {
    await productController.searchProducts(req, res);
});
// export router
export { router as productRoutes };
