import { Router } from "express";
import { checkProductSearch, checkProductId, checkProductSearchBrand } from "../middlewares/productValidators.js";
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
/** URL: localhost:xxxx/api/products/search/brand?brand={...}&limit={...}&page={...}&sort={...}
 * Search product bằng brand name, lấy data trong query của API
 * - "brand" là name của brand. Nếu không cung cấp "brand" => mặc định = "" để search toàn bộ
 * - "limit" là giới hạn số lượng product trả về cho 1 trang. Nếu không cung cấp, "limit" mặc định là 20
 * - "page" là số trang. Nếu không cung cấp, "page" mặc định là 1
 * - "sort" là cách sắp xếp. Nếu không cung cấp, "sort" mặc định là newest. "sort" bao gồm [newest, oldest, highest, lowest]
 */
router.get("/api/products/search/brand", checkProductSearchBrand, async (req, res) => {
    await productController.searchProductsByBrand(req, res);
});
// export router
export { router as productRoutes };
