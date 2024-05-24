import { Router } from "express";
const router = Router();
// search product bằng name, lấy data trong query của URL: /product/search?n={...string...}
router.get("/search", async (req, res) => {
});
// export router
export default router;
