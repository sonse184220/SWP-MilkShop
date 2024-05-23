import { Router } from "express";

import { checkSearchString } from "../middlewares/validator.js";
import { getProducts } from "../services/dbProducts.js";

const router = Router();

// search product bằng name, lấy data trong query của URL: /product/searchByName?s={...string...}
router.get("/searchByName", checkSearchString, async (req, res) => {
    const name = req.query.s;
    
    const products = await getProducts(name);
    res.status(200).send(products);
});



// export router
export default router;
