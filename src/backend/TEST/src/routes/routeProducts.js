import { Router } from "express";
import { checkSearchString } from "../middlewares/validator.js";
import { getProducts } from "../services/dbProducts.js";
const router = Router();
// search product bằng name, lấy data trong query của URL: /product/search?n={...string...}
router.get("/search", checkSearchString, async (req, res) => {
    const name = req.query.n;
    const products = await getProducts(name);
    res.status(200).send(products);
});
// export router
export default router;
