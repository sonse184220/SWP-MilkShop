import { Router } from "express";

import { checkSearchString } from "../middlewares/validator.js";
import { getProducts } from "../services/dbProducts.js";

const router = Router();

/* Search product bằng name, lấy data trong query của URL: api/product/search?n={...}
* Để không: api/product/search | để search toàn bộ product
*/
router.get("/search", checkSearchString, async (req, res) => {
    const name = req.query.n;
    
    const products = await getProducts(name);
    res.status(200).send(products);
});



// export router
export default router;
