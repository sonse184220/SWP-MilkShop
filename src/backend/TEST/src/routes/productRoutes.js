import { Router } from "express";
import { checkProductSearch, checkProductId } from "../middlewares/productValidators.js";
import { ProductService } from "../services/ProductService.js";
const router = Router();
const productService = new ProductService();
/** URL: localhost:xxxx/api/products/id/{...}
 * Lấy thông tin 1 product bằng ID
 * - ID không được phép để trống, phải cung cấp ít nhất 1 ID nếu không sẽ trả về lỗi
 */
router.get("/id/:id", checkProductId, async (req, res) => {
    const id = req.params.id;
    const product = await productService.getProduct(id);
    if (product.length === 0) {
        return res.status(404).send({ error: "Product not found!" });
    }
    res.status(200).send(product);
});
/** URL: localhost:xxxx/api/products/search?n={...}
 * Search product, lấy data trong query của API
 * - "n" là tên của product. Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ product
 */
router.get("/search", checkProductSearch, async (req, res) => {
    const name = req.query.n;
    const products = await productService.searchProducts(name);
    res.status(200).send(products);
});
// export router
export { router as productRoutes };
