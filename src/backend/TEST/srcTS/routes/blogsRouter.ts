import { Router } from "express";

const router = Router();


/* Search blog, lấy data trong query của URL: api/product/search?n={...}
* Nếu không cung cấp "n" => n mặc định = "" để search toàn bộ product
*/
router.get("/search", async (req, res) => {
    
})



// export router
export default router;