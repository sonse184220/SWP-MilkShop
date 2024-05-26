import { Router } from "express";

import { checkProductSearch } from "../middlewares/validators.js";
import { ProductService } from "../services/ProductService.js";

const router = Router();
const productService = new ProductService();

/* Search product, lấy data trong query của URL: api/product/search?n={...}
* Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ product
*/
router.get("/search", checkProductSearch, async (req, res) => {
    const name = req.query.n;

    const products = await productService.getProducts(name);
    res.status(200).send(products);
});



// export router
export { router as productsRouter };
